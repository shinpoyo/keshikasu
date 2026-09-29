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
    if (cps > 0) K.game.earn(cps * dt, false);
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

    K.golden.update();
    K.evo.check();

    achAcc += dt;
    if (achAcc >= 1) {
      achAcc = 0;
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
    K.ui.renderDesk();
    K.ui.renderGolden();
    K.ui.renderBuff();
    K.screens.coachTick();
    if (K.evo.queue.length && !K.screens.evoOpen()) {
      K.screens.showEvolution(K.evo.queue.shift());
      K.ui.renderShop(true);
    }
  }

  // ---------- 入力 ----------
  function rub(x, y) {
    var s = S();
    if (now() < K.rt.blownUntil) return;
    var p = K.game.clickPower();
    K.game.earn(p, true);
    s.stats.rubs++;
    K.rt.rubTimes.push(now());
    K.rt.maxRubRate = Math.max(K.rt.maxRubRate, K.rt.rubTimes.length);
    K.rt.blowStreak = 0;
    markAction();
    var btn = $('kasu-btn');
    btn.classList.remove('squish'); void btn.offsetWidth; btn.classList.add('squish');
    K.ui.floatNum(x, y, '+' + K.fmt(p, { decimals: 1 }));
    K.sound.play('rub');
    if (Math.random() < 0.015) K.ui.say(K.news.monologue('rub'));
  }

  function bindKasu() {
    var btn = $('kasu-btn');
    var stage = $('kasu-stage');
    btn.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return;
      e.preventDefault();
      K.sound.unlock();
      var r = stage.getBoundingClientRect();
      rub(e.clientX - r.left, e.clientY - r.top);
    });
    // キーボード（Enter / Space）
    btn.addEventListener('click', function (e) {
      if (e.detail !== 0) return;
      var r = stage.getBoundingClientRect();
      rub(r.width / 2, r.height / 2);
    });
    btn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  }

  function praise() {
    var s = S(), n = now();
    if (n < K.rt.praiseReadyAt) return;
    var cd = K.game.hasShard('praiseFast') ? 5 : 10;
    K.rt.praiseUntil = n + 30000;
    K.rt.praiseReadyAt = n + cd * 1000;
    s.mood.praises++;
    s.stats.praises++;
    K.rt.blowStreak = 0;
    markAction();
    var btn = $('kasu-btn');
    btn.classList.remove('shy'); void btn.offsetWidth; btn.classList.add('shy');
    K.ui.say(K.news.monologue('praise'));
    K.sound.play('praise');
  }

  function blow() {
    var s = S();
    if (now() < K.rt.blownUntil) return;
    K.rt.blownUntil = now() + 3000;
    s.mood.blows++;
    s.stats.blows++;
    K.rt.blowStreak++;
    s.stats.maxBlowStreak = Math.max(s.stats.maxBlowStreak, K.rt.blowStreak);
    markAction();
    var btn = $('kasu-btn');
    btn.classList.remove('blown'); void btn.offsetWidth; btn.classList.add('blown');
    K.sound.play('blow');
    setTimeout(function () { btn.classList.remove('blown'); K.ui.say(K.news.monologue('blow')); }, 3000);
  }

  function bindShop() {
    $('shop-list').addEventListener('click', function (e) {
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
        K.evo.mix();
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

  function bindGlobal() {
    $('praise-btn').onclick = praise;
    $('blow-btn').onclick = blow;
    $('golden').onclick = function () {
      var r = K.golden.click();
      $('golden').hidden = true;
      if (!r) return;
      markAction();
      if (r.id === 'lucky') {
        K.ui.toast('<b>' + esc(K.L(K.golden.EFFECTS.lucky.name)) + '</b> ' + esc(t('luckyGain', { v: K.fmt(r.gain) })));
      }
      K.ui.say(K.news.monologue('golden'));
    };
    document.addEventListener('click', function (e) {
      var o = e.target.closest('[data-open]');
      if (o) {
        var name = o.getAttribute('data-open');
        if (K.screens.isOpen()) K.screens.close();
        K.screens.open(name);
        return;
      }
      var tab = e.target.closest('[data-tab]');
      if (tab) { K.ui.setTab(tab.getAttribute('data-tab')); return; }
      if (e.target.closest('[data-close]')) K.screens.close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && K.screens.isOpen()) K.screens.close();
    });
    window.addEventListener('pagehide', function () { K.store.save(); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) K.store.save(); });
    window.addEventListener('resize', function () { K.ui.renderShop(true); });
  }

  // ---------- オフライン ----------
  function offlineCheck(fromTick) {
    var o = K.store.offlineGain(now());
    if (o.gain <= 0) return false;
    K.game.earn(o.gain, false);
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
    K.evo.register(s.species);
    K.screens.show('screen-game');
    K.ui.renderAll();
    K.ui.setTab('kasu');
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
    if (!K.golden.nextAt) K.golden.schedule();
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
    K.ui.applyStatic();
    K.screens.title(!!(saved && saved.started));
    // デバッグ用（コンソールから K.debug.give(1e9) など）
    K.debug = {
      give: function (n) { K.game.earn(n, false); },
      golden: function () { K.golden.spawnNow(); },
      skipTutorial: function () { S().tutorial = 9; K.screens.coach(); }
    };
  }

  K.main = M;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window.K = window.K || {});
