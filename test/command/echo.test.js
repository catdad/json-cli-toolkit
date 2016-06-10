/* jshint node: true, mocha: true */

var expect = require('chai').expect;

var echo = require('../../lib/command/echo.js');

describe('[echo]', function() {
    it('returns the exact same object', function() {
        var obj = {};
        
        var out = echo(obj);
        
        expect(out).to.equal(obj);
    });
});
