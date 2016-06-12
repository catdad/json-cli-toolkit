/* jshint node: true */

var yargs = require('yargs');

// Commond options (ones handled by toolkit or util) go here,
// so that they are available on all commands.
function addCommon(yargs) {
    return yargs
        .option('ignore', {
            descrie: 'Ignore non-json input instead of erroring',
            alias: 'i'
        })
        .option('multiline', {
            describe: 'Read each line of the input as a separate json object',
            alias: 'm'
        })
        .option('pretrim', {
            describe: 'Removes non-json text before the json object',
            alias: 'r'
        })
        .option('pretty', {
            describe: 'Pretty-print the resulting json',
            alias: 'p'
        });
}

var argv = addCommon(yargs)
    .command('echo', 'Echoes the input json', function(yargs) {
        return addCommon(yargs).help();
    })
    .command('filter', 'Filters only json that matches specific rules', function(yargs) {
        return addCommon(yargs)
            .option('attr', {
                describe: 'The attribute to use for filtering. It can be used alone to denote the existence of the property, or with either of the other flags.'
            })
            .option('equals', {
                describe: 'When set, the value defined by `attr` must equal the value of the flag.'
            })
            .option('matches', {
                describe: 'When set, the value defined by `attr` must match the regular expression defined by this flag.'
            })
            .help();
    })
    .command('pluck', 'Gets a single property from the input json and prints it', function(yargs) {
        return addCommon(yargs)
            .option('attr', {
                describe: 'The attribute to get. It can be nested, using dot notation.'
            })
            .help();
    })
    .command('set', 'Set a json property to a value', function(yargs) {
        return addCommon(yargs)
            .option('attr', {
                describe: 'The attribute to set. It can be nested, using dot notation.'
            })
            .option('value', {
                describe: 'The value to set the property to.'
            })
            .help();
    })
    .alias('help', 'h')
    .alias('help', '?')
    .alias('version', 'v')
    .help()
    .version()
    .argv;

argv._yargs = yargs;

module.exports = argv;
