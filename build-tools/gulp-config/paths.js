/* jshint node: true */
'use strict';

var path = require('path');

//var ROOT = path.join(__dirname, './../../src/main/content/jcr_root');
var ROOT = './../src/main/content/jcr_root';

var APPS = path.join(ROOT, 'apps/fossil-repair');
var ETC = path.join(ROOT, 'etc/design/fossil-repair');

var COMPONENTS = path.join(APPS, 'components');
var COMMON = path.join(ETC, 'common');
var ASSETS = path.join(ETC, 'assets');
var SCSS_COMMON = path.join(COMMON, 'scss/common');

var SPRITE = path.join(ASSETS, 'img/sprite');

module.exports = {
    APPS: APPS,
    ETC: ETC,
    COMPONENTS: COMPONENTS,
    COMMON: COMMON,
    SCSS_COMMON: SCSS_COMMON,
    SPRITE: {
        TARGET_IMAGE: SPRITE,
        TARGET_STYLE: path.join(COMMON, 'scss'),
        FILTER_IMAGES: '/**/img/sprite/icons*/*.png',
        FILTER_IMAGES_RETINA: '/**/img/sprite/icons-retina/*.png'
    }
};
