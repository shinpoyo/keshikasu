// じっせきの判定（企画書 6-8）
(function (K) {
  'use strict';
  var S = function () { return K.state; };

  function met(a) {
    var s = S(), st = s.stats;
    switch (a.type) {
      case 'rubs': return st.rubs >= a.n;
      case 'handmade': return st.allHandmade >= a.n;
      case 'total': return s.allTimeCrumbs >= a.n;
      case 'cps': return K.game.baseCps() >= a.n;
      case 'building': return s.buildings[a.b] >= a.n;
      case 'stage': return K.evo.maxStageFound() >= a.n;
      case 'rolls': return (st.rolls || 0) >= a.n;
      case 'zukan': return K.evo.foundCount() >= a.n;
      case 'mix': return st.mixes >= a.n;
      case 'rebirth': return st.rebirths >= a.n;
      case 'golden': return st.golden >= a.n;
      case 'guest': return ((st.guests || {})[a.g] || 0) >= a.n;
      case 'guests': return K.guest.total() >= a.n;
      case 'blowStreak': return st.maxBlowStreak >= a.n;
      case 'praises': return st.praises >= a.n;
      case 'named': return s.named && !!s.name;
      case 'idle': return st.maxIdle >= a.n;
      case 'sell': return st.sold >= a.n;
      case 'night': return st.night >= a.n;
      case 'rested': return st.rested >= a.n;
      case 'cheated': return !!s.cheated;
    }
    return false;
  }

  // 新しく とれた じっせきを返す
  function check() {
    var got = [];
    K.data.achievements.forEach(function (a) {
      if (!S().achievements[a.id] && met(a)) {
        S().achievements[a.id] = Date.now();
        got.push(a);
      }
    });
    return got;
  }

  K.achieve = { check: check, met: met };
})(window.K = window.K || {});
