/* jshint node: true */

var _ = require('lodash');
var ns = require('node-stream');
var byline = require('byline');

var commands = require('./lib/command.js');
var util = require('./lib/util.js');

function printer(prettyPrint) {
    return function printJson(obj) {
        if (prettyPrint) {
            return JSON.stringify(obj, false, 4);
        } else {
            return JSON.stringify(obj);
        }
    };
}

function validateCommand(command) {
    return !!commands[command];
}

function runCommand(command, data, opts) {
    return commands[command](data, opts);
}

function emitAsync(stream, event, data) {
    setImmediate(stream.emit.bind(stream), event, data);
}

module.exports = function(options) {
    var command = options.command;
    var input = options.input;
    var output = options.output;
    var opts = options.argv;

    if (!validateCommand(command)) {
        // make sure this is async, because sometimes people call
        // a command before registering error handlers on it
        return emitAsync(output, 'error', new Error('"' + command + '" is not a known command'));
    }

    var printJson = printer(opts.pretty);

    function writeData(data, pad) {
        if (_.isString(data)) {
            output.write(data);
        } else if (data !== undefined) {
            output.write(printJson(data));
        }
    }

    function run(data) {
        return runCommand(command, data, opts);
    }

    function transform(stream) {
        return util.transform(stream, opts);
    }

    function itterate(onData, onEnd) {

        var commandErr;

        if (opts.multiline) {
            ns.forEach.json(transform(byline(input)), function(data) {
                if (commandErr) {
                    return;
                }

                try {
                    onData(data);
                } catch (e) {
                    commandErr = e;
                }
            }, function(err) {
                if (err) {
                    return onEnd(err);
                }

                if (commandErr) {
                    return onEnd(commandErr);
                }

                onEnd();
            });
        } else {
            ns.wait.json(transform(input), function(err, data) {
                if (err) {
                    return onEnd(err);
                }

                try {
                    onData(data);
                } catch (e) {
                    return onEnd(e);
                }

                onEnd();
            });
        }
    }

    // the first padding will not add a new line
    var first = true;

    itterate(function onData(data) {
        var out = run(data);

        if (out !== undefined && first) {
            // skip padding with a new line
            first = false;
        } else if (out !== undefined) {
            writeData('\n');
        }

        writeData(out);
    }, function onEnd(err) {
        if (err) {
            return output.emit('error', err);
        }

        output.end('\n');
    });
};
