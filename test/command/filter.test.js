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

  function createTests(testList) {
    // make copies, just in case
    var defaultList = _.cloneDeep(testList);
    var notList = _.cloneDeep(testList);

    defaultList.forEach(function (desc) {
      it('returns ' + desc.msg, function () {
        test(desc.obj, desc.opts, desc.succeed);
      });
    });

    describe('--not', function () {
      notList.forEach(function (desc) {
        it('does not return ' + desc.msg, function () {
          notTest(desc.obj, desc.opts, desc.succeed);
        });
      });
    });
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

  function invalidCompTest(name, opts, succeed) {
    [{ b: 1 }, true, [1, 2, 3]].forEach(function (testval) {
      it (name + testval.constructor.name, function () {
        test({ val: testval }, opts, succeed);
      });
    });
  }

  describe('--attr --above', function () {

    createTests([{
      obj: { a: 100 },
      opts: {
        attr: 'a',
        above: 30
      },
      succeed: true,
      msg: 'the object if a number value is above a number'
    }, {
      obj: { a: 'bananas' },
      opts: {
        attr: 'a',
        above: 'apples'
      },
      succeed: true,
      msg: 'the object if a string value is above a string value'
    }, {
      obj: { a: 100 },
      opts: {
        attr: 'a',
        above: 0
      },
      succeed: true,
      msg: 'the object when 0 is used for the flag'
    }, {
      obj: { a: 100 },
      opts: {
        attr: 'a',
        above: 120
      },
      succeed: false,
      msg: 'undefined if a number value is below a number value'
    }, {
      obj: { a: 'apples' },
      opts: {
        attr: 'a',
        above: 'bananas'
      },
      succeed: false,
      msg: 'undefined if a string value is below a string value'
    }, {
      obj: { a: 100 },
      opts: {
        attr: 'a',
        above: 100
      },
      succeed: false,
      msg: 'undefined if two number values are equal'
    }, {
      obj: { a: 'pineapples' },
      opts: {
        attr: 'a',
        above: 'pineapples'
      },
      succeed: false,
      msg: 'undefined if two string values are equal'
    }]);

    invalidCompTest(
      'return undefined if the source value is: ',
      {
        attr: 'val',
        above: 'anything'
      },
      false
    );

    describe('--not', function () {
      invalidCompTest(
        'return undefined if the source value is: ',
        {
          attr: 'val',
          above: 'anything',
          not: true
        },
        false
      );
    });

  });

  describe('--attr --below', function () {

    createTests([{
      obj: { a: 100 },
      opts: {
        attr: 'a',
        below: 120
      },
      succeed: true,
      msg: 'the object if a number value is below a number value'
    }, {
      obj: { a: 'apples' },
      opts: {
        attr: 'a',
        below: 'bananas'
      },
      succeed: true,
      msg: 'the object if a string value is below a string value'
    }, {
      obj: { a: -75 },
      opts: {
        attr: 'a',
        below: 0
      },
      succeed: true,
      msg: 'the object when 0 is used for the flag'
    }, {
      obj: { a: 100 },
      opts: {
        attr: 'a',
        below: 30
      },
      succeed: false,
      msg: 'undefined if a number value is above a number value'
    }, {
      obj: { a: 'bananas' },
      opts: {
        attr: 'a',
        below: 'apples'
      },
      succeed: false,
      msg: 'undefined if a string value is above a string value'
    }, {
      obj: { a: 100 },
      opts: {
        attr: 'a',
        below: 100
      },
      succeed: false,
      msg: 'undefined if two number values are equal'
    }, {
      obj: { a: 'pineapples' },
      opts: {
        attr: 'a',
        below: 'pineapples'
      },
      succeed: false,
      msg: 'undefined if two string values are equal'
    }]);

    invalidCompTest(
      'return undefined if the source value is: ',
      {
        attr: 'val',
        below: 'anything'
      },
      false
    );

    describe('--attr --in', function () {
      createTests([{
        obj: { a: 100 },
        opts: {
          attr: 'a',
          in: [100, 120]
        },
        succeed: true,
        msg: 'the object if a number value is in an array of values'
      }, {
        obj: { a: 'pineapples' },
        opts: {
          attr: 'a',
          in: ['kiwis', 'pineapples', 'cherries']
        },
        succeed: true,
        msg: 'the object if a string value is in an array of values'
      }, {
        obj: { a: 'pineapples' },
        opts: {
          attr: 'a',
          in: ['kiwis', 'oranges', 'cherries']
        },
        succeed: false,
        msg: 'undefined if a string value is not in an array of values'
      }, {
        obj: { a: '1' },
        opts: {
          attr: 'a',
          in: [1, 2, 3]
        },
        succeed: false,
        msg: 'undefined if a value and array types do not match'
      }]);
    });

    describe('--not', function () {
      invalidCompTest(
        'return undefined if the source value is: ',
        {
          attr: 'val',
          below: 'anything',
          not: true
        },
        false
      );
    });

  });
});
