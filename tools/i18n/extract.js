// けしカスの 英語の 文を ぜんぶ ぬき出す → tools/i18n/strings.json
// つかいかた: リポジトリで python3 -m http.server 8765 を うごかして、node tools/i18n/extract.js tools/i18n/strings.json
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(800);
  const out = await p.evaluate(() => {
    const seen = new Set(), text = new Set();
    const walk = (o, depth) => {
      if (!o || typeof o !== 'object' || seen.has(o) || depth > 8) return;
      if (o instanceof Node) return;
      seen.add(o);
      if ('ja' in o && 'en' in o) {
        if (typeof o.en === 'string') text.add(o.en);
        else if (Array.isArray(o.en)) o.en.forEach(x => typeof x === 'string' && text.add(x));
      }
      for (const k of Object.keys(o)) { if (k === 'state' || k === 'rt' || k === 'i18n' || k === 'i18nText') continue; try { walk(o[k], depth + 1); } catch (e) {} }
    };
    walk(K, 0);
    text.delete('');
    return { ui: K.i18n.en, text: [...text].sort() };
  });
  require('fs').writeFileSync(process.argv[2] || 'strings.json', JSON.stringify(out, null, 1));
  console.log('ui keys', Object.keys(out.ui).length, 'texts', out.text.length, 'chars', out.text.join('').length + Object.values(out.ui).join('').length);
  await b.close();
})();
