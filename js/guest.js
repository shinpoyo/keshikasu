// ゲストけしゴム（ゴールデンけしゴムも ここ）。企画書 6-4 の ゴールデンカスを ひろげたもの
// ふつうの けしゴムは 1ぷんはん〜4ふんに 1かい。ゴールデンは べつの 予定で 5〜15ふんに 1かい。
// べつべつに 来るので、2こ いっしょに うかぶ ことも ある（こうかが かさなる）
(function (K) {
  'use strict';
  var GS = {};
  var S = function () { return K.state; };
  var LIFETIME = 15;       // 画面に いる びょうすう
  GS.ROCKET_RUBS = 10;    // この かず こすると こまが 1こ とれる

  // ★: 使った かずで 上がる（生まれ変わっても のこる stats.guests で かぞえる）
  GS.STAR_AT = [1, 3, 7, 15, 30];
  // ★ごとの つよさ。i = ★-1（0〜4）。★5 は とくべつな おまけ つき
  GS.STAR = {
    kadokeshi: function (i) { return { rubs: 28 + i * 7, mult: i >= 4 ? 15 : 10 }; },
    sand: function (i) { return { dur: 20 + i * 5, noWear: i >= 4 }; },
    neri: function (i) { return { dur: [15, 18, 21, 24, 30][i], mult: i >= 4 ? 8 : 5 }; },
    kaori: function (i) { return { dur: 60 + i * 15, mult: i >= 4 ? 3 : 2 }; },
    rocket: function (i) { return { pieces: 5 + i, lastBig: i >= 4 }; },
    dendo: function (i) { return { dur: 30 + i * 5, mult: i >= 4 ? 5 : 3 }; },
    jumbo: function (i) { return { rubs: 7 + i, mins: i >= 4 ? 20 : 10 }; }
  };

  GS.uses = function (id) { var g = S().stats.guests; return (g && Number(g[id])) || 0; };
  GS.stars = function (id) {
    if (!GS.STAR[id]) return 0;
    var n = GS.uses(id), s = 0;
    GS.STAR_AT.forEach(function (a) { if (n >= a) s++; });
    return s;
  };
  // その ★の つよさ（★0 = まだ 使って いない ときは ★1 の つよさ）
  GS.power = function (id, star) {
    if (star == null) star = GS.stars(id);
    return GS.STAR[id](Math.max(0, Math.min(4, star - 1)));
  };
  // つぎの ★まで あと なん回（★5 なら 0）
  GS.toNext = function (id) {
    var s = GS.stars(id);
    return s >= 5 ? 0 : GS.STAR_AT[s] - GS.uses(id);
  };

  GS.current = null;   // ふつうの けしゴム { id, x, y, until }
  GS.nextAt = 0;
  GS.gold = null;      // ゴールデン（べつの 予定）
  GS.goldAt = 0;

  GS.byId = {};
  K.data.guests.forEach(function (g) { GS.byId[g.id] = g; });

  // ゴールデンの アップグレードは 来る かいすうを ふやす
  function goldenMult() {
    var m = 1;
    if (K.game.has('g1')) m *= 2;
    if (K.game.hasShard('goldenFreq')) m *= 1.1;
    if (K.game.hasShard('goldenMore')) m *= 1.15;
    return m;
  }

  function durMult() {
    var m = 1;
    if (K.game.has('g2')) m *= 2;
    if (K.game.hasShard('goldenLong')) m *= 1.5;
    return m;
  }

  // いま くる ことが できる ゴールデン いがいの けしゴム
  GS.unlocked = function () {
    var top = K.evo.maxStageFound();
    return K.data.guests.filter(function (g) { return g.id !== 'golden' && g.stage <= top; });
  };

  function pick() {
    if (K.drawer && K.drawer.takeGold()) return 'golden'; // ひきだしの 金のこな
    var list = GS.unlocked();
    return list.length ? list[Math.floor(Math.random() * list.length)].id : null;
  }

  function guestMult() {
    return K.drawer && K.drawer.buffActive('guest2') ? 2 : 1; // ひきだしの ほこり
  }
  GS.schedule = function () {
    var min = 90, max = 240; // 1ぷんはん〜4ふん
    GS.nextAt = Date.now() + (min + Math.random() * (max - min)) * 1000 / guestMult();
  };
  GS.scheduleGold = function () {
    var min = 300, max = 900; // 5〜15ふん（アップグレードで みじかく なる）
    GS.goldAt = Date.now() + (min + Math.random() * (max - min)) * 1000 / goldenMult() / guestMult();
  };

  // ばしょ。もう 1こ いたら はんたいがわに
  function come(id, other) {
    var x = 0.1 + Math.random() * 0.35;
    if (other ? other.x < 0.5 : Math.random() < 0.5) x += 0.45;
    return { id: id, x: x, y: 0.15 + Math.random() * 0.7, until: Date.now() + LIFETIME * 1000 };
  }

  // 見えない あいだ（ブラウザの ほかの タブ・進化の 演出）は 来ないで まつ。
  // 来ている けしゴムの 15びょうも とめる（見ていない あいだに 帰って しまわないように）
  // ずかん・じっせきなどの 画面を 開いて いる ときは、その 上に うかぶ（css の .guest の z-index）
  function busy() {
    return document.hidden || (K.screens && K.screens.evoOpen());
  }

  var lastUpdate = 0;
  GS.update = function () {
    var now = Date.now();
    var dt = lastUpdate ? Math.max(0, now - lastUpdate) : 0; // ねむって いた じかんも ぜんぶ
    lastUpdate = now;
    var stalled = dt > 2000; // タブが ねむって いた
    if (busy() || stalled) {
      if (GS.current) GS.current.until += dt;
      if (GS.gold) GS.gold.until += dt;
      // 来る 予定も とめる（見ていない あいだに じかんが すすまない）
      if (GS.nextAt) GS.nextAt += dt;
      if (GS.goldAt) GS.goldAt += dt;
      if (busy()) return;
    }
    if (GS.current && now > GS.current.until) {
      GS.current = null;
      GS.schedule();
    }
    if (GS.gold && now > GS.gold.until) {
      GS.gold = null;
      GS.scheduleGold();
    }
    if (S().tutorial < 9) return;
    if (!GS.goldAt && !GS.gold) GS.scheduleGold();
    if (!GS.current && GS.nextAt && now >= GS.nextAt) {
      var id = pick();
      if (id) { GS.current = come(id, GS.gold); GS.nextAt = 0; }
      else GS.schedule();
    }
    if (!GS.gold && now >= GS.goldAt) {
      GS.gold = come('golden', GS.current);
      GS.goldAt = 0;
    }
  };

  // デバッグ・テスト用: すぐ出す
  GS.spawnNow = function (id) {
    id = GS.byId[id] ? id : 'golden';
    if (id === 'golden') GS.gold = come(id, GS.current);
    else GS.current = come(id, GS.gold);
  };

  // じかんで きえる こうか（K.rt.buffs）。src は アイコンに つかう けしゴム
  GS.EFFECTS = {
    lucky: { src: 'golden', name: { ja: 'ラッキー！', en: 'Lucky!' } },
    frenzy: { src: 'golden', gold: true, name: { ja: 'キラキラタイム！', en: 'Sparkle Frenzy!' }, desc: { ja: '/s が 7倍', en: '/s x7' }, short: { ja: 'x7', en: 'x7' }, dur: 77 },
    scrub: { src: 'golden', gold: true, name: { ja: 'ごりごりタイム！', en: 'Scrub Frenzy!' }, desc: { ja: 'こする力が 777倍', en: 'Rubbing x777' }, short: { ja: 'こする x777', en: 'Rub x777' }, dur: 13 },
    kado: { src: 'kadokeshi', name: { ja: 'かどけし！', en: 'Corner Eraser!' }, short: { ja: 'x10', en: 'x10' } },
    sand: { src: 'sand', name: { ja: 'ごしごしタイム！', en: 'Sanding Time!' }, short: { ja: '自動', en: 'Auto' } },
    kaori: { src: 'kaori', name: { ja: 'いいにおい！', en: 'Sweet Smell!' }, short: { ja: 'x2', en: 'x2' } },
    neri: { src: 'neri', name: { ja: 'ねりねりタイム！', en: 'Knead Time!' }, short: { ja: 'くっつく', en: 'Sticky' } },
    rocket: { src: 'rocket', name: { ja: 'ロケット消しゴム！', en: 'Rocket Eraser!' }, desc: { ja: '10回こするとこまが飛び出す', en: 'Every 10 rubs, a piece pops out' }, short: { ja: 'こま', en: 'Pieces' } },
    dendo: { src: 'dendo', name: { ja: 'ウィーン！', en: 'Whirrrr!' }, short: { ja: 'x3', en: 'x3' } },
    jumbo: { src: 'jumbo', name: { ja: 'ジャンボ消しゴム！', en: 'Jumbo Eraser!' }, desc: { ja: 'こするたびに、どうぐ10分ぶんのカス', en: 'Each rub gives 10 minutes of tool output' }, short: { ja: 'ジャンボ', en: 'Jumbo' } },
    goldflash: { dur: 3 }
  };

  // ★で かわる 説明（遊ぶ 人に 見せる ことば）
  GS.effectText = function (id, star, lang) {
    var p = GS.power(id, star), l = lang || K.lang();
    var T = function (key) { return K.tIn(l, key, p); };
    switch (id) {
      case 'kadokeshi': return T('effKado');
      case 'sand': return T('effSand') + (p.noWear ? '' : T('effSandWear'));
      case 'neri': return T('effNeri');
      case 'kaori': return T('effKaori');
      case 'rocket': return T('effRocket') + (p.lastBig ? T('effRocketBig') : '');
      case 'dendo': return T('effDendo');
      case 'jumbo': return T('effJumbo');
    }
    return '';
  };
  // ★5 に なると つく おまけ
  GS.star5Text = function (id) {
    return GS.STAR[id] ? K.t('star5_' + id) : '';
  };

  // いま もっている ゲストけしゴム（あたらしく つかった ものが まえ）
  function holding(id) {
    if (id === 'golden') return K.game.buffActive('frenzy') || K.game.buffActive('scrub') || K.game.buffActive('goldflash');
    if (id === 'kadokeshi') return K.rt.kadoLeft > 0;
    if (id === 'rocket') return !!K.rt.rocket && K.rt.rocket.left > 0;
    if (id === 'jumbo') return !!K.rt.jumbo && K.rt.jumbo.left > 0;
    return K.game.buffActive(id);
  }
  function hold(id) {
    K.rt.hold = (K.rt.hold || []).filter(function (x) { return x !== id; });
    K.rt.hold.push(id);
  }
  GS.held = function () {
    var h = (K.rt.hold || []).filter(holding);
    K.rt.hold = h;
    return h.length ? h[h.length - 1] : null;
  };

  // こすった ときに よぶ（js/main.js）。ねりけしの ボーナスと ロケットの こまを かえす
  GS.onRub = function (p) {
    var out = { bonus: 0, pop: 0 };
    if (K.game.buffActive('neri')) {
      // ちらかった カスも いま こすった カスも ぜんぶ くっつける
      out.bonus = ((K.rt.mess || 0) + 1) * p * 0.5 * (K.rt.neriMult || 5);
      K.rt.mess = 0;
      out.sticky = true;
    }
    var r = K.rt.rocket;
    if (r && r.left > 0 && ++r.rubs >= GS.ROCKET_RUBS) {
      r.rubs = 0;
      r.left--;
      out.pop = Math.max(K.game.cps() * 180, p * 30); // /s の 3ぷんぶん
      if (r.left <= 0) {
        if (r.lastBig) { out.pop *= 3; out.big = true; } // ★5: 最後の こまは 大当たり
        K.rt.rocket = null;
      }
    }
    var j = K.rt.jumbo;
    if (j && j.left > 0) {
      j.left--;
      out.jumbo = Math.max(K.game.cps() * 60 * j.mins, p * 20);
      if (j.left <= 0) K.rt.jumbo = null;
    }
    return out;
  };

  // バーと おしらせに 出す ことばを いまの ★に あわせる
  function setText(id, star) {
    var e = GS.EFFECTS[id === 'kadokeshi' ? 'kado' : id], p = GS.power(id, star);
    e.desc = {};
    K.LANGS.forEach(function (x) { e.desc[x.id] = GS.effectText(id, star, x.id); });
    if (p.mult) e.short = { ja: 'x' + p.mult, en: 'x' + p.mult };
  }

  // おなじ こうかが まだ ついて いたら、のこりに たす（かさねがけ）
  function addBuff(id, dur) {
    var now = Date.now(), b = K.rt.buffs[id];
    var until = (b && b.until > now ? b.until : now) + dur * 1000;
    K.rt.buffs[id] = { until: until, dur: (until - now) / 1000 };
  }

  function count(id) {
    var st = S().stats;
    if (!st.guests || typeof st.guests !== 'object') st.guests = {};
    st.guests[id] = (st.guests[id] || 0) + 1;
    if (id === 'golden') st.golden++;
  }

  // おした → こうかを 1つ。戻り値は 画面に 出す じょうほう { id, effect, gain }
  // gold: ゴールデンの ほうを おした
  GS.click = function (gold) {
    var cur = gold ? GS.gold : GS.current;
    if (!cur) return null;
    var id = cur.id, res = { id: id, effect: id, gold: !!gold };
    var before = GS.stars(id);
    count(id);
    var star = GS.stars(id);
    if (GS.STAR[id] && star > before && before > 0) res.starUp = star; // はじめて 使った ときは ★1 なので いわない
    var pw = GS.STAR[id] ? GS.power(id, star) : null;
    if (gold) { GS.gold = null; GS.scheduleGold(); }
    else { GS.current = null; GS.schedule(); }

    if (id === 'golden') {
      var r = Math.random();
      res.effect = r < 0.45 ? 'lucky' : (r < 0.85 ? 'frenzy' : 'scrub');
      if (res.effect === 'lucky') {
        res.gain = Math.min(K.game.cps() * 900, S().crumbs * 0.15) + 13;
        K.game.earn(res.gain, false);
        addBuff('goldflash', GS.EFFECTS.goldflash.dur); // すぐ おわるので 3びょうだけ きんいろに もちかえる
      } else {
        var dur = res.effect === 'frenzy' && K.game.hasShard('frenzyLong') ? 120 : GS.EFFECTS[res.effect].dur;
        addBuff(res.effect, dur * durMult());
      }
    } else if (id === 'kadokeshi') {
      K.rt.kadoLeft = K.rt.kadoMax = Math.max(0, K.rt.kadoLeft || 0) + pw.rubs; // のこりに たす
      K.rt.kadoMult = pw.mult;
      res.effect = 'kado';
    } else if (id === 'rocket') {
      var rk = K.rt.rocket && K.rt.rocket.left > 0 ? K.rt.rocket : null; // こまを つぎたす
      var left = (rk ? rk.left : 0) + pw.pieces;
      K.rt.rocket = { left: left, max: left, rubs: rk ? rk.rubs : 0, lastBig: pw.lastBig || !!(rk && rk.lastBig) };
    } else if (id === 'jumbo') {
      var jl = (K.rt.jumbo && K.rt.jumbo.left > 0 ? K.rt.jumbo.left : 0) + pw.rubs;
      K.rt.jumbo = { left: jl, max: jl, mins: Math.max(pw.mins, (K.rt.jumbo && K.rt.jumbo.mins) || 0) };
    } else {
      // sand・neri・kaori・dendo
      if (id === 'neri') K.rt.neriMult = pw.mult;
      if (id === 'kaori') K.rt.kaoriMult = pw.mult;
      if (id === 'dendo') K.rt.dendoMult = pw.mult;
      if (id === 'sand') K.rt.sandNoWear = pw.noWear;
      addBuff(id, pw.dur);
    }
    if (pw) setText(id, star);
    hold(id);

    if (K.sound) K.sound.play(id === 'golden' ? 'golden' : 'upgrade');
    return res;
  };

  // いま きいている こうか（あたらしい じゅん ではなく きまった じゅん）
  GS.activeBuffs = function () {
    var now = Date.now(), out = [];
    ['frenzy', 'scrub', 'kaori', 'sand', 'neri', 'dendo'].forEach(function (id) {
      var b = K.rt.buffs[id];
      if (b && now < b.until) out.push({ id: id, left: (b.until - now) / 1000, ratio: (b.until - now) / 1000 / b.dur });
    });
    if (K.rt.kadoLeft > 0) out.push({ id: 'kado', count: K.rt.kadoLeft, ratio: K.rt.kadoLeft / (K.rt.kadoMax || 28) });
    if (K.rt.rocket) out.push({ id: 'rocket', pieces: K.rt.rocket.left, ratio: K.rt.rocket.left / (K.rt.rocket.max || 5) });
    if (K.rt.jumbo) out.push({ id: 'jumbo', count: K.rt.jumbo.left, ratio: K.rt.jumbo.left / K.rt.jumbo.max });
    if (K.drawer) out = out.concat(K.drawer.activeBuffs());
    if (K.ads) out = out.concat(K.ads.activeBuffs());
    return out;
  };

  GS.total = function () {
    // ゴールデンは まえの セーブの ぶんも ふくめて stats.golden で かぞえる
    var g = S().stats.guests || {}, n = S().stats.golden || 0;
    Object.keys(g).forEach(function (k) { if (k !== 'golden') n += Number(g[k]) || 0; });
    return n;
  };

  GS.goldActive = function () { return K.game.buffActive('frenzy') || K.game.buffActive('scrub'); };

  K.guest = GS;
})(window.K = window.K || {});
