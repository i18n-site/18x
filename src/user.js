var HOOK, USER, V, _setUser, isSame, save;

import {
  set as langSet
} from 'x/lang.js';

import {
  hook as bcHook,
  send as bcSend
} from 'x/BC.js';

import {
  onSet as onLangSet
} from 'x/lang.js';

import {
  hook as wHook,
  send as wSend
} from 'x/share.js';

import CODE from 'x/LANG_CODE.js';


import {
  get as cookieGet,
  set as cookieSet
} from 'x/cookie.js';

HOOK = new Set();

export const onUser = (f) => {
  HOOK.add(f);
  if (USER !== void 0) {
    f(USER);
  }
  return () => {
    HOOK.delete(f);
  };
};

export const User = () => {
  return USER;
};

({V} = cookieGet(document.cookie));

V = V ? parseInt(V, 36) : 0;

save = () => {
  var t;
  t = [V];
  if (USER) {
    t.push(...USER);
  } else {
    t.push(USER);
  }
  localStorage.U = JSON.stringify(t);
};

isSame = (user) => {
  if (user) {
    return USER && USER.every((v, p) => {
      return user[p] === v;
    });
  } else {
    return false === USER;
  }
};

_setUser = (user) => {
  var LANG, lang;
  if (user) {
    lang = user[2];
    if (lang !== void 0) {
      lang = CODE[lang];
      if (lang !== LANG) {
        langSet(LANG = lang);
      }
    }
  } else {
    user = false;
  }
  USER = user;
  HOOK.forEach((f) => {
    f(user);
  });
};

export const setUser = (user) => {
  var f, ref;
  if (isSame(user)) {
    return;
  }
  cookieSet('V', (++V).toString(36));
  _setUser(user);
  save();
  ref = [bcSend, wSend];
  for (f of ref) {
    f(0, user);
  }
};

export const initUser = async(authMe, authLang) => {
  var LANG, U, user;
  onLangSet((lang) => {
    if (LANG !== lang) {
      if (USER && LANG !== void 0) {
        authLang();
      }
      LANG = lang;
    }
  });
  if (!V) {
    USER = false;
    return;
  }
  ({U} = localStorage);
  if (U) {
    U = JSON.parse(U);
    if (U[0] === V) {
      user = U[1] && U.slice(1);
      USER = user;
      wSend(0, user);
      return;
    }
  }
  setUser((await authMe()));
};

// 广播用户消息
bcHook(0, (user) => {
  if (isSame(user)) {
    return;
  }
  _setUser(user);
});

wHook(0, setUser);
