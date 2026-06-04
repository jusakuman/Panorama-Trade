const DiaryPage = (() => {

  let _currentAsset = null;

  function render(state) {
    _currentAsset = null;
    const screen = document.getElementById('s-diary');
    if (!screen) return;
    screen.innerHTML = `
      <div class="header">
        <div>
          <div class="header-logo">Diario de <span>Trading</span></div>
          <div class="header-sub">Selecione um ativo</div>
        </div>
      </div>
      <div style="padding-top:10px">
        <div style="margin:0 16px 13px;padding:11px 13px;background:var(--card);border:1px solid var(--border);border-radius:var(--radius);font-size:12px;color:var(--text3);line-height:1.6">
          Selecione um ativo para ver o panorama, grafico e registrar operacoes.
        </div>
        ${Object.entries(Diary.ASSETS).map(([key, a]) => `
          <div class="asset-big" onclick="DiaryPage.openAsset('${key}')">
            <div class="ab-icon ${a.iconClass}">${a.icon}</div>
            <div class="ab-body">
              <div class="ab-name">${a.name}</div>
              <div class="ab-sub">${_countLabel(state, key)}</div>
            </div>
            <i class="ti ti-chevron-right" style="color:var(--text3)"></i>
          </div>
        `).join('')}
        <div class="spacer"></div>
      </div>
    `;
  }

  function _countLabel(state, key) {
    const n = Diary.countTrades(state, key);
    return n > 0 ? n + ' operacao' + (n > 1 ? 'es' : '') + ' registrada' + (n > 1 ? 's' : '') : 'Panorama - Grafico - Operacoes';
  }

  function openAsset(key) {
    _currentAsset = key;
    const state = App.getState();
    const a = Diary.ASSETS[key];
    const screen = document.getElementById('s-diary');
    if (!screen) return;

    screen.innerHTML = `
      <div class="header">
        <div style="display:flex;align-items:center;gap:8px;width:100%">
          <button class="btn-back" onclick="DiaryPage.render(App.getState())">
            <i class="ti ti-arrow-left"></i> Voltar
          </button>
          <div style="font-size:14px;font-weight:600;flex:1">${a.shortName}</div>
          <span class="risk-badge ${a.risk}">${a.riskText}</span>
        </div>
      </div>

      <div class="sec-label">Panorama</div>
      <div class="summary-card">
        <div class="summary-text">${a.panorama}</div>
      </div>

      <div class="chart-box">
        <div class="chart-hdr">
          <div class="chart-title">${a.name}</div>
          <div class="live-tag"><div class="live-dot"></div>Live</div>
        </div>
        <iframe src="${Diary.getTVUrl(key)}"
          style="width:100%;height:210px;border:none"
          allowtransparency="true" frameborder="0" scrolling="no"></iframe>
      </div>

      <div style="padding:0 16px;margin-bottom:10px">
        <button class="btn-primary" onclick="App.openModal('modal-trade')">
          <i class="ti ti-plus"></i> Registrar Operacao
        </button>
      </div>

      <div class="sec-label">Historico</div>
      <div id="trade-history"></div>
      <div class="spacer"></div>
    `;

    _renderHistory(state, key);
    const titleEl = document.getElementById('trade-modal-title');
    if (titleEl) titleEl.textContent = 'Nova Operacao - ' + a.shortName;
  }

  function _renderHistory(state, key) {
    const trades = (state.trades[key] || []).slice().reverse();
    const el = document.getElementById('trade-history');
    if (!el) return;
    if (!trades.length) {
      el.innerHTML = '<div class="empty">Nenhuma operacao registrada ainda.<br>Toque em Registrar Operacao.</div>';
      return;
    }
    el.innerHTML = trades.map(t => Diary.renderTradeItem(t)).join('');
  }

  function saveTrade() {
    if (!_currentAsset) return;
    const state = App.getState();
    const formData = {
      type:   document.getElementById('tr-type').value,
      time:   document.getElementById('tr-time').value,
      entry:  document.getElementById('tr-entry').value,
      lot:    document.getElementById('tr-lot').value,
      sl:     document.getElementById('tr-sl').value,
      tp:     document.getElementById('tr-tp').value,
      result: document.getElementById('tr-result').value,
      pips:   document.getElementById('tr-pips').value,
      strat:  document.getElementById('tr-strat').value,
      emo:    document.getElementById('tr-emo').value,
      note:   document.getElementById('tr-note').value
    };
    Diary.addTrade(state, _currentAsset, formData);
    App.setState(state);
    App.closeModal('modal-trade');
    ['tr-entry','tr-lot','tr-sl','tr-tp','tr-result','tr-pips','tr-note'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    _renderHistory(state, _currentAsset);
  }

  function getCurrentAsset() { return _currentAsset; }

  return { render, openAsset, saveTrade, getCurrentAsset };
})();
