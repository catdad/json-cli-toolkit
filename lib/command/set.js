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
    var val;
    
    if (!_.isUndefined(opts.inc)) {
        val = opts.inc;
        opts.inc += 1;
    } else if (!_.isUndefined(opts.dec)) {
        val = opts.dec;
        opts.dec -= 1;
    } else {
        val = transformVal(opts.value);
    }
    
    if (attr === undefined || val === undefined) {
        return obj;
    }
    
    return _.set(obj, attr, val);
};
