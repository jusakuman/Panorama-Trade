const Storage = (() => {
  const KEY = 'pt_v1';

  function getDefault() {
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
    return {
      events: [
        { id:1, name:'ADP Non-Farm Employment Change', curr:'USD', impact:'high', time:'21:15', date:today, prev:'167K', fore:'175K', result:'', desc:'Precursor do NFP. USD forte = XAU/USD desce, indices volateis.' },
        { id:2, name:'ISM Services PMI', curr:'USD', impact:'high', time:'23:00', date:today, prev:'51.6', fore:'51.0', result:'', desc:'Acima do esperado reforca o dolar. Atencao total na abertura de NY.' },
        { id:3, name:'FOMC Member Barr Speaks', curr:'USD', impact:'med', time:'22:00', date:today, prev:'', fore:'', result:'', desc:'Comentarios sobre politica monetaria. Pode mover o dolar.' }
      ],
      trades: { gold:[], nas:[], dow:[] },
      checkState: {},
      riskFactors: {}
    };
  }

  function get() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return getDefault();
      const parsed = JSON.parse(raw);
      if (!parsed.events)      parsed.events      = [];
      if (!parsed.trades)      parsed.trades      = { gold:[], nas:[], dow:[] };
      if (!parsed.checkState)  parsed.checkState  = {};
      if (!parsed.riskFactors) parsed.riskFactors = {};
      return parsed;
    } catch(e) {
      console.warn('[Storage] Erro ao ler localStorage.', e);
      return getDefault();
    }
  }

  function save(state) {
    try {
      if (!state || typeof state !== 'object') return false;
      localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch(e) {
      console.warn('[Storage] Erro ao salvar.', e);
      return false;
    }
  }

  function clear() {
    try { localStorage.removeItem(KEY); return true; }
    catch(e) { return false; }
  }

  return { get, save, clear, getDefault };
})();
