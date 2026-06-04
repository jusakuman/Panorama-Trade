const ChecklistPage = (() => {

  function render(state) {
    const screen = document.getElementById('s-check');
    if (!screen) return;
    screen.innerHTML = `
      <div class="header">
        <div>
          <div class="header-logo">Checklist <span>Pre-trade</span></div>
          <div class="header-sub">Disciplina antes de entrar</div>
        </div>
      </div>
      <div style="height:10px"></div>
      <div class="score-card">
        <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:9px">Painel de Risco Manual</div>
        <div class="score-hdr">
          <div><div style="font-size:10px;color:var(--text3);margin-bottom:3px">Classificacao</div><span class="risk-badge rmed" id="risk-lbl">-</span></div>
          <div class="score-num" id="risk-score" style="color:var(--orange)">0</div>
        </div>
        <div class="bar-bg"><div class="bar-fill" id="risk-bar" style="width:0%;background:var(--orange)"></div></div>
        <div id="risk-factors"></div>
      </div>
      <div class="sec-label">Perguntas de Disciplina</div>
      <div class="summary-card" style="padding:0"><div id="checklist-items"></div></div>
      <div style="padding:10px 16px 0">
        <button class="btn-primary" onclick="ChecklistPage.evaluate()">Avaliar Checklist</button>
        <button class="btn-secondary" style="margin-top:8px" onclick="ChecklistPage.reset()">Limpar</button>
      </div>
      <div id="check-result" style="display:none;padding:11px 16px 0"></div>
      <div class="spacer"></div>
    `;
    _renderFactors(state);
    _renderQuestions(state);
  }

  function _renderFactors(state) {
    const el = document.getElementById('risk-factors');
    if (!el) return;
    el.innerHTML = Checklist.FACTORS.map(f => `
      <div class="factor-row ${state.riskFactors[f.id] ? 'factive' : ''}">
        <div class="fcheck" onclick="ChecklistPage.toggleFactor('${f.id}')">
          ${state.riskFactors[f.id] ? '<i class="ti ti-check" style="font-size:10px;color:white"></i>' : ''}
        </div>
        <div class="ftext">${f.text}</div>
        <div class="fpts">+${f.pts}pts</div>
      </div>`).join('');
    _updateScore(state);
  }

  function _renderQuestions(state) {
    const el = document.getElementById('checklist-items');
    if (!el) return;
    el.innerHTML = Checklist.QUESTIONS.map(q => `
      <div class="check-item">
        <div class="cbox ${state.checkState[q.id] ? 'checked' : ''}"
          onclick="ChecklistPage.toggleCheck('${q.id}',this)">
          ${state.checkState[q.id] ? '<i class="ti ti-check" style="font-size:12px;color:white"></i>' : ''}
        </div>
        <div class="ctext">${q.q}</div>
      </div>`).join('');
  }

  function _updateScore(state) {
    const score = Checklist.calcScore(state.riskFactors);
    const risk  = Checklist.classifyRisk(score);
    const scoreEl = document.getElementById('risk-score');
    const lblEl   = document.getElementById('risk-lbl');
    const barEl   = document.getElementById('risk-bar');
    if (scoreEl) { scoreEl.textContent = score; scoreEl.style.color = risk.color; }
    if (lblEl)   { lblEl.className = 'risk-badge ' + risk.cls; lblEl.textContent = risk.label; }
    if (barEl)   { barEl.style.width = risk.w + '%'; barEl.style.background = risk.color; }
  }

  function toggleFactor(id) {
    const state = App.getState();
    Checklist.toggleFactor(state, id);
    App.setState(state);
    _renderFactors(state);
  }

  function toggleCheck(id, el) {
    const state = App.getState();
    Checklist.toggleCheck(state, id);
    App.setState(state);
    el.classList.toggle('checked');
    el.innerHTML = state.checkState[id] ? '<i class="ti ti-check" style="font-size:12px;color:white"></i>' : '';
  }

  function evaluate() {
    const state  = App.getState();
    const result = Checklist.evaluate(state.checkState);
    const el     = document.getElementById('check-result');
    if (!el) return;
    el.style.display = 'block';
    el.innerHTML = `<div style="background:${result.bg};border-radius:var(--radius);padding:14px;text-align:center">
      <div style="font-size:22px;margin-bottom:5px">${result.icon}</div>
      <div style="font-size:14px;font-weight:600;margin-bottom:3px">${result.title}</div>
      <div style="font-size:12px;color:var(--text3)">${result.sub}</div>
    </div>`;
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function reset() {
    const state = App.getState();
    Checklist.reset(state);
    App.setState(state);
    render(state);
  }

  return { render, toggleFactor, toggleCheck, evaluate, reset };
})();
