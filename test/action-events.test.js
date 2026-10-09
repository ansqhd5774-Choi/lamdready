import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
test('action counters whitelist types and fields without accepting input values',()=>{
  const events=[];
  const window={};
  vm.runInNewContext(fs.readFileSync('theme/entry-events.js','utf8'),{window,document:{dispatchEvent:event=>events.push(event.detail),addEventListener:()=>{}},CustomEvent:class{constructor(name,{detail}){this.detail=detail;}}});
  assert.equal(window.lrRecordAction('copy_success','surname'),true);
  assert.equal(window.lrRecordAction('copy_success','PRIVATE NAME'),false);
  assert.equal(window.lrRecordAction('copy_success','conviction'),true);
  assert.equal(window.lrRecordAction('copy_success','possession'),true);
  assert.equal(window.lrRecordAction('submission_success','surname'),false);
  assert.equal(window.lrRecordAction('official_link_click','PRIVATE NAME'),true);
  assert.equal(window.lrReadActionCounts()['copy_success:surname'],1);
  assert.ok(!JSON.stringify(events).includes('PRIVATE NAME'));
  assert.deepEqual(Object.keys(events.at(-1)),['event']);
});
