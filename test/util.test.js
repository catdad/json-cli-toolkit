/* jshint node: true, mocha: true */

var expect = require('chai').expect;
var through = require('through2');
var ns = require('node-stream');

var util = require('../lib/util.js');

describe('[util]', function() {
    it('is an enum of all utils', function() {
        expect(util).to.have.all.keys([
            'pretrim'
        ]);
    });
    
    describe('#transform', function() {
        it('applies utils to a stream', function(done) {
            var DATA = 'pants {}';
            var input = through();
            
            var t = util.transform(input, {
                pretrim: true
            });
            
            ns.wait(t, function(err, buff) {
                if (err) {
                    return done(err);
                }
                
                var str = buff.toString();
                
                expect(str).to.equal('{}');
                
                done();
            });
            
            input.end(DATA);
        });
    });
});
