import xBox from 'x/xBox.js';

export default (html) => {
  return xBox((b) => {
    b.innerHTML = html;
  });
};
