// Static document resource inventory, not a browser waterfall or Core Web Vitals.
export function attributes(tag) {
  const result={};
  for(const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) result[match[1].toLowerCase()]=match[2]??match[3];
  return result;
}
export function documentResources(html,base) {
  const resources=[];
  const add=(kind,raw,details={})=>{try{const url=new URL(raw.replaceAll('&amp;','&'),base);if(url.protocol==='https:')resources.push({kind,url:url.href,...details});}catch{}};
  for(const match of html.matchAll(/<(script|link|img)\b[^>]*>/gi)){
    const kind=match[1].toLowerCase(),a=attributes(match[0]);
    if(kind==='script'&&a.src)add('script',a.src,{blocking:!/(?:\sdefer\b|\sasync\b)/i.test(match[0])&&a.type!=='module',module:a.type==='module'});
    if(kind==='link'&&a.href&&a.rel==='stylesheet')add('stylesheet',a.href,{blocking:a.media!=='print'});
    if(kind==='img'&&a.src)add('image',a.src,{lazy:a.loading==='lazy',width:a.width??null,height:a.height??null,alt:a.alt??null,fetchpriority:a.fetchpriority??null});
  }
  return resources;
}
export function nestedResources(text,base,kind){
 const result=[];
 const add=(raw,type)=>{try{const url=new URL(raw,base);if(url.protocol==='https:')result.push({kind:type,url:url.href});}catch{}};
 if(kind==='stylesheet')for(const match of text.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g))add(match[1],/\.(?:woff2?|ttf|otf)(?:\?|$)/i.test(match[1])?'font':'css-resource');
 if(kind==='script')for(const match of text.matchAll(/(?:\bfrom\s*|\bimport\s*)["']([^"']+)["']/g))if(/^(?:\.\/|\.\.\/|\/|https:\/\/)/.test(match[1]))add(match[1],'script');
 return result;
}
