/* jshint node: true, mocha: true */

var expect = require('chai').expect;
var _ = require('lodash');

var set = require('../../lib/command/set.js');

describe('[set]', function() {
    it('returns the object with a new value set', function() {
        var OBJ = { one: 2 };
        
        var val = set(OBJ, {
            attr: 'three',
            value: 4
        });
        
        expect(OBJ).to.equal(val);
        expect(val).to.have.property('three').and.to.equal(4);
    });
    
    it('can set nested properties', function() {
        var OBJ = { one: 2 };
        
        var val = set(OBJ, {
            attr: 'three.four',
            value: 5
        });
        
        expect(OBJ).to.equal(val);
        expect(val).to.have.property('three')
            .and.to.be.an('object')
            .and.to.have.property('four')
            .and.to.equal(5);
    });
    
    it('can set falsy values', function() {
        var OBJ = { one: 2 };
        
        var val = set(OBJ, {
            attr: 'three',
            value: false
        });
        
        expect(OBJ).to.equal(val);
        expect(val).to.have.property('three').and.to.equal(false);
    });
    
    it('can increment a value by using the shared options', function() {
        var opts = {
            attr: 'one',
            inc: 0
        };
        var OBJ = {};
        
        expect(set({}, opts)).to.have.property('one').and.to.equal(0);
        expect(opts.inc).to.equal(1);
        
        expect(set({}, opts)).to.have.property('one').and.to.equal(1);
        expect(opts.inc).to.equal(2);
    });
    
    it('can decrement a value by using the shared options', function() {
        var opts = {
            attr: 'one',
            dec: 0
        };
        var OBJ = {};
        
        expect(set({}, opts)).to.have.property('one').and.to.equal(0);
        expect(opts.dec).to.equal(-1);
        
        expect(set({}, opts)).to.have.property('one').and.to.equal(-1);
        expect(opts.dec).to.equal(-2);
    });
    
    it('transforms the string "null" to the value null', function() {
        var OBJ = { one: 2 };
        
        var val = set(OBJ, {
            attr: 'three',
            value: 'null'
        });
        
        expect(OBJ).to.equal(val);
        expect(val).to.have.property('three').and.to.equal(null);
    });
    
    it('returns the object unmodified if attr is not set', function() {
        var OBJ = { one: 2 };
        var CLONE = _.clone(OBJ);
        
        var val = set(CLONE, {
            value: 4
        });
        
        expect(CLONE).to.deep.equal(OBJ);
    });

    it('returns the object unmodified if value is not set', function() {
        var OBJ = { one: 2 };
        var CLONE = _.clone(OBJ);
        
        var val = set(CLONE, {
            attr: 'three',
        });
        
        expect(CLONE).to.deep.equal(OBJ);
    });
});
