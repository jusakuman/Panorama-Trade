# ARQUITETURA.md — Panorama Trade

> Documento técnico de arquitetura. Atualizar após cada implementação.

---

## Status atual: PRÉ-DESENVOLVIMENTO (Setup inicial)

---

## Visão Geral

Aplicação web estática, sem backend, rodando 100% no browser do usuário.
Dados persistidos localmente via localStorage. Gráficos e cotações via widgets TradingView.

## Estrutura de Arquivos

```
panorama-trade/
├── CLAUDE.md
├── index.html
├── css/style.css
├── js/
│   ├── storage.js
│   ├── clock.js
│   ├── events.js
│   ├── diary.js
│   ├── checklist.js
│   └── app.js
├── pages/
│   ├── home.js
│   ├── calendar.js
│   ├── diary-view.js
│   ├── checklist-view.js
│   └── charts.js
└── docs/
    ├── ARQUITETURA.md
    └── USABILIDADE.md
```

## Fluxo de dados

```
Usuário
  ↓ interage
app.js (navegação / init)
  ↓ chama
pages/*.js (lógica de cada tela)
  ↓ usa
js/*.js (módulos: storage, clock, events, diary, checklist)
  ↓ persiste
localStorage (chave: pt_v1)
```

## Módulos implementados

| Módulo | Arquivo | Status |
|--------|---------|--------|
| Estrutura base | index.html | ⏳ Pendente |
| Estilos globais | css/style.css | ⏳ Pendente |
| Storage | js/storage.js | ⏳ Pendente |
| Relógio/Countdown | js/clock.js | ⏳ Pendente |
| Eventos econômicos | js/events.js | ⏳ Pendente |
| Diário de trading | js/diary.js | ⏳ Pendente |
| Checklist/Risco | js/checklist.js | ⏳ Pendente |
| App / Navegação | js/app.js | ⏳ Pendente |
| Tela Panorama | pages/home.js | ⏳ Pendente |
| Tela Calendário | pages/calendar.js | ⏳ Pendente |
| Tela Diário | pages/diary-view.js | ⏳ Pendente |
| Tela Checklist | pages/checklist-view.js | ⏳ Pendente |
| Tela Gráficos | pages/charts.js | ⏳ Pendente |

---

*Última atualização: Setup inicial*
