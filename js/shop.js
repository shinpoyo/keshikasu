// なかま・アップグレード・値段・生産量の計算（企画書 6-2〜6-3）
(function (K) {
  'use strict';
  var G = {};
  var S = function () { return K.state; };

  // 保存しない一時的な状態（バフなど）
  K.rt = {
    praiseUntil: 0, praiseReadyAt: 0,
    buff: null,            // { id, until, dur }
    rubTimes: [],          // 直近のこする時刻（あつあつ判定）
    maxRubRate: 0,
    blowStreak: 0,
    lastAction: Date.now(),
    sessionStart: Date.now(),
    restShown: false,
    blownUntil: 0
  };

  G.buildingById = {};
  K.data.buildings.forEach(function (b, i) { b.index = i; G.buildingById[b.id] = b; });
  G.upgradeById = {};
  K.data.upgrades.forEach(function (u) { G.upgradeById[u.id] = u; });
  G.materialById = {};
  K.data.materials.forEach(function (m) { G.materialById[m.id] = m; });

  function has(id) { return !!S().upgrades[id]; }
  function hasShard(id) { return !!S().shardUpgrades[id]; }
  G.has = has;
  G.hasShard = hasShard;

  // --- 値段 ---
  function discount() { return hasShard('discount') ? 0.95 : 1; }

  G.price = function (id, amount) {
    var b = G.buildingById[id];
    var owned = S().buildings[id];
    amount = amount || 1;
    var r = K.data.PRICE_GROWTH;
    var first = b.cost * Math.pow(r, owned) * discount();
    return Math.ceil(first * (Math.pow(r, amount) - 1) / (r - 1));
  };

  G.sellValue = function (id, amount) {
    var owned = S().buildings[id];
    amount = Math.min(amount || 1, owned);
    if (amount <= 0) return 0;
    var b = G.buildingById[id];
    var r = K.data.PRICE_GROWTH;
    var first = b.cost * Math.pow(r, owned - amount) * discount();
    return Math.floor(first * (Math.pow(r, amount) - 1) / (r - 1) * K.data.SELL_RATE);
  };

  G.buy = function (id, amount) {
    var cost = G.price(id, amount);
    if (S().crumbs < cost) return false;
    S().crumbs -= cost;
    S().buildings[id] += amount;
    return true;
  };

  G.sell = function (id, amount) {
    amount = Math.min(amount, S().buildings[id]);
    if (amount <= 0) return false;
    S().crumbs += G.sellValue(id, amount);
    S().buildings[id] -= amount;
    S().stats.sold += amount;
    return true;
  };

  // --- 生産量 ---
  function nonFingerCount() {
    var n = 0;
    K.data.buildings.forEach(function (b) { if (b.id !== 'finger') n += S().buildings[b.id]; });
    return n;
  }

  G.fingerBonus = function () {
    if (!has('f4')) return 0;
    var add = 0.1;
    ['f5', 'f6', 'f7', 'f8'].forEach(function (id) { if (has(id)) add *= G.upgradeById[id].mult; });
    return add * nonFingerCount();
  };

  function fingerDoubles() {
    var m = 1;
    ['f1', 'f2', 'f3'].forEach(function (id) { if (has(id)) m *= 2; });
    return m;
  }

  G.buildingMult = function (id) {
    if (id === 'finger') return fingerDoubles();
    var m = 1;
    for (var i = 1; i <= 7; i++) if (has('b_' + id + '_' + i)) m *= 2;
    return m;
  };

  // 1こあたりの /s（全体の倍率なし）
  G.unitCps = function (id) {
    var b = G.buildingById[id];
    var base = b.cps * G.buildingMult(id);
    if (id === 'finger') base += G.fingerBonus();
    return base;
  };

  // かげの じっせき（ズルなど）は かぞえない。/s の ボーナスにも ならない（クッキークリッカーの shadow achievement）
  G.achievementCount = function () {
    return Object.keys(S().achievements).filter(function (id) { return !G.shadowIds[id]; }).length;
  };
  G.shadowIds = {};
  K.data.achievements.forEach(function (a) { if (a.shadow) G.shadowIds[a.id] = true; });
  G.achievementTotal = K.data.achievements.filter(function (a) { return !a.shadow; }).length;

  G.globalMult = function () {
    var m = (1 + 0.01 * G.achievementCount()) * (1 + 0.01 * S().shards) * K.evo.bonusMult();
    if (hasShard('secret50')) m *= 1.5;
    if (hasShard('secret100')) m *= 2;
    return m;
  };

  G.buildingCps = function (id) {
    return G.unitCps(id) * S().buildings[id] * G.globalMult();
  };

  // ぜんたいの /s のうち この なかまの わりあい（0〜1）
  G.share = function (id) {
    var all = G.baseCps();
    return all > 0 ? G.buildingCps(id) / all : 0;
  };

  // なかまごとの「これまでに だした つぶ」を たす。sec は バフこみの びょう数
  G.addProduced = function (sec) {
    var p = S().produced;
    K.data.buildings.forEach(function (b) {
      if (S().buildings[b.id]) p[b.id] = (p[b.id] || 0) + G.buildingCps(b.id) * sec;
    });
  };

  // バフなしの /s（オフライン進行に使う）
  G.baseCps = function () {
    var sum = 0;
    K.data.buildings.forEach(function (b) { sum += G.unitCps(b.id) * S().buildings[b.id]; });
    return sum * G.globalMult();
  };

  G.praiseActive = function () { return Date.now() < K.rt.praiseUntil; };
  G.buffActive = function (id) { return K.rt.buff && K.rt.buff.id === id && Date.now() < K.rt.buff.until; };

  G.cpsMult = function () {
    var m = 1;
    if (G.praiseActive()) m *= 1.5;
    if (G.buffActive('frenzy')) m *= 7;
    return m;
  };

  G.cps = function () { return G.baseCps() * G.cpsMult(); };

  G.rubPercent = function () {
    var p = 0;
    for (var i = 1; i <= 5; i++) if (has('r' + i)) p += 0.01;
    if (hasShard('rubPower')) p += 0.01;
    return p;
  };

  G.clickPower = function () {
    var p = 1 * fingerDoubles() + G.fingerBonus();
    p += G.cps() * G.rubPercent();
    if (G.buffActive('scrub')) p *= 777;
    return p;
  };

  // --- つぶを ふやす ---
  G.earn = function (n, handmade) {
    var s = S();
    s.crumbs += n;
    s.totalCrumbs += n;
    s.allTimeCrumbs += n;
    if (handmade) { s.handmade += n; s.stats.allHandmade += n; }
  };

  // --- アップグレード ---
  G.upgradeUnlocked = function (u) {
    var s = S();
    if (u.building) return s.buildings[u.building] >= u.need;
    if (u.needHandmade != null) return s.handmade >= u.needHandmade;
    if (u.needGolden != null) return s.stats.golden >= u.needGolden;
    return true;
  };

  // 店に並べるアップグレード（買っていなくて、条件を満たしたもの）を安い順に
  G.availableUpgrades = function () {
    return K.data.upgrades.filter(function (u) { return !has(u.id) && G.upgradeUnlocked(u); })
      .sort(function (a, b) { return a.cost - b.cost; });
  };

  G.buyUpgrade = function (id) {
    var u = G.upgradeById[id];
    if (!u || has(id) || !G.upgradeUnlocked(u) || S().crumbs < u.cost) return false;
    S().crumbs -= u.cost;
    S().upgrades[id] = true;
    return true;
  };

  // --- まぜる材料 ---
  G.materialUnlocked = function (m) {
    if (hasShard('allMaterials')) return true;
    if (m.id === 'graphite' && hasShard('startGraphite')) return true;
    return S().stage >= m.stage;
  };

  G.availableMaterials = function () {
    return K.data.materials.filter(function (m) { return G.materialUnlocked(m) && S().trait !== m.trait; });
  };

  // まぜると、つぎに まるめる カスの けいとうが かわる（「まぜない」は ただ）
  G.buyMaterial = function (id) {
    var m = G.materialById[id];
    if (!m || !G.materialUnlocked(m) || S().trait === m.trait || S().crumbs < m.cost) return false;
    S().crumbs -= m.cost;
    S().trait = m.trait;
    if (m.cost > 0) S().stats.mixes++;
    return true;
  };

  // 店で見せる なかま（持っているもの＋つぎの1つ）。その先の1つは「？？？」
  G.visibleBuildings = function () {
    var list = K.data.buildings;
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var b = list[i];
      var revealed = i === 0 || S().buildings[b.id] > 0 || S().buildings[list[i - 1].id] > 0;
      if (revealed) out.push({ b: b, locked: false });
      else { out.push({ b: b, locked: true }); break; }
    }
    return out;
  };

  K.game = G;
})(window.K = window.K || {});
