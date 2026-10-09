const configs=[
 {n:3,key:'birth',example:'09 / 10 / 1990',hint:'생년월일',type:'date',help:'일 / 월 / 년 순서로 표시됩니다.'},
 {n:4,key:'country',example:'REPUBLIC OF KOREA',hint:'거주 국가 입력',type:'text',help:'국적이 아니라 현재 거주 국가입니다.'},
 {n:5,key:'city',example:'SEOUL',hint:'거주 도시 · 예: 서울',type:'text'},
 {n:6,key:'purpose',example:'TOURISM',options:[['','방문 목적 선택'],['TOURISM','관광'],['BUSINESS','업무'],['VISITING RELATIVES','친척 방문'],['OTHER','기타']],extra:true},
 {n:7,key:'flight',example:'KE703',hint:'항공편·선박명 입력',type:'text'},
 {n:8,key:'stay',example:'5 DAYS',hint:'체류 일수 · 예: 5',type:'number'},
 {n:9,key:'address',example:'1-1-1 Shinjuku, Tokyo',hint:'숙소의 영문 주소 입력',type:'textarea',help:'예약 확인서의 영문 숙소 주소를 그대로 입력하세요.'},
 {n:10,key:'phone',example:'+81 3 1234 5678',hint:'일본 연락처 입력',type:'tel'},
 {n:11,key:'deportation',help:'일본에서 강제퇴거되거나 출국명령에 따라 출국한 이력, 상륙거부 이력을 확인하세요.',example:'YES / NO',options:[['','해당 여부 선택'],['YES','예 · 이력 있음'],['NO','아니요 · 이력 없음']]},
 {n:12,key:'conviction',help:'일본을 포함한 모든 국가에서 형사사건으로 유죄판결을 받은 이력입니다.',example:'YES / NO',options:[['','해당 여부 선택'],['YES','예 · 이력 있음'],['NO','아니요 · 이력 없음']]},
 {n:13,key:'possession',help:'현재 규제약물·총포·석궁·도검류·화약류를 소지하고 있는지 선택하세요.',example:'YES / NO',options:[['','해당 여부 선택'],['YES','예 · 소지함'],['NO','아니요 · 소지하지 않음']]},
 {n:14,key:'signature',example:'HONG GILDONG',hint:'여권 영문 성명 입력',type:'text',help:'서명 위치를 확인하는 용도입니다. 실제 양식에는 직접 서명하세요.'}
];
const copyIcon='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>';
export function fieldEditor(n){const c=configs.find(c=>c.n===n);if(!c)return '';const id='jp-field-'+c.key;const control=c.options?`<select id="${id}" data-entry-source="${c.key}" aria-label="${c.hint||c.options[0][1]}">${c.options.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</select>`:c.type==='textarea'?`<textarea id="${id}" data-entry-source="${c.key}" placeholder="${c.hint}" aria-label="${c.hint}" maxlength="300" rows="2"></textarea>`:`<input id="${id}" data-entry-source="${c.key}" type="${c.type}" placeholder="${c.hint}" aria-label="${c.hint}" autocomplete="off" ${c.type==='number'?'min="1" max="3650" step="1"':''} ${c.key==='country'?'list="jp-countries"':''} ${c.key==='city'?'list="jp-cities"':''} maxlength="160"/>`;
 return `<div class="jp-surname-editor jp-inline-editor jp-split-editor jp-all-editor"><div class="jp-split-box">${control}<div class="jp-translation-cell"><output id="${id}-result" aria-label="${c.hint||c.options[0][1]} 변환 결과" aria-live="polite"></output><button class="jp-copy-button" type="button" data-field-copy="${c.key}" aria-label="${n}번 결과 복사" title="복사" disabled>${copyIcon}</button></div></div>${c.extra?'<input class="jp-purpose-other" aria-label="기타 방문 목적 영문 입력" placeholder="기타 목적을 영문으로 입력" maxlength="80" hidden/>':''}<p class="jp-field-status" id="${id}-status" role="status" hidden></p>${c.help?`<p class="jp-field-tip">${c.help}</p>`:''}</div>`;
}
export function fieldExample(n){return configs.find(c=>c.n===n)?.example||'';}
