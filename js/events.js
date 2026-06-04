const Events = (() => {

  function sanitize(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;').trim();
  }

  function validate(ev) {
    if (!ev.name || ev.name.trim() === '') return 'Nome do evento e obrigatorio.';
    if (!ev.date) return 'Data e obrigatoria.';
    if (!ev.time) return 'Horario e obrigatorio.';
    if (!['high','med','low'].includes(ev.impact)) return 'Impacto invalido.';
    return null;
  }

  function getToday(state) {
    const today = Clock.getJSTDate();
    return (state.events || []).filter(e => e.date === today).sort((a,b) => a.time.localeCompare(b.time));
  }

  function getNextHigh(state) {
    const todayEvs = getToday(state);
    const nowT = new Date().toLocaleString('en-US', { timeZone:'Asia/Tokyo', hour:'2-digit', minute:'2-digit', hour12:false });
    return todayEvs.find(e => e.impact === 'high' && e.time > nowT) || null;
  }

  function add(state, formData) {
    const ev = {
      id:     Date.now(),
      name:   sanitize(formData.name),
      curr:   sanitize(formData.curr),
      impact: formData.impact,
      time:   formData.time,
      date:   formData.date,
      prev:   sanitize(formData.prev   || ''),
      fore:   sanitize(formData.fore   || ''),
      result: '',
      desc:   sanitize(formData.desc   || '')
    };
    const error = validate(ev);
    if (error) return { ok: false, error };
    state.events.push(ev);
    Storage.save(state);
    return { ok: true, ev };
  }

  function remove(state, id) {
    state.events = state.events.filter(e => e.id !== id);
    Storage.save(state);
  }

  function renderRow(e) {
    const dc = e.impact === 'high' ? 'dh' : e.impact === 'med' ? 'dm' : 'dl';
    const lc = e.impact === 'high' ? 'lh' : e.impact === 'med' ? 'lm' : 'll';
    const lt = e.impact === 'high' ? 'Alto Impacto' : e.impact === 'med' ? 'Medio Impacto' : 'Baixo';
    const vals = (e.prev || e.fore) ? `<div class="ev-vals">
      ${e.prev   ? `<div class="ev-val"><span>Ant </span>${e.prev}</div>` : ''}
      ${e.fore   ? `<div class="ev-val"><span>Prev </span>${e.fore}</div>` : ''}
      ${e.result ? `<div class="ev-val" style="color:var(--green)"><span>Real </span>${e.result}</div>` : ''}
    </div>` : '';
    const desc = e.desc ? `<div class="ev-desc">${e.desc}</div>` : '';
    return `<div class="event-row impact-${e.impact}">
      <div class="ev-time-col">
        <div class="ev-time">${e.time}</div>
        <div class="ev-curr">${e.curr}</div>
      </div>
      <div class="ev-dot ${dc}"></div>
      <div class="ev-body">
        <div class="ev-name">${e.name}</div>
        <span class="ev-lbl ${lc}">● ${lt}</span>
        ${vals}${desc}
      </div>
    </div>`;
  }

  return { add, remove, getToday, getNextHigh, renderRow, sanitize, validate };
})();
