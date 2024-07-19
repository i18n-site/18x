import { onSet } from "x/lang.js"
import fBintxt from "x/fBintxt.js"

const SET = new Set()

onSet(async (lang) => {
	let i = lang.length
	while (--i) {
		if (_LANG[i][1] === lang) break
	}
	_L.splice(
		0,
		_L.length,
		...(await fBintxt(_V + "@" + _lV(i) + "/" + lang + ".js")),
	)
	SET.forEach((i) => i(lang))
})

export default (func) => {
	SET.add(func)
	if (_L.length) {
		func()
	}
	return () => {
		SET.delete(func)
	}
}
