/* eslint-disable no-param-reassign */

var gutil = require('gulp-util');

var PLUGIN_NAME = 'graceful-gulp';

// no clue if this is a good idea or not yet
module.exports = function (gulp) {
  function wrap(stream) {
    var gracefulError = false;

    var pipe = stream.pipe.bind(stream);
    var emit = stream.emit.bind(stream);

    // wrap all streams at the time that they are piped in
    stream.pipe = function (destStream, opts) {
      return pipe(wrap(destStream), opts);
    };

    // overload emit function in case this stream is allowed
    // to ignore errors in the future
    stream.emit = function (name, err) {
      if (name !== 'error' || gracefulError === false) {
        return emit.apply(null, arguments);
      }

      // wrap the original error... because?
      var logErr = new gutil.PluginError(PLUGIN_NAME, err);
      // log that this error happened
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
    stream.graceful = function (val) {
      gracefulError = typeof val === 'boolean' ? val : true;

      return stream;
    };

    return stream;
  }

  // this is where gulp builds start, so wrap the
  // resulting stream, allowing all streams in the
  // pipeline to be wrapped as well
  gulp.src = (function (src) {
    return function () {
      var stream = src.apply(null, arguments);

      return wrap(stream);
    };
  }(gulp.src.bind(gulp)));

  return gulp;
};
