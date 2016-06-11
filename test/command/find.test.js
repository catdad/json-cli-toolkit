/* jshint node: true, mocha: true */

var expect = require('chai').expect;

var find = require('../../lib/command/find.js');

describe.only('[find]', function() {
    
    describe('--attr', function() {
        it('return the object if a properties exist', function() {
            var OBJ = { example: 'pants' };
            var opts = {
                attr: 'example'
            };
            
            expect(find(OBJ, opts)).to.equal(OBJ);
        });
        it('returns the object if a nested propeties exist', function() {
            var OBJ = { nested: { prop: 12 } };
            var opts = {
                attr: 'nested.prop'
            };
            
            expect(find(OBJ, opts)).to.equal(OBJ);
        });
        it('returns the object even if the property is falsy', function() {
            var OBJ = { pants: 0 };
            var opts = {
                attr: 'pants'
            };
            
            expect(find(OBJ, opts)).to.equal(OBJ);
        });
        it('returns undefined if the property does not exist', function() {
            var OBJ = { not: 'pants' };
            var opts = {
                attr: 'example'
            };
            
            expect(find(OBJ, opts)).to.equal(undefined);
        });
    });
    
    describe('--attr --equals', function() {
        it('finds if properties equals a specific string', function() {
            
        });
        it('finds if properties are undefined');
        it('finds if properties are null');
    });
    
    describe('--attr --matches', function() {
        it('finds if properties match a specific regular expression');
    });
});
