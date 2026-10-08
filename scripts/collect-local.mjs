import fs from 'node:fs';
import { normalizeFx, fxUrl } from '../src/fx.js';
import { countries } from '../data/countries.js';
const root = 'local-data';
fs.mkdirSync(`${root}/history`, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const response = await fetch(fxUrl, { signal: AbortSignal.timeout(15000) });
if (!response.ok) throw Error(`FX_HTTP_${response.status}`);
const rows = await response.json();
const fx = normalizeFx(rows);
fs.writeFileSync(`${root}/history/${stamp}-fx-raw.json`, JSON.stringify(rows));
const advice = { status: process.env.MOFA_SERVICE_KEY ? 'COLLECTED' : 'KEY_MISSING', countries: {} };
if (process.env.MOFA_SERVICE_KEY) {
  for (const { code } of countries) {
    const url = new URL('https://apis.data.go.kr/1262000/TravelAlarmService2/getTravelAlarmList2');
    for (const [k,v] of Object.entries({ServiceKey:process.env.MOFA_SERVICE_KEY,returnType:'JSON',numOfRows:'10',pageNo:'1','cond[country_iso_alp2::EQ]':code})) url.searchParams.set(k,v);
    try {
      const r = await fetch(url, {signal:AbortSignal.timeout(15000)});
      if (!r.ok) throw Error('HTTP');
      const body = await r.json();
      if (![0,'0','00'].includes(body.resultCode) || !Array.isArray(body.data) || body.data.some(row=>row.country_iso_alp2!==code) || Number(body.totalCount)>body.data.length) throw Error('SCHEMA');
      // Publish only approved public fields; provider response remains local.
      fs.writeFileSync(`${root}/history/${stamp}-${code}-advice-raw.json`,JSON.stringify(body));
      const fields=['country_iso_alp2','country_nm','country_eng_nm','alarm_lvl','region_ty','remark','written_dt'];
      advice.countries[code]={country:code,source:'외교부',fetchedAt:new Date().toISOString(),status:body.data.length?'PROVIDER_RESPONSE':'NO_DATA',data:body.data.map(row=>Object.fromEntries(fields.filter(k=>Object.hasOwn(row,k)).map(k=>[k,row[k]])))};
    } catch { advice.status='PARTIAL_OR_FAILED'; }
  }
}
const bundle={fx,advice,collectedAt:new Date().toISOString()};
const encoded=JSON.stringify(bundle,null,2);
fs.writeFileSync(`${root}/history/${stamp}-bundle.json`,encoded);
fs.writeFileSync(`${root}/latest.json.tmp`,encoded);
fs.renameSync(`${root}/latest.json.tmp`,`${root}/latest.json`);
console.log(`Local collection saved: ${fx.sourceDate}; advice ${advice.status}`);
