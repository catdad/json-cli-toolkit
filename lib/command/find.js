/* jshint node: true */

var _ = require('lodash');

function transformEquals(eq) {
    if (eq === 'undefined') {
        return undefined;
    }
    
    if (eq === 'null') {
        return null;
    }
    
    return eq;
}

function equals(obj, val, eq) {
    eq = transformEquals(eq);

    if (eq === val) {
        return obj;
    }
    
    return undefined;
}

function matches(obj, val, match) {
    var m = new RegExp(match);

    if (m.test(val)) {
        return obj;
    }
    
    return undefined;
}

function exists(obj, val) {
    if (val !== undefined) {
        return obj;
    }
    
    return undefined;
}

module.exports = function find(obj, opts) {
    var val = _.get(obj, opts.attr, undefined);
    
    if (opts.equals) {
        return equals(obj, val, opts.equals);
    } else if (opts.matches) {
        return matches(obj, val, opts.matches);
    } else {
        return exists(obj, val);
    }
};
