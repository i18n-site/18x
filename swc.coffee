#!/usr/bin/env coffee

> @3-/swc
  path > join basename
  @3-/walk
  @3-/read
  @3-/write
  @3-/coffee_plus
  coffeescript:CoffeeScript
  ./serviceWorker.build.coffee:serviceWorkerBuild

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
  {
    map
    code
  } = await swc(out,basename(fp))
  js = join(LIB, outname)
  write(js,code)
  write(js+'.map',map)

pkg_json = 'package.json'
fp = join ROOT,'lib.'+pkg_json
package_json = JSON.parse read(fp)
li = package_json.version.split('.').map((i)=>i-0)
li[2] = li[2]+1
package_json.version = li.join '.'
package_json = JSON.stringify package_json,null,2

for i from [
  fp
  join(LIB,pkg_json)
]
  write(i,package_json)

