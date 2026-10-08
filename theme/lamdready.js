(() => {
  'use strict';
  const app = document.getElementById('lr-app');
  if (!app) return;
  const codes = 'AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ');
  const names = new Intl.DisplayNames(['ko'], {type:'region'});
  const aliases={KR:['대한민국','한국','남한','korea'],US:['미국','america','usa'],GB:['영국','uk','britain'],JP:['일본','japan'],SG:['싱가포르','singapore'],AU:['호주','australia'],TH:['태국','thailand']};
  const countries=codes.map(code=>({code,name:code==='KR'?'대한민국':names.of(code),aliases:aliases[code]||[]})).sort((a,b)=>a.name.localeCompare(b.name,'ko'));
  const initial='ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
  function pattern(q){return new RegExp([...q.toLowerCase().replace(/\s/g,'')].map(ch=>{const i=initial.indexOf(ch);if(i>=0){const start=0xac00+i*588;return `[${String.fromCharCode(start)}-${String.fromCharCode(start+587)}${ch}]`;}return ch.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}).join(''),'i');}
  const fields=['lr-origin','lr-destination'].map(id=>({input:document.getElementById(id),list:document.getElementById(id+'-list'),code:'',results:[],active:-1}));
  const route=document.getElementById('lr-trip-form');
  const key='lamdready-route-v1';
  function close(f){f.list.hidden=true;f.input.setAttribute('aria-expanded','false');f.input.removeAttribute('aria-activedescendant');f.active=-1;}
  function persist(){route.classList.toggle('lr-ready',fields.every(f=>f.code));try{localStorage.setItem(key,JSON.stringify({origin:fields[0].code,destination:fields[1].code}));}catch{}}
  function select(f,c){f.code=c.code;f.input.value=c.name;const other=fields.find(x=>x!==f);if(other.code===c.code){other.code='';other.input.value='';}close(f);persist();f.input.focus();f.input.parentElement.classList.remove('lr-changed');requestAnimationFrame(()=>{f.input.parentElement.classList.add('lr-changed');setTimeout(()=>f.input.parentElement.classList.remove('lr-changed'),420);});}
  function activate(f,index){f.active=index;[...f.list.children].forEach((o,i)=>o.setAttribute('aria-selected',String(i===index)));const o=f.list.children[index];if(o){f.input.setAttribute('aria-activedescendant',o.id);o.scrollIntoView({block:'nearest'});}}
  function render(f,all=false){fields.filter(x=>x!==f).forEach(close);const q=all?'':f.input.value.trim();const p=pattern(q);const other=fields.find(x=>x!==f);f.results=countries.filter(c=>c.code!==other.code&&(!q||[c.name,c.code,...c.aliases].some(v=>p.test(v.replace(/\s/g,'')))));f.list.replaceChildren();f.active=-1;f.input.removeAttribute('aria-activedescendant');for(const c of f.results){const o=document.createElement('div');o.id=f.input.id+'-'+c.code;o.setAttribute('role','option');o.setAttribute('aria-selected','false');o.append(document.createTextNode(c.name));const small=document.createElement('small');small.textContent=c.code;o.append(small);o.addEventListener('pointerdown',e=>e.preventDefault());o.addEventListener('click',()=>select(f,c));f.list.append(o);}if(!f.results.length){const e=document.createElement('div');e.className='lr-no-result';e.textContent='일치하는 국가가 없습니다.';f.list.append(e);}f.list.hidden=false;f.input.setAttribute('aria-expanded','true');}
  try{const saved=JSON.parse(localStorage.getItem(key));fields.forEach((f,i)=>{const c=countries.find(c=>c.code===saved?.[i?'destination':'origin']);if(c){f.code=c.code;f.input.value=c.name;}});}catch{}persist();
  fields.forEach(f=>{
    f.input.addEventListener('focus',()=>render(f,Boolean(f.code)));
    f.input.addEventListener('input',()=>{f.code='';persist();if(!f.input.composing)render(f);});
    f.input.addEventListener('compositionstart',()=>{f.input.composing=true;});
    f.input.addEventListener('compositionend',()=>{f.input.composing=false;render(f);});
    f.input.addEventListener('blur',()=>{const c=countries.find(c=>c.name===f.input.value.trim()&&c.code!==fields.find(x=>x!==f).code);if(c){f.code=c.code;persist();}close(f);});
    f.input.addEventListener('keydown',e=>{if(e.isComposing)return;if(e.key==='Escape'){close(f);return;}if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(f.list.hidden)render(f);if(f.results.length)activate(f,(f.active+(e.key==='ArrowDown'?1:-1)+f.results.length)%f.results.length);}if(e.key==='Enter'){e.preventDefault();if(!f.list.hidden&&f.results.length&&(f.active>=0||f.results.length===1))select(f,f.results[Math.max(0,f.active)]);}});
    const chevron=f.input.parentElement.querySelector('.lr-chevron');chevron.addEventListener('click',()=>{f.input.focus();render(f,true);});
  });
  document.addEventListener('pointerdown',e=>{fields.forEach(f=>{if(!f.input.parentElement.contains(e.target))close(f);});});
  route.addEventListener('submit',e=>e.preventDefault());
})();
