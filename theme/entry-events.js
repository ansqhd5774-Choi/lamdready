(() => {
  // Page-memory counters only: no storage, network, identity, input text or URL.
  const fields=new Set(['surname','given','birth','country','city','purpose','flight','stay','address','phone','deportation','conviction','possession','signature']);
  const counts=Object.create(null);
  const publish=()=>document.documentElement.setAttribute('data-lr-action-counts',JSON.stringify(counts));
  publish();
  window.lrRecordAction=(event,field)=>{
    if(event!=='copy_success'&&event!=='official_link_click')return false;
    if(event==='copy_success'&&!fields.has(field))return false;
    const detail=Object.freeze(event==='copy_success'?{event,field}:{event});
    const key=event==='copy_success'?`${event}:${field}`:event;
    counts[key]=(counts[key]||0)+1;
    publish();
    document.dispatchEvent(new CustomEvent('lr-action',{detail}));
    return true;
  };
  window.lrReadActionCounts=()=>Object.freeze({...counts});
  document.addEventListener('click',event=>{
    const link=event.target.closest?.('a[href]');
    if(link?.href==='https://www.vjw.digital.go.jp/main/')window.lrRecordAction('official_link_click');
  });
})();
