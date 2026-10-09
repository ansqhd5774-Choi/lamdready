import test from 'node:test';import assert from 'node:assert/strict';
import {documentResources,nestedResources} from '../src/performance-audit.js';
test('resource inventory separates lazy images and parser-blocking scripts',()=>{
 const rows=documentResources(`<script src="/a.js"></script><script defer src="/b.js"></script><script type="module" src="/c.js"></script><img src="/front.png" width="100" height="70" alt="front"><img src="/back.png" loading="lazy"><link rel="stylesheet" href="/a.css"><img src="data:image/png;base64,abc">`,'https://example.com/');
 assert.equal(rows.length,6);assert.equal(rows[0].blocking,true);assert.equal(rows[1].blocking,false);assert.equal(rows[2].blocking,false);assert.equal(rows[3].width,'100');assert.equal(rows[4].lazy,true);
});
test('static dependencies exclude data URLs and retain versioned modules',()=>{
 assert.deepEqual(nestedResources(`import {a} from './a.js?v=1'; const x=import('./later.js');`,'https://example.com/assets/b.js','script'),[{kind:'script',url:'https://example.com/assets/a.js?v=1'}]);
 assert.deepEqual(nestedResources(`src:url('/font.woff2');background:url(data:image/png;base64,abc)`,'https://example.com/style.css','stylesheet'),[{kind:'font',url:'https://example.com/font.woff2'}]);
});
