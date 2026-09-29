// ゲーム画面の表示（カス・つくえ・みせ・ニュース・ゴールデン）
(function (K) {
  'use strict';
  var U = {};
  var $ = function (id) { return document.getElementById(id); };
  var S = function () { return K.state; };
  var t = function (k, v) { return K.t(k, v); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  U.esc = esc;

  U.bulk = 1;
  U.mode = 'buy';
  U.tab = 'kasu';
  U.selUpgrade = null;

  U.narrow = function () { return window.matchMedia('(max-width: 900px)').matches; };

  // --- 文字の反映（data-t / data-ui） ---
  U.applyStatic = function (root) {
    root = root || document;
    root.querySelectorAll('[data-t]').forEach(function (el) { el.textContent = t(el.getAttribute('data-t')); });
    root.querySelectorAll('[data-t-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-t-aria'))); });
    root.querySelectorAll('[data-ui]').forEach(function (el) {
      if (!el.firstChild) el.innerHTML = K.art.ui(el.getAttribute('data-ui'), 20);
    });
    document.documentElement.lang = K.lang();
    document.title = K.lang() === 'ja' ? 'けしカス / Eraser Crumbs' : 'Eraser Crumbs / けしカス';
  };

  var crumbIcon = function () { return K.art.ui('crumb', 11); };
  U.priceHtml = function (v, can) {
    return '<span class="price' + (can ? '' : ' no') + '">' + crumbIcon() + K.fmt(v) + '</span>';
  };

  // --- カス ---
  var lastSpecies = null;
  U.renderKasu = function () {
    var s = S();
    if (lastSpecies !== s.species || U.forceKasu) {
      U.forceKasu = false;
      lastSpecies = s.species;
      var info = K.evo.info(s.species);
      $('kasu-body').innerHTML = K.art.kasuPic(info);
      $('kasu').setAttribute('aria-label', K.L(info.name));
      if (!$('eraser').firstChild) $('eraser').innerHTML = K.art.eraser();
      var st = $('kasu-stage');
      st.classList.toggle('lv6', info.stage === 6);
      st.classList.toggle('lv7', info.stage >= 7);
      $('stage-badge').textContent = info.special ? t('specialBadge') : t('stageBadge', { n: info.stage });
      $('stage-badge').className = 'badge ' + (info.special ? 'badge-special' : 'badge-stage');
      $('kasu-name').textContent = K.L(info.name);
      $('eraser-btn').setAttribute('aria-label', t('kasuLabel'));
    }
    $('kasu-pet').textContent = s.name ? K.quote(s.name) : '';
    var next = K.evo.nextNeed();
    $('kasu-next').textContent = next == null ? t('maxEvo') : t('nextEvo', { p: Math.floor(K.evo.progress() * 100) });
    $('evo-bar').style.width = (K.evo.progress() * 100).toFixed(1) + '%';
    var cost = K.evo.rollCost();
    var can = s.crumbs >= cost;
    $('roll-btn').disabled = !can;
    $('roll-price').innerHTML = U.priceHtml(cost, can);
    $('roll-sub').textContent = t('rollSub', { n: s.stage, f: K.evo.foundCount(), t: K.evo.TOTAL });
  };

  // --- 数字 ---
  U.renderCounts = function () {
    var s = S();
    var c = K.fmt(s.crumbs);
    var cps = K.game.cps();
    var cpsText = '+' + K.fmtPerSec(cps);
    $('crumbs').textContent = c;
    $('cps').textContent = cpsText;
    $('cps-inline').textContent = cpsText;
    $('cps').classList.toggle('boost', K.game.cpsMult() > 1);
    document.querySelectorAll('[data-mirror="crumbs"]').forEach(function (el) { el.textContent = c; });
    document.querySelectorAll('[data-mirror="cps-inline"]').forEach(function (el) { el.textContent = cpsText; });
    // ほめる の まちじかん
    var wait = Math.ceil((K.rt.praiseReadyAt - Date.now()) / 1000);
    $('praise-btn').disabled = wait > 0;
    $('praise-label').textContent = wait > 0 ? t('praiseWait', { s: wait }) : t('praise');
    // てんせいボタン
    var pend = K.ascend.pending();
    $('rebirth-btn').classList.toggle('ready', pend > 0);
  };

  // --- つくえ ---
  var deskSig = '';
  var prevCounts = {};
  U.renderDesk = function (force) {
    var s = S();
    var sig = K.lang() + '|' + K.data.buildings.map(function (b) { return s.buildings[b.id]; }).join(',') + '|' + Object.keys(s.upgrades).length + '|' + s.shards + '|' + K.game.achievementCount();
    if (sig === deskSig && !force) return;
    deskSig = sig;
    var html = '';
    var any = false;
    K.data.buildings.forEach(function (b) {
      var n = s.buildings[b.id];
      if (!n) return;
      any = true;
      var show = Math.min(n, 40);
      var prev = Math.min(prevCounts[b.id] || 0, 40);
      var units = '';
      var size = b.id === 'grandpa' ? [36, 44] : b.id === 'classroom' || b.id === 'factory' || b.id === 'roller' || b.id === 'paralleldesk' ? [46, 38] : b.id === 'ant' ? [34, 22] : b.id === 'finger' ? [22, 30] : [34, 34];
      for (var i = 0; i < show; i++) {
        units += '<span class="u' + (i >= prev ? ' u-new' : '') + '">' + K.art.building(b.id, size[0], size[1]) + '</span>';
      }
      if (n > show) units += '<span class="desk-more">+' + K.fmt(n - show) + '</span>';
      html += '<div class="desk-row" data-b="' + b.id + '">' +
        '<div class="desk-row-name"><b>' + esc(K.L(b.name)) + '</b><span>+' + K.fmtPerSec(K.game.buildingCps(b.id)) + '</span></div>' +
        '<div class="desk-units">' + units + '</div>' +
        '<span class="desk-count">x' + n + '</span></div>';
      prevCounts[b.id] = n;
    });
    K.data.buildings.forEach(function (b) { if (!s.buildings[b.id]) prevCounts[b.id] = 0; });
    html += '<div class="desk-empty">' + esc(any ? t('deskWaiting') : t('deskEmpty')) + '</div>';
    $('desk-rows').innerHTML = html;
  };

  // --- みせ ---
  var shopSig = '';
  U.renderShop = function (force) {
    var s = S();
    var ups = K.game.availableUpgrades();
    var mats = K.game.availableMaterials();
    var vis = K.game.visibleBuildings();
    // 「買える／買えない」が変わったときだけ描きなおす
    var sig = [K.lang(), U.bulk, U.mode, U.selUpgrade, s.trait,
      ups.map(function (u) { return u.id + (s.crumbs >= u.cost ? '1' : '0'); }).join(','),
      mats.map(function (m) { return m.id + (s.crumbs >= m.cost ? '1' : '0'); }).join(','),
      vis.map(function (v) { return v.b.id + s.buildings[v.b.id] + (s.crumbs >= K.game.price(v.b.id, U.bulk) ? '1' : '0') + v.locked; }).join(',')
    ].join('|');
    if (sig === shopSig && !force) return;
    var becameAffordable = {};
    if (shopSig) {
      vis.forEach(function (v) {
        var el = document.querySelector('.bld[data-b="' + v.b.id + '"]');
        if (el && el.classList.contains('cant') && s.crumbs >= K.game.price(v.b.id, U.bulk) && U.mode === 'buy') becameAffordable[v.b.id] = true;
      });
    }
    shopSig = sig;

    // bulk / mode
    document.querySelectorAll('#bulk [data-bulk]').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-bulk') === U.bulk)); });
    document.querySelectorAll('#bulk [data-mode]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-mode') === U.mode)); });

    // アップグレード
    var cols = U.narrow() ? 5 : (window.innerWidth <= 1280 ? 5 : 6);
    var gh = '';
    ups.forEach(function (u) {
      var can = s.crumbs >= u.cost;
      gh += '<button type="button" class="up ' + (can ? 'can' : 'cant') + (U.selUpgrade === u.id ? ' sel' : '') + '" data-up="' + u.id + '" aria-label="' + esc(K.L(u.name)) + '">' + K.art.upIcon(u.icon, 28) + '</button>';
    });
    var fill = ups.length === 0 ? cols : (cols - (ups.length % cols)) % cols;
    for (var i = 0; i < fill; i++) gh += '<span class="up empty" aria-hidden="true">?</span>';
    $('up-grid').innerHTML = gh;
    var sel = U.selUpgrade && K.game.upgradeById[U.selUpgrade];
    if (sel && !K.game.has(sel.id)) {
      var can = s.crumbs >= sel.cost;
      $('up-detail').hidden = false;
      $('up-detail').innerHTML = '<div class="up-detail-head">' + K.art.upIcon(sel.icon, 28) + '<span class="up-detail-name">' + esc(K.L(sel.name)) + '</span></div>' +
        '<div class="up-detail-desc">' + esc(K.L(sel.desc)) + '</div>' +
        '<div class="up-detail-foot">' + U.priceHtml(sel.cost, can) + '<button type="button" class="btn btn-pink" data-buy-up="' + sel.id + '"' + (can ? '' : ' disabled') + '>' + esc(t('buy')) + '</button></div>';
    } else {
      $('up-detail').hidden = true;
      U.selUpgrade = null;
    }

    // まぜる
    var mh = '';
    mats.forEach(function (m) {
      var can = s.crumbs >= m.cost;
      var tr = K.evo.traitById[m.trait];
      mh += '<button type="button" class="mat ' + (can ? 'can' : 'cant') + '" data-mat="' + m.id + '">' +
        '<span class="mat-ico">' + K.art.upIcon(m.id, 26) + '</span>' +
        '<span class="mat-text"><span class="mat-name">' + esc(K.L(m.name)) + '</span><span class="mat-desc">' + esc(K.L(m.desc)) + '</span></span>' +
        '<span class="chip-dot" style="background:' + (tr.chipBg || tr.chip) + '"></span>' + U.priceHtml(m.cost, can) + '</button>';
    });
    $('mat-group').hidden = !mats.length && s.trait === 'plain';
    $('mat-list').innerHTML = mh;
    $('mat-current').textContent = t('mixCurrent', { t: K.L(K.evo.traitById[s.trait].name) });

    // なかま
    var bh = '';
    vis.forEach(function (v) {
      var b = v.b;
      if (v.locked) {
        bh += '<div class="bld cant" aria-disabled="true"><span class="bld-ico">' + K.art.ui('lock', 26) + '</span>' +
          '<span class="bld-text"><span class="bld-name">' + esc(t('locked')) + '</span>' + U.priceHtml(b.cost, false) + '</span></div>';
        return;
      }
      var owned = s.buildings[b.id];
      var sell = U.mode === 'sell';
      var amount = U.bulk;
      var price = sell ? K.game.sellValue(b.id, amount) : K.game.price(b.id, amount);
      var can = sell ? owned > 0 : s.crumbs >= price;
      var rate = '+' + K.fmtPerSec(K.game.unitCps(b.id) * K.game.globalMult());
      bh += '<button type="button" class="bld ' + (can ? 'can' : 'cant') + (sell ? ' sell' : '') + (becameAffordable[b.id] ? ' became' : '') + '" data-b="' + b.id + '" title="' + esc(K.L(b.line)) + '">' +
        '<span class="bld-ico">' + K.art.building(b.id, 32, 32) + '</span>' +
        '<span class="bld-text"><span class="bld-name">' + esc(K.L(b.name)) + (amount > 1 ? ' <small>x' + amount + '</small>' : '') + '</span>' +
        '<span class="bld-sub">' + (sell ? '<span class="price">' + crumbIcon() + '+' + K.fmt(price) + '</span>' : U.priceHtml(price, can)) + '<span class="bld-rate">' + rate + '</span></span></span>' +
        '<span class="bld-own">' + (owned || '') + '</span></button>';
    });
    $('shop-list').innerHTML = bh;

    // スマホの「みせ」タブの数字（買えるものの数）
    var n = ups.filter(function (u) { return s.crumbs >= u.cost; }).length +
      vis.filter(function (v) { return !v.locked && s.crumbs >= K.game.price(v.b.id, 1); }).length;
    $('shop-badge').hidden = n === 0 || U.tab === 'shop';
    $('shop-badge').textContent = n > 9 ? '9+' : n;
  };

  // --- ニュース ---
  var newsTimer = 0;
  U.nextNews = function () {
    var el = $('news-text');
    el.className = 'news-text';
    el.textContent = K.news.pick();
    void el.offsetWidth;
    el.classList.add('enter');
    clearTimeout(newsTimer);
    // はみ出すときは よこに ながす
    setTimeout(function () {
      var track = el.parentNode;
      var shift = track.clientWidth - el.scrollWidth;
      if (shift < 0) {
        el.style.setProperty('--shift', (shift - 16) + 'px');
        el.style.animationDuration = Math.max(6, -shift / 40 + 4) + 's';
        el.className = 'news-text scroll';
      }
    }, 900);
    newsTimer = setTimeout(U.nextNews, 11000);
  };

  // --- ひとりごと ---
  var bubbleTimer = 0;
  U.say = function (text, hold) {
    if (!text) return;
    var el = $('bubble');
    el.textContent = K.quote(text);
    el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
    clearTimeout(bubbleTimer);
    if (hold !== false) bubbleTimer = setTimeout(function () { el.textContent = K.quote(K.lang() === 'ja' ? '……' : '...'); }, 9000);
  };

  // --- ゴールデン ---
  U.renderGolden = function () {
    var g = K.golden.current;
    var el = $('golden');
    if (g) {
      if (el.hidden) {
        var panes = $('panes');
        var r = panes.getBoundingClientRect();
        var host = $('screen-game').getBoundingClientRect();
        var size = U.narrow() ? 60 : 76;
        el.style.left = Math.round(r.left - host.left + g.x * (r.width - size)) + 'px';
        el.style.top = Math.round(r.top - host.top + g.y * (r.height - size - (U.narrow() ? 90 : 0))) + 'px';
        el.hidden = false;
        el.classList.remove('leaving');
        el.setAttribute('aria-label', t('goldenLabel'));
      }
      if (g.until - Date.now() < 1500) el.classList.add('leaving');
    } else if (!el.hidden) {
      el.hidden = true;
    }
  };

  U.renderBuff = function () {
    var b = K.rt.buff;
    var bar = $('buffbar');
    var on = b && Date.now() < b.until;
    $('screen-game').classList.toggle('gold-mode', !!on);
    $('kasu-stage').classList.toggle('golden-on', !!on);
    if (!on) { if (!bar.hidden) bar.hidden = true; return; }
    var left = (b.until - Date.now()) / 1000;
    var e = K.golden.EFFECTS[b.id];
    if (bar.hidden || bar.getAttribute('data-id') !== b.id) {
      bar.setAttribute('data-id', b.id);
      bar.innerHTML = '<img src="art/kasu-gold.svg" alt=""><span class="buff-text"><span class="buff-name">' + esc(K.L(e.name)) + '</span><span class="buff-desc">' + esc(K.L(e.desc)) + '</span></span>' +
        '<span class="buff-time" id="buff-time"></span><div class="buff-bar"><div id="buff-fill"></div></div>';
      bar.hidden = false;
    }
    $('buff-time').textContent = K.fmtClock(left);
    $('buff-fill').style.width = Math.max(0, left / b.dur * 100) + '%';
  };

  // --- こうか ---
  U.floatNum = function (x, y, text) {
    var fx = $('kasu-fx');
    var el = document.createElement('span');
    el.className = 'float-num';
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top = (y - 20) + 'px';
    fx.appendChild(el);
    setTimeout(function () { el.remove(); }, 1000);
  };

  // こすった 消しゴムの はしから カスが でて、つくえの カスに あつまる
  U.rubFx = function () {
    if (S().settings.reduceMotion) return;
    var fx = $('kasu-fx');
    var base = $('kasu-stage').getBoundingClientRect();
    var er = $('eraser').getBoundingClientRect();
    var ka = $('kasu-body').getBoundingClientRect();
    // 消しゴムの 左下（こすれる はし）
    var x0 = er.left - base.left + er.width * 0.12;
    var y0 = er.top - base.top + er.height * 0.78;
    var x1 = ka.left - base.left + ka.width * 0.5;
    var y1 = ka.top - base.top + ka.height * 0.5;
    var n = 3 + Math.floor(Math.random() * 3);
    for (var i = 0; i < n; i++) {
      var sp = document.createElement('span');
      sp.className = 'speck';
      sp.style.left = (x0 + Math.random() * 16 - 8) + 'px';
      sp.style.top = (y0 + Math.random() * 10 - 5) + 'px';
      var dx = x1 - x0 + (Math.random() * 60 - 30), dy = y1 - y0 + (Math.random() * 50 - 25);
      sp.style.setProperty('--mx', (dx * 0.35 + Math.random() * 30 - 15) + 'px');
      sp.style.setProperty('--my', (Math.min(dy, 0) * 0.3 - 20 - Math.random() * 30) + 'px');
      sp.style.setProperty('--dx', dx + 'px');
      sp.style.setProperty('--dy', dy + 'px');
      sp.style.setProperty('--r', (Math.random() * 360) + 'deg');
      sp.style.animationDelay = (i * 25) + 'ms';
      fx.appendChild(sp);
      (function (el) { setTimeout(function () { el.remove(); }, 800); })(sp);
    }
  };

  U.toast = function (html) {
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = html;
    var box = $('toasts');
    box.appendChild(el);
    // 3こまで。いっぺんに たくさん とれたときは ふるいものから けす
    while (box.children.length > 3) box.removeChild(box.firstChild);
    setTimeout(function () { el.remove(); }, 3300);
  };

  U.medalColor = function (a) {
    if (a.shadow) return '#5A5956';
    return { rub: '#F29CA3', buddy: '#8FA7C8', evolve: '#A9A49B', golden: '#E7B533', secret: '#CDBFA5' }[a.cat] || '#A9A49B';
  };

  // --- タブ（スマホ） ---
  U.setTab = function (tab) {
    U.tab = tab;
    document.querySelectorAll('.tabs [data-tab]').forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-tab') === tab)); });
    document.querySelectorAll('.pane').forEach(function (p) { p.classList.toggle('active', p.getAttribute('data-pane') === tab); });
    if (tab === 'menu' && K.screens) K.screens.renderMenu();
    if (tab === 'shop') { $('shop-badge').hidden = true; U.renderShop(true); }
    if (tab === 'desk') U.renderDesk(true);
  };

  U.renderAll = function () {
    U.applyStatic();
    $('bubble').textContent = K.quote(K.lang() === 'ja' ? '……' : '...');
    U.forceKasu = true;
    U.renderKasu();
    U.renderCounts();
    U.renderDesk(true);
    U.renderShop(true);
  };

  K.ui = U;
})(window.K = window.K || {});
