/* jshint node: true */

function pretrim(str) {
  return str.replace(/^[^\{\[]*/, '').trim();
}

module.exports = pretrim;
