// ズル（チート）の見はり。クッキークリッカーと同じく「ズルは できる、でも ばれる」方式
// - セーブを いじっても 消したり あそべなくしたり しない
// - ばれたら ひみつの じっせき「ズルした カスは まずい」が つく（/s のボーナスには ならない）
// みはる こと:
//   1. もっている つぶ ＞ この周に あつめた つぶ（クッキークリッカーの cookies > cookiesEarned と同じ）
//   2. セーブの しるし（チェックサム）が あわない ＝ セーブを 手で かきかえた
//   3. コンソールの K.debug を つかった
// オートクリッカー対策は js/main.js（1びょう 20かい まで、スクリプトの にせクリックは むし）
(function (K) {
  'use strict';
  var SALT = 'keshikasu-crumb';

  // FNV-1a 32bit。暗号ではなく「かきかえたら わかる」ための しるし
  function hash(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return ('0000000' + h.toString(16)).slice(-8);
  }

  // しるしは sum を のぞいた 中身から つくる
  function sign(data) {
    var copy = {};
    Object.keys(data).forEach(function (k) { if (k !== 'sum') copy[k] = data[k]; });
    return hash(SALT + JSON.stringify(copy));
  }

  // 読みこんだ データの しるしを しらべる。しるしが ない（古いセーブ）は とがめない
  function verify(data) {
    if (!data || typeof data !== 'object' || typeof data.sum !== 'string') return true;
    return data.sum === sign(data);
  }

  function flag(reason) {
    var s = K.state;
    if (!s) return;
    if (!s.cheated) s.cheated = { at: Date.now(), why: reason };
  }

  // 毎びょう よぶ。つじつまが あわなければ ばれる
  function check() {
    var s = K.state;
    if (!s || s.cheated) return;
    var slack = function (n) { return n * 1e-6 + 1; }; // 小数の ごさ
    if (s.crumbs > s.totalCrumbs + slack(s.totalCrumbs)) return flag('bank');
    if (s.totalCrumbs > s.allTimeCrumbs + slack(s.allTimeCrumbs)) return flag('total');
    if (s.handmade > s.totalCrumbs + slack(s.totalCrumbs)) return flag('handmade');
  }

  K.guard = { hash: hash, sign: sign, verify: verify, flag: flag, check: check };
})(window.K = window.K || {});
