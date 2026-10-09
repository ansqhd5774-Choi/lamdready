import fs from 'node:fs/promises';
const [input, output] = process.argv.slice(2);
if (!input || !output || input === output) throw Error('DISTINCT_INPUT_OUTPUT_REQUIRED');
let xml = await fs.readFile(input, 'utf8');
if (!xml.includes('lr-legacy-home-gate') || xml.includes('lr-home-analytics')) throw Error('UNEXPECTED_THEME_STATE');
const anchor = "<b:if cond='data:blog.url != data:blog.homepageUrl'><b:include data='blog' name='google-analytics'/></b:if>";
if (xml.split(anchor).length !== 2) throw Error('ANALYTICS_BOUNDARY_AMBIGUOUS');
const snippet = `<b:if cond='data:blog.url == data:blog.homepageUrl'>
<!-- lr-home-analytics: home only; fixed URL; no form data or advertising -->
<script async='async' src='https://www.googletagmanager.com/gtag/js?id=G-CVSFDTG9KF'/>
<script type='text/javascript'>//<![CDATA[
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied', analytics_storage:'granted'});
gtag('js', new Date());
gtag('config', 'G-CVSFDTG9KF', {send_page_view:false, allow_google_signals:false, allow_ad_personalization_signals:false, page_location:'https://landready.blogspot.com/', page_referrer:'', page_title:'LandReady'});
gtag('event', 'page_view', {page_location:'https://landready.blogspot.com/', page_referrer:'', page_title:'LandReady'});
//]]></script>
</b:if>`;
xml = xml.replace(anchor, anchor + '\n' + snippet);
await fs.writeFile(output, xml);
console.log('Home analytics prepared; not deployed');
