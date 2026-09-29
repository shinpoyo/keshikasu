// あつめる・ずかん（企画書 7章、10章）
// 「けしゴムの かみ」で「まるめる」と あたらしい カスが 1ぴき できる。だんかい（STAGE）は この周に あつめた つぶで ふえ、
// まるめると そのなかから ランダム。いろは かった ざいりょうから ランダム。ずかんの しゅるい 1つにつき /s +2%
(function (K) {
  'use strict';
  var E = {};
  var S = function () { return K.state; };
  var traitById = {}, specialById = {};
  K.data.traits.forEach(function (t) { traitById[t.id] = t; });
  K.data.specials.forEach(function (s) { specialById[s.id] = s; });
  E.traitById = traitById;
  E.specialById = specialById;
  E.TOTAL = K.data.stages.length * K.data.traits.length + K.data.specials.length; // 56

  E.queue = []; // 画面に出す しんかの演出

  E.stageFor = function (total) {
    var st = 1;
    K.data.stages.forEach(function (s) { if (total >= s.need) st = s.n; });
    return st;
  };

  E.nextNeed = function () {
    var s = K.data.stages[S().stage]; // つぎの だんかい（0はじまりなので +1 ぶん）
    return s ? s.need : null;
  };

  E.progress = function () {
    var cur = K.data.stages[S().stage - 1].need;
    var next = E.nextNeed();
    if (next == null) return 1;
    // 桁が大きく変わるので、対数で見せる
    var t = S().totalCrumbs;
    if (t <= cur) return 0;
    var a = Math.log10(Math.max(cur, 1)), b = Math.log10(next), c = Math.log10(Math.max(t, 1));
    if (cur === 0) return Math.min(t / next, 1);
    return Math.max(0, Math.min((c - a) / (b - a), 1));
  };

  // 図鑑用の情報
  E.info = function (id) {
    if (specialById[id]) {
      var sp = specialById[id];
      return { id: id, special: true, stage: null, trait: null, name: sp.name, line: sp.line, hint: sp.hint,
        art: sp.img, filter: 'none' };
    }
    var parts = id.split('-');
    var n = +parts[0], tr = traitById[parts[1]] || traitById.plain;
    var st = K.data.stages[n - 1];
    var name = {
      ja: st.name.ja + ' ' + (tr.word.ja || '') + 'カス',
      en: st.name.en + ' ' + (tr.word.en ? tr.word.en + ' ' : '') + 'Crumb'
    };
    var line = tr.id === 'plain' ? st.line : { ja: tr.lines.ja[(n - 1) % 3], en: tr.lines.en[(n - 1) % 3] };
    return { id: id, special: false, stage: n, trait: tr.id, name: name, line: line,
      art: K.art.kasuSrc(n), filter: tr.filter, tint: tr.tint || null };
  };

  E.register = function (id) {
    var z = S().zukan[id];
    if (z) { z.n = (z.n || 1) + 1; return false; }
    var matId = null, tr = E.info(id).trait;
    K.data.materials.forEach(function (m) { if (m.trait === tr && m.cost > 0) matId = m.id; });
    S().zukan[id] = { at: Date.now(), mat: matId, n: 1 };
    return true;
  };

  E.foundCount = function () { return Object.keys(S().zukan).length; };

  // ずかんの ボーナス（クッキークリッカーの ミルクと 子ネコ の かわり）
  E.BONUS = 0.02;
  E.bonusMult = function () { return 1 + E.BONUS * E.foundCount(); };

  E.maxStageFound = function () {
    var m = 0;
    Object.keys(S().zukan).forEach(function (id) { var n = parseInt(id, 10); if (n > m) m = n; });
    return m;
  };

  function special() {
    var s = S(), now = new Date();
    var checks = [
      ['lucky', K.rt.buff && Date.now() < K.rt.buff.until],
      ['toasty', K.rt.maxRubRate >= 10],
      ['night', now.getHours() < 5],
      ['king', s.mood.praises >= 30],
      ['wander', s.mood.blows >= 20],
      ['zen', s.mood.idle >= 600],
      ['reborn', s.stats.rebirths >= 10]
    ];
    for (var i = 0; i < checks.length; i++) {
      if (checks[i][1] && !s.zukan[checks[i][0]]) return checks[i][0];
    }
    return null;
  }

  // --- まるめる（ガチャ）---
  // けしゴムを こすると すこしずつ ちいさく なり、つかいきると「けしゴムの かみ」が 1まい もらえる。
  // かみ 1まいで 1かい まるめる。いろは もっている ざいりょうから ランダム。
  // ダブったら スタンプ 1こ（10こで すきな カスと こうかん）。10かい つづけて ダブったら つぎは かならず あたらしい カス
  E.WEAR_LIFE = 80;   // こする かいすうで 1こ つかいきる
  E.TIER_TICKETS = 2; // あたらしい STAGE が でたら もらえる かみ
  E.STAMPS = 10;      // こうかんに ひつような スタンプ
  E.PITY = 10;        // この かいすうめは かならず あたらしい

  // こすった ぶん けしゴムが へる。つかいきったら true
  E.wear = function () {
    var s = S();
    s.wear = (s.wear || 0) + 1;
    if (s.wear < E.WEAR_LIFE) return false;
    s.wear = 0;
    s.tickets = (s.tickets || 0) + 1;
    s.stats.erasers = (s.stats.erasers || 0) + 1;
    return true;
  };
  E.wearRatio = function () { return Math.min((S().wear || 0) / E.WEAR_LIFE, 1); };

  // まるめると でる いろ: まぜない（はいいろ）＋ かった ざいりょう（いまの STAGE で つかえる もの）
  E.pool = function () {
    var out = ['plain'];
    K.data.materials.forEach(function (m) {
      if (m.cost > 0 && S().mats[m.id] && K.game.materialUnlocked(m) && out.indexOf(m.trait) < 0) out.push(m.trait);
    });
    return out;
  };

  // いま まるめて でる かのうせいが ある まだ みつけていない カス
  E.missing = function () {
    var out = [], pool = E.pool();
    for (var n = 1; n <= S().stage; n++) {
      pool.forEach(function (tr) { var id = K.speciesId(n, tr); if (!S().zukan[id]) out.push(id); });
    }
    return out;
  };

  // あと なんかいで あたらしい カスが かくていか
  E.pityLeft = function () { return E.PITY - (S().dry || 0); };

  // でる だんかい: いちばん うえ 40%、ひとつ した 25%、のこりは それより したから
  function pickStage() {
    var top = S().stage, r = Math.random();
    if (top === 1) return 1;
    if (r < 0.4) return top;
    if (r < 0.65 || top === 2) return top - 1;
    return 1 + Math.floor(Math.random() * (top - 2));
  }
  function pickId() {
    var pool = E.pool();
    return K.speciesId(pickStage(), pool[Math.floor(Math.random() * pool.length)]);
  }

  E.roll = function () {
    var s = S();
    if ((s.tickets || 0) < 1) return null;
    s.tickets -= 1;
    s.stats.rolls = (s.stats.rolls || 0) + 1;
    var sp = special();
    var id = sp;
    if (!id) {
      var missing = E.missing();
      if (missing.length && (s.dry || 0) >= E.PITY - 1) {
        id = missing[Math.floor(Math.random() * missing.length)];
      } else {
        id = pickId();
        if (s.zukan[id]) { var again = pickId(); if (!s.zukan[again]) id = again; }
      }
    }
    var isNew = E.register(id);
    K.rt.maxRubRate = 0;
    if (isNew) {
      s.dry = 0;
      s.species = id;
      s.trait = E.info(id).trait || s.trait;
      E.queue.push({ type: 'roll', from: '2-plain', to: id, stage: sp ? null : parseInt(id, 10), isNew: true });
    } else {
      // ダブりは スタンプに なる。つくえの カスは そのまま（たいかに みえないように）
      s.dry = (s.dry || 0) + 1;
      s.stamps = (s.stamps || 0) + 1;
    }
    return { id: id, isNew: isNew };
  };

  // スタンプで こうかん できるか（まだ みつけていなくて、いま まるめて でる かのうせいが ある もの）
  E.canTrade = function (id) {
    return E.missing().indexOf(id) >= 0;
  };
  E.trade = function (id) {
    var s = S();
    if (!E.canTrade(id) || (s.stamps || 0) < E.STAMPS) return false;
    s.stamps -= E.STAMPS;
    E.register(id);
    s.species = id;
    s.trait = E.info(id).trait || s.trait;
    E.queue.push({ type: 'roll', from: '2-plain', to: id, stage: parseInt(id, 10), isNew: true });
    return true;
  };

  // あつめた つぶで つぎの だんかいが でるように なる
  E.check = function () {
    var target = E.stageFor(S().totalCrumbs);
    if (target > S().stage) {
      S().stage = target;
      S().tickets = (S().tickets || 0) + E.TIER_TICKETS;
      E.unlocked.push(target);
    }
  };
  E.unlocked = [];

  // ずかんから えらんで つくえに おく
  E.setDesk = function (id) {
    if (!S().zukan[id]) return false;
    S().species = id;
    return true;
  };

  E.title = function () {
    var n = E.foundCount();
    if (n >= 56) return { ja: 'カスの かみさま', en: 'Crumb Deity' };
    if (n >= 30) return { ja: 'カスはかせ', en: 'Crumb Scholar' };
    if (n >= 10) return { ja: 'カスはかせ みならい', en: 'Crumb Scholar Trainee' };
    return { ja: 'カスの ともだち', en: 'Crumb Friend' };
  };

  K.evo = E;
})(window.K = window.K || {});
