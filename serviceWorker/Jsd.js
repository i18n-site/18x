const Jsd = (url) => {
	let pkg, file, ver

	const split = (str, delimiter, n) => {
		const result = []
		while (result.length < n - 1) {
			const p = str.indexOf(delimiter)
			if (p >= 0) {
				result.push(str.slice(0, p))
				str = str.slice(p + 1)
			} else {
				break
			}
		}
		result.push(str)
		return result
	}

	const { host, pathname } = url
	const path = pathname.slice(1)

	const JSDELIVR = ".jsdelivr.net"

	const jsd_li = (url) =>
		[
			"cdn" + JSDELIVR,
			"jsd.cdn.zzko.cn",
			"fastly" + JSDELIVR,
			"jsd.onmicrosoft.cn",
		].map((i) => i + url)

	const pkg_file_ver = (fp) => {
		;[pkg, file] = split(fp, "/", 2)
		;[pkg, ver] = pkg.split("@")
	}

	const npm_slash = "/npm/",
		latest = "latest"

	if (
		host.endsWith(JSDELIVR) ||
		["jsd.cdn.zzko.cn", "jsd.onmicrosoft.cn"].includes(host)
	) {
		if (path.startsWith("npm/")) {
			pkg_file_ver(path.slice(4))
		} else {
			return jsd_li(pathname)
		}
	} else if (host == "unpkg.com") {
		pkg_file_ver(path)
	} else if (host == "registry.npmmirror.com") {
		;[pkg, ver, file] = split(path, "/", 3)
		file = file.slice(6)
		if (ver == latest) {
			ver = 0
		}
	}
	if (pkg) {
		const fp = pkg + (ver ? "@" + ver : "")

		return [
			`registry.npmmirror.com/${pkg}/${ver || latest}/files`,
			"unpkg.com/" + fp,
			...jsd_li(npm_slash + fp),
		].map((i) => i + "/" + file)
	}
}
