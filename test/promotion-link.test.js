import test from 'node:test';import assert from 'node:assert/strict';
import {promotionLink} from '../src/promotion-link.js';
test('promotion links preserve the preparation route and use fixed nonpersonal tags',()=>{
 const url=new URL(promotionLink({source:'naver-cafe',medium:'community'}));
 assert.equal(url.host,'landready-assets.ansqhd5774.workers.dev');
 assert.equal(url.searchParams.get('origin'),'KR');assert.equal(url.searchParams.get('destination'),'JP');assert.equal(url.searchParams.get('lang'),'ko');
 assert.deepEqual([...url.searchParams.keys()],['lang','origin','destination','utm_source','utm_medium','utm_campaign','utm_content']);
 assert.throws(()=>promotionLink({source:'test@example.com',medium:'community'}));
 assert.throws(()=>promotionLink({source:'naver-cafe',medium:'paid'}));
 assert.throws(()=>promotionLink({source:'kakao',medium:'email'}));
});
