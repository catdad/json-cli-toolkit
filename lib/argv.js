/* eslint max-len: off, no-underscore-dangle: off */

var Yargs = require('yargs');
var _ = require('lodash');

function addOptions(yargs, options) {
  if (!_.isPlainObject(options)) {
    return yargs;
  }

  return _.reduce(options, function (memo, value, key) {
    if (_.isString(value)) {
      return memo.describe(key, value);
    }

    return memo.option(key, value);
  }, yargs);
}

// Commond options (ones handled by toolkit or util) go here,
// so that they are available on all commands.
function addCommon(yargs, otherOptions) {
  return addOptions(
        yargs
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
            }),
        otherOptions
    );
}

var argv = addCommon(Yargs)
    .command('delete', 'Remove a property from the input json', function (yargs) {
      return addCommon(yargs, {
        attr: 'The attribute to remove. It can be nested, using dot notation.'
      });
    })
    .command('echo', 'Echo the input json', function (yargs) {
      return addCommon(yargs);
    })
    .command('exec', 'Execute arbitrary code to transform the json', function (yargs) {
      return addCommon(yargs, {
        code: 'The code to execute. This may need to be properly escaped to work as a command line argumnt.'
      });
    })
    .command('filter', 'Filter only json that matches specific rules', function (yargs) {
      return addCommon(yargs, {
        attr: 'The attribute to use for filtering. It can be used alone to denote the existence of the property, or with either of the other flags.',
        equals: 'When set, the value defined by `attr` must equal the value of the flag.',
        matches: 'When set, the value defined by `attr` must match the regular expression defined by this flag.',
        not: 'Used with any of the other flags, it will flip the comparison that results from either of those two options.'
      });
    })
    .command('pluck', 'Get a single property from the input json and prints it', function (yargs) {
      return addCommon(yargs, {
        attr: 'The attribute to get. It can be nested, using dot notation.'
      });
    })
    .command('set', 'Set a json property to a value', function (yargs) {
      return addCommon(yargs, {
        attr: 'The attribute to set. It can be nested, using dot notation.',
        inc: 'Used to increment the value being set by the value of this flag.',
        value: 'The value to set the property to.'
      });
    })
    .command('sort', 'Sort multiple json entries', function (yargs) {
      return addCommon(yargs, {
        attr: 'The attribute to use for sorting.',
        order: 'Either ascending (1) or descending (-1).'
      });
    })
    .command('wrap', 'Wrap the input json in a new object at a defined path', function (yargs) {
      return addCommon(yargs, {
        attr: 'The attribute to which to set the input as a value.'
      });
    })
    .alias('help', 'h')
    .alias('help', '?')
    .alias('version', 'v')
    .help()
    .version()
    .argv;

argv._yargs = Yargs;

module.exports = argv;
