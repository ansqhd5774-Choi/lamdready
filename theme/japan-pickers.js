import {cityNames} from './japan-values.js?v=pickers-r2';

export function rankedMatches(items,query,limit=30){
 const q=query.trim().normalize('NFC').toLocaleLowerCase();
 return items.map((item,index)=>({item,index,rank:q?Math.min(...item.aliases.map(a=>{a=a.toLocaleLowerCase();return a===q?0:a.startsWith(q)?1:a.includes(q)?2:3;})):0}))
  .filter(x=>x.rank<3).sort((a,b)=>a.rank-b.rank||a.index-b.index).slice(0,limit).map(x=>x.item);
}
export function daysInMonth(year,month){return new Date(Number(year),Number(month),0).getDate();}

export function mountPickers({countries,onCityLookup}){
 const country=document.getElementById('jp-field-country'),city=document.getElementById('jp-field-city');
 const form=document.getElementById('jp-entry-form');
 const origin=new URL(location.href).searchParams.get('origin')||'KR';
 let selectedCountry='',cityRows=[],cityState='ready';
 const cityCache=new Map();
 const normalize=v=>v.trim().toLocaleLowerCase();
 const findCountry=v=>countries.find(c=>c.aliases.some(a=>normalize(a)===normalize(v)));
 const emit=input=>input.dispatchEvent(new Event('input',{bubbles:true}));
 function listWidget(input,type,getItems,selected){
  input.removeAttribute('list');
  const wrapper=document.createElement('div');wrapper.className='jp-location-source';input.replaceWith(wrapper);wrapper.append(input);
  const arrow=document.createElement('button');arrow.type='button';arrow.className='jp-list-toggle';arrow.setAttribute('aria-label',type+' 목록 열기');wrapper.append(arrow);
  const list=document.createElement('div');list.className='jp-location-list';list.id='jp-'+type+'-options';list.setAttribute('role','listbox');list.setAttribute('aria-label',type+' 추천 목록');list.hidden=true;input.closest('.jp-all-editor').append(list);
  input.setAttribute('role','combobox');input.setAttribute('aria-autocomplete','list');input.setAttribute('aria-controls',list.id);input.setAttribute('aria-expanded','false');arrow.setAttribute('aria-controls',list.id);arrow.setAttribute('aria-expanded','false');
  let index=-1,shown=[];
  function close(){list.hidden=true;input.setAttribute('aria-expanded','false');arrow.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');index=-1;}
  function choose(item){input.value=item.name;selected(item);emit(input);input.focus();close();}
  function open(all=false){shown=rankedMatches(getItems(),all?'':input.value,type==='국가'?countries.length:30);list.replaceChildren();index=-1;
   if(!shown.length){const text=document.createElement('p');text.textContent=type==='도시'?(cityState==='loading'?'도시 목록을 불러오는 중입니다.':cityState==='failed'?'도시 목록을 불러오지 못했습니다. 영문 도시명을 입력하세요.':selectedCountry?'추천 도시가 없습니다. 영문 도시명을 입력하세요.':'거주 국가를 먼저 선택하세요.'):'일치하는 국가가 없습니다.';list.append(text);}
   shown.forEach((item,i)=>{const option=document.createElement('button');option.type='button';option.tabIndex=-1;option.id=list.id+'-'+i;option.setAttribute('role','option');option.setAttribute('aria-selected','false');const name=document.createElement('span');name.textContent=item.name;const secondary=document.createElement('small');secondary.textContent=item.english;option.append(name,secondary);option.addEventListener('click',()=>choose(item));list.append(option);});
   list.hidden=false;input.setAttribute('aria-expanded','true');arrow.setAttribute('aria-expanded','true');
  }
  arrow.addEventListener('click',()=>list.hidden?open(true):close());input.addEventListener('focus',()=>open(true));input.addEventListener('input',e=>{if(!e.isComposing&&document.activeElement===input)open();});input.addEventListener('compositionend',()=>open());
  input.addEventListener('keydown',e=>{if(e.isComposing)return;if(e.key==='Tab'){close();return;}if(e.key==='Escape'){e.preventDefault();close();return;}if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();if(list.hidden)open(true);index=Math.max(0,Math.min(shown.length-1,index+(e.key==='ArrowDown'?1:-1)));[...list.querySelectorAll('[role=option]')].forEach((o,i)=>{o.setAttribute('aria-selected',String(i===index));if(i===index){input.setAttribute('aria-activedescendant',o.id);o.scrollIntoView({block:'nearest'});}});}if(e.key==='Enter'&&!list.hidden&&shown.length){e.preventDefault();e.stopImmediatePropagation();choose(shown[index<0?0:index]);}},true);
  document.addEventListener('pointerdown',e=>{if(!wrapper.contains(e.target)&&!list.contains(e.target))close();});input.closest('[data-entry-card]').addEventListener('focusout',e=>{if(!input.closest('[data-entry-card]').contains(e.relatedTarget))close();});
  return {open,close};
 }
 const cityWidget=listWidget(city,'도시',()=>cityRows,()=>{});
 const countryWidget=listWidget(country,'국가',()=>countries,c=>setCountry(c.code));
 async function loadCities(code){if(!cityCache.has(code))cityCache.set(code,fetch('/assets/cities/'+code+'.json').then(r=>{if(!r.ok)throw new Error('city catalog unavailable');return r.json();}).catch(()=>{cityCache.delete(code);return null;}));return cityCache.get(code);}
 async function setCountry(code){
  if(code===selectedCountry)return;
  selectedCountry=code;city.value='';cityRows=[];cityState=code?'loading':'ready';onCityLookup({});emit(city);cityWidget.close();
  city.placeholder=code==='KR'?'거주 도시 · 예: 서울':'거주 도시 검색';
  if(!code)return;
  const current=code,data=await loadCities(code);if(current!==selectedCountry)return;
  cityState=data?'ready':'failed';
  cityRows=(data||[]).map(([name,english,...aliases])=>({name,english,aliases:[name,english,...aliases]}));
  if(code==='KR'){const korean=Object.entries(cityNames).map(([name,english])=>({name,english,aliases:[name,english]}));const known=new Set(korean.map(c=>c.english));cityRows=[...korean,...cityRows.filter(c=>!known.has(c.english))];}
  const map={};for(const c of cityRows)for(const alias of c.aliases)map[normalize(alias)]=c.english;
  onCityLookup(map);
  if(city.value)emit(city);
  if(document.activeElement===city)cityWidget.open();
 }
 country.addEventListener('input',e=>{if(!e.isComposing)setCountry(findCountry(country.value)?.code||'');});country.addEventListener('compositionend',()=>setCountry(findCountry(country.value)?.code||''));
 const initial=countries.find(c=>c.code===origin)||countries.find(c=>c.code==='KR');
 country.value=initial.name;country.defaultValue=initial.name;emit(country);countryWidget.close();setCountry(initial.code);
 form.addEventListener('reset',()=>{countryWidget.close();cityWidget.close();setTimeout(()=>{selectedCountry='';country.value=initial.name;emit(country);countryWidget.close();setCountry(initial.code);},0);});

 const birth=document.getElementById('jp-field-birth'),dialog=document.getElementById('jp-birth-dialog');
 const year=dialog.querySelector('[name=year]'),month=dialog.querySelector('[name=month]'),day=dialog.querySelector('[name=day]');
 const today=new Date(),maxYear=today.getFullYear();
 function option(select,value,label){const o=document.createElement('option');o.value=value;o.textContent=label;select.append(o);}
 for(let y=maxYear;y>=1900;y--)option(year,y,y+'년');for(let m=1;m<=12;m++)option(month,m,m+'월');
 function refreshDays(){const previous=day.value;day.replaceChildren();option(day,'','일');const count=year.value&&month.value?daysInMonth(year.value,month.value):31;for(let d=1;d<=count;d++)option(day,d,d+'일');day.value=Number(previous)<=count?previous:'';}
 year.addEventListener('change',refreshDays);month.addEventListener('change',refreshDays);refreshDays();
 birth.addEventListener('click',()=>{const parts=birth.value.split('-');year.value=parts[0]||'';month.value=parts[1]?String(Number(parts[1])):'';refreshDays();day.value=parts[2]?String(Number(parts[2])):'';dialog.querySelector('.jp-date-error').textContent='';dialog.showModal();year.focus();});
 dialog.querySelector('[data-date-cancel]').addEventListener('click',()=>dialog.close());
 dialog.querySelector('[data-date-apply]').addEventListener('click',()=>{const v=year.value+'-'+month.value.padStart(2,'0')+'-'+day.value.padStart(2,'0');const todayValue=[maxYear,String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');if(!year.value||!month.value||!day.value||v>todayValue){dialog.querySelector('.jp-date-error').textContent='올바른 연도·월·일을 선택하세요.';return;}birth.value=v;birth.textContent=v.replaceAll('-','.');emit(birth);dialog.close();birth.focus();});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 form.addEventListener('reset',()=>{birth.value='';birth.textContent='년 · 월 · 일 선택';dialog.close();});
}
