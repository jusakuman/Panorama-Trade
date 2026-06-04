/* ═══════════════════════════════════════════════════
   PANORAMA TRADE — js/clock.js
   Relógio JST e countdown para abertura de NY.
   Leitura obrigatória: CLAUDE.md antes de editar.
════════════════════════════════════════════════════ */

const Clock = (() => {

  let _interval = null;

  /* ─── Retorna a hora atual em JST ─── */
  function getJST() {
    return new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    }).format(new Date());
  }

  /* ─── Retorna a data atual em JST (YYYY-MM-DD) ─── */
  function getJSTDate() {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
  }

  /* ─── Detecta se EUA está em horário de verão ─── */
  function isUSDST() {
    const month = parseInt(
      new Date().toLocaleString('en-US', { timeZone: 'America/New_York', month: 'numeric' })
    );
    return month >= 3 && month <= 11;
  }

  /* ─── Retorna horário de abertura de NY em JST ─── */
  function getOpeningHour() {
    return isUSDST() ? 22 : 23;
  }

  /* ─── Calcula countdown para abertura de NY ─── */
  function getCountdown() {
    const now    = new Date();
    const jstNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
    const oh     = getOpeningHour();

    let opening = new Date(jstNow);
    opening.setHours(oh, 30, 0, 0);

    if (opening <= jstNow) {
      opening.setDate(opening.getDate() + 1);
    }

    const diff = opening - jstNow;
    const h    = Math.floor(diff / 3600000);
    const m    = Math.floor((diff % 3600000) / 60000);
    const s    = Math.floor((diff % 60000) / 1000);

    return { h, m, s, diff };
  }

  /* ─── Inicia o tick a cada 1 segundo ─── */
  function start(onTick) {
    if (_interval) stop();
    _interval = setInterval(() => {
      onTick({
        jst:         getJST(),
        jstDate:     getJSTDate(),
        openingHour: getOpeningHour(),
        isDST:       isUSDST(),
        countdown:   getCountdown()
      });
    }, 1000);
    // Dispara imediatamente na primeira vez
    onTick({
      jst:         getJST(),
      jstDate:     getJSTDate(),
      openingHour: getOpeningHour(),
      isDST:       isUSDST(),
      countdown:   getCountdown()
    });
  }

  /* ─── Para o tick ─── */
  function stop() {
    if (_interval) {
      clearInterval(_interval);
      _interval = null;
    }
  }

  /* ─── API pública ─── */
  return { start, stop, getJST, getJSTDate, getOpeningHour, isUSDST, getCountdown };

})();
