/* jshint node: true, mocha: true */

var expect = require('chai').expect;

var wrap = require('../../lib/command/wrap.js');

describe('[wrap]', function() {
    it('returns the object wrapped in a property', function() {
        var OBJ = {};
        var opts = {
            attr: 'name',
            argv: {}
        };
        
        expect(wrap(OBJ, opts)).to.have.property('name')
            .and.to.equal(OBJ);
    });
    
    it('can wrap using a nested property', function() {
        var OBJ = {};
        var opts = {
            attr: 'prop.name',
            argv: {}
        };
        
        expect(wrap(OBJ, opts))
            .to.have.property('prop')
            .and.to.be.an('object')
            .to.have.property('name')
            .and.to.equal(OBJ);
    });
});
