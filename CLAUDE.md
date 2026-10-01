# けしカス

- 作業履歴は `docs/worklog/YYYY-MM-DD-ブランチ名.md` に作業ごとの新しいファイルで書く（[docs/worklog/README.md](docs/worklog/README.md)）。`docs/worklog.md` には書き足さない（同時に進む PR どうしでコンフリクトするため）
- キャッシュ対策: 直したら `index.html` の `?v=` と `js/screens.js` の `VERSION` をそろえて上げる
- ことば: 日本語・英語は data の `{ ja, en }` と `data/i18n/ja.js`・`en.js`。ほかの言語（es pt fr de tr vi id）は英語の文をキーにした ほんやく（`tools/i18n/<lang>.json` → `python3 tools/build-i18n.py` で `data/i18n/<lang>.js`）。英語の文を変えたら、その言語では英語のまま出るので、`tools/i18n/extract.js` で strings.json を作りなおし、`tools/i18n/check.py <lang>` で足りないものを足す
