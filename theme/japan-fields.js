import {formatEntry} from './japan-values.js?v=pickers-r2';
import {mountPickers} from './japan-pickers.js?v=pickers-r2';
const codes='AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ');
const ko=new Intl.DisplayNames(['ko'],{type:'region'}),en=new Intl.DisplayNames(['en'],{type:'region'}),lookup={};
const countries=codes.map(code=>{const name=code==='KR'?'대한민국':ko.of(code),english=code==='KR'?'REPUBLIC OF KOREA':en.of(code).toUpperCase();const aliases=[code,name,en.of(code),english,...(code==='KR'?['한국']:[])];for(const alias of aliases)lookup[alias.toLowerCase()]=english;return {code,name,english,aliases};}).sort((a,b)=>a.name.localeCompare(b.name,'ko'));
let cityLookup={};
const sources=[document.getElementById('jp-surname-source'),document.getElementById('jp-given-source'),...document.querySelectorAll('[data-entry-source]')];
for(const source of sources.slice(2)){
 const key=source.dataset.entrySource,editor=source.closest('.jp-all-editor'),output=editor.querySelector('output'),status=editor.querySelector('.jp-field-status'),button=editor.querySelector('[data-field-copy]'),other=editor.querySelector('.jp-purpose-other');

 const update=()=>{if(other)other.hidden=source.value!=='OTHER';const answer=formatEntry(key,source.value,{countryLookup:lookup,cityLookup,other:other?.value||''});output.value=answer.text;status.dataset.state='error';status.textContent=answer.error;status.hidden=!answer.error;button.disabled=!answer.text;source.setAttribute('aria-invalid',String(!!answer.error));};
 source.addEventListener('input',e=>{if(!e.isComposing)update();});source.addEventListener('change',update);source.addEventListener('compositionend',update);other?.addEventListener('input',update);
 source.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing&&source.tagName!=='TEXTAREA'&&key!=='birth'){e.preventDefault();update();sources[sources.indexOf(source)+1]?.focus();}});
 button.addEventListener('click',async()=>{if(!output.value)return;try{await navigator.clipboard.writeText(output.value);status.dataset.state='success';status.textContent='복사했습니다.';status.hidden=false;setTimeout(()=>{if(status.dataset.state==='success')status.hidden=true;},1800);}catch{status.textContent='복사 권한을 확인한 뒤 다시 눌러주세요.';status.hidden=false;}});
 document.getElementById('jp-entry-form').addEventListener('reset',()=>{output.value='';button.disabled=true;status.hidden=true;source.removeAttribute('aria-invalid');if(other){other.hidden=true;other.value='';}});
}
const given=document.getElementById('jp-given-source');given.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();sources[2]?.focus();}});

mountPickers({countries,onCityLookup:map=>{cityLookup=map;}});
