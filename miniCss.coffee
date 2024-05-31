#!/usr/bin/env coffee

> @3-/read
  @3-/write
  path > join extname
  fs > readdirSync
  clean-css:cleanCSS

ROOT = import.meta.dirname

export default miniCss = =>
  srcDir = join ROOT, 'src'
  libDir = join ROOT, 'lib'

  files = readdirSync(srcDir)

  for file in files
    if extname(file) is '.css'
      srcFilePath = join(srcDir, file)
      libFilePath = join(libDir, file)

      cssContent = read srcFilePath

      output = new cleanCSS(
        inline : false
      ).minify(cssContent)

      if output.styles
        write(libFilePath, output.styles)
      if output.errors.length
        console.log file
        console.log ' ',...output.errors
  return

if process.argv[1] == decodeURI (new URL(import.meta.url)).pathname
  miniCss()
