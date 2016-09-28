/* jshint node: true */

module.exports = function(gulp, options, plugins) {
    var path = require('path');
    var merge = require('merge-stream');
    var paths = require('../gulp-config/paths');
    var autoprefixerConfig = require('../gulp-config/autoprefixer');

    var base = [
        paths.COMPONENTS,
        paths.COMMON
    ];

    gulp.task('sass:clean', function() {
        var srcOptions = {
            read: false
        };

        var tasks = base.map(function(folder) {
            return gulp.src(folder + '/**/*.css', srcOptions)
                .pipe(plugins.clean());
        });

        return merge(tasks);

    });

    gulp.task('sass:compile', function() {
        var helperImport = function(file) {
            var dir = path.dirname(file.path);

            return '@import "' + path.relative(dir, paths.SCSS_HELPERS) + '";';
        };

        var fileToDest = function(file) {
            file.dirname = file.dirname.replace('scss', 'css');
        };

        var handleError = function(error) {
            console.log(error);

            this.emit('end');
        };

        var tasks = base.map(function(folder) {
            return gulp.src(folder + '/**/!(_*).scss')
                // Import scss helpers into each scss file (mixins, variables etc.)
                .pipe(plugins.cached('sass'))
                //.pipe(plugins.insert.prepend(helperImport))
                .pipe(plugins.sass())
                .on('error', handleError)
                .pipe(plugins.autoprefixer(autoprefixerConfig))
                .pipe(plugins.rename(fileToDest))
                .pipe(gulp.dest(folder));
        });

        return merge(tasks);
    });

    gulp.task('sass:build', ['sass:clean', 'sass:compile']);
};
