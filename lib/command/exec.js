/* jshint node: true */

var vm = require('vm');

var _ = require('lodash');

// Not sure this is really needed. Creating a
// script theoretically takes a bit of time,
// so I don't want to do it every time.
var getVm = _.memoize(function func(code) {
    return new vm.Script(code);
}, function resolver(code) {
    return code.toString();
});

module.exports = function exec(obj, opts) {
    var sandbox = vm.createContext({
        _: _,
        obj: obj,
        opts: opts
    });
    
    var script = getVm(opts.code);
    
    script.runInContext(sandbox);
    
    return sandbox.obj;
};
