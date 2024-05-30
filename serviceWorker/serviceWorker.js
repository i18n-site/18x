// if req.headers.get('accept').includes 'stream'
//   return
// 单页面
// 如果 headers 没有 '-' , 那么 NaN > now() 也是 false， 不影响
// 网络加载1秒没响应,就返回缓存
const R = (cdn, i18nSite) => {
	const { protocol, host: HOST } = location,
		SLASH = "-",
		Int = parseInt,
		ok = (res) => [200, 301, 304].includes(res?.status),
		_get = async (now, req) => {
			// url = new URL(req.url)
			// if url.host != HOST
			//   config = {
			//     credentials: 'omit'
			//     mode: 'cors'
			//   }
			//   try
			//     res = await fetch(req, config)
			//   catch e
			//     delete config.mode
			//     res = await fetch(req, config)
			// else
			//   res = await fetch(req)
			const res = await fetch(req);
			if (ok(res)) {
				const rc = new Response(res.clone().body, res),
					cache = res.headers.get("cache-control");
				if (cache && cache !== "no-cache") {
					let sec = /max-age=(\d+)/.exec(cache);
					if (sec) {
						sec = +sec[1];
						if (sec > 0) {
							rc.headers.set(SLASH, (now + sec).toString(36));
						}
					}
				}
				// 始终缓存，这样网络故障也可以返回之前的版本
				caches.open(1).then((cache) => {
					// version
					return cache.put(req, rc);
				});
			}
			return res;
		},
		get = async (now, req) => {
			let n = 0;
			while (true) {
				try {
					return await _get(now, req);
				} catch (err) {
					if (n++ > 9) {
						throw err;
					}
					console.error(n, req, err);
				}
			}
		};
	for (const [k, v] of Object.entries({
		install: (event) => {
			event.waitUntil(skipWaiting());
		},
		activate: (event) => {
			event.waitUntil(clients.claim());
		},
		fetch: (event) => {
			let req = event.request;
			const { url, method } = req;
			if (!(url.startsWith("http") && ["GET", "OPTIONS"].includes(method))) {
				return;
			}
			const { host, pathname } = new URL(url);
			if (host === HOST && !pathname.includes(".")) {
				req = new Request("/", {
					method: method,
				});
			}
			if (url.endsWith("/_")) {
				event.respondWith(
					new Response(_.js, {
						headers: { "Content-Type": "text/javascript" },
					}),
				);
				return;
			}
			event.respondWith(
				caches.match(req).then(async (res) => {
					const now = Int(new Date() / 1e3);
					if (res) {
						if (Int(res.headers.get(SLASH), 36) > now) {
							return res;
						}
						// ignore /.v
						if ("." != pathname.split("/").pop()[0]) {
							get(now, req);
							return res;
						}
						return new Promise((resolve) => {
							const timer = setTimeout(() => {
								resolve(res);
							}, 1e3);
							get(now, req).then((r) => {
								clearTimeout(timer);
								resolve(r);
							});
						});
					}
					return get(now, req);
				}),
			);
		},
	})) {
		addEventListener(k, v);
	}
};
