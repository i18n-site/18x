var TLD;

export const get = (cookie) => {
  return new Proxy({}, {
    get: (_, name) => {
      var end, k, p;
      k = name + '=';
      p = cookie.indexOf(k);
      if (~p) {
        p += k.length;
        end = cookie.indexOf(';', p);
        if (end < 0) {
          end = cookie.length;
        }
        return cookie.slice(p, end);
      }
    }
  });
};


export const tld = () => {
  var i, k, p, s, v;
  if (!TLD) {
    i = 0;
    p = document.domain.split('.');
    s = +new Date();
    k = '_' + s;
    v = k + '=' + s;
    while (i < p.length - 1 && document.cookie.indexOf(v) === -1) {
      TLD = p.slice(-1 - ++i).join('.');
      _cookieSet(v, 1e3);
    }
  }
  return TLD;
};

export const _cookieSet = (kv, t) => {
  var n, s;
  n = new Date();
  s = +n;
  n.setTime(s + t);
  document.cookie = kv + ';expires=' + n.toUTCString() + ';domain=' + tld();
};

export const set = (k, v, t) => {
  if (!t) {
    t = v ? 1e11 : 0;
  }
  _cookieSet(k + '=' + v, t);
};
