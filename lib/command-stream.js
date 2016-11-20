/* jshint node: true */

var _ = require('lodash');
var through = require('through2');

module.exports = function commandStream(dataFn, flush) {
    if (dataFn._isCommandStream === true) {
        return dataFn;
    }

    return _.set(function(opts) {
        return through.obj(function(data, enc, cb) {
            var out;

            try {
                out = dataFn(data, opts);
            } catch (e) {
                return cb(e);
            }

            cb(null, out);
        }, function(cb) {
            if (_.isFunction(flush)) {
                return flush(opts, cb);
            }

            cb();
        });
    }, '_isCommandStream', true);
};
