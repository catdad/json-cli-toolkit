var _ = require('lodash');
var through = require('node-stream').through;

var COMMAND_STREAM_PROP = '_isCommandStream';

module.exports = function commandStream(dataFn, flush) {
  if (dataFn[COMMAND_STREAM_PROP] === true) {
    return dataFn;
  }

  return _.set(function (opts) {
    return through.obj(function OnTransform(data, enc, cb) {
      var out;

      try {
        out = dataFn(data, opts);
      } catch (e) {
        return cb(e);
      }

      return cb(null, out);
    }, function OnFlush(cb) {
      if (_.isFunction(flush)) {
        return flush.call(this, opts, cb);
      }

      cb();
    });
  }, COMMAND_STREAM_PROP, true);
};
