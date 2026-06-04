export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const [xauRes, nasRes, us30Res] = await Promise.all([
      fetch('https://api.gold-api.com/price/XAU'),
      fetch('https://stooq.com/q/l/?s=^ndx&f=sd2t2ohlcv&h&e=json'),
      fetch('https://stooq.com/q/l/?s=^dji&f=sd2t2ohlcv&h&e=json')
    ]);

    const xauData = await xauRes.json();
    const nasData = await nasRes.json();
    const us30Data = await us30Res.json();

    const nasQ = nasData.symbols[0];
    const us30Q = us30Data.symbols[0];

    const results = [
      {
        id: 'xau',
        name: 'XAU/USD',
        sub: 'Ouro',
        price: xauData.price,
        prev: xauData.prev_close_price,
        change: xauData.price - xauData.prev_close_price,
        pct: ((xauData.price - xauData.prev_close_price) / xauData.prev_close_price) * 100
      },
      {
        id: 'nas',
        name: 'NAS100',
        sub: 'NASDAQ 100',
        price: parseFloat(nasQ.Close),
        prev: parseFloat(nasQ.Open),
        change: parseFloat(nasQ.Close) - parseFloat(nasQ.Open),
        pct: ((parseFloat(nasQ.Close) - parseFloat(nasQ.Open)) / parseFloat(nasQ.Open)) * 100
      },
      {
        id: 'us30',
        name: 'US30',
        sub: 'Dow Jones',
        price: parseFloat(us30Q.Close),
        prev: parseFloat(us30Q.Open),
        change: parseFloat(us30Q.Close) - parseFloat(us30Q.Open),
        pct: ((parseFloat(us30Q.Close) - parseFloat(us30Q.Open)) / parseFloat(us30Q.Open)) * 100
      }
    ];

    res.setHeader('Cache-Control', 's-maxage=25, stale-while-revalidate');
    res.status(200).json({ ok: true, data: results });

  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
