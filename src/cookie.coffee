export get = (cookie)=>
  new Proxy(
    {}
    get: (_,name)=>
      k = name+'='
      p = cookie.indexOf(k)
      if ~p
        p += k.length
        end = cookie.indexOf(';',p)
        if end < 0
          end = cookie.length
        return cookie.slice(p,end)
      return
  )

+ TLD

export tld = =>
  if not TLD
    i = 0
    p = document.domain.split('.')
    s = +new Date
    k = '_'+s
    v = k+'='+s
    while i < p.length - 1 and document.cookie.indexOf(v) == -1
      TLD = p.slice(-1 - ++i).join('.')
      _cookieSet v,1e3
  return TLD

export _cookieSet = (kv,t)=>
  n = new Date()
  s = +n
  n.setTime(s+t)
  document.cookie = kv + ';expires='+ n.toUTCString() + ';domain=' + tld()
  return

export set = (k,v,t)=>
  if not t
    t = if v then 1e11 else 0

  _cookieSet(
    k+'='+v
    t
  )
  return

