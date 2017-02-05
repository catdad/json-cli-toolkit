/* jshint node: true, mocha: true */

var expect = require('chai').expect;

var wrap = require('../../lib/command/wrap.js');

describe('[wrap]', function () {
  it('returns the object wrapped in a property', function () {
    var OBJ = {};
    var opts = {
      attr: 'name',
      argv: {}
    };

    expect(wrap(OBJ, opts)).to.have.property('name')
            .and.to.equal(OBJ);
  });

  it('can wrap using a nested property', function () {
    var OBJ = {};
    var opts = {
      attr: 'prop.name',
      argv: {}
    };

    expect(wrap(OBJ, opts))
            .to.have.property('prop')
            .and.to.be.an('object')
            .to.have.property('name')
            .and.to.equal(OBJ);
  });

  it('can create an array', function () {
    var OBJ = {};
    var opts = {
      attr: 'name[0]',
      argv: {}
    };

    expect(wrap(OBJ, opts))
            .to.have.property('name')
            .and.to.be.an('array')
            .and.to.have.lengthOf(1)
            // not sure if it is a good idea to test
            // arrays this way, but it works
            .to.have.property('0')
            .and.to.equal(OBJ);
  });
});
