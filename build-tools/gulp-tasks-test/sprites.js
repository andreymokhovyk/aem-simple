/* jshint node: true */

module.exports = function(gulp, options, plugins) {
    var merge = require('merge-stream');
    var imagemin = require('gulp-imagemin');

    var paths = require('../gulp-config/paths');

    var base = [
        paths.COMPONENTS,
        paths.GLOBAL
    ];

    var map = paths.globMap.bind(this, base);

    /**
     * Clean sprite images & data
     * need for clean images with different names (hash)
     */
    gulp.task('sprite:clean', function() {
        return gulp.src(paths.SPRITE + '/icons*.png', {
            read: false
        })
            .pipe(plugins.clean());
    });

    /**
     * Compile sprite images & data (clean before compile)
     */
    gulp.task('sprite:compile', function() {
        var iconsOutDir = paths.SPRITE;
        var stylesOutDir = paths.COMMON + '/scss';
        var iconsUrl = '/' + iconsOutDir;

        var currentTimestamp = Date.now();

        var spriteOptions = {
            imgName: 'icons.png',
            imgPath: iconsUrl + '/icons.png?' + currentTimestamp,
            retinaSrcFilter: map(paths.SPRITE_RETINA_IMAGES),
            retinaImgName: 'icons-retina.png',
            retinaImgPath: iconsUrl + '/icons-retina.png?' + currentTimestamp,
            cssName: '_sprite.scss',
            cssVarMap: function(sprite) {
                if (sprite.image.indexOf('retina') > -1) {
                    sprite.name = 'retina-' + sprite.name;
                }
            },
            algorithm: 'binary-tree',
            algorithmOpts: {
                sort: false
            },
            padding: 5
        };

        var spriteData = gulp.src(map(paths.SPRITE_IMAGES))
            .pipe(plugins.spritesmith(spriteOptions));

        var imgStream = spriteData.img
            .pipe(imagemin())
            .pipe(gulp.dest(iconsOutDir));

        var cssStream = spriteData.css
            .pipe(gulp.dest(stylesOutDir));

        return merge(imgStream, cssStream);
    });

    gulp.task('sprite:build', ['sprite:clean', 'sprite:compile']);
};
