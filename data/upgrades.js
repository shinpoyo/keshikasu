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
      desc: { ja: '「千の指」のこうかが20倍。指が指をこする。', en: '"A Thousand Fingers" is 20 times stronger. Fingers rub fingers.' } }
  ];
  finger.forEach(function (u) {
    list.push({ id: u.id, type: 'finger', icon: u.id === 'f1' ? 'pencil' : 'finger', building: 'finger', need: u.need,
      cost: u.cost, kind: u.kind, add: u.add, mult: u.mult, name: u.name, desc: u.desc });
  });

  // --- 施設アップグレード（1/5/25/50/100/150/200こ で解放、生産2ばい） ---
  var TIERS = [1, 5, 25, 50, 100, 150, 200];
  var TIER_COST = [10, 50, 500, 50000, 5e6, 5e8, 5e10];
  var ADJ = {
    ja: ['', 'しっかりした', 'ていねいな', '本気の', '伝説の', 'まぼろしの', 'うちゅう一の'],
    en: ['', 'Sturdy', 'Careful', 'Serious', 'Legendary', 'Phantom', 'Best-in-Universe']
  };
  var FLAVOR = {
    ja: ['', 'ちょっとたのもしい。', 'ていねいにこする。', '目がマジ。', '人々が語りつぐ。', '見た人はいない。', 'うちゅうで一番。'],
    en: ['', 'A little more reliable.', 'Rubs with care.', 'Eyes are serious.', 'People tell stories about it.', 'No one has seen it.', 'Number one in the universe.']
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
