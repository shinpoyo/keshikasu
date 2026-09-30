// ひきだし（終盤の あそび場。クッキークリッカーの 畑）
// まぜる材料を つぶで 買って ひきだしに しまうと、時間が たつと 何かに 変わる。とじている 間も 育つ
(function (K) {
  'use strict';
  var D = {};
  var S = function () { return K.state; };

  D.SLOTS = 6;
  D.SLOT_ZUKAN = [0, 0, 0, 0, 45, 75]; // 5つめ・6つめは ずかんの 数で 開く
  D.OPEN_STAGE = 6;                    // この STAGE の カスを 見つけたら 開く
  D.BUFF_SEC = 3600;                   // 時間つきの ボーナスは 1時間
  D.GOLD_TIMES = 3;

  // grow: 育つ びょう数、price: いまの /s の 何分ぶんの つぶで しまえるか
  D.SEEDS = [
    { mat: 'graphite', grow: 1800, price: 10, reward: 'crumbs', mins: 60,
      got: { ja: '/s の1時間分のつぶ', en: '1 hour of /s in crumbs' } },
    { mat: 'glue', grow: 7200, price: 60, reward: 'ticket',
      got: { ja: '消しゴムの紙 1まい', en: '1 Eraser Sleeve' } },
    { mat: 'dust', grow: 14400, price: 30, reward: 'guest2',
      got: { ja: '1時間、ゲスト消しゴムが2倍来る', en: 'Visiting erasers come twice as often for 1 hour' } },
    { mat: 'sand', grow: 28800, price: 30, reward: 'rub10',
      got: { ja: '1時間、こする力が10倍', en: 'Rubbing x10 for 1 hour' } },
    { mat: 'colored', grow: 43200, price: 30, reward: 'cps2',
      got: { ja: '1時間、/s が2倍', en: '/s x2 for 1 hour' } },
    { mat: 'gold', grow: 86400, price: 120, reward: 'gold',
      got: { ja: 'ゴールデン消しゴムが3回つづけて来る', en: 'The next 3 visitors are Golden Erasers' } }
  ];
  D.seedByMat = {};
  D.SEEDS.forEach(function (x) { D.seedByMat[x.mat] = x; });

  // 画面の 上の ボーナス（js/ui.js の renderBuff）
  D.EFFECTS = {
    cps2: { mat: 'colored', name: { ja: 'にじ色タイム！', en: 'Rainbow Time!' }, desc: { ja: '/s が 2倍', en: '/s x2' }, short: { ja: 'x2', en: 'x2' } },
    rub10: { mat: 'sand', name: { ja: 'ざらざらタイム！', en: 'Gritty Time!' }, desc: { ja: 'こする力が 10倍', en: 'Rubbing x10' }, short: { ja: 'こする x10', en: 'Rub x10' } },
    guest2: { mat: 'dust', name: { ja: 'お客さんタイム！', en: 'Visitor Time!' }, desc: { ja: 'ゲスト消しゴムが 2倍来る', en: 'Visiting erasers x2' }, short: { ja: 'ゲスト x2', en: 'Guests x2' } },
    gold: { mat: 'gold', name: { ja: '金のひきだし！', en: 'Golden Drawer!' }, desc: { ja: '次のゲストはゴールデン', en: 'Next visitors are Golden' }, short: { ja: '金', en: 'Gold' } }
  };

  function st() {
    var s = S();
    var d = s.drawer;
    if (!d || typeof d !== 'object') d = s.drawer = {};
    if (!Array.isArray(d.slots)) d.slots = [];
    while (d.slots.length < D.SLOTS) d.slots.push(null);
    d.slots = d.slots.slice(0, D.SLOTS).map(function (x) { return x && D.seedByMat[x.mat] && typeof x.until === 'number' ? x : null; });
    if (!d.buffs || typeof d.buffs !== 'object') d.buffs = {};
    d.gold = Math.max(0, Math.floor(Number(d.gold) || 0));
    d.harvests = Math.max(0, Math.floor(Number(d.harvests) || 0));
    return d;
  }
  D.state = st;

  D.unlocked = function () { return K.evo.maxStageFound() >= D.OPEN_STAGE; };
  D.slotOpen = function (i) { return K.evo.foundCount() >= D.SLOT_ZUKAN[i]; };

  D.price = function (seed) { return Math.max(100, Math.ceil(K.game.baseCps() * 60 * seed.price)); };
  D.hasMat = function (seed) { return !!S().mats[seed.mat]; };
  D.canPlant = function (i, seed) {
    return D.unlocked() && D.slotOpen(i) && !st().slots[i] && D.hasMat(seed) && S().crumbs >= D.price(seed);
  };

  D.plant = function (i, mat) {
    var seed = D.seedByMat[mat];
    if (!seed || !D.canPlant(i, seed)) return false;
    var now = Date.now();
    S().crumbs -= D.price(seed);
    st().slots[i] = { mat: mat, at: now, until: now + seed.grow * 1000 };
    return true;
  };

  D.left = function (i) { var x = st().slots[i]; return x ? Math.max(0, (x.until - Date.now()) / 1000) : 0; };
  D.ratio = function (i) { var x = st().slots[i]; return x ? Math.min(1, (Date.now() - x.at) / (x.until - x.at)) : 0; };
  D.ready = function (i) { var x = st().slots[i]; return !!x && Date.now() >= x.until; };
  D.readyCount = function () {
    if (!D.unlocked()) return 0;
    var n = 0;
    for (var i = 0; i < D.SLOTS; i++) if (D.ready(i)) n++;
    return n;
  };

  // とる。戻り値は 画面に 出す じょうほう { mat, reward, gain }
  D.harvest = function (i) {
    if (!D.ready(i)) return null;
    var d = st(), x = d.slots[i], seed = D.seedByMat[x.mat];
    var res = { mat: x.mat, reward: seed.reward };
    d.slots[i] = null;
    d.harvests++;
    if (seed.reward === 'crumbs') {
      res.gain = Math.max(K.game.baseCps() * 60 * seed.mins, 100);
      K.game.earn(res.gain, false);
    } else if (seed.reward === 'ticket') {
      S().tickets = (S().tickets || 0) + 1;
    } else if (seed.reward === 'gold') {
      d.gold += D.GOLD_TIMES;
      if (K.guest.nextAt) K.guest.nextAt = Math.min(K.guest.nextAt, Date.now() + 5000); // すぐ 来る
    } else {
      var now = Date.now(), cur = d.buffs[seed.reward] || 0;
      d.buffs[seed.reward] = Math.max(cur, now) + D.BUFF_SEC * 1000; // かさねると のびる
    }
    return res;
  };

  D.buffActive = function (id) {
    var s = S();
    return !!(s && s.drawer && s.drawer.buffs && Date.now() < s.drawer.buffs[id]);
  };

  // ゲストけしゴムが えらぶ ときに よぶ（js/guest.js）。ゴールデンの のこりが あれば へらして true
  D.takeGold = function () {
    var s = S();
    if (!s.drawer || !(s.drawer.gold > 0)) return false;
    s.drawer.gold--;
    return true;
  };

  D.activeBuffs = function () {
    var s = S(), out = [], now = Date.now();
    if (!s.drawer) return out;
    ['cps2', 'rub10', 'guest2'].forEach(function (id) {
      var u = s.drawer.buffs && s.drawer.buffs[id];
      if (u && now < u) out.push({ id: 'd_' + id, left: (u - now) / 1000, ratio: Math.min(1, (u - now) / 1000 / D.BUFF_SEC) });
    });
    if (s.drawer.gold > 0) out.push({ id: 'd_gold', count: s.drawer.gold, ratio: Math.min(1, s.drawer.gold / D.GOLD_TIMES) });
    return out;
  };

  K.drawer = D;
})(window.K = window.K || {});
