/* jshint node: true, mocha: true */

var expect = require('chai').expect;
var through = require('through2');
var ns = require('node-stream');
var _ = require('lodash');

var commandStream = require('../lib/command-stream.js');

describe('[command-stream]', function() {
    it('calls the data function once for each written item', function(done) {
        var input = through();
        var OPTS = { some: 'pineapples' };
        var DATA = ['1', '2', '3'];

        var count = 0;
        var out = 0;

        var stream = commandStream(function(data, opts) {
            expect(data.toString()).to.equal(DATA[count]);
            expect(opts).to.equal(OPTS);

            count += 1;

            return data;
        })(OPTS).on('data', function() {
            out += 1;
        }).on('end', function() {
            expect(count).to.equal(out).and.to.equal(DATA.length);

            done();
        });

        input.pipe(stream);

        DATA.forEach(function(val) {
            input.write(val);
        });
        input.end();
    });

    it('writes data returned by the data function to output', function(done) {
        var input = through();
        var OPTS = { some: 'pineapples' };
        var DATA = ['1', '2', '3'];
        var OUT = [];

        var count = 0;

        var stream = commandStream(function(data, opts) {
            expect(data.toString()).to.equal(DATA[count]);
            expect(opts).to.equal(OPTS);

            var output = Math.random().toString(36);
            OUT[count] = output;

            count += 1;

            return output;
        })(OPTS).on('data', function(data) {
            expect(data.toString()).to.equal(OUT[count - 1]);
        }).on('end', done);

        input.pipe(stream);

        DATA.forEach(function(val) {
            input.write(val);
        });
        input.end();
    });

    it('skips writing if the data function returns undefined', function(done) {
        var input = through();
        var OPTS = { some: 'pineapples' };
        var DATA = ['1', '0', '0'];

        var count = 0;
        var out = 0;

        var stream = commandStream(function(data, opts) {
            count += 1;

            return !!Number(data.toString()) ? data : undefined;
        })(OPTS).on('data', function(data) {
            out += 1;

            expect(data.toString()).to.equal(DATA[0]);
        }).on('end', function() {
            expect(count).to.equal(DATA.length);
            expect(out).to.equal(1);

            done();
        });

        input.pipe(stream);

        DATA.forEach(function(val) {
            input.write(val);
        });
        input.end();
    });

    it('uses an object stream', function(done) {
        var input = through.obj();
        var OPTS = { some: 'pineapples' };
        var DATA = [
            { fruit: 'pineapple' },
            { vegetable: 'cucumber' },
            { nut: 'pistachio' }
        ];

        var count = 0;

        var stream = commandStream(function(data, opts) {
            expect(data).to.be.an('object').and.to.equal(DATA[count]);
            count += 1;

            return data;
        })(OPTS).on('data', _.noop).on('end', function() {
            expect(count).to.equal(DATA.length);

            done();
        });

        input.pipe(stream);

        DATA.forEach(function(val) {
            input.push(val);
        });
        input.end();
    });

    it('has an optional flush function', function(done) {
        var input = through();
        var OPTS = { some: 'pineapples' };
        var DATA = ['1', '2', '3'];

        var flushFinished = false;

        var stream = commandStream(function dataFn(data, opts) {
            expect(opts).to.equal(OPTS);

            return data;
        }, function flushFn(opts, cb) {
            expect(opts).to.equal(OPTS);
            expect(cb).to.be.a('function');

            setTimeout(function() {
                flushFinished = true;
                cb();
            }, 2);

        })(OPTS).on('data', _.noop).on('end', function() {
            expect(flushFinished).to.equal(true);

            done();
        });

        input.pipe(stream);

        DATA.forEach(function(val) {
            input.write(val);
        });
        input.end();
    });

    it('returns a function that has an _isCommandStream boolean set to true', function() {
        var val = commandStream(_.noop);

        expect(val).to.be.a('function');
        expect(val).to.have.property('_isCommandStream').and.to.equal(true);
    });

    it('does not wrap a function that already produces a command stream', function() {
        var val = commandStream(_.noop);
        var val2 = commandStream(val);

        expect(val2).to.equal(val);
    });
});
