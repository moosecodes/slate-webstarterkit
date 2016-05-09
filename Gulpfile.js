var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var jade = require('gulp-jade');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('lint', function() {
  return gulp.src('./js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(browserSync.stream());
});

function onError(err) {
    console.log(err);
}

gulp.task('jade', function() {
  var YOUR_LOCALS = {};

  gulp.src('./jade/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest('./'))
});

gulp.task('styles', function() {
    gulp.src('./sass/**/*.scss')
        .pipe(sass({
                    indentedSyntax: true
                   }
                   ).on('error', sass.logError))
        .pipe(gulp.dest('./css/'))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concat('sassy.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('css'))
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', ['styles','jade'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("./sass/**/*.scss", ['styles']);
    gulp.watch("./jade/*.jade", ['jade']);
    gulp.watch("./js/*.js", ['lint']);
    gulp.watch("./*.html").on('change', browserSync.reload);
});


// //Watch task
// gulp.task('default', function() {
//     gulp.watch('sass/**/*.scss',['sass']);
// });