var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var pug = require('gulp-pug');
var puglint = require('gulp-pug-lint');
// var gulpPugBeautify = require('gulp-pug-beautify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');

function onError(err) {
    console.log(err);
}

gulp.task('lint', function() {
  return gulp.src('./js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(browserSync.stream());
});

gulp.task('compress', function() {
  return gulp.src('./js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./_serve/scripts/'));
});

gulp.task('pug', function buildHTML() {
  return gulp.src('pug/*.pug')
  .pipe(pug({
    // Your options in here.
  }))
  .pipe(gulp.dest('./_serve/'));
});

gulp.task('styles', function() {
    gulp.src('./sass/**/*.scss')
        .pipe(sass({
                    indentedSyntax: true
                   }
                   ).on('error', sass.logError))
        .pipe(gulp.dest('./_serve/css/'))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concat('sassy.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./_serve/css/'))
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(browserSync.stream());
});

gulp.task('pug:lint', function () {
  return gulp
    .src('pug/*.pug')
    .pipe(puglint())
    .pipe(gulp.dest('./_puglinted/'));

});

// gulp.task('pug:beautify', function () {
//   return gulp.src('pug/*.pug')
//     .pipe(gulpPugBeautify({ omit_empty: true }))
//     .pipe(gulp.dest('./_test/'));
// });

// gulp.task('serve', ['styles','jade', 'lint', 'compress'], function() {
gulp.task('serve', ['styles','pug', 'lint', 'compress'], function() {

    browserSync.init({
        server: "./_serve/",
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
    });

    gulp.watch("./sass/**/*.scss", ['styles']);
    gulp.watch("./pug/*.pug", ['pug']);
    gulp.watch("./_serve/scripts/*.js", ['lint','compress']);
    gulp.watch("./_serve/css/*.css").on('change', browserSync.reload);
    gulp.watch("./_serve/*.html").on('change', browserSync.reload);
});


// //Watch task
// gulp.task('default', function() {

// });