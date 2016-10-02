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
    var m = new RegExp(match.toString());

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

module.exports = function filter(obj, opts) {
    var val = _.get(obj, opts.attr, undefined);
    var not = !!opts.not;
    var ret;

    if (opts.equals) {
        ret = equals(obj, val, opts.equals);
    } else if (opts.matches) {
        ret = matches(obj, val, opts.matches);
    } else {
        ret = exists(obj, val);
    }

    if (not) {
        return ret ? undefined : obj;
    } else {
        return ret;
    }
};
