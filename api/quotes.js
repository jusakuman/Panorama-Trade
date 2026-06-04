export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const symbols = ['XAUUSD=X', 'NQ=F', 'YM=F'];
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbols.join(',')}?interval=1m&range=1d`;

  try {
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        const r = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0',
              'Accept': 'application/json'
            }
          }
        );
        if (!r.ok) throw new Error(`Erro ${symbol}: ${r.status}`);
        const data = await r.json();
        const meta = data.chart.result[0].meta;
        return {
          symbol,
          price: meta.regularMarketPrice,
          prev:  meta.previousClose,
          change: meta.regularMarketPrice - meta.previousClose,
          pct:   ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100
        };
      })
    );

    res.setHeader('Cache-Control', 's-maxage=25, stale-while-revalidate');
    res.status(200).json({ ok: true, data: results });

  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
