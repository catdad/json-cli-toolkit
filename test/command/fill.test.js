var expect = require('chai').expect;
var _ = require('lodash');

var fill = require('../../lib/command/fill.js');

describe.only('[fill]', function () {
  function test(source, expected, opts) {
    var copy = _.cloneDeep(source);
    var actual = fill(copy, opts);

    // make sure the values match
    expect(actual).to.deep.equal(expected);

    // make sure that the original was not modified
    expect(source).to.deep.equal(copy);
    expect(source).to.not.equal(copy);
  }

  describe('include', function () {
    it('returns an object with only the whitelisted propeties', function () {
      test({
        a: { b: 1, c: 2 },
        d: { b: 3, c: 4 }
      }, {
        a: { b: 1 },
        d: { c: 4 }
      }, {
        include: ['a.b', 'd.c']
      });
    });
  });

  describe('exclude', function () {
    it('returns an object without the blacklisted properties', function () {
      test({
        a: { b: 1, c: 2 },
        d: { b: 3, c: 4 }
      }, {
        a: { c: 2 },
        d: { b: 3 }
      }, {
        exclude: ['a.b', 'd.c']
      });
    });
  });

  describe('include and exclude', function () {
    it('return an object with properties only in the whitelist that are also not in the blacklist', function () {
      test({
        a: { b: 1, c: 2 },
        d: { b: 3, c: 4 }
      }, {
        a: { b: 1 }
      }, {
        include: ['a.b', 'd.c'],
        exclude: ['d']
      });
    });
  });

  describe('no options', function () {
    it('returns a copy of the original object', function () {
      var obj = { a: 1, b: 2 };

      test(obj, obj, {});
    });
  });
});
