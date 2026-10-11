// ミッション（いつも3つの 小さな 目標）と 毎日の ごほうび
(function (K) {
  'use strict';
  var M = {};
  var S = function () { return K.state; };
  var SLOTS = 3;

  function totalBuildings(s) { var n = 0; Object.keys(s.buildings).forEach(function (k) { n += s.buildings[k]; }); return n; }
  function guestUses(s) { var n = 0; Object.keys(s.stats.guests || {}).forEach(function (k) { if (k !== 'golden') n += Number(s.stats.guests[k]) || 0; }); return n; }

  // 目標の しゅるい。ladder は だんだん 大きくなる 目標の かず
  var TRACKS = [
    { id: 'rubs', val: function (s) { return s.stats.rubs; }, ladder: [30, 100, 300, 1000, 3000, 10000, 30000, 100000, 300000, 1e6] },
    { id: 'buildings', val: totalBuildings, ladder: [5, 10, 25, 50, 100, 200, 400, 700, 1000] },
    { id: 'golden', val: function (s) { return s.stats.golden; }, ladder: [1, 3, 7, 15, 30, 60, 100, 200] },
    { id: 'upgrades', val: function (s) { return Object.keys(s.upgrades).length; }, ladder: [1, 3, 6, 10, 15, 25, 40, 60, 80, 100] },
    { id: 'praise', val: function (s) { return s.stats.praises; }, ladder: [3, 10, 30, 60, 100, 200, 400] },
    { id: 'roll', val: function (s) { return s.stats.rolls; }, ladder: [1, 3, 7, 15, 30, 60, 100, 200] },
    { id: 'total', val: function (s) { return s.totalCrumbs; }, ladder: [1e3, 1e5, 1e7, 1e9, 1e11, 1e13, 1e15, 1e18, 1e21, 1e24, 1e27, 1e30, 1e33] },
    { id: 'blow', val: function (s) { return s.stats.blows; }, ladder: [2, 5, 15, 30, 60, 100, 200] },
    { id: 'zukan', val: function () { return K.evo.foundCount(); }, ladder: [3, 6, 10, 16, 24, 36, 50, 70, 90] },
    { id: 'guest', val: guestUses, ladder: [1, 3, 8, 15, 30, 60, 120] }
  ];
  var BY = {};
  TRACKS.forEach(function (t, i) { t.index = i; BY[t.id] = t; });

  function lvlOf(id) { return (S().missions.lvl[id]) || 0; }
  function targetOf(tr) { return tr.ladder[lvlOf(tr.id)]; }

  // 新しく 置く 目標を えらぶ（まだ 置いて いない もの。もう クリアしている 目標は とばす）
  function pick(exclude) {
    var m = S().missions, n = TRACKS.length;
    for (var k = 0; k < n; k++) {
      var tr = TRACKS[(m.made + k) % n];
      if (exclude.indexOf(tr.id) >= 0) continue;
      var v = tr.val(S());
      while (tr.ladder[lvlOf(tr.id)] != null && v >= tr.ladder[lvlOf(tr.id)]) m.lvl[tr.id] = lvlOf(tr.id) + 1;
      if (tr.ladder[lvlOf(tr.id)] == null) continue;
      m.made++;
      return { id: tr.id, r: m.made % 3 === 0 ? 't' : 'c' };
    }
    return null;
  }

  M.ensure = function () {
    var m = S().missions;
    m.slots = (m.slots || []).filter(function (x) { return x && BY[x.id]; });
    while (m.slots.length < SLOTS) {
      var p = pick(m.slots.map(function (x) { return x.id; }));
      if (!p) break;
      m.slots.push(p);
    }
  };

  // いまの 目標 { id, target, val, pct, reward }
  M.list = function () {
    M.ensure();
    return S().missions.slots.map(function (sl) {
      var tr = BY[sl.id], target = targetOf(tr), v = tr.val(S());
      return { id: sl.id, target: target, val: v, pct: Math.max(0, Math.min(1, v / target)), r: sl.r };
    });
  };
  M.text = function (x) { return K.t('m_' + x.id, { n: K.fmt(x.target) }); };
  M.progress = function (x) { return K.fmt(Math.min(x.val, x.target)) + ' / ' + K.fmt(x.target); };

  function crumbReward() { return Math.max(50, Math.ceil(K.game.cps() * 180)); }
  M.rewardText = function (x) { return x.r === 't' ? K.t('ticketGift', { n: 1 }) : K.t('rewardCrumbs', { v: K.fmt(crumbReward()) }); };

  // 毎秒よぶ: 達成した 目標に ごほうび
  M.check = function () {
    var m = S().missions, got = 0;
    M.list().forEach(function (x, i) {
      if (x.val < x.target) return;
      var sl = m.slots[i];
      if (sl.r === 't') S().tickets = (S().tickets || 0) + 1; else K.game.earn(crumbReward(), false);
      m.lvl[sl.id] = lvlOf(sl.id) + 1;
      m.done++;
      got++;
      K.ui.toast('<b>' + K.ui.esc(K.t('missionDone')) + '</b> ' + K.ui.esc(M.text(x)) + ' ・ ' + K.ui.esc(M.rewardText(x)));
      m.slots[i] = null;
    });
    if (got) {
      m.slots = m.slots.filter(Boolean);
      M.ensure();
      K.sound.play('reward');
      K.store.save();
      K.ui.renderAll();
    }
    return got;
  };

  // ---------- 毎日の ごほうび ----------
  function dayKey(d) { return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  M.today = function () { return dayKey(new Date()); };
  M.yesterday = function () { var d = new Date(); return dayKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1)); };
  // 今日 もらえるか。もらえるなら { day: 1〜7, streak } を かえす
  M.dailyAvailable = function () {
    var d = S().daily;
    if (!d || d.last === M.today()) return null;
    var streak = d.last === M.yesterday() ? (d.streak || 0) + 1 : 1;
    return { streak: streak, day: ((streak - 1) % 7) + 1 };
  };
  M.dailyReward = function (day) {
    return { crumbs: Math.max(100 * day, Math.ceil(K.game.cps() * 60 * 3 * day)), tickets: day === 7 ? 2 : (day === 3 ? 1 : 0) };
  };
  M.claimDaily = function () {
    var a = M.dailyAvailable();
    if (!a) return null;
    var r = M.dailyReward(a.day);
    K.game.earn(r.crumbs, false);
    if (r.tickets) S().tickets = (S().tickets || 0) + r.tickets;
    S().daily = { last: M.today(), streak: a.streak };
    K.store.save();
    return { a: a, r: r };
  };
  // 毎秒よぶ: 何も 開いて いなければ 今日の ごほうびを 出す
  var asked = '';
  M.tick = function () {
    M.check();
    var s = S();
    if (s.tutorial < 9 || s.totalCrumbs < 100) return;
    if (K.screens.isOpen() || K.screens.evoOpen() || !$g('screen-game') || document.hidden) return;
    if (asked === M.today() || !M.dailyAvailable()) return;
    asked = M.today();
    K.screens.open('daily');
  };
  function $g(id) { var e = document.getElementById(id); return e && !e.hidden; }

  K.missions = M;
})(window.K = window.K || {});
