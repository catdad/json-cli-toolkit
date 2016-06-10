/* jshint node: true, mocha: true */

var util = require('util');

var expect = require('chai').expect;
var through = require('through2');
var ns = require('node-stream');

var toolkit = require('../toolkit.js');

describe('[toolkit]', function() {
    function execute(options, data, callback) {
        var input = through();
        var output = through();
        
        options.input = options.input || input;
        options.output = options.output || output;
        
        toolkit(options);
        
        ns.wait(options.output, function(err, dataBuff) {
            if (err) {
                return callback(err);
            }
            
            callback(undefined, dataBuff.toString());
        });
        
        input.write(data);
        input.end();
    }
    
    it('takes and input and output streams', function(done) {
        // single line of json
        var DATA = JSON.stringify({ example: 'json' });
        
        execute({
            command: 'echo',
            argv: {}
        }, DATA, function(err, data) {
            if (err) {
                return done(err);
            }
            
            expect(data).to.equal(DATA);
            done();
        });
    });
    
    it('executes commands on multiline streams with a flag', function(done) {
        var DATA = util.format(
            '%s\n%s\n%s',
            JSON.stringify({ example: 'json' }),
            JSON.stringify({ more: 'json' }),
            JSON.stringify({ yay: 'pineapples' })
        );
        
        execute({
            command: 'echo',
            argv: {
                multiline: true
            }
        }, DATA, function(err, data) {
            if (err) {
                return done(err);
            }
            
            expect(data).to.equal(DATA);
            done();
        });
    });
    
    it('multiline mode does not print anything when the command returns no data', function(done) {
        var LINE = JSON.stringify({ example: 'json' });
        var DATA = util.format(
            '%s\n%s\n%s',
            LINE,
            JSON.stringify({ example: 'pants' }),
            JSON.stringify({ yay: 'pineapples' })
        );
        
        execute({
            command: 'pluck',
            argv: {
                multiline: true,
                attr: 'example'
            }
        }, DATA, function(err, data) {
            if (err) {
                return done(err);
            }
            
            expect(data).to.equal(util.format('%s\n%s\n', 'json', 'pants'));
            done();
        });
    });
    
    it('can pretty-print json with a flag', function(done) {
        var DATA = { example: 'pants' };
        
        execute({
            command: 'echo',
            argv: {
                pretty: true
            }
        }, JSON.stringify(DATA), function(err, data) {
            if (err) {
                return done(err);
            }
            
            expect(data).to.equal(JSON.stringify(DATA, false, 4));
            done();
        });
    });
    
    it('errors if the input is not json', function(done) {
        execute({
            command: 'echo',
            argv: {}
        }, 'definitely not json', function(err, data) {
            expect(err).to.be.instanceOf(Error);
            expect(err.toString()).to.match(/SyntaxError/);
            
            done();
        });
    });
    
    it('errors if one line in multiline input is not json', function(done) {
        var DATA = util.format(
            '%s\n%s\n%s',
            JSON.stringify({ example: 'pants' }),
            'definitely not json',
            JSON.stringify({ yay: 'pineapples' })
        );
        
        execute({
            command: 'pluck',
            argv: {
                multiline: true,
                attr: 'example'
            }
        }, DATA, function(err, data) {
            expect(err).to.be.instanceOf(Error);
            expect(err.toString()).to.match(/SyntaxError/);
            
            done();
        });
    });
});
