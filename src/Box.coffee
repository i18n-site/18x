> x/On.js

< =>
  {body} = doc = document

  dialog = doc.createElement 'dialog'
  dialog.className = 'uBox'
  On dialog,{
    close: =>
      body.removeChild(dialog)
      return
  }

  # 不能用 body.append , 不然 chrome bitwarden 会让验证码弹出层到下面
  body.prepend dialog
  dialog.addEventListener(
    'cancel'
    (e) =>
      e.preventDefault()
      return
  )

  setTimeout => # 不这样 chrome 122.0.6261.129 在 vite 开发模式下有时候会没法显示在顶部
    dialog.showModal()
    return

  dialog
