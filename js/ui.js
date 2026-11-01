// ゲーム画面の表示（カス・つくえ・みせ・ニュース・ゴールデン）
(function (K) {
  'use strict';
  var U = {};
  var $ = function (id) { return document.getElementById(id); };
  var S = function () { return K.state; };
  var t = function (k, v) { return K.t(k, v); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  U.esc = esc;

  U.bulk = 1;       // 1・10・100 か 'max'
  // いま 押したら 何こ 買う（売る）か
  U.amountFor = function (id) {
    if (U.bulk !== 'max') return U.bulk;
    return U.mode === 'sell' ? Math.max(1, S().buildings[id]) : Math.max(1, K.game.maxBuy(id));
  };
  U.mode = 'buy';
  U.tab = 'kasu';
  U.selUpgrade = null;

  U.narrow = function () { return window.matchMedia('(max-width: 900px)').matches; };

  // スマホでは キラキラタイムと セリフを つくえの 中に のせて、1画面に おさめる（PC は もとの 場所）
  U.placeForWidth = function () {
    var narrow = U.narrow();
    var stage = $('kasu-stage'), buff = $('buffbar'), bubble = $('bubble');
    if (narrow && buff.parentNode !== stage) { stage.appendChild(buff); stage.appendChild(bubble); }
    if (!narrow && buff.parentNode === stage) {
      $('panes').parentNode.insertBefore(buff, $('panes'));
      $('pane-kasu').insertBefore(bubble, document.querySelector('#pane-kasu .actions'));
    }
  };

  // --- 文字の反映（data-t / data-ui） ---
  U.applyStatic = function (root) {
    root = root || document;
    root.querySelectorAll('[data-t]').forEach(function (el) { el.textContent = t(el.getAttribute('data-t')); });
    root.querySelectorAll('[data-t-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-t-aria'))); });
    root.querySelectorAll('[data-ui]').forEach(function (el) {
      if (!el.firstChild) el.innerHTML = K.art.ui(el.getAttribute('data-ui'), 20);
    });
    document.documentElement.lang = K.lang();
    document.title = K.lang() === 'ja' ? 'けしカス / Eraser Crumb Clicker' : 'Eraser Crumb Clicker / けしカス';
  };

  var crumbIcon = function () { return K.art.ui('crumb', 11); };
  U.priceHtml = function (v, can) {
    return '<span class="price' + (can ? '' : ' no') + '">' + crumbIcon() + K.fmt(v) + '</span>';
  };

  // --- カス ---
  var lastSpecies = null;
  var lastScene = null;
  U.renderKasu = function () {
    var s = S();
    var sc = K.sceneFor(s.stage).id;
    if (sc !== lastScene) {
      lastScene = sc;
      $('kasu-stage').setAttribute('data-scene', sc);
      $('kasu-scene').innerHTML = K.art.scene(sc);
    }
    if (lastSpecies !== s.species || U.forceKasu) {
      U.forceKasu = false;
      lastSpecies = s.species;
      var info = K.evo.info(s.species);
      $('kasu-body').innerHTML = K.art.kasuPic(info);
      $('kasu').setAttribute('aria-label', K.L(info.name));
      var st = $('kasu-stage');
      st.classList.toggle('lv6', info.stage === 6);
      st.classList.toggle('lv7', info.stage >= 7);
      $('stage-badge').textContent = info.special ? t('specialBadge') : t('stageBadge', { n: info.stage });
      $('stage-badge').className = 'badge ' + (info.special ? 'badge-special' : 'badge-stage');
      $('kasu-name').textContent = K.L(info.name);
      $('eraser-btn').setAttribute('aria-label', t('kasuLabel'));
    }
    var pet = $('kasu-pet');
    pet.textContent = s.name ? K.quote(s.name) : (s.named ? '✎' : '✎ ' + t('nameIt'));
    pet.setAttribute('aria-label', t('nameIt'));
    pet.classList.toggle('unnamed', !s.name);
    var next = K.evo.nextNeed();
    $('kasu-next').textContent = next == null ? t('maxEvo') : t('nextEvo', { p: Math.floor(K.evo.progress() * 100) });
    $('evo-bar').style.width = (K.evo.progress() * 100).toFixed(1) + '%';
    U.renderEraser();
    U.renderMess();
  };

  // --- まるめる（ガチャの ページ）---
  var gachaSig = '';
  U.rolling = false;
  U.renderGacha = function (force) {
    var s = S(), E = K.evo;
    var tk = s.tickets || 0;
    // したの メニューと PC の きりかえに かみの まいすう
    $('gacha-badge').hidden = tk < 1 || U.tab === 'gacha';
    $('gacha-badge').textContent = tk > 99 ? '99+' : tk;
    document.querySelectorAll('.mid-badge').forEach(function (el) { el.hidden = tk < 1 || U.mid === 'gacha'; el.textContent = tk > 99 ? '99+' : tk; });
    var life = E.life(), left = life - (s.wear || 0);
    $('gm-wear-text').textContent = t('gNextSleeveVal', { n: K.fmt(left) });
    $('gm-wear-bar').style.width = (E.wearRatio() * 100).toFixed(1) + '%';
    var active = U.tab === 'gacha' || (U.mid === 'gacha' && !U.narrow());
    var missing = E.missing().length;
    var sig = [K.lang(), tk, s.dry, s.stamps, s.stage, E.pool().join(','), E.foundCount(), (s.rollLog || []).length && s.rollLog[0].id, U.rolling, missing].join('|');
    if ((sig === gachaSig && !force) || !active) return;
    gachaSig = sig;
    if (!$('gacha-machine').firstChild) $('gacha-machine').innerHTML = K.art.gachaMachine();
    $('gm-tickets').textContent = '×' + K.fmt(tk);
    $('roll-btn').disabled = tk < 1 || U.rolling;
    $('roll-sub').textContent = tk < 1 ? t('rollNoTicket') : !missing ? t('rollAllFound') : t('rollSub', { f: E.foundCount(), t: E.TOTAL, k: E.pityLeft() });
    // 天井
    var dry = missing ? Math.min(s.dry || 0, E.PITY - 1) : 0, ph = '';
    for (var i = 0; i < E.PITY; i++) ph += '<i class="' + (i < dry ? 'on' : '') + (i === E.PITY - 1 ? ' last' : '') + '"></i>';
    $('gm-pity').innerHTML = ph;
    $('gm-pity-text').textContent = missing ? t('gPityVal', { k: E.pityLeft() }) : t('gPityNone');
    // スタンプ
    var st = s.stamps || 0, sh = '';
    for (var j = 0; j < E.STAMPS; j++) sh += '<i class="' + (j < st % E.STAMPS || (st >= E.STAMPS) ? 'on' : '') + '"></i>';
    $('gm-stamps').innerHTML = sh;
    $('gm-stamp-text').textContent = K.fmt(st) + ' / ' + E.STAMPS;
    // でる いろ
    $('gm-colors').innerHTML = E.pool().map(function (id) {
      var tr = E.traitById[id];
      return '<span class="gm-color"><span class="chip-dot" style="background:' + (tr.chipBg || tr.chip) + '"></span>' + esc(K.L(tr.name)) + '</span>';
    }).join('') + (E.shapePool().length ? '<span class="gm-color gm-shape">' + K.art.ui('roll', 14) + esc(t('gShape', { p: Math.round(E.SHAPE_RATE * 100) })) + '</span>' : '');
    // でる STAGE
    var r = E.stageRates(), rh = '';
    for (var n = s.stage; n >= 1; n--) {
      rh += '<span class="gm-rate"><span class="badge badge-stage">' + esc(t('stageBadge', { n: n })) + '</span><span class="gm-rate-bar"><i style="width:' + (r[n] * 100).toFixed(1) + '%"></i></span><b>' + Math.round(r[n] * 100) + '%</b></span>';
    }
    $('gm-rates').innerHTML = rh;
    // さいきん
    var log = s.rollLog || [];
    $('gm-history').innerHTML = log.length ? log.map(function (x) {
      var info = E.info(x.id);
      return '<span class="gm-h' + (x.n ? ' new' : '') + '" title="' + esc(K.L(info.name)) + '">' + K.art.kasuPic(info) + (x.n ? '<span class="badge badge-new">' + esc(t('newBadge')) + '</span>' : '') + '</span>';
    }).join('') : '<span class="gm-empty">' + esc(t('gHistoryNone')) + '</span>';
  };

  // ダブったときの けっか（あたらしい ときは しんかの 演出が でる）
  U.showRollResult = function (r) {
    var el = $('gm-result');
    var info = K.evo.info(r.id);
    el.hidden = false;
    el.className = 'gacha-result ' + (r.isNew ? 'new' : 'dup');
    el.innerHTML = '<span class="gr-pic">' + K.art.kasuPic(info) + '</span><span class="gr-text"><b>' + esc(K.L(info.name)) + '</b><small>' +
      esc(r.isNew ? t('rolled') : t('gDupNote', { n: S().stamps, m: K.evo.STAMPS })) + '</small></span>';
    el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
  };

  // PC: まんなかの れつを「つくえ」と「まるめる」で きりかえる
  U.mid = 'desk';
  U.setMid = function (mid) {
    U.mid = mid;
    $('panes').setAttribute('data-mid', mid);
    document.querySelectorAll('.mid-switch [data-mid]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-mid') === mid)); });
    if (mid === 'gacha') U.renderGacha(true); else U.renderDesk(true);
  };

  // けしゴムの へりぐあい（10だんかいで かきなおす）。ゲストけしゴムを もっている あいだは その けしゴム
  var lastWear = -1, lastHold = null;
  U.renderEraser = function () {
    var hold = K.guest.held();
    var w = hold === 'rocket' ? K.rt.rocket.left : Math.floor(K.evo.wearRatio() * 10);
    if (w === lastWear && hold === lastHold) return;
    var swapped = hold !== lastHold;
    lastWear = w;
    lastHold = hold;
    $('eraser').innerHTML = hold ? K.art.bigEraser(hold, w) : K.art.eraser(w / 10);
    $('eraser-btn').style.setProperty('--wear', hold ? '0' : (K.evo.wearRatio()).toFixed(2));
    var stage = $('kasu-stage');
    if (hold) stage.setAttribute('data-hold', hold); else stage.removeAttribute('data-hold');
    if (swapped) {
      var btn = $('eraser-btn');
      btn.classList.remove('swap'); void btn.offsetWidth; btn.classList.add('swap');
    }
  };

  // ロケットの こまが とびだした
  U.rocketPop = function (gain, big) {
    U.renderEraser();
    U.toast('<b>' + esc(K.L(K.guest.byId.rocket.name)) + '</b> ' + esc(t(big ? 'rocketBig' : 'rocketPop')) + ' ' + esc(t('luckyGain', { v: K.fmt(gain) })));
    K.sound.play('reward');
  };

  // つかいきった！ あたらしい けしゴムと かみ 1まい
  U.eraserDone = function () {
    lastWear = -1;
    U.renderEraser();
    var el = $('eraser-btn');
    el.classList.remove('fresh'); void el.offsetWidth; el.classList.add('fresh');
    var tk = $('gm-tickets');
    tk.classList.remove('got'); void tk.offsetWidth; tk.classList.add('got');
    U.toast('<b>' + esc(t('eraserDone')) + '</b> ' + esc(t('ticketPlus')));
    K.sound.play('reward');
  };

  // つくえに ちらかった つぶ（ふくと とんでいく）
  var MESS_DOTS = 24, messBuilt = false, lastMess = -1;
  var blowingUntil = 0;
  U.renderMess = function () {
    if (Date.now() < blowingUntil) return;
    var box = $('kasu-mess');
    if (!messBuilt) {
      messBuilt = true;
      var h = '';
      for (var i = 0; i < MESS_DOTS; i++) {
        var a = Math.random() * Math.PI * 2, d = 18 + Math.random() * 30;
        h += '<span class="mess-dot k' + (1 + (i % 4)) + '" style="left:' + (50 + Math.cos(a) * d).toFixed(1) + '%;top:' + (62 + Math.sin(a) * d * 0.45).toFixed(1) + '%;rotate:' + Math.floor(Math.random() * 360) + 'deg"></span>';
      }
      box.innerHTML = h;
    }
    var n = Math.round((K.rt.mess || 0) / K.game.MESS_MAX * MESS_DOTS);
    if (n === lastMess) return;
    lastMess = n;
    var dots = box.children;
    for (var j = 0; j < dots.length; j++) dots[j].classList.toggle('on', j < n);
    var full = (K.rt.mess || 0) >= K.game.MESS_MAX;
    $('blow-btn').classList.toggle('ready', full);
    $('blow-btn').style.setProperty('--mess', ((K.rt.mess || 0) / K.game.MESS_MAX).toFixed(2));
  };
  U.blowMess = function () {
    var box = $('kasu-mess');
    blowingUntil = Date.now() + 700;
    box.classList.remove('blowing'); void box.offsetWidth; box.classList.add('blowing');
    setTimeout(function () { box.classList.remove('blowing'); lastMess = -1; U.renderMess(); }, 700);
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
    renderGoal();
    renderMission();
    // ほめる の まちじかん
    var wait = Math.ceil((K.rt.praiseReadyAt - Date.now()) / 1000);
    $('praise-btn').disabled = wait > 0;
    var happy = Math.ceil((K.rt.praiseUntil - Date.now()) / 1000);
    $('praise-label').textContent = happy > 0 ? t('praiseHappy', { s: happy }) : wait > 0 ? t('praiseWait', { s: wait }) : t('praise');
    $('praise-btn').title = t('praiseHelp');
    renderAdBtn();
    $('blow-btn').title = t('blowHelp', { v: K.fmt(K.game.blowGain(), { decimals: 1 }) });
    // てんせいボタン
    var pend = K.ascend.pending();
    $('rebirth-btn').classList.toggle('ready', pend > 0);
    // ひきだし
    var dOpen = K.drawer.unlocked();
    $('drawer-btn').hidden = !dOpen;
    var ready = dOpen ? K.drawer.readyCount() : 0;
    $('drawer-badge').hidden = ready === 0;
    $('drawer-badge').textContent = ready;
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
      var size = b.id === 'roller' || b.id === 'paralleldesk' ? [46, 38] : b.id === 'ant' ? [34, 22] : b.id === 'finger' ? [22, 30] : [34, 34];
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
  // つぎの めあて: いま買える いちばん 高い もの（なければ いちばん 安い もの）。スマホでも その場で 買える
  var goalTarget = null;
  function renderGoal() {
    var s = S(), best = null, cands = [];
    K.game.visibleBuildings().forEach(function (v) {
      if (v.locked) { cands.push({ cost: v.b.cost, kind: 'l', sel: '.bld[data-lock="' + v.b.id + '"]', name: t('locked'), icon: '<span class="bld-shadow">' + K.art.building(v.b.id, 26, 26) + '</span>' }); return; }
      cands.push({ cost: K.game.price(v.b.id, 1), kind: 'b', id: v.b.id, sel: '.bld[data-b="' + v.b.id + '"]', name: K.L(v.b.name), icon: K.art.building(v.b.id, 26, 26) });
    });
    K.game.availableUpgrades().forEach(function (u) {
      cands.push({ cost: u.cost, kind: 'u', id: u.id, sel: '.up[data-up="' + u.id + '"]', name: K.L(u.name), icon: K.art.upIcon(u.icon, 22) });
    });
    cands.forEach(function (c) { c.afford = c.kind !== 'l' && c.cost <= s.crumbs; });
    cands.filter(function (c) { return c.afford; }).forEach(function (c) { if (!best || c.cost > best.cost) best = c; });
    if (!best) cands.forEach(function (c) { if (!best || c.cost < best.cost) best = c; });
    var el = $('goal');
    el.hidden = !best;
    goalTarget = best;
    if (!best) return;
    var key = best.sel + best.kind + best.name;
    if (el.getAttribute('data-key') !== key) {
      el.setAttribute('data-key', key);
      el.innerHTML = '<button type="button" class="goal-go"><span class="goal-ico">' + best.icon + '</span><span class="goal-text"><span class="goal-name"></span><small class="goal-sub"></small><span class="goal-bar"><span></span></span></span></button>' +
        '<button type="button" class="goal-buy">' + esc(t('buy')) + '</button>';
      el.querySelector('.goal-go').onclick = U.goalClick;
      el.querySelector('.goal-buy').onclick = U.goalBuy;
    }
    el.classList.toggle('ready', best.afford);
    el.querySelector('.goal-name').textContent = best.name + '　' + K.fmt(best.cost);
    el.querySelector('.goal-sub').textContent = best.afford ? t('goalReady') : t('goalLack', { n: K.fmt(best.cost - s.crumbs) });
    el.querySelector('.goal-bar > span').style.width = Math.max(0, Math.min(100, s.crumbs / best.cost * 100)).toFixed(1) + '%';
    el.querySelector('.goal-buy').disabled = !best.afford;
  }
  U.goalClick = function () {
    if (!goalTarget) return;
    if (U.narrow()) U.setTab('shop');
    var el = document.querySelector(goalTarget.sel);
    if (!el) return;
    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    el.classList.remove('goal-ping'); void el.offsetWidth; el.classList.add('goal-ping');
  };
  U.goalBuy = function () {
    var g = goalTarget;
    if (!g || !g.afford) return;
    K.rt.lastAction = Date.now();
    var ok = g.kind === 'u' ? K.game.buyUpgrade(g.id) : K.game.buy(g.id, 1);
    if (!ok) { K.sound.play('deny'); return; }
    K.sound.play(g.kind === 'u' ? 'upgrade' : 'buy', { n: 1 });
    U.renderShop(true);
    U.renderDesk(true);
    U.renderCounts();
  };

  // ミッション: いちばん 達成に ちかい 目標を 1行で。おすと 3つ ぜんぶ
  function renderMission() {
    var el = $('mission');
    var s = S();
    if (s.tutorial < 9) { el.hidden = true; return; }
    var list = K.missions.list();
    if (!list.length) { el.hidden = true; return; }
    var x = list.slice().sort(function (a, b) { return b.pct - a.pct; })[0];
    el.hidden = false;
    var key = x.id + x.target + x.r + K.lang();
    if (el.getAttribute('data-key') !== key) {
      el.setAttribute('data-key', key);
      el.innerHTML = '<span class="ms-head">' + esc(t('missionTitle')) + '</span><span class="ms-text"></span><span class="ms-bar"><span></span></span><span class="ms-rw"></span>';
      el.querySelector('.ms-text').textContent = K.missions.text(x);
      el.querySelector('.ms-rw').textContent = x.r === 't' ? t('rewardTicketShort') : '+' + K.fmt(Math.max(50, Math.ceil(K.game.cps() * 180)));
    }
    el.querySelector('.ms-bar > span').style.width = (x.pct * 100).toFixed(1) + '%';
    el.setAttribute('aria-label', t('missionTitle') + ': ' + K.missions.text(x) + ' ' + K.missions.progress(x));
  }

  U.renderShop = function (force) {
    var s = S();
    var ups = K.game.availableUpgrades();
    var vis = K.game.visibleBuildings();
    // 「買える／買えない」が変わったときだけ描きなおす
    var sig = [K.lang(), U.bulk, U.mode, U.selUpgrade, U.openInfo,
      ups.map(function (u) { return u.id + (s.crumbs >= u.cost ? '1' : '0'); }).join(','),
      vis.map(function (v) { return v.b.id + s.buildings[v.b.id] + (s.crumbs >= K.game.price(v.b.id, U.amountFor(v.b.id)) ? '1' : '0') + (U.bulk === 'max' ? U.amountFor(v.b.id) : '') + v.locked; }).join(',')
    ].join('|');
    if (sig === shopSig && !force) return;
    var becameAffordable = {};
    if (shopSig) {
      vis.forEach(function (v) {
        var el = document.querySelector('.bld[data-b="' + v.b.id + '"]');
        if (el && el.classList.contains('cant') && s.crumbs >= K.game.price(v.b.id, U.amountFor(v.b.id)) && U.mode === 'buy') becameAffordable[v.b.id] = true;
      });
    }
    shopSig = sig;

    // bulk / mode
    document.querySelectorAll('#bulk [data-bulk]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-bulk') === String(U.bulk))); });
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

    // どうぐ
    var bh = '';
    vis.forEach(function (v) {
      var b = v.b;
      if (v.locked) {
        // まだ 買えない どうぐは かげ（シルエット）だけ。名前は ないしょ
        bh += '<div class="bld-wrap"><div class="bld cant locked" aria-disabled="true" data-lock="' + b.id + '"><span class="bld-ico bld-shadow">' + K.art.building(b.id, 32, 32) + '</span>' +
          '<span class="bld-text"><span class="bld-name">' + esc(t('locked')) + '</span>' + U.priceHtml(b.cost, false) + '</span></div></div>';
        return;
      }
      var owned = s.buildings[b.id];
      var sell = U.mode === 'sell';
      var amount = U.amountFor(b.id);
      var price = sell ? K.game.sellValue(b.id, amount) : K.game.price(b.id, amount);
      var can = sell ? owned > 0 : s.crumbs >= price;
      var rate = '+' + K.fmtPerSec(K.game.unitCps(b.id) * K.game.globalMult());
      var open = U.openInfo === b.id;
      bh += '<div class="bld-wrap' + (open ? ' open' : '') + '">' +
        '<button type="button" class="bld ' + (can ? 'can' : 'cant') + (sell ? ' sell' : '') + (becameAffordable[b.id] ? ' became' : '') + '" data-b="' + b.id + '">' +
        '<span class="bld-ico">' + K.art.building(b.id, 32, 32) + '</span>' +
        '<span class="bld-text"><span class="bld-name">' + esc(K.L(b.name)) + (amount > 1 ? ' <small>x' + amount + '</small>' : '') + '</span>' +
        '<span class="bld-line">' + esc(K.L(b.line)) + '</span>' +
        '<span class="bld-sub">' + (sell ? '<span class="price">' + crumbIcon() + '+' + K.fmt(price) + '</span>' : U.priceHtml(price, can)) + '<span class="bld-rate">' + rate + '</span></span></span>' +
        '<span class="bld-own">' + (owned || '') + '</span></button>' +
        // スマホは ホバーが ないので、よこの ボタンで くわしく ひらく（PC は ホバーで でる）
        '<button type="button" class="bld-info" data-info="' + b.id + '" aria-expanded="' + open + '" aria-label="' + esc(t('buddyInfo')) + '">' +
        '<span class="bld-info-pct" data-pct="' + b.id + '">' + pct(K.game.share(b.id)) + '</span>' + K.art.ui('chev', 14) + '</button>' +
        (open ? '<div class="bld-stats" data-stats="' + b.id + '">' + U.bldStatsHtml(b.id) + '</div>' : '') +
        '</div>';
    });
    $('shop-list').innerHTML = bh;
    if (tipId) U.showTip(tipId);
    if (upTipId) U.showUpTip(upTipId);

    // スマホの「みせ」タブの数字（買えるものの数）
    var n = ups.filter(function (u) { return s.crumbs >= u.cost; }).length +
      vis.filter(function (v) { return !v.locked && s.crumbs >= K.game.price(v.b.id, 1); }).length;
    $('shop-badge').hidden = n === 0 || U.tab === 'shop';
    $('shop-badge').textContent = n > 9 ? '9+' : n;
  };

  // --- どうぐの くわしい 数字（クッキークリッカーの 施設の ツールチップ） ---
  U.openInfo = null;   // スマホで ひらいている どうぐ
  var tipId = null;    // PC で カーソルを のせている どうぐ
  var upTipId = null;  // PC で カーソルを のせている アップグレード
  U.hoverTips = function () { return window.matchMedia('(hover: hover) and (pointer: fine)').matches; };

  function pct(r) {
    var v = r * 100;
    if (v <= 0) return '0%';
    if (v < 0.1) return '<0.1%';
    return (v >= 99.95 ? '100' : v < 10 ? v.toFixed(1) : v.toFixed(0)) + '%';
  }

  U.bldStatsHtml = function (id) {
    var s = S();
    var b = K.game.buildingById[id];
    var n = s.buildings[id];
    var share = K.game.share(id);
    var row = function (label, value) { return '<span class="bst-k">' + esc(label) + '</span><b class="bst-v">' + value + '</b>'; };
    // せつめいは 店の 行に いつも 出ているので、ここは 数字だけ
    return '<div class="bst-grid">' +
        row(t('statEach'), '+' + K.fmtPerSec(K.game.unitCps(id) * K.game.globalMult())) +
        (n ? row(t('statAll', { n: K.fmt(n) }), '+' + K.fmtPerSec(K.game.buildingCps(id))) +
          row(t('statShare'), pct(share)) +
          '<span class="bst-bar" aria-hidden="true"><span style="width:' + Math.min(100, share * 100).toFixed(1) + '%"></span></span>'
          : row(t('statAll', { n: 0 }), esc(t('statNone')))) +
        row(t('statMade'), crumbIcon() + K.fmt(s.produced[id] || 0)) +
      '</div>';
  };

  U.showTip = function (id) {
    var tip = $('bld-tip');
    var row = id && document.querySelector('.bld[data-b="' + id + '"]');
    if (!row || !U.hoverTips()) { U.hideTip(); return; }
    tipId = id;
    var b = K.game.buildingById[id];
    tip.innerHTML = '<div class="bst-head">' + K.art.building(id, 28, 28) + '<b>' + esc(K.L(b.name)) + '</b><span>x' + S().buildings[id] + '</span></div>' + U.bldStatsHtml(id);
    tip.hidden = false;
    var r = row.getBoundingClientRect();
    var top = Math.max(8, Math.min(r.top, window.innerHeight - tip.offsetHeight - 8));
    tip.style.top = top + 'px';
    tip.style.left = Math.max(8, r.left - tip.offsetWidth - 12) + 'px';
  };
  U.hideTip = function () { tipId = null; upTipId = null; $('bld-tip').hidden = true; };

  // PC: アップグレードに カーソルを のせると 名前と せつめい（おさなくても 読める）
  U.showUpTip = function (id) {
    var tip = $('bld-tip');
    var el = id && document.querySelector('.up[data-up="' + id + '"]');
    var u = id && K.game.upgradeById[id];
    if (!el || !u || !U.hoverTips()) { U.hideTip(); return; }
    tipId = null; upTipId = id;
    tip.innerHTML = '<div class="bst-head">' + K.art.upIcon(u.icon, 24) + '<b>' + esc(K.L(u.name)) + '</b></div>' +
      '<div class="bst-line">' + esc(K.L(u.desc)) + '</div>' + U.priceHtml(u.cost, S().crumbs >= u.cost);
    tip.hidden = false;
    var r = el.getBoundingClientRect();
    tip.style.top = Math.max(8, Math.min(r.top, window.innerHeight - tip.offsetHeight - 8)) + 'px';
    tip.style.left = Math.max(8, r.left - tip.offsetWidth - 12) + 'px';
  };

  // 数字は まいフレーム かわるので、ひらいている ものだけ 0.5びょうごとに かきなおす
  var statsAt = 0;
  U.renderBldStats = function () {
    var n = Date.now();
    if (n - statsAt < 500) return;
    statsAt = n;
    document.querySelectorAll('[data-pct]').forEach(function (el) { el.textContent = pct(K.game.share(el.getAttribute('data-pct'))); });
    var box = U.openInfo && document.querySelector('[data-stats="' + U.openInfo + '"]');
    if (box) box.innerHTML = U.bldStatsHtml(U.openInfo);
    if (tipId) U.showTip(tipId);
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

  // --- ゲストけしゴム（ゴールデンも）---
  // ふつうの けしゴム（#guest）と ゴールデン（#guest-gold）は べつべつに 来る
  var guestSig = {};
  function renderSlot(g, elId) {
    var el = $(elId);
    if (!g) {
      if (!el.hidden) { el.hidden = true; guestSig[elId] = ''; }
      return;
    }
    var info = K.guest.byId[g.id];
    var star = K.guest.stars(g.id);
    var label = t('guestCame', { n: K.L(info.name) + (star ? ' ' + '★'.repeat(star) : '') });
    var sig = g.id + '|' + K.lang();
    if (el.hidden) {
      var panes = $('panes');
      var r = panes.getBoundingClientRect();
      var host = $('screen-game').getBoundingClientRect();
      var size = U.narrow() ? 64 : 80;
      el.style.left = Math.round(r.left - host.left + g.x * (r.width - size)) + 'px';
      el.style.top = Math.round(r.top - host.top + 28 + g.y * (r.height - size - 28 - (U.narrow() ? 90 : 0))) + 'px';
      el.hidden = false;
      el.classList.remove('leaving');
    }
    if (sig !== guestSig[elId]) {
      guestSig[elId] = sig;
      el.setAttribute('data-id', g.id);
      el.classList.toggle('is-golden', g.id === 'golden');
      el.querySelector('.guest-art').innerHTML = K.art.guest(g.id, 56, 48);
      el.querySelector('.guest-label').textContent = label;
      el.setAttribute('aria-label', label);
    }
    el.classList.toggle('leaving', g.until - Date.now() < 1500);
  }
  // ふしぎなできごと: つくえの カスの よこに「！」が うかぶ（js/incidents.js）
  var incSig = '';
  U.renderIncident = function () {
    var el = $('incident'), id = K.incident.current;
    if (!id || K.screens.isOpen()) {
      if (!el.hidden) { el.hidden = true; incSig = ''; }
      return;
    }
    var x = K.incident.byId[id];
    // カスの つくえ（スマホで ほかの タブの ときは 見えないので かくす）
    var r = $('kasu-stage').getBoundingClientRect(), host = $('screen-game').getBoundingClientRect();
    if (!r.width) { if (!el.hidden) { el.hidden = true; incSig = ''; } return; }
    var sig = id + '|' + K.lang() + '|' + Math.round(r.left) + ',' + Math.round(r.top) + ',' + Math.round(r.width);
    if (sig === incSig) return;
    incSig = sig;
    var size = U.narrow() ? 64 : 80;
    el.style.left = Math.round(r.left - host.left + r.width * 0.06 + 20) + 'px';
    el.style.top = Math.round(r.top - host.top + r.height * 0.62) + 'px';
    el.querySelector('.guest-art').innerHTML = K.art.incident(id, size - 16, size - 24);
    el.querySelector('.guest-label').textContent = K.L(x.label);
    el.setAttribute('aria-label', K.L(x.label));
    el.hidden = false;
  };

  U.renderGuest = function () {
    renderSlot(K.guest.current, 'guest');
    renderSlot(K.guest.gold, 'guest-gold');
  };

  // つかった ときの おしらせ
  U.guestUsed = function (r) {
    var info = K.guest.byId[r.id], E = K.guest.EFFECTS;
    var name = '<b>' + esc(K.L(info.name)) + '</b> ';
    if (r.effect === 'lucky') U.toast('<b>' + esc(K.L(E.lucky.name)) + '</b> ' + esc(t('luckyGain', { v: K.fmt(r.gain) })));
    else if (r.effect === 'kado') U.toast(name + esc(K.L(E.kado.desc)));
    else U.toast('<b>' + esc(K.L(E[r.effect].name)) + '</b> ' + esc(K.L(E[r.effect].desc)));
    if (r.starUp) U.toast('<b>' + esc(t('starUp', { n: K.L(info.name), s: r.starUp })) + '</b> ' + esc(r.starUp >= 5 ? K.guest.star5Text(r.id) : t('starUpMore')));
    var elId = r.gold ? 'guest-gold' : 'guest';
    $(elId).hidden = true;
    U.renderEraser();
    guestSig[elId] = '';
    buffSig = ''; // ★が 上がって 説明が かわったかも しれないので バーを 作りなおす
    U.say(r.id === 'golden' ? K.news.monologue('golden') : K.L(info.line));
  };

  // CrazyGames 版の「広告で 2倍」ボタン。ほかの 場所では 出さない
  function renderAdBtn() {
    var btn = $('ad-btn');
    if (!K.ads || !K.ads.canAd()) { if (!btn.hidden) btn.hidden = true; return; }
    btn.hidden = false;
    var wait = Math.ceil(K.ads.boostWait());
    btn.disabled = wait > 0;
    var label = wait > 0 ? K.fmtClock(wait) : t('adBoostBtn');
    if ($('ad-label').textContent !== label) $('ad-label').textContent = label;
    btn.title = t('adBoostHelp');
  }

  // いま きいている こうか（いくつでも ならべる）
  var buffSig = '';
  U.renderBuff = function () {
    var list = K.guest.activeBuffs();
    var bar = $('buffbar');
    var gold = K.guest.goldActive();
    $('screen-game').classList.toggle('gold-mode', gold);
    $('kasu-stage').classList.toggle('golden-on', gold);
    // 電動消しゴムの 間は つくえを おさえても スクロールしない（おしっぱなしが とぎれないように）
    $('kasu-stage').classList.toggle('hold-rub', K.game.buffActive('dendo'));
    if (!list.length) { if (!bar.hidden) { bar.hidden = true; buffSig = ''; } return; }
    var sig = list.map(function (b) { return b.id; }).join(',') + '|' + K.lang();
    if (sig !== buffSig) {
      buffSig = sig;
      bar.innerHTML = list.map(function (b) {
        var e = b.id.indexOf('d_') === 0 ? K.drawer.EFFECTS[b.id.slice(2)] : b.id.indexOf('a_') === 0 ? K.ads.EFFECTS[b.id.slice(2)] : K.guest.EFFECTS[b.id];
        var icon = e.mat ? K.art.upIcon(e.mat, 32) : e.ui ? K.art.ui(e.ui, 28) : K.art.guest(e.src, 36, 32);
        return '<div class="buff' + (e.gold ? ' is-gold' : '') + '" data-id="' + b.id + '">' + icon +
          '<span class="buff-text"><span class="buff-name">' + esc(K.L(e.name)) + '</span><span class="buff-desc">' + esc(K.L(e.desc)) + '</span></span>' +
          '<span class="buff-short">' + esc(K.L(e.short)) + '</span>' +
          '<span class="buff-time"></span><div class="buff-bar"><div class="buff-fill"></div></div></div>';
      }).join('');
      bar.hidden = false;
    }
    list.forEach(function (b, i) {
      var row = bar.children[i];
      row.querySelector('.buff-time').textContent = b.count != null ? t('kadoLeft', { n: b.count }) : b.pieces != null ? t('rocketLeft', { n: b.pieces }) : K.fmtClock(b.left);
      row.querySelector('.buff-fill').style.width = Math.max(0, b.ratio * 100) + '%';
    });
  };

  // --- こうか ---
  U.floatNum = function (x, y, text, combo) {
    var fx = $('kasu-fx');
    var el = document.createElement('span');
    el.className = 'float-num';
    el.textContent = text;
    // れんぞくで こするほど 数字が 大きく なる
    if (combo) el.style.fontSize = Math.round(24 + Math.min(combo, 30) * 0.5) + 'px';
    el.style.setProperty('--fx', (Math.random() * 40 - 20) + 'px');
    el.style.left = x + 'px';
    el.style.top = (y - 20) + 'px';
    fx.appendChild(el);
    setTimeout(function () { el.remove(); }, 1000);
  };

  // こすった 消しゴムの はしから カスが でて、つくえの カスに あつまる
  U.rubFx = function (combo) {
    if (S().settings.reduceMotion) return;
    var fx = $('kasu-fx');
    var base = $('kasu-stage').getBoundingClientRect();
    var er = $('eraser').getBoundingClientRect();
    var ka = $('kasu-body').getBoundingClientRect();
    // 消しゴムの 先（ななめに 立てた ピンクの かど。つくえに あたって いる ところ）
    var x0 = er.left - base.left + er.width * 0.22;
    var y0 = er.top - base.top + er.height * 0.94;
    var x1 = ka.left - base.left + ka.width * 0.5;
    var y1 = ka.top - base.top + ka.height * 0.5;
    // 先っぽに ぽふっと けむり
    var puff = document.createElement('span');
    puff.className = 'rub-puff';
    puff.style.left = x0 + 'px';
    puff.style.top = y0 + 'px';
    fx.appendChild(puff);
    setTimeout(function () { puff.remove(); }, 450);
    var n = 5 + Math.floor(Math.random() * 3) + Math.min(Math.floor((combo || 0) / 8), 3);
    for (var i = 0; i < n; i++) {
      var sp = document.createElement('span');
      sp.className = 'speck k' + (1 + Math.floor(Math.random() * 4));
      sp.style.scale = (0.8 + Math.random() * 0.6).toFixed(2);
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

  // 通知は 1つずつ 順番に 出す（かさなって 画面を ふさがない）。たまっていたら はやく 次へ
  var toastQ = [], toastBusy = false;
  function toastNext() {
    var html = toastQ.shift();
    if (html == null) { toastBusy = false; return; }
    toastBusy = true;
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = html;
    $('toasts').appendChild(el);
    var life = toastQ.length >= 2 ? 1500 : (toastQ.length === 1 ? 2200 : 3000);
    setTimeout(function () { el.remove(); setTimeout(toastNext, 120); }, life);
  }
  U.toast = function (html) {
    if (toastQ.length >= 6) toastQ.splice(0, toastQ.length - 5); // たまりすぎは ふるいものから すてる
    toastQ.push(html);
    if (!toastBusy) toastNext();
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
    if (tab === 'gacha') U.renderGacha(true);
    // スマホで えらんだ ページを PC に もどした ときも まんなかを あわせる
    if (tab === 'gacha' || tab === 'desk') U.setMid(tab);
  };

  U.renderAll = function () {
    U.applyStatic();
    $('bubble').textContent = K.quote(K.lang() === 'ja' ? '……' : '...');
    U.forceKasu = true;
    U.renderKasu();
    U.renderCounts();
    U.renderDesk(true);
    U.renderShop(true);
    U.renderGacha(true);
  };

  K.ui = U;
})(window.K = window.K || {});
