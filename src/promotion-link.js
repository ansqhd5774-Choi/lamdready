const host='landready-assets.ansqhd5774.workers.dev';
const channels={'naver-cafe':'community','naver-blog':'social',kakao:'messaging',instagram:'social',facebook:'social',email:'email'};
export function promotionLink({source,medium}){
 if(!Object.hasOwn(channels,source)||channels[source]!==medium)throw Error('KNOWN_CHANNEL_PAIR_REQUIRED');
 const url=new URL(`https://${host}/trip?lang=ko&origin=KR&destination=JP`);
 for(const [name,value] of Object.entries({utm_source:source,utm_medium:medium,utm_campaign:'landready_jp_preparation',utm_content:'jp_entry_14_fields'}))url.searchParams.set(name,value);
 return url.href;
}
