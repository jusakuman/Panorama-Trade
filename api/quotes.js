export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const [xauRes, nasRes, us30Res] = await Promise.all([
      fetch('https://stooq.com/q/l/?s=xauusd&f=sd2t2ohlcv&h&e=csv'),
      fetch('https://stooq.com/q/l/?s=^ndx&f=sd2t2ohlcv&h&e=csv'),
      fetch('https://stooq.com/q/l/?s=^dji&f=sd2t2ohlcv&h&e=csv')
    ]);

    const xauCsv  = await xauRes.text();
    const nasCsv  = await nasRes.text();
    const us30Csv = await us30Res.text();

    function parseCsv(csv) {
      const lines = csv.trim().split('\n');
      const headers = lines[0].split(',');
      const values  = lines[1].split(',');
      const obj = {};
      headers.forEach((h, i) => { obj[h.trim()] = values[i] ? values[i].trim() : null; });
      return obj;
    }

    function calc(row, id, name, sub) {
      const close  = parseFloat(row.Close);
      const open   = parseFloat(row.Open);
      const change = close - open;
      const pct    = (change / open) * 100;
      return { id, name, sub, price: close, change, pct };
    }

    const results = [
      calc(parseCsv(xauCsv),   'xau',  'XAU/USD', 'Ouro'),
      calc(parseCsv(nasCsv),   'nas',  'NAS100',  'NASDAQ 100'),
      calc(parseCsv(us30Csv),  'us30', 'US30',    'Dow Jones')
    ];

    res.setHeader('Cache-Control', 's-maxage=25, stale-while-revalidate');
    res.status(200).json({ ok: true, data: results });

  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
