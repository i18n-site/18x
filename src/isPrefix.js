export default (prefix, url) => {
  if (prefix) {
    return (url === prefix) || url.startsWith(prefix + '/');
  }
  return 1;
};
