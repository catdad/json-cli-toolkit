# json cli toolkit

[![Build][1]][2] 
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

## Install

Install globally so that the CLI is placed in your path.

```bash
npm install -g json
```

## Use

`json --help` is your friend.

* Common options
  * [`ignore`](#ignore)
  * [`multiline`](#multiline)
  * [`pretrim`](#pretrim)
  * [`pretty`](#pretty)
* Commands
  * [`echo`](#echo)
  * [`filter`](#filter)
  * [`pluck`](#pluck)
  * [`set`](#set)

### Common options

<a name="ignore"></a>
#### ignore

Ignore input that is not json. By default, `json` will error for parsing errors.

`json --ignore`

`json -i`

<a name="multiline"></a>
#### multiline

Read multiline input as one json object per line.

`json --multiline`

`json -m`

<a name="pretrim"></a>
#### pretrim

Remove non-json content from the beginning of the input.

`json --pretrim`

`json -r`

<a name="pretty"></a>
#### pretty

Pretty-print the json output.

`json --pretty`

`json -p`

### Commands

<a name="echo"></a>
#### `json echo`

Prints the input json to the output.

<a name="filter"></a>
#### `json filter`

Filters only entires that match specific rules:

`--attr`: The property to use in order to filter entires. If this flag is used alone, the existence of a value for this property will be treated as truthy and the entry will appear in the output. Nested properties can be accessed through dot notation.

`--equals`: Optional, used with `attr`. The entry will appear in the output only if the `attr` property value equals the value of this flag.

`--matches`: Optional, used with `attr`. the entry will appear in the output only if the `attr` property value matches the regular expression defined in this flag.

Examples:

`json filter --attr propname --equals muffins`

`json filter --attr nested.prop --matches ^[0-9]{3,}`

<a name="pluck"></a>
#### `json pluck`

Gets a value from the json object and prints it to output.

`--attr`: The property to get. Nested properties can be accessed through dot notation.

Examples:

`json pluck --attr propname`

`json pluck --attr nested.prop`

<a name="set"></a>
#### `json set`

Set a particular value in the json object.

`--attr`: The property to set. Nested properties can be set using dot notation.

`--value`: The value to set to the prrperty.

Examples:

`json set --attr propname --value muffins`

`json set --attr nested.prop --value pineapples`
