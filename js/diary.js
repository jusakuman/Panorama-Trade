const Diary = (() => {

  const ASSETS = {
    gold: { name:'XAU/USD - Ouro', shortName:'XAU/USD', icon:'Au', iconClass:'gold-i', risk:'rmed', riskText:'Medio', tvSymbol:'OANDA:XAUUSD', panorama:'Ouro em consolidacao. Acompanhe o DXY. Alta do dolar pressiona XAU/USD para baixo. Verifique os eventos do dia antes de operar.' },
    nas:  { name:'NASDAQ - NAS100', shortName:'NASDAQ', icon:'NQ', iconClass:'nas-i', risk:'rlow', riskText:'Baixo', tvSymbol:'CAPITALCOM:US100', panorama:'NASDAQ com momentum positivo. Setor de tecnologia em foco. Juros americanos estaveis favorecem techs. Atencao a abertura de NY.' },
    dow:  { name:'Dow Jones - US30', shortName:'Dow Jones', icon:'DJ', iconClass:'dow-i', risk:'rlow', riskText:'Baixo', tvSymbol:'CAPITALCOM:US30', panorama:'Dow Jones com fluxo positivo. Blue chips estaveis. Petroleo sem variacao. Sem catalisadores especificos antes da abertura.' }
  };

  function sanitize(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;').trim();
  }

  function addTrade(state, assetKey, formData) {
    if (!state.trades[assetKey]) state.trades[assetKey] = [];
    const trade = {
      id: Date.now(), type: formData.type, time: formData.time,
      entry: parseFloat(formData.entry) || 0, lot: parseFloat(formData.lot) || 0,
      sl: parseFloat(formData.sl) || 0, tp: parseFloat(formData.tp) || 0,
      result: parseFloat(formData.result) || 0, pips: parseFloat(formData.pips) || 0,
      strat: sanitize(formData.strat), emo: sanitize(formData.emo), note: sanitize(formData.note || '')
    };
    state.trades[assetKey].push(trade);
    Storage.save(state);
    return trade;
  }

  function countTrades(state, assetKey) { return (state.trades[assetKey] || []).length; }

  function renderTradeItem(t) {
    const res = parseFloat(t.result || 0);
    const resStr = (res >= 0 ? '+' : '') + '$' + res.toFixed(2);
    return `<div class="trade-item">
      <div class="trade-hdr">
        <span class="trade-type ${t.type === 'buy' ? 'buy' : 'sell'}">${t.type === 'buy' ? '▲ COMPRA' : '▼ VENDA'}</span>
        <span class="trade-result ${res >= 0 ? 'up' : 'dn'}">${resStr}</span>
      </div>
      <div class="trade-grid">
        <div><div class="td-label">Entrada</div><div class="td-val">${t.entry||'--'}</div></div>
        <div><div class="td-label">SL</div><div class="td-val">${t.sl||'--'}</div></div>
        <div><div class="td-label">TP</div><div class="td-val">${t.tp||'--'}</div></div>
        <div><div class="td-label">Lote</div><div class="td-val">${t.lot||'--'}</div></div>
        <div><div class="td-label">Pips</div><div class="td-val">${t.pips||'--'}</div></div>
        <div><div class="td-label">Emocao</div><div class="td-val" style="font-size:10px">${(t.emo||'').split(' ')[0]}</div></div>
      </div>
      ${t.note ? `<div class="trade-note">${t.note}</div>` : ''}
      <div class="trade-meta">${t.time} - ${t.strat}</div>
    </div>`;
  }

  function getTVUrl(assetKey) {
    const sym = encodeURIComponent(ASSETS[assetKey].tvSymbol);
    return `https://s.tradingview.com/widgetembed/?frameElementId=tv_${assetKey}&symbol=${sym}&interval=15&theme=dark&style=1&locale=br&toolbar_bg=%230A0D14&enable_publishing=false&hide_side_toolbar=1&allow_symbol_change=0&save_image=0&hideideas=1`;
  }

  return { ASSETS, addTrade, countTrades, renderTradeItem, getTVUrl, sanitize };
})();
