/* jshint node: true */

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
}, function flushFn(opts, cb) {
  var data = opts._data;

  opts._data = undefined;

  if (!data || data.length === 0) {
    return cb();
  }

  var push = this.push.bind(this);

  var order = ORDER_EMUN[opts.order] || 1;

  var sorted = data.sort(function (a, b) {
    var aVal = _.get(a, opts.attr);
    var bVal = _.get(b, opts.attr);

    if (aVal > bVal) {
      return Number(order);
    } else if (aVal < bVal) {
      return -1 * order;
    }

    return 0;
  });

  data.forEach(function (val) {
    push(val);
  });

  cb();
});
