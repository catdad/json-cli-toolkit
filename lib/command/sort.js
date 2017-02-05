/* eslint-disable no-param-reassign, no-underscore-dangle */

var _ = require('lodash');

var commandStream = require('../command-stream.js');

var ORDER_EMUN = {
  'ascending': 1,
  'descending': -1,
  '1': 1,
  '-1': -1
};

module.exports = commandStream(function dataFn(obj, opts) {
  opts._data = opts._data || [];
  opts._data.push(obj);
}, function OnFlush(opts, cb) {
  var data = opts._data;

  delete opts._data;

  if (!data || data.length === 0) {
    return cb();
  }

  var push = this.push.bind(this);

  var order = ORDER_EMUN[opts.order] || 1;

  data.sort(function (a, b) {
    var aVal = _.get(a, opts.attr);
    var bVal = _.get(b, opts.attr);

    if (aVal > bVal) {
      return Number(order);
    } else if (aVal < bVal) {
      return -1 * order;
    }

    return 0;
  }).forEach(function (val) {
    push(val);
  });

  return cb();
});
