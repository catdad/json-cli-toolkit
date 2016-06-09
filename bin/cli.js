#!/usr/bin/env node

var through = require('through2');
var yargs = require('yargs');
var argv = yargs
    .alias('m', 'multiline')
    .alias('p', 'pretty')
    .argv;

var command = argv._[0];

var input = through();
var output = through();

var toolkit = require('../toolkit.js');

toolkit({
    input: input,
    output: output,
    command: command,
    argv: argv
});

process.stdin.pipe(input);
output.pipe(process.stdout);

handleError(input);
handleError(output);

function handleError(stream) {
    stream.on('error', function(err) {
        console.error('stream error:', err);
        console.error(err.stack);
        process.exit(1);
    });
}
