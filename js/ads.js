// CrazyGames 版だけの リワード広告（見るかどうかは 遊ぶ 人が 選ぶ）
// GitHub Pages など ほかの 場所では 何も 読みこまず、広告も 出ない
(function (K) {
  'use strict';
  var A = {};
  var SDK_URL = 'https://sdk.crazygames.com/crazygames-sdk-v3.js';
  var S = function () { return K.state; };

  A.BOOST_SEC = 10 * 60;   // しばらく 2倍の 長さ
  A.BOOST_WAIT = 5 * 60;   // おわってから 次に 見られるまで
  A.on = false;            // SDK が 使える ときだけ true
  A.playing = false;       // 広告が 流れている 間（ゲームを 止める）

  // CrazyGames の ドメイン、または ためし用に ?cg=1 を つけた ときだけ
  function wanted() {
    var h = location.hostname;
    if (/(^|\.)crazygames\./.test(h)) return true;
    return /[?&]cg=1\b/.test(location.search) && (h === 'localhost' || h === '127.0.0.1');
  }
  A.wanted = wanted();

  function sdk() { return window.CrazyGames && window.CrazyGames.SDK; }

  // done は かならず 1回 よぶ（SDK が 読めなくても 遊べるように）
  A.init = function (done) {
    var called = false;
    var finish = function () { if (!called) { called = true; done(); } };
    if (!A.wanted) { finish(); return; }
    setTimeout(finish, 6000);
    var start = function () {
      var s = sdk();
      if (!s) { finish(); return; }
      Promise.resolve().then(function () { return s.init(); }).then(function () {
        A.on = s.environment === 'crazygames' || s.environment === 'local';
        if (A.on) { try { s.game.loadingStart(); } catch (e) { /* なし */ } }
        finish();
      }, finish);
    };
    if (sdk()) { start(); return; }
    var el = document.createElement('script');
    el.src = SDK_URL;
    el.onload = start;
    el.onerror = finish;
    document.head.appendChild(el);
  };

  function call(fn) {
    if (!A.on) return;
    try { fn(sdk()); } catch (e) { /* SDK の 失敗で ゲームを 止めない */ }
  }
  A.loaded = function () { call(function (s) { s.game.loadingStop(); }); };
  A.gameplayStart = function () { call(function (s) { s.game.gameplayStart(); }); };
  A.gameplayStop = function () { call(function (s) { s.game.gameplayStop(); }); };

  // 広告の 間は 入力を ふさいで、音を 止める
  function block(onOff) {
    A.playing = onOff;
    document.documentElement.classList.toggle('ad-playing', onOff);
  }

  // リワード広告。見おわったら onReward、出せなかったら onFail
  A.rewarded = function (onReward, onFail) {
    if (!A.on || A.playing) { if (onFail) onFail(); return; }
    var done = false;
    var end = function (ok) {
      if (done) return;
      done = true;
      block(false);
      A.gameplayStart();
      if (ok) onReward(); else if (onFail) onFail();
    };
    block(true);
    A.gameplayStop();
    try {
      sdk().ad.requestAd('rewarded', {
        adStarted: function () { block(true); },
        adFinished: function () { end(true); },
        adError: function () { end(false); }
      });
    } catch (e) { end(false); }
  };

  // ---- しばらく 2倍（/s と こする力）----
  function boost() {
    var b = S().adBoost;
    if (!b || typeof b !== 'object') b = S().adBoost = { until: 0, next: 0 };
    return b;
  }
  A.boostActive = function () { return A.on && Date.now() < boost().until; };
  // 次に 見られるまでの びょう（0 なら 見られる）
  A.boostWait = function () { return Math.max(0, (boost().next - Date.now()) / 1000); };
  A.startBoost = function () {
    var n = Date.now();
    boost().until = n + A.BOOST_SEC * 1000;
    boost().next = n + (A.BOOST_SEC + A.BOOST_WAIT) * 1000;
    K.store.save();
  };
  A.activeBuffs = function () {
    if (!A.boostActive()) return [];
    var left = (boost().until - Date.now()) / 1000;
    return [{ id: 'a_boost', left: left, ratio: left / A.BOOST_SEC }];
  };
  A.EFFECTS = {
    boost: { ui: 'ad', name: { ja: '2倍タイム！', en: 'Double Time!' }, desc: { ja: '/s とこする力が 2倍', en: '/s and rubbing x2' }, short: { ja: 'x2', en: 'x2' } }
  };

  K.ads = A;
})(window.K = window.K || {});
