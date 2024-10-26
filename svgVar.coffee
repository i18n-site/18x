#!/usr/bin/env coffee

> @3-/read
  @3-/write
  @3-/walk > walkRel
  path > join
  svgo > loadConfig optimize

ROOT = import.meta.dirname

conf = await loadConfig(
  join ROOT, 'svgo.config.cjs'
)

SVG = join(
  ROOT
  'svg'
)

export default main = =>
  out = [
    ":root{"
  ]

  for await fp from walkRel SVG
    if not fp.endsWith('.svg')
      continue
    console.log fp
    svg = read join SVG, fp
    svg = optimize(
      svg.trim()
    ).data.replaceAll('#','%23')
    name = fp.charAt(0).toUpperCase() + fp.slice(1,-4)
    out.push """--svg#{name}:url('data:image/svg+xml;utf8,#{svg}');"""
  out.push '}'

  return out.join('')

if process.argv[1] == decodeURI (new URL(import.meta.url)).pathname
  console.log(await main())
