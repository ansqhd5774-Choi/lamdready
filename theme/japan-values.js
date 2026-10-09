export const cityNames={'서울':'SEOUL','부산':'BUSAN','인천':'INCHEON','대구':'DAEGU','대전':'DAEJEON','광주':'GWANGJU','울산':'ULSAN','세종':'SEJONG','제주':'JEJU','수원':'SUWON','성남':'SEONGNAM','고양':'GOYANG','용인':'YONGIN','청주':'CHEONGJU','전주':'JEONJU','창원':'CHANGWON','포항':'POHANG','천안':'CHEONAN','안양':'ANYANG','김해':'GIMHAE','평택':'PYEONGTAEK','시흥':'SIHEUNG','파주':'PAJU','의정부':'UIJEONGBU','김포':'GIMPO','춘천':'CHUNCHEON','강릉':'GANGNEUNG','원주':'WONJU'};
export function formatEntry(key,value,{countryLookup={},other='',today=new Date().toISOString().slice(0,10)}={}){
 const v=value.trim().normalize('NFC');if(!v)return {text:'',error:''};
 const error=message=>({text:'',error:message});
 if(key==='birth'){const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(v);if(!m||!Number.isFinite(Date.parse(v+'T00:00:00Z'))||new Date(v+'T00:00:00Z').toISOString().slice(0,10)!==v||v>today)return error('올바른 생년월일을 선택하세요.');return {text:`${m[3]} / ${m[2]} / ${m[1]}`,error:''};}
 if(key==='country'){const name=countryLookup[v.toLocaleLowerCase()];return name?{text:name,error:''}:error('추천 목록에서 거주 국가를 선택하세요.');}
 if(key==='city'){if(cityNames[v])return {text:cityNames[v],error:''};if(!/^[a-zA-Z .'-]+$/.test(v))return error('도시의 영문 표기를 입력하세요.');return {text:v.toUpperCase(),error:''};}
 if(key==='purpose'){if(v==='OTHER'){if(!other.trim())return error('기타 방문 목적을 영문으로 입력하세요.');if(!/^[\x20-\x7e]+$/.test(other))return error('기타 목적은 영문으로 입력하세요.');return {text:'OTHER: '+other.trim().toUpperCase(),error:''};}return ['TOURISM','BUSINESS','VISITING RELATIVES'].includes(v)?{text:v,error:''}:error('방문 목적을 선택하세요.');}
 if(key==='flight'){const flight=v.replace(/\s/g,'').toUpperCase();return /^[A-Z0-9]{2,3}\d{1,4}$/.test(flight)?{text:flight,error:''}:error('항공권의 편명을 입력하세요. 예: KE703');}
 if(key==='stay'){if(!/^\d+$/.test(v)||Number(v)<1||Number(v)>3650)return error('체류 일수를 양의 정수로 입력하세요.');return {text:Number(v)+' '+(Number(v)===1?'DAY':'DAYS'),error:''};}
 if(key==='address'){return /^[\x20-\x7e\n]+$/.test(v)?{text:v,error:''}:error('예약 확인서의 영문 주소를 입력하세요.');}
 if(key==='phone'){return /^[+\d ()-]+$/.test(v)&&v.replace(/\D/g,'').length>=6?{text:v,error:''}:error('연락처를 숫자와 국가번호로 입력하세요.');}
 if(['deportation','conviction','possession'].includes(key))return ['YES','NO'].includes(v)?{text:v,error:''}:error('본인에게 해당하는 답을 선택하세요.');
 if(key==='signature')return /^[a-zA-Z .'-]+$/.test(v)?{text:v.toUpperCase(),error:''}:error('여권 영문 성명을 입력하세요.');
 return error('입력 내용을 확인하세요.');
}
