#!/usr/bin/env node

var through = require('through2');
var yargs = require('yargs');
var argv = yargs
    .option('multiline', {
        describe: 'Read each line of the input as a separate JSON object',
        alias: 'm'
    })
    .option('pretty', {
        describe: 'Pretty-print the resulting JSON',
        alias: 'p'
    })
    .option('pretrim', {
        describe: 'Removes non-json text before the JSON object',
        alias: 'r'
    })
    .command('echo', 'Echoes the input JSON', function(yargs) {
        return yargs
            .help();
    })
    .command('pluck', 'Gets a single property from the input JSON and prints it', function(yargs) {
        return yargs
            .option('attr', {
                describe: 'The attribute to get. It can be nested, using dot notation.'
            })
            .help();
    })
    .alias('help', 'h')
    .alias('h', '?')
    .help()
    .argv;

var command = argv._[0];

if (!command) {
    yargs.showHelp();
    process.exit(1);
}

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
