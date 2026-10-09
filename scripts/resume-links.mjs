import fs from 'node:fs/promises';
const checkpoint=JSON.parse(await fs.readFile('artifacts/link-audit.json','utf8'));
const inspected=new Set(checkpoint.pages.map(page=>page.url));
const output='artifacts/link-audit-resume.json';
let previous;
try{previous=JSON.parse(await fs.readFile(output,'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
if(previous&&previous.checkpointCheckedAt!==checkpoint.checkedAt)throw Error('CHECKPOINT_MISMATCH_STOP');
const results=previous?.results||[];
const completed=new Set(results.map(row=>row.url));
const pending=[...new Set(checkpoint.uninspectedTargets)].filter(url=>!inspected.has(url)&&!completed.has(url));
const targets=pending.slice(0,200);
async function savePartial(){const temporary=output+'.tmp';await fs.writeFile(temporary,JSON.stringify({checkpointCheckedAt:checkpoint.checkedAt,state:'RUNNING',results},null,2));await fs.rename(temporary,output);}
async function read(url){
 try {
  const target=new URL(url);
  if(target.origin!=='https://landready.blogspot.com'||target.username||target.password)throw Error('TARGET_OUTSIDE_SCOPE');
  const response=await fetch(url,{signal:AbortSignal.timeout(20000)});
  await response.body?.cancel();
  results.push({url,status:response.status,finalUrl:response.url,state:response.ok?'HTTP_OK':'HTTP_FAILED',checkedAt:new Date().toISOString()});
 }catch(error){results.push({url,state:'RETRIEVAL_FAILED',reason:error.message,checkedAt:new Date().toISOString()});}
}
for(let index=0;index<targets.length;index+=3){await Promise.all(targets.slice(index,index+3).map(read));await savePartial();}
const remaining=pending.slice(200),failures=results.filter(row=>row.state!=='HTTP_OK');
const report={checkedAt:new Date().toISOString(),checkpointCheckedAt:checkpoint.checkedAt,scope:'Resume existing uninspected same-origin targets only; maximum 200; concurrency 3; 20 second timeout; no retry; no additional link discovery',previouslyInspectedCount:inspected.size,resumeCount:results.length,totalUniqueInspectedCount:new Set([...inspected,...results.map(row=>row.url)]).size,remainingCount:remaining.length,remaining,failures,state:failures.length?'REVIEW_REQUIRED':remaining.length?'PARTIAL':'PASS_SCOPED',limitations:['HTTP response assessment only; soft 404 semantics, external links, JavaScript navigation and image content excluded.','Checkpoint graph has 311 linked targets; totals also include feed and sitemap inventory requests.'],results};
await fs.writeFile(output,JSON.stringify(report,null,2));
const {results:detail,remaining:uninspected,...summary}=report;console.log(JSON.stringify(summary,null,2));
if(failures.length)process.exitCode=1;
