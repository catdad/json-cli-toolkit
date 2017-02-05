var gulp = require('gulp');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');

var source = (function () {
  var src = {};

  src.lib = ['*.js', 'bin/**/*.js', 'lib/**/*.js'];
  src.test = ['test/**/*.js'];
  src.js = [].concat(src.lib).concat(src.test);

  return src;
}());

gulp.task('lint', function () {
  return gulp.src(source.js)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', function () {
  return gulp.src(source.test)
    .pipe(mocha());
});
