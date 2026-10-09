import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const registry=JSON.parse(await fs.readFile('data/review-sources.json','utf8'));
const root='local-data/source-review';
await fs.mkdir(root,{recursive:true});
let previous={items:[]};
try{previous=JSON.parse(await fs.readFile(`${root}/latest.json`,'utf8'));}catch{}
const items=[];
for(const source of registry.items){
  const old=previous.items.find(row=>row.id===source.id);
  const fetchedAt=new Date().toISOString();
  const base={...source,fetchedAt,reviewedAt:old?.reviewedAt||null,verifiedAt:old?.verifiedAt||null,effectiveAt:null,nextReviewAt:new Date(Date.now()+source.reviewIntervalDays*86400000).toISOString()};
  try {
    const response=await fetch(source.url,{signal:AbortSignal.timeout(20000)});
    if(!response.ok)throw Error(`HTTP_${response.status}`);
    const bytes=Buffer.from(await response.arrayBuffer());
    if(bytes.length>10*1024*1024)throw Error('SIZE_LIMIT');
    const sha256=createHash('sha256').update(bytes).digest('hex');
    const changed=!!old?.sha256&&old.sha256!==sha256;
    items.push({...base,status:changed?'CHANGE_REVIEW_REQUIRED':'FETCHED_UNREVIEWED',sha256,lastSuccessfulFetchAt:fetchedAt,bytes:bytes.length,regulationVerified:false,changeCandidate:changed});
  }catch(error){
    items.push({...base,status:'RETRIEVAL_FAILED',sha256:old?.sha256||null,lastSuccessfulFetchAt:old?.lastSuccessfulFetchAt||null,regulationVerified:false,changeCandidate:false,error:error.message});
  }
}
const report={checkedAt:new Date().toISOString(),processedCount:items.length,automaticApproval:false,items};
const encoded=JSON.stringify(report,null,2);
await fs.writeFile(`${root}/${report.checkedAt.replace(/[:.]/g,'-')}.json`,encoded);
await fs.writeFile(`${root}/latest.json.tmp`,encoded);
await fs.rename(`${root}/latest.json.tmp`,`${root}/latest.json`);
console.log(JSON.stringify(items.map(({id,status,bytes,changeCandidate})=>({id,status,bytes,changeCandidate})),null,2));
if(items.some(row=>row.status==='RETRIEVAL_FAILED'))process.exitCode=1;
