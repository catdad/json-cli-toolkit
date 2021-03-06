var util = require('util');

var commandStream = require('./command-stream.js');

function get(name) {
  // eslint-disable-next-line global-require
  return commandStream(require(util.format('./command/%s.js', name)));
}

module.exports = {
  delete: get('delete'),
  echo: get('echo'),
  exec: get('exec'),
  fill: get('fill'),
  filter: get('filter'),
  pluck: get('pluck'),
  set: get('set'),
  wrap: get('wrap'),
  sort: get('sort')
};
