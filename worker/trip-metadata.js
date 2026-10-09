const host = 'https://landready-assets.ansqhd5774.workers.dev';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function tripMetadata(origin, destination, destinationName) {
  const url = `${host}/trip?lang=ko&origin=${origin}&destination=${destination}`;
  const title = `${destinationName} 여행 준비 · LandReady`;
  const description = `${destinationName} 여행의 입국 준비와 공식 안내를 확인하세요. 대한민국 출발 일본 여행은 입국 신고서 항목별 작성 연습과 영문 변환을 제공합니다.`;
  const image = `${host}/assets/favicon-r2.png`;
  const schema = JSON.stringify({'@context':'https://schema.org','@type':'WebPage',name:title,description,url,inLanguage:'ko',isPartOf:{'@type':'WebSite',name:'LandReady',url:'https://landready.blogspot.com/'}}).replace(/</g,'\\u003c');
  return `<meta name="description" content="${escape(description)}"><link rel="canonical" href="${escape(url)}"><meta property="og:type" content="website"><meta property="og:site_name" content="LandReady"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${escape(url)}"><meta property="og:image" content="${image}"><meta property="og:image:alt" content="LandReady 로고"><script type="application/ld+json">${schema}</script>`;
}
