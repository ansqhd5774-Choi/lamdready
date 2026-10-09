(() => {
 const form=document.getElementById('jp-entry-form');if(!form)return;
 form.addEventListener('submit',e=>e.preventDefault());
 const en=['Japan arrival declaration','Preparation only · Submit through Visit Japan Web','Surname on passport','Given names on passport','Date of birth','Country of residence','City of residence','Arrival date in Japan','Flight number','Purpose of visit','Days of stay','Accommodation name','Accommodation address in Japan','Contact number in Japan','Tourism','Business','Visiting relatives','Other','Complete the official declaration','Clear entries','Entries are not sent to or stored on our server. This is a preparation form. Submission and QR codes are handled by Visit Japan Web.','Prepare your passport, flight and accommodation details.','Official Digital Agency guidance'];
 const ko=Array.from({length:23},(_,n)=>document.querySelector('[data-jp="'+n+'"]')?.textContent||'');
 const zh=['日本入境申报表','填写准备 · 请通过 Visit Japan Web 正式提交','护照姓氏','护照名字','出生日期','居住国家','居住城市','抵达日本日期','航班号','访问目的','停留天数','住宿名称','日本住宿地址','日本联系电话','旅游','商务','探亲','其他','填写官方申报表','清空输入','输入内容不会发送或保存到我们的服务器。此表用于准备；正式提交和二维码由 Visit Japan Web 处理。','请准备护照、航班和住宿信息。','日本数字厅官方指南'];
 const de=['Einreiseanmeldung Japan','Vorbereitung · Offiziell über Visit Japan Web einreichen','Nachname laut Reisepass','Vornamen laut Reisepass','Geburtsdatum','Wohnsitzland','Wohnort','Ankunftsdatum in Japan','Flugnummer','Reisezweck','Aufenthaltsdauer in Tagen','Unterkunftsname','Unterkunftsadresse in Japan','Telefonnummer in Japan','Tourismus','Geschäftsreise','Familienbesuch','Sonstiges','Offizielle Anmeldung ausfüllen','Eingaben löschen','Eingaben werden weder gesendet noch auf unserem Server gespeichert. Dieses Formular dient zur Vorbereitung. Einreichung und QR-Codes erfolgen über Visit Japan Web.','Reisepass, Flug- und Unterkunftsdaten bereithalten.','Offizielle Hinweise der Digitalagentur'];
 const fr=['Déclaration d’entrée au Japon','Préparation · Déclaration officielle sur Visit Japan Web','Nom sur le passeport','Prénoms sur le passeport','Date de naissance','Pays de résidence','Ville de résidence','Date d’arrivée au Japon','Numéro de vol','Motif du séjour','Durée en jours','Nom de l’hébergement','Adresse au Japon','Téléphone au Japon','Tourisme','Affaires','Visite familiale','Autre','Remplir la déclaration officielle','Effacer les données','Les données ne sont ni envoyées ni conservées sur notre serveur. Ce formulaire sert à la préparation. La déclaration et le code QR sont traités par Visit Japan Web.','Préparez passeport, vol et coordonnées de l’hébergement.','Guide officiel de l’Agence numérique'];
 const translations={ko,en,zh,de,fr};function apply(){const t=translations[window.lrLanguage]||ko;document.querySelectorAll('[data-jp]').forEach(el=>{const value=t[Number(el.dataset.jp)];if(value)el.textContent=value;});}
 document.addEventListener('lr-language',apply);apply();
})();

(() => {
 const names={'김':'KIM','이':'LEE','박':'PARK','최':'CHOI','정':'JUNG','강':'KANG','조':'CHO','윤':'YOON','장':'JANG','임':'LIM','한':'HAN','오':'OH','서':'SEO','신':'SHIN','권':'KWON','황':'HWANG','안':'AHN','송':'SONG','전':'JEON','홍':'HONG','유':'YOO','고':'KO','문':'MOON','양':'YANG','손':'SON','배':'BAE','백':'BAEK','허':'HEO','남':'NAM','심':'SHIM','노':'NOH','하':'HA','곽':'KWAK','성':'SUNG','차':'CHA','주':'JOO','우':'WOO','구':'KOO','민':'MIN','진':'JIN','나':'NA','지':'JI','엄':'EOM','채':'CHAE','원':'WON','천':'CHEON','방':'BANG','공':'GONG','현':'HYUN','함':'HAM','변':'BYUN','남궁':'NAMGUNG','황보':'HWANGBO','제갈':'JEGAL','선우':'SUNWOO','독고':'DOKGO'};
 const lead=['G','KK','N','D','TT','R','M','B','PP','S','SS','','J','JJ','CH','K','T','P','H'];
 const vowel=['A','AE','YA','YAE','EO','E','YEO','YE','O','WA','WAE','OE','YO','U','WO','WE','WI','YU','EU','UI','I'];
 const tail=['','K','K','K','N','N','N','T','L','K','M','L','L','L','P','L','M','P','P','T','T','NG','T','T','K','T','P','T'];
 function given(v){if(!/^[가-힣a-zA-Z -]+$/.test(v))return '';return [...v].map(c=>{const n=c.charCodeAt(0)-44032;if(n<0||n>11171)return c.toUpperCase();return lead[Math.floor(n/588)]+vowel[Math.floor(n%588/28)]+tail[n%28];}).join('');}
 const controls={};
 for(const key of ['surname','given']){
  const source=document.getElementById('jp-'+key+'-source'),result=document.getElementById('jp-'+key+'-result'),help=document.getElementById('jp-'+key+'-help'),field=document.querySelector('#jp-entry-form input[name="'+key+'"]');if(!source)continue;
  const sync=()=>{if(field)field.value=result.value;};
  const convert=()=>{const v=source.value.trim().normalize('NFC');result.value=key==='surname'?(names[v]||(/^[a-zA-Z -]+$/.test(v)?v.toUpperCase():'')):given(v);sync();help.textContent=v&&!result.value?'여권 영문 표기를 오른쪽에 입력하세요.':'';help.hidden=!v||!!result.value;};
  controls[key]={source,result,convert};
  const copy=document.querySelector('[data-copy="'+key+'"]');
  const updateCopy=()=>{copy.disabled=!result.value;};
  new MutationObserver(updateCopy).observe(result,{childList:true});
  copy.addEventListener('click',async()=>{if(!result.value)return;try{await navigator.clipboard.writeText(result.value);help.hidden=false;help.textContent='복사했습니다.';}catch{help.hidden=false;help.textContent='복사 권한을 확인한 뒤 다시 눌러주세요.';}});
  const update=()=>{
   const v=source.value.trim().normalize('NFC').replace(/\s+/g,'');
   if(key==='surname'&&/^[가-힣]+$/.test(v)&&v.length>1&&!names[v]){
    const compound=Object.keys(names).find(n=>n.length===2&&v.startsWith(n));const count=compound?2:1;
    source.value=v.slice(0,count);controls.given.source.value=v.slice(count);controls.given.convert();convert();
    controls.given.source.focus();controls.given.source.setSelectionRange(controls.given.source.value.length,controls.given.source.value.length);return;
   }
   convert();
  };
  source.addEventListener('input',e=>{if(!e.isComposing)update();});source.addEventListener('compositionend',update);source.addEventListener('blur',update);
  source.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing&&e.keyCode!==229){e.preventDefault();update();if(key==='surname'){controls.given.source.focus();controls.given.source.setSelectionRange(controls.given.source.value.length,controls.given.source.value.length);}}});
field?.addEventListener('input',()=>{result.value=field.value;});
  document.getElementById('jp-entry-form')?.addEventListener('reset',()=>{source.value='';result.value='';help.hidden=true;});
  help.hidden=true;
 }
})();
