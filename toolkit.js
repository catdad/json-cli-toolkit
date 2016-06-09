/* jshint node: true */

var ns = require('node-stream');
var _ = require('lodash');

var prettyPrint = false;

var commands = {
    pluck: require('./lib/pluck.js')
};

function readJson(instream, done) {
    
}

function readMultilineJson(instream, onJson, done) {
    
}

function printJson(obj) {
    if (prettyPrint) {
        return JSON.stringify(obj, false, 4);
    } else {
        return JSON.stringify(obj);
    }
}

function runCommand(command, data, opts) {
    return commands[command](data, opts);
}

module.exports = function(options) {
    var command = options.command;
    var input = options.input;
    var output = options.output;
    var opts = options.argv;
    
    if (opts.pretty) {
        prettyPrint = true;
    }
    
    if (opts.multiline) {
        // TODO implement multiline
        output.end();
    } else {
        ns.wait.json(input, function(err, data) {
            if (err) {
                return output.emit('error', err);
            }
            
            var out = runCommand(command, data, opts);
            
            if (_.isString(out)) {
                output.write(out);
            } else if (out !== undefined) {
                output.write(printJson(out));
            }
            
            output.end();
        });
    }
};
