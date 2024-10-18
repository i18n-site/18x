import assert from "node:assert/strict"

let PRE
;[
	"jsd.onmicrosoft.cn/npm/@mdi/js/build.js",
	"registry.npmmirror.com/@mdi/js/latest/files/build.js",
	"registry.npmmirror.com/@mdi/js/7.4.47/files/build.js",
	"jsd.onmicrosoft.cn/npm/@motionone/utils@10.17.1/README.md",
	"cdn.jsdelivr.net/gh/jquery/jquery@3.6.4/dist/jquery.min.js",
	"registry.npmmirror.com/18x/latest/files/_.js",
	"unpkg.com/18x/_.js",
	"cdn.jsdelivr.net/npm/18x/_.js",
	"registry.npmmirror.com/18x/0.1.83/files/_.js",
	"unpkg.com/18x@0.1.83/_.js",
	"cdn.jsdelivr.net/npm/18x@0.1.83/_.js",
	"cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js",
	"registry.npmmirror.com/18x/latest/files/_.css",
	"no.url/test",
].forEach((url) => {
	const li = Jsd(new URL("https://" + url))
	if (li) {
		const t = JSON.stringify(li)
		if (PRE) {
			if (t == PRE) {
				console.log("✅", url)
				return
			}
		}
		console.log("\n" + url)
		PRE = t
		for (const i of li) {
			console.log("  https://" + i)
		}
		assert(li.includes(url))
	} else {
		console.log(`\n${url} ❗NO URL\n`)
	}
})
