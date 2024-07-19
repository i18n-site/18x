#!/usr/bin/env coffee
> path > join
  @3-/read
  @3-/write

LIB = 'lib'
ROOT = import.meta.dirname

pkg_json = 'package.json'
fp = join ROOT,'lib.'+pkg_json
package_json = JSON.parse read(fp)
li = package_json.version.split('.').map((i)=>i-0)
li[2] = li[2]+1
package_json.version = li.join '.'
package_json = JSON.stringify package_json,null,2

for i from [
  fp
  join(LIB,pkg_json)
]
  write(i,package_json)


