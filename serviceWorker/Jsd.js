export default (url) => {
	const { host, pathname } = url
	const path = pathname.slice(1)
	const com = ".com"
	const unpkg_com = "unpkg" + com
	if (host == unpkg_com) {
		let t = path.split("/")
		if (t.pop() == ".v") {
			if (t.length == (t[0][0] == "@") ? 2 : 1) {
				if (!t.at(-1).includes("@")) {
					t = t.join("/")
					return ["i18n.site", "ok0.pw", "3ti.site"].map(
						(i) => "v." + i + "/" + t,
					)
				}
			}
		}
	}
	const JSDELIVR = ".jsdelivr.net"
	const CDN = "cdn"
	// const jsd = "jsd."
	const jsd_mirror = [
		CDN + ".jsdmirror" + com,
		// "jsd." + CDN + ".noisework.cn",
		//, jsd + "onmicrosoft.cn"
	]
	const npmmirror = "registry.npmmirror" + com
	const npm_slash = "/npm/"
	const latest = "latest"

	const split = (str, delimiter, n) => {
		let pre = 0,
			offset = str[0] == "@" ? str.indexOf("/") + 1 : 0 // for npm has org @mdj/js
		const result = []

		while (result.length < n - 1) {
			const p = str.indexOf(delimiter, offset)
			if (p >= 0) {
				result.push(str.slice(pre, p))
				pre = offset = p + delimiter.length // 更新 offset 以跳过 delimiter
			} else {
				break
			}
		}

		result.push(str.slice(pre))
		return result
	}

	// https://iui.su/3635/
	const jsd_li = (url) =>
		[
			"quantil" + JSDELIVR,
			"fastly" + JSDELIVR,
			...jsd_mirror,
			CDN + JSDELIVR,
		].map((i) => i + url)

	let pkg, file, ver

	const pkg_file_ver = (fp) => {
		;[pkg, file] = split(fp, "/", 2)
		;[pkg, ver] = split(pkg, "@", 2)
	}

	const mirror_li = []

	if (host.endsWith(JSDELIVR) || jsd_mirror.includes(host)) {
		if (pathname.startsWith(npm_slash)) {
			pkg_file_ver(path.slice(4))
		} else {
			return jsd_li(pathname)
		}
	} else if (host == unpkg_com) {
		pkg_file_ver(path)
	} else if (host == npmmirror) {
		/*
因为 npmmirror 需要手动申请开白名单 , 所以, 只有当原域名是 npmmirror 时才会添加 npmmirror
https://github.com/cnpm/unpkg-white-list
	*/
		;[pkg, ver, file] = split(path, "/", 3)
		file = file.slice(6)
		if (ver == latest) {
			ver = 0
		}
		mirror_li.push(npmmirror + "/" + pkg + "/" + (ver || latest) + "/files")
	}
	if (pkg) {
		const fp = pkg + (ver ? "@" + ver : "")

		return [...mirror_li, ...jsd_li(npm_slash + fp), unpkg_com + "/" + fp].map(
			(i) => i + "/" + file,
		)
	}
}
