# 引き継ぎメモ（2026-09-29）

新しいスレッドや Claude Code でつづきを始めるときは、まずこのファイルを読んでください。

## いまの状態
- ゲーム: 「けしカス」（消しゴムのカスを育てるクリッカー）。子ども向け、クッキークリッカーがお手本。
- 企画書: `docs/spec.md`（v3。実装仕様はこれが正）
- デザイン: `design/*.dc.html`（22画面）。見た目はデザイン案が正（企画書 13-6）
  - デザインキャンバス: https://claude.ai/artifact/Bk1CgW2k5jTsoFFaUXVGR5
  - カスの絵: `design/art/`（`make.py` / `strand.py` で SVG 生成、STAGE 6・7 と特別種は `special.py`）
  - おじいちゃんの絵: `design/art/grandpa.py`（やさしい顔版）
- 作業履歴: `docs/worklog/`（作業ごとに1ファイル、書き方は `docs/worklog/README.md`。2026-09-30 までは `docs/worklog.md`）
- セーブ: ブラウザの localStorage（キー `keshikasu.save`）。クッキーではない
- 実装コード: `index.html` / `css/` / `js/` / `data/` / `art/`（ブランチ `impl/core-game` で1回めを実装。ビルド不要、`index.html` をブラウザで開けば動く）

## 決まっていること
- ブラウザの静的サイト（HTML / CSS / vanilla JS）、GitHub Pages で公開予定
- 数字は K / M / B / T 表記（日本語の単位は使わない）、ひらがな中心、日本語と英語の切り替え
- カスはリアル寄りのイラスト、UI はフラット
- 作業履歴はマークダウンで残す。回答は日本語

## コードの地図
- `js/main.js` ゲームループ・入力・起動 / `js/ui.js` メイン画面の表示 / `js/screens.js` タイトル・ダイアログ・しんかの演出
- `js/shop.js` 値段・/s・アップグレード / `js/evolution.js` しんか・ずかん / `js/golden.js` / `js/ascend.js` 転生 / `js/state.js` 保存
- 数値や文章は `data/`（なかま・アップグレード・種類・ニュース・ひとりごと・じっせき・かけらの おみせ・画面の文字）
- ブラウザのコンソールで `K.debug.give(1e9)`（つぶを ふやす）、`K.debug.golden()`（ゴールデンカスを出す）

## つぎにやること
1. PR を確認してマージ
2. GitHub Pages で公開する（Settings → Pages → main の / (root)）
3. のこり: バランス調整（ニュース112本・STAGE 6・7 と特別種の絵は 2回めで済）
