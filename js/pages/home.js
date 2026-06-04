/* ═══════════════════════════════════════════════════
   PANORAMA TRADE — js/pages/home.js
   Tela Panorama do Dia.
   Leitura obrigatória: CLAUDE.md antes de editar.
════════════════════════════════════════════════════ */

const HomePage = (() => {

  function render(state) {
    const screen = document.getElementById('s-home');
    screen.innerHTML = `
      <div class="header">
        <div>
          <div class="header-logo">Panorama <span>Trade</span></div>
          <div class="header-sub">Briefing antes de Nova York</div>
        </div>
        <div class="header-time">
          <div class="time" id="clock">--:--:--</div>
          <div class="label">Japão (JST)</div>
        </div>
      </div>

      <div class="opening-card">
        <div>
          <div class="oc-label">Abertura de Nova York</div>
          <div class="oc-time" id="open-time">--:--</div>
          <div class="oc-dst" id="open-dst">Calculando...</div>
        </div>
        <div class="oc-right">
          <div class="oc-clabel">Faltam</div>
          <div class="oc-countdown" id="countdown">--h --m --s</div>
        </div>
      </div>

      <div style="margin:0 16px 12px">
        <div class="block-header">
          <div class="block-title">
            <i class="ti ti-activity" style="font-size:13px"></i>
            Cotações em Tempo Real
          </div>
          <div class="live-badge">
            <div class="live-dot"></div>
            Live · TradingView
          </div>
        </div>
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;overflow:hidden">
          <div class="tradingview-widget-container">
            <div class="tradingview-widget-container__widget"></div>
            <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js" async>
            {
              "title": "",
              "locale": "br",
              "colorTheme": "dark",
              "isTransparent": true,
              "showSymbolLogo": false,
              "width": "100%",
              "height": "auto",
              "gridLineColor": "rgba(42,48,80,1)",
              "symbolActiveColor": "rgba(28,34,53,1)",
              "tabs": [
                {
                  "title": "Meus Ativos",
                  "symbols": [
                    { "s": "OANDA:XAUUSD", "d": "XAU/USD — Ouro" },
                    { "s": "NASDAQ:NDX",   "d": "NASDAQ — NAS100" },
                    { "s": "DJ:DJI",       "d": "Dow Jones — US30" }
                  ]
                },
                {
                  "title": "Referências",
                  "symbols": [
                    { "s": "TVC:DXY",    "d": "DXY — Dólar Index" },
                    { "s": "TVC:US10Y",  "d": "US10Y — Juros" },
                    { "s": "NYMEX:CL1!", "d": "WTI — Petróleo" }
                  ]
                }
              ]
            }
            </script>
          </div>
        </div>
      </div>

      <div style="margin:0 16px 12px">
        <div class="block-header" style="margin-bottom:8px">
          <div class="block-title">
            <i class="ti ti-calendar-event" style="font-size:12px"></i>
            Eventos de Hoje
          </div>
          <div style="font-size:10px;color:var(--text3)" id="ev-date-label"></div>
        </div>
        <div id="home-events"></div>
      </div>

      <div class="next-ban" id="next-ban" style="display:none">
        <div class="nb-dot"></div>
        <div class="nb-text" id="next-ban-text"></div>
      </div>

      <div class="sec-label">Resumo do Dia</div>
      <div class="summary-card">
        <div class="summary-text" id="home-summary">
          Acompanhe os eventos acima antes de operar. Evite entrar em posição nos 15 minutos antes e após cada evento de alto impacto.
        </div>
        <div style="margin-top:8px;display:flex;gap:5px;flex-wrap:wrap" id="home-tags"></div>
      </div>

      <div class="sec-label">Alertas por Ativo</div>
      <div style="padding:0 16px;margin-bottom:14px">
        <div class="asset-alert-card">
          <div class="asset-icon gold-i">Au</div>
          <div class="ac-body">
            <div class="ac-name">XAU/USD — Ouro</div>
            <div class="ac-alert">Acompanhe o DXY. Alta do dólar pressiona ouro para baixo.</div>
          </div>
          <div class="badge bm">Médio</div>
        </div>
        <div class="asset-alert-card">
          <div class="asset-icon nas-i">NQ</div>
          <div class="ac-body">
            <div class="ac-name">NASDAQ — NAS100</div>
            <div class="ac-alert">Tecnologia em foco. Volatilidade esperada na abertura.</div>
          </div>
          <div class="badge bm">Médio</div>
        </div>
        <div class="asset-alert-card">
          <div class="asset-icon dow-i">DJ</div>
          <div class="ac-body">
            <div class="ac-name">Dow Jones — US30</div>
            <div class="ac-alert">Blue chips estáveis. Sem catalisadores específicos.</div>
          </div>
          <div class="badge bl">Baixo</div>
        </div>
      </div>

      <div class="spacer"></div>
    `;

    _renderEvents(state);
  }

  function _renderEvents(state) {
    const evs      = Events.getToday(state);
    const listEl   = document.getElementById('home-events');
    const banEl    = document.getElementById('next-ban');
    const banText  = document.getElementById('next-ban-text');
    const summaryEl= document.getElementById('home-summary');
    const tagsEl   = document.getElementById('home-tags');
    const dateEl   = document.getElementById('ev-date-label');

    if (dateEl) {
      dateEl.textContent = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'Asia/Tokyo',
        weekday: 'long', day: 'numeric', month: 'long'
      }).format(new Date());
    }

    if (!listEl) return;

    if (!evs.length) {
      listEl.innerHTML = '<div class="empty">Nenhum evento cadastrado para hoje.<br>Vá em Calendário e adicione.</div>';
      if (banEl) banEl.style.display = 'none';
      return;
    }

    listEl.innerHTML = evs.map(e => Events.renderRow(e)).join('');

    const nextHigh = Events.getNextHigh(state);
    if (nextHigh && banEl && banText) {
      banEl.style.display = 'flex';
      banText.innerHTML = 'Próximo alto impacto: <strong>' + nextHigh.name + '</strong> às <strong>' + nextHigh.time + ' JST</strong>';
    } else if (banEl) {
      banEl.style.display = 'none';
    }

    const highCount = evs.filter(e => e.impact === 'high').length;
    if (tagsEl) {
      tagsEl.innerHTML = highCount
        ? `<span style="background:rgba(232,69,69,.1);color:var(--red);font-size:10px;padding:2px 7px;border-radius:4px;font-weight:500">${highCount} evento${highCount > 1 ? 's' : ''} de alto impacto</span>`
        : '';
    }

    if (summaryEl && highCount > 0) {
      const names = evs.filter(e => e.impact === 'high').map(e => e.name).join(', ');
      summaryEl.textContent = 'Atenção: ' + names + '. Eventos de alto impacto geram volatilidade intensa. Evite entrar nos 15 min antes e após. Reduza o lote se necessário.';
    }
  }

  return { render };

})();
