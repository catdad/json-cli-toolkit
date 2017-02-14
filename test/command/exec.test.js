var expect = require('chai').expect;

var exec = require('../../lib/command/exec.js');

describe('[exec]', function () {
  it('executes arbitrary transform javascript', function () {
    var data = { example: 'pants' };
    var opts = {
      code: 'obj.example = "shirts"'
    };

    var val = exec(data, opts);

    expect(val).to.deep.equal({
      example: 'shirts'
    });
  });

  it('can completely modify the "obj" object', function () {
    var opts = {
      code: 'obj = "something different"'
    };

    var val = exec({}, opts);

    expect(val).to.equal('something different');
  });

  it('has access to lodash', function () {
    var data = { one: 1,
      two: 2 };
    var opts = {
      code: 'obj = _.map(obj, function(v) { return v })'
    };

    var val = exec(data, opts);

    expect(val).to.deep.equal([1, 2]);
  });

  it('can do many modifications', function () {
    var data = { example: 'pants' };
    var opts = {
      code: 'obj.example = "shirts"; obj.thing = "stuff"'
    };

    var val = exec(data, opts);

    expect(val).to.deep.equal({
      example: 'shirts',
      thing: 'stuff'
    });
  });

  it('can use `opts` for shared storage across executions', function () {
    var data = {};
    var opts = {
      code: 'opts.n = opts.n || 0; obj.n = opts.n; opts.n +=1;'
    };

    expect(exec(data, opts)).to.have.property('n').and.to.equal(0);
    expect(opts).to.have.property('n').and.to.equal(1);

    expect(exec(data, opts)).to.have.property('n').and.to.equal(1);
    expect(opts).to.have.property('n').and.to.equal(2);
  });

  it('throws when the code is not JavaScript', function () {
    var opts = {
      code: 'definitely not code'
    };

    expect(function () {
      exec({}, opts);
    }).to.throw(SyntaxError);
  });
});
