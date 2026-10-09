import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { normalizeFx, fxUrl } from '../src/fx.js';
import { countries } from '../data/countries.js';
fs.mkdirSync('data', { recursive: true });
fs.mkdirSync('artifacts/source-snapshots', { recursive: true });
const response = await fetch(fxUrl, { signal: AbortSignal.timeout(15000) });
if (!response.ok) throw Error(`FX_HTTP_${response.status}`);
const fx = normalizeFx(await response.json());
fs.writeFileSync('data/fx-latest.json', JSON.stringify(fx, null, 2));
console.log(`FX collected: ${Object.keys(fx.rates).length} currencies, source date ${fx.sourceDate}`);
const sources = [];
for (const country of countries) {
  for (const kind of ['entry', 'customs']) {
    const url = country[kind];
    const result = { country: country.code, kind, url, fetchedAt: new Date().toISOString(), reviewedAt: null, regulationVerified: false };
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(10000), headers: { 'User-Agent': 'LandReady/0.1 (+https://landready.blogspot.com/)' } });
      result.httpStatus = r.status; result.finalUrl = r.url; result.contentType = r.headers.get('content-type');
      if (r.ok) {
        const bytes = Buffer.from(await r.arrayBuffer());
        if (bytes.length > 2000000) throw Error('SOURCE_TOO_LARGE');
        result.sha256 = createHash('sha256').update(bytes).digest('hex'); result.bytes = bytes.length;
        result.status = 'FETCHED_UNREVIEWED';
        fs.writeFileSync(`artifacts/source-snapshots/${country.code}-${kind}.html`, bytes);
      } else result.status = 'HTTP_ERROR';
    } catch { result.status = 'FETCH_FAILED'; }
    sources.push(result); console.log(`${country.code}/${kind}: ${result.status}`);
  }
}
fs.writeFileSync('data/source-status.json', JSON.stringify({ collectedAt: new Date().toISOString(), sources }, null, 2));
