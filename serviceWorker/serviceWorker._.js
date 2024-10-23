// global const, will set to window

;(async () => {
	const D = document,
		at = "@",
		js = ".js",
		fStr = async (url) => (await fetch(url)).text(),
		fJson = async (ver, file) =>
			JSON.parse(await fStr(_V + at + ver + "/" + file + js)),
		New = (tag, o) => {
			D.head.appendChild(Object.assign(D.createElement(tag), o))
		},
		newScript = (opt) => New("script", opt),
		newModule = (innerHTML) => newScript({ innerHTML, type: "module" }),
		[B, P] = "${await md_v}"
			.split(">")
			.map((ver, pos) => fJson(ver, "BP"[pos])),
		npm_i = "${NPM}${org_i}${pkg_site}/-",
		init = fStr(npm_i + js)

	D.body.style =
		"background:var(--svgWait) 50% 50%/99px no-repeat;height:100dvh"
	;["${NPM}${reset_css}", npm_i + ".css"].forEach((href) =>
		New("link", {
			rel: "stylesheet",
			href,
		}),
	)

	newScript({
		type: "importmap",
		innerHTML: '{"imports":{"x/":"${NPM}${pkg_18x}/","i/":"${NPM}${org_i}"}}',
	})

	_P.push(...(await P))

	const [css, const_js, module_js] = await B
	New("style", { innerHTML: css })
	newScript({ innerHTML: const_js })
	newModule(module_js)
	await init
	newModule("import 'i/${pkg_site}/-.js'")
})()
