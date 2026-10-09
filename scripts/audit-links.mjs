import fs from 'node:fs/promises';
import {internalLinks,reachablePosts} from '../src/public-links.js';
import {compareInventory,sitemapRows} from '../src/public-inventory.js';
const home='https://landready.blogspot.com/',pages=new Map(),failures=[];
const read=async url=>{try{const response=await fetch(url,{signal:AbortSignal.timeout(20000)});
  const html=await response.text();if(Buffer.byteLength(html)>5*1024*1024)throw Error('BODY_LIMIT');
  const row={url,status:response.status,finalUrl:response.url,links:response.ok?internalLinks(html,url):[],state:response.ok?'HTTP_OK':'HTTP_FAILED'};
  pages.set(url,row);if(!response.ok)failures.push({url,reason:`HTTP_${response.status}`});return html;
}catch(error){failures.push({url,reason:error.message});pages.set(url,{url,state:'RETRIEVAL_FAILED',links:[]});return null;}};
const batch=async urls=>{for(let i=0;i<urls.length;i+=3)await Promise.all(urls.slice(i,i+3).map(read));};
try {
  const [xml,feedText]=await Promise.all([read(home+'sitemap.xml'),read(home+'feeds/posts/default?alt=json&max-results=150')]);
  if(!xml||!feedText)throw Error('INVENTORY_RETRIEVAL_FAILED');
  const feed=JSON.parse(feedText),inventory=compareInventory(feed,sitemapRows(xml));
  if(!inventory.inventoryComplete)throw Error('INVENTORY_INCOMPLETE');
  const posts=inventory.posts.map(post=>post.url);
  await batch([home,...posts]);
  const categoryTerms=[...new Set((feed.feed.entry||[]).flatMap(entry=>(entry.category||[]).map(category=>category.term)))];
  const navigation=new Set(categoryTerms.map(term=>home+'search/label/'+encodeURIComponent(term)));
  for(const link of pages.get(home)?.links||[])if(new URL(link).pathname.startsWith('/search'))navigation.add(link);
  // Bound navigation to 40 pages and all inspected internal targets to 120. No external crawling or retries.
  let fetchedNavigation=0;
  while(fetchedNavigation<40){const pending=[...navigation].filter(url=>!pages.has(url)).slice(0,Math.min(3,40-fetchedNavigation));if(!pending.length)break;
    await batch(pending);fetchedNavigation+=pending.length;
    for(const url of pending)for(const link of pages.get(url)?.links||[])if(new URL(link).pathname.startsWith('/search'))navigation.add(link);
  }
  const relevantPages=[...pages.values()].filter(row=>row.url===home||posts.includes(row.url)||navigation.has(row.url));
  const internalTargets=[...new Set(relevantPages.flatMap(row=>row.links))];
  const pending=internalTargets.filter(url=>!pages.has(url));const targetBudget=Math.max(0,120-pages.size);await batch(pending.slice(0,targetBudget));
  const reach=reachablePosts(pages,posts);
  const categoryCoverage=posts.filter(url=>[...navigation].some(category=>pages.get(category)?.links.includes(url)));
  const report={checkedAt:new Date().toISOString(),scope:'Anonymous rendered HTML anchors; same-origin only; 40 navigation pages and 120 total targets maximum; concurrency 3; 20 second request timeout; no retry',postCount:posts.length,inspectedPages:pages.size,navigationPages:fetchedNavigation,internalTargets:internalTargets.length,uninspectedTargets:pending.slice(targetBudget),navigationTruncated:[...navigation].filter(url=>!pages.has(url)),...reach,categoryDirectCoverage:categoryCoverage.length,failures,state:failures.length?'REVIEW_REQUIRED':reach.unreachable.length?'REACHABILITY_REVIEW_REQUIRED':'PASS',limitations:['External links, JavaScript-only navigation, image responses, authenticated pages and soft 404 semantic assessment not covered.','Unreachable means absent from bounded inspected navigation graph; it is not proof of global isolation.'],pages:[...pages.values()]};
  await fs.mkdir('artifacts',{recursive:true});await fs.writeFile('artifacts/link-audit.json',JSON.stringify(report,null,2));
  const {pages:details,reachable,uninspectedTargets,navigationTruncated,...summary}=report;console.log(JSON.stringify({...summary,reachableCount:reachable.length,uninspectedTargetCount:uninspectedTargets.length,navigationTruncatedCount:navigationTruncated.length},null,2));
  if(report.state!=='PASS')process.exitCode=1;
}catch(error){console.log(JSON.stringify({state:'RETRIEVAL_FAILED',reason:error.message,failures}));process.exitCode=1;}
