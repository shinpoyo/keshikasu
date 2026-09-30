// じっせきの判定（企画書 6-8）
(function (K) {
  'use strict';
  var S = function () { return K.state; };

  // ずかんの 中で ids の うち 見つけた 数
  function found(ids) { var z = S().zukan; return ids.filter(function (id) { return z[id]; }).length; }
  function dexOf(fn) { return K.evo.DEX.filter(function (id) { return fn(K.evo.info(id)); }); }

  // いまの 数と 目標（じっせきの 画面の ゲージに 使う）
  function progress(a) {
    var s = S(), st = s.stats, ids;
    switch (a.type) {
      case 'rubs': return { cur: st.rubs, max: a.n };
      case 'handmade': return { cur: st.allHandmade, max: a.n };
      case 'total': return { cur: s.allTimeCrumbs, max: a.n };
      case 'cps': return { cur: K.game.baseCps(), max: a.n };
      case 'building': return { cur: s.buildings[a.b] || 0, max: a.n };
      case 'stage': return { cur: K.evo.maxStageFound(), max: a.n };
      case 'rolls': return { cur: st.rolls || 0, max: a.n };
      case 'zukan': return { cur: K.evo.foundCount(), max: a.n };
      case 'mix': return { cur: st.mixes, max: a.n };
      case 'rebirth': return { cur: st.rebirths, max: a.n };
      case 'golden': return { cur: st.golden, max: a.n };
      case 'guest': return { cur: (st.guests || {})[a.g] || 0, max: a.n };
      case 'guests': return { cur: K.guest.total(), max: a.n };
      case 'blowStreak': return { cur: st.maxBlowStreak, max: a.n };
      case 'praises': return { cur: st.praises, max: a.n };
      case 'idle': return { cur: st.maxIdle, max: a.n };
      case 'sell': return { cur: st.sold, max: a.n };
      case 'night': return { cur: st.night, max: a.n };
      case 'rested': return { cur: st.rested, max: a.n };
      case 'dexStage': ids = dexOf(function (x) { return x.stage === a.n; }); return { cur: found(ids), max: ids.length };
      case 'shapes': return { cur: found(K.data.shapes.map(function (x) { return x.id; })), max: a.n };
      case 'shapesAll': ids = K.data.shapes.map(function (x) { return x.id; }); return { cur: found(ids), max: ids.length };
      case 'specialsAll': ids = K.data.specials.map(function (x) { return x.id; }); return { cur: found(ids), max: ids.length };
      case 'trades': return { cur: st.trades || 0, max: a.n };
      case 'dups': return { cur: st.dups || 0, max: a.n };
      case 'shardBuys': return { cur: Object.keys(s.shardUpgrades).filter(function (k) { return s.shardUpgrades[k]; }).length, max: a.n };
      case 'shardsHeld': return { cur: s.shards, max: a.n };
      case 'harvests': return { cur: (s.drawer && s.drawer.harvests) || 0, max: a.n };
      case 'erasers': return { cur: st.erasers || 0, max: a.n };
      case 'playHours': return { cur: Math.floor(st.playTime / 60), max: a.n * 60, unit: 'min' };
      case 'royal': var d = st.desked || {}; return { cur: (d['k-king'] ? 1 : 0) + (d['k-god'] ? 1 : 0), max: 2 };
      case 'dry': return { cur: s.dry || 0, max: a.n };
      case 'named': return { cur: s.named && s.name ? 1 : 0, max: 1 };
      case 'cheated': return { cur: s.cheated ? 1 : 0, max: 1 };
    }
    return { cur: 0, max: 1 };
  }

  function met(a) {
    var p = progress(a);
    return p.cur >= p.max;
  }

  // 新しく とれた じっせきを返す
  function check() {
    var got = [], st = S().stats;
    // つくえに 置いた ことの ある カス（ひみつの じっせき用）
    if (S().species) { st.desked = st.desked || {}; st.desked[S().species] = 1; }
    K.data.achievements.forEach(function (a) {
      if (!S().achievements[a.id] && met(a)) {
        S().achievements[a.id] = Date.now();
        got.push(a);
      }
    });
    return got;
  }

  K.achieve = { check: check, met: met, progress: progress };
})(window.K = window.K || {});
