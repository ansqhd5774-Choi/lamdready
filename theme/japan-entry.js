(() => {
 const form=document.getElementById('jp-entry-form');if(!form)return;
 form.addEventListener('submit',e=>e.preventDefault());
 const en=['Japan arrival declaration','Preparation only · Submit through Visit Japan Web','Surname on passport','Given names on passport','Date of birth','Country of residence','City of residence','Arrival date in Japan','Flight number','Purpose of visit','Days of stay','Accommodation name','Accommodation address in Japan','Contact number in Japan','Tourism','Business','Visiting relatives','Other','Complete the official declaration','Clear entries','Entries are not sent to or stored on our server. This is a preparation form. Submission and QR codes are handled by Visit Japan Web.','Prepare your passport, flight and accommodation details.','Official Digital Agency guidance'];
 const ko=Array.from({length:23},(_,n)=>document.querySelector('[data-jp="'+n+'"]')?.textContent||'');
 const zh=['日本入境申报表','填写准备 · 请通过 Visit Japan Web 正式提交','护照姓氏','护照名字','出生日期','居住国家','居住城市','抵达日本日期','航班号','访问目的','停留天数','住宿名称','日本住宿地址','日本联系电话','旅游','商务','探亲','其他','填写官方申报表','清空输入','输入内容不会发送或保存到我们的服务器。此表用于准备；正式提交和二维码由 Visit Japan Web 处理。','请准备护照、航班和住宿信息。','日本数字厅官方指南'];
 const de=['Einreiseanmeldung Japan','Vorbereitung · Offiziell über Visit Japan Web einreichen','Nachname laut Reisepass','Vornamen laut Reisepass','Geburtsdatum','Wohnsitzland','Wohnort','Ankunftsdatum in Japan','Flugnummer','Reisezweck','Aufenthaltsdauer in Tagen','Unterkunftsname','Unterkunftsadresse in Japan','Telefonnummer in Japan','Tourismus','Geschäftsreise','Familienbesuch','Sonstiges','Offizielle Anmeldung ausfüllen','Eingaben löschen','Eingaben werden weder gesendet noch auf unserem Server gespeichert. Dieses Formular dient zur Vorbereitung. Einreichung und QR-Codes erfolgen über Visit Japan Web.','Reisepass, Flug- und Unterkunftsdaten bereithalten.','Offizielle Hinweise der Digitalagentur'];
 const fr=['Déclaration d’entrée au Japon','Préparation · Déclaration officielle sur Visit Japan Web','Nom sur le passeport','Prénoms sur le passeport','Date de naissance','Pays de résidence','Ville de résidence','Date d’arrivée au Japon','Numéro de vol','Motif du séjour','Durée en jours','Nom de l’hébergement','Adresse au Japon','Téléphone au Japon','Tourisme','Affaires','Visite familiale','Autre','Remplir la déclaration officielle','Effacer les données','Les données ne sont ni envoyées ni conservées sur notre serveur. Ce formulaire sert à la préparation. La déclaration et le code QR sont traités par Visit Japan Web.','Préparez passeport, vol et coordonnées de l’hébergement.','Guide officiel de l’Agence numérique'];
 const translations={ko,en,zh,de,fr};function apply(){const t=translations[window.lrLanguage]||ko;document.querySelectorAll('[data-jp]').forEach(el=>el.textContent=t[Number(el.dataset.jp)]);}
 document.addEventListener('lr-language',apply);apply();
})();

(() => {
 const source=document.getElementById('jp-surname-source'),result=document.getElementById('jp-surname-result'),help=document.getElementById('jp-surname-help'),surname=document.querySelector('#jp-entry-form input[name="surname"]');
 if(!source||!result)return;
 const names={'김':'KIM','이':'LEE','박':'PARK','최':'CHOI','정':'JUNG','강':'KANG','조':'CHO','윤':'YOON','장':'JANG','임':'LIM','한':'HAN','오':'OH','서':'SEO','신':'SHIN','권':'KWON','황':'HWANG','안':'AHN','송':'SONG','전':'JEON','홍':'HONG','유':'YOO','고':'KO','문':'MOON','양':'YANG','손':'SON','배':'BAE','백':'BAEK','허':'HEO','남':'NAM','심':'SHIM','노':'NOH','하':'HA','곽':'KWAK','성':'SUNG','차':'CHA','주':'JOO','우':'WOO','구':'KOO','민':'MIN','진':'JIN','나':'NA','지':'JI','엄':'EOM','채':'CHAE','원':'WON','천':'CHEON','방':'BANG','공':'GONG','현':'HYUN','함':'HAM','변':'BYUN','남궁':'NAMGUNG','황보':'HWANGBO','제갈':'JEGAL','선우':'SUNWOO','독고':'DOKGO'};
 const sync=()=>{if(surname)surname.value=result.value;};
 source.addEventListener('input',()=>{
  const value=source.value.trim().normalize('NFC');
  result.value=names[value]||(/^[a-zA-Z -]+$/.test(value)?value.toUpperCase():'');sync();
  help.textContent=!value?'한글 성을 입력하면 영문 표기를 제안합니다. 여권의 영문 성과 일치하도록 확인하세요.':result.value?'영문 표기 제안입니다. 여권의 영문 성과 다르면 위 결과를 직접 수정하세요.':'이 성의 영문 표기를 자동으로 정할 수 없습니다. 여권의 영문 성을 직접 입력하세요.';
 });
 result.addEventListener('input',sync);
 if(surname)surname.addEventListener('input',()=>{result.value=surname.value;});
 document.getElementById('jp-entry-form')?.addEventListener('reset',()=>{source.value='';result.value='';help.textContent='한글 성을 입력하면 영문 표기를 제안합니다. 여권의 영문 성과 일치하도록 확인하세요.';});
})();
