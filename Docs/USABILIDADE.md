# USABILIDADE.md — Panorama Trade

> Documento de fluxos de UX e usabilidade. Atualizar após cada implementação.

---

## Status atual: PRÉ-DESENVOLVIMENTO

---

## Princípios de Design

- **Mobile-first:** telas de 375px a 430px como referência principal
- **Toque fácil:** botões mínimo 44px de altura (padrão iOS)
- **Fonte mínima:** 11px em labels, 13px em textos de leitura
- **Sem zoom:** toda função acessível sem precisar dar zoom
- **Dark mode:** único tema, fundo escuro (#0A0D14)
- **Velocidade:** interface deve responder imediatamente ao toque

---

## Navegação

```
[Panorama] [Calendário] [Diário] [Checklist] [Gráficos]
         ← Bottom navigation bar fixa →
```

- Navegação inferior fixa, sempre visível
- Ícone + label em cada botão
- Ativo destacado em dourado (#F0C860)

---

## Fluxos por Tela

### Tela 1 — Panorama (Home)
```
Abre o app
  ↓
Vê relógio JST em tempo real
  ↓
Vê horário de abertura NY + countdown
  ↓
Vê cotações XAU/USD, NASDAQ, Dow Jones (live)
  ↓
Vê eventos do dia (ordenados por horário)
  ↓
Vê resumo do dia + alertas por ativo
```

### Tela 2 — Calendário
```
Toca em "Calendário"
  ↓
Vê lista de eventos (todos / alto impacto / hoje)
  ↓
Toca em "+ Evento"
  ↓
Preenche formulário (nome, moeda, impacto, horário, data, anterior, previsão, descrição)
  ↓
Salva → evento aparece na lista e na tela Panorama
```

### Tela 3 — Diário
```
Toca em "Diário"
  ↓
Escolhe ativo (XAU/USD | NASDAQ | Dow Jones)
  ↓
Vê panorama do ativo + gráfico TradingView
  ↓
Toca em "Registrar Operação"
  ↓
Preenche formulário (tipo, horário, entrada, lote, SL, TP, resultado, pips, estratégia, emoção, análise)
  ↓
Salva → aparece no histórico do ativo
```

### Tela 4 — Checklist
```
Toca em "Checklist"
  ↓
Marca/desmarca fatores de risco (pontuação automática)
  ↓
Responde 8 perguntas de disciplina
  ↓
Toca em "Avaliar"
  ↓
Recebe resultado: ✅ Operar | ⚠️ Cuidado | 🚫 Aguardar
```

### Tela 5 — Gráficos
```
Toca em "Gráficos"
  ↓
Vê 3 gráficos TradingView (XAU/USD, NASDAQ, Dow Jones)
  ↓
Pode interagir com cada gráfico (zoom, scroll, timeframe)
```

---

## Componentes de Interface

| Componente | Descrição |
|-----------|-----------|
| Event Row | Card de evento com barra colorida de impacto à esquerda |
| Quote Widget | Widget TradingView com preço live + variação |
| Asset Button | Botão grande para seleção de ativo no Diário |
| Trade Item | Card de operação no histórico com resultado colorido |
| Check Box | Checkbox customizado verde ao marcar |
| Risk Badge | Badge colorido de classificação de risco |
| Modal | Painel deslizante de baixo para cima para formulários |

---

## Cores de Feedback Visual

| Situação | Cor |
|---------|-----|
| Lucro / positivo | Verde #27C97A |
| Prejuízo / negativo | Vermelho #E84545 |
| Alerta / atenção | Laranja #F0952A |
| Alto impacto | Vermelho #E84545 |
| Médio impacto | Laranja #F0952A |
| Baixo impacto | Cinza #4D5A80 |

---

*Última atualização: Setup inicial*
