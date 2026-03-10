var DOC, New, TOAST, div, toast;

DOC = document;

New = DOC.createElement.bind(DOC);

div = () => {
  return New('div');
};

TOAST = class TOAST {
  constructor() {
    this._li = [];
    this._bottom = 0;
  }

  new(msg, option = {}) {
    var body, close, close_func, close_i, elem, html, i, inner, len, li, timeout;
    li = [...DOC.getElementsByTagName('dialog')];
    len = li.length;
    if (len > 0) {
      li.reverse();
      for (i of li) {
        if (i.open) {
          body = i;
          break;
        }
      }
    }
    if (!body) {
      body = DOC.body;
    }
    ({timeout, body, close, html} = Object.assign({
      timeout: 9,
      body,
      close: 1
    }, option));
    li = this._li;
    elem = div();
    elem.className = "animated fadeInLeft toast";
    elem.style.marginBottom = this._bottom + 'px';
    inner = div();
    if (html) {
      inner.innerHTML = msg;
    } else {
      inner.innerText = msg;
    }
    elem.appendChild(inner);
    if (close) {
      close_i = New('i');
      close_i.className = 'x';
      elem.appendChild(close_i);
    }
    // elem = $ """<div class="" style=>#{msg}</div>"""
    li.push(elem);
    body.appendChild(elem);
    this._bottom += 14 + elem.offsetHeight;
    elem.close = close_func = () => {
      elem.classList.add("fadeOutLeft");
      setTimeout(() => {
        var j, len1, offset, pos;
        li.splice(li.indexOf(elem), 1);
        body.removeChild(elem);
        offset = 0;
        for (pos = j = 0, len1 = li.length; j < len1; pos = ++j) {
          i = li[pos];
          i.style.marginBottom = offset + 'px';
          offset += 14 + i.offsetHeight;
        }
        return this._bottom = offset;
      }, 500);
    };
    if (close) {
      close_i.onclick = close_func;
    }
    if (timeout) {
      setTimeout(close_func, timeout * 1e3);
    }
    return elem;
  }

};

TOAST = new TOAST();

export default toast = function(...args) {
  return TOAST.new(...args);
};

export const toastErr = (...args) => {
  var elem;
  elem = toast(...args);
  elem.classList.add('ERR');
  return elem;
};
