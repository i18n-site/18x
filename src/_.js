import { fJson as _fJson, fTxt as _fTxt } from "x/f.js";

export const fV = (ext, get) => {
	const fp = _fp(ext);
	return async (url) => {
		url = await fp(url);
		return url ? get(url) : 0;
	};
};

export const fJson = fV("", _fJson);

const _fMd = fV("md", _fTxt);

export const README = "README";

export const fMd = async (url) => {
	return (await _fMd(url || README)) || _fMd(url + "/" + README);
};

export const USE = {};
export const NAV = {};
