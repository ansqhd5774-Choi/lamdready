import fs from 'node:fs/promises';
import {inspectDocument,publicTargets} from '../src/seo-audit.js';
const base='https://landready.blogspot.com/',output='artifacts/seo-links-audit.json';
// Preserve evidence and prevent a rerun from silently retrying failed requests.
try{await fs.access(output);throw Error('EVIDENCE_EXISTS_STOP_NO_AUTOMATIC_RETRY');}catch(error){if(error.code!=='ENOENT')throw error;}
const report={checkedAt:new Date().toISOString(),state:'RUNNING',scope:'Public posts and static-page feed; same-origin document SEO; bounded public external anchors/images. Concurrency 3, 20 second timeout, maximum 100 new targets, no retries.',requests:[],documents:[],targets:[],skipped:[],limitations:['Server HTML only; no browser execution or viewport simulation.','Soft 404 heuristics produce review candidates, not confirmed removals.','Image rights and health-content accuracy are not inferred from successful HTTP responses.']};
const seen=new Set(),texts=new Map();
async function save(){const temp=output+'.tmp';await fs.writeFile(temp,JSON.stringify(report,null,2));await fs.rename(temp,output);}
async function read(url,kind){if(seen.has(url))return;seen.add(url);
 try{const response=await fetch(url,{signal:AbortSignal.timeout(20000)});let text=null;
  if(kind==='document'||kind==='feed'){text=await response.text();if(Buffer.byteLength(text)>5*1024*1024)throw Error('BODY_LIMIT');texts.set(url,text);}else await response.body?.cancel();
  report.requests.push({url,kind,status:response.status,finalUrl:response.url,contentType:response.headers.get('content-type'),state:response.ok?'HTTP_OK':'HTTP_FAILED'});
  if(kind==='document'&&response.ok){report.documents.push(inspectDocument(text,url,{xRobotsTag:response.headers.get('x-robots-tag')}));report.targets.push(...publicTargets(text,url));}
 }catch(error){report.requests.push({url,kind,state:'RETRIEVAL_FAILED',reason:error.message});}
}
async function batch(targets){for(let i=0;i<targets.length&&seen.size<100;i+=3){await Promise.all(targets.slice(i,i+Math.min(3,100-seen.size)).map(row=>read(row.url,row.kind)));await save();}}
await fs.mkdir('artifacts',{recursive:true});
const feedUrls=['posts','pages'].map(type=>base+`feeds/${type}/default?alt=json&max-results=150`);
await batch(feedUrls.map(url=>({url,kind:'feed'})));
const inventories=feedUrls.map((url,index)=>{try{const feed=JSON.parse(texts.get(url)).feed;const entries=feed.entry||[];return {kind:index?'staticPages':'posts',total:Number(feed.openSearch$totalResults.$t),count:entries.length,complete:Number(feed.openSearch$totalResults.$t)===entries.length,urls:entries.map(entry=>entry.link.find(row=>row.rel==='alternate'&&row.type==='text/html')?.href).filter(Boolean)};}catch{return {kind:index?'staticPages':'posts',state:'INVENTORY_FAILED',complete:false,urls:[]};}});
report.inventory=inventories;
await batch([{url:base,kind:'document'},...inventories.flatMap(row=>row.urls).filter(url=>new URL(url).origin===new URL(base).origin).map(url=>({url,kind:'document'}))]);
const existing=JSON.parse(await fs.readFile('artifacts/link-audit.json','utf8')),resume=JSON.parse(await fs.readFile('artifacts/link-audit-resume.json','utf8'));
const knownInternal=new Set([...existing.pages,...resume.results].map(row=>row.url));
const unique=new Map();for(const row of report.targets){if(seen.has(row.url)||knownInternal.has(row.url))continue;
 const url=new URL(row.url);
 if(row.kind==='link'&&url.origin!==new URL(base).origin&&url.search){report.skipped.push({...row,reason:'EXTERNAL_QUERY_NOT_FETCHED'});continue;}
 if(/login|signin|logout|signout|oauth|accounts\./i.test(row.url)){report.skipped.push({...row,reason:'ACCOUNT_ROUTE_NOT_FETCHED'});continue;}
 unique.set(row.url,row);
}
const officialHost=hostname=>/\.(go\.jp|go\.kr|gov|gov\.uk)$/.test(hostname)||['www.digital.go.jp','www.vjw.digital.go.jp'].includes(hostname);
const queue=[...unique.values()].sort((a,b)=>Number(officialHost(new URL(b.url).hostname))-Number(officialHost(new URL(a.url).hostname))||Number(a.kind==='image')-Number(b.kind==='image'));
await batch(queue);report.uninspectedTargets=queue.filter(row=>!seen.has(row.url));
report.reusedInternalResponseCount=knownInternal.size;report.failures=report.requests.filter(row=>row.state!=='HTTP_OK');
report.seoReviewCandidates=report.documents.flatMap(row=>[['missing_title',!row.title],['missing_description',!row.description],['canonical_mismatch',!row.canonicalMatches],['noindex_public_document',row.noindex],['soft404_candidate',row.soft404Candidate],['missing_og_title',!row.ogTitle],['missing_og_description',!row.ogDescription],['missing_og_image',!row.ogImage]].filter(([,condition])=>condition).map(([reason])=>({url:row.url,reason})));
report.state=report.failures.length||report.seoReviewCandidates.length?'REVIEW_REQUIRED':report.uninspectedTargets.length?'PARTIAL':'PASS_SCOPED';await save();
console.log(JSON.stringify({state:report.state,inventory:inventories,requests:report.requests.length,failures:report.failures,seoReviewCandidates:report.seoReviewCandidates,uninspected:report.uninspectedTargets.length,skipped:report.skipped.length},null,2));
