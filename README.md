# json cli toolkit

[![Linux Build][1]][2]
[![Windows Build][12]][13]
[![Test Coverage][3]][4]
[![Code Climate][5]][6]
[![Downloads][7]][8]
[![Version][9]][8]
[![Dependency Status][10]][11]

[1]: https://travis-ci.org/catdad/json-cli-toolkit.svg?branch=master
[2]: https://travis-ci.org/catdad/json-cli-toolkit

[3]: https://codeclimate.com/github/catdad/json-cli-toolkit/badges/coverage.svg
[4]: https://codeclimate.com/github/catdad/json-cli-toolkit/coverage

[5]: https://codeclimate.com/github/catdad/json-cli-toolkit/badges/gpa.svg
[6]: https://codeclimate.com/github/catdad/json-cli-toolkit

[7]: https://img.shields.io/npm/dm/json-cli-toolkit.svg
[8]: https://www.npmjs.com/package/json-cli-toolkit
[9]: https://img.shields.io/npm/v/json-cli-toolkit.svg

[10]: https://david-dm.org/catdad/json-cli-toolkit.svg
[11]: https://david-dm.org/catdad/json-cli-toolkit

[12]: https://ci.appveyor.com/api/projects/status/github/catdad/json-cli-toolkit?branch=master&svg=true
[13]: https://ci.appveyor.com/project/catdad/json-cli-toolkit

## Install

Install globally so that the CLI is placed in your path.

```bash
npm install -g json-cli-toolkit
```

This will expose the command `json` in your path.

## Use

`json --help` is your friend.

* Common options
  * [`ignore`](#ignore)
  * [`multiline`](#multiline)
  * [`pretrim`](#pretrim)
  * [`pretty`](#pretty)
* Commands
  * [`delete`](#json-delete)
  * [`echo`](#json-echo)
  * [`exec`](#json-exec)
  * [`fill`](#json-fill)
  * [`filter`](#json-filter)
  * [`pluck`](#json-pluck)
  * [`set`](#json-set)
  * [`sort`](#json-sort)
  * [`wrap`](#json-wrap)

### Common options

#### ignore

Ignore input that is not json. By default, `json` will error for parsing errors.

**Examples:**

`json --ignore`

`json -i`

#### multiline

Read multiline input as one json object per line.

**Examples:**

`json --multiline`

`json -m`

#### pretrim

Remove non-json content from the beginning of the input.

**Examples:**

`json --pretrim`

`json -r`

#### pretty

Pretty-print the json output.

**Examples:**

`json --pretty`

`json -p`

### Commands

All commands have help in the CLI. You can access it as such:

```bash
json <command> --help
```

#### `json delete`

Remove a particular property and its value from the json.

`--attr`: The property to remove. Nested properties can be set using dot notation.

**Examples:**

```bash
json delete --attr propname
json delete --attr nested.prop

# Delete multiple properties at the same time
json delete --attr one --attr two
```

#### `json echo`

Print the input json to the output.

**Examples:**

```bash
json echo
json echo --pretty
```

#### `json exec`

Use arbitrary JavaScript to transform or filter the input json:

`--code`: The code to execute. This code will be called multiple times if running with the `multiline` flag. It has acess to the following global objects:
  - `obj`: An object, which is the JSON being treated. You can modify this object as you like, and the result will be used for the output. Setting `obj` to `undefined` will filter the json object out of the output.
  - `opts`: The options object for the `exec` command. This object is shared across all executions of the code, and can be used to store and share data between executions.
  - `_`: Lodash, for convenience.

**Examples:**

```bash
# Add a new property
json exec --code "obj.newProp = obj.one + obj.two"

# Filter out some input
json exec --multiline --code "if (obj.name !== 'thing') obj = undefined"
```

#### `json fill`

Transform json input using a whitelist or blacklist of properties.

`--exclude`: A list of properties to exlude, if present. This list is provided as space-separated properties. They can be top-level properties or nested properties using dot notation.

`--include`: A list of proerties to include, if present. This list is provided as space-separated properties. They can be top-level properties or nested properties using dot notation.

**Examples:**

```bash
# Use a whitelist to transform the json input
json fill --include thing nested.stuff

# Use a blacklist to remove properties from the json
json fill --exlude thing nested.stuff
```

#### `json filter`

Filter only json input entries that match specific rules:

`--attr`: The property to use in order to filter entries. If this flag is used alone, the existence of a value for this property will be treated as truthy, causing the entry will appear in the output. Nested properties can be accessed through dot notation.

`--equals`: Optional, used with `attr`. The entry will appear in the output only if the `attr` property value equals the value of this flag.

`--matches`: Optional, used with `attr`. The entry will appear in the output only if the `attr` property value matches the regular expression defined in this flag.

`--not`: Optional, used with any of the other flags. It will flip the comparison resulting from the other flags being used.

**Examples:**

```bash
json filter --attr propname --equals muffins
json filter --attr nested.prop --matches ^[0-9]{3,}
json filter --attr propname --not --equals poptarts
```

#### `json pluck`

Get a value from the json object and print it to output.

`--attr`: The property to get. Nested properties can be accessed through dot notation.

**Examples:**

```bash
json pluck --attr propname
json pluck --attr nested.prop
```

#### `json set`

Set a particular value in the json object.

`--attr`: The property to set. Nested properties can be set using dot notation.

`--inc`: When set, the `value` will be incremented by the value set in this flag each time that a new json object is read in multiline mode.

`--value`: The value to set to the property.

**Examples:**

```bash
json set --attr propname --value muffins
json set --attr nested.prop --value pineapples

# Increment the value being set by 1 each time
json set --multiline --attr count --value 1 --inc

# Decrement the value being set by 5 each time
json set --multiline --attr fiveLess --value 0 --inc -5
```

#### `json sort`

Sorts multiple json records. This is most useful when used along with the `--multiline` flag, as sorting a single json record just results in that record.

_Note: since this command needs to read the entire input content, it may not work with very large datasets like the other commands. Use responsibly._

`--attr`: The property in the json objects to use to sort. Nesxted properties can be defined using dot notation.

`--order`: The sort order to use. The acceptable values are `ascending` (or `1`) and `descending` (or `-1`). The default order is ascending, when this flag is not defined.

**Examples:**

```bash
json sort --multiline --attr propname
json sort --multiline --attr some.property --order ascending
json sort -m --attr propname --order -1
```

#### `json wrap`

Wrap the input json in a new object at a defined path.

`--attr`: The property to which to assing the input json. Nested properties can be assigned using dot notation.

**Examples:**

```bash
json wrap --attr propname
json wrap --attr nested.prop
```
