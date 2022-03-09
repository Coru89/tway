
module.exports = function sortByOrder(values) {
  let vals = [...values]
  return vals.sort((a, b) => Math.sign(a.data.order - b.data.order))
};
