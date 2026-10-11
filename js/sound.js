// 効果音と BGM（Web Audio API で合成。音声ファイルなし、企画書 2章）
// つくり: 音は ぜんぶ「(E, p) で 鳴らす 関数」。E = { c: AudioContext, t: 開始時刻, out: 出力先, verb: リバーブの 入口 }
// 本番は 本物の AudioContext、テストは OfflineAudioContext で 同じ 関数を 使う。
(function (K) {
  'use strict';
  var ctx = null, bus = null;
  var BGM_GAIN = 0.45;     // BGM は 効果音より 小さく
  var SFX_GAIN = 2;

  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  // ---------- 音の通り道: 効果音/BGM → マスター → コンプレッサー → スピーカー ----------
  function build(c) {
    var b = { c: c };
    b.comp = c.createDynamicsCompressor();      // 音の大きさを そろえる（急に 大きく ならない）
    b.comp.threshold.value = -16; b.comp.knee.value = 18; b.comp.ratio.value = 5;
    b.comp.attack.value = 0.004; b.comp.release.value = 0.22;
    b.lim = c.createDynamicsCompressor();       // 最後の リミッター（たまに 重なっても 割れない）
    b.lim.threshold.value = -4; b.lim.knee.value = 0; b.lim.ratio.value = 20;
    b.lim.attack.value = 0.001; b.lim.release.value = 0.08;
    b.master = c.createGain(); b.master.gain.value = 0.8;
    b.master.connect(b.comp); b.comp.connect(b.lim); b.lim.connect(c.destination);
    b.sfx = c.createGain(); b.sfx.gain.value = SFX_GAIN; b.sfx.connect(b.master);
    b.bgm = c.createGain(); b.bgm.gain.value = BGM_GAIN; b.bgm.connect(b.master);
    // リバーブ（ふわっとした ひろがり）: 自分で 作った インパルス
    var len = Math.floor(c.sampleRate * 1.8), imp = c.createBuffer(2, len, c.sampleRate);
    for (var ch = 0; ch < 2; ch++) {
      var d = imp.getChannelData(ch);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    b.verbIn = c.createGain();
    var conv = c.createConvolver(); conv.buffer = imp;
    var vlp = c.createBiquadFilter(); vlp.type = 'lowpass'; vlp.frequency.value = 5200;
    var vout = c.createGain(); vout.gain.value = 0.55;
    b.verbIn.connect(conv); conv.connect(vlp); vlp.connect(vout); vout.connect(b.master);
    return b;
  }
  function ac() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { ctx = new AC(); bus = build(ctx); } catch (e) { ctx = null; return null; }
      applyVolume();
    }
    if (ctx.state === 'suspended' && !document.hidden) ctx.resume();
    return ctx;
  }
  function E(c, b, t, isBgm) { return { c: c, t: t, out: isBgm ? b.bgm : b.sfx, verb: b.verbIn }; }

  // ---------- 材料 ----------
  function route(e, node, o) {
    var c = e.c;
    if (o.pan && c.createStereoPanner) { var p = c.createStereoPanner(); p.pan.value = o.pan; node.connect(p); node = p; }
    node.connect(e.out);
    if (o.verb) { var s = c.createGain(); s.gain.value = o.verb; node.connect(s); s.connect(e.verb); }
  }
  // 音程の ある 音（立ち上がり→のびる→消える）
  function tone(e, o) {
    var c = e.c, t = e.t + (o.t || 0), dur = o.dur || 0.2, a = o.a || 0.006, vol = o.vol == null ? 0.12 : o.vol;
    var osc = c.createOscillator(), g = c.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.f, t);
    if (o.f2) osc.frequency.exponentialRampToValueAtTime(o.f2, t + dur);
    if (o.det) osc.detune.value = o.det;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    var last = g;
    if (o.lp) { var f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lp; g.connect(f); last = f; }
    route(e, last, o);
    osc.start(t); osc.stop(t + dur + 0.05);
  }
  // ベル（キラッとした 音）: 基本の 音 ＋ 高い 倍音
  function bell(e, o) {
    var v = o.vol == null ? 0.1 : o.vol, d = o.dur || 0.5;
    tone(e, { f: o.f, t: o.t, dur: d, vol: v, a: 0.004, verb: o.verb == null ? 0.25 : o.verb, pan: o.pan });
    tone(e, { f: o.f * 2.76, t: o.t, dur: d * 0.45, vol: v * 0.32, a: 0.002, pan: o.pan });
    tone(e, { f: o.f * 5.4, t: o.t, dur: d * 0.2, vol: v * 0.12, a: 0.002, pan: o.pan });
  }
  // ざらざら・ひゅー（ノイズ）
  function noiseBuf(c) {
    if (!c._nb) {
      var n = c.sampleRate, buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      c._nb = buf;
    }
    return c._nb;
  }
  function noise(e, o) {
    var c = e.c, t = e.t + (o.t || 0), dur = o.dur || 0.08, a = o.a || 0.004;
    var src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    src.buffer = noiseBuf(c);
    f.type = o.type || 'bandpass'; f.Q.value = o.q || 0.9;
    f.frequency.setValueAtTime(o.f || 1800, t);
    if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(o.vol == null ? 0.08 : o.vol, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g);
    route(e, g, o);
    src.loop = true;
    src.start(t, Math.random() * 0.5);
    src.stop(t + dur + 0.05);
  }
  // 音を ならべる（midi 番号の 配列）
  function arp(e, notes, gap, o) {
    notes.forEach(function (m, i) { bell(e, { f: hz(m), t: (o.t || 0) + i * gap, dur: o.dur || 0.6, vol: o.vol, verb: o.verb }); });
  }

  // ---------- 効果音 ----------
  var V = {
    // こする: ざっ（紙と 消しゴム）＋ ぽこっ。れんぞくで 高く、10回ごとに きらり
    rub: function (e, p) {
      var combo = Math.min((p && p.combo) || 1, 30), r = Math.random();
      noise(e, { dur: 0.075, vol: 0.085, type: 'bandpass', f: 1500 + r * 900, f2: 800 + r * 400, q: 1.1 });
      noise(e, { dur: 0.045, vol: 0.04, type: 'highpass', f: 4200, a: 0.002 });
      tone(e, { f: 260 + combo * 12 + r * 30, f2: 180 + combo * 7, dur: 0.075, type: 'triangle', vol: 0.055, a: 0.003 });
      if (combo >= 10 && combo % 5 === 0) bell(e, { f: hz(72 + (combo / 5) % 5 * 2), t: 0.02, dur: 0.3, vol: 0.05, verb: 0.3 });
    },
    // ボタン・タブ（かるい カチッ）
    tap: function (e) {
      noise(e, { dur: 0.02, vol: 0.05, type: 'highpass', f: 5000, a: 0.001 });
      tone(e, { f: 540, f2: 480, dur: 0.06, type: 'triangle', vol: 0.06, a: 0.002 });
    },
    open: function (e) { tone(e, { f: 440, f2: 660, dur: 0.12, type: 'triangle', vol: 0.06 }); tone(e, { f: 660, f2: 880, t: 0.05, dur: 0.14, vol: 0.05, verb: 0.2 }); },
    close: function (e) { tone(e, { f: 660, f2: 440, dur: 0.12, type: 'triangle', vol: 0.055 }); },
    on: function (e) { tone(e, { f: 660, dur: 0.08, type: 'triangle', vol: 0.07 }); tone(e, { f: 990, t: 0.06, dur: 0.1, vol: 0.06 }); },
    off: function (e) { tone(e, { f: 520, dur: 0.08, type: 'triangle', vol: 0.06 }); tone(e, { f: 360, t: 0.06, dur: 0.12, vol: 0.05 }); },
    // 買えない（やさしい ブッ）
    deny: function (e) {
      tone(e, { f: 190, dur: 0.12, type: 'square', vol: 0.04, lp: 700 });
      tone(e, { f: 160, t: 0.1, dur: 0.16, type: 'square', vol: 0.04, lp: 600 });
    },
    // どうぐを 買う（チャリン）。まとめ買いは 音が ふえる
    buy: function (e, p) {
      var n = (p && p.n) || 1;
      bell(e, { f: hz(88), dur: 0.35, vol: 0.09, verb: 0.2 });
      bell(e, { f: hz(95), t: 0.06, dur: 0.5, vol: 0.09 });
      tone(e, { f: 150, f2: 90, dur: 0.1, vol: 0.09, type: 'sine' });
      if (n >= 10) bell(e, { f: hz(100), t: 0.13, dur: 0.5, vol: 0.07 });
      if (n >= 100) { bell(e, { f: hz(104), t: 0.2, dur: 0.7, vol: 0.07 }); noise(e, { t: 0.05, dur: 0.3, vol: 0.03, type: 'highpass', f: 6000 }); }
    },
    sell: function (e) {
      tone(e, { f: 700, f2: 420, dur: 0.14, type: 'triangle', vol: 0.07 });
      noise(e, { dur: 0.05, vol: 0.04, type: 'highpass', f: 3000 });
    },
    // アップグレード（ピカッと 3つ）
    upgrade: function (e) {
      arp(e, [76, 83, 88], 0.07, { dur: 0.5, vol: 0.08 });
      tone(e, { f: 130, f2: 65, dur: 0.14, vol: 0.09 });
    },
    // まぜる（ぷくぷく）
    mixing: function (e) {
      for (var i = 0; i < 7; i++) tone(e, { f: rnd(300, 520), f2: rnd(700, 1100), t: i * 0.07 + rnd(0, 0.03), dur: 0.1, vol: 0.05, a: 0.004, pan: rnd(-0.4, 0.4) });
      bell(e, { f: hz(84), t: 0.5, dur: 0.5, vol: 0.06 });
    },
    // まるめる（ガチャを まわす: カチカチ…）
    roll: function (e) {
      var t = 0;
      for (var i = 0; i < 9; i++) {
        noise(e, { t: t, dur: 0.02, vol: 0.04, type: 'highpass', f: 3500, a: 0.001 });
        tone(e, { f: 820 - i * 14, t: t, dur: 0.035, type: 'square', vol: 0.025, lp: 2400 });
        t += 0.07 + i * 0.012;
      }
    },
    // ごほうび（コインが ちゃりちゃり）: ロケット・ひきだし・チケット
    reward: function (e) {
      arp(e, [84, 88, 91, 96], 0.06, { dur: 0.45, vol: 0.07 });
      noise(e, { t: 0.05, dur: 0.35, vol: 0.025, type: 'highpass', f: 6500 });
    },
    // ゲスト消しゴムが 来た（ぽん）
    guest: function (e) {
      tone(e, { f: 480, f2: 760, dur: 0.12, type: 'triangle', vol: 0.08 });
      bell(e, { f: hz(84), t: 0.08, dur: 0.5, vol: 0.06 });
    },
    // ゴールデン: 登場は きらきら、つかむと 上がっていく
    goldenShow: function (e) {
      [96, 100, 103, 108, 103, 112].forEach(function (m, i) { bell(e, { f: hz(m), t: i * 0.07, dur: 0.5, vol: 0.045, verb: 0.5, pan: (i % 2 ? 0.3 : -0.3) }); });
    },
    golden: function (e) {
      arp(e, [72, 76, 79, 84, 88, 91, 96], 0.05, { dur: 0.7, vol: 0.075, verb: 0.4 });
      tone(e, { f: 261, f2: 523, dur: 0.5, type: 'triangle', vol: 0.07, t: 0.05, lp: 1500 });
    },
    // ほめる（あたたかい 2つ）
    praise: function (e) {
      bell(e, { f: hz(79), dur: 0.5, vol: 0.075 });
      bell(e, { f: hz(86), t: 0.1, dur: 0.7, vol: 0.075 });
      tone(e, { f: hz(55), dur: 0.8, vol: 0.05, a: 0.05, lp: 700 });
    },
    // ふーっとふく（風）
    blow: function (e) {
      noise(e, { dur: 0.55, vol: 0.09, type: 'bandpass', f: 500, f2: 2600, q: 0.7, a: 0.12 });
      noise(e, { dur: 0.4, vol: 0.04, type: 'highpass', f: 3500, a: 0.1, t: 0.08 });
    },
    // じっせき（チャラララン）
    achievement: function (e) {
      arp(e, [79, 84, 88], 0.09, { dur: 0.6, vol: 0.075 });
      bell(e, { f: hz(91), t: 0.3, dur: 0.9, vol: 0.075, verb: 0.4 });
    },
    // STAGE が 出た（ファンファーレ）
    tier: function (e) {
      [60, 64, 67, 72].forEach(function (m, i) { tone(e, { f: hz(m), t: i * 0.11, dur: 0.5, type: 'triangle', vol: 0.07, lp: 2200, verb: 0.3 }); });
      arp(e, [76, 79, 84, 88], 0.11, { dur: 0.9, vol: 0.06, t: 0.1, verb: 0.4 });
      [60, 64, 67, 72].forEach(function (m) { tone(e, { f: hz(m), t: 0.55, dur: 1.4, type: 'sine', vol: 0.05, a: 0.04, verb: 0.5 }); });
    },
    // 数が ひとつ 上の くらいに（K→M など）
    milestone: function (e) {
      bell(e, { f: hz(91), dur: 0.5, vol: 0.06 });
      bell(e, { f: hz(98), t: 0.1, dur: 0.8, vol: 0.06, verb: 0.4 });
    },
    // まるめた 結果（新しい カス / ダブり）
    rollNew: function (e) {
      arp(e, [72, 76, 79, 84, 88], 0.08, { dur: 0.9, vol: 0.075, verb: 0.45 });
      [60, 64, 67].forEach(function (m) { tone(e, { f: hz(m), t: 0.3, dur: 1.2, vol: 0.05, a: 0.03, type: 'triangle', lp: 1800, verb: 0.4 }); });
    },
    rollDup: function (e) { bell(e, { f: hz(84), dur: 0.4, vol: 0.06 }); bell(e, { f: hz(79), t: 0.09, dur: 0.5, vol: 0.06 }); },
    // しんか（ためる音: だんだん たかく はやく ← 3.5秒。演出の 長さに あわせてある）
    charge: function (e) {
      var t0 = 0, gap = 0.3, f = 300;
      while (t0 < 3.5) { tone(e, { f: f, t: t0, dur: 0.1, type: 'square', vol: 0.028, lp: 2000 }); t0 += gap; gap = Math.max(0.05, gap * 0.9); f *= 1.035; }
      tone(e, { f: 110, f2: 880, dur: 3.55, type: 'sawtooth', vol: 0.028, a: 3.2, lp: 1800 });
      noise(e, { dur: 3.5, vol: 0.03, type: 'bandpass', f: 400, f2: 5000, q: 0.6, a: 3.2 });
    },
    evolve: function (e) {
      [60, 64, 67, 72].forEach(function (m, i) { tone(e, { f: hz(m), t: i * 0.16, dur: 0.45, type: 'triangle', vol: 0.08, lp: 2400, verb: 0.3 }); });
      [72, 76, 79, 84, 88].forEach(function (m) { tone(e, { f: hz(m), t: 0.7, dur: 1.8, type: 'sine', vol: 0.05, a: 0.03, verb: 0.55 }); });
      tone(e, { f: 131, t: 0.7, dur: 1.8, type: 'triangle', vol: 0.07, lp: 600 });
      arp(e, [91, 96, 100, 103], 0.1, { t: 0.75, dur: 1, vol: 0.05, verb: 0.5 });
    },
    // てんせい（おりていって、ひらける）
    rebirth: function (e) {
      [79, 76, 72, 67].forEach(function (m, i) { bell(e, { f: hz(m), t: i * 0.22, dur: 0.8, vol: 0.075, verb: 0.35 }); });
      [55, 59, 62, 67].forEach(function (m) { tone(e, { f: hz(m), t: 0.9, dur: 1.8, vol: 0.055, a: 0.1, type: 'triangle', lp: 1200, verb: 0.5 }); });
    }
  };
  V.mix = V.mixing;

  // ---------- BGM（作りっぱなしの ゆったりした ループ）----------
  // C ー Am ー F ー G の くりかえし。カスが 育つ（STAGE）ほど 楽器が ふえる。
  var CH = [[48, 52, 55, 59], [45, 48, 52, 55], [41, 45, 48, 52], [43, 47, 50, 53]];
  var PENTA = [60, 62, 64, 67, 69, 72, 74, 76, 79];
  var BPM = 76, STEP = 60 / BPM / 2;       // 8分音符
  var B = { on: false, timer: null, nextT: 0, step: 0, last: 5, bus: null };

  function stageNow() { return (K.state && K.state.stage) || 1; }
  function bgmBar(e, bar, st) {
    var ch = CH[bar % 4], root = ch[0];
    // パッド（のびる 和音）
    ch.forEach(function (m, i) { tone(e, { f: hz(m + 12), t: 0, dur: STEP * 8.2, a: 0.9, vol: 0.026 - i * 0.002, type: 'triangle', lp: 900, verb: 0.55, det: i * 4 - 6 }); });
    if (st >= 4) tone(e, { f: hz(ch[2] + 24), t: 0, dur: STEP * 8, a: 1.2, vol: 0.012, lp: 1800, verb: 0.7 });
    // ベース
    [0, 4].forEach(function (s) { tone(e, { f: hz(root - 12), t: s * STEP, dur: STEP * 3.4, a: 0.015, vol: st >= 2 ? 0.075 : 0.055, type: 'sine', lp: 400 }); });
    if (st >= 3) tone(e, { f: hz(root), t: 6 * STEP, dur: STEP * 1.6, a: 0.01, vol: 0.04, type: 'sine', lp: 500 });
  }
  function bgmStep(e, step, st) {
    var s8 = step % 8, bar = Math.floor(step / 8);
    if (s8 === 0) bgmBar(e, bar, st);
    // メロディ（オルゴール）: ランダムに 近い 音へ うごく
    var p = 0.22 + 0.04 * Math.min(st, 7) + (s8 % 2 === 0 ? 0.12 : 0);
    if (Math.random() < p) {
      var i = B.last + (Math.random() < 0.5 ? -1 : 1) * (Math.random() < 0.7 ? 1 : 2);
      i = Math.max(0, Math.min(PENTA.length - 1, i)); B.last = i;
      var m = PENTA[i];
      bell(e, { f: hz(m), dur: 1.0, vol: 0.032, verb: 0.55 });
    }
    // こまかい ブラシ（STAGE 3〜）
    if (st >= 3 && s8 % 2 === 1) noise(e, { dur: 0.05, vol: 0.011, type: 'highpass', f: 6500, a: 0.002, pan: rnd(-0.3, 0.3) });
    // きらめく 高音（STAGE 5〜）
    if (st >= 5 && s8 % 4 === 2) bell(e, { f: hz(CH[bar % 4][2] + 36), dur: 0.6, vol: 0.016, verb: 0.7 });
  }
  function bgmPump() {
    if (!ctx || !B.on) return;
    if (ctx.state !== 'running') return;
    if (K.ads && K.ads.playing) { B.nextT = Math.max(B.nextT, ctx.currentTime + 0.2); return; }
    var st = stageNow();
    while (B.nextT < ctx.currentTime + 0.4) {
      if (B.nextT < ctx.currentTime) B.nextT = ctx.currentTime + 0.05;
      bgmStep(E(ctx, bus, B.nextT, true), B.step, st);
      B.step = (B.step + 1) % 32;
      B.nextT += STEP;
    }
  }
  function startBgm() {
    var c = ac(); if (!c || B.on) return;
    B.on = true; B.nextT = c.currentTime + 0.3; B.step = 0;
    B.timer = setInterval(bgmPump, 120);
  }
  function stopBgm() { B.on = false; if (B.timer) { clearInterval(B.timer); B.timer = null; } }

  function applyVolume() {
    if (!bus || !K.state) return;
    var v = K.state.settings.volume;
    bus.master.gain.value = 0.9 * (v == null ? 0.8 : v);
  }
  // せっていが かわったら よぶ
  function apply() {
    var st = K.state && K.state.settings;
    if (!st) return;
    applyVolume();
    if (st.sound && st.bgm !== false) { if (ctx) startBgm(); } else stopBgm();
  }

  // タブが かくれたら ぜんぶ とめる（もどったら つづき）
  document.addEventListener('visibilitychange', function () {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else ctx.resume();
  });

  K.sound = {
    play: function (id, p) {
      if (!K.state || !K.state.settings.sound) return;
      if (K.ads && K.ads.playing) return;
      var fn = V[id];
      var c = ac();
      if (!fn || !c) return;
      try { fn(E(c, bus, c.currentTime, false), p || {}); } catch (err) { /* 音が出せなくても遊べる */ }
    },
    // さいしょの タップで よぶ（ブラウザは タップの あとでないと 音を 出せない）
    unlock: function () {
      var c = ac(); if (!c) return;
      var st = K.state && K.state.settings;
      if (st && st.sound && st.bgm !== false) startBgm();
    },
    apply: apply,
    ids: Object.keys(V),
    // テスト・ためし聞き用（OfflineAudioContext でも 鳴らせる）
    _build: build, _voices: V, _bgmStep: bgmStep, _E: E, _hz: hz,
    _bgm: { start: startBgm, stop: stopBgm }
  };
})(window.K = window.K || {});
