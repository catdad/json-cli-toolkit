module.exports = function pretrim(str) {
  return str.replace(/^[^{[]*/, '').trim();
};
