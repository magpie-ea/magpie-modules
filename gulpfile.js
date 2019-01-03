var gulp = require('gulp');
var watch = require('gulp-watch');
var concat = require('concat');
var prettier = require('gulp-prettier');

// builds babe.js and babe.full.js
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
        'node_modules/lodash/lodash.js',
        'node_modules/csv-js/csv.js'], 'babe.full.js');
});

// watches for changes in the src/ folder
// runs prettify and concat on save
gulp.task('watch', function() {
    gulp.watch('src/*.js', [
            'prettify',
            'concat'
        ]);
});

// formats the files in src/ with gulp-prettier
// prettier settings: https://prettier.io/docs/en/options.html
gulp.task('prettify', function() {
  return gulp.src('src/*.js')
    .pipe(prettier({
        tabWidth: 4,
        arrowParens: 'always'
    }))
    .pipe(gulp.dest('src'))
});

gulp.task('default', function() {
    gulp.start([
        'concat',
        'watch'
    ])
});