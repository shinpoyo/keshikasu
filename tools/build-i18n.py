#!/usr/bin/env python3
# ほんやくの JSON（tools/i18n/<lang>.json）から data/i18n/<lang>.js を作る
# JSON の形: { "ui": { "key": "文" }, "text": { "英語の文": "ほんやく" } }
# 英語の文の 一覧は tools/i18n/strings.json（ゲームから ぬき出したもの）
import json, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'tools' / 'i18n'

def js(obj):
    return json.dumps(obj, ensure_ascii=False, separators=(',', ':'), sort_keys=True).replace('","', '",\n"')

langs = sys.argv[1:] or sorted(p.stem for p in SRC.glob('*.json') if p.stem != 'strings')
for lang in langs:
    data = json.loads((SRC / f'{lang}.json').read_text(encoding='utf8'))
    # 英語で 空の 文（nameSuffix など）は チェックを とおすために ゼロ幅スペースが 入っていることが ある → 空に もどす
    for part in ('ui', 'text'):
        data[part] = {k: v.replace('\u200b', '') for k, v in data[part].items()}
    out = ROOT / 'data' / 'i18n' / f'{lang}.js'
    out.write_text(
        f'// {lang} のことば（tools/build-i18n.py で tools/i18n/{lang}.json から作る。ここは直接なおさない）\n'
        '(function (K) {\n  \'use strict\';\n'
        '  K.i18n = K.i18n || {};\n  K.i18nText = K.i18nText || {};\n'
        f'  K.i18n.{lang} = {js(data["ui"])};\n'
        f'  K.i18nText.{lang} = {js(data["text"])};\n'
        '})(window.K = window.K || {});\n', encoding='utf8')
    print(f'{out.relative_to(ROOT)}: ui {len(data["ui"])}, text {len(data["text"])}')
