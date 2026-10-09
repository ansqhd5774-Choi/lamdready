const origin='https://landready.blogspot.com';
export function internalLinks(html,base) {
  const links=new Set();
  for(const match of html.matchAll(/<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1/gi)) {
    try {const url=new URL(match[2].replace(/&amp;/g,'&').replace(/&#39;/g,"'"),base);
      if(url.origin!==origin||url.username||url.password)continue;
      url.hash='';url.searchParams.delete('m');links.add(url.href);
    }catch{}
  }
  return [...links];
}
export function reachablePosts(pages,posts,start=origin+'/') {
  const seen=new Set(),queue=[start];
  while(queue.length){const url=queue.shift();if(seen.has(url))continue;seen.add(url);
    for(const link of pages.get(url)?.links||[])if(pages.has(link)&&!seen.has(link))queue.push(link);
  }
  return {reachable:posts.filter(url=>seen.has(url)),unreachable:posts.filter(url=>!seen.has(url))};
}
