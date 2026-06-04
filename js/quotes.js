const Quotes = (() => {

  const ASSETS = [
    { id: 'gold', symbol: 'XAUUSD=X', name: 'XAU/USD',    sub: 'Ouro / Dolar',   icon: 'Au', cls: 'gold-i' },
    { id: 'nas',  symbol: 'NQ=F',     name: 'NASDAQ',      sub: 'NAS100 Futuro',  icon: 'NQ', cls: 'nas-i'  },
    { id: 'dow',  symbol: 'YM=F',     name: 'Dow Jones',   sub: 'US30 Futuro',    icon: 'DJ', cls: 'dow-i'  }
  ];

  let _interval = null;

  async function fetchQuote(symbol) {
    const url = `https://corsproxy.io/?https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error('Erro na API');
    const data = await res.json();
    const meta = data.chart.result[0].meta;
    return {
      price:  meta.regularMarketPrice,
      change: meta.regularMarketPrice - meta.previousClose,
      pct:    ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100
    };
  }

  function fmt(n, d = 2) {
    return n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  function renderCard(asset, quote) {
    if (!quote) {
      return `<div class="quote-card">
        <div class="asset-icon ${asset.cls}">${asset.icon}</div>
        <div class="quote-body"><div class="quote-name">${asset.name}</div><div class="quote-sub">${asset.sub}</div></div>
        <div class="quote-right"><div class="quote-price" style="color:var(--text3)">---</div><div class="quote-change" style="color:var(--text3)">aguardando...</div></div>
      </div>`;
    }
    const up    = quote.change >= 0;
    const color = up ? 'var(--green)' : 'var(--red)';
    const arrow = up ? '▲' : '▼';
    const sign  = up ? '+' : '';
    return `<div class="quote-card">
      <div class="asset-icon ${asset.cls}">${asset.icon}</div>
      <div class="quote-body"><div class="quote-name">${asset.name}</div><div class="quote-sub">${asset.sub}</div></div>
      <div class="quote-right">
        <div class="quote-price">${fmt(quote.price)}</div>
        <div class="quote-change" style="color:${color}">${arrow} ${sign}${fmt(quote.change)} (${sign}${fmt(quote.pct)}%)</div>
      </div>
    </div>`;
  }

  async function fetchAll() {
    const container = document.getElementById('quotes-container');
    if (!container) return;
    const quotes = {};
    await Promise.allSettled(ASSETS.map(async a => {
      try { quotes[a.id] = await fetchQuote(a.symbol); }
      catch (e) { console.warn('[Quotes]', a.symbol, e.message); }
    }));
    container.innerHTML = ASSETS.map(a => renderCard(a, quotes[a.id] || null)).join('');
  }

  function start() {
    const container = document.getElementById('quotes-container');
    if (container) container.innerHTML = ASSETS.map(a => renderCard(a, null)).join('');
    fetchAll();
    if (_interval) clearInterval(_interval);
    _interval = setInterval(fetchAll, 30000);
  }

  function stop() {
    if (_interval) { clearInterval(_interval); _interval = null; }
  }

  return { start, stop };
})();
