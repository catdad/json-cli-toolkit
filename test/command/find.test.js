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
        it('returns the object if property equals a specific string', function() {
            var OBJ = { example: 'pants' };
            var opts = {
                attr: 'example',
                equals: 'pants'
            };
            
            expect(find(OBJ, opts)).to.equal(OBJ);
        });
        it('returns the object if a nested property equals a specific string', function() {
            var OBJ = { nested: { prop: 'pants' } };
            var opts = {
                attr: 'nested.prop',
                equals: 'pants'
            };
            
            expect(find(OBJ, opts)).to.equal(OBJ);
        });
        it('returns the object if the property is undefined and equals is "undefined"', function() {
            var OBJ = { example: 'pants' };
            var opts = {
                attr: 'not',
                equals: 'undefined'
            };
            
            expect(find(OBJ, opts)).to.equal(OBJ);
        });
        it('returns the object if the property is null and equals is "null"', function() {
            var OBJ = { example: null };
            var opts = {
                attr: 'example',
                equals: 'null'
            };
            
            expect(find(OBJ, opts)).to.equal(OBJ);
        });
        
        it('returns undefined if the property is present but not equal', function() {
            var OBJ = { not: 'pants' };
            var opts = {
                attr: 'not',
                equals: 'shirts'
            };
            
            expect(find(OBJ, opts)).to.equal(undefined);
        });
        it('returns undefined if the property does not exist', function() {
            var OBJ = { not: 'pants' };
            var opts = {
                attr: 'example'
            };
            
            expect(find(OBJ, opts)).to.equal(undefined);
        });
    });
    
    describe('--attr --matches', function() {
        it('finds if properties match a specific regular expression');
    });
});