import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.js';
test('public root redirects to Blogger; health never claims production rules', async () => {
  const root = await worker.fetch(new Request('https://example.test/'), {});
  assert.equal(root.status, 302);
  assert.equal(root.headers.get('Location'), 'https://lamdready.blogspot.com/');
  const health = await worker.fetch(new Request('https://example.test/health'), {});
  assert.equal((await health.json()).rulesAvailable, false);
});
test('only public assets are exposed; writes and unknown paths are rejected', async () => {
  const env = { ASSETS: { fetch: async () => new Response('css', { headers: { 'Content-Type': 'text/css' } }) } };
  const asset = await worker.fetch(new Request('https://example.test/assets/lamdready.css'), env);
  assert.equal(await asset.text(), 'css');
  assert.equal(asset.headers.get('Access-Control-Allow-Origin'), '*');
  assert.equal((await worker.fetch(new Request('https://example.test/backups/original.xml'), env)).status, 404);
  assert.equal((await worker.fetch(new Request('https://example.test/health', { method: 'POST' }), env)).status, 405);
});
