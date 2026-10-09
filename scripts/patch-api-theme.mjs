import fs from 'node:fs';
const path = process.argv[2];
if (!path) throw Error('Provide the latest local Blogger backup path');
let theme = fs.readFileSync(path, 'utf8');
const replacements = [
  [/<style\b[^>]*>\/\*<!\[CDATA\[\*\/[\s\S]*?#lr-app[\s\S]*?\/\*\]\]>\*\/<\/style>/g, `<style type="text/css">/*<![CDATA[*/${fs.readFileSync('theme/landready.css', 'utf8')}/*]]>*/</style>`],
  [/<b:if\b[^>]*cond=['"]data:blog.url == data:blog.homepageUrl['"][^>]*>\s*<div id=['"]lr-app['"][\s\S]*?<\/b:if>/g, `<b:if cond="data:blog.url == data:blog.homepageUrl">${fs.readFileSync('theme/home.html', 'utf8')}</b:if>`],
  [/<script\b[^>]*>\/\/<!\[CDATA\[\s*\(\(\) => \{\s*'use strict';\s*const app = document.getElementById\('lr-app'\);[\s\S]*?\/\/\]\]><\/script>/g, `<script type="text/javascript">//<![CDATA[\n${fs.readFileSync('theme/landready.js', 'utf8')}\n//]]></script>`],
];
for (const [pattern, replacement] of replacements) {
  if ([...theme.matchAll(pattern)].length !== 1) throw Error('Expected exactly one LandReady block');
  theme = theme.replace(pattern, () => replacement);
}
fs.writeFileSync('theme/landready-blogger-r1.xml', theme);
console.log('Patched latest theme; other widgets preserved');
