/* jshint node: true, unused: true */

var _ = require('lodash');
var ns = require('node-stream');
var through = require('through2');
var pump = require('pump');

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

function commandStream(command, opts) {
    return commands[command](opts);
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

    function serialize(data) {
        if (arguments.length > 1) {
            return serialize(data) + serialize.apply(null, [].slice.call(arguments, 1));
        }

        if (_.isString(data)) {
            return data;
        } else if (data !== undefined) {
            return printJson(data);
        }

        return '';
    }

    var wroteOutput = false;

    pump(
        input,
        (opts.multiline) ? ns.split() : ns.wait(),
        util.transform(opts),
        commandStream(command, opts),
        through.obj(function onData(data, enc, cb) {
            console.log('read:', data);

            if (data !== undefined) {
                wroteOutput = true;
                this.push(serialize(data, '\n'));
            }

            cb();
        }, function onFlush(cb) {
            if (!wroteOutput) {
                this.push('\n');
            }

            cb(null);
        }),
        function (err) {
            if (err) {
                output.emit('error', err);
            }
        }
    ).pipe(output);
};
