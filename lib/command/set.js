/* jshint node: true */

var _ = require('lodash');

function transformVal(val) {
  if (val === 'null') {
    return null;
  }

  return val;
}

module.exports = function set(obj, opts) {
  var attr = opts.attr;
  var val = transformVal(opts.value);

  if (!_.isUndefined(opts.inc)) {
    opts.inc = !_.isNaN(Number(opts.inc)) ? Number(opts.inc) : 1;
    opts.value += opts.inc;
  }

  if (attr === undefined || val === undefined) {
    return obj;
  }

  return _.set(obj, attr, val);
};
