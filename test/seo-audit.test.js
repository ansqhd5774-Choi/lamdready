import test from 'node:test';import assert from 'node:assert/strict';import {inspectDocument,publicTargets,inlineStyles} from '../src/seo-audit.js';
test('SEO source parser supports attribute order and separates soft 404 candidates',()=>{
 const row=inspectDocument('<title>A &amp; B</title><meta content="description" name="description"><link href="https://landready.blogspot.com/a.html" rel="canonical"><meta name="robots" content="noindex"><img src="a.png" width="30" height="40">','https://landready.blogspot.com/a.html');
 assert.equal(row.title,'A & B');assert.equal(row.description,'description');assert.equal(row.canonicalMatches,true);assert.equal(row.noindex,true);assert.equal(row.imagesMissingAlt,1);assert.equal(row.soft404Candidate,false);
 assert.equal(inspectDocument('<title>404 Page not found</title>','https://landready.blogspot.com/no').soft404Candidate,true);
});
test('target extraction excludes executable and credential URLs',()=>{
 assert.deepEqual(publicTargets('<a href="javascript:alert(1)">bad</a><img src="/a.png"><a href="https://user:password@example.test">bad</a><a href="https://www.moj.go.jp/isa/#x">official</a>','https://landready.blogspot.com/'),[{url:'https://landready.blogspot.com/a.png',kind:'image'},{url:'https://www.moj.go.jp/isa/',kind:'link'}]);
});
test('empty decorative alt, invalid dimensions and microdata are distinguished',()=>{
 const row=inspectDocument('<div itemscope itemtype="https://schema.org/WebPage"></div><img src="a.png" alt="" width="0" height="200"><img src="b.png" alt="form" width="300" height="200">','https://landready.blogspot.com/');
 assert.equal(row.imagesMissingAlt,0);assert.equal(row.imagesEmptyAlt,1);assert.equal(row.imagesMissingDimensions,1);assert.equal(row.structuredDataCount,0);assert.deepEqual(row.microdataTypes,['https://schema.org/WebPage']);
});
test('inline CSS excludes serialized style strings embedded in scripts',()=>{
 const html='<script>const serialized="url(https\\\\:\\\\/\\\\/example.test/fake.png)";</script><style>.hero{background:url(/real.png)}</style>';
 assert.deepEqual(inlineStyles(html),['.hero{background:url(/real.png)}']);
});
