import { toastErr } from "x/toast.js"

const tErr = (url, err) =>
	// 不然会附加到验证码弹出层被关掉
	setTimeout(() =>
		toastErr("⚠️ " + url.slice(url.indexOf("//") + 2) + " " + err),
	)

const f = (method) => async (url, opt) => {
	let r, status
	try {
		r = await fetch(url, opt)
		status = r.status

		if (
			[
				200,
				0, // no-cors will set status = 0
				301,
				304,
			].includes(status)
		) {
			return await r[method]()
		}
	} catch (e) {
		tErr(url, e)
		throw e
	}

	// 验证码用的代码
	if (![401, 417, 402, 412].includes(status)) {
		tErr(url, status)
	}

	throw r
}

export const fTxt = f("text")
export const fJson = f("json")

const fab = f("arrayBuffer")
export const fBin = async (url, opt) => new Uint8Array(await fab(url, opt))
