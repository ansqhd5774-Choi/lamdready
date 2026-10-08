export const currencies = ['EUR', 'KRW', 'USD', 'JPY', 'SGD', 'THB', 'AUD', 'CNY'];
export const fxUrl = 'https://api.frankfurter.dev/v2/providers/ecb/rates?base=EUR&quotes=KRW,USD,JPY,SGD,THB,AUD,CNY';
const dayMs = 86400000;
export function normalizeFx(rows, fetchedAt = new Date().toISOString()) {
  if (!Array.isArray(rows) || rows.length !== currencies.length - 1) throw Error('FX_SCHEMA');
  const seen = new Set();
  const rates = { EUR: 1 };
  const date = rows[0]?.date;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || new Date(date).toISOString().slice(0, 10) !== date || Date.parse(date) > Date.parse(fetchedAt)) throw Error('FX_DATE');
  for (const row of rows) {
    if (row.base !== 'EUR' || row.date !== date || row.quote === 'EUR' || !currencies.includes(row.quote) || seen.has(row.quote) || typeof row.rate !== 'number' || !Number.isFinite(row.rate) || row.rate <= 0) throw Error('FX_SCHEMA');
    seen.add(row.quote); rates[row.quote] = row.rate;
  }
  return { schemaVersion: 1, provider: 'Frankfurter', underlyingProvider: 'ECB', source: fxUrl, sourceDate: date, fetchedAt, pivot: 'EUR', rates, purpose: 'travel-budget-reference', customsRate: false };
}
export function quoteFx(snapshot, base, quotes, now = Date.now()) {
  if (!currencies.includes(base) || quotes.length < 1 || quotes.length > currencies.length || quotes.some(q => !currencies.includes(q))) throw Error('INVALID_CURRENCY');
  const age = now - Date.parse(snapshot.sourceDate);
  if (!Number.isFinite(age) || age < 0 || age > 7 * dayMs) throw Error('FX_EXPIRED');
  if (!Number.isFinite(snapshot.rates[base]) || snapshot.rates[base] <= 0) throw Error('FX_SCHEMA');
  return { ...snapshot, base, ageDays: Math.floor(age / dayMs), rates: Object.fromEntries(quotes.map(quote => {
    const value = snapshot.rates[quote] / snapshot.rates[base];
    if (!Number.isFinite(value) || value <= 0) throw Error('FX_SCHEMA');
    return [quote, value];
  })) };
}
