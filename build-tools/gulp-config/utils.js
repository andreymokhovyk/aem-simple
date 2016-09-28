/* jshint node: true */

var fs = require('fs');

/**
 * Transform string to camelCase
 */
exports.camelCase = function camelCase(stringArray) {
    if (stringArray && stringArray.length) {
        var result = stringArray[0];

        for (var i = 1; i < stringArray.length; i++) {
            if (stringArray[i]) {
                result += stringArray[i].charAt(0).toUpperCase() + stringArray[i].substr(1);
            }
        }

        return result;
    } else {
        return '';
    }
};

/**
 * Get list of folders from directory
 * @returns {Array}
 */
exports.getFolders = function getFolders(directory) {
    return fs.readdirSync(directory)
        .filter(function(file) {
            return fs.statSync(directory + '/' + file).isDirectory();
        });
};

/**
 * Tet list of files by type from directory
 * @returns {Array}
 */
exports.getFiles = function getFiles(directory, type) {
    try {
        return fs.readdirSync(directory)
            .filter(function(file) {
                return file.indexOf('!') !== 0 && Boolean(file.match('.' + type + '$'));
            });
    } catch (error) {
        // console.log(error);
        return [];
    }
};
