var _ = require('lodash');

module.exports = function pluck(obj, opts) {
    return _.get(obj, opts.attr, undefined);
};
