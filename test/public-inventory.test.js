import test from 'node:test';
import assert from 'node:assert/strict';
import { sitemapRows, compareInventory } from '../src/public-inventory.js';
const url='https://landready.blogspot.com/2023/11/post.html';
const date='2023-11-21T13:23:21Z';
const feed={feed:{openSearch$totalResults:{$t:'1'},entry:[{link:[{rel:'alternate',type:'text/html',href:url}],updated:{$t:date}}]}};
test('public inventory checks completeness, URLs and actual updated timestamp',()=>{
  const rows=sitemapRows(`<urlset><url><loc>${url}</loc><lastmod>${date}</lastmod></url></urlset>`);
  assert.equal(compareInventory(feed,rows).state,'PASS');
  assert.equal(compareInventory({...feed,feed:{...feed.feed,entry:[{...feed.feed.entry[0],updated:{$t:'2023-11-21T22:23:21.499+09:00'}}]}},rows).state,'PASS');
  assert.equal(compareInventory(feed,[...rows,...rows]).duplicates.length,1);
  assert.equal(compareInventory(feed,[{url,lastmod:'2099-01-01'}]).invalidDates.length,1);
  assert.equal(compareInventory(feed,[{url,lastmod:'2023-11-20'}]).dateMismatches.length,1);
  assert.equal(compareInventory({...feed,feed:{...feed.feed,openSearch$totalResults:{$t:'151'}}},rows).state,'PARTIAL');
  assert.equal(compareInventory(feed,[{url:'https://other.test/post.html',lastmod:date}]).invalid.length,1);
  assert.throws(()=>sitemapRows('<sitemapindex></sitemapindex>'),/UNSUPPORTED/);
});
