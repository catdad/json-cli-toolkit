#!/usr/bin/env node

var through = require('through2');

var argv = require('../lib/argv.js');

var command = argv._[0];

if (!command) {
    argv._yargs.showHelp();
    process.exit(1);
}

var toolkit = require('../toolkit.js');

// All streams used in the tool will be through stream,
// it just makes everything easier.
var input = through();
var output = through();

// Handle all the errors
handleError(input);
handleError(output);

// Pipe the through stream to the actual console
// input and output.
process.stdin.pipe(input);
output.pipe(process.stdout);

toolkit({
    input: input,
    output: output,
    command: command,
    argv: argv
});

function handleError(stream) {
    stream.on('error', function(err) {
        console.error('stream error: %s', err.stack);
        process.exit(1);
    });
}
