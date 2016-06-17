/* jshint node: true */

var _ = require('lodash');

module.exports = function del(obj, opts) {
    var attrs = _.isArray(opts.attr) ?
        opts.attr :
        [opts.attr];
    
    attrs.forEach(function(attr) {
        _.unset(obj, attr);
    });
    
    return obj;
};
