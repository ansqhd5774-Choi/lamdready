import snapshot from '../data/fx-latest.json' with { type: 'json' };
import sourceStatus from '../data/source-status.json' with { type: 'json' };
import { currencies, fxUrl, normalizeFx, quoteFx } from '../src/fx.js';
import { countries } from '../data/countries.js';
const mofaUrl = 'https://apis.data.go.kr/1262000/TravelAlarmService2/getTravelAlarmList2';
const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'X-Robots-Tag': 'noindex', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' };
function json(body, status = 200) { return new Response(JSON.stringify(body), { status, headers }); }
export async function api(request, env, ctx, fetcher = fetch, cache = globalThis.caches?.default) {
  const url = new URL(request.url);
  if (url.pathname === '/api/countries') return json({ countries, ruleCoverage: 'UNVERIFIED' });
  if (url.pathname === '/api/sources') return json(sourceStatus);
  if (url.pathname === '/api/status') return json({ fx: 'CONFIGURED', snapshotDate: snapshot.sourceDate, currencies, travelAdvice: env.MOFA_SERVICE_KEY ? 'KEY_PRESENT_UNVERIFIED' : 'KEY_MISSING', rules: 'UNVERIFIED' });
  if (url.pathname === '/api/fx') {
    const base = url.searchParams.get('base') || 'KRW';
    const quotes = [...new Set((url.searchParams.get('quotes') || 'USD,EUR,JPY,SGD,THB,AUD,CNY').split(','))];
    if (!currencies.includes(base) || !quotes.length || quotes.length > 8 || quotes.some(q => !currencies.includes(q))) return json({ error: 'INVALID_CURRENCY', currencies }, 400);
    let data; let delivery = 'live';
    const cacheKey = new Request(new URL('/internal/fx-ecb-v1', url.origin));
    try {
      const cached = await cache?.match(cacheKey);
      if (cached) { data = await cached.json(); delivery = 'cache'; }
      else {
        const response = await fetcher(fxUrl, { signal: AbortSignal.timeout(10000) });
        if (!response.ok) throw Error('FX_UPSTREAM');
        data = normalizeFx(await response.json());
        if (cache) ctx?.waitUntil(cache.put(cacheKey, new Response(JSON.stringify(data), { headers: { 'Cache-Control': 'public, max-age=3600' } })));
      }
    } catch { data = snapshot; delivery = 'snapshot-fallback'; }
    try { return json({ ...quoteFx(data, base, quotes), delivery, warning: '일일 참고환율. 실제 환전·카드 수수료와 세관 적용환율은 다릅니다.' }); }
    catch { return json({ error: 'FX_UNAVAILABLE', rates: null }, 503); }
  }
  if (url.pathname === '/api/travel-advice') {
    const country = url.searchParams.get('country');
    if (!countries.some(item => item.code === country)) return json({ error: 'INVALID_COUNTRY' }, 400);
    if (!env.MOFA_SERVICE_KEY) return json({ error: 'KEY_MISSING', status: 'UNVERIFIED', officialUrl: 'https://www.0404.go.kr/' }, 503);
    const upstream = new URL(mofaUrl);
    upstream.searchParams.set('ServiceKey', env.MOFA_SERVICE_KEY);
    upstream.searchParams.set('returnType', 'JSON'); upstream.searchParams.set('numOfRows', '10'); upstream.searchParams.set('pageNo', '1'); upstream.searchParams.set('cond[country_iso_alp2::EQ]', country);
    try {
      const response = await fetcher(upstream, { signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw Error('UPSTREAM');
      const result = await response.json();
      if (![0, '0', '00'].includes(result.resultCode) || !Array.isArray(result.data) || result.data.some(row => row.country_iso_alp2 !== country)) throw Error('SCHEMA');
      return json({ country, source: '외교부', fetchedAt: new Date().toISOString(), data: result.data, status: result.data.length ? 'PROVIDER_RESPONSE' : 'NO_DATA' });
    } catch { return json({ error: 'TRAVEL_ADVICE_UNAVAILABLE', status: 'UNVERIFIED', officialUrl: 'https://www.0404.go.kr/' }, 503); }
  }
  return json({ error: 'NOT_FOUND' }, 404);
}
