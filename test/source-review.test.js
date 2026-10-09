import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
test('source change requires review; failed retrieval preserves last successful baseline and due date',async()=>{
  const prefix=path.join(os.tmpdir(),'landready-review-test-');
  const root=await fs.mkdtemp(prefix);
  try {
    const registry=JSON.parse(await fs.readFile(new URL('../data/review-sources.json',import.meta.url),'utf8'));
    await fs.mkdir(path.join(root,'data'));
    await fs.mkdir(path.join(root,'local-data/source-review'),{recursive:true});
    await fs.writeFile(path.join(root,'data/review-sources.json'),JSON.stringify(registry));
    const sha256=createHash('sha256').update('old content').digest('hex');
    const items=registry.items.map(item=>({...item,sha256,reviewedAt:'2026-01-01',verifiedAt:'2026-01-01',lastSuccessfulFetchAt:'2026-01-01',nextReviewAt:'2026-02-01'}));
    await fs.writeFile(path.join(root,'local-data/source-review/latest.json'),JSON.stringify({items}));
    const preload=path.join(root,'mock-fetch.mjs');
    await fs.writeFile(preload,`globalThis.fetch=async url=>{if(url.includes('digital.go.jp'))throw Error('MOCK_NETWORK_FAILURE');return new Response(url.includes('moj.go.jp')?'changed content':'old content');};`);
    const result=spawnSync(process.execPath,['--import',pathToFileURL(preload).href,fileURLToPath(new URL('../scripts/review-sources.mjs',import.meta.url))],{cwd:root,encoding:'utf8'});
    assert.equal(result.status,1);
    assert.equal(result.stderr,'');
    const report=JSON.parse(await fs.readFile(path.join(root,'local-data/source-review/latest.json'),'utf8'));
    assert.equal(report.processedCount,3);
    assert.equal(report.items[0].status,'CHANGE_REVIEW_REQUIRED');
    assert.equal(report.items[0].reviewedAt,null);
    assert.equal(report.items[0].verifiedAt,null);
    assert.equal(report.items[1].status,'RETRIEVAL_FAILED');
    assert.equal(report.items[1].sha256,sha256);
    assert.equal(report.items[1].nextReviewAt,'2026-02-01');
    assert.equal(report.items[1].lastSuccessfulFetchAt,'2026-01-01');
    assert.equal(report.items[2].regulationVerified,false);
  } finally {
    if(!path.resolve(root).startsWith(path.resolve(prefix)))throw Error('UNSAFE_TEST_CLEANUP');
    await fs.rm(root,{recursive:true,force:true});
  }
});
