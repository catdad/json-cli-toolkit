/* jshint node: true */

var yargs = require('yargs');

// Commond options (ones handled by toolkit or util) go here,
// so that they are available on all commands.
function addCommon(yargs) {
    return yargs
        .option('ignore', {
            describe: 'Ignore non-json input instead of erroring',
            alias: 'i'
        })
        .option('multiline', {
            describe: 'Read each line of the input as a separate json object',
            alias: 'm'
        })
        .option('pretrim', {
            describe: 'Remove non-json text before the json object',
            alias: 'r'
        })
        .option('pretty', {
            describe: 'Pretty-print the resulting json',
            alias: 'p'
        });
}

var argv = addCommon(yargs)
    .command('delete', 'Remove a property from the input json', function(yargs) {
        return addCommon(yargs)
            .option('attr', {
                describe: 'The attribute to remove. It can be nested, using dot notation.'
            });
    })
    .command('echo', 'Echo the input json', function(yargs) {
        return addCommon(yargs);
    })
    .command('exec', 'Execute arbitrary code to transform the json', function(yargs) {
        return addCommon(yargs)
            .option('code', {
                describe: 'The code to execute. This may need to be properly escaped to work as a command line argumnt.'
            });
    })
    .command('filter', 'Filter only json that matches specific rules', function(yargs) {
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
            .option('not', {
                describe: 'Used with any of the other flags, it will flip the comparison that results from either of those two options.'
            });
    })
    .command('pluck', 'Get a single property from the input json and prints it', function(yargs) {
        return addCommon(yargs)
            .option('attr', {
                describe: 'The attribute to get. It can be nested, using dot notation.'
            });
    })
    .command('set', 'Set a json property to a value', function(yargs) {
        return addCommon(yargs)
            .option('attr', {
                describe: 'The attribute to set. It can be nested, using dot notation.'
            })
            .option('value', {
                describe: 'The value to set the property to.'
            });
    })
    .alias('help', 'h')
    .alias('help', '?')
    .alias('version', 'v')
    .help()
    .version()
    .argv;

argv._yargs = yargs;

module.exports = argv;
