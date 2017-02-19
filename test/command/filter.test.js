var expect = require('chai').expect;
var _ = require('lodash');

var filter = require('../../lib/command/filter.js');

var undef = _.noop();

describe('[filter]', function () {

  function test(OBJ, opts, succeed) {
    var val = filter(OBJ, opts);

    if (succeed) {
      expect(val).to.equal(OBJ);
    } else {
      expect(val).to.equal(undef);
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
    defaultTests.forEach(function (func) {
      func();
    });

    describe('--not', function () {
      notTests.forEach(function (func) {
        func();
      });
    });
  }

  function createTests(testList) {
    var defaultTests = [];
    var notTests = [];

    testList.forEach(function (desc) {
      defaultTests.push(function () {
        it('returns ' + desc.msg, function () {
          test(desc.obj, desc.opts, desc.succeed);
        });
      });

      notTests.push(function () {
        it('does not return ' + desc.msg, function () {
          notTest(desc.obj, desc.opts, desc.succeed);
        });
      });
    });

    runTests(defaultTests, notTests);
  }

  describe('--attr', function () {

    createTests([{
      obj: { example: 'pants' },
      opts: { attr: 'example' },
      succeed: true,
      msg: 'the object if a properties exist'
    }, {
      obj: { nested: { prop: 12 } },
      opts: { attr: 'nested.prop' },
      succeed: true,
      msg: 'the object if a nested propeties exist'
    }, {
      obj: { pants: 0 },
      opts: { attr: 'pants' },
      succeed: true,
      msg: 'the object even if the property is falsy'
    }, {
      obj: { not: 'pants' },
      opts: { attr: 'example' },
      succeed: false,
      msg: 'undefined if the property does not exist'
    }]);

  });

  describe('--attr --equals', function () {

    createTests([{
      obj: { example: 'pants' },
      opts: {
        attr: 'example',
        equals: 'pants'
      },
      succeed: true,
      msg: 'the object if property equals a specific string'
    }, {
      obj: { nested: { prop: 'pants' } },
      opts: {
        attr: 'nested.prop',
        equals: 'pants'
      },
      succeed: true,
      msg: 'the object if a nested property equals a specific string'
    }, {
      obj: { example: 'pants' },
      opts: {
        attr: 'not',
        equals: 'undefined'
      },
      succeed: true,
      msg: 'the object if the property is undefined and equals is "undefined"'
    }, {
      obj: { example: null },
      opts: {
        attr: 'example',
        equals: 'null'
      },
      succeed: true,
      msg: 'the object if the property is null and equals is "null"'
    }, {
      obj: { not: 'pants' },
      opts: {
        attr: 'not',
        equals: 'shirts'
      },
      succeed: false,
      msg: 'undefined if the property is present but not equal'
    }]);

  });

  describe('--attr --matches', function () {

    createTests([{
      obj: { example: 'pants' },
      opts: {
        attr: 'example',
        matches: '^p'
      },
      succeed: true,
      msg: 'the object if the property matches a specific regular expression'
    }, {
      obj: { nested: { prop: 'pants' } },
      opts: {
        attr: 'nested.prop',
        matches: '^p'
      },
      succeed: true,
      msg: 'the object if a nested property equals a specific regular expression'
    }, {
      // since yargs will parse numbers into a number, we have to make
      // sure that filter correctly uses that number in the regex
      obj: { one: 1 },
      opts: {
        attr: 'one',
        matches: 1
      },
      succeed: true,
      msg: 'the object if the regular expression is a number'
    }, {
      obj: { not: 'pants' },
      opts: {
        attr: 'not',
        matches: 'p$'
      },
      succeed: false,
      msg: 'undefined if the property is present but doesn\'t match'
    }]);

  });
});
