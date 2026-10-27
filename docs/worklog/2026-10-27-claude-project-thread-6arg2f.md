# 2026-10-27 メニューに「ほかのゲームを見る」リンクを追加

- ブランチ: `claude/project-thread-6arg2f`
- 要望: shinpoyo.com のゲームレビュー（shinpoyo.github.io の `docs/game-review-2026-10-27.md`）の「ゲームからサイトへ戻るリンクがない」への対応

## したこと

- メニュー（`js/screens.js` の `renderMenu`）の下に、`https://shinpoyo.com/works/` へのリンクを追加。直接ゲームに来た人が、ほかの作品に行けるようにする
- **作者のサイト（`shinpoyo.com` / `shinpoyo.github.io`）で開いたときだけ表示**。CrazyGames など、よそで公開している版（`tools/build-crazygames.py`）には出さない（外部リンクの規約に触れないように）
- 文言 `moreGames` を ja / en と、ほかの7言語（es pt fr de tr vi id）に追加。`tools/i18n/strings.json` にも追加
- キャッシュ対策: `index.html` の `?v=` と `js/screens.js` の `VERSION` を 0.52 にそろえて上げた

## 確認

- 360×740 のスマホ表示（タッチ）で、`shinpoyo.com` のときはメニューにリンクが入り、`example.org` のときは入らないことを確認。JS エラーなし
- `tools/i18n/check.py es pt fr de tr vi id` は問題なし
- `tools/i18n/extract.js` は、ローカルサーバ（8765番）が必要で、この環境では立てられず実行していない（`strings.json` は手で1行足した）
- 未確認: 他言語の訳文の自然さ（機械的な短い文）、実機での見た目
