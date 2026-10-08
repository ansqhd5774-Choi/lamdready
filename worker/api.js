import snapshot from '../data/fx-latest.json' with { type: 'json' };
import sourceStatus from '../data/source-status.json' with { type: 'json' };
import advice from '../data/travel-advice.json' with { type: 'json' };
import { currencies, quoteFx } from '../src/fx.js';
import { countries } from '../data/countries.js';
const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'X-Robots-Tag': 'noindex', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' };
function json(body, status = 200) { return new Response(JSON.stringify(body), { status, headers }); }
export async function api(request) {
  const url = new URL(request.url);
  if (url.pathname === '/api/countries') return json({ countries, ruleCoverage: 'UNVERIFIED' });
  if (url.pathname === '/api/sources') return json(sourceStatus);
  if (url.pathname === '/api/status') return json({ pipeline: 'LOCAL_RUNNER_SNAPSHOT', fx: 'STORED', snapshotDate: snapshot.sourceDate, currencies, travelAdvice: advice.status, rules: 'UNVERIFIED' });
  if (url.pathname === '/api/fx') {
    const base = url.searchParams.get('base') || 'KRW';
    const quotes = [...new Set((url.searchParams.get('quotes') || 'USD,EUR,JPY,SGD,THB,AUD,CNY').split(','))];
    if (!currencies.includes(base) || !quotes.length || quotes.length > 8 || quotes.some(q => !currencies.includes(q))) return json({ error: 'INVALID_CURRENCY', currencies }, 400);
    try { return json({ ...quoteFx(snapshot, base, quotes), delivery: 'local-runner-snapshot', warning: '로컬 러너가 수집한 일일 참고환율. 실제 환전·카드 수수료와 세관 적용환율은 다릅니다.' }); }
    catch { return json({ error: 'FX_UNAVAILABLE', rates: null }, 503); }
  }
  if (url.pathname === '/api/travel-advice') {
    const country = url.searchParams.get('country');
    if (!countries.some(item => item.code === country)) return json({ error: 'INVALID_COUNTRY' }, 400);
    const record = advice.countries?.[country];
    if (!record || Date.now() - Date.parse(record.fetchedAt) > 86400000 || !Number.isFinite(Date.parse(record.fetchedAt))) return json({ error: advice.status === 'KEY_MISSING' ? 'KEY_MISSING' : 'TRAVEL_ADVICE_UNAVAILABLE', status: 'UNVERIFIED', officialUrl: 'https://www.0404.go.kr/' }, 503);
    return json(record);
  }
  return json({ error: 'NOT_FOUND' }, 404);
}
