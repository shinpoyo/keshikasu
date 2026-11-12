// ちょうせん（しばりの ある 周）。かけらが たまって なんでも すぐ 買えるように なった あとの 目標（2026-11-11）
// 消しゴムに もどる ときに えらぶ。その 周で STAGE 7（うちゅうの カス）まで 行けたら クリア。
// クリアすると ずっと /s が 2倍（1つにつき）。いちばん はやい 記録も のこるので、なんども ちょうせんできる
(function (K) {
  'use strict';
  var C = {};
  var S = function () { return K.state; };

  C.GOAL_STAGE = 7;
  C.CLEAR_MULT = 2;

  // rules: noShard かけらの /s が きかない / maxKinds どうぐの 種類の 上限 / noRub こすっても つぶが 出ない / noGuest ゲスト消しゴムが 来ない
  C.LIST = [
    { id: 'forget', rules: { noShard: true },
      name: { ja: 'かけらを忘れる', en: 'Forget the Shards' },
      desc: { ja: '消しゴムのかけらの /s が効かない。', en: 'Eraser shards give no /s bonus.' } },
    { id: 'three', rules: { noShard: true, maxKinds: 3 },
      name: { ja: 'どうぐは3種類', en: 'Three Kinds of Tools' },
      desc: { ja: 'かけらの /s が効かない。どうぐは3種類までしか買えない。', en: 'Shards give no /s bonus. You can only own 3 kinds of tools.' } },
    { id: 'quiet', rules: { noShard: true, noRub: true, noGuest: true },
      name: { ja: 'しずかなつくえ', en: 'The Quiet Desk' },
      desc: { ja: 'かけらの /s が効かない。こすってもつぶが出ない。ゲスト消しゴムも来ない。', en: 'Shards give no /s bonus. Rubbing gives no crumbs. No visiting erasers.' } }
  ];
  C.byId = {};
  C.LIST.forEach(function (x) { C.byId[x.id] = x; });

  function st() {
    var s = S();
    var c = s.challenge;
    if (!c || typeof c !== 'object') c = s.challenge = {};
    if (c.on && !C.byId[c.on]) c.on = null;
    if (!c.on) c.on = null;
    c.start = Number(c.start) || 0;
    if (!c.cleared || typeof c.cleared !== 'object') c.cleared = {};
    if (!c.best || typeof c.best !== 'object') c.best = {};
    return c;
  }
  C.state = st;

  // ちょうせんを えらべるのは 1回 消しゴムに もどった あと
  C.unlocked = function () { return S().stats.rebirths >= 1; };
  C.current = function () { var c = st(); return c.on ? C.byId[c.on] : null; };
  C.rule = function (key) { var x = C.current(); return x ? x.rules[key] : undefined; };
  C.clearedCount = function () { var c = st(); return C.LIST.filter(function (x) { return c.cleared[x.id]; }).length; };
  C.mult = function () { return Math.pow(C.CLEAR_MULT, C.clearedCount()); };

  // 消しゴムに もどった すぐ あとに よぶ（js/screens.js）。id が なければ ふつうの 周
  C.begin = function (id) {
    var c = st();
    c.on = C.byId[id] ? id : null;
    c.start = Date.now();
  };
  C.quit = function () { st().on = null; };

  // どうぐの 種類の 上限（もっている 種類は 買いたせる）
  C.canOwn = function (id) {
    var max = C.rule('maxKinds');
    if (!max) return true;
    var b = S().buildings;
    if (b[id] > 0) return true;
    var kinds = 0;
    Object.keys(b).forEach(function (k) { if (b[k] > 0) kinds++; });
    return kinds < max;
  };

  // まいフレーム よぶ（js/main.js）。クリアしたら その ちょうせんを かえす
  C.check = function () {
    var c = st();
    if (!c.on || S().stage < C.GOAL_STAGE) return null;
    var x = C.byId[c.on], time = Math.max(0, Date.now() - c.start);
    var first = !c.cleared[x.id];
    if (first) c.cleared[x.id] = Date.now();
    if (!c.best[x.id] || time < c.best[x.id]) c.best[x.id] = time;
    c.on = null;
    return { ch: x, time: time, first: first };
  };

  // 記録の 見せかた（1時間23分 / 1h 23m）
  C.fmtTime = function (ms) {
    var m = Math.max(1, Math.round(ms / 60000)), h = Math.floor(m / 60), d = Math.floor(h / 24);
    var ja = K.lang() === 'ja';
    if (d >= 1) return ja ? d + '日' + (h % 24) + '時間' : d + 'd ' + (h % 24) + 'h';
    if (h >= 1) return ja ? h + '時間' + (m % 60) + '分' : h + 'h ' + (m % 60) + 'm';
    return ja ? m + '分' : m + 'm';
  };

  K.challenge = C;
})(window.K = window.K || {});
