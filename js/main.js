// ゲームループ・入力・起動
(function (K) {
  'use strict';
  var M = {};
  var $ = function (id) { return document.getElementById(id); };
  var S = function () { return K.state; };
  var t = function (k, v) { return K.t(k, v); };
  var esc = function (s) { return K.ui.esc(s); };

  var IDLE_AFTER = 20;         // びょう。これより 何もしないと ひとりごと
  var REST_AFTER = 30 * 60;    // びょう。ひとやすみ
  var SAVE_EVERY = 30;         // びょう
  var running = false;
  var lastTick = Date.now();
  var saveAcc = 0, achAcc = 0, idleSayAt = 0, idleStart = Date.now();

  function now() { return Date.now(); }

  function markAction() {
    K.rt.lastAction = now();
    idleStart = now();
    idleSayAt = 0;
  }

  // ---------- ロジック ----------
  function tick() {
    var n = now();
    var dt = (n - lastTick) / 1000;
    lastTick = n;
    if (dt <= 0) return;
    // 長く止まっていたら（タブが眠っていた等）オフライン扱い
    if (dt > 60) {
      S().lastTick = n - dt * 1000;
      offlineCheck(true);
      S().lastTick = n;
      return;
    }
    var s = S();
    s.lastTick = n;
    var cps = K.game.cps();
    if (cps > 0) { K.game.earn(cps * dt, false); K.game.addProduced(dt * K.game.cpsMult()); }
    s.stats.playTime += dt;

    // 放置
    var idle = (n - K.rt.lastAction) / 1000;
    if (idle > IDLE_AFTER) {
      s.mood.idle += dt;
      s.stats.maxIdle = Math.max(s.stats.maxIdle, (n - idleStart) / 1000);
      if (!idleSayAt || n > idleSayAt) {
        K.ui.say(K.news.monologue('idle'));
        idleSayAt = n + 25000 + Math.random() * 15000;
      }
    }
    if (new Date().getHours() < 5) s.stats.night = 1;

    // こする はやさ（あつあつ）
    K.rt.rubTimes = K.rt.rubTimes.filter(function (x) { return n - x < 1000; });

    K.guest.update();
    sandTick(dt);
    K.evo.check();
    while (K.evo.unlocked.length) {
      var tier = K.evo.unlocked.shift();
      K.ui.toast('<b>' + esc(t('tierUnlocked', { n: tier })) + '</b> ' + esc(t('ticketGift', { n: K.evo.TIER_TICKETS })));
      var sc = K.sceneFor(tier);
      if (sc.from === tier && tier > 1) K.ui.toast(esc(t('sceneChanged', { s: K.L(sc.name) })));
      K.sound.play('upgrade');
    }

    achAcc += dt;
    if (achAcc >= 1) {
      achAcc = 0;
      K.guard.check();
      var got = K.achieve.check();
      got.forEach(function (a) {
        K.ui.toast('<span class="ach-medal" style="background:' + K.ui.medalColor(a) + '"></span><span>' + esc(t('achGot')) + ' <b>' + esc(K.L(a.name)) + '</b></span>');
        K.sound.play('achievement');
      });
      if (got.length) K.ui.renderDesk(true);
    }

    // ひとやすみ（30ぷん つづけて あそんだ）
    if (!K.rt.restShown && (n - K.rt.sessionStart) / 1000 > REST_AFTER && !K.screens.isOpen() && !K.screens.evoOpen()) {
      K.rt.restShown = true;
      K.screens.open('rest');
    }

    saveAcc += dt;
    if (saveAcc >= SAVE_EVERY) { saveAcc = 0; K.store.save(); }
  }

  // ---------- 表示 ----------
  var lastRender = 0;
  function frame(ts) {
    if (!running) return;
    requestAnimationFrame(frame);
    if (ts - lastRender < 66) return; // 15fps で十分
    lastRender = ts;
    K.ui.renderCounts();
    K.ui.renderKasu();
    K.ui.renderShop();
    K.ui.renderBldStats();
    K.ui.renderDesk();
    K.ui.renderGacha();
    K.ui.renderGuest();
    K.ui.renderBuff();
    K.screens.coachTick();
    if (K.evo.queue.length && !K.screens.evoOpen()) {
      K.screens.showEvolution(K.evo.queue.shift());
      K.ui.renderShop(true);
    }
  }

  // ---------- 入力 ----------
  // こするのは 消しゴム。カスを こすっても カスは でない
  // 1びょうに 20かい より はやい こするは かぞえない（オートクリッカー対策。ほかの ズル対策は js/guard.js）
  var RUB_GAP = 1000 / 20;
  var lastRubAt = 0;

  function rub(x, y) {
    var s = S();
    var n = now();
    if (n < K.rt.blownUntil) return;
    if (n - lastRubAt < RUB_GAP) return;
    lastRubAt = n;
    var p = K.game.clickPower();
    if (K.rt.kadoLeft > 0) { p *= 10; K.rt.kadoLeft--; } // かどけし
    var g = K.guest.onRub(p);                             // ねりけし・ロケット
    p += g.bonus;
    K.game.earn(p, true);
    s.stats.rubs++;
    K.rt.rubTimes.push(n);
    K.rt.maxRubRate = Math.max(K.rt.maxRubRate, K.rt.rubTimes.length);
    K.rt.blowStreak = 0;
    markAction();
    var er = $('eraser-btn');
    var sh = document.querySelector('.eraser-shadow');
    [er, sh].forEach(function (el) { el.classList.remove('rubbing'); void el.offsetWidth; el.classList.add('rubbing'); });
    var ka = $('kasu');
    setTimeout(function () { ka.classList.remove('gain'); void ka.offsetWidth; ka.classList.add('gain'); }, 260);
    K.ui.floatNum(x, y, '+' + K.fmt(p, { decimals: 1 }));
    K.ui.rubFx();
    if (!g.sticky) K.rt.mess = Math.min((K.rt.mess || 0) + 1, K.game.MESS_MAX);
    if (g.pop) {
      K.game.earn(g.pop, false);
      K.ui.rocketPop(g.pop);
    }
    wear();
    K.sound.play('rub');
    if (Math.random() < 0.015) K.ui.say(K.news.monologue('rub'));
  }

  // けしゴムが へる。すなけしが きている あいだは 2ばい はやい
  function wear() {
    var times = K.game.buffActive('sand') ? 2 : 1;
    for (var i = 0; i < times; i++) if (K.evo.wear()) K.ui.eraserDone();
    K.ui.renderEraser();
  }

  // すなけし: 1びょうに 10かい じどうで こする
  var sandAcc = 0, sandN = 0;
  function sandTick(dt) {
    if (!K.game.buffActive('sand')) { sandAcc = 0; return; }
    sandAcc += dt * 10;
    while (sandAcc >= 1) {
      sandAcc -= 1;
      var p = K.game.clickPower();
      K.game.earn(p, false);
      if (!K.game.buffActive('neri')) K.rt.mess = Math.min((K.rt.mess || 0) + 1, K.game.MESS_MAX);
      wear();
      if (++sandN % 3 === 0) {
        var er = $('eraser-btn');
        er.classList.remove('rubbing'); void er.offsetWidth; er.classList.add('rubbing');
        var st = $('kasu-stage').getBoundingClientRect(), eb = er.getBoundingClientRect();
        K.ui.floatNum(eb.left - st.left + eb.width * (0.2 + Math.random() * 0.6), eb.top - st.top + eb.height * 0.6, '+' + K.fmt(p, { decimals: 1 }));
      }
    }
  }

  // こする はんていは つくえ ぜんたい（消しゴムでも カスでも 紙でも）。ずっと タップするので ゆるく
  function bindKasu() {
    var btn = $('eraser-btn');
    var stage = $('kasu-stage');
    var drag = null; // { x: さいごの x, dir: うごいている むき, run: その むきに うごいた きょり }
    var at = function (e) {
      var r = stage.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    stage.addEventListener('pointerdown', function (e) {
      if (e.button > 0 || !e.isTrusted) return;
      e.preventDefault();
      K.sound.unlock();
      var p = at(e);
      rub(p[0], p[1]);
      drag = { x: e.clientX, dir: 0, run: 0 };
      try { stage.setPointerCapture(e.pointerId); } catch (err) { /* なし */ }
    });
    // おしたまま 左右に うごかしても こすれる（むきが かわるたびに 1かい）
    stage.addEventListener('pointermove', function (e) {
      if (!drag || !e.isTrusted) return;
      var d = e.clientX - drag.x;
      drag.x = e.clientX;
      if (!d) return;
      var dir = d > 0 ? 1 : -1;
      if (dir !== drag.dir) {
        if (drag.run >= 8) { var p = at(e); rub(p[0], p[1]); }
        drag.dir = dir; drag.run = 0;
      }
      drag.run += Math.abs(d);
    });
    var end = function () { drag = null; };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
    // キーボード（Enter / Space）
    btn.addEventListener('click', function (e) {
      if (e.detail !== 0 || !e.isTrusted) return;
      var r = stage.getBoundingClientRect();
      rub(r.width * 0.7, r.height * 0.35);
    });
    stage.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  }

  var shyTimer = 0;
  function praise() {
    var s = S(), n = now();
    if (n < K.rt.praiseReadyAt) return;
    // 30びょう ごきげん（/s ×1.5）。つぎに ほめられるのは 60びょう ご（ずっと おしっぱなしに ならないように）
    var cd = K.game.hasShard('praiseFast') ? 40 : 60;
    K.rt.praiseUntil = n + 30000;
    K.rt.praiseReadyAt = n + cd * 1000;
    s.mood.praises++;
    s.stats.praises++;
    K.rt.blowStreak = 0;
    markAction();
    var btn = $('kasu');
    btn.classList.remove('shy'); void btn.offsetWidth; btn.classList.add('shy');
    // もじもじ が おわったら クラスを はずす（のこっていると ふいても とばなかった）
    clearTimeout(shyTimer);
    shyTimer = setTimeout(function () { btn.classList.remove('shy'); }, 900);
    K.ui.say(K.news.monologue('praise'));
    K.sound.play('praise');
  }

  // ふく: こすって ちらかった つぶを ふきあつめて まとめて もらう。3びょう カスが とんでいって こすれない
  function blow() {
    var s = S();
    if (now() < K.rt.blownUntil) return;
    K.rt.blownUntil = now() + 3000;
    var gain = K.game.blowGain();
    K.rt.mess = 0;
    if (gain > 0) {
      K.game.earn(gain, true);
      var r = $('kasu-stage').getBoundingClientRect();
      K.ui.floatNum(r.width * 0.5, r.height * 0.3, '+' + K.fmt(gain, { decimals: 1 }));
    }
    K.ui.blowMess();
    s.mood.blows++;
    s.stats.blows++;
    K.rt.blowStreak++;
    s.stats.maxBlowStreak = Math.max(s.stats.maxBlowStreak, K.rt.blowStreak);
    markAction();
    var btn = $('kasu');
    btn.classList.remove('blown', 'shy', 'gain'); void btn.offsetWidth; btn.classList.add('blown');
    K.sound.play('blow');
    setTimeout(function () { btn.classList.remove('blown'); K.ui.say(K.news.monologue('blow')); }, 3000);
  }

  function bindShop() {
    $('shop-list').addEventListener('click', function (e) {
      var info = e.target.closest('[data-info]');
      if (info) {
        var iid = info.getAttribute('data-info');
        K.ui.openInfo = K.ui.openInfo === iid ? null : iid;
        K.ui.renderShop(true);
        return;
      }
      var el = e.target.closest('.bld[data-b]');
      if (!el) return;
      var id = el.getAttribute('data-b');
      markAction();
      var ok = K.ui.mode === 'sell' ? K.game.sell(id, K.ui.bulk) : K.game.buy(id, K.ui.bulk);
      if (!ok) return;
      K.sound.play('buy');
      if (K.ui.mode === 'buy' && Math.random() < 0.3) K.ui.say(K.news.monologue('buy'));
      K.ui.renderShop(true);
      K.ui.renderDesk(true);
      var again = document.querySelector('.bld[data-b="' + id + '"]');
      if (again) again.classList.add('bump');
    });
    // PC: どうぐに カーソルを のせると くわしい 数字（クッキークリッカーと おなじ）
    $('shop-list').addEventListener('mouseover', function (e) {
      var el = e.target.closest('.bld[data-b]');
      if (el) K.ui.showTip(el.getAttribute('data-b'));
      else K.ui.hideTip();
    });
    $('shop-list').addEventListener('mouseleave', function () { K.ui.hideTip(); });
    $('up-grid').addEventListener('click', function (e) {
      var el = e.target.closest('[data-up]');
      if (!el) return;
      var id = el.getAttribute('data-up');
      K.ui.selUpgrade = K.ui.selUpgrade === id ? null : id;
      K.ui.renderShop(true);
    });
    $('up-detail').addEventListener('click', function (e) {
      var el = e.target.closest('[data-buy-up]');
      if (!el) return;
      markAction();
      if (K.game.buyUpgrade(el.getAttribute('data-buy-up'))) {
        K.sound.play('upgrade');
        K.ui.selUpgrade = null;
        K.ui.renderShop(true);
        K.ui.renderDesk(true);
      }
    });
    $('mat-list').addEventListener('click', function (e) {
      var el = e.target.closest('[data-mat]');
      if (!el) return;
      markAction();
      if (K.game.buyMaterial(el.getAttribute('data-mat'))) {
        K.sound.play('upgrade');
        var bought = K.game.materialById[el.getAttribute('data-mat')];
        K.ui.toast(esc(t('mixedToast', { t: K.L(K.evo.traitById[bought.trait].name) })));
        K.ui.say(K.news.monologue('mix'));
        K.ui.renderShop(true);
      }
    });
    $('bulk').addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.hasAttribute('data-bulk')) K.ui.bulk = +b.getAttribute('data-bulk');
      if (b.hasAttribute('data-mode')) K.ui.mode = b.getAttribute('data-mode');
      K.ui.renderShop(true);
    });
  }

  // まるめる: マシンの つまみを まわしてから けっかを だす
  function roll() {
    if (K.screens.evoOpen() || K.ui.rolling || (S().tickets || 0) < 1) return;
    markAction();
    K.ui.rolling = true;
    var m = $('gacha-machine');
    m.classList.remove('turning'); void m.offsetWidth; m.classList.add('turning');
    K.sound.play('buy');
    setTimeout(function () {
      K.ui.rolling = false;
      m.classList.remove('turning');
      var r = K.evo.roll();
      if (!r) return;
      K.ui.showRollResult(r);
      if (!r.isNew) K.sound.play('upgrade');
      K.ui.renderKasu();
      K.ui.renderGacha(true);
    }, S().settings.reduceMotion ? 0 : 800);
  }

  function bindGlobal() {
    $('roll-btn').onclick = roll;
    $('praise-btn').onclick = praise;
    $('blow-btn').onclick = blow;
    $('guest').onclick = function () {
      var r = K.guest.click();
      if (!r) return;
      markAction();
      K.ui.guestUsed(r);
    };
    document.addEventListener('click', function (e) {
      var o = e.target.closest('[data-open]');
      if (o) {
        var name = o.getAttribute('data-open');
        if (K.screens.isOpen()) K.screens.close();
        K.screens.open(name);
        return;
      }
      var mid = e.target.closest('[data-mid]');
      if (mid) { K.ui.setMid(mid.getAttribute('data-mid')); return; }
      var tab = e.target.closest('[data-tab]');
      if (tab) { K.ui.setTab(tab.getAttribute('data-tab')); return; }
      if (e.target.closest('[data-close]')) K.screens.close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && K.screens.isOpen()) K.screens.close();
    });
    window.addEventListener('pagehide', function () { K.store.save(); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) K.store.save(); });
    window.addEventListener('resize', function () { K.ui.placeForWidth(); K.ui.renderShop(true); });
  }

  // ---------- オフライン ----------
  function offlineCheck(fromTick) {
    var o = K.store.offlineGain(now());
    if (o.gain <= 0) return false;
    K.game.earn(o.gain, false);
    K.game.addProduced(o.sec * K.store.offlineRate());
    S().lastTick = now();
    lastTick = now();
    var show = function () {
      K.screens.welcome(o.sec, o.gain, function () { K.ui.say(t('welcomeLine')); });
    };
    if (fromTick) { if (!K.screens.isOpen()) show(); } else show();
    return true;
  }

  // ---------- 画面の切りかえ ----------
  M.enterGame = function () {
    var s = S();
    s.started = true;
    if (!s.zukan[s.species]) K.evo.register(s.species);
    K.screens.show('screen-game');
    K.ui.renderAll();
    K.ui.setTab('kasu');
    K.ui.setMid('desk');
    K.ui.nextNews();
    markAction();
    K.rt.sessionStart = now();
    if (!running) {
      running = true;
      lastTick = now();
      setInterval(tick, 100);
      requestAnimationFrame(frame);
      bindKasu();
      bindShop();
    }
    if (!K.guest.nextAt) K.guest.schedule();
    offlineCheck(false);
    s.lastTick = now();
    K.screens.coach();
    K.store.save();
  };

  M.applySettings = function () {
    var st = S().settings;
    document.documentElement.setAttribute('data-theme', st.dark ? 'dark' : 'light');
    document.documentElement.classList.toggle('reduce-motion', !!st.reduceMotion);
    document.querySelector('meta[name="theme-color"]').setAttribute('content', st.dark ? '#22211F' : '#F6F1E7');
    K.store.save();
    if (!$('screen-game').hidden) {
      K.ui.renderAll();
      K.ui.nextNews();
      K.screens.coach();
      if (K.ui.tab === 'menu') K.screens.renderMenu();
    }
  };

  M.loadState = function (data) {
    K.state = data;
    K.store.save();
    M.applySettings();
    K.ui.renderAll();
  };

  M.hardReset = function () {
    K.store.reset();
    K.state = K.store.fresh();
    try { localStorage.setItem('keshikasu.reset', '1'); } catch (e) { /* なし */ }
    location.reload();
  };

  // ---------- 起動 ----------
  function boot() {
    var saved = K.store.load();
    K.state = saved || K.store.fresh();
    M.applySettings();
    bindGlobal();
    K.ui.placeForWidth();
    K.ui.applyStatic();
    K.screens.title(!!(saved && saved.started));
    // デバッグ用（コンソールから K.debug.give(1e9) など）。つかうと ズルの じっせきが つく
    K.debug = {
      give: function (n) { K.guard.flag('debug'); K.game.earn(n, false); },
      golden: function () { K.guard.flag('debug'); K.guest.spawnNow('golden'); },
      guest: function (id) { K.guard.flag('debug'); K.guest.spawnNow(id); },
      skipTutorial: function () { S().tutorial = 9; K.screens.coach(); }
    };
  }

  K.main = M;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window.K = window.K || {});
