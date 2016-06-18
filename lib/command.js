/* jshint node: true */

var util = require('util');

function get(name) {
    return require(util.format('./command/%s.js', name));
}

module.exports = {
    delete: get('delete'),
    echo: get('echo'),
    exec: get('exec'),
    filter: get('filter'),
    pluck: get('pluck'),
    set: get('set'),
    wrap: get('wrap'),
};
