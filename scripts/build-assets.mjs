import fs from 'node:fs';
import { createHash } from 'node:crypto';
fs.mkdirSync('dist/assets', { recursive: true });
const files = {};
for (const name of ['lamdready.css', 'lamdready.js']) {
  const content = fs.readFileSync(`theme/${name}`);
  fs.writeFileSync(`dist/assets/${name}`, content);
  files[name] = { sha256: createHash('sha256').update(content).digest('hex'), bytes: content.length };
}
fs.writeFileSync('dist/assets/manifest.json', JSON.stringify({ service: 'LamdReady', files }, null, 2));
console.log('Built LamdReady public assets');
