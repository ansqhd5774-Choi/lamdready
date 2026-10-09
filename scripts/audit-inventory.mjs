import fs from 'node:fs/promises';
import { sitemapRows, compareInventory } from '../src/public-inventory.js';
const read=async url=>{const response=await fetch(url,{signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error(`HTTP_${response.status}`);return response.text();};
try {
  const xml=await read('https://landready.blogspot.com/sitemap.xml');
  const feed=JSON.parse(await read('https://landready.blogspot.com/feeds/posts/default?alt=json&max-results=150'));
  const report={checkedAt:new Date().toISOString(),source:'Blogger public posts feed and sitemap; max 150 posts, no automatic pagination',...compareInventory(feed,sitemapRows(xml))};
  await fs.mkdir('artifacts',{recursive:true});
  await fs.writeFile('artifacts/inventory-audit.json',JSON.stringify(report,null,2));
  const {posts,...summary}=report;console.log(JSON.stringify(summary,null,2));
  if(report.state!=='PASS')process.exitCode=1;
} catch(error) {console.log(JSON.stringify({state:'RETRIEVAL_FAILED',reason:error.message}));process.exitCode=1;}
