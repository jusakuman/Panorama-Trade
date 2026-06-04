/* ===============================================
   PANORAMA TRADE - js/pages/charts.js
   Tela Graficos TradingView — lista + fullscreen.
   Leitura obrigatoria: CLAUDE.md antes de editar.
================================================ */
const ChartsPage = (() => {

  const CHARTS = [
    { id: 'xau',  name: 'XAU/USD',  sub: 'Ouro',       symbol: 'OANDA:XAUUSD',     icon: 'Au', cls: 'gold-i' },
    { id: 'nas',  name: 'NAS100',   sub: 'NASDAQ 100',  symbol: 'CAPITALCOM:US100', icon: 'NQ', cls: 'nas-i'  },
    { id: 'us30', name: 'US30',     sub: 'Dow Jones',   symbol: 'CAPITALCOM:US30',  icon: 'DJ', cls: 'dow-i'  }
  ];

  function render() {
    _renderList();
  }

  function _renderList() {
    const screen = document.getElementById('s-charts');
    screen.innerHTML = `
      <div class="header">
        <div>
          <div class="header-logo"><span>Graficos</span></div>
          <div class="header-sub">XAU/USD · NASDAQ · Dow Jones</div>
        </div>
      </div>
      <div style="padding:12px 16px;display:flex;flex-direction:column;gap:10px">
        ${CHARTS.map(c => `
          <div onclick="ChartsPage.openChart('${c.id}')"
            style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px;display:flex;align-items:center;gap:14px;cursor:pointer;active:opacity:.7">
            <div style="width:44px;height:44px;border-radius:10px;background:var(--card2);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--gold2);flex-shrink:0">${c.icon}</div>
            <div style="flex:1">
              <div style="font-size:15px;font-weight:600;color:var(--text)">${c.name}</div>
              <div style="font-size:12px;color:var(--text3);margin-top:2px">${c.sub}</div>
            </div>
            <i class="ti ti-chevron-right" style="color:var(--text3);font-size:18px"></i>
          </div>
        `).join('')}
      </div>
      <div class="spacer"></div>
    `;
  }

  function openChart(id) {
    const c = CHARTS.find(x => x.id === id);
    if (!c) return;
    const screen = document.getElementById('s-charts');
    screen.innerHTML = `
      <div class="header" style="position:sticky;top:0;z-index:10;background:var(--bg)">
        <div style="display:flex;align-items:center;gap:10px">
          <button onclick="ChartsPage.render()" style="background:var(--card);border:none;border-radius:8px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer">
            <i class="ti ti-arrow-left" style="color:var(--text);font-size:16px"></i>
          </button>
          <div>
            <div class="header-logo"><span>${c.name}</span></div>
            <div class="header-sub">${c.sub}</div>
          </div>
        </div>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;padding:0 0 16px 0">
        <iframe
          src="https://s.tradingview.com/widgetembed/?frameElementId=tv_${c.symbol.replace(/[^a-z0-9]/gi,'')}&symbol=${encodeURIComponent(c.symbol)}&interval=15&theme=dark&style=1&locale=br&toolbar_bg=%230A0D14&enable_publishing=false&hide_side_toolbar=0&allow_symbol_change=0&save_image=0&hideideas=1"
          style="width:100%;flex:1;min-height:calc(100vh - 130px);border:none"
          allowtransparency="true"
          scrolling="no"
          frameborder="0">
        </iframe>
      </div>
    `;
  }

  return { render, openChart };

})();
