import test from 'node:test';
import assert from 'node:assert/strict';
import { tripPage } from '../worker/trip.js';
test('trip metadata keeps personal query data out and retains intentional noindex', async () => {
  const response = tripPage(new Request('https://untrusted.test/trip?origin=KR&destination=JP&name=PRIVATE&lang=en'));
  const html = await response.text();
  assert.equal(response.headers.get('X-Robots-Tag'), 'noindex');
  assert.ok(!html.includes('PRIVATE'));
  assert.ok(!html.includes('untrusted.test'));
  assert.ok(html.includes('rel="canonical"'));
  assert.ok(html.includes('name="description"'));
  assert.ok(html.includes('property="og:image"'));
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(schema['@type'], 'WebPage');
  assert.equal(schema.url, 'https://lamdready-assets.ansqhd5774.workers.dev/trip?lang=ko&origin=KR&destination=JP');
  assert.ok(!('dateModified' in schema));
});
