> x/route.js > setPre
  x/removeSlash.js

SLASH = '/'

< (url)=>
  setPre removeSlash url
  if url.charAt(0) != SLASH
    url = SLASH + url
  history.pushState null,'',url
  window.dispatchEvent(new HashChangeEvent 'hashchange')
  return
