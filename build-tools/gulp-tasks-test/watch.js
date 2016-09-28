/* jshint node: true */

module.exports = function(gulp, options, plugins) {
    var path = require('path');
    var runSequence = require('run-sequence').use(gulp);

    var paths = require('../paths');

    var base = [
        paths.APPS,
        paths.ETC
    ];

    var globMap = function(base, glob) {
        return base.map(function(folder) {
            return folder + glob;
        });
    };

    var map = globMap.bind(this, base);

    var cleanCache = function(name, file, filter) {
        var cache = plugins.cached.caches[name] || {};

        if (typeof filter !== 'function') {
            filter = function(srcFile) {
                return function(cacheFile) {
                    return cacheFile === srcFile;
                };
            };
        }

        Object.keys(cache)
            .filter(filter(file.path))
            .forEach(function(cacheFile) {
                delete cache[cacheFile];
            });
    };

    var sameAsSrcDirFilter = function(srcFile) {
        var srcDir = path.dirname(srcFile);

        return function(cacheFile) {
            return cacheFile.indexOf(srcDir) !== -1;
        };
    };

    var sameAsCacheDirFilter = function(srcFile) {
        var srcDir = path.dirname(srcFile);

        return function(cacheFile) {
            var cacheFileDir = path.dirname(cacheFile);

            return srcDir.indexOf(cacheFileDir) !== -1;
        };
    };

    /**
     * Watch for files changes and run appropriate task
     */
    gulp.task('watch', function() {
        plugins.watch(map('/**/*.dust'), function(file) {
            cleanCache('dust', file, sameAsSrcDirFilter);

            gulp.start(['dust:compile']);
        });

        plugins.watch(map(paths.SPRITE_IMAGES), function() {
            gulp.start(['sprite:compile']);
        });

        plugins.watch(map('/**/*.scss'), function(file) {
            cleanCache('sass', file, sameAsSrcDirFilter);

            gulp.start(['sass:compile']);
        });

        plugins.watch(map('/**/*.{js,css}'), {
            events: ['add', 'unlink']
        }, function(file) {
            cleanCache('clientlibs', file, sameAsCacheDirFilter);

            gulp.start(['clientlibs:build']);
        });
    });

    /**
     * Watch for files changes and uploads it into cq
     */
    gulp.task('pipe', function() {
        process.env.DEBUG = 'app:log,app:error,crxde:*' + (process.env.DEBUG ? ',' + process.env.DEBUG : '');

        require('crxde-pipe').pipe(path.join(paths.VIEW_ROOT, 'src'), {
            server: {
                port: options.cqPort || 4502
            }
        });
    });

    gulp.task('pipe+watch', function(cb) {
        return runSequence('build', ['watch', 'pipe'], cb);
    });
};
