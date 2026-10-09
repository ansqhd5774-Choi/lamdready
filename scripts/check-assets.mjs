import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {tripPage} from '../worker/trip.js';
const manifest=JSON.parse(fs.readFileSync('dist/assets/manifest.json','utf8'));
for(const [name,expected] of Object.entries(manifest.files)){
  const bytes=fs.readFileSync(`dist/assets/${name}`);
  if(bytes.length!==expected.bytes||createHash('sha256').update(bytes).digest('hex')!==expected.sha256)throw Error(`ASSET_MISMATCH:${name}`);
}
const html=await tripPage(new Request('https://example.test/trip?origin=KR&destination=JP')).text();
for(const match of html.matchAll(/(?:src|href)="\/assets\/([^"?]+)(?:\?[^\"]*)?"/g)){
  if(!manifest.files[match[1]])throw Error(`MISSING_ASSET:${match[1]}`);
}
for(const match of html.matchAll(/<img[^>]*src="\/assets\/([^"?]+\.png)"[^>]*>/g)){
  const tag=match[0],bytes=fs.readFileSync(`dist/assets/${match[1]}`);
  const width=Number(tag.match(/\bwidth="(\d+)"/)?.[1]),height=Number(tag.match(/\bheight="(\d+)"/)?.[1]);
  if(width!==bytes.readUInt32BE(16)||height!==bytes.readUInt32BE(20))throw Error(`IMAGE_DIMENSIONS:${match[1]}`);
  if(!/\balt="[^"]+"/.test(tag))throw Error(`IMAGE_ALT:${match[1]}`);
}
if((html.match(/class="jp-item-ko"/g)||[]).length!==14)throw Error('FORM_FIELD_COUNT');
console.log(`Asset hashes, referenced assets, image dimensions/alt and 14 form labels PASS (${Object.keys(manifest.files).length} assets)`);
