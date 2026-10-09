(() => {
  const labels={ko:['한국어','어디서 출발하나요?','어디로 가시나요?','출발지','도착지','여행 준비 페이지로 이동','일치하는 국가가 없습니다.','여행 준비','입국 준비 공식 안내','반입·세관 공식 안내','이 목적지의 입국·반입 공식 자료는 준비 중입니다.','대한민국 외교부 해외안전여행','공식 정보를 확인하세요. 비자·입국·반입 허용 여부는 아직 자동 판정하지 않습니다.','여행 경로 다시 선택'],en:['English','Where are you leaving from?','Where are you going?','Origin','Destination','Continue to travel preparation','No matching countries.','Travel preparation','Official entry guidance','Official customs guidance','Official entry and customs information for this destination is being prepared.','Republic of Korea travel safety advice','Check official sources. Visa, entry and customs eligibility is not yet assessed automatically.','Choose your route again'],zh:['中文','您从哪里出发？','您要去哪里？','出发地','目的地','前往旅行准备页面','没有匹配的国家。','旅行准备','官方入境指南','官方海关指南','此目的地的官方入境和海关资料正在准备中。','韩国外交部旅行安全信息','请查看官方资料。目前尚不自动判断签证、入境及物品携带资格。','重新选择旅行路线'],de:['Deutsch','Wo starten Sie?','Wohin reisen Sie?','Abreiseort','Reiseziel','Zur Reisevorbereitung','Keine passenden Länder.','Reisevorbereitung','Offizielle Einreisehinweise','Offizielle Zollhinweise','Offizielle Einreise- und Zollinformationen für dieses Reiseziel werden vorbereitet.','Reisesicherheit des Außenministeriums Südkoreas','Prüfen Sie offizielle Quellen. Visa-, Einreise- und Zollbestimmungen werden noch nicht automatisch bewertet.','Reiseroute erneut wählen'],fr:['Français','D’où partez-vous ?','Où allez-vous ?','Départ','Destination','Préparer le voyage','Aucun pays correspondant.','Préparation du voyage','Conseils officiels d’entrée','Conseils douaniers officiels','Les informations officielles d’entrée et de douane pour cette destination sont en préparation.','Conseils de sécurité du ministère sud-coréen','Consultez les sources officielles. Les conditions de visa, d’entrée et de douane ne sont pas encore évaluées automatiquement.','Choisir un autre itinéraire']};
  const flags={ko:'🇰🇷',en:'🇬🇧',zh:'🇨🇳',de:'🇩🇪',fr:'🇫🇷'};
  let lang='ko';try{const saved=localStorage.getItem('landready-language');if(labels[saved])lang=saved;}catch{}
  const param=new URL(location.href).searchParams.get('lang');if(labels[param])lang=param;
  window.lrLanguage=lang;window.lrLabels=labels;
  function init(){
    const header=document.querySelector('#lr-app .lr-header');if(!header)return;
    const nav=document.createElement('nav');nav.className='lr-languages';nav.setAttribute('aria-label','Language');
    for(const code of Object.keys(labels)){const b=document.createElement('button');b.type='button';b.dataset.language=code;b.title=labels[code][0];b.setAttribute('aria-label',labels[code][0]);b.innerHTML='<span aria-hidden="true">'+flags[code]+'</span><small>'+labels[code][0]+'</small>';b.addEventListener('click',()=>apply(code));nav.append(b);}header.append(nav);
    function apply(code){lang=code;window.lrLanguage=code;document.documentElement.lang=code==='zh'?'zh-CN':code;try{localStorage.setItem('landready-language',code);}catch{}
      nav.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.language===code)));
      ['lr-origin','lr-destination'].forEach((id,i)=>{const el=document.getElementById(id);if(el){el.placeholder=labels[code][i+1];el.setAttribute('aria-label',labels[code][i+3]);document.getElementById(id+'-list').setAttribute('aria-label',labels[code][i+3]);}});
      const go=document.getElementById('lr-continue');if(go)go.setAttribute('aria-label',labels[code][5]);
      document.querySelectorAll('[data-lr-text]').forEach(el=>el.textContent=labels[code][Number(el.dataset.lrText)]);
      const prep=document.querySelector('.lr-preparation');if(prep){const names=new Intl.DisplayNames([code],{type:'region'});const q=new URL(location.href).searchParams;const dest=names.of(q.get('destination'));prep.querySelector('h1').textContent=dest+' · '+labels[code][7];prep.querySelector('.lr-route-summary').textContent=names.of(q.get('origin'))+' → '+dest;document.title=dest+' · '+labels[code][7]+' · LandReady';}
      document.dispatchEvent(new CustomEvent('lr-language',{detail:code}));
    }apply(lang);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
