/* jshint node: true, mocha: true */

var expect = require('chai').expect;
var _ = require('lodash');
var ns = require('node-stream');
var through = require('through2');

var sort = require('../../lib/command/sort.js');

function write(stream, data) {
    data.forEach(function(val) {
        stream.push(val);
    });

    stream.end();
}

function run(data, opts, done) {
    var input = through.obj();
    opts = opts || {};

    ns.wait.obj(input.pipe(sort(opts)), done);

    write(input, data);
}

function dataArr(arr, prop) {
    return arr.map(function(val) {
        return _.set({}, prop, val);
    });
}

describe('[set]', function() {
    it('exposes a commandStream directly');

    it('writes data at the end', function(done) {
        var DATA = dataArr([1, 2, 3], 'val');

        run(DATA, {
            attr: 'val'
        }, function(err, data) {
            if (err) {
                return done(err);
            }

            expect(data).to.deep.equal(DATA);

            done();
        });
    });

    it('sorts numbers written as input', function(done) {
        var DATA = dataArr([5, 4, 3, 2, 1], 'val');

        run(DATA, {
            attr: 'val'
        }, function(err, data) {
            if (err) {
                return done(err);
            }

            expect(data).to.deep.equal(DATA.reverse());

            done();
        });
    });

    it('sorts strings written as input', function(done) {
        var DATA = dataArr(['d', 'c', 'b', 'aa', 'a'], 'val');

        run(DATA, {
            attr: 'val'
        }, function(err, data) {
            if (err) {
                return done(err);
            }

            expect(data).to.deep.equal(DATA.reverse());

            done();
        });
    });

    it('keeps items in the same order if they have the same sort value', function(done) {
        var DATA = dataArr([3, 2, 2, 1], 'val').map(function(val, i, arr) {
            val.idx = arr.length - 1 - i;
            return val;
        });

        run(DATA, {
            attr: 'val'
        }, function(err, data) {
            if (err) {
                return done(err);
            }

            var idxs = data.map(function(val) {
                return val.idx;
            });

            expect(idxs).to.deep.equal([0, 2, 1, 3]);

            done();
        });
    });

    ['ascending', 1].forEach(function(order) {
        it('sorts in ascending order using the order prop: ' + order, function(done) {
            var DATA = dataArr([2, 3, 1], 'val');
            var ORDERED = dataArr([1, 2, 3], 'val');

            run(DATA, {
                attr: 'val',
                order: order
            }, function(err, data) {
                if (err) {
                    return done(err);
                }

                expect(data).to.deep.equal(ORDERED);

                done();
            });
        });
    });

    ['descending', -1].forEach(function(order) {
        it('sorts in descending order using the order prop: ' + order, function(done) {
            var DATA = dataArr([2, 3, 1], 'val');
            var ORDERED = dataArr([3, 2, 1], 'val');

            run(DATA, {
                attr: 'val',
                order: order
            }, function(err, data) {
                if (err) {
                    return done(err);
                }

                expect(data).to.deep.equal(ORDERED);

                done();
            });
        });
    });

    it('does not fail if no data is written to the stream', function(done) {
        run([], {}, function(err, data) {
            if (err) {
                return done(err);
            }

            expect(data).to.be.an('array').and.to.have.lengthOf(0);

            done();
        });
    });
});
