#!/usr/bin/env coffee

> @3-/swc
  path > join basename
  @3-/walk
  @3-/read
  @3-/write
  @3-/coffee_plus
  coffeescript:CoffeeScript
  ./serviceWorker.build.coffee:serviceWorkerBuild
  ./miniCss.coffee

serviceWorkerBuild()

compile = CoffeePlus(CoffeeScript)

{dirname: ROOT} = import.meta
LIB = join(ROOT, "lib")
SRC = join(ROOT, "src")

for await fp from walk(SRC)
  if fp.endsWith ".coffee"
    out = compile read(fp)
    outname = fp.slice(SRC.length+1, -7) + ".js"
  else if fp.endsWith ".js"
    out = read(fp)
    outname = fp.slice(SRC.length+1)
  else
    continue
  if fp.endsWith '/W.js'
    opt = {
      jsc:
        minify:
          mangle:
            keepFnNames: true
          compress:
            top_retain: 'R'
    }
  else
    opt = {}
  {
    map
    code
  } = await swc(out,basename(fp),opt)
  js = join(LIB, outname)
  write(js,code)
  write(js+'.map',map)

miniCss()

