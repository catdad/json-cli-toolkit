/* jshint node: true, mocha: true */

var expect = require('chai').expect;

var pretrim = require('../../lib/util.js').pretrim;

describe('[pretrim]', function() {
    it('removes plain text before a json object', function() {
        var DATA = JSON.stringify({ example: 'pants'});
        
        expect(pretrim('not json data: ' + DATA)).to.equal(DATA);
    });
    
    it('removes plain test before a json array', function() {
        var DATA = JSON.stringify(['oranges', 'strawberries', 'kiwi']);
        
        expect(pretrim('list of fruits: ' + DATA)).to.equal(DATA);
    });
    
    it('does not modify json if there is no plain data before it', function() {
        var DATA = JSON.stringify({ example: 'shorts' }) + ' and other stuff';
        
        expect(pretrim(DATA)).to.equal(DATA);
    });
});
