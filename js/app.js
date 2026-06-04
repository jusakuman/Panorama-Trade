/* ═══════════════════════════════════════════════════
   PANORAMA TRADE — js/app.js
   Inicialização e navegação principal.
   Leitura obrigatória: CLAUDE.md antes de editar.
════════════════════════════════════════════════════ */

const App = (() => {

  let _state = null;

  /* ─── Inicializa o app ─── */
  function init() {
    _state = Storage.get();
    _setupNav();
    _setupClock();
    HomePage.render(_state);
  }

  /* ─── Configura navegação inferior ─── */
  function _setupNav() {
    const btns = document.querySelectorAll('.nav-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        _navigate(target, btn);
      });
    });
  }

  /* ─── Navega para uma tela ─── */
  function _navigate(screenId, btn) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const screen = document.getElementById(screenId);
    if (screen) screen.classList.add('active');
    if (btn)    btn.classList.add('active');

    _state = Storage.get();

    switch (screenId) {
      case 's-home':     HomePage.render(_state);      break;
      case 's-calendar': CalendarPage.render(_state);  break;
      case 's-diary':    DiaryPage.render(_state);      break;
      case 's-check':    ChecklistPage.render(_state);  break;
      case 's-charts':   ChartsPage.render(_state);     break;
    }
  }

  /* ─── Configura o relógio ─── */
  function _setupClock() {
    Clock.start(({ jst, openingHour, isDST, countdown }) => {
      const clockEl = document.getElementById('clock');
      const openEl  = document.getElementById('open-time');
      const dstEl   = document.getElementById('open-dst');
      const countEl = document.getElementById('countdown');

      if (clockEl) clockEl.textContent = jst;
      if (openEl)  openEl.textContent  = openingHour + ':30';
      if (dstEl)   dstEl.textContent   = isDST ? '🌞 Horário de verão EUA ativo' : '❄️ Horário de inverno EUA';
      if (countEl) countEl.textContent = countdown.h + 'h ' + countdown.m + 'm ' + countdown.s + 's';
    });
  }

  /* ─── Abre um modal ─── */
  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    if (id === 'modal-event') {
      const dateInput = document.getElementById('ev-date');
      if (dateInput) dateInput.value = Clock.getJSTDate();
    }

    if (id === 'modal-trade') {
      const timeInput = document.getElementById('tr-time');
      if (timeInput) {
        timeInput.value = new Intl.DateTimeFormat('ja-JP', {
          timeZone: 'Asia/Tokyo',
          hour: '2-digit', minute: '2-digit', hour12: false
        }).format(new Date());
      }
    }

    modal.classList.add('open');
  }

  /* ─── Fecha um modal ─── */
  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('open');
  }

  /* ─── Fecha modal ao clicar fora ─── */
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('open');
    }
  });

  /* ─── Retorna o estado atual ─── */
  function getState() { return _state; }

  /* ─── Atualiza e salva o estado ─── */
  function setState(newState) {
    _state = newState;
    Storage.save(_state);
  }

  /* ─── API pública ─── */
  return { init, openModal, closeModal, getState, setState };

})();

/* ─── Inicia o app quando o DOM estiver pronto ─── */
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
