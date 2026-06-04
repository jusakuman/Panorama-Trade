/* ═══════════════════════════════════════════════════
   PANORAMA TRADE — js/pages/calendar.js
   Tela Calendário Econômico.
   Leitura obrigatória: CLAUDE.md antes de editar.
════════════════════════════════════════════════════ */

const CalendarPage = (() => {

  let _currentFilter = 'all';

  function render(state) {
    const screen = document.getElementById('s-calendar');
    screen.innerHTML = `
      <div class="header">
        <div>
          <div class="header-logo">Calendário <span>Econômico</span></div>
          <div class="header-sub" id="cal-date"></div>
        </div>
        <button class="btn-icon" onclick="App.openModal('modal-event')">+ Evento</button>
      </div>

      <div style="height:10px"></div>

      <div class="tabs">
        <button class="tab active" onclick="CalendarPage.filterCal('all', this)">Todos</button>
        <button class="tab" onclick="CalendarPage.filterCal('high', this)">Alto Impacto</button>
        <button class="tab" onclick="CalendarPage.filterCal('today', this)">Hoje</button>
      </div>

      <div id="cal-list"></div>
      <div class="spacer"></div>
    `;

    const dateEl = document.getElementById('cal-date');
    if (dateEl) {
      dateEl.textContent = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'Asia/Tokyo',
        weekday: 'long', day: 'numeric', month: 'long'
      }).format(new Date());
    }

    _renderList(state, _currentFilter);
  }

  function _renderList(state, filter) {
    let evs = [...(state.events || [])];

    if (filter === 'high')  evs = evs.filter(e => e.impact === 'high');
    if (filter === 'today') evs = evs.filter(e => e.date === Clock.getJSTDate());

    evs.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

    const el = document.getElementById('cal-list');
    if (!el) return;

    if (!evs.length) {
      el.innerHTML = '<div class="empty">Nenhum evento encontrado.</div>';
      return;
    }

    el.innerHTML = evs.map(e => {
      const dc     = e.impact === 'high' ? 'dh' : e.impact === 'med' ? 'dm' : 'dl';
      const dotClr = e.impact === 'high' ? 'var(--red)' : e.impact === 'med' ? 'var(--orange)' : 'var(--text3)';
      const lc     = e.impact === 'high' ? 'lh' : e.impact === 'med' ? 'lm' : 'll';
      const lt     = e.impact === 'high' ? 'Alto' : e.impact === 'med' ? 'Médio' : 'Baixo';

      const vals = (e.prev || e.fore) ? `
        <div class="ev-vals">
          ${e.prev ? `<div class="ev-val"><span>Ant </span>${e.prev}</div>` : ''}
          ${e.fore ? `<div class="ev-val"><span>Prev </span>${e.fore}</div>` : ''}
          ${e.result ? `<div class="ev-val" style="color:var(--green)"><span>Real </span>${e.result}</div>` : ''}
        </div>` : '';

      return `
        <div class="trade-item" style="border-left: 3px solid ${dotClr}; margin:0 16px 8px; border-radius: var(--radius)">
          <div style="display:flex;align-items:flex-start;gap:9px">
            <div class="ev-dot ${dc}" style="background:${dotClr};margin-top:4px;flex-shrink:0"></div>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:500;margin-bottom:3px">${e.name}</div>
              <div style="font-size:10px;color:var(--text3);display:flex;gap:8px;flex-wrap:wrap;align-items:center">
                <span>${e.curr}</span>
                <span>🕐 ${e.time} JST</span>
                <span>${e.date}</span>
                <span class="ev-lbl ${lc}" style="font-size:9px;padding:1px 5px">${lt}</span>
              </div>
              ${vals}
              ${e.desc ? `<div class="ev-desc">${e.desc}</div>` : ''}
            </div>
            <button onclick="CalendarPage.deleteEvent(${e.id})"
              style="background:none;border:none;color:var(--text3);cursor:pointer;padding:3px;flex-shrink:0;font-size:16px">
              <i class="ti ti-trash"></i>
            </button>
          </div>
        </div>`;
    }).join('');
  }

  function filterCal(filter, btn) {
    _currentFilter = filter;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    _renderList(App.getState(), filter);
  }

  function saveEvent() {
    const state = App.getState();
    const formData = {
      name:   document.getElementById('ev-name').value,
      curr:   document.getElementById('ev-curr').value,
      impact: document.getElementById('ev-impact').value,
      time:   document.getElementById('ev-time').value,
      date:   document.getElementById('ev-date').value,
      prev:   document.getElementById('ev-prev').value,
      fore:   document.getElementById('ev-fore').value,
      desc:   document.getElementById('ev-desc').value
    };

    const result = Events.add(state, formData);
    if (!result.ok) {
      alert(result.error);
      return;
    }

    App.setState(state);
    App.closeModal('modal-event');

    ['ev-name','ev-time','ev-prev','ev-fore','ev-desc'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    render(state);
  }

  function deleteEvent(id) {
    if (!confirm('Remover este evento?')) return;
    const state = App.getState();
    Events.remove(state, id);
    App.setState(state);
    render(state);
  }

  return { render, filterCal, saveEvent, deleteEvent };

})();
