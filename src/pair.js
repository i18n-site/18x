export default (li) => {
  var i, iter, r;
  r = [];
  iter = li[Symbol.iterator]();
  for (i of iter) {
    r.push([i, iter.next().value]);
  }
  return r;
};
