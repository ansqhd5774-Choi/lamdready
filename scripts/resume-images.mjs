import fs from 'node:fs/promises';
const source=JSON.parse(await fs.readFile('artifacts/seo-links-audit.json','utf8'));
const initial=JSON.parse(await fs.readFile('artifacts/image-response-audit.json','utf8'));
if(initial.sourceCheckedAt!==source.checkedAt)throw Error('SOURCE_CHECKPOINT_MISMATCH_STOP');
const output='artifacts/image-response-resume.json';
let previous;
try{previous=JSON.parse(await fs.readFile(output,'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
if(previous&&(previous.sourceCheckedAt!==source.checkedAt||previous.initialCheckedAt!==initial.checkedAt))throw Error('RESUME_CHECKPOINT_MISMATCH_STOP');
const candidates=[...new Set(source.targets.filter(row=>row.kind==='image').map(row=>row.url))];
const initialUrls=new Set(initial.results.map(row=>row.url));
const results=previous?.results||[],completed=new Set([...initialUrls,...results.map(row=>row.url)]);
const pending=candidates.filter(url=>!completed.has(url));
const chunks=previous?.chunks||[];
const report={checkedAt:new Date().toISOString(),sourceCheckedAt:source.checkedAt,initialCheckedAt:initial.checkedAt,state:'RUNNING',scope:'Existing image targets only; chunks <=50; concurrency 3; 20 second timeout; no retry or new discovery. Completed successes and failures are reused.',candidateCount:candidates.length,initialCount:initial.results.length,results,chunks};
async function save(){report.checkedAt=new Date().toISOString();const temp=output+'.tmp';await fs.writeFile(temp,JSON.stringify(report,null,2));await fs.rename(temp,output);}
async function inspect(url){try{const parsed=new URL(url);if(!['https:','http:'].includes(parsed.protocol)||parsed.username||parsed.password)throw Error('TARGET_OUTSIDE_SCOPE');
 const response=await fetch(url,{signal:AbortSignal.timeout(20000)});await response.body?.cancel();
 results.push({url,status:response.status,contentType:response.headers.get('content-type'),finalUrl:response.url,state:response.ok?'HTTP_OK':'HTTP_FAILED',checkedAt:new Date().toISOString()});
}catch(error){results.push({url,state:'RETRIEVAL_FAILED',reason:error.message,checkedAt:new Date().toISOString()});}}
for(let index=0;index<pending.length;index+=50){const targets=pending.slice(index,index+50);const start=results.length;
 for(let offset=0;offset<targets.length;offset+=3){await Promise.all(targets.slice(offset,offset+3).map(inspect));await save();}
 const rows=results.slice(start);chunks.push({count:rows.length,failures:rows.filter(row=>row.state!=='HTTP_OK').length,completedAt:new Date().toISOString()});await save();
}
const all=[...initial.results,...results];report.totalUniqueInspectedCount=new Set(all.map(row=>row.url)).size;
report.remaining=candidates.filter(url=>!all.some(row=>row.url===url));report.remainingCount=report.remaining.length;
report.failures=all.filter(row=>row.state!=='HTTP_OK');report.state=report.failures.length?'REVIEW_REQUIRED':report.remainingCount?'PARTIAL':'PASS_HTTP_SCOPED';
report.limitations=['HTTP response only; no image decoding, browser rendering, alt adequacy, license or attribution verification.'];await save();
const {results:details,remaining,...summary}=report;console.log(JSON.stringify(summary,null,2));
if(report.failures.length)process.exitCode=1;
