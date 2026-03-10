
/*
_LANG = [
  ['English', 'en', 'hashurl_x0']
  ['简体中文', 'zh', 'hashurl_x1']
  ...
]

see https://i18n.site/doc/i18/LANG_CODE for all code
*/
var HOOK, HTM, LANG_SET;

HTM = document.documentElement;

HOOK = new Set();

export const set = (lang) => {
  localStorage.LANG = HTM.lang = lang;
  [...HOOK].map((f) => {
    f(lang);
  });
};

export const onSet = (f) => {
  var lang;
  HOOK.add(f);
  ({lang} = HTM);
  if (lang) {
    f(lang);
  }
  return () => {
    HOOK.delete(f);
  };
};

LANG_SET = new Set(_LANG.map((i) => {
  return i[1];
}));

export const init = () => {
  var LANG, i, l, p, ref;
  ({LANG} = localStorage);
  if (!LANG_SET.has(LANG)) {
    ref = navigator.languages;
    for (i of ref) {
      if (LANG_SET.has(i)) {
        LANG = i;
        break;
      }
      // zh-CN -> zh
      p = i.indexOf('-');
      if (~p) {
        l = i.slice(0, p);
        if (LANG_SET.has(l)) {
          LANG = l;
          break;
        }
      }
    }
    if (!LANG) {
      LANG = _LANG[0][1];
    }
  }
  set(LANG);
};
