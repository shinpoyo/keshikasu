// ゴールデンカス（企画書 6-4）
(function (K) {
  'use strict';
  var GD = {};
  var S = function () { return K.state; };
  var LIFETIME = 13; // 画面に いる びょうすう

  GD.current = null;   // { x, y, until }
  GD.nextAt = 0;

  function freqMult() {
    var m = 1;
    if (K.game.has('g1')) m *= 2;
    if (K.game.hasShard('goldenFreq')) m *= 1.1;
    return m;
  }

  function durMult() {
    var m = 1;
    if (K.game.has('g2')) m *= 2;
    if (K.game.hasShard('goldenLong')) m *= 1.5;
    return m;
  }

  GD.schedule = function () {
    var min = 120, max = 300; // 2〜5ふん
    GD.nextAt = Date.now() + (min + Math.random() * (max - min)) * 1000 / freqMult();
  };

  GD.update = function () {
    var now = Date.now();
    if (GD.current && now > GD.current.until) {
      GD.current = null;
      GD.schedule();
    }
    if (!GD.current && GD.nextAt && now >= GD.nextAt && S().tutorial >= 9) {
      GD.current = { x: 0.1 + Math.random() * 0.8, y: 0.15 + Math.random() * 0.7, until: now + LIFETIME * 1000 };
      GD.nextAt = 0;
    }
  };

  // デバッグ・テスト用: すぐ出す
  GD.spawnNow = function () {
    GD.current = { x: 0.5, y: 0.5, until: Date.now() + LIFETIME * 1000 };
  };

  GD.EFFECTS = {
    lucky: { name: { ja: 'ラッキー！', en: 'Lucky!' } },
    frenzy: { name: { ja: 'キラキラタイム！', en: 'Sparkle Frenzy!' }, desc: { ja: '/s が 7ばい', en: '/s x7' }, short: { ja: 'x7', en: 'x7' }, dur: 77 },
    scrub: { name: { ja: 'ごりごりタイム！', en: 'Scrub Frenzy!' }, desc: { ja: 'こする ちからが 777ばい', en: 'Rubbing x777' }, short: { ja: 'こする x777', en: 'Rub x777' }, dur: 13 }
  };

  // 押した → 効果を1つ。戻り値は画面に出す情報
  GD.click = function () {
    if (!GD.current) return null;
    GD.current = null;
    GD.schedule();
    S().stats.golden++;
    var r = Math.random();
    var id = r < 0.45 ? 'lucky' : (r < 0.85 ? 'frenzy' : 'scrub');
    var res = { id: id };
    if (id === 'lucky') {
      var gain = Math.min(K.game.cps() * 900, S().crumbs * 0.15) + 13;
      K.game.earn(gain, false);
      res.gain = gain;
    } else {
      var dur = GD.EFFECTS[id].dur * durMult();
      K.rt.buff = { id: id, until: Date.now() + dur * 1000, dur: dur };
    }
    if (K.sound) K.sound.play('golden');
    return res;
  };

  K.golden = GD;
})(window.K = window.K || {});
