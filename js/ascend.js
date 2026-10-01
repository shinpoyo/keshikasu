// てんせい（けしゴムに もどる）と かけらの おみせ（企画書 8章）
(function (K) {
  'use strict';
  var A = {};
  var S = function () { return K.state; };

  // もらえる かけら = floor(cbrt(全周の合計 / 1e12)) − すでに もらった数
  A.pending = function () {
    var total = Math.floor(Math.cbrt(S().allTimeCrumbs / 1e12));
    return Math.max(0, total - S().shardsEarned);
  };

  // つぎの かけらまでに いる つぶと、その あいだで どこまで きたか（0〜1）
  A.next = function () {
    var all = S().allTimeCrumbs, n = Math.floor(Math.cbrt(all / 1e12));
    var from = Math.pow(n, 3) * 1e12, to = Math.pow(n + 1, 3) * 1e12;
    return { left: Math.max(0, to - all), ratio: Math.min(1, Math.max(0, (all - from) / (to - from))) };
  };

  // はじめから いる どうぐ（アリさん・指）
  A.startBonus = function () {
    var s = S();
    if (s.shardUpgrades.startAnts && s.buildings.ant < 10) s.buildings.ant = 10;
    if (s.shardUpgrades.startFingers && s.buildings.finger < 50) s.buildings.finger = 50;
  };

  A.rebirth = function () {
    var s = S();
    var gain = A.pending();
    s.shards += gain;
    s.shardsEarned += gain;
    s.stats.rebirths++;

    // リセットするもの: つぶ・どうぐ・アップグレード・だんかい（つくえの カス・ずかん・ざいりょう・かみ・スタンプは のこる）
    var f = K.store.fresh();
    s.crumbs = 0;
    s.totalCrumbs = 0;
    s.handmade = 0;
    s.buildings = f.buildings;
    s.produced = {};
    s.upgrades = {};
    s.trait = 'plain';
    s.stage = 1;
    s.mood = f.mood;
    s.stats.runStart = Date.now();
    A.startBonus();
    if (s.shardUpgrades.paperGift) s.tickets = (s.tickets || 0) + 3;
    K.rt.buffs = {};
    K.rt.kadoLeft = 0;
    K.rt.rocket = null;
    K.rt.jumbo = null;
    K.rt.hold = [];
    K.rt.praiseUntil = 0;
    return gain;
  };

  A.canBuy = function (item) {
    var s = S();
    if (s.shardUpgrades[item.id]) return false;
    if (item.requires && !s.shardUpgrades[item.requires]) return false;
    return s.shards >= item.cost;
  };

  // かけらは「使う」。/s +1% は もっている かけらの数で決まる（クッキークリッカーと同じ）
  A.buy = function (id) {
    var item = null;
    K.data.shardShop.forEach(function (x) { if (x.id === id) item = x; });
    if (!item || !A.canBuy(item)) return false;
    S().shards -= item.cost;
    S().shardUpgrades[id] = true;
    A.startBonus();
    return true;
  };

  K.ascend = A;
})(window.K = window.K || {});
