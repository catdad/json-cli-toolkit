/* jshint node: true */

var _ = require('lodash');

function includeList(obj, seed, list) {
  var val = _.cloneDeep(seed);

  // I probably could use _.pick here

  list.forEach(function (key) {
    _.set(val, key, _.get(obj, key));
  });

  return val;
}

function excludeList(obj, seed, list) {
  var val = _.cloneDeep(seed);

  list.forEach(function (key) {
    _.unset(val, key);
  });

  return val;
}

module.exports = function wrap(obj, opts) {
  var val = _.cloneDeep(obj);
  var include = _.isArray(opts.include);
  var exclude = _.isArray(opts.exclude);

  if (include) {
    val = includeList(val, {}, opts.include);
  }

  if (exclude) {
    val = excludeList(null, val, opts.exclude);
  }

  return val;
};
