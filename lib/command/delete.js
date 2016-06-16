/* jshint node: true */

var _ = require('lodash');

module.exports = function del(obj, opts) {
    var attr = opts.attr;
    
    // unset returns a boolean instead of the
    // new object... grr
    _.unset(obj, attr);
    
    return obj;
};
