#!/usr/bin/env python3
# ほんやく JSON の チェック: python3 tools/i18n/check.py es
import json, re, sys, pathlib
D = pathlib.Path(__file__).parent
src = json.loads((D / 'strings.json').read_text(encoding='utf8'))
SKIP = {'parentsBodyEn', 'parentsBodyEnAds', 'gameNameSub'}
ph = lambda s: sorted(re.findall(r'\{\w+\}', s))
tags = lambda s: sorted(re.findall(r'<[^>]+>', s))
for lang in sys.argv[1:]:
    d = json.loads((D / f'{lang}.json').read_text(encoding='utf8'))
    errs = []
    for k, v in src['ui'].items():
        if k in SKIP or v == '': continue
        t = d['ui'].get(k)
        if not isinstance(t, str) or not t.strip(): errs.append(f'ui missing: {k}'); continue
        if ph(v) != ph(t): errs.append(f'ui placeholder: {k}')
        if tags(v) != tags(t): errs.append(f'ui html: {k}')
    for v in src['text']:
        t = d['text'].get(v)
        if not isinstance(t, str) or not t.strip(): errs.append(f'text missing: {v[:50]}'); continue
        if ph(v) != ph(t): errs.append(f'text placeholder: {v[:50]}')
        if tags(v) != tags(t): errs.append(f'text html: {v[:50]}')
    extra = [k for k in d['text'] if k not in set(src['text'])]
    print(f'{lang}: {len(errs)} problems, {len(extra)} unknown text keys')
    for e in errs[:30]: print('  ', e)
