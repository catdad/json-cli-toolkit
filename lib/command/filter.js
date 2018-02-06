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

function isDefined(val) {
  return !_.isUndefined(val);
}

var comparisons = {
  equals: function equals(obj, val, eq) {
    eq = transformEquals(eq);

    if (eq === val) {
      return obj;
    }

    return undef;
  },
  matches: function matches(obj, val, match) {
    var m = new RegExp(match.toString());

    if (m.test(val)) {
      return obj;
    }

    return undef;
  },
  exists: function exists(obj, val) {
    if (val !== undef) {
      return obj;
    }

    return undef;
  },
  above: function above(obj, val, comp) {
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
  },
  below: function below(obj, val, comp) {
    if (val === comp) {
      return undef;
    }

    return comparisons.above(obj, val, comp) ? undef : obj;
  },
  in: function isIn(obj, val, comp) {
    return _.includes(comp, val) ? obj : undef;
  },

  apply: function (name, obj, val, comp) {
    return comparisons[name](obj, val, comp);
  },
  comparator: function (name, comp) {
    return function (obj, val) {
      return comparisons.apply(name, obj, val, comp);
    };
  },
  getFunc: function (opts) {
    var methods = [
      'equals',
      'matches',
      'above',
      'below',
      'in' // TODO should this be _.isArray?
    ];

    var name;

    for (var i = 0, l = methods.length; i < l; i++) {
      name = methods[i];

      if (isDefined(opts[name])) {
        return comparisons.comparator(name, opts[name]);
      }
    }

    return function (obj, val) {
      return comparisons.apply('exists', obj, val);
    };
  }
};

function handleSimpleComparison(opts, obj, val, not) {
  var ret = comparisons.getFunc(opts)(obj, val);

  if (not) {
    return ret ? undef : obj;
  }

  return ret;
}

function handleTypedComparison(opts, obj, val, not) {
  // these methods will only work on strings and numbers
  // and will always remove the value from the list if
  // not a string or a number, even when --not is used
  if (!_.isString(val) && !_.isNumber(val)) {
    return undef;
  }

  return handleSimpleComparison(opts, obj, val, not);
}

module.exports = function filter(obj, opts) {
  var val = _.get(obj, opts.attr, undef);
  var not = !!opts.not;

  if (opts.above || opts.below) {
    return handleTypedComparison(opts, obj, val, not);
  }

  return handleSimpleComparison(opts, obj, val, not);
};
