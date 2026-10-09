import fs from 'node:fs/promises';
const [input, output] = process.argv.slice(2);
if (!input || !output || input === output) throw Error('DISTINCT_INPUT_OUTPUT_REQUIRED');
let xml = await fs.readFile(input, 'utf8');
const anchor = "window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}";
if (!xml.includes('lr-home-analytics') || xml.includes('lr-operator-exclusion') || xml.split(anchor).length !== 2) throw Error('UNEXPECTED_THEME_STATE');
xml = xml.replace(anchor, `// lr-operator-exclusion: explicit operator browser opt-out
var lrOperator = location.hash === '#lr-operator';
try {
  if (lrOperator) localStorage.setItem('lr-analytics-operator', '1');
  if (location.hash === '#lr-visitor') localStorage.removeItem('lr-analytics-operator');
  lrOperator = lrOperator || localStorage.getItem('lr-analytics-operator') === '1';
} catch (_) {}
window['ga-disable-G-CVSFDTG9KF'] = lrOperator;
${anchor}`);
await fs.writeFile(output, xml);
console.log('Operator exclusion prepared; not deployed');
