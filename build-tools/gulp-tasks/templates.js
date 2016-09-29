/* jshint node: true */

module.exports = function(gulp, $, options) {
    var merge = require('merge-stream');
    var glob = require('glob');

    var paths = require('../gulp-config/paths');
    var utils = require('../gulp-config/utils');

    var base = glob.sync(paths.COMPONENTS + '/*/*/');

    gulp.task('dust:clean', function() {
        var tasks = base.map(function(folder) {
            return gulp.src(folder + '/**/dust-templates.js', {read: false})
                .pipe($.clean({force: true}));
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
                .pipe($.cached('dust'))
                .pipe($.dust({
                    name: function(file) {
                        var partOfName = file.relative.replace('.dust', '').split(/[_-]/);

                        partOfName.splice(0, 1);

                        return utils.camelCase(partOfName);
                    }
                }))
                .on('error', handleError)
                .pipe($.concat('dust-templates.js'))
                .pipe(gulp.dest(folder + '/clientlibs/js/'));
        });

        return merge(tasks);
    });

    gulp.task('dust:build', ['dust:clean', 'dust:compile']);
};

