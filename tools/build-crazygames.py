#!/usr/bin/env python3
# CrazyGames にアップロードする zip を作る（python3 tools/build-crazygames.py → dist/keshikasu-crazygames.zip）
# 中身は GitHub Pages 版と同じ。CrazyGames のドメインで開いたときだけ js/ads.js が SDK を読みこむ
import pathlib, zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'dist' / 'keshikasu-crazygames.zip'
PARTS = ['index.html', 'css', 'js', 'data', 'art']

OUT.parent.mkdir(exist_ok=True)
n = 0
with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED) as z:
    for part in PARTS:
        p = ROOT / part
        files = [p] if p.is_file() else sorted(x for x in p.rglob('*') if x.is_file())
        for f in files:
            z.write(f, f.relative_to(ROOT).as_posix())
            n += 1
print(f'{OUT.relative_to(ROOT)}: {n} files, {OUT.stat().st_size / 1024:.0f} KB')
