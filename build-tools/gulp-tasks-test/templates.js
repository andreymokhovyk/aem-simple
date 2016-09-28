/* jshint node: true */

module.exports = function(gulp, options, plugins) {
    var merge = require('merge-stream');
    var glob = require('glob');

    var paths = require('../paths');
    var utils = require('../utils');

    var base = glob.sync(paths.COMPONENTS + '/*/*/');

    gulp.task('dust:clean', function() {
        var srcOptions = {
            read: false
        };

        var tasks = base.map(function(folder) {
            return gulp.src(folder + '/**/dust-templates.js', srcOptions)
                .pipe(plugins.clean());
        });

        return merge(tasks);
    });

    gulp.task('dust:compile', function() {
        var handleError = function(error) {
            console.log(error);

            this.emit('end');
        };

        var tasks = base.map(function(folder) {
            return gulp.src(folder + '/**/*.dust')
                .pipe(plugins.cached('dust'))
                .pipe(plugins.dust({
                    name: function(file) {
                        var partOfName = file.relative.replace('.dust', '').split(/[_-]/);

                        partOfName.splice(0, 1);

                        return utils.camelCase(partOfName);
                    }
                }))
                .on('error', handleError)
                .pipe(plugins.concat('dust-templates.js'))
                .pipe(gulp.dest(folder + '/clientlibs/js/'));
        });

        return merge(tasks);
    });

    gulp.task('dust:build', ['dust:clean', 'dust:compile']);
};

