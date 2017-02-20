var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
  return gulp.src('src/sass/styles.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('src/'));
});

gulp.task('sass:watch', function () {
  return gulp.watch('src/sass/*.scss', ['sass']);
});

gulp.task('default', ['sass:watch']);
