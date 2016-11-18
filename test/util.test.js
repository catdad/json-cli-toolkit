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
            var input = through.obj();

            var out = input.pipe(util.transform({
                pretrim: true
            }));

            ns.wait.obj(out, function(err, data) {
                if (err) {
                    return done(err);
                }

                expect(data).to.be.an('array')
                    .and.to.have.lengthOf(1)
                    .and.to.have.property('0')
                    .and.to.deep.equal({});

                done();
            });

            input.end(DATA);
        });

        it('ignored bad json with a flag', function(done) {
            var DATA = { example: 'pants' };
            var input = through.obj();

            var out = input.pipe(util.transform({
                ignore: true
            }));

            ns.wait.obj(out, function(err, data) {
                if (err) {
                    return done(err);
                }

                expect(data).to.be.an('array')
                    .and.to.have.lengthOf(1)
                    .and.to.have.property('0')
                    .and.to.deep.equal(DATA);

                done();
            });

            input.write(JSON.stringify(DATA));
            input.write('not json data');
            input.end();
        });
    });
});
