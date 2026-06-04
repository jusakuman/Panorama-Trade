const ChartsPage = (() => {

  const CHARTS = [
    { name: 'XAU/USD - Ouro',   symbol: 'OANDA:XAUUSD'    },
    { name: 'NASDAQ - NAS100',  symbol: 'CAPITALCOM:US100' },
    { name: 'Dow Jones - US30', symbol: 'CAPITALCOM:US30'  }
  ];

  function render() {
    const screen = document.getElementById('s-charts');
    if (!screen) return;
    screen.innerHTML = `
      <div class="header">
        <div>
          <div class="header-logo"><span>Graficos</span></div>
          <div class="header-sub">XAU/USD - NASDAQ - Dow Jones</div>
        </div>
      </div>
      <div style="height:10px"></div>
      ${CHARTS.map(c => `
        <div style="padding:0 16px;margin-bottom:12px">
          <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px">${c.name}</div>
          <div style="border-radius:var(--radius);overflow:hidden;border:1px solid var(--border)">
            <iframe src="https://s.tradingview.com/widgetembed/?frameElementId=tv_${c.symbol.replace(/[^a-z0-9]/gi,'')}&symbol=${encodeURIComponent(c.symbol)}&interval=15&theme=dark&style=1&locale=br&toolbar_bg=%230A0D14&enable_publishing=false&hide_side_toolbar=1&allow_symbol_change=0&save_image=0&hideideas=1"
              style="width:100%;height:220px;border:none" allowtransparency="true" scrolling="no" frameborder="0"></iframe>
          </div>
        </div>`).join('')}
      <div class="spacer"></div>
    `;
  }

  return { render };
})();
