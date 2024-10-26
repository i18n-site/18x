;(async (D, S, L) => {
	await S.register("/S.js")
	await S.ready
	const p = L.pathname
	L.href = p.slice(1 + p.slice(1).indexOf("/"), -4)
})(document, navigator.serviceWorker, location)
