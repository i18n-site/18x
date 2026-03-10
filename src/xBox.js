var body, doc;

import On from 'x/On.js';

import Box from 'x/Box.js';

({body} = doc = document);

export const xClose = (dialog) => {
  var x;
  x = doc.createElement('a');
  x.className = 'x';
  dialog.prepend(x);
  On(x, {
    click: () => {
      dialog.close();
    }
  });
  return dialog;
};

export const escClose = (dialog) => {
  On(dialog, {
    close: On(body, {
      keyup: (e) => {
        var t;
        if (27 === e.keyCode) {
          ({
            target: t
          } = e);
          if (['INPUT', 'TEXTAREA'].includes(t.tagName)) {
            t.blur();
            return;
          }
          dialog.close();
        }
      }
    })
  });
  return dialog;
};

export default (func) => {
  var box;
  box = Box();
  if (typeof func === "function") {
    func(box);
  }
  return xClose(escClose(box));
};
