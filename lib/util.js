/* jshint node: true */

var _ = require('lodash');
var through = require('through2');

var pretrim = require('./util/pretrim.js');

var utils = {
  pretrim: pretrim
};

function ignoreBadJson(data) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return e;
  }
}

function transform(opts) {
  return through.obj(function (data, enc, callback) {
    if (Buffer.isBuffer(data)) {
      data = data.toString();
    }

    _.forEach(utils, function (util, name) {
      if (opts[name] === true) {
        data = util(data);
      }
    });

    // order matters here, and ignoring bad json
    // should always be the last transform
    data = ignoreBadJson(data);

    if (data instanceof Error) {
      return opts.ignore === true ? callback() : callback(data);
    }

    return callback(null, data);
  });
}

module.exports = utils;

Object.defineProperty(module.exports, 'transform', {
  configurable: false,
  writable: false,
  value: transform
});
