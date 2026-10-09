import test from 'node:test';import assert from 'node:assert/strict';import {boundedAudit,AUDIT_LIMITS} from '../src/bounded-audit.js';
const targets=count=>Array.from({length:count},(_,index)=>`https://example.test/${index}`);
test('bounded requests use three workers, chunks of fifty, explicit budget and abort signals',async()=>{
 let active=0,maximum=0,calls=0;const chunks=[];
 const result=await boundedAudit(targets(110),{maxRequests:103,onChunk:async chunk=>chunks.push(chunk.results.length),fetchImpl:async(_url,{signal})=>{
  assert.equal(signal instanceof AbortSignal,true);active++;maximum=Math.max(maximum,active);calls++;await new Promise(resolve=>setTimeout(resolve,1));active--;return {status:200,ok:true};
 }});
 assert.equal(AUDIT_LIMITS.timeoutMs,20000);assert.equal(maximum,3);assert.equal(calls,103);assert.deepEqual(chunks,[50,50,3]);assert.equal(result.remaining.length,7);assert.equal(result.state,'BUDGET_EXHAUSTED');
});
for(const status of [401,403,429])test(`${status} prevents new starts after response and never retries`,async()=>{
 const calls=[];const result=await boundedAudit(targets(9),{maxRequests:9,fetchImpl:async url=>{calls.push(url);if(url.endsWith('/0'))return {status,ok:false};await new Promise(resolve=>setTimeout(resolve,5));return {status:200,ok:true};}});
 assert.equal(calls.length,3);assert.equal(new Set(calls).size,3);assert.equal(result.stopReason,`HTTP_${status}_STOP`);assert.equal(result.remaining.length,6);assert.equal(result.state,'STOPPED');
});
test('invalid URLs and credentials are excluded; fragments deduplicated; ordinary failure does not retry',async()=>{
 const calls=[];const result=await boundedAudit(['https://example.test/a#1','https://example.test/a#2','javascript:alert(1)','https://user:password@example.test/','http://example.test/b'],{maxRequests:5,fetchImpl:async url=>{calls.push(url);if(url.endsWith('/a'))throw new TypeError('network');return {status:404,ok:false};}});
 assert.deepEqual(calls,['https://example.test/a','http://example.test/b']);assert.equal(result.skipped.length,2);assert.equal(result.results.length,2);assert.equal(result.state,'COMPLETE');
 await assert.rejects(boundedAudit([]),/REQUEST_BUDGET_REQUIRED/);
});
