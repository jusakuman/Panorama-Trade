const Clock = (() => {
  let _interval = null;

  function getJST() {
    return new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(new Date());
  }

  function getJSTDate() {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
  }

  function isUSDST() {
    const month = parseInt(new Date().toLocaleString('en-US', { timeZone: 'America/New_York', month: 'numeric' }));
    return month >= 3 && month <= 11;
  }

  function getOpeningHour() { return isUSDST() ? 22 : 23; }

  function getCountdown() {
    const now    = new Date();
    const jstNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
    const oh     = getOpeningHour();
    let opening  = new Date(jstNow);
    opening.setHours(oh, 30, 0, 0);
    if (opening <= jstNow) opening.setDate(opening.getDate() + 1);
    const diff = opening - jstNow;
    return {
      h: Math.floor(diff / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
      diff
    };
  }

  function start(onTick) {
    if (_interval) stop();
    const tick = () => onTick({
      jst: getJST(), jstDate: getJSTDate(),
      openingHour: getOpeningHour(), isDST: isUSDST(),
      countdown: getCountdown()
    });
    tick();
    _interval = setInterval(tick, 1000);
  }

  function stop() {
    if (_interval) { clearInterval(_interval); _interval = null; }
  }

  return { start, stop, getJST, getJSTDate, getOpeningHour, isUSDST, getCountdown };
})();
