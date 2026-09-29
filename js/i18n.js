// ことばの切り替え（企画書 3-1）。画面の文字は data/i18n/ja.js・en.js にまとめる
(function (K) {
  'use strict';
  K.i18n = K.i18n || {};

  function lang() {
    return (K.state && K.state.settings && K.state.settings.lang) || K.defaultLang();
  }

  K.defaultLang = function () {
    var l = (navigator.language || 'ja').toLowerCase();
    return l.indexOf('ja') === 0 ? 'ja' : 'en';
  };

  // t('key', {n: 3}) → 文字。{n} を置きかえる
  K.t = function (key, vars) {
    var dict = K.i18n[lang()] || K.i18n.ja;
    var s = dict[key];
    if (s == null) s = K.i18n.ja[key];
    if (s == null) return key;
    if (vars) {
      s = s.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : ''; });
    }
    return s;
  };

  // { ja: '…', en: '…' } の形のデータから今の言語を取り出す
  K.L = function (obj) {
    if (!obj) return '';
    return obj[lang()] != null ? obj[lang()] : obj.ja;
  };

  // 「」は にほんごだけ。英語は “ ”
  K.quote = function (s) { return lang() === 'ja' ? '「' + s + '」' : '\u201C' + s + '\u201D'; };

  K.lang = lang;
})(window.K = window.K || {});
