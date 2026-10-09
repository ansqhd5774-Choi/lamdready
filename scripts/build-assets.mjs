import fs from 'node:fs';
import { createHash } from 'node:crypto';
fs.mkdirSync('dist/assets', { recursive: true });
// Remove only retired branding aliases so cached local builds cannot publish them.
for(const retired of ['lamdready.css','lamdready.js','lamdready-logo.svg']) fs.rmSync(`dist/assets/${retired}`,{force:true});
const files = {};
for (const name of ['landready.css', 'landready.js', 'language.js', 'japan-entry.js', 'entry-events.js', 'japan-fields.js', 'japan-values.js', 'japan-pickers.js', 'japan-cities-source.txt', 'chevron-down.svg', 'japan-entry-card-1.png', 'japan-entry-card-2.png', 'travel-coast-r3.png', 'landready-logo.svg', 'favicon.png', 'favicon-r2.png', 'chevron-left.svg', 'tabler-icons-LICENSE.txt']) {
  const content = fs.readFileSync(`theme/${name}`);
  fs.writeFileSync(`dist/assets/${name}`, content);
  files[name] = { sha256: createHash('sha256').update(content).digest('hex'), bytes: content.length };
}
fs.mkdirSync('dist/assets/cities', {recursive:true});
for(const [code,rows] of Object.entries(JSON.parse(fs.readFileSync('theme/japan-cities.json','utf8')))){
  const name=`cities/${code}.json`,content=JSON.stringify(rows);
  fs.writeFileSync(`dist/assets/${name}`,content);
  files[name]={sha256:createHash('sha256').update(content).digest('hex'),bytes:Buffer.byteLength(content)};
}
fs.writeFileSync('dist/assets/manifest.json', JSON.stringify({ service: 'LandReady', files }, null, 2));
console.log('Built LandReady public assets');


