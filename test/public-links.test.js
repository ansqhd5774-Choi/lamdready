import test from 'node:test';import assert from 'node:assert/strict';
import {internalLinks,reachablePosts} from '../src/public-links.js';
test('only public same-origin anchors are retained and fragments normalized',()=>{
 assert.deepEqual(internalLinks('<a href="/a.html?m=1#one">a</a><a href="https://evil.test/a">x</a><a href="javascript:alert(1)">x</a><a href="/search?a=1&amp;b=2">b</a>','https://landready.blogspot.com/'),['https://landready.blogspot.com/a.html','https://landready.blogspot.com/search?a=1&b=2']);
});
test('reachability follows inspected navigation, terminates cycles, and separates isolated posts',()=>{
 const home='https://landready.blogspot.com/';const pages=new Map([[home,{links:['category']}],['category',{links:[home,'post']}],['post',{links:[]}],['isolated',{links:[]}]]);
 assert.deepEqual(reachablePosts(pages,['post','isolated']),{reachable:['post'],unreachable:['isolated']});
});
