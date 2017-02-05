var gulp = require('gulp');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var sequence = require('gulp-sequence');
var istanbul = require('gulp-istanbul');
var gutil = require('gulp-util');
var argv = require('yargs')
  .default('lint', true)
  .default('coverage', true)
  .default('fast', false)
  .argv;

var source = (function () {
  var src = {};

  src.lib = ['toolkit.js', 'bin/**/*.js', 'lib/**/*.js'];
  src.test = ['test/**/*.js'];
  src.js = ['*.js'].concat(src.lib).concat(src.test);

  return src;
}());

// no clue if this is a good idea or not yet
var wrapped = (function (g) {
  function wrap(stream) {
    var eventualExitOnError = false;

    var pipe = stream.pipe.bind(stream);
    var emit = stream.emit.bind(stream);

    // wrap all streams at the time that they are piped in
    stream.pipe = function (destStream, opts) {
      return pipe(wrap(destStream), opts);
    };

    // overload emit function in case this stream is allowed
    // to ignore errors in the future
    stream.emit = function (name, err) {
      if (name !== 'error' || eventualExitOnError === false) {
        return emit.apply(null, arguments);
      }

      var logErr = new gutil.PluginError('wrapper', err);

      gutil.log(logErr.toString());

      // set the exit code, so that whenever the build
      // exits, it does so with an error
      process.exitCode = 1;

      // emit a regular end event, since an error is supposed
      // to end the stream
      return emit('end');
    };

    // when calling continue, we will allow this stream
    // to swallow errors, and instead set the exitCode
    // for when the build eventually exits
    stream.continue = function () {
      eventualExitOnError = true;

      return stream;
    };

    return stream;
  }

  var src = g.src.bind(g);

  g.src = function () {
    var stream = src.apply(null, arguments);

    return wrap(stream);
  };

  return g;
}(gulp));

gulp.task('lint', function () {
  if (!argv.lint) {
    return null;
  }

  return wrapped.src(source.js)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .continue();
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

  return wrapped.src(source.test)
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({
      thresholds: {
        global: 98,
        each: 90
      }
    }))
    .continue();
});

gulp.task('mocha', function () {
  return wrapped.src(source.test)
    .pipe(mocha())
    .continue();
});

gulp.task('coverage', sequence('coverage-instrument', 'mocha', 'coverage-report'));

gulp.task('test', sequence('lint', 'coverage'));
