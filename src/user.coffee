> x/lang.js > set:langSet
  x/BC.js > hook:bcHook send:bcSend
  x/lang.js > onSet:onLangSet
  x/share.js > hook:wHook send:wSend
  x/LANG_CODE.js:CODE

+ USER

import {get as cookieGet,set as cookieSet} from 'x/cookie.js'

HOOK = new Set

export onUser = (f)=>
  HOOK.add f
  f USER
  =>
    HOOK.delete f
    return

export User = =>
  USER

{V} = cookieGet(document.cookie)
V = if V then parseInt(V, 36) else 0

save = =>
  t = [
    V
  ]
  if USER
    t.push ...USER
  else
    t.push USER

  localStorage.U = JSON.stringify(t)
  return

_setUser = (user)=>
  if user
    lang = user[2]
    if lang != undefined
      lang = CODE[lang]
      if lang != LANG
        langSet LANG = lang
  else
    user = false
  USER = user
  HOOK.forEach(
    (f)=>
      f(user)
      return
  )
  return

< setUser = (user)=>
  if user and USER
    # 就是当前用户
    if user.every(
      (e, i)=>
        e == USER[i]
    )
      return

  cookieSet(
    'V'
    (
      ++V
    ) .toString(36)
  )
  _setUser user
  save()
  for f from [bcSend,wSend]
    f 0,user
  return


export initUser = (authMe, authLang)=>
  + LANG
  onLangSet (lang)=>
    if LANG != lang
      if USER and LANG != undefined
        authLang()
      LANG = lang
    return

  if not V
    USER = false
    return

  {U} = localStorage
  if U
    U = JSON.parse U
    if U[0] == V
      user = U[1] and U.slice(1)
      USER = user
      wSend(
        0
        user
      )
      return
  setUser await authMe()
  return

# 广播用户消息
bcHook(0,_setUser)
wHook(0,setUser)
