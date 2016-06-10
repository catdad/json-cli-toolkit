#!/usr/bin/env node

var through = require('through2');
var yargs = require('yargs');
var argv = yargs
    .alias('m', 'multiline')
    .alias('p', 'pretty')
    .alias('r', 'pretrim')
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

handleError(input);
handleError(output);

process.stdin.pipe(input);
output.pipe(process.stdout);

function handleError(stream) {
    stream.on('error', function(err) {
        console.error('stream error: %s', err.stack);
        process.exit(1);
    });
}
