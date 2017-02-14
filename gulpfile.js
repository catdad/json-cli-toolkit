var gulp = require('gulp');
var graceful = require('gulp-graceful-error');
var mocha = require('gulp-mocha');
var sequence = require('gulp-sequence');
var istanbul = require('gulp-istanbul');
var argv = require('yargs')
  .boolean('lint')
  .default('lint', true)
  .boolean('coverage')
  .default('coverage', true)
  .boolean('fast')
  .default('fast', false)
  .argv;

var eslint;
var nodeMajor = process.version.match(/v([0-9]+)\./);

nodeMajor = nodeMajor ? nodeMajor[1] : null;

if (nodeMajor >= 4) {
  // eslint-disable-next-line global-require
  eslint = require('gulp-eslint');
}

var source = (function () {
  var src = {};

  src.lib = ['toolkit.js', 'bin/**/*.js', 'lib/**/*.js'];
  src.test = ['test/**/*.js'];
  src.js = ['*.js'].concat(src.lib).concat(src.test);

  return src;
}());

gulp.task('lint', function () {
  if (!eslint) {
    // eslint-disable-next-line no-console
    console.log('lint task is not available in node', process.version);

    return null;
  }

  if (!argv.lint) {
    return null;
  }

  return gulp.src(source.js)
    .pipe(graceful())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .graceful(!argv.fast);
});

gulp.task('coverage-instrument', function () {
  if (!argv.coverage) {
    return null;
  }

  return gulp.src(source.lib)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('coverage-report', function () {
  if (!argv.coverage) {
    return null;
  }

  return gulp.src(source.test)
    .pipe(graceful())
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({
      thresholds: {
        global: 98,
        each: 90
      }
    }))
    .graceful(!argv.fast);
});

gulp.task('mocha', function () {
  return gulp.src(source.test)
    .pipe(graceful())
    .pipe(mocha())
    .graceful(!argv.fast);
});

gulp.task('coverage', sequence('coverage-instrument', 'mocha', 'coverage-report'));

gulp.task('test', sequence('lint', 'coverage'));
