/* jshint node: true */

module.exports = function(gulp, $, options) {
    var path = require('path');
    var merge = require('merge-stream');

    var paths = require('../gulp-config/paths');
    var autoprefixerConfig = require('../gulp-config/autoprefixer');

    var base = [
        paths.COMPONENTS,
        paths.COMMON
    ];

    gulp.task('sass:clean', function() {
        var tasks = base.map(function(folder) {
            return gulp.src(folder + '/**/*.css', {read: false})
                .pipe($.clean({force: true}));
        });

        return merge(tasks);
    });

    gulp.task('sass:compile', function() {
        var helperImport = function(file) {
            var dir = path.dirname(file.path);

            return '@import "' + path.relative(dir, paths.SCSS_COMMON) + '";';
        };

        var fileToDest = function(file) {
            file.dirname = file.dirname.replace('scss', 'css');
        };

        var handleError = function(error) {
            console.log(error);

            this.emit('end');
        };

        var tasks = base.map(function(folder) {
            console.log(folder);

            return gulp.src(folder + '/**/!(_*).scss')
                // Import scss common into each scss file (mixins, variables etc.)
                .pipe($.cached('sass'))
                .pipe($.insert.prepend(helperImport))
                .pipe($.sass())
                .on('error', handleError)
                .pipe($.autoprefixer(autoprefixerConfig))
                .pipe($.rename(fileToDest))
                .pipe(gulp.dest(folder));
        });

        return merge(tasks);
    });

    gulp.task('sass:build', ['sass:clean', 'sass:compile']);
};
