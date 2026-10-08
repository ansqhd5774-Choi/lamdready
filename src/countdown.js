export function createCountdown({go, progress, now=Date.now, later=setTimeout, clearLater=clearTimeout, repeat=setInterval, clearRepeat=clearInterval}) {
  let key='', timeout=null, interval=null, deadline=0;
  function cancel(){clearLater(timeout);clearRepeat(interval);timeout=interval=null;key='';progress(0,false);}
  function finish(){if(!key)return;const selected=key;cancel();go(selected);}
  function start(next){if(!next){cancel();return;}if(next===key)return;cancel();key=next;deadline=now()+5000;progress(0,true);interval=repeat(()=>progress(Math.min(1,Math.max(0,1-(deadline-now())/5000)),true),50);timeout=later(finish,5000);}
  return {start,cancel,finish};
}
