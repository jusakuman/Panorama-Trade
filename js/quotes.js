/* ═══════════════════════════════════════════════════
   PANORAMA TRADE — js/quotes.js
   Cotacoes em tempo real via Yahoo Finance.
   Leitura obrigatoria: CLAUDE.md antes de editar.
════════════════════════════════════════════════════ */

const Quotes = (() => {

  const ASSETS = [
    {
      id:     'gold',
      symbol: 'XAUUSD=X',
      name:   'XAU/USD',
      sub:    'Ouro / Dolar',
      icon:   'Au',
      cls:    'gold-i'
    },
    {
      id:     'nas',
      symbol: 'NQ=F',
      name:   'NASDAQ',
      sub:    'NAS100 Futuro',
      icon:   'NQ',
      cls:    'nas-i'
    },
    {
      id:     'dow',
      symbol: 'YM=F',
      name:   'Dow Jones',
      sub:    'US30 Futuro',
      icon:   'DJ',
      cls:    'dow-i'
    }
  ];

  let _interval = null;

  /* ─── Busca cotacao de um simbolo ─── */
  async function fetchQuote(symbol) {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error('Erro na API');
    const data = await res.json();
    const meta = data.chart.result[0].meta;
    return {
      price:  meta.regularMarketPrice,
      prev:   meta.previousClose,
      change: meta.regularMarketPrice - meta.previousClose,
      pct:    ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100
    };
  }

  /* ─── Formata numero ─── */
  function fmt(n, decimals = 2) {
    return n.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }

  /* ─── Renderiza card de um ativo ─── */
  function renderCard(asset, quote, loading = false) {
    if (loading) {
      return `
        <div class="quote-card">
          <div class="asset-icon ${asset.cls}">${asset.icon}</div>
          <div class="quote-body">
            <div class="quote-name">${asset.name}</div>
            <div class="quote-sub">${asset.sub}</div>
          </div>
          <div class="quote-right">
            <div class="quote-price" style="color:var(--text3)">---</div>
            <div class="quote-change" style="color:var(--text3)">--</div>
          </div>
        </div>`;
    }

    const up      = quote.change >= 0;
    const color   = up ? 'var(--green)' : 'var(--red)';
    const arrow   = up ? '▲' : '▼';
    const sign    = up ? '+' : '';
    const pct     = sign + fmt(quote.pct, 2) + '%';
    const chg     = sign + fmt(quote.change, 2);

    return `
      <div class="quote-card">
        <div class="asset-icon ${asset.cls}">${asset.icon}</div>
        <div class="quote-body">
          <div class="quote-name">${asset.name}</div>
          <div class="quote-sub">${asset.sub}</div>
        </div>
        <div class="quote-right">
          <div class="quote-price">${fmt(quote.price, 2)}</div>
          <div class="quote-change" style="color:${color}">${arrow} ${chg} (${pct})</div>
        </div>
      </div>`;
  }

  /* ─── Renderiza todos os cards ─── */
  function renderAll(quotes) {
    const container = document.getElementById('quotes-container');
    if (!container) return;
    container.innerHTML = ASSETS.map(a =>
      renderCard(a, quotes[a.id] || null, !quotes[a.id])
    ).join('');
  }

  /* ─── Renderiza loading ─── */
  function renderLoading() {
    const container = document.getElementById('quotes-container');
    if (!container) return;
    container.innerHTML = ASSETS.map(a => renderCard(a, null, true)).join('');
  }

  /* ─── Busca todas as cotacoes ─── */
  async function fetchAll() {
    const quotes = {};
    await Promise.allSettled(
      ASSETS.map(async a => {
        try {
          quotes[a.id] = await fetchQuote(a.symbol);
        } catch (e) {
          console.warn('[Quotes] Erro ao buscar', a.symbol, e);
        }
      })
    );
    renderAll(quotes);
  }

  /* ─── Inicia atualizacao automatica ─── */
  function start() {
    renderLoading();
    fetchAll();
    if (_interval) clearInterval(_interval);
    _interval = setInterval(fetchAll, 30000);
  }

  /* ─── Para atualizacao ─── */
  function stop() {
    if (_interval) { clearInterval(_interval); _interval = null; }
  }

  return { start, stop, fetchAll };

})();
