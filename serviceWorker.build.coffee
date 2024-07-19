#!/usr/bin/env coffee

> @3-/read
  @3-/write
  @3-/swc:swc
  path > join

{dirname} = import.meta

swcw = (root, file, out, replace)=>
  if not out
    out = file
  file = file+'.js'
  txt = read(join root,file)
  if replace
    txt = replace txt
  {code,map} = await swc(
    txt
    file
    {
      jsc:
        minify:
          compress: {
            drop_console: false
            # top_retain: out
          }
          # mangle:
          #   keepFnNames: true
    }
  )

  if code.startsWith('export default')
    code = code.slice(14)

  if code.endsWith(';')
    code = code.slice(0,-1)

  write(
    join dirname,'lib/'+out+'.js'
    code
  )
  return

export default main = =>
  serviceWorker = 'serviceWorker'
  root = join dirname,serviceWorker

  name = serviceWorker + '._.js'
  {code} = await swc(
    read(join root,name)
    name
    {
      jsc:
        minify:
          compress:
            # toplevel: true
            unused: false
            drop_console: false
          # mangle:
          #   toplevel: true
    }
  )
  code = "`"+code+"`"

  swcw(
    root,
    serviceWorker
    'S'
    (txt)=>
      txt.replace(
        '_.js'
        code
      )
  )
  swcw(
    root
    'Jsd'
  )
  swcw(
    root
    'webpush'
  )
  return

if process.argv[1] == decodeURI (new URL(import.meta.url)).pathname
  await main()
