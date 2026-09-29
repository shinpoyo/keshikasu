// カスニュース（企画書 6-5）と ひとりごと（9章）の えらびかた
(function (K) {
  'use strict';
  var S = function () { return K.state; };

  function ok(w) {
    var s = S();
    if (!w) return true;
    if (w.b && s.buildings[w.b[0]] < w.b[1]) return false;
    if (typeof w.b === 'string' && s.buildings[w.b] < 1) return false;
    if (w.stage && s.stage < w.stage) return false;
    if (w.maxStage && s.stage > w.maxStage) return false;
    if (w.total && s.totalCrumbs < w.total) return false;
    if (w.rebirth && s.stats.rebirths < w.rebirth) return false;
    if (w.golden && s.stats.golden < w.golden) return false;
    if (w.trait && s.trait !== w.trait) return false;
    return true;
  }

  // 条件つきのニュースを すこし優先する（すすみ具合が わかるように）
  var recent = [];
  function pickNews() {
    var list = K.data.news.filter(function (n) { return ok(n.when) && recent.indexOf(n) < 0; });
    if (!list.length) { recent = []; return pickNews(); }
    var cond = list.filter(function (n) { return Object.keys(n.when).length; });
    var pool = cond.length && Math.random() < 0.6 ? cond : list;
    var n = pool[Math.floor(Math.random() * pool.length)];
    recent.push(n);
    if (recent.length > 12) recent.shift();
    return K.L(n);
  }

  var lastMono = null;
  function pickMonologue(kind) {
    var list = (K.data.monologues[kind] || []).filter(function (m) { return ok(m.when) && m !== lastMono; });
    if (!list.length) return null;
    // 条件つきのものを すこし優先
    var cond = list.filter(function (m) { return Object.keys(m.when).length; });
    var pool = cond.length && Math.random() < 0.4 ? cond : list;
    lastMono = pool[Math.floor(Math.random() * pool.length)];
    return K.L(lastMono);
  }

  K.news = { pick: pickNews, monologue: pickMonologue };
})(window.K = window.K || {});
