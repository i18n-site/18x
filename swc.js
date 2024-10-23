#!/usr/bin/env -S node --trace-uncaught --expose-gc --unhandled-rejections=strict
var LIB, ROOT, SRC, code, compile, fp, i, js, li, map, out, outname, package_json, pkg_json, ref, ref1;

import swc from '@3-/swc';

import {
  join,
  basename
} from 'path';

import walk from '@3-/walk';

import read from '@3-/read';

import write from '@3-/write';

import CoffeePlus from '@3-/coffee_plus';

import CoffeeScript from 'coffeescript';

import serviceWorkerBuild from './serviceWorker.build.coffee';

serviceWorkerBuild();

compile = CoffeePlus(CoffeeScript);

({
  dirname: ROOT
} = import.meta);

LIB = join(ROOT, "lib");

SRC = join(ROOT, "src");

ref = walk(SRC);
for await (fp of ref) {
  if (fp.endsWith(".coffee")) {
    out = compile(read(fp));
    outname = fp.slice(SRC.length + 1, -7) + ".js";
  } else if (fp.endsWith(".js")) {
    out = read(fp);
    outname = fp.slice(SRC.length + 1);
  } else {
    continue;
  }
  ({map, code} = (await swc(out, basename(fp))));
  js = join(LIB, outname);
  write(js, code);
  write(js + '.map', map);
}

pkg_json = 'package.json';

fp = join(ROOT, 'lib.' + pkg_json);

package_json = JSON.parse(read(fp));

li = package_json.version.split('.').map((i) => {
  return i - 0;
});

li[2] = li[2] + 1;

package_json.version = li.join('.');

package_json = JSON.stringify(package_json, null, 2);

ref1 = [fp, join(LIB, pkg_json)];
for (i of ref1) {
  write(i, package_json);
}
