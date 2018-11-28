var gulp = require('gulp');
var watch = require('gulp-watch');
var concat = require('concat');
var prettier = require('gulp-prettier');

gulp.task('concat', function() {
    concat([
        'src/babe-errors.js',
        'src/babe-progress-bar.js',
        'src/babe-utils.js',
        'src/babe-canvas.js',
        'src/babe-submit.js',
        'src/babe-views.js',
        'src/babe-init.js'], 'babe.js');
    concat([
        'src/babe-errors.js',
        'src/babe-progress-bar.js',
        'src/babe-utils.js',
        'src/babe-canvas.js',
        'src/babe-submit.js',
        'src/babe-views.js',
        'src/babe-init.js',
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/csv-js/csv.js'], 'babe.full.js');
});

gulp.task('watch', function() {
    gulp.watch('src/*.js', ['concat']);
});

gulp.task('default', function() {
    gulp.start([
        'concat',
        'watch'
    ])
});