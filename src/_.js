import { fJson as _fJson, fTxt as _fTxt } from "x/f.js"
import isPrefix from "x/isPrefix.js"

const HTM = document.documentElement
const vUrl = (ver, url) => _V + "@" + ver + "/" + url

const _fd = (trie, url) => {
	let p
	if (trie) {
		const { length } = url
		if (Array.isArray(trie)) {
			if (length) {
				p = length > 1 ? _fd(trie[1][url.shift()], url) : trie[0][url[0]]
			}
		} else if (length == 1) {
			p = trie[url[0]]
		}
	}
	return p === undefined ? -1 : p
}

let PRE

export const TRIE = []

export const fd = async (ext, url) => {
	const { lang } = HTM
	// 当修改了语言 清空 url
	if (PRE != lang) {
		PRE = lang
		TRIE.splice(0, TRIE.length)
	}
	let n = 0
	for (const [
		prefix,
		ver,
		// show version
		// show version index
	] of _P) {
		if (isPrefix(prefix, url)) {
			let trie = TRIE[n]
			if (!trie) {
				const [ver_li, lang_ver_pos] = await _fJson(vUrl(ver, prefix + ".js")),
					lang_ver = ver_li[lang_ver_pos[lang] || 0]
				TRIE[n] = trie = await _fJson(
					vUrl(lang_ver, lang + "/" + prefix + ".json"),
				)
				trie[0] = trie[0].split(";")
			}

			const ver_pos = _fd(
				trie[1][ext],
				url.slice(prefix ? prefix.length + 1 : 0).split("/"),
			)
			if (~ver_pos) {
				return vUrl(
					trie[0][ver_pos],
					lang + "/" + (ext ? url + "." + ext : url),
				)
			}

			return 0
		}
		++n
	}
	// return url ? get(url) : 0
	return 0
}

export const fV = (ext, get) => {
	return async (url) => {
		url = await fd(ext, url)
		return url ? get(url) : 0
	}
}
export const fJson = fV("json", _fJson)
export const fMd = fV("md", _fTxt)

export const USE = {}
export const NAV = {}
