const home = 'https://landready.blogspot.com';
export function sitemapRows(xml) {
  if (!/<urlset\b/.test(xml)) throw Error('UNSUPPORTED_SITEMAP');
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([,body])=>({
    url:body.match(/<loc>(.*?)<\/loc>/)?.[1]?.replace(/&amp;/g,'&'),
    lastmod:body.match(/<lastmod>(.*?)<\/lastmod>/)?.[1]||null,
  }));
}
export function compareInventory(feed, rows, now = Date.now()) {
  const total=Number(feed?.feed?.openSearch$totalResults?.$t);
  const entries=feed?.feed?.entry||[];
  if(!Number.isInteger(total)||total<0||!Array.isArray(entries))throw Error('INVALID_FEED');
  const posts=entries.map(entry=>({url:entry.link?.find(link=>link.rel==='alternate'&&link.type==='text/html')?.href,updated:entry.updated?.$t}));
  const valid=url=>{try{const u=new URL(url);return u.origin===home&&!u.search&&!u.hash&&u.pathname.endsWith('.html');}catch{return false;}};
  const invalid=rows.filter(row=>!valid(row.url)).map(row=>row.url||'MISSING_URL');
  const urls=rows.map(row=>row.url),unique=new Set(urls);
  const duplicates=urls.filter((url,index)=>urls.indexOf(url)!==index);
  const complete=entries.length===total&&posts.every(post=>valid(post.url))&&new Set(posts.map(post=>post.url)).size===total;
  const published=new Map(posts.map(post=>[post.url,post.updated]));
  const missing=posts.filter(post=>!unique.has(post.url)).map(post=>post.url);
  const extra=complete?urls.filter(url=>!published.has(url)):[];
  const invalidDates=rows.filter(row=>!row.lastmod||!Number.isFinite(Date.parse(row.lastmod))||Date.parse(row.lastmod)>now).map(row=>row.url);
  // Blogger feed includes milliseconds; sitemap serializes the same instant to seconds.
  const seconds=value=>Math.floor(Date.parse(value)/1000);
  const dateMismatches=rows.filter(row=>published.has(row.url)&&seconds(row.lastmod)!==seconds(published.get(row.url))).map(row=>row.url);
  return {feedTotal:total,feedCount:entries.length,sitemapCount:rows.length,inventoryComplete:complete,missing,extra,duplicates,invalid,invalidDates,dateMismatches,
    state:!complete?'PARTIAL':missing.length||extra.length||duplicates.length||invalid.length||invalidDates.length||dateMismatches.length?'REVIEW_REQUIRED':'PASS',posts};
}
