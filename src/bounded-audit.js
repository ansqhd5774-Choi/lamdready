export const AUDIT_LIMITS=Object.freeze({concurrency:3,chunkSize:50,timeoutMs:20000});
export async function boundedAudit(targets,{fetchImpl=globalThis.fetch,maxRequests,onChunk=async()=>{}}={}){
 if(!Number.isInteger(maxRequests)||maxRequests<0)throw Error('REQUEST_BUDGET_REQUIRED');
 const unique=[...new Set(targets)],results=[],skipped=[];let started=0,stopReason=null;
 const queue=[],normalized=new Set();
 for(const [inputIndex,raw] of unique.entries()){try{const url=new URL(raw);if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw Error('INVALID_PUBLIC_URL');url.hash='';if(!normalized.has(url.href)){normalized.add(url.href);queue.push(url.href);}}catch{skipped.push({inputIndex,reason:'INVALID_PUBLIC_URL'});}}
 let cursor=0;
 while(cursor<queue.length&&started<maxRequests&&!stopReason){
  const end=Math.min(cursor+AUDIT_LIMITS.chunkSize,queue.length,maxRequests);
  const batchStart=results.length;
  // Each worker sees the same chunk fence and stop flag before starting its next request.
  const chunkLimit=end;const workers=Array.from({length:AUDIT_LIMITS.concurrency},async()=>{
   while(cursor<chunkLimit&&started<maxRequests&&!stopReason){const single=cursor;await runOne();if(cursor===single)break;}
  });
  await Promise.all(workers);await onChunk({results:results.slice(batchStart),started,stopReason});
 }
 async function runOne(){if(cursor>=queue.length||started>=maxRequests||stopReason)return;const url=queue[cursor++];started++;
  try{const response=await fetchImpl(url,{signal:AbortSignal.timeout(AUDIT_LIMITS.timeoutMs)});
   if([401,403,429].includes(response.status))stopReason=`HTTP_${response.status}_STOP`;
   results.push({url,status:response.status,state:response.ok?'HTTP_OK':'HTTP_FAILED'});try{await response.body?.cancel();}catch{}
  }catch(error){results.push({url,state:'RETRIEVAL_FAILED',reason:error.name||'Error'});}
 }
 return {results,skipped,started,stopReason,remaining:queue.slice(cursor),state:stopReason?'STOPPED':cursor<queue.length?'BUDGET_EXHAUSTED':'COMPLETE'};
}
