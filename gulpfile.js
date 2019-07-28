var gulp = require('gulp');
var watch = require('gulp-watch');
var concat = require('concat');
var prettier = require('gulp-prettier');

// builds magpie.js and magpie.full.js
gulp.task('concat', function() {
    concat([
        'src/magpie-errors.js',
        'src/magpie-progress-bar.js',
        'src/magpie-utils.js',
        'src/magpie-canvas.js',
        'src/magpie-submit.js',
        'src/magpie-views.js',
        'src/magpie-init.js'], 'magpie.js');
    concat([
        'src/magpie-errors.js',
        'src/magpie-progress-bar.js',
        'src/magpie-utils.js',
        'src/magpie-canvas.js',
        'src/magpie-submit.js',
        'src/magpie-views.js',
        'src/magpie-init.js',
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/lodash/lodash.js',
        'node_modules/csv-js/csv.js'], 'magpie.full.js');
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