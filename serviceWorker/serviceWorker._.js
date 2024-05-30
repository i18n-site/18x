// global const, will set to window._CDN
const _CDN = "//${cdn}";

(async (C, F, New) => {
	// for concurrent requests ( 并发请求 )
	let p = (async () => {
		let t = (await F("${i18nSite}")).split(" "),
			js_url = t[0] + t[2],
			js_preload = F(js_url);

		New("style", {
			type: "text/css",
			textContent: await F(t[0] + t[1]),
		});

		// preload for speed up
		await js_preload;
		return js_url;
	})();

	// load importmap , muse before script module
	await eval(await F(C + (await F(C + ".v"))));

	New("script", {
		type: "module",
		crossorigin: "",
		src: await p,
	});
})(
	"${cdn}",
	async (U) => {
		return (await fetch("//" + U)).text();
	},
	(tag, attr) =>
		document.head.appendChild(Object.assign(document.createElement(tag), attr)),
);
