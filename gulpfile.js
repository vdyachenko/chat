const gulp        = require('gulp'),
      concat      = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
      uglify      = require('gulp-uglifyjs'); // Подключаем gulp-uglifyjs (для сжатия JS)

gulp.task('lib-minify', () => {
    return gulp.src([
        'public/js/libs/*.js'
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/js/minified'));
});