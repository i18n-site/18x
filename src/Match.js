export var URLLI = [];

// export default URLLI.push.bind URLLI

// I18N_URL 切换语言的时候会被重置
export var I18N_URL = [];

// export default I18N_URL.push.bind I18N_URL
export const i18nReset = (li) => {
  I18N_URL.splice(0, I18N_URL.length);
  I18N_URL.push(...li);
};

export default (render, page404) => {
  return (url) => {
    var func, li, ref;
    ref = [URLLI, I18N_URL];
    for (li of ref) {
      for (func of li) {
        if (func(url, render)) {
          return;
        }
      }
    }
    page404(url);
  };
};

export var Path = new Proxy({}, {
  get: (_, path) => {
    return (compent) => {
      return (url, render) => {
        if (url === path) {
          render(compent);
          return 1;
        }
      };
    };
  }
});
