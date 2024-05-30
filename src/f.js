// todo: toast tip error
const f = (method) => async (url, opt) => (await fetch(url, opt))[method]()

export const fTxt = f("text")
export const fJson = f("json")

const fab = f("arrayBuffer")
export const fBin = async (url, opt) => new Uint8Array(await fab(url, opt))
