import fs from 'node:fs/promises';
import {boundedAudit,AUDIT_LIMITS} from '../src/bounded-audit.js';
import {inspectDocument,publicTargets,inlineStyles} from '../src/seo-audit.js';
import {documentResources,nestedResources} from '../src/performance-audit.js';
const home='https://landready.blogspot.com/';
const trip='https://landready-assets.ansqhd5774.workers.dev/trip?lang=ko&origin=KR&destination=JP';
const feed=home+'feeds/posts/default?alt=json&max-results=1';
const sitemap=home+'sitemap.xml';
const texts=new Map(),headers=new Map(),rows=[];
const checkpoint='artifacts/travel-current-audit.json';
await fs.mkdir('artifacts',{recursive:true});
const save=async extra=>fs.writeFile(checkpoint,JSON.stringify({checkedAt:new Date().toISOString(),scope:'Current travel home/form only; deleted legacy posts excluded',limits:{...AUDIT_LIMITS,maxRequests:35,retries:0},results:rows,...extra},null,2));
const fetchImpl=async(url,options)=>{const response=await fetch(url,options);headers.set(url,{xRobotsTag:response.headers.get('x-robots-tag')});if(response.ok&&/text|json|xml|javascript/.test(response.headers.get('content-type')||''))texts.set(url,await response.text());return response;};
const audit=async targets=>boundedAudit(targets,{fetchImpl,maxRequests:35-rows.length,onChunk:async chunk=>{rows.push(...chunk.results);await save({state:chunk.stopReason?'STOPPED':'RUNNING',stopReason:chunk.stopReason});}});
const initial=await audit([home,trip,feed,sitemap,home+'robots.txt']);
if(initial.state!=='COMPLETE'){await save({state:initial.state,stopReason:initial.stopReason});process.exitCode=1;}
else{
 const allowed=new Set([new URL(home).host,new URL(trip).host]);
 const resources=[home,trip].flatMap(url=>{
  const html=texts.get(url)||'',doc=inspectDocument(html,url,headers.get(url));
  const inlineCss=inlineStyles(html).flatMap(css=>nestedResources(css,url,'stylesheet'));
  return [...documentResources(html,url),...publicTargets(html,url),...inlineCss,...(doc.ogImage?[{url:new URL(doc.ogImage,url).href,kind:'og-image'}]:[])];
 });
 const excluded=[],resourceTypes=new Map();let assets={state:'COMPLETE',remaining:[],stopReason:null};
 while(true){
  const pending=[];
  for(const resource of resources){const url=new URL(resource.url);if(!allowed.has(url.host)){if(!excluded.some(row=>row.url===resource.url))excluded.push({...resource,reason:'OUTSIDE_CURRENT_PUBLIC_HOSTS'});continue;}
   if(url.pathname.startsWith('/search/label/')||rows.some(row=>row.url===resource.url)||pending.includes(resource.url))continue;
   resourceTypes.set(resource.url,resource.kind);pending.push(resource.url);
  }
  if(!pending.length)break;assets=await audit(pending);if(assets.state!=='COMPLETE')break;
  for(const url of pending){const kind=resourceTypes.get(url);if(['script','stylesheet'].includes(kind)&&texts.has(url))resources.push(...nestedResources(texts.get(url),url,kind));}
 }
 let publicPostCount=null;try{publicPostCount=Number(JSON.parse(texts.get(feed)).feed['openSearch$totalResults'].$t);}catch{}
 const documents=[home,trip].map(url=>inspectDocument(texts.get(url)||'',url,headers.get(url)));
 const findings={publicPostCount,legacyPostsRemain:publicPostCount!==0,formNoindex:documents[1].noindex,annotationAttributed:(texts.get(trip)||'').includes('번호·색상 표시는 LandReady가 추가했습니다.'),sitemapUrlCount:[...(texts.get(sitemap)||'').matchAll(/<loc>/g)].length,documents,resources:[...resourceTypes].map(([url,kind])=>({url,kind})),excludedResources:excluded,imageRights:'NOT_VERIFIED_BY_HTTP_OR_ATTRIBUTION',limitations:['Static script imports and CSS url references only; dynamic requests, browser rendering, srcset selection and image decoding are not covered.','External resources outside the two current public hosts are inventoried but not fetched.','alt presence and positive width/height are checked; alt suitability and image rights require separate review.']};
 const failed=rows.filter(row=>row.state!=='HTTP_OK');
 const state=assets.state==='COMPLETE'&&!failed.length&&publicPostCount===0&&findings.formNoindex&&findings.annotationAttributed?'PASS':'REVIEW_REQUIRED';
 await save({state,stopReason:assets.stopReason,remaining:assets.remaining,findings});
 console.log(JSON.stringify({state,requests:rows.length,failed:failed.length,...findings,documents:undefined}));if(state!=='PASS')process.exitCode=1;
}
