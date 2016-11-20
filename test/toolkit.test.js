/* jshint node: true, mocha: true */

var path = require('path');
var util = require('util');

var expect = require('chai').expect;
var _ = require('lodash');
var through = require('through2');
var ns = require('node-stream');
var shellton = require('shellton');
var root = require('rootrequire');

var toolkit = require('../toolkit.js');

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

    ns.wait(options.output, function(err, dataBuff) {
        if (err) {
            return callback(err);
        }

        callback(undefined, dataBuff.toString());
    });

    if (data !== undefined) {
        input.write(data);
        input.end();
    } else {
        return input;
    }
}

function executeCli(options, data, callback) {
    var env = {
        PATH: path.dirname(process.execPath) + path.delimiter + process.env.PATH
    };
    var cwd = root;
    var cli = path.resolve(root, 'bin/cli.js');
    var argv = _.reduce(options.argv || {}, function(memo, value, key) {
        if (value === true) {
            return memo + util.format(' --%s', key);
        } else if (value === false) {
            return memo + util.format(' --no-%s', key);
        } else if (_.isNumber(value)) {
            return memo + util.format(' --%s %s', key, value);
        } else {
            return memo + util.format(' --%s "%s"', key, value);
        }
    }, options.command);
    var task = util.format('%s "%s" %s', 'node', cli, argv);

    var input = options.input || through();

    shellton({
        task: task,
        cwd: cwd,
        env: env,
        stdin: input
    }, function(err, stdout, stderr) {
        if (err) {
            var l = stderr.trim().split('\n').shift();
            var e = new Error(l);
            e.code = err.code;

            return callback(e);
        }

        callback(undefined, stdout);
    });

    if (data !== undefined) {
        input.write(data);
        input.end();
    } else {
        return input;
    }
}

function runTests(execute) {
    it('takes and input and output streams', function(done) {
        // single line of json
        var DATA = JSON.stringify({ example: 'json' });

        execute({
            command: 'echo'
        }, DATA, function(err, data) {
            if (err) {
                return done(err);
            }

            expect(data).to.equal(DATA + '\n');
            done();
        });
    });

    it('executes commands on multiline streams with a flag', function(done) {
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
        }, DATA, function(err, data) {
            if (err) {
                return done(err);
            }

            expect(data).to.equal(DATA + '\n');
            done();
        });
    });

    it('multiline mode does not print anything when the command returns no data', function(done) {
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
        }, DATA, function(err, data) {
            if (err) {
                return done(err);
            }

            expect(data).to.equal(util.format('%s\n%s\n', 'json', 'pants'));
            done();
        });
    });

    it('can pretty-print json with a flag', function(done) {
        var DATA = { example: 'pants' };

        execute({
            command: 'echo',
            argv: {
                pretty: true
            }
        }, JSON.stringify(DATA), function(err, data) {
            if (err) {
                return done(err);
            }

            expect(data).to.equal(JSON.stringify(DATA, false, 4) + '\n');
            done();
        });
    });

    it('handles slowly writing json in single mode', function(done) {
        var json = JSON.stringify({ one: 'two', three: 'four', five: 'six'});

        var input = execute({
            command: 'echo'
        }, undefined, function(err, data) {
            if (err) {
                return done(err);
            }

            expect(data.toString().trim()).to.equal(json);

            done();
        });

        var counter = 0;
        var throttle = through(function(data, enc, cb) {
            setTimeout(function() {
                cb(null, data);
            }, counter++);
        });

        throttle.pipe(input);

        var copy = json;

        while(copy.length) {
            throttle.write(copy.slice(0,5));
            copy = copy.slice(5);
        }

        throttle.end();
    });

    it('handles slowly writing json in multiline', function(done) {
        var json = [{ one: 'two'}, { three: 'four'}, { five: 'six'}].map(toJson).join('\n');

        var input = execute({
            command: 'echo',
            argv: {
                multiline: true
            }
        }, undefined, function(err, data) {
            if (err) {
                return done(err);
            }

            expect(data.toString().trim()).to.equal(json);

            done();
        });

        var counter = 0;
        var throttle = through(function(data, enc, cb) {
            setTimeout(function() {
                cb(null, data);
            }, counter++);
        });

        throttle.pipe(input);

        var copy = json;

        while(copy.length) {
            throttle.write(copy.slice(0,5));
            copy = copy.slice(5);
        }

        throttle.end();
    });

    it('errors if the input is not json', function(done) {
        execute({
            command: 'echo',
            argv: {}
        }, 'definitely not json', function(err, data) {
            expect(err).to.be.instanceOf(Error);
            expect(err.toString()).to.match(/SyntaxError/);

            done();
        });
    });

    it('errors if one line in multiline input is not json', function(done) {
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
        }, DATA, function(err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.toString()).to.match(/SyntaxError/);

            done();
        });
    });

    it('errors if the command is not known', function(done) {
        var DATA = '{}';

        execute({
            command: 'fudge',
            argv: {}
        }, DATA, function(err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.contain('"fudge" is not a known command');

            done();
        });
    });

    it('errors if a command has a runtime error in single line mode', function(done) {
        var DATA = '{}';

        execute({
            command: 'exec',
            argv: {
                code: 'not javascript code'
            }
        }, DATA, function(err) {
            expect(err).to.be.instanceOf(Error);

            done();
        });
    });

    it('errors if a command has a runtime error in multiline mode', function(done) {
        var DATA = '{}\n{}\n{}';

        execute({
            command: 'exec',
            argv: {
                code: 'not javascript code',
                multiline: true
            }
        }, DATA, function(err) {
            expect(err).to.be.instanceOf(Error);

            done();
        });
    });

    describe('command:', function() {
        function testCommand(command, opts, done) {
            var DATA = opts.data;
            var OUT = opts.out !== undefined ? opts.out : DATA;
            var ERROR = !!opts.error;
            var argv = opts.opts;

            execute({
                command: command,
                argv: argv
            }, DATA, function(err, out) {
                if (ERROR) {
                    expect(err).to.be.instanceOf(Error);
                    return done();
                }

                if (err) {
                    return done(err);
                }

                // there should always be a new line at the end
                expect(out).to.equal(OUT + '\n');

                done();
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
            }
        };

        _.forEach(commands, function(val, command) {
            describe(util.format('"%s"', command), function() {
                it('positive test', function(done) {
                    testCommand(command, val.positive, done);
                });

                it('negative test', function(done) {
                    testCommand(command, val.negative, done);
                });
            });
        });
    });
}

describe('[toolkit]', function() {
    runTests(executeApi);
});

describe('[cli]', function() {
    runTests(executeCli);
});
