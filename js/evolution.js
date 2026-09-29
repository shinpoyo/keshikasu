// あつめる・ずかん（企画書 7章、10章）
// つぶを「まるめる」と あたらしい カスが 1ぴき できる。だんかい（STAGE）は この周に あつめた つぶで ふえ、
// まるめると そのなかから ランダム。けいとうは いま まぜている ざいりょうで きまる。ずかんの しゅるい 1つにつき /s +2%
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
    var matId = null;
    K.data.materials.forEach(function (m) { if (m.trait === S().trait && m.cost > 0) matId = m.id; });
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

  // まるめる ねだん: いまの だんかいの きほん × 1.35^(この だんかいで まるめた かず)
  var ROLL_BASE = [10, 60, 4000, 4e5, 4e8, 4e11, 4e14];
  E.rollCost = function () {
    var s = S();
    var d = K.game.hasShard('discount') ? 0.95 : 1;
    return Math.ceil(ROLL_BASE[s.stage - 1] * Math.pow(1.35, s.rollsAtTier || 0) * d);
  };

  // でる だんかい: いちばん うえ 40%、ひとつ した 25%、のこりは それより したから
  function pickStage() {
    var top = S().stage, r = Math.random();
    if (top === 1) return 1;
    if (r < 0.4) return top;
    if (r < 0.65 || top === 2) return top - 1;
    return 1 + Math.floor(Math.random() * (top - 2));
  }

  // まるめる。ダブったら 1かいだけ ひきなおし、それでも ダブったら ねだんの はんぶんが かえってくる
  E.roll = function () {
    var s = S();
    var cost = E.rollCost();
    if (s.crumbs < cost) return null;
    s.crumbs -= cost;
    s.rollsAtTier = (s.rollsAtTier || 0) + 1;
    s.stats.rolls = (s.stats.rolls || 0) + 1;
    var sp = special();
    var id = sp || K.speciesId(pickStage(), s.trait);
    if (!sp && s.zukan[id]) {
      var again = K.speciesId(pickStage(), s.trait);
      if (!s.zukan[again]) id = again;
    }
    var isNew = E.register(id);
    s.species = id;
    K.rt.maxRubRate = 0;
    var refund = 0;
    if (isNew) E.queue.push({ type: 'roll', from: '2-plain', to: id, stage: sp ? null : parseInt(id, 10), isNew: true });
    else { refund = Math.floor(cost / 2); s.crumbs += refund; }
    return { id: id, isNew: isNew, refund: refund };
  };

  // あつめた つぶで つぎの だんかいが でるように なる
  E.check = function () {
    var target = E.stageFor(S().totalCrumbs);
    if (target > S().stage) {
      S().stage = target;
      S().rollsAtTier = 0;
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
