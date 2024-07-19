> x/route.js > refresh preUrl
  x/split.js
  x/removeSlash.js
  x/setUrl.js

J = '#'

< (url)=>
  url = removeSlash url
  purl = preUrl()
  if url == purl
    return
  setUrl(url)
  if split(url,J)[0] != split(purl,J)[0]
    refresh(url)
  return

