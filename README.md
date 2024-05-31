# 18X

Util js for build web site

**No need add npm package dependencies**

**Import directly in your js**

Before use , you should define import map in HTML

For example [importmap](https://developer.mozilla.org/docs/Web/HTML/Element/script/type/importmap)

```html
<script type="importmap">{"imports":{"x/":"//jsd.cdn.zzko.cn/npm/18x/"}}</script>
```

You can replace `//jsd.cdn.zzko.cn/npm/18x/` as your own CDN in above code

## File

### toast

[`x/toast.js`](https://atomgit.com/i18n/18x/blob/dev/src/toast.js)

[`x/toast.css`](https://atomgit.com/i18n/18x/blob/dev/src/toast.css)

![](https://i-01.eu.org/1717155390.avif)

A notification message pops up in the lower-left corner of the webpage.

When a request using `./f.js` fails, it will call this to display an error message.

### Box

[`x/xBox.js` : pop up box with close button](https://atomgit.com/i18n/18x/blob/dev/src/xBox.coffee)

screenshot example :

<p style="display:flex">
<img width="300" src="https://i-01.eu.org/1716640762.avif"/>
<img width="300" src="https://i-01.eu.org/1716640899.avif"/>
</p>

[`x/Box.js`](https://atomgit.com/i18n/18x/blob/dev/src/Box.coffee): base pop up box

[`x/htmBox.js`](https://atomgit.com/i18n/18x/blob/dev/src/htmBox.coffee): pop up box with html

[`x/pbox.js`](https://atomgit.com/i18n/18x/blob/dev/src/pbox.coffee): find parent dialog for box ( use for event.target )

[`x/tagBox.js`](https://atomgit.com/i18n/18x/blob/dev/src/tagBox.coffee): create a box , append with the new tag

### Event

[`x/On.js`](https://atomgit.com/i18n/18x/blob/dev/src/On.coffee) : shortcut bind & unbind event with object

### Text

[`x/utf8d.js`](https://atomgit.com/i18n/18x/blob/dev/src/utf8d.coffee) decode utf8 from Uint8Array

[`x/bintxt.js`](https://atomgit.com/i18n/18x/blob/dev/src/bintxt.coffee) decode string from [utf8] concat by 0

### Net

[`x/f.js`](https://atomgit.com/i18n/18x/blob/dev/src/f.js)

* fTxt : fetch url and return string
* fJson : fetch url and return json
* fBin.js : fetch url and return Uint8Array

[`x/fBintxt.js`](https://atomgit.com/i18n/18x/blob/dev/src/fBintxt.js) fetch url and decode via bintxt

[`x/fBinPrefix.js`](https://atomgit.com/i18n/18x/blob/dev/src/fBinPrefix.js) return fBin func with binded prefix


### I18N

[`x/lang.js`](https://atomgit.com/i18n/18x/blob/dev/src/lang.coffee)

* init : detect current language by _LANG_URL & _LANG & localStorage.LANG or navigator.language
* set : set language
* onSet : hook when language change

[`x/langSite.js`](https://atomgit.com/i18n/18x/blob/dev/src/langSet.coffee) hook when site lang file fetched

[`x/langHook.js`](https://atomgit.com/i18n/18x/blob/dev/src/langHook.coffee) create your own hook for get different lang file

### Tag

[`x/i-h.js`](https://atomgit.com/i18n/18x/blob/dev/src/i-h.js) html tag generator from _H ( `<i-h>foot</i-h>` -> `_H.foot()` ),will auto refresh when lang change

### Channel

#### [`initC.js`](https://atomgit.com/i18n/18x/blob/dev/src/initC.js)

init channel and generate function

* send (kind, ...msg) → channel
* hook (kind, ...msg) → unhook function

wrap Broadcast & SharedWorker by init channel

#### Broadcast

[`x/BC.js`](https://atomgit.com/i18n/18x/blob/dev/src/BC.js)

#### SharedWorker

[`x/share.js`](https://atomgit.com/i18n/18x/blob/dev/src/share.js)

### Service Worker

use `./serviceWorker.build.coffee` generate service worker S.js from `./serviceWorker`

write your service worker as below

[`x/Jsd.js`](//atomgit.com/i18n/18x/blob/dev/src/jsd.js) jsdelivr mirror for serviceWorker

use example :

```
['S','Jsd'].forEach(
  (i)=>importScripts(`//jsd.cdn.zzko.cn/npm/18x/${i}.js`)
)

R("{cdn}", Jsd)
```

### I18N.SITE

#### global variable

[`x/_.js`](https://atomgit.com/i18n/18x/blob/dev/src/_.js)

fJson / fMd : use _fp get real url, then fetch, return 0 if can't find the real url

USE / MENU : hook form page or menu

#### global css

[`x/_.css`](https://atomgit.com/i18n/18x/blob/dev/src/_.css)

```
@import "//cdn.jsdelivr.net/npm/18x/_.css"
```
