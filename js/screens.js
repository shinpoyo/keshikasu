// タイトル・なまえ・チュートリアル・ダイアログ・しんかの演出
(function (K) {
  'use strict';
  var SC = {};
  var $ = function (id) { return document.getElementById(id); };
  var S = function () { return K.state; };
  var t = function (k, v) { return K.t(k, v); };
  var esc = function (s) { return K.ui.esc(s); };
  var VERSION = '0.10'; // index.html の ?v= と そろえる（ブラウザの キャッシュで 古い js が のこらないように）

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
      '<span class="title-sub">' + (K.lang() === 'ja' ? 'ERASER CRUMBS' : 'けしカス') + '</span>' +
      '<h1 class="title-name">' + esc(t('gameName')) + '</h1>' +
      '<p class="title-tag">' + esc(t('tagline')) + '</p></div>' +
      deskScene(K.art.kasuSrc(hasSave ? s.stage : 1)) +
      '<div class="title-buttons">' +
      (hasSave ? '<button type="button" class="btn btn-pink btn-lg" id="t-continue">' + esc(t('continueWith', { n: K.fmt(s.crumbs) })) + '</button>' :
        '<button type="button" class="btn btn-pink btn-lg" id="t-start">' + esc(t('start')) + '</button>') +
      '</div>' +
      '<div class="title-foot">' +
      '<div class="lang-toggle" role="group" aria-label="Language">' +
      '<button type="button" data-lang="ja" aria-pressed="' + (K.lang() === 'ja') + '">にほんご</button>' +
      '<button type="button" data-lang="en" aria-pressed="' + (K.lang() === 'en') + '">English</button></div>' +
      '<button type="button" class="link-btn" id="t-parents">' + esc(t('parents')) + '</button>' +
      '<span class="foot-note">' + esc(t('versionNote', { v: VERSION })) + '</span></div>';
    show('screen-title');
    el.querySelectorAll('[data-lang]').forEach(function (b) {
      b.onclick = function () { S().settings.lang = b.getAttribute('data-lang'); K.store.save(); SC.title(hasSave); };
    });
    $('t-parents').onclick = function () { SC.open('parents'); };
    var go = $('t-continue') || $('t-start');
    go.onclick = function () {
      K.sound.unlock();
      if (!S().started) { S().started = true; SC.naming(); } else { K.main.enterGame(); }
    };
  };

  // ---------- なまえ ----------
  SC.naming = function () {
    var el = $('screen-naming');
    var chips = t('namingChips').split(',');
    el.innerHTML =
      '<span class="naming-day">' + esc(t('day1')) + '</span>' +
      '<p class="naming-lead">' + esc(t('namingLead')) + '</p>' +
      deskScene(K.art.kasuSrc(1), 'naming-desk') +
      '<h1 class="naming-title">' + esc(t('namingTitle')) + '</h1>' +
      '<input class="naming-input" id="n-input" maxlength="12" autocomplete="off" placeholder="' + esc(t('namingPlaceholder')) + '" aria-label="' + esc(t('namingPlaceholder')) + '">' +
      '<div class="chips">' + chips.map(function (c) { return '<button type="button" class="chip" data-chip="' + esc(c) + '" aria-pressed="false">' + esc(c) + '</button>'; }).join('') + '</div>' +
      '<div class="title-buttons"><button type="button" class="btn btn-pink btn-lg" id="n-ok">' + esc(t('namingOk')) + '</button>' +
      '<button type="button" class="btn btn-ghost" id="n-skip">' + esc(t('noName')) + '</button></div>' +
      '<p class="naming-note">' + esc(t('namingNote')) + '</p>';
    show('screen-naming');
    var input = $('n-input');
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
      K.main.enterGame();
    };
    $('n-skip').onclick = function () { S().named = true; S().name = ''; K.main.enterGame(); };
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
      item('shardshop', K.art.upIcon('shard', 24), t('shardShop'), '', s.shards + ' ' + t('shardsUnit')) +
      item('rebirth', K.art.ui('eraser', 24), t('rebirth'), pend > 0 ? t('rebirthMenuHint', { n: pend }) : '', '', pend > 0 ? 'gold' : '') +
      '</div><div class="menu-sub">' +
      '<button type="button" data-open="settings">' + K.art.ui('settings', 20) + esc(t('settings')) + '</button>' +
      '<button type="button" data-open="save">' + K.art.ui('save', 20) + esc(t('saveMenu')) + '</button>' +
      '<button type="button" data-open="parents">' + K.art.ui('parents', 20) + esc(t('parents')) + '</button></div>';
  };

  // ---------- ダイアログ ----------
  var current = null;
  var state = { zukanSel: null, achSel: null, achCat: 'all' };

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
    var cells = '<div class="z-row"><span></span>' + K.data.traits.map(function (tr) {
      return '<span class="z-head"><span class="chip-dot" style="background:' + (tr.chipBg || tr.chip) + '"></span>' + esc(K.L(tr.name)) + '</span>';
    }).join('') + '</div>';
    K.data.stages.forEach(function (st) {
      cells += '<div class="z-row"><span class="z-rowlabel">STAGE ' + st.n + '<b>' + esc(K.L(st.name)) + '</b></span>';
      K.data.traits.forEach(function (tr) {
        var id = K.speciesId(st.n, tr.id);
        cells += zcell(id);
      });
      cells += '</div>';
    });
    cells += '<div class="z-row"><span class="z-rowlabel">SPECIAL<b>' + esc(t('special')) + '</b></span>' +
      K.data.specials.map(function (sp) { return zcell(sp.id); }).join('') + '</div>';
    var sel = state.zukanSel || s.species;
    return head(t('zukanTitle'), '<span class="head-count">' + t('zukanCount', { n: K.evo.foundCount(), t: K.evo.TOTAL }) + '</span><span class="head-pill">+' + Math.round(K.evo.BONUS * 100 * K.evo.foundCount()) + '% /s</span>') +
      '<p class="lead">' + esc(t('titlePrefix', { t: K.L(K.evo.title()) })) + ' ・ ' + esc(t('zukanBonus')) + '</p>' +
      '<div class="zukan-layout"><div class="zukan-table">' + cells + '</div>' + zdetail(sel) + '</div>';
  };
  function zcell(id) {
    var s = S();
    var info = K.evo.info(id);
    var found = s.zukan[id];
    var isNew = found && Date.now() - found.at < 10 * 60 * 1000;
    var sel = (state.zukanSel || s.species) === id;
    return '<button type="button" class="z-cell' + (found ? '' : ' unk') + (sel ? ' sel' : '') + '" data-z="' + id + '" aria-label="' + esc(found ? K.L(info.name) : t('notFound')) + '">' +
      K.art.kasuPic(info, { plain: !found, lazy: true }) +
      (found ? '' : '<span class="z-q">?</span>') +
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
        '<div class="z-detail-body"><span class="badge ' + (info.special ? 'badge-special' : 'badge-stage') + '" style="align-self:flex-start">' + (info.special ? t('specialBadge') : t('stageBadge', { n: info.stage })) + '</span>' +
        '<h3>？？？</h3><p class="z-quote">' + esc(info.hint ? K.L(info.hint) : t('notFound')) + '</p>' + tradeBtn(id) + '</div></div>';
    }
    var mat = found.mat ? K.game.materialById[found.mat] : null;
    var other = K.lang() === 'ja' ? info.name.en : info.name.ja;
    return '<div class="z-detail"><div class="z-detail-img">' + K.art.kasuPic(info) + '</div>' +
      '<div class="z-detail-body"><span class="badge ' + (info.special ? 'badge-special' : 'badge-stage') + '" style="align-self:flex-start">' + (info.special ? t('specialBadge') : t('stageBadge', { n: info.stage })) + '</span>' +
      '<h3>' + esc(K.L(info.name)) + '</h3><span class="z-en">' + esc(other) + '</span>' +
      '<p class="z-quote">' + esc(K.quote(K.L(info.line))) + '</p>' +
      '<div class="z-meta"><span>' + esc(t('foundOn')) + '</span><b>' + K.fmtDate(found.at) + '</b>' +
      '<span>' + esc(t('mixedWith')) + '</span><b>' + esc(mat ? K.L(mat.name) : t('mixedNone')) + '</b>' +
      '<span>' + esc(t('ownedCount')) + '</span><b>' + K.fmt(found.n || 1) + '</b></div>' +
      (s.species === id ? '<span class="z-ondesk">' + esc(t('onDesk')) + '</span>'
        : '<button type="button" class="btn z-desk-btn" data-desk="' + id + '">' + esc(t('putOnDesk')) + '</button>') +
      '</div></div>';
  }
  AFTER.zukan = function (card) {
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
  var CATS = [['all', 'catAll', '#2B2A28'], ['rub', 'catRub', '#F29CA3'], ['buddy', 'catBuddy', '#8FA7C8'], ['evolve', 'catEvolve', '#6B6A66'], ['golden', 'catGolden', '#E7B533'], ['secret', 'catSecret', '#CDBFA5']];
  RENDER.achievements = function (card) {
    card.classList.add('wide');
    var s = S();
    var n = K.game.achievementCount();
    // かげの じっせきは とったときだけ 出す
    var list = K.data.achievements.filter(function (a) { return (state.achCat === 'all' || a.cat === state.achCat) && (!a.shadow || s.achievements[a.id]); });
    var sel = null;
    K.data.achievements.forEach(function (a) { if (a.id === state.achSel) sel = a; });
    var grid = list.map(function (a) {
      var got = !!s.achievements[a.id];
      return '<button type="button" class="ach' + (got ? '' : ' no') + (state.achSel === a.id ? ' sel' : '') + '" data-ach="' + a.id + '" aria-label="' + esc(got || !a.hidden ? K.L(a.name) : t('achLocked')) + '">' +
        (got ? '<span class="ach-medal" style="background:' + K.ui.medalColor(a) + '"></span>' : '?') + '</button>';
    }).join('');
    var detail = '';
    if (sel) {
      var got = s.achievements[sel.id];
      var secret = !got && sel.hidden;
      detail = '<div class="ach-detail"><span class="ach-medal" style="background:' + (got ? K.ui.medalColor(sel) : 'transparent') + ';' + (got ? '' : 'border-style:dashed') + '"></span>' +
        '<span class="z-en">' + esc(t('cat' + sel.cat.charAt(0).toUpperCase() + sel.cat.slice(1))) + '</span>' +
        '<h3>' + esc(secret ? '？？？' : K.L(sel.name)) + '</h3>' +
        '<span class="z-en">' + esc(secret ? '' : (K.lang() === 'ja' ? sel.name.en : sel.name.ja)) + '</span>' +
        '<p class="lead">' + esc(secret ? t('achLocked') : K.L(sel.desc)) + '</p>' +
        (got ? '<p class="z-quote">' + esc(K.quote(K.L(sel.quote))) + '</p><span class="z-en">' + K.fmtDate(got) + (sel.shadow ? '' : ' ・ +1% /s') + '</span>' : '') + '</div>';
    } else {
      detail = '<div class="ach-detail"><p class="lead">' + esc(t('achBonus')) + '</p></div>';
    }
    return head(t('achTitle'), '<span class="head-count">' + n + ' / ' + K.game.achievementTotal + '</span><span class="head-pill">+' + n + '% /s</span>') +
      '<p class="lead">' + esc(t('achBonus')) + '</p>' +
      '<div class="cats">' + CATS.map(function (c) {
        return '<button type="button" class="cat" data-cat="' + c[0] + '" aria-pressed="' + (state.achCat === c[0]) + '"><i style="background:' + c[2] + '"></i>' + esc(t(c[1])) + '</button>';
      }).join('') + '</div>' +
      '<div class="ach-layout"><div class="ach-grid">' + grid + '</div>' + detail + '</div>';
  };
  AFTER.achievements = function (card) {
    card.querySelectorAll('[data-cat]').forEach(function (b) { b.onclick = function () { state.achCat = b.getAttribute('data-cat'); SC.refresh(); }; });
    card.querySelectorAll('[data-ach]').forEach(function (b) { b.onclick = function () { state.achSel = b.getAttribute('data-ach'); SC.refresh(); }; });
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
      [t('stStage'), 'STAGE ' + s.stage],
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

  // かけらの おみせ
  RENDER.shardshop = function (card) {
    card.classList.add('wide');
    var s = S();
    var items = K.data.shardShop.map(function (it) {
      var owned = !!s.shardUpgrades[it.id];
      var secret = it.secret && !owned && s.shardsEarned < it.cost;
      var can = K.ascend.canBuy(it);
      var st = owned ? 'owned' : secret ? 'secret' : can ? 'can' : 'cant';
      var tag = { owned: ['stOwned', '#3E6FB0', '#FFFFFF'], can: ['stCan', '#F29CA3', '#2B2A28'], cant: ['stCant', '#EFE7D6', '#6B6A66'], secret: ['stSecret', '#EFE7D6', '#6B6A66'] }[st];
      return '<button type="button" class="shard-item ' + st + '" data-shard="' + it.id + '"' + (st === 'can' ? '' : ' aria-disabled="true"') + '>' +
        '<span class="shard-top"><span class="shard-tag" style="background:' + tag[1] + ';color:' + tag[2] + '">' + esc(t(tag[0])) + '</span>' +
        '<span class="shard-cost">' + K.art.upIcon('shard', 20) + it.cost + '</span></span>' +
        '<span class="shard-name">' + esc(secret ? '？？？' : K.L(it.name)) + '</span>' +
        '<span class="shard-desc">' + esc(secret ? K.L(it.hiddenDesc) : K.L(it.desc)) + '</span></button>';
    }).join('');
    return head(t('shardShop'), '<span class="shard-have">' + K.art.upIcon('shard', 24) + s.shards + ' <small style="font-size:13px">' + esc(t('shardsUnit')) + '</small></span>') +
      '<p class="lead">' + esc(t('shardShopDesc')) + ' ' + esc(t('shardBonus')) + '</p>' +
      '<div class="shard-grid">' + items + '</div>';
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
    var done = function () { el.remove(); K.ui.renderAll(); K.ui.say(K.news.monologue('idle')); };
    el.onclick = done;
    setTimeout(function () { if (el.parentNode) done(); }, S().settings.reduceMotion ? 1500 : 4200);
  };

  // せってい
  RENDER.settings = function () {
    var st = S().settings;
    var sw = function (key, on) { return '<button type="button" class="switch" role="switch" aria-checked="' + on + '" data-set="' + key + '"></button>'; };
    return head(t('settingsTitle')) +
      '<div class="set-row"><span>' + esc(t('setLang')) + '</span><div class="lang-toggle"><button type="button" data-lang="ja" aria-pressed="' + (K.lang() === 'ja') + '">にほんご</button><button type="button" data-lang="en" aria-pressed="' + (K.lang() === 'en') + '">English</button></div></div>' +
      '<div class="set-row"><span>' + K.art.ui('sound', 20) + esc(t('setSound')) + '</span>' + sw('sound', st.sound) + '</div>' +
      '<div class="set-row"><span>' + esc(t('setNotation')) + '</span><div class="lang-toggle"><button type="button" data-notation="short" aria-pressed="' + (st.notation !== 'sci') + '">1.23M</button><button type="button" data-notation="sci" aria-pressed="' + (st.notation === 'sci') + '">1.23e6</button></div></div>' +
      '<div class="set-row"><span>' + esc(t('setMotion')) + '</span>' + sw('reduceMotion', st.reduceMotion) + '</div>' +
      '<div class="set-row"><span>' + esc(t('setDark')) + '</span>' + sw('dark', st.dark) + '</div>' +
      '<div class="set-row"><span>' + K.art.ui('save', 20) + esc(t('setSave')) + '</span><div class="btn-row"><button type="button" class="btn" data-open="save">' + esc(t('exportBtn')) + ' / ' + esc(t('importBtn')) + '</button></div></div>' +
      '<button type="button" class="btn btn-danger" id="reset-btn">' + esc(t('resetBtn')) + '</button>' +
      parentsBox();
  };
  function parentsBox() {
    return '<div class="parents-box"><h3>' + esc(t('parentsTitle')) + '</h3><p>' + t('parentsBody') + '</p><p>' + esc(t('parentsBodyEn')) + '</p></div>';
  }
  AFTER.settings = function (card) {
    card.querySelectorAll('[data-lang]').forEach(function (b) {
      b.onclick = function () { S().settings.lang = b.getAttribute('data-lang'); K.main.applySettings(); SC.refresh(); };
    });
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
  SC.welcome = function (sec, gain, onClose) { welcomeData = { sec: sec, gain: gain }; SC.onWelcomeClose = onClose; SC.open('welcome'); };
  RENDER.welcome = function () {
    var d = K.fmtDuration(welcomeData.sec);
    return '<div class="welcome-scene">' + K.art.kasuPic(K.evo.info(S().species)) + '<span class="zzz">z z z</span></div>' +
      '<h1 class="center">' + esc(t('welcomeTitle')) + '</h1>' +
      '<div class="bubble">' + esc(K.quote(t('welcomeLine'))) + '</div>' +
      '<p class="lead center">' + esc(d.h ? t('welcomeWhile', { h: d.h, m: d.m }) : t('welcomeWhileM', { m: d.m })) + '</p>' +
      '<div class="welcome-gain">+' + K.fmt(welcomeData.gain) + '</div>' +
      '<p class="lead center">' + esc(t('welcomeWorked')) + '</p>' +
      '<button type="button" class="btn btn-pink btn-lg" data-close>' + esc(t('welcomeTake')) + '</button>';
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
          '<div class="evo-morph"><span class="evo-from">' + K.art.kasuPic(from) + '</span><span class="evo-to">' + K.art.kasuPic(to) + '</span></div>' +
          '<div class="evo-reveal">' + K.art.kasuPic(to) + '</div>' +
        '</div>' +
        '<span class="evo-kicker">' + (isMix ? 'MIX' : isRoll ? (to.special ? t('specialBadge') : t('newKasu') + ' ・ ' + t('stageBadge', { n: to.stage })) : t('evolution')) + '</span>' +
        '<h1 class="evo-title">' + esc(isMix ? t('mixed') : isRoll ? t('rolled') : t('congrats')) + '</h1>' +
        '<p class="evo-result">' + t(isMix ? 'mixResult' : isRoll ? 'rollResult' : 'evoResult', { name: esc(K.L(to.name)) }) + '</p>' +
        '<p class="evo-line">' + esc(line) + '</p>' +
        (ev.isNew ? '<span class="evo-new">' + esc(t('zukanNew', { n: K.evo.foundCount(), t: K.evo.TOTAL })) + '</span>' : '') +
        '<span class="evo-tap">' + esc(t('tapToClose')) + '</span>' +
      '</div><div class="evo-flash"></div>';
    el.hidden = false;
    if (!reduce) K.sound.play(isMix ? 'mixing' : 'charge');
    var revealAt = reduce ? 0 : (isMix ? 1100 : 3600); // css の --reveal と そろえる
    var timers = [setTimeout(function () { K.sound.play(isMix ? 'upgrade' : 'evolve'); }, revealAt)];
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
