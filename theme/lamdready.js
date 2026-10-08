(() => {
  'use strict';
  const app = document.getElementById('lr-app');
  if (!app) return;
  const origin = document.getElementById('lr-origin');
  const destination = document.getElementById('lr-destination');
  const key = 'lamdready-route-v1';
  function restrictDestination() {
    for (const option of destination.options) option.disabled = Boolean(option.value && option.value === origin.value);
    if (origin.value && destination.value === origin.value) destination.value = '';
  }
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved) for (const [field,value] of [[origin,saved.origin],[destination,saved.destination]]) if ([...field.options].some(option=>option.value===value)) field.value=value;
  } catch {}
  restrictDestination();
  const route = document.getElementById('lr-trip-form');
  const timers = new WeakMap();
  function updateState() { route.classList.toggle('lr-ready', Boolean(origin.value && destination.value)); }
  updateState();
  for (const field of [origin,destination]) field.addEventListener('change', () => { const wrapper=field.parentElement; clearTimeout(timers.get(wrapper)); wrapper.classList.remove('lr-changed'); requestAnimationFrame(()=>{wrapper.classList.add('lr-changed'); timers.set(wrapper,setTimeout(()=>wrapper.classList.remove('lr-changed'),420));}); });
  function save() { restrictDestination(); updateState(); try { localStorage.setItem(key,JSON.stringify({origin:origin.value,destination:destination.value})); } catch {} }
  origin.addEventListener('change',save);
  destination.addEventListener('change',save);
  document.getElementById('lr-trip-form').addEventListener('submit',event=>event.preventDefault());
})();
