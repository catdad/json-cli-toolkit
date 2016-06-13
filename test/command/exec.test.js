/* jshint node: true, mocha: true */

var expect = require('chai').expect;

var exec = require('../../lib/command/exec.js');

describe('[exec]', function() {
    it('executes arbitrary transform javascript', function() {
        var data = { example: 'pants' };
        var opts = {
            exec: 'obj.example = "shirts"'
        };
        
        var val = exec(data, opts);
        
        expect(val).to.deep.equal({
            example: 'shirts'
        });
    });
    
    it('can completely modify the "obj" object', function() {
        var opts = {
            exec: 'obj = "something different"'
        };
        
        var val = exec({}, opts);
        
        expect(val).to.equal('something different');
    });
    
    it('has access to lodash', function() {
        var data = { one: 1, two: 2 };
        var opts = {
            exec: 'obj = _.map(obj, function(v) { return v })'
        };
        
        var val = exec(data, opts);
        
        expect(val).to.deep.equal([1,2]);
    });
    
    it('can do many modifications', function() {
        var data = { example: 'pants' };
        var opts = {
            exec: 'obj.example = "shirts"; obj.thing = "stuff"'
        };
        
        var val = exec(data, opts);
        
        expect(val).to.deep.equal({
            example: 'shirts',
            thing: 'stuff'
        });
    });
    
    it('errors when the code is not JavaScript');
});
