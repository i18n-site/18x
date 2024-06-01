> x/goto.js
  x/selfA.js

document.body.addEventListener(
  "click"
  (e) =>
    p = e.target
    while p
      {nodeName:name} = p
      if name == "A"
        {href} = p
        if href
          href = selfA(p,e)
          if href != undefined
            goto href
          else if not p.target
            p.target = "_blank"
        break
      else if name == "BODY"
        break
      p = p.parentNode
    return

)

