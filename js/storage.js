/* ═══════════════════════════════════════════════════
   PANORAMA TRADE — js/storage.js
   Camada de acesso ao localStorage.
   Leitura obrigatória: CLAUDE.md antes de editar.
════════════════════════════════════════════════════ */

const Storage = (() => {

  const KEY = 'pt_v1';

  /* ─── Dados iniciais do app ─── */
  function getDefault() {
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });
    return {
      events: [
        {
          id: 1,
          name: 'ADP Non-Farm Employment Change',
          curr: 'USD',
          impact: 'high',
          time: '21:15',
          date: today,
          prev: '167K',
          fore: '175K',
          result: '',
          desc: 'Precursor do NFP. USD forte = XAU/USD desce, índices voláteis.'
        },
        {
          id: 2,
          name: 'ISM Services PMI',
          curr: 'USD',
          impact: 'high',
          time: '23:00',
          date: today,
          prev: '51.6',
          fore: '51.0',
          result: '',
          desc: 'Acima do esperado reforça o dólar. Atenção total na abertura de NY.'
        },
        {
          id: 3,
          name: 'FOMC Member Barr Speaks',
          curr: 'USD',
          impact: 'med',
          time: '22:00',
          date: today,
          prev: '',
          fore: '',
          result: '',
          desc: 'Comentários sobre política monetária. Pode mover o dólar.'
        }
      ],
      trades: {
        gold: [],
        nas:  [],
        dow:  []
      },
      checkState:  {},
      riskFactors: {}
    };
  }

  /* ─── Lê o estado completo ─── */
  function get() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return getDefault();
      const parsed = JSON.parse(raw);
      // Garante que as chaves essenciais existem
      if (!parsed.events)      parsed.events      = [];
      if (!parsed.trades)      parsed.trades      = { gold: [], nas: [], dow: [] };
      if (!parsed.checkState)  parsed.checkState  = {};
      if (!parsed.riskFactors) parsed.riskFactors = {};
      return parsed;
    } catch (e) {
      console.warn('[Storage] Erro ao ler localStorage. Usando dados padrão.', e);
      return getDefault();
    }
  }

  /* ─── Salva o estado completo ─── */
  function save(state) {
    try {
      if (!state || typeof state !== 'object') {
        console.warn('[Storage] Estado inválido. Nada foi salvo.');
        return false;
      }
      localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      console.warn('[Storage] Erro ao salvar no localStorage.', e);
      return false;
    }
  }

  /* ─── Limpa tudo (uso futuro / reset) ─── */
  function clear() {
    try {
      localStorage.removeItem(KEY);
      return true;
    } catch (e) {
      console.warn('[Storage] Erro ao limpar localStorage.', e);
      return false;
    }
  }

  /* ─── API pública ─── */
  return { get, save, clear, getDefault };

})();