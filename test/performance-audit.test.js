import test from 'node:test';import assert from 'node:assert/strict';
import {documentResources,nestedResources,cssUnescape} from '../src/performance-audit.js';
test('resource inventory separates lazy images and parser-blocking scripts',()=>{
 const rows=documentResources(`<script src="/a.js"></script><script defer src="/b.js"></script><script type="module" src="/c.js"></script><img src="/front.png" width="100" height="70" alt="front"><img src="/back.png" loading="lazy"><link rel="stylesheet" href="/a.css"><img src="data:image/png;base64,abc">`,'https://example.com/');
 assert.equal(rows.length,6);assert.equal(rows[0].blocking,true);assert.equal(rows[1].blocking,false);assert.equal(rows[2].blocking,false);assert.equal(rows[3].width,'100');assert.equal(rows[4].lazy,true);
});
test('Blogger escaped CSS URLs resolve to their real external host, never a fabricated Blogger path',()=>{
 const css=String.raw`body{background:url(https\:\/\/themes.googleusercontent.com\/image?id=abc)} @media(max-width:400px){body{background:url("https\3a \2f \2f themes.googleusercontent.com/image?id=abc&options=w400")}}`;
 assert.deepEqual(nestedResources(css,'https://landready.blogspot.com/','stylesheet'),[
  {kind:'css-resource',url:'https://themes.googleusercontent.com/image?id=abc'},
  {kind:'css-resource',url:'https://themes.googleusercontent.com/image?id=abc&options=w400'},
 ]);
});
test('CSS escapes preserve escaped punctuation and decode code points with invalid replacements',()=>{
 assert.equal(cssUnescape(String.raw`a\)b\20 c\000041`),'a)b cA');
 assert.equal(cssUnescape(String.raw`\0 \d800 \110000`),'\ufffd\ufffd\ufffd');
 assert.deepEqual(nestedResources(String.raw`background:url('/a\)b.png');src:url("/font\2e woff2")`,'https://example.com/style.css','stylesheet'),[
  {kind:'css-resource',url:'https://example.com/a)b.png'},
  {kind:'font',url:'https://example.com/font.woff2'},
 ]);
});
test('static dependencies exclude data URLs and retain versioned modules',()=>{
 assert.deepEqual(nestedResources(`import {a} from './a.js?v=1'; const x=import('./later.js');`,'https://example.com/assets/b.js','script'),[{kind:'script',url:'https://example.com/assets/a.js?v=1'}]);
 assert.deepEqual(nestedResources(`src:url('/font.woff2');background:url(data:image/png;base64,abc)`,'https://example.com/style.css','stylesheet'),[{kind:'font',url:'https://example.com/font.woff2'}]);
});
