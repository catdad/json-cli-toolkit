var gulp = require('gulp');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var sequence = require('gulp-sequence');
var istanbul = require('gulp-istanbul');
var argv = require('yargs')
  .default('lint', true)
  .argv;

var source = (function () {
  var src = {};

  src.lib = ['toolkit.js', 'bin/**/*.js', 'lib/**/*.js'];
  src.test = ['test/**/*.js'];
  src.js = ['*.js'].concat(src.lib).concat(src.test);

  return src;
}());

gulp.task('lint', function () {
  if (!argv.lint) {
    return null;
  }

  return gulp.src(source.js)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('coverage-instrument', function () {
  return gulp.src(source.lib)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('coverage-report', function () {
  return gulp.src(source.test)
    .pipe(istanbul.writeReports());
});

gulp.task('mocha', function () {
  return gulp.src(source.test)
    .pipe(mocha());
});

gulp.task('coverage', sequence('coverage-instrument', 'mocha', 'coverage-report'));

gulp.task('test', sequence('lint', 'coverage'));
