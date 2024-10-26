> gsap > TweenMax
  simplex-noise > createNoise2D
  lodash-es > throttle
  paper
  @2-/doc/BODY.js
  @2-/doc:DOC
  ./index.styl:INDEX_STYL

CUR = 'cur'
[style, cur, canvas] = [
  'style'
  'cur'
  'canvas'
].map (tag)=>
  tag = DOC.createElement tag
  BODY.appendChild(tag)
  tag

style.innerHTML = INDEX_STYL
clsName = cur.className = CUR+' cup'
clsNameLen = clsName.length
canvas.className = CUR
canvas.style = 'height:100vh;width:100vw;z-index:1000002'

mouseleave = 'mouseleave'

COLOR = ['A',"BUTTON","SUMMARY"]
HIDDEN = ['INPUT', 'TEXTAREA']

+ group, stuckX, stuckY, fillOuterCursor, NOW

clientX = -19
clientY = -19
hidden = 'rgba(0,0,0,0)'
isStuck = false
lastX = 0
lastY = 0
radius = 10
segments = 8
shapeBound = 40
strokeColor = '#000'
strokeWidth = 1

_LI = []
paper.setup(canvas)
poly = new paper.Path.RegularPolygon(
  new paper.Point(0, 0)
  segments
  radius/2
)
poly.strokeColor = strokeColor
poly.strokeWidth = strokeWidth

setStrokeColor = (c)=>
  poly.strokeColor # 避免 Uncaught TypeError: Cannot create property '_canvasStyle' on string '#000'
  poly.strokeColor = c
  return

H = ' H'

hide = =>
  if not cur.className.endsWith H
    cur.className = clsName+H
    setStrokeColor hidden
  return

do => # 3 秒不动就hidden
  + x,y
  count=0
  setInterval(
    =>
      if isStuck
        return
      if x == clientX and y == clientY
        if count == 3
          hide()
          return
        count+=1
      else
        x = clientX
        y = clientY
        count=0
      return
    1e3
  )
  return

# 酷炫噪音
noiseScale = 150 # speed
noiseRange = 4 # range of distortion
isNoisy = false # state

group = new paper.Group([poly])
group.applyMatrix = false
noise = poly.segments.map(=> createNoise2D())
bigCoordinates = []

customElements.define(
  'm-c' # mouse circle
  class extends HTMLElement
    constructor: ->
      super()
      _LI.push @
      @addEventListener(
        'mouseenter'
        (e) =>
          box = @getBoundingClientRect()
          stuckX = Math.round(box.left + box.width / 2)
          stuckY = Math.round(box.top + box.height / 2)
          isStuck = true
          setStrokeColor '#f50'
          cur.className = clsName+" I"
          NOW = @
          return
      )

      @addEventListener(
        mouseleave
        (e) =>
          cur.className = clsName
          setStrokeColor strokeColor
          isStuck = false
          if NOW == this
            NOW = undefined
          return
      )
)

(new MutationObserver(
  throttle(
    (mutationsList, observer)=>
      li = []
      for i in _LI
        if BODY.contains i
          li.push i
        else
          if i==NOW
            e = DOC.createEvent('HTMLEvents')
            e.initEvent mouseleave, false, true
            i.dispatchEvent e
      _LI = li
      return
    1000
  )
)).observe(
  BODY
  {
    childList: true
    subtree: true
  }
)

lerp = (a, b, n) =>
  return (1 - n) * a + n * b
map = (value, in_min, in_max, out_min, out_max) =>
  return (
    ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
  )
paper.view.onFrame = (event) =>
  if isStuck
    x = stuckX
    y = stuckY
  else
    x = clientX
    y = clientY
  lastX = lerp lastX, x, 0.2
  lastY = lerp lastY, y, 0.2
  group.position = new paper.Point lastX, lastY
  width = poly.bounds.width
  if isStuck
    if width < shapeBound
      poly.scale 1.08
  else
    if width > radius
      if isNoisy
        poly.segments.forEach (segment, i) =>
          segment.point.set(
            ...bigCoordinates[i]
          )
          return
        isNoisy = false
        bigCoordinates = []
      poly.scale 0.92

  if isStuck and width >= shapeBound
    isNoisy = true
    if bigCoordinates.length is 0
      poly.segments.forEach (
        (segment, i) =>
          bigCoordinates[i] = [
            segment.point.x, segment.point.y
          ]
          return
      )
    poly.segments.forEach ((segment, i) =>
      noiseX = noise[i] event.count / noiseScale, 0
      noiseY = noise[i] event.count / noiseScale, 1
      distortionX = map noiseX, -1, 1, -noiseRange, noiseRange
      distortionY = map noiseY, -1, 1, -noiseRange, noiseRange
      [b0,b1] = bigCoordinates[i]
      newX = b0 + distortionX
      newY = b1 + distortionY
      segment.point.set newX, newY
      return
    )
  poly.smooth()
  return

DOC.addEventListener(
  'mousemove'
  (e) =>
    {clientX,clientY }= e
    if isStuck
      return
    name = cur.className
    {target} = e
    while target
      {tagName} = target
      if HIDDEN.includes(tagName)
        hide()
        return
      else if COLOR.includes(tagName)
        s = " "+tagName
        if not name.endsWith(s)
          cur.className = clsName+s
          setStrokeColor hidden
        return
      target = target.parentNode
    if name.length != clsNameLen
      cur.className = clsName
      setStrokeColor strokeColor
    return
)

render = =>
  TweenMax.set(
    cur
    x: clientX
    y: clientY
  )
  requestAnimationFrame(render)
  return
requestAnimationFrame(render)

