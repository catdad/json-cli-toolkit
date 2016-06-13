/* jshint node: true */

var vm = require('vm');

var _ = require('lodash');

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
    
    var script = getVm(opts.exec);
    
    script.runInContext(sandbox);
    
    return sandbox.obj;
};
