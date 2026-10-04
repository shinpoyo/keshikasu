// タイトル・なまえ・チュートリアル・ダイアログ・しんかの演出
(function (K) {
  'use strict';
  var SC = {};
  var $ = function (id) { return document.getElementById(id); };
  var S = function () { return K.state; };
  var t = function (k, v) { return K.t(k, v); };
  var esc = function (s) { return K.ui.esc(s); };
  var VERSION = '0.41'; // index.html の ?v= と そろえる（ブラウザの キャッシュで 古い js が のこらないように）

  function show(id) {
    ['screen-title', 'screen-naming', 'screen-game'].forEach(function (s) { $(s).hidden = s !== id; });
  }
  SC.show = show;

  function deskScene(src, cls) {
    return '<div class="title-desk ' + (cls || '') + '"><div class="kasu-paper"></div><img src="' + src + '" alt=""><span class="title-eraser">' + K.art.eraser() + '</span></div>';
  }

  // ---------- タイトル ----------
  SC.title = function (hasSave) {
    var s = S();
    var el = $('screen-title');
    el.innerHTML =
      '<div class="title-logo">' + K.art.svg('0 0 40 40', '<rect x="3" y="9" width="34" height="22" rx="6" fill="#F29CA3"/><rect x="15" y="9" width="22" height="22" fill="#3E6FB0"/><circle cx="8" cy="35" r="2" fill="#B8B4AC"/><circle cx="13" cy="36.5" r="1.3" fill="#B8B4AC"/>', 64, 64) +
      '<span class="title-sub">' + (K.lang() === 'ja' ? 'ERASER CRUMB CLICKER' : 'けしカス') + '</span>' +
      '<h1 class="title-name' + (t('gameName').length > 12 ? ' long' : '') + '">' + esc(t('gameName')) + '</h1>' +
      '<p class="title-tag">' + esc(t('tagline')) + '</p></div>' +
      deskScene(K.art.kasuSrc(hasSave ? s.stage : 1)) +
      '<div class="title-buttons">' +
      (hasSave ? '<button type="button" class="btn btn-pink btn-lg" id="t-continue">' + esc(t('continueWith', { n: K.fmt(s.crumbs) })) + '</button>' :
        '<button type="button" class="btn btn-pink btn-lg" id="t-start">' + esc(t('start')) + '</button>') +
      '</div>' +
      '<div class="title-foot">' +
      langSelect() +
      '<button type="button" class="link-btn" id="t-parents">' + esc(t('parents')) + '</button>' +
      '<span class="foot-note">' + esc(t(K.ads.on ? 'versionNoteAds' : 'versionNote', { v: VERSION })) + '</span></div>';
    show('screen-title');
    el.querySelector('.lang-select').onchange = function () { var l = this.value; K.loadLang(l, function () { S().settings.lang = l; K.store.save(); K.ui.applyStatic(); SC.title(hasSave); }); };
    $('t-parents').onclick = function () { SC.open('parents'); };
    var go = $('t-continue') || $('t-start');
    go.onclick = function () {
      K.sound.unlock();
      if (!S().started) { S().started = true; SC.naming(); } else { K.main.enterGame(); }
    };
  };

  // ---------- なまえ ----------
  // again: 消しゴムに もどった あとの 新しい カス（いまの 名前を 入れておく）
  SC.naming = function (again) {
    var el = $('screen-naming');
    var chips = t('namingChips').split(',');
    el.innerHTML =
      '<span class="naming-day">' + esc(again ? t('namingAgainDay', { n: S().stats.rebirths + 1 }) : t('day1')) + '</span>' +
      '<p class="naming-lead">' + esc(t(again ? 'namingAgainLead' : 'namingLead')) + '</p>' +
      deskScene(K.art.kasuSrc(1), 'naming-desk') +
      '<h1 class="naming-title">' + esc(t('namingTitle')) + '</h1>' +
      '<input class="naming-input" id="n-input" maxlength="12" autocomplete="off" placeholder="' + esc(t('namingPlaceholder')) + '" aria-label="' + esc(t('namingPlaceholder')) + '">' +
      '<div class="chips">' + chips.map(function (c) { return '<button type="button" class="chip" data-chip="' + esc(c) + '" aria-pressed="false">' + esc(c) + '</button>'; }).join('') + '</div>' +
      '<div class="title-buttons"><button type="button" class="btn btn-pink btn-lg" id="n-ok">' + esc(t('namingOk')) + '</button>' +
      '<button type="button" class="btn btn-ghost" id="n-skip">' + esc(t('noName')) + '</button></div>' +
      '<p class="naming-note">' + esc(t('namingNote')) + '</p>';
    show('screen-naming');
    var input = $('n-input');
    if (again) { input.value = S().name || ''; K.ads.gameplayStop(); }
    // 名前を きめたら ゲームへ（もどった あとは もう 遊んでいる ので 画面を もどすだけ）
    var go = function () {
      if (!again) { K.main.enterGame(); return; }
      show('screen-game');
      K.ui.renderAll();
      K.ads.gameplayStart();
      K.store.save();
    };
    function syncChips() {
      el.querySelectorAll('[data-chip]').forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-chip') === input.value)); });
      $('n-ok').disabled = !input.value.trim();
    }
    el.querySelectorAll('[data-chip]').forEach(function (c) { c.onclick = function () { input.value = c.getAttribute('data-chip'); syncChips(); }; });
    input.oninput = syncChips;
    syncChips();
    $('n-ok').onclick = function () {
      var v = input.value.trim().slice(0, 12);
      if (!v) return;
      S().name = v; S().named = true;
      go();
    };
    $('n-skip').onclick = function () { S().named = true; S().name = ''; go(); };
  };

  // ---------- チュートリアル（3ステップ） ----------
  SC.coach = function () {
    var s = S();
    var el = $('coach');
    document.querySelectorAll('.coach-target').forEach(function (n) { n.classList.remove('coach-target'); });
    if (s.tutorial >= 9) { el.hidden = true; return; }
    if (s.tutorial === 0) s.tutorial = 1;
    var step = s.tutorial;
    var body = step === 2 && K.ui.narrow() ? t('tut2BodyMobile') : t('tut' + step + 'Body');
    el.innerHTML = '<span class="coach-step">' + step + ' / 3</span>' +
      '<span class="coach-title">' + esc(t('tut' + step + 'Title')) + '</span>' +
      '<span class="coach-body">' + esc(body) + '</span>' +
      '<div class="coach-foot"><button type="button" class="coach-skip" id="coach-skip">' + esc(t('tutSkip')) + '</button>' +
      (step === 3 ? '<button type="button" class="coach-ok" id="coach-ok">' + esc(t('tutOk')) + '</button>' : '') + '</div>';
    el.setAttribute('data-step', step); // CSS で 「とばす」の いちを かえる
    el.hidden = false;
    $('coach-skip').onclick = function () { s.tutorial = 9; SC.coach(); };
    if ($('coach-ok')) $('coach-ok').onclick = function () { s.tutorial = 9; SC.coach(); };
    if (step === 1) $('kasu-stage').classList.add('coach-target');
    if (step === 2) {
      var f = document.querySelector('.bld[data-b="finger"]');
      if (f) f.classList.add('coach-target');
      if (K.ui.narrow()) document.querySelector('.tabs [data-tab="shop"]').classList.add('coach-target');
    }
  };

  // 状態を見て すすめる
  SC.coachTick = function () {
    var s = S();
    if (s.tutorial >= 9) return;
    if (s.tutorial === 1 && s.stats.rubs >= 10) { s.tutorial = 2; SC.coach(); }
    else if (s.tutorial === 2 && s.buildings.finger > 0) { s.tutorial = 3; SC.coach(); }
    else if (s.tutorial === 2 && !document.querySelector('.bld.coach-target')) {
      var f = document.querySelector('.bld[data-b="finger"]');
      if (f) f.classList.add('coach-target');
    }
  };

  // ---------- メニュー（スマホのタブ） ----------
  SC.renderMenu = function () {
    var s = S();
    var pend = K.ascend.pending();
    var item = function (open, icon, label, sub, num, cls) {
      return '<button type="button" class="menu-item ' + (cls || '') + '" data-open="' + open + '">' + icon +
        '<span class="menu-item-text"><b>' + esc(label) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span>' +
        (num ? '<span class="menu-item-num">' + esc(num) + '</span>' : '') + '</button>';
    };
    $('pane-menu').innerHTML = '<div class="pane-head"><h2>' + esc(t('menu')) + '</h2></div><div class="menu-list">' +
      item('zukan', K.art.ui('zukan', 24), t('zukan'), '', K.evo.foundCount() + ' / ' + K.evo.TOTAL) +
      item('achievements', K.art.ui('ach', 24), t('achievements'), '', K.game.achievementCount() + ' / ' + K.game.achievementTotal) +
      item('stats', K.art.ui('stats', 24), t('stats')) +
      (K.drawer.unlocked() ? item('drawer', K.art.ui('drawer', 24), t('drawer'), K.drawer.readyCount() ? t('drawerReadyHint', { n: K.drawer.readyCount() }) : '', '', K.drawer.readyCount() ? 'gold' : '') : '') +
      item('shardshop', K.art.upIcon('shard', 24), t('shardShop'), '', s.shards + ' ' + t('shardsUnit')) +
      item('rebirth', K.art.ui('eraser', 24), t('rebirth'), pend > 0 ? t('rebirthMenuHint', { n: pend }) : '', '', pend > 0 ? 'gold' : '') +
      '</div><div class="menu-sub">' +
      '<button type="button" data-open="settings">' + K.art.ui('settings', 20) + esc(t('settings')) + '</button>' +
      '<button type="button" data-open="save">' + K.art.ui('save', 20) + esc(t('saveMenu')) + '</button>' +
      '<button type="button" data-open="parents">' + K.art.ui('parents', 20) + esc(t('parents')) + '</button></div>';
  };

  // ---------- ダイアログ ----------
  var current = null;
  var state = { zukanSel: null, zukanTab: 'kasu', achSel: null, achCat: 'all' };

  function head(title, extra) {
    return '<div class="modal-head"><h1>' + esc(title) + '</h1>' + (extra || '') +
      '<button type="button" class="icon-btn" data-close aria-label="' + esc(t('close')) + '">' + K.art.ui('close', 20) + '</button></div>';
  }

  SC.open = function (name) {
    current = name;
    var card = $('modal-card');
    card.className = 'modal-card';
    var html = RENDER[name] ? RENDER[name](card) : '';
    card.innerHTML = html;
    $('modal').hidden = false;
    if (AFTER[name]) AFTER[name](card);
    card.scrollTop = 0;
    var first = card.querySelector('[data-close]');
    if (first && !K.ui.narrow()) first.focus({ preventScroll: true });
  };

  SC.refresh = function () { if (current && !$('modal').hidden) { var y = $('modal-card').scrollTop; SC.open(current); $('modal-card').scrollTop = y; } };

  SC.close = function () {
    if (current === 'welcome' && SC.onWelcomeClose) { SC.onWelcomeClose(); SC.onWelcomeClose = null; }
    current = null;
    $('modal').hidden = true;
    $('modal-card').innerHTML = '';
  };
  SC.isOpen = function () { return !$('modal').hidden; };

  var RENDER = {}, AFTER = {};

  // ずかん
  RENDER.zukan = function (card) {
    card.classList.add('wide');
    var s = S();
    if (state.zukanTab === 'eraser') return head(t('zukanTitle')) + zukanTabs() + eraserPage();
    var sel = state.zukanSel || s.species;
    // No. じゅんに 1ほんで ならべる。STAGE ごとに みだしを いれる（とくべつは さいご）
    var cells = '', cur = null;
    K.evo.DEX.forEach(function (id) {
      var st = K.evo.info(id).stage;
      var key = st == null ? 'sp' : st;
      if (key !== cur) {
        cur = key;
        cells += '<span class="z-group">' + (st == null ? esc(t('specialBadge')) + ' ・ ' + esc(t('special')) : esc(t('stageBadge', { n: st })) + ' ・ ' + esc(K.L(K.data.stages[st - 1].name))) + '</span>';
      }
      cells += zcell(id);
    });
    return head(t('zukanTitle'), '<span class="head-count">' + t('zukanCount', { n: K.evo.foundCount(), t: K.evo.TOTAL }) + '</span><span class="head-pill">+' + Math.round(K.evo.BONUS * 100 * K.evo.foundCount()) + '% /s</span>') +
      zukanTabs() +
      '<p class="lead">' + esc(t('titlePrefix', { t: K.L(K.evo.title()) })) + ' ・ ' + esc(t('zukanBonus', { n: Math.round(K.evo.BONUS * 100) })) + '</p>' +
      '<div class="zukan-layout"><div class="zukan-grid">' + cells + '</div>' + zdetail(sel) + '</div>';
  };
  function zcell(id) {
    var s = S();
    var info = K.evo.info(id);
    var found = s.zukan[id];
    var isNew = found && Date.now() - found.at < 10 * 60 * 1000;
    var sel = (state.zukanSel || s.species) === id;
    return '<button type="button" class="z-cell' + (found ? '' : ' unk') + (sel ? ' sel' : '') + '" data-z="' + id + '" aria-label="' + esc(found ? K.L(info.name) : t('notFound')) + '">' +
      K.art.kasuPic(info, { plain: !found, lazy: true }) +
      (found ? '' : '<span class="z-q">?</span>') + '<span class="z-no">' + K.evo.noLabel(id) + '</span>' +
      (isNew ? '<span class="badge badge-new z-new">' + t('newBadge') + '</span>' : '') + '</button>';
  }
  // スタンプで こうかん（いま まるめて でる かのうせいが ある ものだけ）
  function tradeBtn(id) {
    if (!K.evo.canTrade(id)) return '';
    var have = S().stamps || 0, can = have >= K.evo.STAMPS;
    return '<button type="button" class="btn btn-pink z-trade-btn" data-trade="' + id + '"' + (can ? '' : ' disabled') + '>' +
      K.art.ui('stamp', 16) + esc(t('tradeBtn', { n: have, m: K.evo.STAMPS })) + '</button>';
  }
  function zdetail(id) {
    var s = S();
    var info = K.evo.info(id);
    var found = s.zukan[id];
    if (!found) {
      return '<div class="z-detail"><div class="z-detail-img"><img src="' + info.art + '" alt="" style="filter:brightness(0) opacity(.15)"></div>' +
        '<div class="z-detail-body"><span class="z-detail-no">' + K.evo.noLabel(id) + '</span><span class="badge ' + (info.special ? 'badge-special' : 'badge-stage') + '" style="align-self:flex-start">' + (info.special ? t('specialBadge') : t('stageBadge', { n: info.stage })) + '</span>' +
        '<h3>？？？</h3><p class="z-quote">' + esc(info.hint ? K.L(info.hint) : t('notFound')) + '</p>' + tradeBtn(id) + '</div></div>';
    }
    var mat = found.mat ? K.game.materialById[found.mat] : null;
    var other = K.lang() === 'en' ? info.name.ja : info.name.en; // 下に 小さく べつの ことばの 名前
    return '<div class="z-detail"><div class="z-detail-img">' + K.art.kasuPic(info) + '</div>' +
      '<div class="z-detail-body"><span class="z-detail-no">' + K.evo.noLabel(id) + '</span><span class="badge ' + (info.special ? 'badge-special' : 'badge-stage') + '" style="align-self:flex-start">' + (info.special ? t('specialBadge') : t('stageBadge', { n: info.stage })) + '</span>' +
      '<h3>' + esc(K.L(info.name)) + '</h3><span class="z-en">' + esc(other) + '</span>' +
      '<p class="z-quote">' + esc(K.quote(K.L(info.line))) + '</p>' +
      '<div class="z-meta"><span>' + esc(t('foundOn')) + '</span><b>' + K.fmtDate(found.at) + '</b>' +
      '<span>' + esc(t('mixedWith')) + '</span><b>' + esc(mat ? K.L(mat.name) : t('mixedNone')) + '</b>' +
      '<span>' + esc(t('ownedCount')) + '</span><b>' + K.fmt(found.n || 1) + '</b></div>' +
      (s.species === id ? '<span class="z-ondesk">' + esc(t('onDesk')) + '</span>'
        : '<button type="button" class="btn z-desk-btn" data-desk="' + id + '">' + esc(t('putOnDesk')) + '</button>') +
      '</div></div>';
  }
  // ずかんの ページ: カス と 消しゴム
  function zukanTabs() {
    return '<div class="seg zukan-tabs" role="group">' + [['kasu', 'zukanTabKasu'], ['eraser', 'zukanTabEraser']].map(function (x) {
      return '<button type="button" data-ztab="' + x[0] + '" aria-pressed="' + (state.zukanTab === x[0]) + '">' + esc(t(x[1])) + '</button>';
    }).join('') + '</div>';
  }
  // 消しゴムの ページ: 来る 消しゴムの ★と つよさ（ゴールデンは ★なし なので のせない）
  var SEAL = '<svg class="er-seal" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="#E7B533" stroke="#2B2A28" stroke-width="2.4"/><path d="M20 9l3.2 6.6 7.2 1-5.2 5.1 1.2 7.2L20 25.5l-6.4 3.4 1.2-7.2-5.2-5.1 7.2-1z" fill="#FFF6D6" stroke="#2B2A28" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  function eraserPage() {
    var G = K.guest, top = K.evo.maxStageFound();
    var cards = K.data.guests.filter(function (g) { return G.STAR[g.id]; }).map(function (g) {
      if (g.stage > top) {
        return '<div class="er-card locked"><div class="er-pic">' + K.art.bigEraser(g.id, 5) + '</div>' +
          '<div class="er-body"><h3>？？？</h3><p class="er-note">' + esc(t('eraserLocked', { n: g.stage })) + '</p></div></div>';
      }
      var star = G.stars(g.id), max = star >= 5, left = G.toNext(g.id);
      var from = star ? G.STAR_AT[star - 1] : 0, ratio = max ? 1 : (G.uses(g.id) - from) / (G.STAR_AT[star] - from);
      var stars = '<span class="er-stars" aria-label="★' + star + '">' + '★'.repeat(star) + '<i>' + '★'.repeat(5 - star) + '</i></span>';
      return '<div class="er-card' + (max ? ' max' : '') + '"><div class="er-pic">' + K.art.bigEraser(g.id, G.power(g.id, star).pieces || 5) + (max ? SEAL : '') + '</div>' +
        '<div class="er-body"><h3>' + esc(K.L(g.name)) + ' ' + stars + '</h3>' +
        '<p class="er-line">' + esc(K.quote(K.L(g.line))) + '</p>' +
        '<p class="er-eff"><b>' + esc(t('eraserNow')) + '</b> ' + esc(G.effectText(g.id, star)) + '</p>' +
        '<p class="er-next">' + esc(max ? t('eraserMax') : star ? t('eraserNext', { n: left, s: star + 1 }) : t('eraserUnused')) + '</p>' +
        '<div class="er-bar"><span style="width:' + Math.round(ratio * 100) + '%"></span></div>' +
        (max ? '' : '<p class="er-note">' + esc(t('eraserStar5')) + ': ' + esc(G.star5Text(g.id)) + '</p>') +
        '</div></div>';
    }).join('');
    return '<p class="lead">' + esc(t('eraserLead')) + '</p><div class="er-grid">' + cards + '</div>';
  }

  AFTER.zukan = function (card) {
    card.querySelectorAll('[data-ztab]').forEach(function (b) {
      b.onclick = function () { state.zukanTab = b.getAttribute('data-ztab'); SC.refresh(); };
    });
    card.querySelectorAll('[data-z]').forEach(function (b) {
      b.onclick = function () { state.zukanSel = b.getAttribute('data-z'); SC.refresh(); };
    });
    card.querySelectorAll('[data-desk]').forEach(function (b) {
      b.onclick = function () { if (K.evo.setDesk(b.getAttribute('data-desk'))) { K.ui.renderKasu(); SC.refresh(); } };
    });
    card.querySelectorAll('[data-trade]').forEach(function (b) {
      b.onclick = function () { if (K.evo.trade(b.getAttribute('data-trade'))) { SC.close(); K.ui.renderKasu(); } };
    });
  };

  // じっせき
  var CATS = [['rub', 'catRub'], ['buddy', 'catBuddy'], ['evolve', 'catEvolve'], ['golden', 'catGolden'], ['secret', 'catSecret']];
  // じっせきの 絵: 何を すれば とれるかが 分かる 絵
  function achIcon(a, size) {
    var A = K.art, img = function (src) { return '<img src="' + src + '" alt="" style="width:' + size + 'px;height:' + size + 'px;object-fit:contain">'; };
    switch (a.type) {
      case 'rubs': case 'handmade': return A.upIcon('rub', size);
      case 'total': return A.ui('crumb', size);
      case 'cps': return A.upIcon('pencil', size);
      case 'building': return A.building(a.b, size, size);
      case 'stage': case 'dexStage': return img(A.kasuSrc(a.n));
      case 'shapes': case 'shapesAll': return img('art/katachi-dragon.svg');
      case 'specialsAll': return img('art/special-lucky.svg');
      case 'royal': return img('art/katachi-king.svg');
      case 'zukan': return A.ui('zukan', size);
      case 'rolls': return A.ui('roll', size);
      case 'mix': return A.upIcon('graphite', size);
      case 'rebirth': case 'erasers': return A.ui('eraser', size);
      case 'golden': return A.upIcon('golden', size);
      case 'guest': return A.guest(a.g, size, size);
      case 'guests': return A.guest('kadokeshi', size, size);
      case 'star5': return A.guest(a.n === 1 ? 'kaori' : 'jumbo', size, size);
      case 'trades': case 'dups': case 'dry': return A.ui('stamp', size);
      case 'shardBuys': case 'shardsHeld': return A.upIcon('shard', size);
      case 'harvests': return A.ui('drawer', size);
      case 'playHours': case 'night': case 'rested': case 'idle': return A.building('moon', size, size);
      case 'blowStreak': return A.ui('blow', size);
      case 'praises': return A.ui('praise', size);
      case 'named': return A.ui('logo', size);
      case 'sell': return A.ui('tabShop', size);
      case 'cheated': return A.ui('lock', size);
    }
    return A.upIcon('star', size);
  }
  function achRatio(a) {
    if (a.type === 'stage') return 0; // 「STAGE ○ の カス」は 数で すすむ ものでは ない
    var p = K.achieve.progress(a); return p.max > 0 ? Math.min(1, p.cur / p.max) : 0; }
  // 1こ分の マス。ひみつで まだの ものは「?」、まだの ものは うすい 絵
  function achCell(a, size, cls) {
    var got = !!S().achievements[a.id];
    if (!got && a.hidden) return '<span class="ach q' + (cls || '') + '">?</span>';
    return '<span class="ach ' + (got ? (a.shadow ? 'shadow' : 't' + a.tier) : 'no') + (cls || '') + '">' + achIcon(a, size) + '</span>';
  }
  function achNums(a) {
    var p = K.achieve.progress(a);
    var u = p.unit ? t('achUnit_' + p.unit) : '';
    var f = function (n) { return K.fmt(Math.floor(n)) + u; };
    return { text: t('achProgress', { n: K.fmt(Math.floor(Math.min(p.cur, p.max))), m: f(p.max) }), left: t('achLeft', { n: f(Math.max(0, p.max - p.cur)) }) };
  }
  RENDER.achievements = function (card) {
    card.classList.add('wide');
    var s = S();
    var n = K.game.achievementCount();
    var sel = null;
    K.data.achievements.forEach(function (a) { if (a.id === state.achSel) sel = a; });
    var tierName = function (a) { return t('achTier' + a.tier); };

    // くわしく
    var detail;
    if (sel) {
      var got = s.achievements[sel.id];
      var secret = !got && sel.hidden;
      var nums = achNums(sel);
      detail = '<div class="ach-detail">' + achCell(sel, 44, ' big') +
        '<div class="ach-detail-body"><span class="z-en">' + esc(t('cat' + sel.cat.charAt(0).toUpperCase() + sel.cat.slice(1))) + (secret || sel.shadow ? '' : ' ・ ' + esc(tierName(sel))) + '</span>' +
        '<h3>' + esc(secret ? '？？？' : K.L(sel.name)) + '</h3>' +
        '<p class="lead">' + esc(secret ? t('achLocked') : K.L(sel.desc)) + '</p>' +
        (got ? '<p class="z-quote">' + esc(K.quote(K.L(sel.quote))) + '</p><span class="z-en">' + K.fmtDate(got) + (sel.shadow ? '' : ' ・ +1% /s') + '</span>'
          : secret || sel.type === 'stage' ? '' : '<div class="bar"><div class="bar-fill" style="width:' + (achRatio(sel) * 100).toFixed(1) + '%"></div></div><p class="ach-left">' + esc(nums.text) + ' ・ ' + esc(nums.left) + '</p>') +
        '</div></div>';
    } else {
      detail = '<div class="ach-detail"><p class="lead">' + esc(t('achTap')) + '</p></div>';
    }

    // もうすぐ: まだの もので いちばん 近い 3こ
    var soon = K.data.achievements.filter(function (a) { return !s.achievements[a.id] && !a.hidden && !a.shadow; })
      .map(function (a) { return { a: a, r: achRatio(a) }; })
      .filter(function (x) { return x.r > 0 && x.r < 1; })
      .sort(function (x, y) { return y.r - x.r; }).slice(0, 3);
    var soonHtml = soon.length ? '<h3 class="ach-h">' + esc(t('achSoon')) + '</h3><div class="ach-soon">' + soon.map(function (x) {
      return '<button type="button" class="ach-soon-item" data-ach="' + x.a.id + '">' + achCell(x.a, 30) +
        '<span class="ach-soon-body"><b>' + esc(K.L(x.a.name)) + '</b><small>' + esc(achNums(x.a).text) + '</small>' +
        '<span class="bar"><span class="bar-fill" style="width:' + (x.r * 100).toFixed(1) + '%"></span></span></span></button>';
    }).join('') + '</div>' : '';

    // 系統ごと
    var sections = CATS.map(function (c) {
      var list = K.data.achievements.filter(function (a) { return a.cat === c[0] && (!a.shadow || s.achievements[a.id]); });
      var gotN = list.filter(function (a) { return s.achievements[a.id] && !a.shadow; }).length;
      var all = list.filter(function (a) { return !a.shadow; }).length;
      var cells = list.map(function (a) {
        var got = !!s.achievements[a.id], secret = !got && a.hidden;
        var r = got || secret ? 0 : achRatio(a);
        return '<button type="button" class="ach-btn' + (state.achSel === a.id ? ' sel' : '') + '" data-ach="' + a.id + '" aria-label="' + esc(secret ? t('achLocked') : K.L(a.name)) + '">' +
          achCell(a, 30) + (r > 0 ? '<span class="ach-p"><i style="width:' + (r * 100).toFixed(1) + '%"></i></span>' : '') + '</button>';
      }).join('');
      return '<div class="ach-sec"><h3>' + esc(t(c[1])) + '</h3><div class="bar"><div class="bar-fill" style="width:' + (all ? gotN / all * 100 : 0).toFixed(1) + '%"></div></div><small>' + gotN + ' / ' + all + '</small></div>' +
        '<div class="ach-grid">' + cells + '</div>';
    }).join('');

    var legend = '<div class="ach-legend"><span><i class="t1"></i>' + esc(t('achTier1')) + '</span><span><i class="t2"></i>' + esc(t('achTier2')) + '</span><span><i class="t3"></i>' + esc(t('achTier3')) + '</span><span><i class="no"></i>' + esc(t('achNotYet')) + '</span></div>';

    return head(t('achTitle'), '<span class="head-count">' + n + ' / ' + K.game.achievementTotal + '</span><span class="head-pill">+' + n + '% /s</span>') +
      '<p class="lead">' + esc(t('achBonus')) + '</p>' +
      '<div class="ach-layout"><div class="ach-main">' + soonHtml + legend + sections + '</div>' + detail + '</div>';
  };
  SC.achCell = achCell;
  AFTER.achievements = function (card) {
    card.querySelectorAll('[data-ach]').forEach(function (b) {
      b.onclick = function () {
        state.achSel = b.getAttribute('data-ach');
        SC.refresh();
        // スマホは くわしくが 上に あるので そこまで もどす
        var d = document.querySelector('.ach-detail');
        if (d && window.matchMedia('(max-width: 900px)').matches) d.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      };
    });
  };

  // とうけい
  RENDER.stats = function (card) {
    card.classList.add('wide');
    var s = S(), st = s.stats;
    var d = K.fmtDuration(st.playTime);
    var big = [
      [t('stAllTime'), K.fmt(s.allTimeCrumbs), 'Crumbs all time'],
      [t('stCps'), K.fmt(K.game.cps(), { decimals: 1 }), 'Per second'],
      [t('stRubs'), K.fmt(st.rubs), 'Rubs'],
      [t('stPlay'), t('hm', { h: d.h, m: d.m }), 'Time played']
    ];
    var buddies = 0;
    K.data.buildings.forEach(function (b) { buddies += s.buildings[b.id]; });
    var run = [
      [t('stRunCrumbs'), K.fmt(s.totalCrumbs)],
      [t('stHandmade'), K.fmt(s.handmade)],
      [t('stStage'), t('stageBadge', { n: s.stage })],
      [t('stRolls'), K.fmt(st.rolls || 0)],
      [t('stBuddies'), K.fmt(buddies)],
      [t('stUpgrades'), Object.keys(s.upgrades).length],
      [t('stPraises'), K.fmt(s.mood.praises)],
      [t('stBlows'), K.fmt(s.mood.blows)]
    ];
    var ever = [
      [t('stRebirths'), st.rebirths],
      [t('stShards'), s.shards],
      [t('stGolden'), st.golden],
      [t('stFound'), K.evo.foundCount() + ' / ' + K.evo.TOTAL],
      [t('stAch'), K.game.achievementCount() + ' / ' + K.game.achievementTotal],
      [t('stStarted'), K.fmtDate(st.firstPlay)]
    ];
    var lines = function (rows) { return rows.map(function (r) { return '<div class="stat-line"><span>' + esc(r[0]) + '</span><b>' + esc(r[1]) + '</b></div>'; }).join(''); };
    return head(t('statsTitle')) +
      '<div class="stat-big">' + big.map(function (b) { return '<div class="stat-card"><b>' + esc(b[1]) + '</b><span>' + esc(b[0]) + '</span>' + (K.lang() === 'ja' ? '<small>' + b[2] + '</small>' : '') + '</div>'; }).join('') + '</div>' +
      '<div class="stat-groups"><div class="stat-group"><h3>' + esc(t('stThisRun')) + '</h3>' + lines(run) + '</div>' +
      '<div class="stat-group"><h3>' + esc(t('stForever')) + '</h3>' + lines(ever) + '</div></div>';
  };

  // かけらの おみせ: 系統ごとの「道」。上から じゅんに 買える
  function branchIcon(br, size) {
    var f = br.icon[0], id = br.icon[1];
    return f === 'building' ? K.art.building(id, size, size) : K.art[f](id, size);
  }
  RENDER.shardshop = function (card) {
    card.classList.add('wide');
    var s = S(), byId = {};
    K.data.shardShop.forEach(function (it) { byId[it.id] = it; });
    var nx = K.ascend.next(), pend = K.ascend.pending();
    var next = '<div class="shard-next">' + K.art.upIcon('shard', 34) + '<div class="shard-next-body"><b>' + esc(t('shardNext', { n: K.fmt(Math.ceil(nx.left)) })) + '</b>' +
      '<small>' + esc(pend > 0 ? t('shardPending', { n: pend }) : t('shardPendingNone')) + '</small>' +
      '<div class="bar"><div class="bar-fill" style="width:' + (nx.ratio * 100).toFixed(1) + '%"></div></div></div></div>';
    var branches = K.data.shardBranches.map(function (br) {
      var list = K.data.shardShop.filter(function (it) { return it.branch === br.id; });
      var got = list.filter(function (it) { return s.shardUpgrades[it.id]; }).length;
      var nodes = list.map(function (it) {
        var owned = !!s.shardUpgrades[it.id];
        var locked = !owned && it.requires && !s.shardUpgrades[it.requires];
        var secret = it.secret && !owned && (locked || s.shardsEarned < it.cost);
        var can = K.ascend.canBuy(it);
        var st = owned ? 'owned' : locked ? 'lock' : can ? 'can' : 'cant';
        var need = locked ? '<span class="shard-need">' + esc(t('shardNeed', { n: byId[it.requires].secret && !s.shardUpgrades[it.requires] ? '？？？' : K.L(byId[it.requires].name) })) + '</span>' : '';
        return '<button type="button" class="shard-node ' + st + '" data-shard="' + it.id + '"' + (st === 'can' ? '' : ' aria-disabled="true"') + '>' +
          '<span class="shard-dot" aria-hidden="true"></span>' +
          '<span class="shard-main"><span class="shard-name">' + esc(secret ? '？？？' : K.L(it.name)) + '</span>' +
          '<span class="shard-desc">' + esc(secret ? K.L(it.hiddenDesc) : K.L(it.desc)) + '</span>' + need + '</span>' +
          (owned ? '<span class="shard-cost done">' + esc(t('stOwned')) + '</span>' : '<span class="shard-cost">' + K.art.upIcon('shard', 18) + it.cost + '</span>') + '</button>';
      }).join('');
      return '<section class="shard-branch"><div class="shard-bh"><span class="shard-bic">' + branchIcon(br, 26) + '</span>' + esc(K.L(br.name)) +
        '<small>' + got + ' / ' + list.length + '</small></div>' + nodes + '</section>';
    }).join('');
    return head(t('shardShop'), '<span class="shard-have">' + K.art.upIcon('shard', 24) + s.shards + ' <small style="font-size:13px">' + esc(t('shardsUnit')) + '</small></span>') +
      next +
      '<p class="lead">' + [t('shardShopDesc'), t('shardOrder'), t('shardBonus')].map(esc).join(K.lang() === 'ja' ? '' : ' ') + '</p>' +
      '<div class="shard-branches">' + branches + '</div>';
  };
  // ---------- ひきだし ----------
  var drawerTimer = null;
  function growText(sec) {
    var h = Math.floor(sec / 3600);
    return h ? t('drawerHours', { n: h }) : t('drawerMins', { n: Math.round(sec / 60) });
  }
  RENDER.drawer = function (card) {
    card.classList.add('mid');
    var D = K.drawer, d = D.state(), s = S();
    var free = D.firstEmpty();
    var slots = '';
    for (var i = 0; i < D.SLOTS; i++) {
      var x = d.slots[i];
      if (!D.slotOpen(i)) {
        slots += '<div class="dw-slot lock"><div class="dw-pot">?</div><b class="dw-name">' + esc(t('drawerLocked')) + '</b><span class="dw-state">' + esc(t('drawerLockHint', { n: D.SLOT_ZUKAN[i] })) + '</span></div>';
      } else if (!x) {
        slots += '<div class="dw-slot empty' + (i === free ? ' next' : '') + '"><div class="dw-pot">＋</div><b class="dw-name">' + esc(t('drawerEmpty')) + '</b>' +
          (i === free ? '<span class="dw-state">' + esc(t('drawerNextHere')) + '</span>' : '') + '</div>';
      } else {
        var m = K.game.materialById[x.mat], ready = D.ready(i);
        slots += '<div class="dw-slot' + (ready ? ' ready' : '') + '"><div class="dw-pot">' + K.art.upIcon(x.mat, 34) + '</div><b class="dw-name">' + esc(K.L(m.name)) + '</b>' +
          (ready ? '<span class="dw-state">' + esc(t('drawerReady')) + '</span><button type="button" class="btn btn-small btn-pink" data-dw-take="' + i + '">' + esc(t('drawerTake')) + '</button>'
            : '<span class="dw-state" data-dw-left="' + i + '"></span><div class="bar"><div class="bar-fill" data-dw-bar="' + i + '"></div></div>') + '</div>';
      }
    }
    // 材料は カードで ならべる。しまえない ときは わけを 書く
    var cards = D.SEEDS.map(function (seed) {
      var m = K.game.materialById[seed.mat], have = D.hasMat(seed), price = D.price(seed);
      var why = '';
      if (!have) why = t('drawerNeedMat', { m: K.L(m.name) });
      else if (D.inDrawer(seed.mat)) why = t('drawerAlready');
      else if (free < 0) why = t('drawerNoSpace');
      else if (s.crumbs < price) why = t('drawerNeedCrumbs', { v: K.fmt(price - s.crumbs) });
      return '<div class="dw-card' + (have ? '' : ' dw-no') + '">' +
        '<span class="dw-mini">' + K.art.upIcon(seed.mat, 30) + '</span>' +
        '<div class="dw-card-text"><b>' + esc(K.L(m.name)) + '<small>' + esc(growText(seed.grow)) + '</small></b>' +
        '<span class="dw-got">' + esc(K.L(seed.got)) + '</span>' +
        (why ? '<span class="dw-why">' + esc(why) + '</span>' : '') + '</div>' +
        '<div class="dw-card-buy">' + (have ? '<span class="dw-price">' + K.art.ui('crumb', 14) + K.fmt(price) + '</span>' : '') +
        '<button type="button" class="btn btn-small' + (why ? '' : ' btn-pink') + '" data-dw-put="' + seed.mat + '"' + (why ? ' disabled' : '') + '>' + esc(t('drawerPut')) + '</button></div></div>';
    }).join('');
    return head(t('drawer')) +
      '<p class="dw-lead">' + esc(t('drawerLead')) + '</p>' +
      '<ol class="dw-steps"><li>' + esc(t('drawerStep1')) + '</li><li>' + esc(t('drawerStep2')) + '</li><li>' + esc(t('drawerStep3')) + '</li></ol>' +
      '<div class="dw-top"><div class="dw-handle"></div><div class="dw-grid">' + slots + '</div></div>' +
      '<h2 class="dw-h2">' + esc(t('drawerList')) + '</h2>' +
      '<div class="dw-cards">' + cards + '</div>';
  };
  AFTER.drawer = function (card) {
    var D = K.drawer;
    card.querySelectorAll('[data-dw-put]').forEach(function (b) {
      b.onclick = function () {
        var i = D.firstEmpty();
        if (i >= 0 && D.plant(i, b.getAttribute('data-dw-put'))) {
          K.sound.play('upgrade'); K.store.save(); SC.refresh(); K.ui.renderAll();
        }
      };
    });
    card.querySelectorAll('[data-dw-take]').forEach(function (b) {
      b.onclick = function () {
        var r = D.harvest(+b.getAttribute('data-dw-take'));
        if (!r) return;
        var m = K.game.materialById[r.mat];
        K.sound.play('upgrade');
        K.ui.toast('<b>' + esc(K.L(m.name)) + '</b> ' + esc(r.gain != null ? t('luckyGain', { v: K.fmt(r.gain) }) : K.L(D.seedByMat[r.mat].got)));
        K.store.save(); SC.refresh(); K.ui.renderAll();
      };
    });
    // のこり時間を 1びょうごとに 書きかえる。育ちきったら 画面を 作りなおす
    clearInterval(drawerTimer);
    var tickLeft = function () {
      if (!card.isConnected || !card.querySelector('.dw-grid')) { clearInterval(drawerTimer); return; }
      var grown = false;
      card.querySelectorAll('[data-dw-left]').forEach(function (el) {
        var i = +el.getAttribute('data-dw-left');
        if (D.ready(i)) grown = true;
        el.textContent = t('drawerLeft', { t: K.fmtClock(D.left(i)) });
        var bar = card.querySelector('[data-dw-bar="' + i + '"]');
        if (bar) bar.style.width = (D.ratio(i) * 100) + '%';
      });
      if (grown) SC.refresh();
    };
    tickLeft();
    drawerTimer = setInterval(tickLeft, 1000);
  };

  AFTER.shardshop = function (card) {
    card.querySelectorAll('[data-shard]').forEach(function (b) {
      b.onclick = function () {
        if (K.ascend.buy(b.getAttribute('data-shard'))) { K.sound.play('upgrade'); K.store.save(); SC.refresh(); K.ui.renderAll(); }
      };
    });
  };

  // けしゴムに もどる
  RENDER.rebirth = function () {
    var s = S();
    var pend = K.ascend.pending();
    return '<div class="reb-scene"><div class="kasu-paper"></div><img src="' + K.art.kasuSrc(2) + '" alt="">' +
      K.art.svg('-4 -8 132 76', '<g transform="rotate(-12 60 30)"><rect x="0" y="0" width="120" height="58" rx="10" fill="#F29CA3" stroke="#2B2A28" stroke-width="3"/><rect x="44" y="-4" width="80" height="66" rx="3" fill="#3E6FB0" stroke="#2B2A28" stroke-width="3"/><rect x="56" y="18" width="56" height="22" rx="3" fill="#FFFFFF" opacity="0.92"/></g>', 130, 76) + '</div>' +
      '<h1 class="center">' + esc(t('rebirthTitle')) + '</h1>' +
      '<p class="lead center">' + t('rebirthLead') + '</p>' +
      '<div class="reb-gain">' + K.art.upIcon('shard', 34) + '<span class="reb-gain-text"><span>' + esc(t('rebirthGain')) + '</span>' +
      '<b>+' + pend + ' <small>' + esc(t('rebirthTotal', { n: s.shards + pend })) + '</small></b></span>' +
      '<span class="head-pill">+' + (s.shards + pend) + '% /s</span></div>' +
      (pend === 0 ? '<p class="warn">' + esc(t('rebirthNone')) + '</p>' : '') +
      '<div class="two-col"><div class="keep-box"><b style="color:var(--eraser-blue)">' + esc(t('rebirthKeep')) + '</b><span>' + t('rebirthKeepList') + '</span></div>' +
      '<div class="keep-box"><b style="color:var(--danger)">' + esc(t('rebirthLose')) + '</b><span>' + t('rebirthLoseList') + '</span></div></div>' +
      '<button type="button" class="btn btn-pink btn-lg" id="reb-go">' + esc(t('rebirthGo')) + '</button>' +
      '<button type="button" class="btn btn-ghost" data-close>' + esc(t('rebirthCancel')) + '</button>';
  };
  AFTER.rebirth = function () {
    $('reb-go').onclick = function () { SC.close(); SC.rebirthAnim(); };
  };

  SC.rebirthAnim = function () {
    K.sound.play('rebirth');
    var gain = K.ascend.rebirth();
    K.store.save();
    var el = document.createElement('div');
    el.className = 'reb-anim';
    el.innerHTML = '<div class="eraser">' + K.art.svg('-4 -8 132 76', '<rect x="0" y="0" width="120" height="58" rx="10" fill="#F29CA3" stroke="#2B2A28" stroke-width="3"/><rect x="44" y="-4" width="80" height="66" rx="3" fill="#3E6FB0" stroke="#2B2A28" stroke-width="3"/><rect x="56" y="18" width="56" height="22" rx="3" fill="#FFFFFF" opacity="0.92"/>', 200, 116) + '</div>' +
      '<p>' + esc(t('rebirthNarration')) + '</p>' +
      (gain > 0 ? '<span class="head-pill">+' + gain + ' ' + esc(t('shardsUnit')) + '</span>' : '') +
      '<img src="' + K.art.kasuSrc(1) + '" alt="">';
    document.body.appendChild(el);
    var done = function () {
      if (!el.parentNode) return;
      el.remove(); K.ui.renderAll(); K.ui.say(K.news.monologue('idle'));
      SC.naming(true); // 新しい カスにも 名前を つける
    };
    el.onclick = done;
    setTimeout(function () { if (el.parentNode) done(); }, S().settings.reduceMotion ? 1500 : 4200);
  };

  // ことばの えらびかた（タイトルと せってい）
  function langSelect() {
    return '<select class="lang-select" aria-label="Language">' + K.LANGS.map(function (l) {
      return '<option value="' + l.id + '"' + (l.id === K.lang() ? ' selected' : '') + '>' + esc(l.name) + '</option>';
    }).join('') + '</select>';
  }

  // せってい
  RENDER.settings = function () {
    var st = S().settings;
    var sw = function (key, on) { return '<button type="button" class="switch" role="switch" aria-checked="' + on + '" data-set="' + key + '"></button>'; };
    return head(t('settingsTitle')) +
      '<div class="set-row"><span>' + esc(t('setLang')) + '</span>' + langSelect() + '</div>' +
      '<div class="set-row"><span>' + K.art.ui('sound', 20) + esc(t('setSound')) + '</span>' + sw('sound', st.sound) + '</div>' +
      '<div class="set-row"><span>' + esc(t('setNotation')) + '</span><div class="lang-toggle"><button type="button" data-notation="short" aria-pressed="' + (st.notation !== 'sci') + '">1.23M</button><button type="button" data-notation="sci" aria-pressed="' + (st.notation === 'sci') + '">1.23e6</button></div></div>' +
      '<div class="set-row"><span>' + esc(t('setMotion')) + '</span>' + sw('reduceMotion', st.reduceMotion) + '</div>' +
      '<div class="set-row"><span>' + esc(t('setDark')) + '</span>' + sw('dark', st.dark) + '</div>' +
      '<div class="set-row"><span>' + K.art.ui('save', 20) + esc(t('setSave')) + '</span><div class="btn-row"><button type="button" class="btn" data-open="save">' + esc(t('exportBtn')) + ' / ' + esc(t('importBtn')) + '</button></div></div>' +
      '<button type="button" class="btn btn-danger" id="reset-btn">' + esc(t('resetBtn')) + '</button>' +
      parentsBox();
  };
  function parentsBox() {
    var ad = K.ads.on ? 'Ads' : '';
    return '<div class="parents-box"><h3>' + esc(t('parentsTitle')) + '</h3><p>' + t('parentsBody' + ad) + '</p>' + (K.lang() === 'ja' || K.lang() === 'en' ? '<p>' + esc(t('parentsBodyEn' + ad)) + '</p>' : '') + '</div>';
  }
  AFTER.settings = function (card) {
    card.querySelector('.lang-select').onchange = function () { var l = this.value; K.loadLang(l, function () { S().settings.lang = l; K.ui.applyStatic(); K.main.applySettings(); SC.refresh(); }); };
    card.querySelectorAll('[data-notation]').forEach(function (b) {
      b.onclick = function () { S().settings.notation = b.getAttribute('data-notation'); K.main.applySettings(); SC.refresh(); };
    });
    card.querySelectorAll('[data-set]').forEach(function (b) {
      b.onclick = function () { var k = b.getAttribute('data-set'); S().settings[k] = !S().settings[k]; K.main.applySettings(); SC.refresh(); };
    });
    var step = 0;
    $('reset-btn').onclick = function () {
      step++;
      if (step === 1) { $('reset-btn').textContent = t('resetConfirm1'); return; }
      if (step === 2) { $('reset-btn').textContent = t('resetConfirm2'); return; }
      K.main.hardReset();
    };
  };

  RENDER.parents = function () { return head(t('parentsTitle')) + parentsBox(); };

  // セーブ
  RENDER.save = function () {
    return head(t('saveTitle')) +
      '<h3>' + esc(t('exportBtn')) + '</h3><p class="lead">' + esc(t('saveExportLead')) + '</p>' +
      '<textarea class="savebox" id="save-out" readonly aria-label="' + esc(t('saveText')) + '">' + esc(K.store.exportText()) + '</textarea>' +
      '<button type="button" class="btn btn-blue" id="save-copy">' + esc(t('copy')) + '</button>' +
      '<h3>' + esc(t('importBtn')) + '</h3><p class="lead">' + esc(t('saveImportLead')) + '</p>' +
      '<textarea class="savebox" id="save-in" aria-label="' + esc(t('importBtn')) + '"></textarea>' +
      '<p class="warn">' + esc(t('saveImportWarn')) + '</p>' +
      '<button type="button" class="btn btn-pink" id="save-load">' + esc(t('importBtn')) + '</button>';
  };
  AFTER.save = function () {
    $('save-copy').onclick = function () {
      var ta = $('save-out');
      ta.select();
      var ok = function () { $('save-copy').textContent = t('copied'); };
      if (navigator.clipboard) navigator.clipboard.writeText(ta.value).then(ok, function () { try { document.execCommand('copy'); ok(); } catch (e) { /* 手で コピー */ } });
      else { try { document.execCommand('copy'); ok(); } catch (e) { /* 手で コピー */ } }
    };
    $('save-load').onclick = function () {
      var data = K.store.importText($('save-in').value);
      if (!data) { K.ui.toast(esc(t('importBad'))); return; }
      K.main.loadState(data);
      SC.close();
      K.ui.toast(esc(t('importOk')));
    };
  };

  // おかえり
  var welcomeData = null;
  SC.welcome = function (sec, gain, onClose) { welcomeData = { sec: sec, gain: gain, doubled: false }; SC.onWelcomeClose = onClose; SC.open('welcome'); };
  RENDER.welcome = function () {
    var d = K.fmtDuration(welcomeData.sec);
    return '<div class="welcome-scene">' + K.art.kasuPic(K.evo.info(S().species)) + '<span class="zzz">z z z</span></div>' +
      '<h1 class="center">' + esc(t('welcomeTitle')) + '</h1>' +
      '<div class="bubble">' + esc(K.quote(t('welcomeLine'))) + '</div>' +
      '<p class="lead center">' + esc(d.h ? t('welcomeWhile', { h: d.h, m: d.m }) : t('welcomeWhileM', { m: d.m })) + '</p>' +
      '<div class="welcome-gain" id="welcome-gain">+' + K.fmt(welcomeData.gain) + '</div>' +
      '<p class="lead center">' + esc(t('welcomeWorked')) + '</p>' +
      (K.ads.on && !welcomeData.doubled ?
        // 広告を 見ない ほうも 同じ 大きさ・同じ 見た目に する（CrazyGames の きまり）
        '<div class="ad-choice"><button type="button" class="btn btn-pink btn-lg" id="welcome-ad">' + K.art.ui('ad', 22) + esc(t('welcomeAd')) + '</button>' +
        '<button type="button" class="btn btn-pink btn-lg" data-close>' + esc(t('welcomeTake')) + '</button></div>' +
        '<p class="ad-note center">' + esc(t('adNote')) + '</p>' :
        '<button type="button" class="btn btn-pink btn-lg" data-close>' + esc(t('welcomeTake')) + '</button>');
  };
  AFTER.welcome = function () {
    var b = $('welcome-ad');
    if (!b) return;
    b.onclick = function () {
      b.disabled = true;
      K.ads.rewarded(function () {
        // 留守の 間の ぶんを もう1回 もらって 2倍に する
        K.game.earn(welcomeData.gain, false);
        welcomeData.gain *= 2;
        welcomeData.doubled = true;
        K.store.save();
        SC.refresh();
        K.ui.toast(esc(t('adThanks')));
      }, function () { b.disabled = false; K.ui.toast(esc(t('adFail'))); });
    };
  };

  // 広告で しばらく 2倍
  RENDER.adBoost = function () {
    var mins = Math.round(K.ads.BOOST_SEC / 60);
    return head(t('adBoostTitle')) +
      '<div class="welcome-scene">' + K.art.kasuPic(K.evo.info(S().species)) + '</div>' +
      '<p class="lead center">' + esc(t('adBoostBody', { m: mins })) + '</p>' +
      '<div class="ad-choice"><button type="button" class="btn btn-pink btn-lg" id="boost-ad">' + K.art.ui('ad', 22) + esc(t('adWatch')) + '</button>' +
      '<button type="button" class="btn btn-pink btn-lg" data-close>' + esc(t('adNo')) + '</button></div>' +
      '<p class="ad-note center">' + esc(t('adNote')) + '</p>';
  };
  AFTER.adBoost = function () {
    var b = $('boost-ad');
    b.onclick = function () {
      b.disabled = true;
      K.ads.rewarded(function () {
        K.ads.startBoost();
        SC.close();
        K.ui.renderAll();
        K.ui.toast(esc(t('adThanks')));
        if (K.sound) K.sound.play('golden');
      }, function () { b.disabled = false; K.ui.toast(esc(t('adFail'))); });
    };
  };

  // ひとやすみ
  RENDER.rest = function () {
    return '<div class="welcome-scene rest-scene"><span class="moon-dot"></span><img src="' + K.art.kasuSrc(S().stage) + '" alt=""><span class="zzz">z z z</span></div>' +
      '<h1 class="center">' + esc(t('restTitle')) + '</h1>' +
      '<p class="lead center">' + esc(t('restBody')) + '</p>' +
      '<button type="button" class="btn btn-blue btn-lg" id="rest-go">' + esc(t('restGo')) + '</button>' +
      '<button type="button" class="btn btn-ghost" data-close>' + esc(t('restContinue')) + '</button>';
  };
  AFTER.rest = function () {
    $('rest-go').onclick = function () {
      SC.close();
      S().stats.rested++;
      K.store.save();
      var el = document.createElement('div');
      el.className = 'sleep-overlay';
      el.innerHTML = '<img src="' + K.art.kasuSrc(S().stage) + '" alt=""><p>' + esc(t('restSleeping')) + '</p><button type="button" class="btn">' + esc(t('restWake')) + '</button>';
      document.body.appendChild(el);
      el.querySelector('button').onclick = function () { el.remove(); K.rt.sessionStart = Date.now(); K.rt.restShown = false; };
    };
  };

  // ---------- しんかの演出 ----------
  var evoOpen = false;
  SC.evoOpen = function () { return evoOpen; };
  // あたらしい カスの 演出（まるめて NEW が でた とき）。ひかる シルエットが いれかわりながら はやくなり → まっしろに フラッシュ → あたらしい カス
  // だんかいが あがるほど 紙ふぶきと 光が ふえる。まぜた ときは みじかい うずまき
  SC.showEvolution = function (ev) {
    evoOpen = true;
    var from = K.evo.info(ev.from), to = K.evo.info(ev.to);
    var isMix = ev.type === 'mix';
    var isRoll = ev.type === 'roll';
    // まるめる: でてくる カスとは かんけいなく、ずかんの ぜんぶから ランダムな シルエットを つぎつぎ いれかえる
    // （けっかを えらばない ので、かげから なにが でるか わからない）。だんだん はやくなる
    var decoyA = from, decoyB = to, cycle = null;
    if (isRoll) {
      cycle = [];
      var d = 460, tAt = 0, last = '';
      while (tAt < 3500) {
        var id;
        do { id = K.evo.DEX[Math.floor(Math.random() * K.evo.DEX.length)]; } while (id === last);
        last = id;
        cycle.push({ id: id, at: tAt });
        tAt += d; d = Math.max(80, d * 0.82);
      }
    }
    var reduce = !!S().settings.reduceMotion;
    var power = isMix ? 0 : Math.min(ev.stage || 7, 7); // だんかい（とくべつは 7 あつかい）
    var fx = '';
    if (!reduce) {
      var colors = to.special ? ['#E7B533', '#FFF6D6', '#F29CA3', '#FFD83F']
        : power >= 7 ? ['#8FA7C8', '#FFF6D6', '#9A7CFF', '#36B5F0', '#E7B533']
        : ['#F29CA3', '#3E6FB0', '#E7B533', '#F6F1E7'];
      var i;
      // あつまる ひかりの つぶ
      for (i = 0; i < (isMix ? 14 : 28); i++) {
        var ang = Math.random() * Math.PI * 2, dist = 180 + Math.random() * 260;
        fx += '<span class="evo-spark" style="--sx:' + Math.round(Math.cos(ang) * dist) + 'px;--sy:' + Math.round(Math.sin(ang) * dist) + 'px;animation-delay:' + (0.2 + Math.random() * (isMix ? 0.8 : 3.0)).toFixed(2) + 's"></span>';
      }
      // 紙ふぶき（フラッシュの あと）
      var n = isMix ? 0 : 30 + power * 14;
      for (i = 0; i < n; i++) {
        var a2 = Math.random() * Math.PI * 2, d2 = 160 + Math.random() * 420;
        fx += '<span class="evo-burst" style="background:' + colors[i % colors.length] + ';--bx:' + Math.round(Math.cos(a2) * d2) + 'px;--by:' + Math.round(Math.sin(a2) * d2 - 120) + 'px;--rot:' + Math.round(Math.random() * 900) + 'deg;animation-delay:' + (3.6 + Math.random() * 0.25).toFixed(2) + 's;animation-duration:' + (1.8 + Math.random() * 1.6).toFixed(2) + 's"></span>';
      }
      for (i = 0; i < (isMix ? 0 : 10 + power * 3); i++) {
        fx += '<span class="evo-star" style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (Math.random() * 100).toFixed(1) + '%;animation-delay:' + (3.8 + Math.random() * 2).toFixed(2) + 's"></span>';
      }
    }
    var line = K.L(to.line);
    if (ev.type === 'evolve' && !to.special && to.stage === ev.stage) line = K.L(K.data.stages[ev.stage - 1].line);
    var el = $('evo');
    el.className = 'evo' + (isMix ? ' mix' : ' lv' + power) + (to.special ? ' special' : '') + (reduce ? ' reduced' : '');
    el.innerHTML = '<div class="evo-rays"></div><div class="evo-rays evo-rays2"></div>' +
      '<div class="evo-rings">' + (isMix ? '<i></i>' : '<i></i><i></i><i></i>') + '</div>' + fx +
      '<div class="evo-inner">' +
        '<div class="evo-stagebox">' +
          (cycle ? '<div class="evo-morph cycle">' + cycle.map(function (c, i) { return '<span' + (i ? '' : ' class="on"') + '>' + K.art.kasuPic(K.evo.info(c.id)) + '</span>'; }).join('') + '</div>'
            : '<div class="evo-morph"><span class="evo-from">' + K.art.kasuPic(decoyA) + '</span><span class="evo-to">' + K.art.kasuPic(decoyB) + '</span></div>') +
          '<div class="evo-reveal">' + K.art.kasuPic(to) + '</div>' +
        '</div>' +
        '<span class="evo-kicker">' + (isMix ? 'MIX' : isRoll ? (to.special ? t('specialBadge') : t('newKasu') + ' ・ ' + t('stageBadge', { n: to.stage })) : t('evolution')) + '</span>' +
        '<h1 class="evo-title">' + esc(isMix ? t('mixed') : isRoll ? t(to.shape ? 'rolledShape' : 'rolled') : t('congrats')) + '</h1>' +
        '<p class="evo-result">' + t(isMix ? 'mixResult' : isRoll ? 'rollResult' : 'evoResult', { name: esc(K.L(to.name)) }) + '</p>' +
        '<p class="evo-line">' + esc(line) + '</p>' +
        (ev.isNew ? '<span class="evo-new">' + esc(t('zukanNew', { n: K.evo.foundCount(), t: K.evo.TOTAL })) + '</span>' : '') +
        '<span class="evo-tap">' + esc(t('tapToClose')) + '</span>' +
      '</div><div class="evo-flash"></div>';
    el.hidden = false;
    // 集中線・わっか・つぶを カスの まんなかに あわせる（文字の 行数で カスの 位置が かわるので）
    var box = el.querySelector('.evo-stagebox').getBoundingClientRect();
    el.style.setProperty('--cx', Math.round(box.left + box.width / 2) + 'px');
    el.style.setProperty('--cy', Math.round(box.top + box.height / 2) + 'px');
    if (!reduce) K.sound.play(isMix ? 'mixing' : 'charge');
    var revealAt = reduce ? 0 : (isMix ? 1100 : 3600); // css の --reveal と そろえる
    var timers = [setTimeout(function () { K.sound.play(isMix ? 'upgrade' : 'evolve'); }, revealAt)];
    if (cycle && !reduce) {
      var sils = el.querySelectorAll('.evo-morph.cycle > span');
      cycle.forEach(function (c, i) {
        if (!i) return;
        timers.push(setTimeout(function () { sils[i - 1].classList.remove('on'); sils[i].classList.add('on'); }, c.at));
      });
    }
    // スキップ不可。そのあと タップで とじる（自動でも とじる）
    var canClose = false;
    var minTime = reduce ? 800 : (isMix ? 2000 : 5600);
    timers.push(setTimeout(function () { canClose = true; }, minTime));
    var close = function () {
      if (!canClose) return;
      timers.forEach(clearTimeout);
      el.hidden = true; el.innerHTML = ''; evoOpen = false;
      K.ui.say(K.news.monologue(isMix ? 'mix' : 'evolve'));
    };
    el.onclick = close;
    timers.push(setTimeout(function () { canClose = true; close(); }, minTime + 6000));
  };

  K.screens = SC;
})(window.K = window.K || {});
