// ことばの切り替え（企画書 3-1）。画面の文字は data/i18n/ にまとめる
// ja・en は もとの ことば。ほかの ことばは data/i18n/<lang>.js が 英語の 文から ほんやくを ひく
(function (K) {
  'use strict';
  K.i18n = K.i18n || {};
  K.i18nText = K.i18nText || {}; // lang: { 英語の文: ほんやく }

  // えらべる ことば（ならび順は 設定の 一覧の 順）
  K.LANGS = [
    { id: 'ja', name: '日本語' },
    { id: 'en', name: 'English' },
    { id: 'es', name: 'Español' },
    { id: 'pt', name: 'Português' },
    { id: 'fr', name: 'Français' },
    { id: 'de', name: 'Deutsch' },
    { id: 'tr', name: 'Türkçe' },
    { id: 'vi', name: 'Tiếng Việt' },
    { id: 'id', name: 'Bahasa Indonesia' }
  ];
  K.hasLang = function (id) { return K.LANGS.some(function (l) { return l.id === id; }); };

  function lang() {
    return (K.state && K.state.settings && K.state.settings.lang) || K.defaultLang();
  }

  // ブラウザの ことばから えらぶ。ない ことばなら 英語
  K.defaultLang = function () {
    var list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'en'];
    for (var i = 0; i < list.length; i++) {
      var l = String(list[i] || '').toLowerCase().split('-')[0];
      if (l === 'in') l = 'id'; // 古い インドネシア語の コード
      if (K.hasLang(l)) return l;
    }
    return 'en';
  };

  // ja と en いがいは、ない ところを 英語で うめる
  function base(l) { return l === 'ja' ? 'ja' : 'en'; }

  function fill(s, vars) {
    if (!vars) return s;
    return s.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : ''; });
  }
  K.fill = fill;

  // t('key', {n: 3}) → 文字。{n} を置きかえる
  K.t = function (key, vars) {
    var l = lang();
    var dict = K.i18n[l] || {};
    var s = dict[key];
    if (s == null) s = (K.i18n[base(l)] || {})[key];
    if (s == null) s = K.i18n.ja[key];
    if (s == null) return key;
    return fill(s, vars);
  };

  // ことばを きめて t（ほかの ことばの 文も いっしょに 作るとき）
  K.tIn = function (l, key, vars) {
    var s = (K.i18n[l] || {})[key];
    if (s == null) s = (K.i18n[base(l)] || {})[key];
    if (s == null) s = K.i18n.ja[key];
    return s == null ? key : fill(s, vars);
  };

  // 英語の 文を いまの ことばに（ほんやくが なければ 英語のまま）
  K.tx = function (en, l) {
    l = l || lang();
    var map = K.i18nText[l];
    var s = map && map[en];
    return s != null && s !== '' ? s : en;
  };

  // { ja: '…', en: '…' } の形のデータから今の言語を取り出す
  K.L = function (obj) {
    if (!obj) return '';
    var l = lang();
    if (obj[l] != null) return obj[l];
    if (l !== 'ja' && obj.en != null) return K.tx(obj.en, l);
    return obj.ja;
  };

  // 「」は にほんごだけ。ほかは “ ”（ドイツ語は „ “、フランス語は « »）
  K.quote = function (s) {
    var l = lang();
    if (l === 'ja') return '「' + s + '」';
    if (l === 'de') return '„' + s + '“';
    if (l === 'fr') return '« ' + s + ' »';
    return '“' + s + '”';
  };

  // ja・en いがいの ことばは、えらばれた ときだけ 読みこむ（ファイルが 大きいので）
  var ver = (document.currentScript && /[?&]v=([^&]+)/.exec(document.currentScript.src) || [])[1] || '';
  K.loadLang = function (l, done) {
    if (l === 'ja' || l === 'en' || K.i18n[l] || !K.hasLang(l)) { done(); return; }
    var el = document.createElement('script');
    el.src = 'data/i18n/' + l + '.js' + (ver ? '?v=' + ver : '');
    el.onload = el.onerror = function () { done(); };
    document.head.appendChild(el);
  };

  K.lang = lang;
})(window.K = window.K || {});
