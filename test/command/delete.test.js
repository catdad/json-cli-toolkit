/* jshint node: true, mocha: true */

var expect = require('chai').expect;
var _ = require('lodash');

var del = require('../../lib/command/delete.js');

describe('[delete]', function() {
    it('returns the object with the value removed', function() {
        var OBJ = { one: 2, three: 4 };
        
        var val = del(OBJ, {
            attr: 'three'
        });
        
        expect(OBJ).to.equal(val);
        expect(val).to.not.have.property('three');
    });
    
    it('can delete nested properties', function() {
        var OBJ = { one: 2, three: { four: 5, six: 7 } };
        
        var val = del(OBJ, {
            attr: 'three.four'
        });
        
        expect(OBJ).to.equal(val);
        expect(val).to.have.property('three')
            .and.to.be.an('object')
            .and.to.not.have.property('four');
    });
    
    it('can delete falsy values', function() {
        var OBJ = { one: 2, two: 0 };
        
        var val = del(OBJ, {
            attr: 'two'
        });
        
        expect(OBJ).to.equal(val);
        expect(val).to.not.have.property('two');
    });
    
    it('returns the object unmodified if attr does not exist', function() {
        var OBJ = { one: 2 };
        var CLONE = _.clone(OBJ);
        
        var val = del(CLONE, {
            attr: 'two'
        });
        
        expect(CLONE).to.deep.equal(OBJ);
    });

});
