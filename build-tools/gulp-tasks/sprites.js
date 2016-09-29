/* jshint node: true */

module.exports = function(gulp, $, options) {
    var merge = require('merge-stream');
    var buffer = require('vinyl-buffer');

    var paths = require('../gulp-config/paths');

    var base = [
        paths.COMPONENTS,
        paths.COMMON
    ];

    var getSourceMap = function(filter) {
        return base.map(function(folder) {
            return folder + filter;
        });
    };

    /**
     * Clean sprite images & data
     * need for clean images with different names (hash)
     */
    gulp.task('sprite:clean', function() {
        return gulp.src(paths.SPRITE.TARGET_IMAGE + '/icons*.png', {read: false})
            .pipe($.clean({force: true}));
    });

    /**
     * Compile sprite images & data
     */
    gulp.task('sprite:compile', function() {
        var currentTimestamp = Date.now();

        var spriteOptions = {
            imgName: 'icons.png',
            imgPath: paths.SPRITE.TARGET_IMAGE + '/icons.png?' + currentTimestamp,
            retinaSrcFilter: getSourceMap(paths.SPRITE.FILTER_IMAGES_RETINA),
            retinaImgName: 'icons-retina.png',
            retinaImgPath: paths.SPRITE.TARGET_IMAGE + '/icons-retina.png?' + currentTimestamp,
            cssName: '_sprite.scss',
            algorithm: 'binary-tree',
            algorithmOpts: {
                sort: false
            },
            padding: 4
        };

        var spriteData = gulp.src(getSourceMap(paths.SPRITE.FILTER_IMAGES))
            .pipe($.spritesmith(spriteOptions));

        var imgStream = spriteData.img
            .pipe(buffer())
            .pipe($.imagemin())
            .pipe(gulp.dest(paths.SPRITE.TARGET_IMAGE));

        var cssStream = spriteData.css
            .pipe(gulp.dest(paths.SPRITE.TARGET_STYLE));

        return merge(imgStream, cssStream);
    });

    gulp.task('sprite:build', ['sprite:clean', 'sprite:compile']);
};
