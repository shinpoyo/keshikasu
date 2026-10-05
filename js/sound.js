// 効果音（Web Audio API で合成。音声ファイルなし、企画書 2章）
(function (K) {
  'use strict';
  var ctx = null;

  function ac() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { ctx = new AC(); } catch (e) { return null; }
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, start, dur, type, vol) {
    var c = ac(); if (!c) return;
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, c.currentTime + start);
    g.gain.setValueAtTime(0.0001, c.currentTime + start);
    g.gain.exponentialRampToValueAtTime(vol || 0.15, c.currentTime + start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
    o.connect(g); g.connect(c.destination);
    o.start(c.currentTime + start);
    o.stop(c.currentTime + start + dur + 0.05);
  }

  // こする音: みじかい ノイズ
  function scrub() {
    var c = ac(); if (!c) return;
    var len = Math.floor(c.sampleRate * 0.06);
    var buf = c.createBuffer(1, len, c.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    src.buffer = buf;
    f.type = 'bandpass'; f.frequency.value = 1800 + Math.random() * 800; f.Q.value = 0.8;
    g.gain.value = 0.12;
    src.connect(f); f.connect(g); g.connect(c.destination);
    src.start();
    // ポコッ と かるい 手ごたえ。れんぞくで こすると 少しずつ 高く なる
    var combo = (K.rt && K.rt.combo) || 1;
    tone(260 + Math.min(combo, 30) * 14, 0, 0.07, 'triangle', 0.06);
  }

  var SOUNDS = {
    rub: scrub,
    buy: function () { tone(660, 0, 0.12, 'triangle', 0.12); tone(990, 0.06, 0.14, 'triangle', 0.1); },
    upgrade: function () { tone(523, 0, 0.1, 'triangle'); tone(784, 0.07, 0.1, 'triangle'); tone(1047, 0.14, 0.2, 'triangle'); },
    golden: function () { [1047, 1319, 1568, 2093].forEach(function (f, i) { tone(f, i * 0.06, 0.3, 'sine', 0.1); }); },
    praise: function () { tone(880, 0, 0.12, 'sine', 0.1); tone(1175, 0.1, 0.18, 'sine', 0.1); },
    blow: function () {
      var c = ac(); if (!c) return;
      var o = c.createOscillator(), g = c.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(400, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(1400, c.currentTime + 0.35);
      g.gain.setValueAtTime(0.08, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.4);
      o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 0.45);
    },
    // しんか: 壮大な ジングル（ドミソド → 和音）
    evolve: function () {
      var notes = [523, 659, 784, 1047];
      notes.forEach(function (f, i) { tone(f, i * 0.16, 0.4, 'triangle', 0.13); });
      [523, 659, 784, 1047, 1319].forEach(function (f) { tone(f, 0.7, 1.6, 'sine', 0.07); });
      tone(262, 0.7, 1.6, 'triangle', 0.08);
    },
    // しんかの ためる音: だんだん たかく はやくなる
    charge: function () {
      var t0 = 0, gap = 0.3, f = 300;
      while (t0 < 3.5) { tone(f, t0, 0.12, 'square', 0.035); t0 += gap; gap = Math.max(0.05, gap * 0.9); f *= 1.035; }
      var c = ac(); if (!c) return;
      var o = c.createOscillator(), g = c.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(110, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(880, c.currentTime + 3.55);
      g.gain.setValueAtTime(0.0001, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.03, c.currentTime + 3.2);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 3.6);
      o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 3.65);
    },
    mixing: function () { [392, 494, 587, 698, 784].forEach(function (f, i) { tone(f, i * 0.12, 0.2, 'sine', 0.07); }); },
    achievement: function () { tone(784, 0, 0.1, 'sine', 0.08); tone(1175, 0.08, 0.2, 'sine', 0.08); },
    rebirth: function () {
      [784, 659, 523, 392].forEach(function (f, i) { tone(f, i * 0.22, 0.5, 'sine', 0.1); });
    }
  };

  K.sound = {
    play: function (id) {
      if (!K.state || !K.state.settings.sound) return;
      if (K.ads && K.ads.playing) return;
      var fn = SOUNDS[id];
      if (fn) { try { fn(); } catch (e) { /* 音が出せなくても遊べる */ } }
    },
    unlock: ac
  };
})(window.K = window.K || {});
