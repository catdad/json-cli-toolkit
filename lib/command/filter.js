var _ = require('lodash');

var undef = _.noop();

function transformEquals(eq) {
  if (eq === 'undefined') {
    return undef;
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

  return undef;
}

function matches(obj, val, match) {
  var m = new RegExp(match.toString());

  if (m.test(val)) {
    return obj;
  }

  return undef;
}

function exists(obj, val) {
  if (val !== undef) {
    return obj;
  }

  return undef;
}

module.exports = function filter(obj, opts) {
  var val = _.get(obj, opts.attr, undef);
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
    return ret ? undef : obj;
  }

  return ret;
};
