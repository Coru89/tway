module.exports = function subNav(arr, attr) {
  // Assumes this is receiving a collection, hence the `data`
  // If custom array such as from _data, update accordingly
return arr.filter((item) => item.text === attr)[0].items;
}
