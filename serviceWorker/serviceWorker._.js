// global const, will set to window
const _V = "${V}",
	_P = [] // [ [prefix, prefix index, show ver?, all show ver list? ]
;(async () => {
	const at = "@"
	const js = ".js"
	const split = (i) => i.split(">")
	const getTxt = async (url) => (await fetch(url)).text()
	const getJs = (ver, file) => getTxt(_V + at + ver + "/" + file + js)

	const [B, P] = split(await getTxt("${V}/.v")).map((js, pos) =>
		getJs(js, "BP"[pos]),
	)

	const go = eval(await B)("${X}")

	// const decode_li = Promise.all(
	// 	["bintxt", "vbD"].map(async (i) => (await import("x/" + i + js)).default),
	// )

	// 因为 vite 开发环境不需要它, 所以放这里
	const D = document,
		site = "site",
		i_site = "i/" + site,
		site_v = at + (await _SITE_V),
		slash_minus = "/-",
		style = D.createElement("style")

	style.textContent = (
		await Promise.all(
			[".css", js]
				.map((ext, pos) => _I + site + site_v + slash_minus + ext)
				.map(async (url) => (await fetch(url)).text()),
		)
	)[0]
	D.head.appendChild(style)
	_P.push(...JSON.parse(await P))
	go()
	import(i_site + site_v + slash_minus + js)
})()
