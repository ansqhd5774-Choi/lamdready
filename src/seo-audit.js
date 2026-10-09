const decode=value=>value.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
export function inlineStyles(html){return [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map(match=>match[1]);}
export function attributes(tag){const result={};for(const [,key,,value] of tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/gs))result[key.toLowerCase()]=decode(value);return result;}
export function inspectDocument(html,url,headers={}){
 const metas=[...html.matchAll(/<meta\b[^>]*>/gi)].map(match=>attributes(match[0]));
 const meta=name=>metas.find(row=>row.name?.toLowerCase()===name||row.property?.toLowerCase()===name)?.content||null;
 const links=[...html.matchAll(/<link\b[^>]*>/gi)].map(match=>attributes(match[0]));
 const canonical=links.find(row=>row.rel?.toLowerCase()==='canonical')?.href||null;
 const title=decode(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim()||'');
 const positive=value=>/^\d+$/.test(value||'')&&Number(value)>0;
 const imageRows=[...html.matchAll(/<img\b[^>]*>/gi)].map(match=>attributes(match[0])).map(row=>({src:row.src,altPresent:Object.hasOwn(row,'alt'),alt:row.alt||'',width:row.width||null,height:row.height||null,dimensionsValid:positive(row.width)&&positive(row.height),loading:row.loading||null}));
 const noindex=/noindex/i.test([meta('robots'),headers.xRobotsTag].join(' '));
 const soft404Candidate=/\b(404|page not found|blog not found)\b|페이지를 찾을 수 없/i.test(title)||/Sorry, the page you were looking for in this blog does not exist/i.test(html);
 return {url,title,description:meta('description'),canonical,canonicalMatches:canonical===url,robots:meta('robots'),xRobotsTag:headers.xRobotsTag||null,noindex,ogTitle:meta('og:title'),ogDescription:meta('og:description'),ogImage:meta('og:image'),structuredDataCount:[...html.matchAll(/type\s*=\s*["']application\/ld\+json["']/gi)].length,microdataTypes:[...new Set([...html.matchAll(/\bitemtype\s*=\s*(["'])(.*?)\1/gi)].map(match=>decode(match[2])))],soft404Candidate,imageCount:imageRows.length,imagesMissingAlt:imageRows.filter(row=>!row.altPresent).length,imagesEmptyAlt:imageRows.filter(row=>row.altPresent&&!row.alt).length,imagesMissingDimensions:imageRows.filter(row=>!row.dimensionsValid).length,images:imageRows};
}
export function publicTargets(html,base){
 const out=[];
 for(const match of html.matchAll(/<(a|img)\b[^>]*>/gi)){
  const attr=attributes(match[0]),raw=match[1].toLowerCase()==='a'?attr.href:attr.src;if(!raw)continue;
  try{const url=new URL(raw,base);if(!['https:','http:'].includes(url.protocol)||url.username||url.password)continue;url.hash='';out.push({url:url.href,kind:match[1].toLowerCase()==='img'?'image':'link'});}catch{}
 }
 return out;
}
