const Quotes = (() => {

  const ASSETS = [
    { id: 'gold', name: 'XAU/USD',   sub: 'Ouro / Dolar',  icon: 'Au', cls: 'gold-i' },
    { id: 'nas',  name: 'NASDAQ',    sub: 'NAS100',         icon: 'NQ', cls: 'nas-i'  },
    { id: 'dow',  name: 'Dow Jones', sub: 'US30',           icon: 'DJ', cls: 'dow-i'  }
  ];

  const PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?'
  ];

  const SYMBOLS = { gold: 'XAUUSD=X', nas: 'NQ=F', dow: 'YM=F' };

  let _interval = null;

  async function fetchWithProxy(symbol) {
    const target = encodeURIComponent(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`
    );
    for (const proxy of PROXIES) {
      try {
        const res = await fetch(proxy + target, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) continue;
        const data = await res.json();
        const meta = data.chart.result[0].meta;
        return {
          price:  meta.regularMarketPrice,
          change: meta.regularMarketPrice - meta.previousClose,
          pct:    ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100
        };
      } catch(e) { continue; }
    }
    return null;
  }

  function fmt(n, d = 2) {
    return n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  function renderCard(asset, quote) {
    const priceHtml = quote
      ? `<div class="quote-price">${fmt(quote.price)}</div>
         <div class="quote-change" style="color:${quote.change >= 0 ? 'var(--green)' : 'var(--red)'}">
           ${quote.change >= 0 ? '▲' : '▼'} ${quote.change >= 0 ? '+' : ''}${fmt(quote.change)} (${quote.change >= 0 ? '+' : ''}${fmt(quote.pct)}%)
         </div>`
      : `<div class="quote-price" style="color:var(--text3)">---</div>
         <div class="quote-change" style="color:var(--text3)">mercado fechado</div>`;

    return `<div class="quote-card">
      <div class="asset-icon ${asset.cls}">${asset.icon}</div>
      <div class="quote-body">
        <div class="quote-name">${asset.name}</div>
        <div class="quote-sub">${asset.sub}</div>
      </div>
      <div class="quote-right">${priceHtml}</div>
    </div>`;
  }

  async function fetchAll() {
    const container = document.getElementById('quotes-container');
    if (!container) return;
    const results = await Promise.allSettled(
      ASSETS.map(a => fetchWithProxy(SYMBOLS[a.id]))
    );
    container.innerHTML = ASSETS.map((a, i) =>
      renderCard(a, results[i].status === 'fulfilled' ? results[i].value : null)
    ).join('');
  }

  function start() {
    const container = document.getElementById('quotes-container');
    if (container) {
      container.innerHTML = ASSETS.map(a => renderCard(a, null)).join('');
    }
    fetchAll();
    if (_interval) clearInterval(_interval);
    _interval = setInterval(fetchAll, 30000);
  }

  function stop() {
    if (_interval) { clearInterval(_interval); _interval = null; }
  }

  return { start, stop };
})();
