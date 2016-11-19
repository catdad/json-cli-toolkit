/* jshint node: true */

var util = require('util');

var through = require('through2');

function commandStream(fn) {
    return function(opts) {
        return through.obj(function(data, enc, cb) {
            var out;

            try {
                out = fn(data, opts);
            } catch (e) {
                return cb(e);
            }

            cb(null, out);
        });
    };
}

function get(name) {
    return commandStream(require(util.format('./command/%s.js', name)));
}

module.exports = {
    delete: get('delete'),
    echo: get('echo'),
    exec: get('exec'),
    filter: get('filter'),
    pluck: get('pluck'),
    set: get('set'),
    wrap: get('wrap'),
};
