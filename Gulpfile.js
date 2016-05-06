var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

gulp.task('sass', function() {
    gulp.src('sass/**/*.scss')
        .pipe(sass({
                    indentedSyntax: true
                   }
                   ).on('error', sass.logError))
        .pipe(gulp.dest('./css/'))
        .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("sass/**/*.scss", ['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);
});


// //Watch task
// gulp.task('default', function() {
//     gulp.watch('sass/**/*.scss',['sass']);
// });