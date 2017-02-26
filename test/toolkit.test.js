/* jshint node: true, mocha: true */
/* eslint-disable object-property-newline */

var path = require('path');
var util = require('util');
var os = require('os');

var expect = require('chai').expect;
var _ = require('lodash');
var shellton = require('shellton');
var root = require('rootrequire');
var ns = require('node-stream');
var through = ns.through;
var async = require('async');

var toolkit = require('../toolkit.js');

var undef = _.noop();

function toJson(data) {
  return JSON.stringify(data);
}

function executeApi(options, data, callback) {
  var input = through();
  var output = through();

  options.input = options.input || input;
  options.output = options.output || output;

  options.argv = options.argv || {};

  toolkit(options);

  ns.wait(options.output, function (err, dataBuff) {
    if (err) {
      return callback(err);
    }

    return callback(null, dataBuff.toString());
  });

  if (!_.isUndefined(data)) {
    input.write(data);
    input.end();
  }

  return input;
}

function executeCli(options, data, callback) {
  var env = {
    // eslint-disable-next-line no-process-env
    PATH: path.dirname(process.execPath) + path.delimiter + process.env.PATH
  };
  var cwd = root;
  var cli = path.resolve(root, 'bin/cli.js');
  var argv = _.reduce(options.argv || {}, function (memo, value, key) {
    if (value === true) {
      return memo + util.format(' --%s', key);
    } else if (value === false) {
      return memo + util.format(' --no-%s', key);
    } else if (_.isNumber(value)) {
      return memo + util.format(' --%s %s', key, value);
    } else if (_.isArray(value)) {
      return memo + util.format(' --%s ', key) + value.join(' ');
    }

    return memo + util.format(' --%s "%s"', key, value);

  }, options.command);

  var task = util.format('%s "%s" %s', 'node', cli, argv);

  var input = options.input || through();

  shellton({
    task: task,
    cwd: cwd,
    env: env,
    stdin: input
  }, function (err, stdout, stderr) {
    if (err) {
      var e = new Error(stderr
        .trim()
        .split('\n')
        .shift());

      e.code = err.code;

      return callback(e);
    }

    return callback(null, stdout);
  });

  if (!_.isUndefined(data)) {
    input.write(data);
    input.end();
  }

  return input;
}

function runTests(execute) {
  it('takes and input and output streams', function (done) {
    // single line of json
    var DATA = JSON.stringify({ example: 'json' });

    execute({
      command: 'echo'
    }, DATA, function (err, data) {
      if (err) {
        return done(err);
      }

      expect(data).to.equal(DATA + '\n');

      return done();
    });
  });

  it('executes commands on multiline streams with a flag', function (done) {
    var DATA = util.format(
      '%s\n%s\n%s',
      JSON.stringify({ example: 'json' }),
      JSON.stringify({ more: 'json' }),
      JSON.stringify({ yay: 'pineapples' })
    );

    execute({
      command: 'echo',
      argv: {
        multiline: true
      }
    }, DATA, function (err, data) {
      if (err) {
        return done(err);
      }

      expect(data).to.equal(DATA + '\n');

      return done();
    });
  });

  it('can trim non-json data from the front of json lines', function (done) {
    var JSON_DATA = [
      JSON.stringify({ example: 'json' }),
      JSON.stringify({ more: 'json' }),
      JSON.stringify({ yay: 'pineapples' })
    ];

    var DATA = JSON_DATA.map(function (str) {
      return Math.random().toString(36) + str;
    }).join('\n');

    execute({
      command: 'echo',
      argv: {
        multiline: true,
        pretrim: true
      }
    }, DATA, function (err, data) {
      if (err) {
        return done(err);
      }

      expect(data).to.equal(JSON_DATA.join('\n') + '\n');

      return done();
    });
  });

  it('can ignore non-json data', function (done) {
    var JSON_DATA = [
      JSON.stringify({ example: 'json' }),
      JSON.stringify({ more: 'json' }),
      JSON.stringify({ yay: 'pineapples' })
    ];

    var DATA = JSON_DATA.map(function (str) {
      return Math.random().toString(36) + '\n' + str;
    }).join('\n');

    execute({
      command: 'echo',
      argv: {
        multiline: true,
        ignore: true
      }
    }, DATA, function (err, data) {
      if (err) {
        return done(err);
      }

      expect(data).to.equal(JSON_DATA.join('\n') + '\n');

      return done();
    });
  });

  it('multiline mode does not print anything when the command returns no data', function (done) {
    var DATA = util.format(
      '%s\n%s\n%s',
      JSON.stringify({ example: 'json' }),
      JSON.stringify({ example: 'pants' }),
      JSON.stringify({ yay: 'pineapples' })
    );

    execute({
      command: 'pluck',
      argv: {
        multiline: true,
        attr: 'example'
      }
    }, DATA, function (err, data) {
      if (err) {
        return done(err);
      }

      expect(data).to.equal(util.format('%s\n%s\n', 'json', 'pants'));

      return done();
    });
  });

  it('can pretty-print json with a flag', function (done) {
    var DATA = { example: 'pants' };

    execute({
      command: 'echo',
      argv: {
        pretty: true
      }
    }, JSON.stringify(DATA), function (err, data) {
      if (err) {
        return done(err);
      }

      expect(data).to.equal(JSON.stringify(DATA, false, 4) + '\n');

      return done();
    });
  });

  it('handles slowly writing json in single mode', function (done) {
    var json = JSON.stringify({ one: 'two',
      three: 'four',
      five: 'six'});

    var input = execute({
      command: 'echo'
    }, undef, function (err, data) {
      if (err) {
        return done(err);
      }

      expect(data.toString().trim()).to.equal(json);

      return done();
    });

    var counter = 0;
    var throttle = through(function (data, enc, cb) {
      setTimeout(function () {
        cb(null, data);
      }, counter++);
    });

    throttle.pipe(input);

    var copy = json;

    while (copy.length) {
      throttle.write(copy.slice(0, 5));
      copy = copy.slice(5);
    }

    throttle.end();
  });

  it('handles slowly writing json in multiline', function (done) {
    var json = [{ one: 'two'}, { three: 'four'}, { five: 'six'}].map(toJson).join('\n');

    var input = execute({
      command: 'echo',
      argv: {
        multiline: true
      }
    }, undef, function (err, data) {
      if (err) {
        return done(err);
      }

      expect(data.toString().trim()).to.equal(json);

      return done();
    });

    var counter = 0;
    var throttle = through(function (data, enc, cb) {
      setTimeout(function () {
        cb(null, data);
      }, counter++);
    });

    throttle.pipe(input);

    var copy = json;

    while (copy.length) {
      throttle.write(copy.slice(0, 5));
      copy = copy.slice(5);
    }

    throttle.end();
  });

  it('errors if the input is not json', function (done) {
    execute({
      command: 'echo',
      argv: {}
    }, 'definitely not json', function (err) {
      expect(err).to.be.instanceOf(Error);
      expect(err.toString()).to.match(/SyntaxError/);

      done();
    });
  });

  it('errors if one line in multiline input is not json', function (done) {
    var DATA = util.format(
            '%s\n%s\n%s',
            JSON.stringify({ example: 'pants' }),
            'definitely not json',
            JSON.stringify({ yay: 'pineapples' })
        );

    execute({
      command: 'pluck',
      argv: {
        multiline: true,
        attr: 'example'
      }
    }, DATA, function (err) {
      expect(err).to.be.instanceOf(Error);
      expect(err.toString()).to.match(/SyntaxError/);

      done();
    });
  });

  it('errors if the command is not known', function (done) {
    var DATA = '{}';

    execute({
      command: 'fudge',
      argv: {}
    }, DATA, function (err) {
      expect(err).to.be.instanceOf(Error);
      expect(err.message).to.contain('"fudge" is not a known command');

      done();
    });
  });

  it('errors if a command has a runtime error in single line mode', function (done) {
    var DATA = '{}';

    execute({
      command: 'exec',
      argv: {
        code: 'not javascript code'
      }
    }, DATA, function (err) {
      expect(err).to.be.instanceOf(Error);

      done();
    });
  });

  it('errors if a command has a runtime error in multiline mode', function (done) {
    var DATA = '{}\n{}\n{}';

    execute({
      command: 'exec',
      argv: {
        code: 'not javascript code',
        multiline: true
      }
    }, DATA, function (err) {
      expect(err).to.be.instanceOf(Error);

      done();
    });
  });

  describe('command:', function () {
    function execCommand(command, opts, done) {
      var DATA = opts.data;
      var argv = opts.opts;

      execute({
        command: command,
        argv: argv
      }, DATA, done);
    }

    function assertCommand(err, out, opts) {
      var DATA = opts.data;
      var OUT = _.isUndefined(opts.out) ? DATA : opts.out;
      var ERROR = !!opts.error;

      if (ERROR) {
        expect(err).to.be.instanceOf(Error);

        return;
      }

      if (err) {
        throw err;
      }

      // there should always be a new line at the end
      expect(out).to.equal(OUT + '\n');
    }

    function testCommand(command, opts, done) {
      execCommand(command, opts, function (err, out) {
        try {
          assertCommand(err, out, opts);
        } catch (e) {
          return done(e);
        }

        return done();
      });
    }

    var commands = {
      echo: {
        positive: {
          data: JSON.stringify({ one: 1 }),
          opts: {}
        },
        negative: {
          data: 'not json',
          opts: {},
          error: true
        }
      },
      pluck: {
        positive: {
          data: JSON.stringify({ one: 'two' }),
          out: 'two',
          opts: {
            attr: 'one'
          }
        },
        negative: {
          data: JSON.stringify({ one: 'two' }),
          out: '',
          opts: {
            attr: 'notone'
          }
        }
      },
      filter: {
        positive: {
          data: JSON.stringify({ one: 'two' }),
          opts: {
            attr: 'one'
          }
        },
        negative: {
          data: JSON.stringify({ one: 'two' }),
          out: '',
          opts: {
            attr: 'notone'
          }
        }
      },
      set: {
        positive: {
          data: '{}',
          out: JSON.stringify({ one: 2 }),
          opts: {
            attr: 'one',
            value: 2
          }
        },
        negative: {
          data: '{}',
          opts: {
            attr: 'one'
          }
        }
      },
      exec: {
        positive: {
          data: '{}',
          out: JSON.stringify({ one: 2 }),
          opts: {
            code: 'obj.one = 2'
          }
        },
        negative: {
          data: '{}',
          out: '',
          opts: {
            code: 'obj = undefined'
          }
        }
      },
      wrap: {
        positive: {
          data: '{}',
          out: JSON.stringify({ name: {} }),
          opts: {
            attr: 'name'
          }
        },
        // what is a negative test here?
        negative: {
          data: '{}',
          out: JSON.stringify({ 'undefined': {} }),
          opts: {}
        }
      },
      sort: {
        positive: {
          data: [{ prop: 2 }, { prop: 3 }, { prop: 1 }].map(toJson).join('\n'),
          out: [{ prop: 1 }, { prop: 2 }, { prop: 3 }].map(toJson).join('\n'),
          opts: {
            attr: 'prop',
            multiline: true
          }
        },
        negative: {
          data: '',
          out: '',
          opts: {
            ignore: true
          }
        }
      },
      fill: {
        positive: {
          data: [{ a: 1, b: 2, c: { d: 1, e: 2 } }].map(toJson).join('\n'),
          out: [{ a: 1, c: { e: 2 } }].map(toJson).join('\n'),
          opts: {
            include: ['a', 'c.e']
          }
        },
        negative: {
          data: [{ a: 1, b: 2, c: { d: 1, e: 2 } }].map(toJson).join('\n'),
          out: [{ a: 1, c: { e: 2 } }].map(toJson).join('\n'),
          opts: {
            exclude: ['b', 'c.d']
          }
        }
      }
    };

    // we will run all the tests in parallel, and record the data
    // to assert on later in each test
    var asyncTasks = _.reduce(commands, function (memo, val, command) {
      memo[command + '.positive'] = function (next) {
        execCommand(command, val.positive, function (err, out) {
          next(null, {
            err: err,
            out: out
          });
        });
      };

      memo[command + '.negative'] = function (next) {
        execCommand(command, val.negative, function (err, out) {
          next(null, {
            err: err,
            out: out
          });
        });
      };

      return memo;
    }, {});

    var results;

    before(function Before(done) {
      var cpus = os.cpus().length;
      this.timeout(500 * cpus);

      var start = Date.now();
      async.parallelLimit(asyncTasks, cpus, function (err, data) {
        console.log('before done in', Date.now() - start);

        results = data;
        done(err);
      });
    });

    _.forEach(commands, function (val, command) {
      describe(util.format('"%s"', command), function () {
        it('positive test', function () {
          var data = results[command + '.positive'];

          assertCommand(data.err, data.out, val.positive);
        });

        it('negative test', function () {
          var data = results[command + '.negative'];

          assertCommand(data.err, data.out, val.negative);
        });
      });
    });
  });
}

describe('[toolkit]', function () {
  runTests(executeApi);
});

describe.only('[cli]', function () {
  runTests(executeCli);
});
