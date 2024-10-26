#!/usr/bin/env bun

import fs from "node:fs/promises"
import stylus from "stylus"

const ROOT = import.meta.dirname

export const stylusPlugin = {
	name: "stylus",
	setup(build) {
		build.onLoad({ filter: /\.styl$/ }, async (args) => {
			const filePath = args.path
			const source = await fs.readFile(filePath, "utf8")
			const css = stylus(source).set("compress", true).render()

			return {
				contents: css,
				loader: "text",
			}
		})
	},
}

import { build } from "esbuild"
import { dirname, join } from "node:path"

const LIB = join(ROOT, "lib")
await build({
	entryPoints: [join(LIB, "index.js")],
	bundle: true,
	outfile: join(dirname(ROOT), "lib/mouse.js"),
	minify: true,
	drop: ["debugger", "console"],
  target: 'esnext', 
  format: 'iife', 
	legalComments: "none",
	plugins: [stylusPlugin],
})
