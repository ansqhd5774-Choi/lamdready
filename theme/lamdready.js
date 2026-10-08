(() => {
  'use strict';
  const app = document.getElementById('lr-app');
  if (!app) return;
  const countries = {
    JP: { name: '일본', entry: ['Visit Japan Web', 'https://services.digital.go.jp/en/visit-japan-web/'], customs: ['일본 세관 · 여행자 안내', 'https://www.customs.go.jp/english/summary/passenger.htm'] },
    SG: { name: '싱가포르', entry: ['ICA · 입국 조건과 SG Arrival Card', 'https://www.ica.gov.sg/enter-transit-depart/entering-singapore'], customs: ['싱가포르 세관 · 면세와 신고', 'https://www.customs.gov.sg/at-customs/arriving-in-singapore/duty-free-concession-gst-relief/'] },
    TH: { name: '태국', entry: ['태국 공식 TDAC', 'https://tdac.immigration.go.th/'], customs: ['태국 세관', 'https://www.customs.go.th/'] },
    AU: { name: '호주', entry: ['호주 내무부 · 비자 안내', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder'], customs: ['호주 국경수비대 · 면세 안내', 'https://www.abf.gov.au/entering-and-leaving-australia/can-you-bring-it-in/categories/duty-free'] },
  };
  const get = id => document.getElementById(id);
  function element(tag, text, className) { const value = document.createElement(tag); value.textContent = text; if (className) value.className = className; return value; }
  function link(pair) { const value = element('a', pair[0] + ' ↗'); value.href = pair[1]; value.target = '_blank'; value.rel = 'noopener noreferrer'; return value; }
  function card(title, pairs) { const value = element('div', '', 'lr-result-card'); value.append(element('h3', title), element('span', '공식 안내 · 조건별 판정 검수 중', 'lr-pill')); pairs.forEach(pair => value.append(link(pair))); return value; }
  function showTrip() {
    const country = countries[get('lr-destination').value];
    const results = get('lr-results'); results.replaceChildren(); results.hidden = false;
    const grid = element('div', '', 'lr-result-grid');
    grid.append(card(country.name + ' 입국 준비', [country.entry, country.customs]));
    grid.append(get('lr-return').value === 'KR' ? card('대한민국 귀국 준비', [['한국 관세청', 'https://www.customs.go.kr/'], ['농림축산검역본부', 'https://www.qia.go.kr/']]) : card('다른 국가 귀국', []));
    results.append(grid, element('p', '여권·비자·반입 허용 여부는 아직 자동 확정하지 않습니다. 선택한 여행 조건에 맞는 공식 안내를 확인하세요.', 'lr-notice'));
    try { localStorage.setItem('lamdready-trip-v1', JSON.stringify({destination:get('lr-destination').value, passport:get('lr-passport').value, origin:get('lr-origin').value, returnCountry:get('lr-return').value, date:get('lr-date').value})); } catch { get('lr-storage-note').textContent = '브라우저 저장을 사용할 수 없어 현재 화면에서만 유지됩니다.'; }
  }
  get('lr-trip-form').addEventListener('submit', event => { event.preventDefault(); showTrip(); });
  get('lr-item-form').addEventListener('submit', event => {
    event.preventDefault(); const text = get('lr-item').value.trim(); if (!text) return;
    const country = countries[get('lr-destination').value]; const result = get('lr-item-result'); result.hidden = false; result.replaceChildren();
    result.append(element('p', text + ' · ' + country.name + ' 반입 확인', 'lr-notice'));
    result.append(element('p', '판정 미확인: 품목의 종류·성분·수량·용량·가격과 여행자 조건에 따라 규정이 달라집니다. 신고하면 항상 반입할 수 있는 것은 아닙니다.', 'lr-fine'));
    const grid = element('div', '', 'lr-result-grid'); grid.append(card(country.name + ' 공식 규정', [country.customs]));
    grid.append(get('lr-return').value === 'KR' ? card('대한민국 귀국 공식 규정', [['한국 관세청', 'https://www.customs.go.kr/'], ['농림축산검역본부', 'https://www.qia.go.kr/']]) : card('다른 국가 귀국 · 해당 국가 세관 확인 필요', [])); result.append(grid);
    if (/배터리/.test(text)) result.append(element('p', '보조배터리는 세관 규정 외에 이용 항공사의 기내·위탁 수하물 규정을 별도로 확인하세요.', 'lr-notice'));
  });
  app.querySelectorAll('[data-item]').forEach(button => button.addEventListener('click', () => { get('lr-item').value = button.dataset.item; get('lr-item').focus(); }));
  app.querySelectorAll('[data-check]').forEach(input => {
    try { input.checked = localStorage.getItem('lamdready-check-' + input.dataset.check) === '1'; } catch {}
    input.addEventListener('change', () => { try { localStorage.setItem('lamdready-check-' + input.dataset.check, input.checked ? '1' : '0'); } catch { get('lr-storage-note').textContent = '브라우저 저장을 사용할 수 없어 체크 상태가 저장되지 않습니다.'; } });
  });
  try { const saved = JSON.parse(localStorage.getItem('lamdready-trip-v1')); if (saved && countries[saved.destination]) { get('lr-destination').value = saved.destination; for (const [field,key] of [['lr-passport','passport'],['lr-origin','origin'],['lr-return','returnCountry']]) if ([...get(field).options].some(option => option.value === saved[key])) get(field).value = saved[key]; if (/^\d{4}-\d{2}-\d{2}$/.test(saved.date)) get('lr-date').value = saved.date; } } catch {}
  get('lr-fx-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    const amount = Number(get('lr-fx-amount').value);
    const base = get('lr-fx-base').value;
    const result = get('lr-fx-result');
    const button = get('lr-fx-form').querySelector('button');
    if (!Number.isFinite(amount) || amount < 0 || amount > 1000000000) return;
    button.disabled = true; result.replaceChildren(element('p', '환율을 확인하고 있습니다.', 'lr-fine'));
    try {
      const response = await fetch('https://lamdready-assets.ansqhd5774.workers.dev/api/fx?base=' + encodeURIComponent(base) + '&quotes=KRW', { signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw Error('unavailable');
      const data = await response.json();
      if (data.base !== base || !Number.isFinite(data.rates?.KRW) || data.rates.KRW <= 0) throw Error('invalid');
      result.replaceChildren(element('p', amount.toLocaleString('ko-KR') + ' ' + base + ' ≈ ' + (amount * data.rates.KRW).toLocaleString('ko-KR', { maximumFractionDigits: 2 }) + ' 원', 'lr-notice'));
      result.append(element('p', '환율 기준일 ' + data.sourceDate + ' · 수집 ' + new Date(data.fetchedAt).toLocaleString('ko-KR') + ' · 출처 ECB / Frankfurter' + (data.delivery === 'snapshot-fallback' ? ' · 현재 제공처 연결 실패로 저장된 자료 사용' : ''), 'lr-fine'));
    } catch { result.replaceChildren(element('p', '환율을 가져오지 못했습니다. 금액을 계산하지 않았습니다. 공식 출처를 확인하거나 잠시 후 다시 시도하세요.', 'lr-notice')); }
    finally { button.disabled = false; }
  });
})();
