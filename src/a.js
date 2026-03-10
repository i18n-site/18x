import {
  goto
} from 'x/route.js';

import selfA from 'x/selfA.js';

document.body.addEventListener("click", (e) => {
  var href, name, p;
  p = e.target;
  while (p) {
    ({
      nodeName: name
    } = p);
    if (name === "A") {
      ({href} = p);
      if (href) {
        href = selfA(p, e);
        if (href !== void 0) {
          goto(href);
        } else if (!p.target) {
          p.target = "_blank";
        }
      }
      break;
    } else if (name === "BODY") {
      break;
    }
    p = p.parentNode;
  }
});
