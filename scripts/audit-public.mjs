import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
// Fixed public targets only. No user input, personal query data or credentials.
const targets = [
  ['home','https://landready.blogspot.com/'],
  ['trip','https://landready-assets.ansqhd5774.workers.dev/trip?lang=ko&origin=KR&destination=JP'],
  ['sitemap','https://landready.blogspot.com/sitemap.xml'],
  ['logo','https://landready-assets.ansqhd5774.workers.dev/assets/favicon-r2.png'],
  ['front','https://landready-assets.ansqhd5774.workers.dev/assets/japan-entry-card-1.png'],
];
const file = 'artifacts/public-audit.json';
let previous;
try { previous=JSON.parse(await fs.readFile(file,'utf8')); } catch {}
const results=[];
for(const [id,url] of targets) {
  try {
    const response=await fetch(url,{signal:AbortSignal.timeout(20000)});
    const bytes=Buffer.from(await response.arrayBuffer());
    const hash=createHash('sha256').update(bytes).digest('hex');
    const old=previous?.results.find(row=>row.id===id);
    const row={id,url,status:response.status,checkedAt:new Date().toISOString(),sha256:hash,state:response.ok?'FETCHED_UNREVIEWED':'RETRIEVAL_FAILED',reviewCandidate:response.ok&&!!old?.sha256&&old.sha256!==hash};
    if(id==='trip'&&response.ok){
      const html=bytes.toString('utf8');
      row.checks={intentionalNoindex:response.headers.get('x-robots-tag')==='noindex',canonical:html.includes('rel="canonical"'),description:html.includes('name="description"'),share:html.includes('property="og:title"'),structuredData:html.includes('application/ld+json'),form:html.includes('id="jp-entry-form"')};
    }
    results.push(row);
  } catch {
    results.push({id,url,checkedAt:new Date().toISOString(),state:'RETRIEVAL_FAILED',reviewCandidate:false});
  }
}
await fs.mkdir('artifacts',{recursive:true});
await fs.writeFile(file,JSON.stringify({checkedAt:new Date().toISOString(),results,sitemapInventory:'UNVERIFIED: authoritative public post inventory not supplied',searchIndex:'UNVERIFIED: HTTP success does not prove indexing'},null,2));
console.log(JSON.stringify(results.map(({id,status,state,checks})=>({id,status,state,checks})),null,2));
if(results.some(row=>row.state==='RETRIEVAL_FAILED'||row.checks&&Object.values(row.checks).some(value=>!value)))process.exitCode=1;
