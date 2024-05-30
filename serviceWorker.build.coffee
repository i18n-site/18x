#!/usr/bin/env coffee

> @3-/read
  @3-/write
  @3-/swc:swc
  path > join

{dirname} = import.meta

export default main = =>
  root = join dirname,'serviceWorker'
  serviceWorker = 'serviceWorker.js'

  {code} = await swc(
    read(join root,'serviceWorker._.js')
    serviceWorker
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

  {code,map} = await swc(
    read(join root,serviceWorker).replace(
      '_.js'
      code
    )
    serviceWorker
    {
      jsc:
        minify:
          compress:
            drop_console: false
            top_retain: 'R'
          mangle:
            keepFnNames: true
    }
  )
  for [name, txt] from [
    [
      'S'
      code
    ]
    [
      'S.map'
      map
    ]
  ]
    write(
      join dirname,'lib/'+name+'.js'
      txt
    )

  return

if process.argv[1] == decodeURI (new URL(import.meta.url)).pathname
  await main()
