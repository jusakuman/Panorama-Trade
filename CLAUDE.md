# CLAUDE.md — Memória e Regras do Projeto Panorama Trade

> Este arquivo deve ser lido ANTES de qualquer ação, planejamento ou implementação.
> Sem exceção. Sempre consulte aqui primeiro.

---

## 1. SOBRE O PROJETO

- **Nome:** Panorama Trade
- **Subtítulo:** Seu briefing antes da abertura de Nova York
- **Objetivo:** Web app de apoio a traders que operam Forex/CFDs a partir do Japão
- **Público:** Trader individual, operando XAU/USD, NASDAQ (NAS100) e Dow Jones (US30)
- **Foco de horário:** Abertura de Nova York — 22:30 JST (verão EUA) ou 23:30 JST (inverno EUA)
- **Plataforma alvo:** Mobile-first, uso no celular antes de operar

---

## 2. REGRAS DE COMPORTAMENTO DO CLAUDE

### 2.1 Antes de qualquer coisa
- [ ] Ler este arquivo CLAUDE.md completamente
- [ ] Verificar a arquitetura atual em `docs/ARQUITETURA.md`
- [ ] Verificar a usabilidade atual em `docs/USABILIDADE.md`
- [ ] Nunca agir no achismo — se houver dúvida, PERGUNTAR antes
- [ ] Nunca implementar sem aprovação explícita

### 2.2 Durante o planejamento
- Apresentar um plano em fases claras antes de qualquer código
- Identificar e informar CUSTOS de APIs, bibliotecas ou serviços pagos
- Priorizar soluções GRATUITAS, confiáveis e seguras
- Sugerir melhorias quando identificar algo importante que foi esquecido
- Levantar riscos de segurança com base no OWASP Top 10

### 2.3 Durante a execução
- Mostrar o que será feito ANTES de fazer
- Pedir aprovação a cada fase
- Nunca pular etapas ou implementar além do aprovado
- Após cada implementação: atualizar ARQUITETURA.md e USABILIDADE.md

### 2.4 Segurança (referência: OWASP Top 10)
- Validar e sanitizar todos os inputs do usuário
- Nunca expor dados sensíveis em localStorage sem necessidade
- Evitar uso de eval() ou innerHTML com dados do usuário sem sanitização
- Usar Content Security Policy (CSP) quando possível
- Se o usuário sugerir algo inseguro, apontar o risco e sugerir alternativa segura

### 2.5 Mobile-first obrigatório
- Todo componente deve ser testado visualmente para telas de 375px–430px
- Nunca usar fontes menores que 11px em elementos interativos
- Botões com altura mínima de 44px (padrão iOS)
- Sem necessidade de zoom para usar qualquer função
- Navegação inferior fixa (bottom nav)

---

## 3. STACK TÉCNICA DECIDIDA

| Item | Decisão |
|------|---------|
| Linguagem | HTML + CSS + JavaScript puro (sem framework) |
| Estilo | CSS custom properties, mobile-first |
| Dados | localStorage (MVP) |
| Gráficos | TradingView Widgets (gratuito) |
| Cotações | TradingView Market Quotes Widget (gratuito) |
| Ícones | Tabler Icons (CDN, gratuito) |
| Fontes | DM Sans + DM Mono (Google Fonts, gratuito) |
| Editor | VS Code + Live Server |
| Custo atual | R$ 0,00 |

---

## 4. ARQUITETURA DE ARQUIVOS

```
panorama-trade/
├── CLAUDE.md                  ← Este arquivo (ler sempre primeiro)
├── index.html                 ← Entry point, estrutura base + nav
├── css/
│   └── style.css              ← Estilos globais, variáveis, componentes
├── js/
│   ├── storage.js             ← Abstração do localStorage
│   ├── clock.js               ← Relógio JST e countdown NY
│   ├── events.js              ← Lógica de eventos econômicos
│   ├── diary.js               ← Lógica do diário de trading
│   ├── checklist.js           ← Lógica do checklist e painel de risco
│   └── app.js                 ← Inicialização e navegação
├── pages/
│   ├── home.js                ← Tela Panorama
│   ├── calendar.js            ← Tela Calendário
│   ├── diary-view.js          ← Tela Diário
│   ├── checklist-view.js      ← Tela Checklist
│   └── charts.js              ← Tela Gráficos
└── docs/
    ├── ARQUITETURA.md         ← Documento técnico de arquitetura
    └── USABILIDADE.md         ← Documento de fluxos e UX
```

---

## 5. DESIGN SYSTEM

### Cores
```css
--bg: #0A0D14          /* Fundo principal */
--bg2: #111520         /* Fundo secundário */
--bg3: #181D2B         /* Fundo cards internos */
--card: #1C2235        /* Cards */
--border: #2A3050      /* Bordas */
--text: #E8ECF5        /* Texto principal */
--text2: #8B97C0       /* Texto secundário */
--text3: #4D5A80       /* Texto terciário / labels */
--gold2: #F0C860       /* Dourado (destaques) */
--green: #27C97A       /* Lucro / positivo */
--red: #E84545         /* Prejuízo / alto risco / venda */
--orange: #F0952A      /* Alerta / risco médio */
--blue: #4A8EF5        /* NASDAQ */
--accent: #5B7FFF      /* Botões primários */
```

### Impacto de Eventos
- 🔴 **Alto** — barra e ponto vermelho, badge `lh`
- 🟡 **Médio** — barra e ponto laranja, badge `lm`
- ⚪ **Baixo** — barra e ponto cinza, badge `ll`

### Risco do Dia (pontuação)
| Pontos | Classificação |
|--------|--------------|
| 0–2 | 🟢 Baixo |
| 3–5 | 🟡 Médio |
| 6–8 | 🔴 Alto |
| 9+ | 💀 Extremo |

---

## 6. ATIVOS MONITORADOS

| Ativo | Símbolo TV | Ícone | Cor |
|-------|-----------|-------|-----|
| XAU/USD | OANDA:XAUUSD | Au | Dourado |
| NASDAQ | NASDAQ:NDX | NQ | Azul |
| Dow Jones | DJ:DJI | DJ | Verde |

---

## 7. TELAS DO APP

| # | Tela | Descrição |
|---|------|-----------|
| 1 | Panorama | Relógio JST, countdown NY, cotações live, eventos do dia, resumo, alertas |
| 2 | Calendário | Cadastro manual de eventos econômicos com filtros |
| 3 | Diário | Seleção de ativo → panorama + gráfico TV + registro de operação + histórico |
| 4 | Checklist | 8 perguntas de disciplina + painel de risco manual pontuado |
| 5 | Gráficos | Widgets TradingView para os 3 ativos |

---

## 8. INTEGRAÇÕES ATUAIS (MVP)

| Serviço | Uso | Custo |
|---------|-----|-------|
| TradingView Widgets | Gráficos + cotações em tempo real | Gratuito |
| Google Fonts | DM Sans + DM Mono | Gratuito |
| Tabler Icons CDN | Ícones de interface | Gratuito |
| localStorage | Persistência de dados local | Gratuito |

---

## 9. INTEGRAÇÕES FUTURAS PLANEJADAS

| Serviço | Finalidade | Status |
|---------|-----------|--------|
| API Calendário Econômico | Eventos automáticos | Pendente — avaliar custo |
| API Notícias Financeiras | Resumo automático | Pendente — avaliar custo |
| Importação MT5 (CSV) | Histórico de operações | Planejado |
| Sincronização MT5 via EA | Operações automáticas | Futuro |

---

## 10. CHECKLIST PÓS-IMPLEMENTAÇÃO

Após qualquer implementação, verificar:
- [ ] Funciona corretamente no mobile (375px)?
- [ ] Dados salvos corretamente no localStorage?
- [ ] Sem erros no console do browser?
- [ ] Inputs sanitizados?
- [ ] ARQUITETURA.md atualizado?
- [ ] USABILIDADE.md atualizado?

---

*Última atualização: início do projeto — fase de setup*
*Próximo passo: criar estrutura de arquivos no VS Code*
