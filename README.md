# けしカス（消しゴムのカスを育てる）

消しゴムをこすってカスの「つぶ」を集め、机の上のカスを育てるクリッカーゲーム。
クッキークリッカーをリスペクトした、子ども向けのシュールなブラウザゲームです。

- 企画書（実装仕様）: [docs/spec.md](docs/spec.md)
- デザイン案: [design/](design/)（Claude のデザインキャンバスで作成した `.dc.html`）
- 企画案の一覧: [docs/ideas.md](docs/ideas.md)
- 作業履歴: [docs/worklog.md](docs/worklog.md)
- 引き継ぎメモ: [docs/HANDOFF.md](docs/HANDOFF.md)

## あそびかた（ローカル）
ビルドは いりません。`index.html` をブラウザで開くか、このフォルダで
`python3 -m http.server` を実行して http://localhost:8000/ を開きます。

## 公開
静的サイト（HTML / CSS / JS）なので、GitHub Pages（main ブランチの / (root)）でそのまま公開できます。

## ファイル
- `index.html` … 入り口
- `css/tokens.css`・`css/style.css` … 色・文字などのデザイントークンと見た目
- `js/` … ゲームのしくみ（ループ、店、しんか、ゴールデンカス、転生、保存、音、画面）
- `data/` … 数値と文章（なかま、アップグレード、種類、ニュース、ひとりごと、じっせき、画面の文字 ja/en）
- `art/` … カスの絵（`design/art/` で生成した SVG）
