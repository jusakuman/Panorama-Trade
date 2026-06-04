const Checklist = (() => {

  const QUESTIONS = [
    { id:'c1', q:'Hoje tem evento de alto impacto?' },
    { id:'c2', q:'A noticia ja saiu e o mercado reagiu?' },
    { id:'c3', q:'O spread esta dentro do normal?' },
    { id:'c4', q:'A direcao da tendencia esta clara?' },
    { id:'c5', q:'Ja defini meu stop loss?' },
    { id:'c6', q:'O lote esta adequado ao risco atual?' },
    { id:'c7', q:'Estou emocionalmente calmo e focado?' },
    { id:'c8', q:'O setup esta dentro do meu plano?' }
  ];

  const FACTORS = [
    { id:'f1', text:'Noticia alto impacto ANTES da abertura', pts:3 },
    { id:'f2', text:'Noticia alto impacto NA abertura',       pts:4 },
    { id:'f3', text:'Payroll ou FOMC hoje',                   pts:5 },
    { id:'f4', text:'Grande variacao ontem (> 1.5%)',          pts:2 },
    { id:'f5', text:'DXY muito forte / juros subindo',         pts:2 },
    { id:'f6', text:'Tensao geopolitica relevante',            pts:2 }
  ];

  function calcScore(riskFactors) {
    return FACTORS.reduce((sum, f) => sum + (riskFactors[f.id] ? f.pts : 0), 0);
  }

  function classifyRisk(score) {
    if (score <= 2) return { cls:'rlow',  label:'Risco Baixo',   color:'var(--green)',  w:15  };
    if (score <= 5) return { cls:'rmed',  label:'Risco Medio',   color:'var(--orange)', w:45  };
    if (score <= 8) return { cls:'rhigh', label:'Risco Alto',    color:'var(--red)',    w:72  };
    return              { cls:'rext',  label:'Risco Extremo', color:'#FF2020',       w:100 };
  }

  function evaluate(checkState) {
    const checked = Object.values(checkState).filter(Boolean).length;
    if (checked >= 7) return { icon:'✅', title:'Operacao dentro do plano', sub:'Condicoes favoraveis. Opere com disciplina.', bg:'rgba(39,201,122,.1)' };
    if (checked >= 5) return { icon:'⚠️', title:'Cuidado - risco elevado', sub:'Reduza o lote e opere com cautela.', bg:'rgba(240,149,42,.1)' };
    return { icon:'🚫', title:'Melhor aguardar', sub:'Condicoes desfavoraveis. Espere melhor setup.', bg:'rgba(232,69,69,.1)' };
  }

  function toggleCheck(state, id) { state.checkState[id] = !state.checkState[id]; Storage.save(state); }
  function toggleFactor(state, id) { state.riskFactors[id] = !state.riskFactors[id]; Storage.save(state); }
  function reset(state) { state.checkState = {}; Storage.save(state); }

  return { QUESTIONS, FACTORS, calcScore, classifyRisk, evaluate, toggleCheck, toggleFactor, reset };
})();
