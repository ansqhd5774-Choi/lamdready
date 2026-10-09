import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {rankedMatches,daysInMonth} from '../theme/japan-pickers.js';
import {formatEntry} from '../theme/japan-values.js';

test('country suggestions rank exact and prefix above substring and preserve Hangul IME text',()=>{
 const rows=[{name:'미국령',aliases:['미국령']},{name:'미국',aliases:['미국','US']},{name:'영국',aliases:['영국','GB']}];
 assert.deepEqual(rankedMatches(rows,'미국').map(c=>c.name),['미국','미국령']);
 assert.equal(rankedMatches(rows,'us')[0].name,'미국');assert.equal(rankedMatches(rows,'없는나라').length,0);
});
test('birth selector has correct leap-year and month lengths',()=>{
 assert.equal(daysInMonth(2000,2),29);assert.equal(daysInMonth(1900,2),28);assert.equal(daysInMonth(2026,4),30);
 assert.ok(formatEntry('birth','2099-01-01',{today:'2026-10-10'}).error);
});
test('city suggestions and conversion remain scoped to selected country',()=>{
 const cities=JSON.parse(fs.readFileSync('theme/japan-cities.json','utf8'));
 assert.ok(cities.JP.some(c=>c[1]==='TOKYO'));assert.ok(cities.US.some(c=>c[1]==='NEW YORK CITY'));
 assert.equal(cities.JP.some(c=>c[1]==='SEOUL'),false);
 assert.equal(formatEntry('city','도쿄',{cityLookup:{'도쿄':'TOKYO'}}).text,'TOKYO');
 assert.ok(formatEntry('city','서울',{cityLookup:{'도쿄':'TOKYO'}}).error);
 assert.equal(formatEntry('city','Small Town',{cityLookup:{}}).text,'SMALL TOWN');
});
