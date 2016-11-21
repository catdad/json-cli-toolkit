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
});
