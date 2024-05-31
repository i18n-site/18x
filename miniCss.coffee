#!/usr/bin/env coffee

> @3-/read
  @3-/write
  @3-/walk > walkRel
  path > join extname
  stylus
  fs > copyFileSync readdirSync mkdirSync existsSync
  clean-css:cleanCSS

ROOT = import.meta.dirname
SRC = join ROOT, 'src'
LIB = join ROOT, 'lib'

export default miniCss = =>

  if not existsSync(LIB)
    mkdirSync LIB

  for await fp from walkRel SRC
    ext = fp.split('.').pop()
    switch ext
      when 'css'
        copyFileSync(
          join(SRC, fp)
          join(LIB, fp)
        )
      when 'styl'
        write(
          join(LIB, fp.slice(0,-5)+'.css')
          stylus(
            read join SRC, fp
          ).set('paths', [SRC]).render()
        )

  for await fp from walkRel LIB
    if fp.endsWith '.css'
      fp = join LIB, fp
      output = new cleanCSS(
        inline : false
      ).minify(
        read fp
      )
      if output.styles
        write(fp, output.styles)
      if output.errors.length
        console.log fp
        console.log ' ',...output.errors
  return

if process.argv[1] == decodeURI (new URL(import.meta.url)).pathname
  miniCss()
