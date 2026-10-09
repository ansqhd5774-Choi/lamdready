import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
test('all 95 candidate IDs are accounted for without claiming runtime completion', () => {
  const ledger=JSON.parse(fs.readFileSync('docs/standards-95.json','utf8'));
  assert.equal(ledger.items.length,95);
  assert.equal(new Set(ledger.items.map(row=>row.id)).size,95);
  assert.equal(ledger.items.filter(row=>row.eligible).length,93);
  assert.deepEqual(ledger.items.filter(row=>!row.eligible).map(row=>row.id),['C4','H2']);
  for(const row of ledger.items) assert.equal(row.runtimeVerified,false);
});
