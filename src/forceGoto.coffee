> x/route.js > refresh setUrl removeSlash

< (url)=>
  url = removeSlash url
  setUrl(url)
  refresh(url)
  return

