// アップグレード（企画書 6-3）。1回だけ買える。まぜる材料は 7-2
(function (K) {
  'use strict';
  K.data = K.data || {};
  var list = [];

  // --- ゆび（こする力とゆびの生産） ---
  var finger = [
    { id: 'f1', need: 1, cost: 100, kind: 'double',
      name: { ja: 'えんぴつのおしりをみがく', en: 'Polished Pencil Butt' },
      desc: { ja: 'えんぴつのおしりをみがいた。指とこする力が2倍。なぜかぴかぴか。', en: 'You polished the end of a pencil. Fingers and rubbing are twice as strong. It is shiny for some reason.' } },
    { id: 'f2', need: 1, cost: 500, kind: 'double',
      name: { ja: '指のストレッチ', en: 'Finger Stretches' },
      desc: { ja: '一、二、三、四。指とこする力が2倍。', en: 'One, two, three, four. Fingers and rubbing are twice as strong.' } },
    { id: 'f3', need: 10, cost: 10000, kind: 'double',
      name: { ja: 'つめを切りそろえる', en: 'Neatly Trimmed Nails' },
      desc: { ja: 'つめは短いほうがいい。指とこする力が2倍。', en: 'Short nails are best. Fingers and rubbing are twice as strong.' } },
    { id: 'f4', need: 25, cost: 100000, kind: 'thousand', add: 0.1,
      name: { ja: '千の指', en: 'A Thousand Fingers' },
      desc: { ja: '指とこする力が、指以外のどうぐ1つにつき +0.1。', en: 'Fingers and rubbing get +0.1 for each non-finger tool.' } },
    { id: 'f5', need: 50, cost: 1e7, kind: 'thousandMult', mult: 5,
      name: { ja: '万の指', en: 'Ten Thousand Fingers' },
      desc: { ja: '「千の指」のこうかが5倍。', en: '"A Thousand Fingers" is 5 times stronger.' } },
    { id: 'f6', need: 100, cost: 1e8, kind: 'thousandMult', mult: 10,
      name: { ja: '億の指', en: 'A Hundred Million Fingers' },
      desc: { ja: '「千の指」のこうかが10倍。数えた人はいない。', en: '"A Thousand Fingers" is 10 times stronger. Nobody has counted.' } },
    { id: 'f7', need: 150, cost: 1e9, kind: 'thousandMult', mult: 20,
      name: { ja: '兆の指', en: 'A Trillion Fingers' },
      desc: { ja: '「千の指」のこうかが20倍。', en: '"A Thousand Fingers" is 20 times stronger.' } },
    { id: 'f8', need: 200, cost: 1e10, kind: 'thousandMult', mult: 20,
      name: { ja: 'むげんの指', en: 'Infinite Fingers' },
      desc: { ja: '「千の指」のこうかが20倍。指が指をこする。', en: '"A Thousand Fingers" is 20 times stronger. Fingers rub fingers.' } },
    { id: 'f9', need: 250, cost: 1e12, kind: 'thousandMult', mult: 20,
      name: { ja: '京の指', en: 'Ten Quadrillion Fingers' },
      desc: { ja: '「千の指」のこうかが20倍。数えるだけで1日が終わる。', en: '"A Thousand Fingers" is 20 times stronger. Counting them takes all day.' } },
    { id: 'f10', need: 300, cost: 1e14, kind: 'thousandMult', mult: 20,
      name: { ja: '星の数の指', en: 'As Many Fingers as Stars' },
      desc: { ja: '「千の指」のこうかが20倍。夜空が指に見えてきた。', en: '"A Thousand Fingers" is 20 times stronger. The night sky looks like fingers now.' } },
    { id: 'f11', need: 350, cost: 1e16, kind: 'thousandMult', mult: 20,
      name: { ja: 'うちゅうの指', en: 'Cosmic Fingers' },
      desc: { ja: '「千の指」のこうかが20倍。うちゅうのどこかでだれかがこすっている。', en: '"A Thousand Fingers" is 20 times stronger. Someone out in space is rubbing too.' } },
    { id: 'f12', need: 400, cost: 1e18, kind: 'thousandMult', mult: 20,
      name: { ja: '指の指', en: "Fingers' Fingers" },
      desc: { ja: '「千の指」のこうかが20倍。指にも指が生えた。', en: '"A Thousand Fingers" is 20 times stronger. The fingers grew fingers.' } },
    { id: 'f13', need: 450, cost: 1e20, kind: 'thousandMult', mult: 20,
      name: { ja: '指の神さま', en: 'Finger Deity' },
      desc: { ja: '「千の指」のこうかが20倍。指をあわせておがんだ。', en: '"A Thousand Fingers" is 20 times stronger. You put your fingers together and prayed.' } },
    { id: 'f14', need: 500, cost: 1e22, kind: 'thousandMult', mult: 20,
      name: { ja: 'さいごの指', en: 'The Last Finger' },
      desc: { ja: '「千の指」のこうかが20倍。これ以上は指がたりない。', en: '"A Thousand Fingers" is 20 times stronger. There are no fingers left to count on.' } }
  ];
  finger.forEach(function (u) {
    list.push({ id: u.id, type: 'finger', icon: u.id === 'f1' ? 'pencil' : 'finger', building: 'finger', need: u.need,
      cost: u.cost, kind: u.kind, add: u.add, mult: u.mult, name: u.name, desc: u.desc });
  });

  // --- 施設アップグレード（1/5/25/50/100/150/200こ、終盤用に 250〜500こ で解放、生産2ばい） ---
  var TIERS = [1, 5, 25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500];
  var TIER_COST = [10, 50, 500, 50000, 5e6, 5e8, 5e10, 5e12, 5e14, 5e16, 5e18, 5e20, 5e22];
  var ADJ = {
    ja: ['', 'しっかりした', 'ていねいな', '本気の', '伝説の', 'まぼろしの', 'うちゅう一の', 'ゆめの', 'ひみつの', '本物の', 'さいごの', 'その先の', '本当にさいごの'],
    en: ['', 'Sturdy', 'Careful', 'Serious', 'Legendary', 'Phantom', 'Best-in-Universe', 'Dream', 'Secret', 'Genuine', 'Final', 'Beyond-Final', 'Truly Final']
  };
  var FLAVOR = {
    ja: ['', 'ちょっとたのもしい。', 'ていねいにこする。', '目がマジ。', '人々が語りつぐ。', '見た人はいない。', 'うちゅうで一番。',
      'ねている間も働く。', 'だれにも言っていない。', 'やっと本物になった。', 'これでさいご。', 'さいごの、その先。', '今度こそ本当にさいご。'],
    en: ['', 'A little more reliable.', 'Rubs with care.', 'Eyes are serious.', 'People tell stories about it.', 'No one has seen it.', 'Number one in the universe.',
      'Works even while asleep.', 'Nobody has been told.', 'Finally the real thing.', 'This is the last one.', 'Past the last one.', 'This time it really is the last.']
  };
  var FIRST = {
    ant: [{ ja: 'アリさんの長ぐつ', en: 'Ant Boots' }, { ja: '小さな長ぐつをはいた。6本分。', en: 'Tiny boots. Six of them.' }],
    friend: [{ ja: 'かしてあげる消しゴム', en: 'Lend an Eraser' }, { ja: '返ってこないけど、カスは来る。', en: 'It never comes back, but the crumbs do.' }],
    grandpa: [{ ja: 'おじいちゃんのめがね', en: "Grandpa's Glasses" }, { ja: 'よく見えるようになった。カスが。', en: 'Now he can see clearly. The crumbs, that is.' }],
    drill: [{ ja: '赤ペン', en: 'Red Pen' }, { ja: 'バツがふえるほどカスもふえる。', en: 'More red marks, more crumbs.' }],
    classroom: [{ ja: 'ぬき打ちテスト', en: 'Pop Quiz' }, { ja: 'みんながいっせいに消し始めた。', en: 'Everyone started erasing at once.' }],
    club: [{ ja: '部員ぼしゅうポスター', en: 'Recruiting Poster' }, { ja: '「君も消さないか」', en: '"Want to erase with us?"' }],
    autoeraser: [{ ja: '電池こうかん', en: 'New Batteries' }, { ja: '力強くなった。へるのも速い。', en: 'Stronger now. Wears down faster, too.' }],
    factory: [{ ja: '24時間運転', en: 'Night Shift' }, { ja: '工場はねない。', en: 'The factory never sleeps.' }],
    stamp: [{ ja: 'ちょうこくとう', en: 'Carving Knife' }, { ja: 'よく切れる。カスがよく出る。', en: 'Sharp. Lots of crumbs.' }],
    roller: [{ ja: 'ローラーのワックス', en: 'Roller Wax' }, { ja: 'つるつるになった。意味はない。', en: 'Now it is slippery. For no reason.' }],
    bigeraser: [{ ja: 'クレーン', en: 'Crane' }, { ja: 'やっと持ち上がった。', en: 'Finally, it can be lifted.' }],
    moon: [{ ja: '月のうさぎ', en: 'Moon Rabbit' }, { ja: 'もちの代わりにカスをついている。', en: 'It pounds crumbs instead of rice cakes.' }],
    timemachine: [{ ja: 'きのうのきのう', en: 'The Day Before Yesterday' }, { ja: 'もっと昔のカスも持ってくる。', en: 'Now it brings even older crumbs.' }],
    paralleldesk: [{ ja: '別のぼく', en: 'Another Me' }, { ja: '向こうのぼくもこすっていた。', en: 'The other me was rubbing too.' }],
    eplanet: [{ ja: '自転のスピードアップ', en: 'Faster Spin' }, { ja: '1日が短くなった。', en: 'The day got shorter.' }],
    universe: [{ ja: 'うちゅうのいびき', en: 'Cosmic Snore' }, { ja: 'うちゅうがねがえりをうった。', en: 'The universe rolled over in its sleep.' }],
    other: [{ ja: 'あくしゅ', en: 'Handshake' }, { ja: 'カスとカスがあくしゅした。', en: 'Crumb shook hands with crumb.' }]
  };
  K.data.buildings.forEach(function (b) {
    if (b.id === 'finger') return;
    TIERS.forEach(function (need, i) {
      var name, flavor;
      if (i === 0) {
        name = FIRST[b.id][0];
        flavor = FIRST[b.id][1];
      } else {
        name = { ja: ADJ.ja[i] + b.name.ja, en: ADJ.en[i] + ' ' + b.name.en };
        flavor = { ja: FLAVOR.ja[i], en: FLAVOR.en[i] };
      }
      list.push({
        id: 'b_' + b.id + '_' + (i + 1), type: 'building', icon: b.id, building: b.id, need: need,
        cost: b.cost * TIER_COST[i], kind: 'double', name: name,
        desc: {
          ja: flavor.ja + b.name.ja + 'が2倍働く。',
          en: flavor.en + ' ' + b.name.en + ' works twice as hard.'
        }
      });
    });
  });

  // --- こする強化（こすると /s の 1% ぶん もらえる） ---
  [[1000, 5e4], [1e5, 5e6], [1e7, 5e8], [1e9, 5e10], [1e11, 5e12]].forEach(function (r, i) {
    var names = [
      { ja: 'ていねいにこする', en: 'Careful Rubbing' },
      { ja: 'こする練習', en: 'Rubbing Practice' },
      { ja: 'こする達人', en: 'Rubbing Master' },
      { ja: 'こする名人', en: 'Rubbing Legend' },
      { ja: 'こする神さま', en: 'Rubbing Deity' }
    ];
    list.push({ id: 'r' + (i + 1), type: 'rub', icon: 'rub', needHandmade: r[0], cost: r[1], kind: 'rubCps', add: 0.01,
      name: names[i],
      desc: { ja: 'こすると /s の1%分ももらえる。', en: 'Rubbing also gives 1% of your /s.' } });
  });

  // --- ゴールデンけしゴム ---
  list.push({ id: 'g1', type: 'golden', icon: 'golden', needGuests: 7, cost: 777777, kind: 'goldenFreq',
    name: { ja: 'ラッキーな一日', en: 'Lucky Day' },
    desc: { ja: 'ゴールデン消しゴムが2倍よく来る。', en: 'Golden Erasers show up twice as often.' } });
  list.push({ id: 'g2', type: 'golden', icon: 'golden', needGuests: 27, cost: 77777777, kind: 'goldenDur',
    name: { ja: 'ちょっとねばるキラキラ', en: 'Lingering Sparkle' },
    desc: { ja: 'ゴールデン消しゴムのこうかが2倍長く続く。', en: 'Golden Eraser effects last twice as long.' } });

  // --- 文房具シリーズ（この周に 集めた つぶで 解放。全体の /s が ふえる。クッキークリッカーの クッキーの種類） ---
  var ST = [
    // [アイコン, 日本語の名前, 英語の名前, 日本語のひとこと, 英語のひとこと]
    ['ruler', 'じょうぎ', 'Ruler', 'カスが一列にならんだ。', 'The crumbs lined up in a row.'],
    ['clip', 'ゼムクリップ', 'Paper Clip', 'カスを10こずつまとめる。', 'Holds crumbs together, ten at a time.'],
    ['sticky', 'ふせん', 'Sticky Note', '「ここにカスあり」と書いてはった。', 'You wrote "crumbs here" and stuck it on.'],
    ['tape', 'セロハンテープ', 'Clear Tape', 'カスをぺたっと集める。', 'Picks up crumbs with a pat.'],
    ['protractor', '分度器', 'Protractor', 'カスの角度をはかった。だいたい丸い。', 'You measured the crumb\'s angle. Mostly round.'],
    ['compass', 'コンパス', 'Compass', 'カスを丸く集める。はりに注意。', 'Gathers crumbs in a circle. Mind the needle.'],
    ['stapler', 'ホチキス', 'Stapler', 'カスをとめた。なぜか。', 'You stapled the crumbs. Nobody knows why.'],
    ['pencase', '筆箱', 'Pencil Case', 'カスの家ができた。', 'The crumbs have a home now.'],
    ['notebook', 'ノート', 'Notebook', 'カスの記録をつけはじめた。', 'You started a crumb diary.'],
    ['scissors', 'はさみ', 'Scissors', 'カスを半分に切ったら、2こになった。', 'You cut a crumb in half. Now there are two.'],
    ['ruler', '三角じょうぎ', 'Set Square', '2まいで何でもはかれる。', 'With two of these, you can measure anything.'],
    ['clip', '目玉クリップ', 'Binder Clip', 'はさむ力がすごい。', 'What a grip.'],
    ['sticky', '大きなふせん', 'Big Sticky Note', 'つくえが見えなくなった。', 'You can no longer see the desk.'],
    ['tape', 'ガムテープ', 'Packing Tape', 'カスを箱につめて送れる。', 'Now you can box up crumbs and ship them.'],
    ['protractor', '360度の分度器', 'Full-Circle Protractor', 'ぐるっと1しゅうはかれる。', 'Measures all the way around.'],
    ['compass', '大きなコンパス', 'Giant Compass', '校庭に丸がかける。', 'Big enough to draw on the school field.'],
    ['stapler', '大きなホチキス', 'Heavy-Duty Stapler', '100まい重ねてもとめられる。', 'Staples a hundred sheets at once.'],
    ['pencase', '2階建ての筆箱', 'Two-Story Pencil Case', '1階はカス、2階もカス。', 'Crumbs downstairs. Crumbs upstairs.'],
    ['notebook', '方がんノート', 'Graph Paper Notebook', 'カスをマス目に1つずつ。', 'One crumb per square.'],
    ['scissors', '工作ばさみ', 'Craft Scissors', 'ぎざぎざに切れる。カスもぎざぎざ。', 'Cuts zigzags. The crumbs are zigzag too.'],
    ['ruler', '金のじょうぎ', 'Golden Ruler', 'はかる物がぜんぶ高そうに見える。', 'Everything it measures looks expensive.'],
    ['clip', '金のクリップ', 'Golden Clip', 'とめたカスまで光っている。', 'Even the clipped crumbs shine.'],
    ['sticky', '金のふせん', 'Golden Sticky Note', 'はがすのがもったいない。', 'Too nice to peel off.'],
    ['tape', '金のテープ', 'Golden Tape', 'はった所がかざりになった。', 'Wherever it sticks becomes a decoration.'],
    ['protractor', '金の分度器', 'Golden Protractor', '角度がきれいに見える。', 'The angles look beautiful now.'],
    ['compass', '金のコンパス', 'Golden Compass', 'まるで太陽をかいたよう。', 'Every circle looks like the sun.'],
    ['stapler', '金のホチキス', 'Golden Stapler', 'パチンという音まで上品。', 'Even the click sounds classy.'],
    ['pencase', '金の筆箱', 'Golden Pencil Case', '中に入れるのがきんちょうする。', 'You feel nervous putting things in it.'],
    ['notebook', '金のノート', 'Golden Notebook', 'カスの記録がもう千ページ。', 'The crumb diary is a thousand pages long.'],
    ['scissors', '金のはさみ', 'Golden Scissors', 'テープカットに使うらしい。', 'Apparently it is for ribbon-cutting ceremonies.']
  ];
  var ST_PCT = [0.03, 0.05, 0.07]; // 10こごとに こうかが 大きく なる
  ST.forEach(function (r, i) {
    var at = Math.pow(10, 8 + i * 0.7); // 100M から 10の0.7乗ずつ（さいごは 約 1.3e28）
    var pct = ST_PCT[Math.floor(i / 10)];
    var p = Math.round(pct * 100);
    list.push({ id: 'st' + (i + 1), type: 'stationery', icon: 'st-' + r[0] + '-' + (Math.floor(i / 10) + 1), needTotal: at,
      cost: Math.round(at * 3), kind: 'globalPct', pct: pct,
      name: { ja: r[1], en: r[2] },
      desc: { ja: r[3] + '全体の /s が +' + p + '%。', en: r[4] + ' +' + p + '% to all /s.' } });
  });

  // --- カスはかせの助手（ずかんの カスが 多いほど /s が のびる。クッキークリッカーの 子ネコ） ---
  var HELPERS = [
    [10, 9e7, '見習いの助手', 'Trainee Assistant', 'ずかんを毎日ながめている。', 'Looks through the Crumbpedia every day.'],
    [20, 9e9, 'メガネの助手', 'Bespectacled Assistant', '小さいカスもよく見える。', 'Can spot even the tiniest crumbs.'],
    [30, 9e11, '白衣の助手', 'Lab Coat Assistant', '白衣がカスだらけ。', 'The lab coat is covered in crumbs.'],
    [45, 9e13, 'ベテランの助手', 'Veteran Assistant', 'カスを見ただけで名前が分かる。', 'Can name any crumb at a glance.'],
    [60, 9e15, '助手の助手', "Assistant's Assistant", '助手にも助手がついた。', 'Now the assistant has an assistant.'],
    [75, 9e17, 'となりの研究室の助手', 'Assistant from Next Door', 'となりからも手伝いに来た。', 'Came over from the lab next door to help.'],
    [90, 9e19, '助手長', 'Head Assistant', '助手たちのリーダー。ずかんはかんぺき。', 'Leader of the assistants. The Crumbpedia is flawless.']
  ];
  HELPERS.forEach(function (r, i) {
    list.push({ id: 'kh' + (i + 1), type: 'helper', icon: 'helper', needZukan: r[0], cost: r[1], kind: 'zukanMult', add: 0.0025,
      name: { ja: r[2], en: r[3] },
      desc: { ja: r[4] + 'ずかんのカスが多いほど、/s がのびる。', en: r[5] + ' The more crumbs in your Crumbpedia, the higher your /s.' } });
  });

  K.data.upgrades = list;

  // --- まぜる材料（けいとう）。何回でも まぜなおせる ---
  K.data.materials = [
    { id: 'none', trait: 'plain', stage: 1, cost: 0,
      name: { ja: '何もまぜない', en: 'Mix Nothing' },
      desc: { ja: 'まぜたものを取りのぞく。次のカスはふつうのはいいろ。', en: 'Take the mix out. Your next crumb is plain gray.' } },
    { id: 'graphite', trait: 'graphite', stage: 2, cost: 500,
      name: { ja: 'えんぴつのこな', en: 'Pencil Dust' },
      desc: { ja: 'まぜると、まるめたカスが黒くなる。少し光る。', en: 'Mix it in and new crumbs turn black. A little shiny.' } },
    { id: 'colored', trait: 'rainbow', stage: 2, cost: 800,
      name: { ja: '色えんぴつ', en: 'Colored Pencil' },
      desc: { ja: 'まぜると、まるめたカスがにじ色のまだらになる。', en: 'Mix it in and new crumbs get rainbow spots.' } },
    { id: 'glue', trait: 'sticky', stage: 3, cost: 20000,
      name: { ja: 'のり', en: 'Glue' },
      desc: { ja: 'まぜると、まるめたカスがテカテカのびる。', en: 'Mix it in and new crumbs get shiny and stretchy.' } },
    { id: 'dust', trait: 'fluffy', stage: 3, cost: 30000,
      name: { ja: 'ほこり', en: 'Dust Bunny' },
      desc: { ja: 'まぜると、まるめたカスがもふもふになる。', en: 'Mix it in and new crumbs get fluffy.' } },
    { id: 'sand', trait: 'gritty', stage: 4, cost: 3e6,
      name: { ja: 'すなけしのこな', en: 'Sand Eraser Dust' },
      desc: { ja: 'まぜると、まるめたカスがざらざらになる。', en: 'Mix it in and new crumbs get gritty.' } },
    { id: 'gold', trait: 'golden', stage: 5, cost: 3e9,
      name: { ja: '金のこな', en: 'Gold Dust' },
      desc: { ja: 'まぜると、まるめたカスが金色に光る。', en: 'Mix it in and new crumbs glow gold.' } }
  ];
})(window.K = window.K || {});
