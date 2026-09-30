// ゲストけしゴム（ゴールデンけしゴムも ここ）。企画書 6-4 の ゴールデンカスを ひろげたもの
// 2〜5ふんに 1かい、つくえに 1こ やってくる。10かいに 1かいくらいは ゴールデン
(function (K) {
  'use strict';
  var GS = {};
  var S = function () { return K.state; };
  var LIFETIME = 15;       // 画面に いる びょうすう
  var GOLDEN_CHANCE = 0.1; // ゴールデンが くる わりあい
  GS.ROCKET_TAPS = 3;
  GS.KADO_RUBS = 28;

  GS.current = null;   // { id, x, y, until, taps }
  GS.nextAt = 0;

  GS.byId = {};
  K.data.guests.forEach(function (g) { GS.byId[g.id] = g; });

  // ゴールデンの アップグレードは「くる わりあい」を ふやす
  function goldenMult() {
    var m = 1;
    if (K.game.has('g1')) m *= 2;
    if (K.game.hasShard('goldenFreq')) m *= 1.1;
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
    var list = GS.unlocked();
    if (!list.length || Math.random() < Math.min(GOLDEN_CHANCE * goldenMult(), 0.5)) return 'golden';
    return list[Math.floor(Math.random() * list.length)].id;
  }

  GS.schedule = function () {
    var min = 120, max = 300; // 2〜5ふん
    GS.nextAt = Date.now() + (min + Math.random() * (max - min)) * 1000;
  };

  GS.update = function () {
    var now = Date.now();
    if (GS.current && now > GS.current.until) {
      GS.current = null;
      GS.schedule();
    }
    if (!GS.current && GS.nextAt && now >= GS.nextAt && S().tutorial >= 9) {
      GS.current = { id: pick(), x: 0.1 + Math.random() * 0.8, y: 0.15 + Math.random() * 0.7, until: now + LIFETIME * 1000, taps: 0 };
      GS.nextAt = 0;
    }
  };

  // デバッグ・テスト用: すぐ出す
  GS.spawnNow = function (id) {
    GS.current = { id: GS.byId[id] ? id : 'golden', x: 0.5, y: 0.5, until: Date.now() + LIFETIME * 1000, taps: 0 };
  };

  // じかんで きえる こうか（K.rt.buffs）。src は アイコンに つかう けしゴム
  GS.EFFECTS = {
    lucky: { src: 'golden', name: { ja: 'ラッキー！', en: 'Lucky!' } },
    frenzy: { src: 'golden', gold: true, name: { ja: 'キラキラタイム！', en: 'Sparkle Frenzy!' }, desc: { ja: '/s が 7ばい', en: '/s x7' }, short: { ja: 'x7', en: 'x7' }, dur: 77 },
    scrub: { src: 'golden', gold: true, name: { ja: 'ごりごりタイム！', en: 'Scrub Frenzy!' }, desc: { ja: 'こする ちからが 777ばい', en: 'Rubbing x777' }, short: { ja: 'こする x777', en: 'Rub x777' }, dur: 13 },
    kado: { src: 'kadokeshi', name: { ja: 'かどけし！', en: 'Corner Eraser!' }, desc: { ja: 'こするのが 10ばい', en: 'Rubbing x10' }, short: { ja: 'x10', en: 'x10' } },
    sand: { src: 'sand', name: { ja: 'ごしごしタイム！', en: 'Sanding Time!' }, desc: { ja: 'じどうで こする（けしゴムも はやく へる）', en: 'Auto rubbing (your eraser wears faster)' }, short: { ja: 'じどう', en: 'Auto' }, dur: 20 },
    kaori: { src: 'kaori', name: { ja: 'いいにおい！', en: 'Sweet Smell!' }, desc: { ja: '/s が 2ばい', en: '/s x2' }, short: { ja: 'x2', en: 'x2' }, dur: 60 }
  };

  function addBuff(id, dur) {
    K.rt.buffs[id] = { until: Date.now() + dur * 1000, dur: dur };
  }

  function count(id) {
    var st = S().stats;
    if (!st.guests || typeof st.guests !== 'object') st.guests = {};
    st.guests[id] = (st.guests[id] || 0) + 1;
    if (id === 'golden') st.golden++;
  }

  // おした → こうかを 1つ。戻り値は 画面に 出す じょうほう { id, effect, gain, left, stay }
  GS.click = function () {
    var cur = GS.current;
    if (!cur) return null;
    var id = cur.id, res = { id: id };
    if (id !== 'rocket' || cur.taps === 0) count(id);

    if (id === 'rocket') {
      // タップするたびに つぎの こまが とびだす。3かいで おしまい
      cur.taps++;
      res.gain = Math.max(K.game.cps() * 300, K.game.clickPower() * 50);
      K.game.earn(res.gain, false);
      res.left = GS.ROCKET_TAPS - cur.taps;
      res.stay = res.left > 0;
      if (res.stay) cur.until = Math.max(cur.until, Date.now() + 4000);
    } else if (id === 'golden') {
      var r = Math.random();
      res.effect = r < 0.45 ? 'lucky' : (r < 0.85 ? 'frenzy' : 'scrub');
      if (res.effect === 'lucky') {
        res.gain = Math.min(K.game.cps() * 900, S().crumbs * 0.15) + 13;
        K.game.earn(res.gain, false);
      } else {
        addBuff(res.effect, GS.EFFECTS[res.effect].dur * durMult());
      }
    } else if (id === 'kadokeshi') {
      K.rt.kadoLeft = GS.KADO_RUBS;
      res.effect = 'kado';
    } else if (id === 'sand') {
      addBuff('sand', GS.EFFECTS.sand.dur);
      res.effect = 'sand';
    } else if (id === 'neri') {
      // ちらかった カスを ぜんぶ まとめる（「ふく」の 5ばい）。ちらかって いなくても すこしは ある
      var mess = Math.max(K.rt.mess || 0, K.game.MESS_MAX / 2);
      res.gain = mess * K.game.clickPower() * 0.5 * 5;
      K.game.earn(res.gain, false);
      K.rt.mess = 0;
    } else if (id === 'kaori') {
      addBuff('kaori', GS.EFFECTS.kaori.dur);
      res.effect = 'kaori';
    }

    if (!res.stay) {
      GS.current = null;
      GS.schedule();
    }
    if (K.sound) K.sound.play(id === 'golden' ? 'golden' : 'upgrade');
    return res;
  };

  // いま きいている こうか（あたらしい じゅん ではなく きまった じゅん）
  GS.activeBuffs = function () {
    var now = Date.now(), out = [];
    ['frenzy', 'scrub', 'kaori', 'sand'].forEach(function (id) {
      var b = K.rt.buffs[id];
      if (b && now < b.until) out.push({ id: id, left: (b.until - now) / 1000, ratio: (b.until - now) / 1000 / b.dur });
    });
    if (K.rt.kadoLeft > 0) out.push({ id: 'kado', count: K.rt.kadoLeft, ratio: K.rt.kadoLeft / GS.KADO_RUBS });
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
