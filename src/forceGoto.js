import {
  refresh,
  setUrl,
  removeSlash
} from 'x/route.js';

export default (url) => {
  url = removeSlash(url);
  setUrl(url);
  refresh(url);
};
