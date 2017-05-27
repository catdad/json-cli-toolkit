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

function above(obj, val, comp) {
  if (val === comp) {
    return undef;
  }

  if (_.isString(val) && val.localeCompare(comp) > 0) {
    return obj;
  }

  if (_.isNumber(val) && val > comp) {
    return obj;
  }

  return undef;
}

function below(obj, val, comp) {
  if (val === comp) {
    return undef;
  }

  return above(obj, val, comp) ? undef : obj;
}

function handleEqualities(opts, obj, val, not) {
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
}

function handleComparisons(opts, obj, val, not) {
  if (!_.isString(val) && !_.isNumber(val)) {
    return undef;
  }

  var ret;

  if (opts.above) {
    ret = above(obj, val, opts.above);
  } else if (opts.below) {
    ret = below(obj, val, opts.below);
  }

  if (not) {
    return ret ? undef : obj;
  }

  return ret;
}

module.exports = function filter(obj, opts) {
  var val = _.get(obj, opts.attr, undef);
  var not = !!opts.not;

  if (opts.above || opts.below) {
    return handleComparisons(opts, obj, val, not);
  }

  return handleEqualities(opts, obj, val, not);
};
