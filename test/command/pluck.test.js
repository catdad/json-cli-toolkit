var expect = require('chai').expect;

var pluck = require('../../lib/command/pluck.js');

describe('[pluck]', function () {
  it('returns the property defined by attr', function () {
    var out = pluck({
      thing: 'stuff'
    }, {
      attr: 'thing'
    });

    expect(out).to.equal('stuff');
  });
  it('can return nested properties', function () {
    var out = pluck({
      nested: { key: 'value' }
    }, {
      attr: 'nested.key'
    });

    expect(out).to.equal('value');
  });
});
