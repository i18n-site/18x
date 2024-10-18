> x/On.js
  x/Box.js

{body} = doc = document

< xClose = (dialog)=>
  x = doc.createElement 'a'
  x.className = 'x'
  dialog.prepend x
  On x, {
    click: =>
      dialog.close()
      return
  }
  dialog

< escClose = (dialog)=>
  On dialog,{
    close: On body,{
      keyup:(e)=>
        if 27 == e.keyCode
          {target:t} = e
          if ['INPUT','TEXTAREA'].includes t.tagName
            t.blur()
            return
          dialog.close()
        return
    }
  }
  dialog

< (func)=>
  box = Box()
  # can set innerHTML before X add
  func?(box)
  xClose escClose box
