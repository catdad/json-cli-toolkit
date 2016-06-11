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

function runCommand(command, data, opts) {
    return commands[command](data, opts);
}

module.exports = function(options) {
    var command = options.command;
    var input = options.input;
    var output = options.output;
    var opts = options.argv;
    
    
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
    
    if (opts.multiline) {
        // the first padding will not add a new line
        var first = true;
        
        ns.forEach.json(transform(byline(input)), function(data) {
            var out = run(data);
            
            if (out !== undefined && first) {
                // skip padding with a new line
                first = false;
            } else if (out !== undefined) {
                writeData('\n');
            }
            
            writeData(out);
        }, function(err) {
            if (err) {
                return output.emit('error', err);
            }
            
            output.end();
        });
    } else {
        ns.wait.json(transform(input), function(err, data) {
            if (err) {
                return output.emit('error', err);
            }
            
            writeData(run(data));
            output.end();
        });
    }
};
