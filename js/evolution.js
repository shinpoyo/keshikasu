// しんか・ずかん（企画書 7章、10章）
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
      return { id: id, special: true, stage: sp.art, trait: null, name: sp.name, line: sp.line, hint: sp.hint,
        art: K.art.kasuSrc(sp.art), filter: sp.filter, crown: sp.crown };
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
      art: K.art.kasuSrc(n), filter: tr.filter };
  };

  E.register = function (id) {
    if (S().zukan[id]) return false;
    var matId = null;
    K.data.materials.forEach(function (m) { if (m.trait === S().trait) matId = m.id; });
    S().zukan[id] = { at: Date.now(), mat: matId };
    return true;
  };

  E.foundCount = function () { return Object.keys(S().zukan).length; };

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

  function evolveTo(n) {
    var s = S();
    var from = s.species;
    var sp = special();
    var id = sp || K.speciesId(n, s.trait);
    s.stage = n;
    s.species = id;
    var isNew = E.register(id);
    K.rt.maxRubRate = 0;
    E.queue.push({ type: 'evolve', from: from, to: id, stage: n, isNew: isNew });
    if (K.sound) K.sound.play('evolve');
  }

  // 毎フレーム呼ぶ。1回に1だんかいずつ上げる
  E.check = function () {
    var target = E.stageFor(S().totalCrumbs);
    if (target > S().stage) evolveTo(S().stage + 1);
  };

  // 材料を まぜた → いまの だんかいの まま けいとうが かわる
  E.mix = function () {
    var s = S();
    var from = s.species;
    var id = K.speciesId(s.stage, s.trait);
    s.species = id;
    var isNew = E.register(id);
    E.queue.push({ type: 'mix', from: from, to: id, stage: s.stage, isNew: isNew });
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
