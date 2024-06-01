// if req.headers.get('accept').includes 'stream'
//   return
// 单页面
// 如果 headers 没有 '-' , 那么 NaN > now() 也是 false， 不影响
// 网络加载1秒没响应,就返回缓存
const S = (cdn, proxy_li) => {
	let DB, CACHE

	const _match = (req, url) => (res) => {
		const now = Int(new Date() / 1e3),
			go = () => get(now, req, url)

		if (res) {
			const expire = res.headers.get(SLASH) // expire not exist for no-cors ( opaque type )
			if (expire) {
				if (Int(expire, 36) > now) {
					return res
				}
				// ignore /.v
				if ("." != url.pathname.split("/").pop()[0]) {
					go()
					return res
				}
			}
			return new Promise((resolve) => {
				const timer = setTimeout(() => {
					resolve(res)
				}, 1e3)
				go().then((r) => {
					clearTimeout(timer)
					resolve(r)
				})
			})
		}
		return go()
	}

	let match = (req, url) => async (res) => {
		// active 这个事件在chorme中手动强制停止 service worker 之后再刷新页面不会触发 , 所以采用这种方式确保初始化
		await init
		return match(req, url)(res)
	}

	const init = (async () => {
		;[DB, CACHE] = await Promise.all([
			new Promise((resolve, reject) =>
				Object.assign(indexedDB.open("S", 1), {
					onupgradeneeded: (event) => {
						const db = event.target.result
						if (!db.objectStoreNames.contains(CDN)) {
							db.createObjectStore(CDN, {
								keyPath: H,
							}).createIndex(H, H, { unique: true })
						}
					},
					onsuccess: (event) => resolve(event.target.result),
					onerror: (event) => reject(event.target.error),
				}),
			),
			caches.open(1),
		])
		match = _match
	})()

	const { log } = Math
	const CDN = "cdn",
		H = "H",
		{ protocol, host: HOST } = location,
		SLASH = "-",
		Int = parseInt,
		isOk = (res) => [200, 301, 304].includes(res?.status)

	const cdnHost = new Map()
	const cdnStore = (mode) => DB.transaction([CDN], mode).objectStore(CDN)

	const cdnLi = async (url_li) => {
		const li = [],
			not_exist = []

		for (const url of url_li) {
			const host = url.split("/")[0],
				pre = cdnHost.get(host)
			if (pre) {
				li.push([url, host, pre])
			} else {
				not_exist.push([url, host])
			}
		}

		if (not_exist.length) {
			const objectStore = cdnStore("readonly")

			await Promise.all(
				not_exist.map(async ([url, host]) => {
					return new Promise((resolve) => {
						const request = objectStore.get(host),
							push = (t = [0, 0, 0, 0]) => {
								li.push([url, host, t])
								cdnHost.set(host, t)
								resolve()
							}
						request.onsuccess = (event) => {
							const record = event.target.result
							if (record) {
								const { i } = record,
									[ok, err, cost] = i
								/*
                  (ok+err)/ok = 多少个请求才有一个成功
                    -> (Math.log(err)+Math.log(ok))/Math.log(ok) 错误惩罚更加严重
                    = log((err+1)*(ok+1)) / log(ok+1)
                  cost / ok = 每个成功请求要多少毫秒 
                  为了防止一直失败导致cost为0，进而请求耗时一直为0，cost加上一个常量1e5
                  score = 要多少毫秒才能有一次请求成功
                */
								i.push(
									(log((err + 1) * (ok + 1)) * (cost + 1e5)) /
										(log(ok + 1) * ok + 1),
								)
								push(i)
							} else {
								push()
							}
						}
						request.onerror = (err) => {
							console.error(err)
							push()
						}
					})
				}),
			)
		}

		li.sort((a, b) => a[2][3] - b[2][3])

		li.forEach((i) => i[2].pop())
		return li
	}

	const _get = async (now, cache_req, fetch_req, url) => {
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
			const res = await fetch(fetch_req)
			if (isOk(res)) {
				const rc = new Response(res.clone().body, res)
				const file = url.pathname.split("/").pop()

				let sec
				if (file[0] == ".") {
					sec = 30 // cache .v and so some for 30 sec
				} else if (file.slice(-6) == ".woff2") {
					sec = 9e9
				} else {
					const cache = res.headers.get("cache-control")
					if (cache && cache !== "no-cache") {
						sec = /max-age=(\d+)/.exec(cache)
						if (sec) {
							sec = +sec[1]
						}
					}
				}
				if (sec > 0) {
					// max cache age is 8 day = 7e5/86400
					rc.headers.set(SLASH, (now + Math.min(sec, 7e5)).toString(36))
				}
				CACHE.put(cache_req, rc)
				// 始终缓存，这样网络故障也可以返回之前的版本
			}
			// else {
			// 		const { type } = res
			// 		if (type == "opaque") {
			// 			rc = res.clone()
			// 		}
			// 	}
			// if (rc) {
			// 	CACHE.put(cache_req, rc)
			// }
			return res
		},
		get = async (now, req, url) => {
			for (const f of proxy_li) {
				let li = f(url)
				if (li) {
					li = await cdnLi(li)
					let n = li.length
					while (n--) {
						const [furl, host, info] = li[0],
							begin = new Date(),
							save = (pos) => {
								// ok err cost
								++info[pos]
								cdnStore("readwrite").put({
									H: host,
									i: info,
								})
							}

						try {
							const res = await _get(
								now,
								req,
								new Request("//" + furl, { method: req.method }),
								/*
                 don't use : new Request("//" + furl, req)
                 will cause response type opaque , then can't get status  
                */
								url,
							)
							if (isOk(res)) {
								info[2] += new Date() - begin
								save(0)
								return res
							}
						} catch (err) {
							console.error(furl, err)
						}
						li.push(li.shift())
						save(1)
					}
				}
			}

			// disable no-cors , no-cors can't get cache max-age
			if (req.mode == "no-cors") {
				req = new Request(url, { method: req.method })
			}

			let n = 0
			while (true) {
				try {
					return await _get(now, req, req, url)
				} catch (err) {
					if (n++ > 9) {
						throw err
					}
					console.error(n, req, err)
				}
			}
		}
	for (const [k, v] of Object.entries({
		install: (event) => {
			event.waitUntil(self.skipWaiting())
		},
		// 这个事件在chorme中手动强制停止 service worker 之后再刷新页面不会触发
		activate: (event) => event.waitUntil(clients.claim()),
		fetch: (event) => {
			let req = event.request,
				{ url, method } = req
			if (!(url.startsWith("http") && ["GET", "OPTIONS"].includes(method))) {
				return
			}
			const { host, pathname } = (url = new URL(url))
			if (host == HOST) {
				if (pathname == "/_") {
					event.respondWith(
						new Response(_.js, {
							headers: { "Content-Type": "text/javascript" },
						}),
					)
					return
				}
				// 单页面应用
				if (!pathname.includes(".")) {
					req = new Request("/", {
						method: method,
					})
				}
			}
			event.respondWith(caches.match(req).then(match(req, url)))
		},
	})) {
		addEventListener(k, v)
	}
}
