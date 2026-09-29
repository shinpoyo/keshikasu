// 状態・保存・書き出し・オフライン進行（企画書 11章、6-7）
(function (K) {
  'use strict';
  var KEY = 'keshikasu.save';
  var VERSION = 1;

  function fresh() {
    var b = {};
    K.data.buildings.forEach(function (x) { b[x.id] = 0; });
    var now = Date.now();
    return {
      v: VERSION,
      started: false,          // タイトルから はじめた
      named: false,
      name: '',
      tutorial: 0,             // 0: まだ / 1〜3: とちゅう / 9: おわり
      crumbs: 0,
      totalCrumbs: 0,          // この周の合計（だんかいを決める）
      allTimeCrumbs: 0,        // 全周の合計（かけらを決める）
      handmade: 0,             // この周に こすって えた合計
      buildings: b,
      produced: {},            // なかまごとの これまでに だした つぶ（この周）
      upgrades: {},            // id: true
      trait: 'plain',
      stage: 1,                // この周で でるように なった だんかい
      rollsAtTier: 0,          // いまの だんかいで まるめた かず（ねだんが あがる）
      species: '1-plain',
      zukan: {},               // speciesId: { at: 日時, mat: 材料id }
      achievements: {},        // id: 日時
      cheated: null,           // ズルが ばれた { at, why }（js/guard.js）
      shards: 0,               // もっている かけら
      shardsEarned: 0,         // これまでに もらった かけら
      shardUpgrades: {},
      mood: { praises: 0, blows: 0, idle: 0 }, // この周の記録（特別な進化）
      stats: {
        rubs: 0, rolls: 0, allHandmade: 0, golden: 0, playTime: 0, rebirths: 0,
        praises: 0, blows: 0, mixes: 0, sold: 0, maxBlowStreak: 0, maxIdle: 0,
        night: 0, rested: 0, firstPlay: now, runStart: now
      },
      settings: { lang: K.defaultLang(), sound: true, notation: 'short', reduceMotion: false, dark: false },
      lastSave: now,
      lastTick: now
    };
  }

  // 古いデータや壊れたデータでも動くよう、足りない項目を補う
  function merge(base, data) {
    if (!data || typeof data !== 'object') return base;
    Object.keys(base).forEach(function (k) {
      if (!(k in data)) return;
      var bv = base[k], dv = data[k];
      if (bv && typeof bv === 'object' && !Array.isArray(bv) && dv && typeof dv === 'object') {
        // buildings・settings・stats・mood は中身も補う。upgrades など辞書はそのまま
        if (k === 'buildings' || k === 'settings' || k === 'stats' || k === 'mood') base[k] = merge(bv, dv);
        else base[k] = dv;
      } else if (typeof bv === typeof dv) {
        base[k] = dv;
      }
    });
    return base;
  }

  function save() {
    K.state.lastSave = Date.now();
    try {
      K.state.sum = K.guard.sign(K.state);
      localStorage.setItem(KEY, JSON.stringify(K.state));
      return true;
    } catch (e) {
      return false;
    }
  }

  // しるしが あわなくても 読みこむ（ズルは ゆるす）。ただし ばれた ことは のこる
  function checked(data) {
    var ok = K.guard.verify(data);
    var st = merge(fresh(), data);
    if (!ok && !st.cheated) st.cheated = { at: Date.now(), why: 'save' };
    return st;
  }

  function load() {
    var raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { raw = null; }
    if (!raw) return null;
    try { return checked(JSON.parse(raw)); } catch (e) { return null; }
  }

  // セーブの書き出し（テキスト）。クッキークリッカーと同じく base64 の文字
  function exportText() {
    K.state.sum = K.guard.sign(K.state);
    var json = JSON.stringify(K.state);
    return 'KESHIKASU1:' + btoa(unescape(encodeURIComponent(json)));
  }

  function importText(text) {
    text = String(text || '').trim();
    if (text.indexOf('KESHIKASU1:') !== 0) return null;
    try {
      var json = decodeURIComponent(escape(atob(text.slice(11))));
      var data = JSON.parse(json);
      if (!data || typeof data !== 'object' || typeof data.crumbs !== 'number') return null;
      return checked(data);
    } catch (e) {
      return null;
    }
  }

  function reset() {
    try { localStorage.removeItem(KEY); } catch (e) { /* 保存できない環境 */ }
  }

  // オフライン進行: 閉じていた間の /s × 割合（最大8時間）
  function offlineRate() {
    var s = K.state.shardUpgrades;
    if (s.offline50) return 0.5;
    if (s.offline20) return 0.2;
    return 0.1;
  }

  function offlineGain(now) {
    var away = Math.min((now - K.state.lastTick) / 1000, 8 * 3600);
    if (away < 60) return { sec: 0, gain: 0 };
    var gain = K.game.baseCps() * away * offlineRate();
    return { sec: away, gain: gain };
  }

  K.store = {
    fresh: fresh, save: save, load: load, reset: reset,
    exportText: exportText, importText: importText,
    offlineGain: offlineGain, offlineRate: offlineRate, VERSION: VERSION
  };
})(window.K = window.K || {});
