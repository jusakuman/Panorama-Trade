export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const [xauRes, nasRes, us30Res] = await Promise.all([
      fetch('https://api.gold-api.com/price/XAU'),
      fetch('https://stooq.com/q/l/?s=^ndx&f=sd2t2ohlcv&h&e=csv'),
      fetch('https://stooq.com/q/l/?s=^dji&f=sd2t2ohlcv&h&e=csv')
    ]);

    const xauData = await xauRes.json();
    const nasCsv = await nasRes.text();
    const us30Csv = await us30Res.text();

    function parseCsv(csv) {
      const lines = csv.trim().split('\n');
      const headers = lines[0].split(',');
      const values = lines[1].split(',');
      const obj = {};
      headers.forEach((h, i) => { obj[h.trim()] = values[i] ? values[i].trim() : null; });
      return obj;
    }

    const nas = parseCsv(nasCsv);
    const us30 = parseCsv(us30Csv);

    const nasClose = parseFloat(nas.Close);
    const nasOpen = parseFloat(nas.Open);
    const us30Close = parseFloat(us30.Close);
    const us30Open = parseFloat(us30.Open);

    const results = [
      {
        id: 'xau',
        name: 'XAU/USD',
        sub: 'Ouro',
        price: xauData.price,
        change: xauData.ch,
        pct: xauData.chp
      },
      {
        id: 'nas',
        name: 'NAS100',
        sub: 'NASDAQ 100',
        price: nasClose,
        change: nasClose - nasOpen,
        pct: ((nasClose - nasOpen) / nasOpen) * 100
      },
      {
        id: 'us30',
        name: 'US30',
        sub: 'Dow Jones',
        price: us30Close,
        change: us30Close - us30Open,
        pct: ((us30Close - us30Open) / us30Open) * 100
      }
    ];

    res.setHeader('Cache-Control', 's-maxage=25, stale-while-revalidate');
    res.status(200).json({ ok: true, data: results });

  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
