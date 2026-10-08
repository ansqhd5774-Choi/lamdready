import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeFx, quoteFx } from '../src/fx.js';
import { api } from '../worker/api.js';
const rows = ['KRW', 'USD', 'JPY', 'SGD', 'THB', 'AUD', 'CNY'].map((quote, i) => ({ base: 'EUR', quote, date: '2026-10-08', rate: [1500, 1.1, 175, 1.4, 37, 1.6, 7.5][i] }));
test('EUR pivot preserves KRW precision and identity; dates stay explicit', () => {
  const snapshot = normalizeFx(rows, '2026-10-09T00:00:00Z');
  const converted = quoteFx(snapshot, 'USD', ['KRW', 'USD'], Date.parse('2026-10-09'));
  assert.equal(converted.rates.KRW, 1500 / 1.1);
  assert.equal(converted.rates.USD, 1);
  assert.equal(converted.sourceDate, '2026-10-08');
  assert.equal(converted.customsRate, false);
});
test('zero, incomplete, conflicting dates and duplicate quotes never become rates', () => {
  assert.throws(() => normalizeFx(rows.slice(1)));
  assert.throws(() => normalizeFx(rows.map((r, i) => i === 0 ? { ...r, rate: 0 } : r)));
  assert.throws(() => normalizeFx(rows.map((r, i) => i === 0 ? { ...r, date: '2026-10-07' } : r)));
  assert.throws(() => normalizeFx(rows.map((r, i) => i === 1 ? rows[0] : r)));
  assert.throws(() => quoteFx(normalizeFx(rows), 'KRW', ['USD'], Date.parse('2026-10-17')));
});
test('invalid query does not call provider; missing safety key is distinct from zero alerts', async () => {
  const fetcher = () => { throw Error('must not fetch'); };
  const bad = await api(new Request('https://test/api/fx?base=BAD'), {}, {}, fetcher);
  assert.equal(bad.status, 400);
  const missing = await api(new Request('https://test/api/travel-advice?country=JP'), {}, {}, fetcher);
  assert.equal(missing.status, 503);
  assert.equal((await missing.json()).error, 'KEY_MISSING');
});
test('provider failure uses explicitly marked bounded snapshot; healthy provider is live', async () => {
  const live = await api(new Request('https://test/api/fx?base=USD&quotes=KRW'), {}, {}, async () => Response.json(rows));
  assert.equal((await live.json()).delivery, 'live');
  const failed = await api(new Request('https://test/api/fx'), {}, {}, async () => new Response('error', { status: 503 }));
  const body = await failed.json();
  if (failed.status === 200) assert.equal(body.delivery, 'snapshot-fallback');
  else { assert.equal(failed.status, 503); assert.equal(body.rates, null); }
});
test('travel advice wrong-country result is rejected without echoing credential', async () => {
  const r = await api(new Request('https://test/api/travel-advice?country=JP'), { MOFA_SERVICE_KEY: 'test-fixture-key' }, {}, async () => Response.json({ resultCode: 0, data: [{ country_iso_alp2: 'AU' }] }));
  assert.equal(r.status, 503);
  assert.doesNotMatch(await r.text(), /test-fixture-key/);
});
