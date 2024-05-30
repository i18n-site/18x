import { onSet } from "x/lang.js";
import fBintxt from "x/fBintxt.js";

const SET = new Set();

onSet(async (lang) => {
	_L.splice(0, _L.length, ...(await fBintxt(_CDN + _LANG_URL.get(lang))));
	SET.forEach((i) => i(lang));
});

export default (func) => {
	SET.add(func);
	if (_L.length) {
		func();
	}
	return () => {
		SET.delete(func);
	};
};
