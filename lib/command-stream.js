var _ = require('lodash');
var through = require('node-stream').through;

module.exports = function commandStream(dataFn, flush) {
  // eslint-disable-next-line no-underscore-dangle
  if (dataFn._isCommandStream === true) {
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
  }, '_isCommandStream', true);
};
