/* jshint node: true, mocha: true */

var expect = require('chai').expect;

var filter = require('../../lib/command/filter.js');

describe('[filter]', function() {
    
    describe('--attr', function() {
        it('return the object if a properties exist', function() {
            var OBJ = { example: 'pants' };
            var opts = {
                attr: 'example'
            };
            
            expect(filter(OBJ, opts)).to.equal(OBJ);
        });
        it('returns the object if a nested propeties exist', function() {
            var OBJ = { nested: { prop: 12 } };
            var opts = {
                attr: 'nested.prop'
            };
            
            expect(filter(OBJ, opts)).to.equal(OBJ);
        });
        it('returns the object even if the property is falsy', function() {
            var OBJ = { pants: 0 };
            var opts = {
                attr: 'pants'
            };
            
            expect(filter(OBJ, opts)).to.equal(OBJ);
        });
        it('returns undefined if the property does not exist', function() {
            var OBJ = { not: 'pants' };
            var opts = {
                attr: 'example'
            };
            
            expect(filter(OBJ, opts)).to.equal(undefined);
        });
    });
    
    describe('--attr --equals', function() {
        it('returns the object if property equals a specific string', function() {
            var OBJ = { example: 'pants' };
            var opts = {
                attr: 'example',
                equals: 'pants'
            };
            
            expect(filter(OBJ, opts)).to.equal(OBJ);
        });
        it('returns the object if a nested property equals a specific string', function() {
            var OBJ = { nested: { prop: 'pants' } };
            var opts = {
                attr: 'nested.prop',
                equals: 'pants'
            };
            
            expect(filter(OBJ, opts)).to.equal(OBJ);
        });
        it('returns the object if the property is undefined and equals is "undefined"', function() {
            var OBJ = { example: 'pants' };
            var opts = {
                attr: 'not',
                equals: 'undefined'
            };
            
            expect(filter(OBJ, opts)).to.equal(OBJ);
        });
        it('returns the object if the property is null and equals is "null"', function() {
            var OBJ = { example: null };
            var opts = {
                attr: 'example',
                equals: 'null'
            };
            
            expect(filter(OBJ, opts)).to.equal(OBJ);
        });
        
        it('returns undefined if the property is present but not equal', function() {
            var OBJ = { not: 'pants' };
            var opts = {
                attr: 'not',
                equals: 'shirts'
            };
            
            expect(filter(OBJ, opts)).to.equal(undefined);
        });
        it('returns undefined if the property does not exist', function() {
            var OBJ = { not: 'pants' };
            var opts = {
                attr: 'example'
            };
            
            expect(filter(OBJ, opts)).to.equal(undefined);
        });
    });
    
    describe('--attr --matches', function() {
        it('returns the object if the property matches a specific regular expression', function() {
            var OBJ = { example: 'pants' };
            var opts = {
                attr: 'example',
                matches: '^p'
            };
            
            expect(filter(OBJ, opts)).to.equal(OBJ);
        });
        it('returns the object if a nested property equals a specific regular expression', function() {
            var OBJ = { nested: { prop: 'pants' } };
            var opts = {
                attr: 'nested.prop',
                matches: '^p'
            };
            
            expect(filter(OBJ, opts)).to.equal(OBJ);
        });
        it('returns the object if the regular expression is a number', function() {
            // since yargs will parse numbers into a number, we have to make
            // sure that filter correctly uses that number in the regex
            var OBJ = { one: 1 };
            var opts = {
                attr: 'one',
                matches: 1
            };
            
            expect(filter(OBJ, opts)).to.equal(OBJ);
        });

        it('returns undefined if the property is present but doesn\'t match', function() {
            var OBJ = { not: 'pants' };
            var opts = {
                attr: 'not',
                matches: 'p$'
            };
            
            expect(filter(OBJ, opts)).to.equal(undefined);
        });
        it('returns undefined if the property does not exist', function() {
            var OBJ = { not: 'pants' };
            var opts = {
                attr: 'example'
            };
            
            expect(filter(OBJ, opts)).to.equal(undefined);
        });
    });
});
