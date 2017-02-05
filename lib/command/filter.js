var _ = require('lodash');

function getUndefined() {
  return;
}

function transformEquals(eq) {
  if (eq === 'undefined') {
    return getUndefined();
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

  return getUndefined();
}

function matches(obj, val, match) {
  var m = new RegExp(match.toString());

  if (m.test(val)) {
    return obj;
  }

  return getUndefined();
}

function exists(obj, val) {
  if (val !== getUndefined()) {
    return obj;
  }

  return getUndefined();
}

module.exports = function filter(obj, opts) {
  var val = _.get(obj, opts.attr, getUndefined());
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
    return ret ? getUndefined() : obj;
  }

  return ret;
};
