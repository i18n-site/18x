import { fBin } from "x/f.js"

export default (U) => (url, opt) => fBin(U + url, opt)
