export URLLI = []
# export default URLLI.push.bind URLLI

# I18N_URL 切换语言的时候会被重置
export I18N_URL = []
# export default I18N_URL.push.bind I18N_URL

export i18nReset = (li)=>
  I18N_URL.splice(0,I18N_URL.length)
  I18N_URL.push(...li)
  return

export default (render, page404)=>
  (url)=>
    for li from [URLLI,I18N_URL]
      for func from li
        if func(url, render)
          return
    page404(url)
    return

export Path = new Proxy(
  {}
  get:(_, path)=>
    (compent)=>
      (url, render)=>
        if url == path
          render compent
          return 1
        return
)

