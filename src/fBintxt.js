import { fBin } from "x/f.js"
import bintxt from "x/bintxt.js"

export default async (url, opt) => bintxt(await fBin(url, opt))
