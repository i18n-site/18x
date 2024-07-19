// if req.headers.get('accept').includes 'stream'
//   return
// 单页面
// 如果 headers 没有 '-' , 那么 NaN > now() 也是 false， 不影响
// 网络加载1秒没响应,就返回缓存
export default (proxy_li, V, X) => {
	let DB, CACHE

	const logerr = (...args) => console.error(...args),
		WOFF2 = ".woff2",
		NO_CORS = "no-cors",
		NO_REWRTE = new Set(
			"avif|css|html|ico|js|json|png|svg|txt|webmanifest|xml".split("|"),
		),
		_match = (req, url) => (res) => {
			const now = Int(new Date() / 1e3),
				go = () => get(now, req, url)

			if (res) {
				const expire = res.headers.get(SLASH) // expire not exist for no-cors ( opaque type )

				if (expire && Int(expire, 36) > now) {
					return res
					// ignore /.v
					// if ("." != url.pathname.split("/").pop()[0]) {
					// 	go()
					// 	return res
					// }
				}
				return new Promise((resolve) => {
					const timer = setTimeout(() => {
						resolve(res)
					}, 3e3)
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

	const CDN = "cdn",
		H = "H",
		{ protocol, host: HOST } = location,
		SLASH = "-",
		Int = parseInt,
		isOk = (res) => {
			if (res) {
				return [200, 204].includes(res.status)
			}
		}

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
							push = (
								// ok err cost rank
								t = [0, 0, 0, 0],
							) => {
								li.push([url, host, t])
								cdnHost.set(host, t)
								resolve()
							}
						request.onsuccess = (e) => {
							const record = e.target.result
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
								i.push(rank(ok, err, cost))
								push(i)
							} else {
								push()
							}
						}
						request.onerror = (err) => {
							logerr(err)
							push()
						}
					})
				}),
			)
		}

		li.sort((a, b) => a[2][3] - b[2][3] || Math.random() - 0.5)
		return li
	}

	const _get = async (now, cache_req, url, res) => {
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
			if (isOk(res)) {
				const rc = new Response(res.clone().body, res)
				const file = url.pathname.split("/").pop()

				let sec
				if (file.endsWith(WOFF2)) {
					sec = 9e8
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
					rc.headers.set(SLASH, (now + sec).toString(36))
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
		rank = (ok, err, cost) =>
			(Math.log((err + 1) * (ok + 1)) * (cost + 1e5)) /
			(Math.log(ok + 1) * ok + 1),
		cdnGet = async (now, req, url, li, timer) => {
			const [furl, host, info] = li[0],
				begin = new Date(),
				save = (pos) => {
					// ok err cost rank
					++info[pos]
					cdnStore("readwrite").put({
						H: host,
						i: info.slice(0, 3),
					})
					info[3] = rank(...info)
				}

			let err, res
			try {
				res = await fetch(
					/*
                    don't use : new Request("//" + furl, req)
                    will cause response type opaque , then can't get status
                  */
					new Request("//" + furl, { method: req.method }),
				)
				res = await _get(now, req, url, res)
				if (isOk(res)) {
					info[2] += new Date() - begin
					save(0)
					return res
				}
			} catch (e) {
				err = e
			}
			save(1)
			logerr(url, err || res)
			throw err || res
		},
		get = async (now, req, url) => {
			for (const f of proxy_li) {
				let li = f(url)
				if (li) {
					li = await cdnLi(li)
					let timer
					try {
						return await new Promise((resolve, reject) => {
							const cget = () => {
								if (li.length) {
									cdnGet(
										now,
										req,
										url,
										li,
										setTimeout(() => {
											li.shift()
											cget()
										}, 3e3),
										// setTimeout(() => {
										// 	console.log("timeout", url)
										// 	cget()
										// }, 3e3),
									).then(
										(res) => {
											li.splice(0, li.length)
											resolve(res)
										},
										(err) => {
											li.shift()
											if (li.length) {
												cget()
											} else {
												reject(err)
											}
										},
									)
								}
							}
							cget()
						})
					} catch (e) {
						logerr(e)
					}
				}
			}

			// disable no-cors , no-cors can't get cache max-age
			if (req.mode == NO_CORS && !url.pathname.endsWith(WOFF2)) {
				req = new Request(url, { method: req.method })
			}

			let n = 0
			while (true) {
				try {
					return await _get(now, req, url, await fetch(req))
				} catch (err) {
					if (n++ > 9) {
						throw err
					}
					logerr(n, req, err)
				}
			}
		}
	// 这个事件在chorme中手动强制停止 service worker 之后再刷新页面不会触发
	F.fetch = (event) => {
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
			if (!NO_REWRTE.has(pathname.split(".").pop())) {
				req = new Request("/", {
					method: method,
				})
			}
		}
		event.respondWith(caches.match(req).then(match(req, url)))
	}
}
