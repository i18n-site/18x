> x/setUrl.js
  x/route.js > refresh
  x/removeSlash.js

< (url)=>
  url = removeSlash url
  setUrl(url)
  refresh(url)
  return

