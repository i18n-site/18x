// if req.headers.get('accept').includes 'stream'
//   return
// 单页面
// 如果 headers 没有 '-' , 那么 NaN > now() 也是 false， 不影响
// 网络加载1秒没响应,就返回缓存

export default (
	NO_REWRTE,
	JSD,
	reset_css,
	F,
	pkg_md,
	md_v,
	org_i,
	pkg_site,
	pkg_18x,
) => {
	let DB,
		CACHE,
		cacheMatch = (req, url) => async (res) => {
			// active 这个事件在chorme中手动强制停止 service worker 之后再刷新页面不会触发 , 所以采用这种方式确保初始化
			await initDb
			return cacheMatch(req, url)(res)
		}

	const JSD_HOST_PREFIX = new Map(
			JSD.map((i) => {
				const p = i.indexOf("/")
				return p > 0 ? [i.slice(0, p), i.slice(p + 1)] : [i, ""]
			}),
		),
		MAXAGE = 9e8,
		CDN = "cdn",
		logerr = (...args) => console.error(...args),
		H = "H",
		NPM = `//${JSD[0]}/`,
		SLASH = "-",
		Int = Number.parseInt,
		{ host: HOST } = location,
		_get = async (now, cache_req, url, res, maxage) => {
			if ([200, 204].includes(res.status)) {
				if (!maxage) {
					const cache = res.headers.get("cache-control")
					if (cache && cache !== "no-cache") {
						maxage = /max-age=(\d+)/.exec(cache)
						if (maxage) {
							maxage = +maxage[1]
						}
					}
				}
				const rc = new Response(res.clone().body, res)
				if (maxage > 0) {
					rc.headers.set(SLASH, (now + maxage).toString(36))
				}
				// 始终缓存，这样网络故障也可以返回之前的版本
				await CACHE.put(cache_req, rc)
			} else if (res.status > 0) {
				throw res
			}
			return res
		},
		get = async (now, req, url) => {
			const cache_req = req,
				prefix = JSD_HOST_PREFIX.get(url.host)

			if (prefix !== undefined) {
				let { pathname } = url,
					turn = JSD_LI.length
				if (prefix) {
					const prefix_len = prefix.length + 1
					if (pathname.slice(1, prefix_len) == prefix) {
						pathname = pathname.slice(prefix_len)
					} else {
						turn = 0
					}
				}
				if (turn) {
					const protocol = url.protocol + "//",
						jsd_li = JSD_LI.toSorted((a, b) => a[3] - b[3]),
						ctrl_li = []

					return new Promise((resolve, reject) => {
						const doFetch = async () => {
								const li = jsd_li.shift(),
									prefix = li[4],
									id = ctrl_li.length,
									ctrl = new AbortController()

								ctrl_li.push(ctrl)
								url = new URL(protocol + prefix + pathname)
								req = new Request(url, { method: req.method })
								const start = new Date()
								try {
									li[3] += 2e3 // 避免启动时候, 一个域名下的请求过多
									resolve(
										await _get(
											now,
											cache_req,
											url,
											await fetch(req, { signal: ctrl.signal }),
											MAXAGE,
										),
									)
									// ok err cost rank
									++li[0]
									turn = 0
									clearTimeout(timer)
									for (let i = ctrl_li.length; i-- > 0; ) {
										if (i != id) {
											ctrl_li[i].abort()
										}
									}
								} catch (err) {
									if (turn) {
										++li[1]
										logerr(url + "", err)
										if (jsd_li.length) {
											doFetch()
										} else {
											reject(err)
										}
									}
								} finally {
									li[2] += new Date() - start
									rank(li)
									cdnStore("readwrite").put({
										H: prefix,
										i: li.slice(0, 3),
									})
								}
							},
							timer = setInterval(() => {
								if (jsd_li.length) {
									doFetch()
								} else {
									clearInterval(timer)
								}
							}, 2e3)

						doFetch()
					})
				}
			}

			const is_woff2 = url.pathname.endsWith(".woff2")
			if (req.mode == "no-cors" && !is_woff2) {
				req = new Request(url, { method: req.method })
			}

			let retry = 0
			while (true) {
				try {
					return await _get(
						now,
						cache_req,
						url,
						await fetch(req),
						is_woff2 ? MAXAGE : 0,
					)
				} catch (err) {
					logerr(retry, url + "", err)
					if (++retry > 9) {
						throw err
					}
				}
			}
		},
		JSD_LI = [],
		rank = (li) => {
			const [ok, err, cost] = li
			// 原理：得分随着失败次数和耗时增加而变大，随着成功次数增加而变小。
			li[3] = ((err + 1) * (cost + 1)) / (ok + 1)
		},
		cdnStore = (mode) => DB.transaction([CDN], mode).objectStore(CDN),
		initDb = (async () => {
			CACHE = caches.open(1)
			DB = await new Promise((resolve, reject) =>
				Object.assign(indexedDB.open("N", 1), {
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
			)

			const store = cdnStore("readonly")
			JSD_LI.splice(
				0,
				JSD_LI.length,
				...(await Promise.all(
					JSD.map(
						(prefix) =>
							new Promise((resolve) => {
								const query = store.get(prefix),
									push = (
										// ok err cost rank
										i = [0, 0, 0, 0],
									) => {
										resolve([...i, prefix])
									}
								query.onsuccess = (e) => {
									const record = e.target.result
									if (record) {
										const { i } = record
										rank(i)
										push(i)
									} else {
										push()
									}
								}
								query.onerror = (err) => {
									logerr(err)
									push()
								}
							}),
					),
				)),
			)

			CACHE = await CACHE
			cacheMatch = (req, url) => (res) => {
				const now = Int(new Date() / 1e3),
					go = () => get(now, req, url).catch((err) => logerr(url + "", err))

				if (res) {
					const expire = res.headers.get(SLASH) // expire not exist for no-cors ( opaque type )

					if (expire && Int(expire, 36) > now) {
						return res
					}

					return new Promise((resolve) => {
						// 如果3秒没加载完，就返回缓存
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
		})()

	Object.assign(F, {
		fetch: async (event) => {
			let req = event.request
			const { method } = req

			if (!["GET", "OPTIONS"].includes(method)) {
				return
			}
			const url = new URL(req.url),
				{ pathname } = url

			if (!url.protocol.startsWith("http")) {
				return
			}

			if (url.host == HOST) {
				if (pathname == "/_") {
					event.respondWith(
						new Response(
							`const _P=[],_V='${NPM}${pkg_md}',_I='${NPM}${org_i}';_.js`,
							{
								headers: { "Content-Type": "text/javascript" },
							},
						),
					)
					return
				}
				// 单页面
				if (!NO_REWRTE.has(pathname.split(".").pop())) {
					req = new Request("/", {
						method,
					})
				}
			}
			event.respondWith(caches.match(req).then(cacheMatch(req, url)))
			// const { host, pathname } = new URL(url)
			// console.log({ host, pathname, url })
			return
		},
		push: (e) => {
			e.waitUntil(self.registration.showNotification(...e.data.json()))
		},
		notificationclick: (e) => {
			e.notification.close()
			e.waitUntil(clients.openWindow(e.notification.data.url))
		},
	})
}
