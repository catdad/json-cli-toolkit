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
    opts.inc = _.isNaN(Number(opts.inc)) ? 1 : Number(opts.inc);
    opts.value += opts.inc;
  }

  if (_.isUndefined(attr) || _.isUndefined(val)) {
    return obj;
  }

  return _.set(obj, attr, val);
};
