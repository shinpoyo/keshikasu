// かけらの おみせ（永続アップグレード、企画書 8章）。系統（branch）ごとに 上から じゅんに 買う「道」
// requires は 1つ前の もの。すでに 買った ものは 前が なくても 買ったまま
(function (K) {
  'use strict';
  K.data = K.data || {};
  K.data.shardBranches = [
    { id: 'sleep', icon: ['building', 'moon'], name: { ja: 'ねむり', en: 'Sleep' } },
    { id: 'golden', icon: ['upIcon', 'golden'], name: { ja: 'ゴールデン', en: 'Golden' } },
    { id: 'roll', icon: ['ui', 'roll'], name: { ja: 'まるめる', en: 'Rolling' } },
    { id: 'tools', icon: ['building', 'finger'], name: { ja: 'どうぐ', en: 'Tools' } },
    { id: 'rub', icon: ['upIcon', 'rub'], name: { ja: 'こする', en: 'Rubbing' } },
    { id: 'zukan', icon: ['ui', 'zukan'], name: { ja: 'ずかん', en: 'Crumbpedia' } },
    { id: 'secret', icon: ['upIcon', 'star'], name: { ja: 'ひみつ', en: 'Secret' } }
  ];
  K.data.shardShop = [
    // ねむり
    { id: 'offline20', branch: 'sleep', cost: 1,
      name: { ja: 'ねている間も', en: 'Even While Sleeping' },
      desc: { ja: 'とじている間のつぶが10%から20%になる。', en: 'While you are away, tools make 20% of their crumbs instead of 10%.' } },
    { id: 'offline50', branch: 'sleep', cost: 10, requires: 'offline20',
      name: { ja: 'ぐっすりねむる', en: 'Deep Sleep' },
      desc: { ja: 'とじている間のつぶが50%になる。', en: 'While you are away, tools make 50% of their crumbs.' } },
    { id: 'offline80', branch: 'sleep', cost: 60, requires: 'offline50',
      name: { ja: 'ゆめの中でもこする', en: 'Rubbing in Your Dreams' },
      desc: { ja: 'とじている間のつぶが80%になる。', en: 'While you are away, tools make 80% of their crumbs.' } },
    // ゴールデン
    { id: 'goldenFreq', branch: 'golden', cost: 3,
      name: { ja: 'ゴールデン消しゴム来やすく', en: 'Golden Erasers More Often' },
      desc: { ja: 'ゴールデン消しゴムが10%よく来る。', en: 'Golden Erasers show up 10% more often.' } },
    { id: 'goldenLong', branch: 'golden', cost: 8, requires: 'goldenFreq',
      name: { ja: 'ゴールデン消しゴム長持ち', en: 'Longer Golden Erasers' },
      desc: { ja: 'ゴールデン消しゴムのこうかが1.5倍長く続く。', en: 'Golden Eraser effects last 1.5 times longer.' } },
    { id: 'goldenMore', branch: 'golden', cost: 40, requires: 'goldenLong',
      name: { ja: 'もっと来やすく', en: 'Even More Often' },
      desc: { ja: 'ゴールデン消しゴムがさらに15%よく来る。', en: 'Golden Erasers show up another 15% more often.' } },
    { id: 'frenzyLong', branch: 'golden', cost: 120, requires: 'goldenMore',
      name: { ja: 'キラキラタイムのばし', en: 'Longer Sparkle Frenzy' },
      desc: { ja: 'キラキラタイムが77秒から120秒になる。', en: 'Sparkle Frenzy goes from 77s to 120s.' } },
    // まるめる
    { id: 'stamps8', branch: 'roll', cost: 4,
      name: { ja: 'スタンプ8こでこうかん', en: 'Trade for 8 Stamps' },
      desc: { ja: '新しいカスとこうかんするスタンプが10こから8こになる。', en: 'Trading for a new crumb takes 8 stamps instead of 10.' } },
    { id: 'paperGift', branch: 'roll', cost: 12, requires: 'stamps8',
      name: { ja: '紙のおみやげ', en: 'Sleeve Souvenir' },
      desc: { ja: '消しゴムにもどると「消しゴムの紙」が3まいもらえる。', en: 'Get 3 Eraser Sleeves each time you go back to the eraser.' } },
    { id: 'shapeUp', branch: 'roll', cost: 30, requires: 'paperGift',
      name: { ja: '変な形が出やすい', en: 'More Odd Shapes' },
      desc: { ja: 'まるめたとき、かたちカスがもっと出やすくなる。', en: 'Shaped crumbs come out more often when rolling.' } },
    { id: 'dupJoy', branch: 'roll', cost: 70, requires: 'shapeUp',
      name: { ja: 'ダブりもうれしい', en: 'Happy Duplicates' },
      desc: { ja: 'ダブったとき、スタンプが2こもらえる。', en: 'Duplicates give 2 stamps.' } },
    // どうぐ
    { id: 'startAnts', branch: 'tools', cost: 5,
      name: { ja: 'アリさんの引っこし', en: 'The Ants Move In' },
      desc: { ja: 'はじめからアリさんが10ぴきいる。', en: 'Start with 10 Ants.' } },
    { id: 'discount', branch: 'tools', cost: 15, requires: 'startAnts',
      name: { ja: 'どうぐのねびき', en: 'Tool Discount' },
      desc: { ja: 'どうぐのねだんが全部5%安くなる。', en: 'All tools cost 5% less.' } },
    { id: 'discount10', branch: 'tools', cost: 50, requires: 'discount',
      name: { ja: 'もっとねびき', en: 'Bigger Discount' },
      desc: { ja: 'どうぐのねだんが全部10%安くなる。', en: 'All tools cost 10% less.' } },
    { id: 'startFingers', branch: 'tools', cost: 100, requires: 'discount10',
      name: { ja: '指の引っこし', en: 'The Fingers Move In' },
      desc: { ja: 'はじめから指が50本ある。', en: 'Start with 50 Fingers.' } },
    // こする
    { id: 'praiseFast', branch: 'rub', cost: 3,
      name: { ja: 'ほめ上手', en: 'Good at Praising' },
      desc: { ja: '「ほめる」の待ち時間が60秒から40秒になる。', en: 'Praise cooldown goes from 60s to 40s.' } },
    { id: 'rubPower', branch: 'rub', cost: 25, requires: 'praiseFast',
      name: { ja: 'こする力', en: 'Rubbing Power' },
      desc: { ja: 'こすると /s の1%分ももらえる。', en: 'Rubbing also gives 1% of your /s.' } },
    { id: 'rubPower3', branch: 'rub', cost: 80, requires: 'rubPower',
      name: { ja: 'すごいこする力', en: 'Super Rubbing Power' },
      desc: { ja: 'こすると /s の3%分ももらえる。', en: 'Rubbing also gives 3% of your /s.' } },
    // ずかん
    { id: 'startGraphite', branch: 'zukan', cost: 2,
      name: { ja: 'えんぴつのこな持ちこみ', en: 'Bring Your Own Pencil Dust' },
      desc: { ja: 'はじめから「えんぴつのこな」がまぜられる。', en: 'Pencil Dust can be mixed from the very start.' } },
    { id: 'allMaterials', branch: 'zukan', cost: 20, requires: 'startGraphite',
      name: { ja: 'いろんな材料', en: 'All Sorts of Materials' },
      desc: { ja: 'はじめから全部の材料がまぜられる。', en: 'All materials can be mixed from the very start.' } },
    { id: 'zukanPower', branch: 'zukan', cost: 90, requires: 'allMaterials',
      name: { ja: 'ずかんの力', en: 'Power of the Crumbpedia' },
      desc: { ja: 'ずかん1種類で /s が2%から3%ふえるようになる。', en: 'Each kind found gives +3% /s instead of +2%.' } },
    // ひみつ
    { id: 'secret50', branch: 'secret', cost: 50, secret: true,
      name: { ja: '消しゴムのひみつ', en: 'Secret of the Eraser' },
      desc: { ja: '/s が50%ふえる。消しゴムはずっと知っていた。', en: '+50% /s. The eraser knew all along.' },
      hiddenDesc: { ja: 'だれも見たことがない。', en: 'Nobody has ever seen it.' } },
    { id: 'secret100', branch: 'secret', cost: 100, secret: true, requires: 'secret50',
      name: { ja: 'カスの神さまのごかご', en: 'Blessing of the Crumb God' },
      desc: { ja: '/s が2倍。神さまはつくえのすみにいた。', en: 'x2 /s. The god was hiding in the corner of the desk.' },
      hiddenDesc: { ja: '消しゴムの神さまだけが知っている。', en: 'Only the eraser god knows.' } },
    { id: 'secret500', branch: 'secret', cost: 500, secret: true, requires: 'secret100',
      name: { ja: 'うちゅうのはしっこ', en: 'Edge of the Universe' },
      desc: { ja: '/s が3倍。うちゅうのはしっこにも、消しカスは落ちていた。', en: 'x3 /s. Even at the edge of the universe, there were crumbs.' },
      hiddenDesc: { ja: 'うちゅうのはしっこにある。', en: 'It is at the edge of the universe.' } }
  ];
})(window.K = window.K || {});
