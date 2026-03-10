export default (str, split) => {
  var p, suffix;
  p = str.indexOf(split);
  if (p >= 0) {
    suffix = str.slice(p + 1);
    str = str.slice(0, p);
  } else {
    suffix = '';
  }
  return [str, suffix];
};
