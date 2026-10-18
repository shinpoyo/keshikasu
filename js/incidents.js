// ふしぎなできごと（序盤の ボケ）。data/incidents.js の じゅんに 1つずつ、いちどだけ おこる
// つくえに「！」が うかぶ → おすと お話の 画面 → えらぶと オチと ごほうび
(function (K) {
  'use strict';
  var I = {};
  var S = function () { return K.state; };
  var GAP = 90 * 1000; // ミリびょう。つぎの できごとまで すくなくとも これだけ あける

  I.byId = {};
  K.data.incidents.forEach(function (x, i) { x.no = i + 1; I.byId[x.id] = x; });

  I.current = null;   // いま つくえに 出ている できごとの id
  var nextAt = 0;

  function seen() { return S().incidents || (S().incidents = {}); }
  I.seenCount = function () { return Object.keys(seen()).filter(function (id) { return I.byId[id]; }).length; };
  I.total = K.data.incidents.length;

  I.update = function () {
    var s = S();
    if (I.current || s.tutorial < 9 || Date.now() < nextAt) return;
    if (K.screens.isOpen() || K.screens.evoOpen()) return;
    var list = K.data.incidents;
    for (var i = 0; i < list.length; i++) {
      var x = list[i];
      if (seen()[x.id]) continue;
      if (K.news.ok(x.when)) { I.current = x.id; if (K.sound) K.sound.play('guest'); }
      return; // じゅんばん どおり。まだの ものが あれば その先には 行かない
    }
  };

  I.reward = function (x) {
    return Math.max(x.min, K.game.cps() * x.sec);
  };

  // えらんだ。ごほうびを わたして、もう おこらない ように する
  I.choose = function (id, n) {
    var x = I.byId[id];
    if (!x || seen()[id]) return 0;
    var gain = I.reward(x);
    K.game.earn(gain, false);
    seen()[id] = { at: Date.now(), pick: n };
    I.current = null;
    nextAt = Date.now() + GAP;
    K.store.save();
    return gain;
  };

  K.incident = I;
})(window.K = window.K || {});
