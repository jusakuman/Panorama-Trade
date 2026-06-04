const Quotes = (() => {
  let _timer = null;

  function fmt(n, d) {
    if (isNaN(n) || n === null) return '---';
    return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  function renderCards(data) {
    const container = document.getElementById('quotes-cards');
    if (!container) return;
    container.innerHTML = data.map(a => {
      const up = a.change >= 0;
      const color = up ? '#27C97A' : '#E84545';
      const arrow = up ? 'ti-trending-up' : 'ti-trending-down';
      const sign = up ? '+' : '';
      const decimals = a.id === 'xau' ? 2 : 0;
      return `
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:36px;height:36px;border-radius:8px;background:var(--card2);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--gold2)">${a.id === 'xau' ? 'Au' : a.id === 'nas' ? 'NQ' : 'DJ'}</div>
            <div>
              <div style="font-size:14px;font-weight:600;color:var(--text)">${a.name}</div>
              <div style="font-size:11px;color:var(--text3)">${a.sub}</div>
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-size:15px;font-weight:600;font-family:monospace;color:var(--text)">${fmt(a.price, decimals)}</div>
            <div style="font-size:11px;font-weight:500;color:${color}">
              <i class="ti ${arrow}" style="font-size:10px"></i>
              ${sign}${fmt(a.change, decimals)} (${sign}${fmt(a.pct, 2)}%)
            </div>
          </div>
        </div>`;
    }).join('');
  }

  function renderLoading() {
    const container = document.getElementById('quotes-cards');
    if (!container) return;
    container.innerHTML = ['XAU/USD','NAS100','US30'].map(name => `
      <div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between">
        <div style="font-size:13px;color:var(--text3)">${name}</div>
        <div style="font-size:12px;color:var(--text3)">carregando...</div>
      </div>`).join('');
  }

  async function fetch_data() {
    try {
      const res = await fetch('/api/quotes');
      const json = await res.json();
      if (json.ok) renderCards(json.data);
    } catch (e) {
      console.error('Quotes error:', e);
    }
  }

  function start() {
    renderLoading();
    fetch_data();
    _timer = setInterval(fetch_data, 30000);
  }

  function stop() {
    if (_timer) clearInterval(_timer);
  }

  return { start, stop };
})();
