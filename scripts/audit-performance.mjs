import fs from 'node:fs/promises';
import {documentResources,nestedResources} from '../src/performance-audit.js';
const targets=[['home','https://landready.blogspot.com/'],['trip','https://lamdready-assets.ansqhd5774.workers.dev/trip?lang=ko&origin=KR&destination=JP']];
const results=[];
const allowed=new Set(['landready.blogspot.com','lamdready-assets.ansqhd5774.workers.dev','fonts.googleapis.com','fonts.gstatic.com','resources.blogblog.com','www.blogger.com','blogger.googleusercontent.com','www.gstatic.com']);
async function retrieve(url){
 const start=performance.now();
 const response=await fetch(url,{signal:AbortSignal.timeout(20000)});
 const buffer=Buffer.from(await response.arrayBuffer());
 return {row:{url,status:response.status,decodedBytes:buffer.length,contentLengthHeader:response.headers.get('content-length'),contentEncoding:response.headers.get('content-encoding'),contentType:response.headers.get('content-type'),cacheControl:response.headers.get('cache-control'),fetchDurationMs:Math.round(performance.now()-start)},text:buffer.toString('utf8')};
}
for(const [id,url] of targets){
 const rows=[],seen=new Set([url]),skipped=[];
 try{
  const document=await retrieve(url);rows.push({...document.row,kind:'document'});
  const inventory=documentResources(document.text,url),queue=inventory.filter(r=>!r.lazy);
  while(queue.length&&seen.size<60){
   const resource=queue.shift();if(seen.has(resource.url))continue;seen.add(resource.url);
   if(!allowed.has(new URL(resource.url).hostname)){skipped.push({...resource,reason:'UNREGISTERED_PUBLIC_HOST'});continue;}
   try{const fetched=await retrieve(resource.url);rows.push({...resource,...fetched.row});if(fetched.row.status===200)queue.push(...nestedResources(fetched.text,resource.url,resource.kind));}
   catch(error){rows.push({...resource,state:'RETRIEVAL_FAILED',error:error.name});}
  }
  results.push({id,rows,skipped,inventory,lazyExcluded:inventory.filter(r=>r.lazy),resourceLimitReached:queue.length>0,decodedInventoryBytes:rows.reduce((sum,row)=>sum+(row.decodedBytes??0),0)});
 }catch(error){results.push({id,state:'RETRIEVAL_FAILED',error:error.name,rows});}
}
const report={checkedAt:new Date().toISOString(),method:'Sequential Node public HTTP fetch; decoded body sizes and response headers. HTML-declared non-lazy images, stylesheets, scripts and static imports/CSS URL resources only. CSS resources include potentially unused selectors. No browser viewport or cache simulation.',limitations:['Not Lighthouse, LCP, INP, CLS or real-user CWV','Decoded bytes are not compressed wire transfer bytes; content-length is an optional server header only','No dynamic JavaScript execution, responsive srcset selection, lazy viewport eligibility or third-party runtime requests','No retry; fixed two pages; maximum 59 dependent resources per page; only registered public hosts'],results};
await fs.mkdir('artifacts',{recursive:true});await fs.writeFile('artifacts/performance-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(results.map(r=>({id:r.id,decodedInventoryBytes:r.decodedInventoryBytes,resources:r.rows.length,failures:r.rows.filter(x=>x.state==='RETRIEVAL_FAILED'||x.status>=400).map(x=>({url:x.url,status:x.status,error:x.error})),skipped:r.skipped?.length,lazy:r.lazyExcluded?.length})),null,2));
if(results.some(r=>r.state==='RETRIEVAL_FAILED'||r.resourceLimitReached||r.rows.some(x=>x.state==='RETRIEVAL_FAILED'||x.status>=400)))process.exitCode=1;
