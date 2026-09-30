// アップグレード（企画書 6-3）。1回だけ買える。まぜる材料は 7-2
(function (K) {
  'use strict';
  K.data = K.data || {};
  var list = [];

  // --- ゆび（こする力とゆびの生産） ---
  var finger = [
    { id: 'f1', need: 1, cost: 100, kind: 'double',
      name: { ja: 'えんぴつの おしりを みがく', en: 'Polished Pencil Butt' },
      desc: { ja: 'えんぴつの おしりを みがいた。ゆびと こする ちからが 2ばい。なぜか ぴかぴか。', en: 'You polished the end of a pencil. Fingers and rubbing are twice as strong. It is shiny for some reason.' } },
    { id: 'f2', need: 1, cost: 500, kind: 'double',
      name: { ja: 'ゆびの ストレッチ', en: 'Finger Stretches' },
      desc: { ja: 'いち、に、さん、し。ゆびと こする ちからが 2ばい。', en: 'One, two, three, four. Fingers and rubbing are twice as strong.' } },
    { id: 'f3', need: 10, cost: 10000, kind: 'double',
      name: { ja: 'つめを きりそろえる', en: 'Neatly Trimmed Nails' },
      desc: { ja: 'つめは みじかい ほうが いい。ゆびと こする ちからが 2ばい。', en: 'Short nails are best. Fingers and rubbing are twice as strong.' } },
    { id: 'f4', need: 25, cost: 100000, kind: 'thousand', add: 0.1,
      name: { ja: 'せんの ゆび', en: 'A Thousand Fingers' },
      desc: { ja: 'ゆびと こする ちからが、ゆび いがいの どうぐ 1つにつき +0.1。', en: 'Fingers and rubbing get +0.1 for each non-finger tool.' } },
    { id: 'f5', need: 50, cost: 1e7, kind: 'thousandMult', mult: 5,
      name: { ja: 'まんの ゆび', en: 'Ten Thousand Fingers' },
      desc: { ja: '「せんの ゆび」の こうかが 5ばい。', en: '"A Thousand Fingers" is 5 times stronger.' } },
    { id: 'f6', need: 100, cost: 1e8, kind: 'thousandMult', mult: 10,
      name: { ja: 'おくの ゆび', en: 'A Hundred Million Fingers' },
      desc: { ja: '「せんの ゆび」の こうかが 10ばい。かぞえた ひとは いない。', en: '"A Thousand Fingers" is 10 times stronger. Nobody has counted.' } },
    { id: 'f7', need: 150, cost: 1e9, kind: 'thousandMult', mult: 20,
      name: { ja: 'ちょうの ゆび', en: 'A Trillion Fingers' },
      desc: { ja: '「せんの ゆび」の こうかが 20ばい。', en: '"A Thousand Fingers" is 20 times stronger.' } },
    { id: 'f8', need: 200, cost: 1e10, kind: 'thousandMult', mult: 20,
      name: { ja: 'むげんの ゆび', en: 'Infinite Fingers' },
      desc: { ja: '「せんの ゆび」の こうかが 20ばい。ゆびが ゆびを こする。', en: '"A Thousand Fingers" is 20 times stronger. Fingers rub fingers.' } }
  ];
  finger.forEach(function (u) {
    list.push({ id: u.id, type: 'finger', icon: u.id === 'f1' ? 'pencil' : 'finger', building: 'finger', need: u.need,
      cost: u.cost, kind: u.kind, add: u.add, mult: u.mult, name: u.name, desc: u.desc });
  });

  // --- 施設アップグレード（1/5/25/50/100/150/200こ で解放、生産2ばい） ---
  var TIERS = [1, 5, 25, 50, 100, 150, 200];
  var TIER_COST = [10, 50, 500, 50000, 5e6, 5e8, 5e10];
  var ADJ = {
    ja: ['', 'しっかり した', 'ていねいな', 'ほんきの', 'でんせつの', 'まぼろしの', 'うちゅういちの'],
    en: ['', 'Sturdy', 'Careful', 'Serious', 'Legendary', 'Phantom', 'Best-in-Universe']
  };
  var FLAVOR = {
    ja: ['', 'ちょっと たのもしい。', 'ていねいに こする。', 'めが マジ。', 'ひとびとが かたりつぐ。', 'みた ひとは いない。', 'うちゅうで いちばん。'],
    en: ['', 'A little more reliable.', 'Rubs with care.', 'Eyes are serious.', 'People tell stories about it.', 'No one has seen it.', 'Number one in the universe.']
  };
  var FIRST = {
    ant: [{ ja: 'アリさんの ながぐつ', en: 'Ant Boots' }, { ja: 'ちいさな ながぐつを はいた。6ぽんぶん。', en: 'Tiny boots. Six of them.' }],
    grandpa: [{ ja: 'おじいちゃんの めがね', en: "Grandpa's Glasses" }, { ja: 'よく みえるように なった。カスが。', en: 'Now he can see clearly. The crumbs, that is.' }],
    classroom: [{ ja: 'ぬきうち テスト', en: 'Pop Quiz' }, { ja: 'みんなが いっせいに けしはじめた。', en: 'Everyone started erasing at once.' }],
    club: [{ ja: 'ぶいん ぼしゅう ポスター', en: 'Recruiting Poster' }, { ja: '「きみも けさないか」', en: '"Want to erase with us?"' }],
    factory: [{ ja: '24じかん うんてん', en: 'Night Shift' }, { ja: 'こうじょうは ねない。', en: 'The factory never sleeps.' }],
    roller: [{ ja: 'ローラーの ワックス', en: 'Roller Wax' }, { ja: 'つるつるに なった。いみは ない。', en: 'Now it is slippery. For no reason.' }],
    moon: [{ ja: 'つきの うさぎ', en: 'Moon Rabbit' }, { ja: 'もちの かわりに カスを ついている。', en: 'It pounds crumbs instead of rice cakes.' }],
    timemachine: [{ ja: 'きのうの きのう', en: 'The Day Before Yesterday' }, { ja: 'もっと むかしの カスも もってくる。', en: 'Now it brings even older crumbs.' }],
    paralleldesk: [{ ja: 'べつの ぼく', en: 'Another Me' }, { ja: 'むこうの ぼくも こすっていた。', en: 'The other me was rubbing too.' }],
    universe: [{ ja: 'うちゅうの いびき', en: 'Cosmic Snore' }, { ja: 'うちゅうが ねがえりを うった。', en: 'The universe rolled over in its sleep.' }],
    other: [{ ja: 'あくしゅ', en: 'Handshake' }, { ja: 'カスと カスが あくしゅした。', en: 'Crumb shook hands with crumb.' }]
  };
  K.data.buildings.forEach(function (b) {
    if (b.id === 'finger') return;
    TIERS.forEach(function (need, i) {
      var name, flavor;
      if (i === 0) {
        name = FIRST[b.id][0];
        flavor = FIRST[b.id][1];
      } else {
        name = { ja: ADJ.ja[i] + ' ' + b.name.ja, en: ADJ.en[i] + ' ' + b.name.en };
        flavor = { ja: FLAVOR.ja[i], en: FLAVOR.en[i] };
      }
      list.push({
        id: 'b_' + b.id + '_' + (i + 1), type: 'building', icon: b.id, building: b.id, need: need,
        cost: b.cost * TIER_COST[i], kind: 'double', name: name,
        desc: {
          ja: flavor.ja + b.name.ja + 'が 2ばい はたらく。',
          en: flavor.en + ' ' + b.name.en + ' works twice as hard.'
        }
      });
    });
  });

  // --- こする強化（こすると /s の 1% ぶん もらえる） ---
  [[1000, 5e4], [1e5, 5e6], [1e7, 5e8], [1e9, 5e10], [1e11, 5e12]].forEach(function (r, i) {
    var names = [
      { ja: 'ていねいに こする', en: 'Careful Rubbing' },
      { ja: 'こする れんしゅう', en: 'Rubbing Practice' },
      { ja: 'こする たつじん', en: 'Rubbing Master' },
      { ja: 'こする めいじん', en: 'Rubbing Legend' },
      { ja: 'こする かみさま', en: 'Rubbing Deity' }
    ];
    list.push({ id: 'r' + (i + 1), type: 'rub', icon: 'rub', needHandmade: r[0], cost: r[1], kind: 'rubCps', add: 0.01,
      name: names[i],
      desc: { ja: 'こすると /s の 1% ぶんも もらえる。', en: 'Rubbing also gives 1% of your /s.' } });
  });

  // --- ゴールデンカス ---
  list.push({ id: 'g1', type: 'golden', icon: 'golden', needGolden: 7, cost: 777777, kind: 'goldenFreq',
    name: { ja: 'ラッキーな いちにち', en: 'Lucky Day' },
    desc: { ja: 'ゴールデンカスが 2ばい よく でる。', en: 'Golden Crumbs appear twice as often.' } });
  list.push({ id: 'g2', type: 'golden', icon: 'golden', needGolden: 27, cost: 77777777, kind: 'goldenDur',
    name: { ja: 'ちょっと ねばる キラキラ', en: 'Lingering Sparkle' },
    desc: { ja: 'ゴールデンカスの こうかが 2ばい ながく つづく。', en: 'Golden Crumb effects last twice as long.' } });

  K.data.upgrades = list;

  // --- まぜる材料（けいとう）。何回でも まぜなおせる ---
  K.data.materials = [
    { id: 'none', trait: 'plain', stage: 1, cost: 0,
      name: { ja: 'なにも まぜない', en: 'Mix Nothing' },
      desc: { ja: 'まぜた ものを とりのぞく。つぎの カスは ふつうの はいいろ。', en: 'Take the mix out. Your next crumb is plain gray.' } },
    { id: 'graphite', trait: 'graphite', stage: 2, cost: 500,
      name: { ja: 'えんぴつの こな', en: 'Pencil Dust' },
      desc: { ja: 'まぜると、まるめた カスが くろく なる。すこし ひかる。', en: 'Mix it in and new crumbs turn black. A little shiny.' } },
    { id: 'colored', trait: 'rainbow', stage: 2, cost: 800,
      name: { ja: 'いろえんぴつ', en: 'Colored Pencil' },
      desc: { ja: 'まぜると、まるめた カスが にじいろの まだらに なる。', en: 'Mix it in and new crumbs get rainbow spots.' } },
    { id: 'glue', trait: 'sticky', stage: 3, cost: 20000,
      name: { ja: 'のり', en: 'Glue' },
      desc: { ja: 'まぜると、まるめた カスが テカテカ のびる。', en: 'Mix it in and new crumbs get shiny and stretchy.' } },
    { id: 'dust', trait: 'fluffy', stage: 3, cost: 30000,
      name: { ja: 'ほこり', en: 'Dust Bunny' },
      desc: { ja: 'まぜると、まるめた カスが もふもふに なる。', en: 'Mix it in and new crumbs get fluffy.' } },
    { id: 'sand', trait: 'gritty', stage: 4, cost: 3e6,
      name: { ja: 'すなけし', en: 'Sand Eraser' },
      desc: { ja: 'まぜると、まるめた カスが ざらざらに なる。', en: 'Mix it in and new crumbs get gritty.' } },
    { id: 'gold', trait: 'golden', stage: 5, cost: 3e9,
      name: { ja: 'きんの こな', en: 'Gold Dust' },
      desc: { ja: 'まぜると、まるめた カスが きんいろに ひかる。', en: 'Mix it in and new crumbs glow gold.' } }
  ];
})(window.K = window.K || {});
