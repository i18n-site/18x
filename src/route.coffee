> x/On.js

< nowUrl = =>
  location.pathname.slice(1)

PRE = nowUrl()
if location.hash
  PRE += location.hash

HOOK = []

< (hook)=>
  HOOK.push hook
  =>
    HOOK = HOOK.filter(
      (f)=>
        f!=hook
    )
    return

< setPre = (url) =>
  PRE = url
  return

< preUrl = =>
  PRE

< refresh = (url)=>
  for f from HOOK
    f(url, PRE)
  setPre url
  return

< removeSlash = (url)=>
  if url[0] == '/'
    url = url.slice(1)
  url

< split = (str, s)=>
  p = str.indexOf(s)
  if p >= 0
    suffix = str.slice(p+1)
    str = str.slice(0,p)
  else
    suffix = ''
  return [str, suffix]

HASH = "#"

< setUrl = (url)=>
  url = removeSlash url
  if url != PRE
    [path, hash] = split(url,HASH)
    [p, h] = split(PRE,HASH)
    setPre url
    if path != p
      history.pushState null,'','/'+url
      return 1
    else if location.hash.slice(1) != hash
      location.hash = hash
      return

  window.dispatchEvent(new HashChangeEvent 'hashchange')
  return

< goto = (url)=>
  if setUrl url
    refresh url
  return

On(
  window
  popstate: =>
    url = nowUrl()
    if url != split(PRE,HASH)[0]
      refresh(url)
    return
)

