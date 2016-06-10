/* jshint node: true */

var through = require('through2');

var utils = {
    pretrim: require('./util/pretrim.js')
};

function transform(input, opts) {
    var transformed = through(function(data, enc, callback) {
        if (Buffer.isBuffer(data)) {
            data = data.toString();
        }
        
        if (opts.pretrim) {
            data = utils.pretrim(data);
        }
        
        this.push(data);
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
