/* jshint node: true */

var gulp = require('gulp');
var runSequence = require('run-sequence').use(gulp);
var $ = require('gulp-load-plugins')(gulp);

require('./gulp-config/task-loader')(gulp, $, {
    pattern: 'gulp-tasks/**/*.js'
});

/**
 * Build all files (styles, sprites, templates, etc)
 */
gulp.task('build', function(done) {
    return runSequence(
        // Run at first dust and sprite in parallel
        ['dust:build', 'sprite:build'],
        // At second - globalStyles and componentsStyles in parallel
        'sass:build',
        // // At last - write css.txt and js.txt files
        // 'clientlibs:build',
        // And call callback to indicate finish
        done
    );
});

/**
 * Default task
 */
gulp.task('default', function() {
    //return runSequence('build', 'watch');
    return runSequence('build');
});
