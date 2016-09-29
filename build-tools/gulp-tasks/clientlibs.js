/* jshint node: true */

module.exports = function(gulp, $, options) {
    var fs = require('fs');
    var path = require('path');
    var glob = require('glob');
    var del = require('del');
    var _ = require('lodash');
    var merge = require('merge-stream');

    var paths = require('../gulp-config/paths');

    var base = [
        paths.COMPONENTS,
        paths.COMMON
    ];

    var baseClean = [
        paths.COMPONENTS,
        paths.COMMON
    ];

    gulp.task('clientlibs:clean', function() {
        var js = baseClean.map(function(folder) {
            return folder + '/**/js.txt';
        });
        var css = baseClean.map(function(folder) {
            return folder + '/**/css.txt';
        });

        return del(js.concat(css));
    });

    /**
     * Automatically create components js.txt and css.txt files
     */
    gulp.task('clientlibs:build', ['clientlibs:clean'], function() {
        var onWrite = function(error) {
            if (error) {
                console.log(error);
            }
        };

        var tasks = base.map(function(folder) {

            return gulp.src(folder + '/**/.content.xml')
                .pipe($.cached('clientlibs'))
                .pipe($.filter(function(file) {
                    var text;

                    if (file.isBuffer()) {
                        text = file.contents.toString();

                        return text.indexOf('cq:ClientLibraryFolder') !== -1;
                    }

                    return false;
                }))
                .pipe($.filter(function(file) {
                    var dir = path.dirname(file.path);
                    var types = ['js', 'css'];

                    types.forEach(function(type) {
                        var typeFile = dir + '/' + type + '.txt';
                        var foundFiles = glob.sync(dir + '/**/!(*.spec).' + type).map(function(file) {
                            return path.relative(dir, file).replace(/\\/g, '/');
                        });

                        fs.readFile(typeFile, function(err, data) {
                            var bufferedFiles;
                            var mergedFiles;

                            if (err) {
                                mergedFiles = foundFiles;
                            } else {
                                // Normalize line endings
                                data = data.toString().replace(/\r\n|\r|\n/g, '\n');
                                bufferedFiles = data.length ? _.compact(data.split('\n')) : [];
                                // Remove not existing files
                                bufferedFiles = _.intersection(bufferedFiles, foundFiles);

                                mergedFiles = _.union(bufferedFiles, foundFiles);
                            }

                            mergedFiles.push('');

                            fs.writeFile(typeFile, mergedFiles.join('\n'), onWrite);
                        });
                    });
                }));
        });

        return merge(tasks);
    });
};
