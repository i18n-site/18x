> x/lang.js > onSet

< (req)=>
  + i18n

  HOOK = new Set

  [
    (f)=>
      HOOK.add f
      if i18n
        f.call i18n
      =>
        HOOK.delete f
        return
    onSet (lang)=>
      i18n = await req(lang)
      for f from HOOK
        f.call i18n
      return
  ]
