import fs from 'node:fs/promises';
import {boundedAudit,AUDIT_LIMITS} from '../src/bounded-audit.js';
import {inspectDocument,publicTargets} from '../src/seo-audit.js';
const home='https://landready.blogspot.com/';
const trip='https://landready-assets.ansqhd5774.workers.dev/trip?lang=ko&origin=KR&destination=JP';
const feed=home+'feeds/posts/default?alt=json&max-results=1';
const sitemap=home+'sitemap.xml';
const texts=new Map(),rows=[];
const checkpoint='artifacts/travel-current-audit.json';
await fs.mkdir('artifacts',{recursive:true});
const save=async extra=>fs.writeFile(checkpoint,JSON.stringify({checkedAt:new Date().toISOString(),scope:'Current travel home/form only; deleted legacy posts excluded',limits:{...AUDIT_LIMITS,maxRequests:35,retries:0},results:rows,...extra},null,2));
const fetchImpl=async(url,options)=>{const response=await fetch(url,options);if(response.ok&&/text|json|xml/.test(response.headers.get('content-type')||''))texts.set(url,await response.text());return response;};
const audit=async targets=>boundedAudit(targets,{fetchImpl,maxRequests:35-rows.length,onChunk:async chunk=>{rows.push(...chunk.results);await save({state:chunk.stopReason?'STOPPED':'RUNNING',stopReason:chunk.stopReason});}});
const initial=await audit([home,trip,feed,sitemap,home+'robots.txt']);
if(initial.state!=='COMPLETE'){await save({state:initial.state,stopReason:initial.stopReason});process.exitCode=1;}
else{
 const targets=[home,trip].flatMap(url=>publicTargets(texts.get(url)||'',url)).filter(row=>[new URL(home).host,new URL(trip).host].includes(new URL(row.url).host)).map(row=>row.url).filter(url=>!rows.some(row=>row.url===url));
 const assets=await audit(targets);
 let publicPostCount=null;try{publicPostCount=Number(JSON.parse(texts.get(feed)).feed['openSearch$totalResults'].$t);}catch{}
 const documents=[home,trip].map(url=>inspectDocument(texts.get(url)||'',url));
 const findings={publicPostCount,legacyPostsRemain:publicPostCount!==0,formNoindex:documents[1].noindex,annotationAttributed:(texts.get(trip)||'').includes('번호·색상 표시는 LandReady가 추가했습니다.'),sitemapUrlCount:[...(texts.get(sitemap)||'').matchAll(/<loc>/g)].length,documents};
 const failed=rows.filter(row=>row.state!=='HTTP_OK');
 const state=assets.state==='COMPLETE'&&!failed.length&&publicPostCount===0&&findings.formNoindex&&findings.annotationAttributed?'PASS':'REVIEW_REQUIRED';
 await save({state,stopReason:assets.stopReason,remaining:assets.remaining,findings});
 console.log(JSON.stringify({state,requests:rows.length,failed:failed.length,...findings,documents:undefined}));if(state!=='PASS')process.exitCode=1;
}
