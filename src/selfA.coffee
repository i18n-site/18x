# 判断A标签的href是否为当前网站的, 如果是, 返回url, 以实现不刷新跳转

< (p, e)=>
  if p.host == location.host
    {hash} = p
    url = p.pathname.slice(1) + p.search
    if hash
      url += hash
    e.preventDefault()
    return url
  return
