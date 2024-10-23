HTM = document.documentElement
HOOK = new Set

< set = (lang)=>
  localStorage.LANG = HTM.lang = lang
  [...HOOK].map (f)=>
    f lang
    return
  return

< onSet = (f)=>
  HOOK.add f
  {lang} = HTM
  if lang
    f lang
  =>
    HOOK.delete f
    return

###
_LANG = [
  ['English', 'en', 'hashurl_x0']
  ['简体中文', 'zh', 'hashurl_x1']
  ...
]

see https://i18n.site/doc/i18/LANG_CODE for all code
###

LANG_SET = new Set(_LANG.map((i)=>i[1]))

< init = =>
  {LANG} = localStorage
  if not LANG_SET.has LANG
    for i from navigator.languages
      if LANG_SET.has i
        LANG = i
        break
      # zh-CN -> zh
      p = i.indexOf('-')
      if ~p
        l = i.slice(0,p)
        if LANG_SET.has l
          LANG = l
          break
    if not LANG
      LANG = _LANG[0][1]

  set LANG
  return
