# 2026-10-02 海外向けタイトルを「Eraser Crumb Clicker」に（feat/title-clicker）

## 依頼
- 「タイトルは適当に消しカスにしてたけど何か別の案はある？端的に特徴を表して海外のユーザーに伝わるものがいい」
- 候補（Eraser Crumb Clicker / Crumb Clicker など）から、ユーザーが **Eraser Crumb Clicker** を選んだ。
  - Crumb Clicker は itch.io に同じ名前があるので外した。

## やったこと
- 英語のゲーム名を `Eraser Crumb Clicker` に（data/i18n/en.js）。日本語の「けしカス」はそのまま。
- 日本語画面の英字サブタイトルを `ERASER CRUMB CLICKER` に（ja.js・タイトル画面）。
- ほかの言語は各言語の名前＋「Clicker」（例: Migas de Goma Clicker, Radierkrümel Clicker）。tools/i18n/<lang>.json → build-i18n.py。
- index.html の `<title>` と説明、js/ui.js のタブ名を新しい名前に。
- 長い名前がタイトル画面で3行になるので、12文字をこえる名前は少し小さく中央寄せ（`.title-name.long`）。320px 幅でも2行におさまる。
- docs/spec.md の英語名を更新。版 0.35。

## ゲームの外（プロジェクトのファイル）
- カバー画像3サイズを作り直し（Eraser / Crumb / Clicker の3行、Crumb はピンク）: /mnt/project-files/kudaranai-game/monetize/covers/
- crazygames-listing.md の名前と説明文を更新。
- 投稿用 zip を作り直し: /mnt/project-files/kudaranai-game/monetize/keshikasu-crazygames.zip

## 確認
- Playwright で en/ja/pt/tr/fr を 320px・375px で表示。横スクロールなし、JS エラーなし、ボタンのはみ出しなし。
