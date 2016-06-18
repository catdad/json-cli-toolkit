/* jshint node: true */

var _ = require('lodash');

module.exports = function wrap(obj, opts) {
    return _.set({}, opts.attr, obj);
};
