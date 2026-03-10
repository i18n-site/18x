var decode;

decode = (bytes) => {
  var byte, byte_index, i, len, pos, val;
  val = BigInt(0);
  byte_index = 0n;
  for (pos = i = 0, len = bytes.length; i < len; pos = ++i) {
    byte = bytes[pos];
    val += BigInt(byte & 0x7f) << byte_index;
    byte_index += 7n;
    if (byte < 128) {
      break;
    }
  }
  return [Number(val), bytes.slice(pos + 1)];
};

export default (bytes) => {
  var n, r, rest;
  rest = bytes;
  r = [];
  while (rest.length) {
    [n, rest] = decode(rest);
    r.push(n);
  }
  return r;
};

// r = []
// t = []
// for i from bytes
//   if i < 128
//     r.push decode t
//     t = []
//   t.push i
// r
