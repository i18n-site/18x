import {
  onSet
} from 'x/lang.js';

export default (req) => {
  var HOOK, i18n;
  HOOK = new Set();
  return [
    (f) => {
      HOOK.add(f);
      if (i18n) {
        f.call(i18n);
      }
      return () => {
        HOOK.delete(f);
      };
    },
    onSet(async(lang) => {
      var f;
      i18n = (await req(lang));
      for (f of HOOK) {
        f.call(i18n);
      }
    })
  ];
};
