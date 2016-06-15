/* jshint node: true, mocha: true */

var expect = require('chai').expect;
var _ = require('lodash');

var filter = require('../../lib/command/filter.js');

describe('[filter]', function() {
    
    function test(OBJ, opts, succeed) {
        var val = filter(OBJ, opts);
        
        if (succeed) {
            expect(val).to.equal(OBJ);
        } else {
            expect(val).to.equal(undefined);
        }
    }
    
    function notTest(OBJ, opts, succeed) {
        var clone = _.cloneDeep(opts);
        clone.not = true;
        
        var val = filter(OBJ, clone);
        
        // `succeed` tells us that the original options,
        // before adding the `not` were expected to
        // succeed
        if (succeed) {
            expect(val).to.not.equal(OBJ);
        } else {
            expect(val).to.equal(OBJ);
        }
    }
    
    function runTests(defaultTests, notTests) {
        defaultTests.forEach(function(func) {
            func();
        });
        
        describe('--not', function() {
            notTests.forEach(function(func) {
                func();
            });
        });
    }
    
    function createTests(testList) {
        var defaultTests = [];
        var notTests = [];
        
        testList.forEach(function(desc) {
            defaultTests.push(function() {
                it('returns ' + desc.msg, function() {
                    test(desc.obj, desc.opts, desc.default);
                });
            });
            
            notTests.push(function() {
                it('does not return ' + desc.msg, function() {
                    notTest(desc.obj, desc.opts, desc.default);
                });
            });
        });
        
        runTests(defaultTests, notTests);
    }
    
    describe('--attr', function() {
        createTests([{
            obj: { example: 'pants' },
            opts: { attr: 'example' },
            default: true,
            msg: 'the object if a properties exist'
        }, {
            obj: { nested: { prop: 12 } },
            opts: { attr: 'nested.prop' },
            default: true,
            msg: 'the object if a nested propeties exist'
        }, {
            obj: { pants: 0 },
            opts: { attr: 'pants' },
            default: true,
            msg: 'the object even if the property is falsy'
        }, {
            obj: { not: 'pants' },
            opts: { attr: 'example' },
            default: false,
            msg: 'undefined if the property does not exist'
        }]);
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
