/* jshint node: true */

var commandStream = require('../command-stream.js');

module.exports = commandStream(function dataFn(obj, opts) {
    opts._data = opts._data || [];
    opts._data.push(obj);
}, function flushFn(opts, cb) {
    var data = opts._data;
    opts._data = undefined;

    var push = this.push.bind(this);

    var sorted = data.sort(function(a, b) {
        if (a > b) {
            return 1;
        } else if (a < b) {
            return -1;
        }

        return 0;
    });

    data.forEach(function(val) {
        push(val);
    });

    cb();
});
