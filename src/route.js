var HASH, HOOK, PRE;

import On from 'x/On.js';

export const nowUrl = () => {
  return location.pathname.slice(1);
};

PRE = nowUrl();

if (location.hash) {
  PRE += location.hash;
}

HOOK = [];

export default (hook) => {
  HOOK.push(hook);
  return () => {
    HOOK = HOOK.filter((f) => {
      return f !== hook;
    });
  };
};

export const setPre = (url) => {
  PRE = url;
};

export const preUrl = () => {
  return PRE;
};

export const refresh = (url) => {
  var f;
  for (f of HOOK) {
    f(url, PRE);
  }
  setPre(url);
};

export const removeSlash = (url) => {
  if (url[0] === '/') {
    url = url.slice(1);
  }
  return url;
};

export const split = (str, s) => {
  var p, suffix;
  p = str.indexOf(s);
  if (p >= 0) {
    suffix = str.slice(p + 1);
    str = str.slice(0, p);
  } else {
    suffix = '';
  }
  return [str, suffix];
};

HASH = "#";

export const setUrl = (url) => {
  var h, hash, p, path;
  url = removeSlash(url);
  if (url !== PRE) {
    [path, hash] = split(url, HASH);
    [p, h] = split(PRE, HASH);
    setPre(url);
    if (path !== p) {
      history.pushState(null, '', '/' + url);
      return 1;
    } else if (location.hash.slice(1) !== hash) {
      location.hash = hash;
      return;
    }
  }
  window.dispatchEvent(new HashChangeEvent('hashchange'));
};

export const goto = (url) => {
  if (setUrl(url)) {
    refresh(url);
  }
};

On(window, {
  popstate: () => {
    var url;
    url = nowUrl();
    if (url !== split(PRE, HASH)[0]) {
      refresh(url);
    }
  }
});
