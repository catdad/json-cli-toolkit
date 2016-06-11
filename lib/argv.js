/* jshint node: true */

var yargs = require('yargs');

// Commond options (ones handled by toolkit or util) go here,
// so that they are available on all commands.
function addCommon(yargs) {
    return yargs
        .option('multiline', {
            describe: 'Read each line of the input as a separate json object',
            alias: 'm'
        })
        .option('pretty', {
            describe: 'Pretty-print the resulting json',
            alias: 'p'
        })
        .option('pretrim', {
            describe: 'Removes non-json text before the json object',
            alias: 'r'
        });
}

var argv = addCommon(yargs)
    .command('echo', 'Echoes the input json', function(yargs) {
        return addCommon(yargs).help();
    })
    .command('pluck', 'Gets a single property from the input json and prints it', function(yargs) {
        return addCommon(yargs)
            .option('attr', {
                describe: 'The attribute to get. It can be nested, using dot notation.'
            })
            .help();
    })
    .alias('help', 'h')
    .alias('h', '?')
    .help()
    .argv;

argv._yargs = yargs;

module.exports = argv;
