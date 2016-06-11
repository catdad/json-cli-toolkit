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
    
    if (attr === undefined || val === undefined) {
        return obj;
    }
    
    return _.set(obj, attr, val);
};
