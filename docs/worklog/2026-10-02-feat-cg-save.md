# 2026-10-02 CrazyGames のセーブ機能に対応（feat/cg-save）

## 依頼
- 「Crazyゲームにうつしても、ゲームの進行状況ってちゃんと保存されるの？」

## 調べたこと
- これまでのセーブはブラウザの localStorage（キー keshikasu.save）だけ。CrazyGames でも同じブラウザなら残るが、ブラウザのデータを消すと消え、別の端末には引きつがれない。
- CrazyGames は公式に Data モジュールでの保存をすすめている（docs.crazygames.com/sdk/data）。localStorage と同じ使い方（getItem/setItem/removeItem）、SDK.init のあとに使う、1人1MBまで。ログインした人はクラウドに保存されて端末をまたいで続きから遊べる。ゲストは localStorage に入り、あとでログインするとアカウントへ移る。
- GitHub Pages 版と CrazyGames 版はサイトが別なので、セーブはそれぞれ別（ブラウザのしくみ上つながらない）。必要なら「セーブの書き出し・読みこみ」で移せる。

## やったこと
- js/ads.js に `K.ads.store()`: CrazyGames で SDK が使えるときだけ `SDK.data` を返す。
- js/state.js: セーブ・読みこみ・消すを `box()`（CrazyGames では Data モジュール、ほかは localStorage）経由に。
  - Data モジュールに何もなければ localStorage のセーブを引きつぐ。
  - CrazyGames でも localStorage に控えを書く。
- 投稿文の「Progress save」を「使う」に変更（crazygames-listing.md）。zip 作り直し。版 0.36。

## 確認
- ためしの SDK（cloud を sessionStorage で再現）で: ふつうの版のセーブを CrazyGames 版が引きつぐ／ブラウザのセーブを消してもクラウドから続きが読める／さいしょからでクラウドのセーブも消える／ふつうの版は SDK を読まない。JS エラーなし。セーブの大きさは約1.2KB（上限1MB）。
