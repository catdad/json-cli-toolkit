var gulp = require('gulp');
var eslint = require('gulp-eslint');

var source = {
    js: ['*.js', 'bin/**/*.js', 'lib/**/*.js', 'test/**/*.js']
};

gulp.task('lint', function () {
    return gulp.src(source.js)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
