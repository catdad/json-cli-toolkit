/* jshint node: true */

var _ = require('lodash');
var through = require('through2');

var utils = {
    pretrim: require('./util/pretrim.js')
};

function ignoreBadJson(data) {
    try {
        JSON.parse(data);
    } catch (e) {
        return undefined;
    }

    return data;
}

function transform(input, opts) {
    var transformed = through(function(data, enc, callback) {
        if (Buffer.isBuffer(data)) {
            data = data.toString();
        }

        _.forEach(utils, function(util, name) {
            if (opts[name] === true) {
                data = util(data);
            }
        });

        // order matters here, and ignoring bad json
        // should always be the last transform
        if (opts.ignore) {
            data = ignoreBadJson(data);
        }

        // if we still have data, push it into the
        // transformed stream
        if (data !== undefined) {
            this.push(data);
        }

        callback();
    });

    input.pipe(transformed);

    return transformed;
}

module.exports = utils;

Object.defineProperty(module.exports, 'transform', {
    configurable: false,
    writable: false,
    value: transform
});
