/* jshint node: true */

var _ = require('lodash');

var commandStream = require('../command-stream.js');

module.exports = commandStream(function dataFn(obj, opts) {
    opts._data = opts._data || [];
    opts._data.push(obj);
}, function flushFn(opts, cb) {
    var data = opts._data;
    opts._data = undefined;

    var push = this.push.bind(this);

    var sorted = data.sort(function(a, b) {
        var aVal = _.get(a, opts.attr);
        var bVal = _.get(b, opts.attr);

        if (aVal > bVal) {
            return 1;
        } else if (aVal < bVal) {
            return -1;
        }

        return 0;
    });

    data.forEach(function(val) {
        push(val);
    });

    cb();
});
