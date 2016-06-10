/* jshint node: true */

var _ = require('lodash');
var ns = require('node-stream');
var byline = require('byline');

var commands = require('./lib/command.js');
var util = require('./lib/util.js');

var prettyPrint = false;

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
    
    if (opts.multiline) {
        // the first padding will not add a new line
        var padding = '';
        
        ns.forEach.json(util.transform(byline(input), opts), function(data) {
            var out = run(data);
            
            writeData(padding);
            writeData(out);
            
            // set the padding for the following data
            if (out !== undefined) {
                padding = '\n';
            } else {
                padding = '';
            }
        }, function(err) {
            if (err) {
                return output.emit('error', err);
            }
            
            output.end();
        });
    } else {
        ns.wait.json(util.transform(input, opts), function(err, data) {
            if (err) {
                return output.emit('error', err);
            }
            
            writeData(run(data));
            output.end();
        });
    }
};
