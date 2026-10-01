// じっせき（企画書 6-8）。1つにつき /s +1%
// cat: rub / buddy / evolve / golden / secret
(function (K) {
  'use strict';
  K.data = K.data || {};
  var list = [];
  function add(a) { list.push(a); }
  var f = function (n) { return K.fmt(n); };

  // --- こする ---
  [[1, 'はじめてのこする', 'First Rub', 'ごし', 'Rub.'],
   [100, 'こする人', 'Rub Rookie', 'だんだんなれてきた。', 'Getting used to it.'],
   [1000, 'こする達人', 'Rub Expert', '指が少しつかれた。', 'Your finger is a little tired.'],
   [10000, 'こする名人', 'Rub Master', '指がとけそう。', 'Your finger might melt.'],
   [100000, 'こする伝説', 'Rub Legend', '指にありがとう。', 'Thank your finger.']
  ].forEach(function (r, i) {
    add({ id: 'rubs' + i, cat: 'rub', type: 'rubs', n: r[0], name: { ja: r[1], en: r[2] },
      desc: { ja: r[0] === 1 ? 'はじめてこすった。' : f(r[0]) + '回こすった。', en: r[0] === 1 ? 'Rubbed for the first time.' : 'Rubbed ' + f(r[0]) + ' times.' },
      quote: { ja: r[3], en: r[4] } });
  });
  [[1000, '手作り', 'Handmade'], [1e6, '手作りの力', 'Handmade Power'], [1e9, '手作りのきわみ', 'Handmade Mastery']].forEach(function (r, i) {
    add({ id: 'hand' + i, cat: 'rub', type: 'handmade', n: r[0], name: { ja: r[1], en: r[2] },
      desc: { ja: 'こすって' + f(r[0]) + 'つぶ集めた。', en: 'Made ' + f(r[0]) + ' crumbs by rubbing.' },
      quote: { ja: '自分の指で。', en: 'With your own finger.' } });
  });
  [[1, 'はじめのひとつぶ', 'The First Crumb'], [1000, 'ひとにぎり', 'A Handful'], [1e5, 'ちょっとした山', 'A Small Pile'],
   [1e6, '1M つぶ', '1M Crumbs'], [1e8, 'つくえがいっぱい', 'Full Desk'], [1e9, '1B つぶ', '1B Crumbs'],
   [1e11, '部屋がいっぱい', 'Full Room'], [1e12, '1T つぶ', '1T Crumbs'], [1e14, '町がいっぱい', 'Full Town'],
   [1e15, '1Qa つぶ', '1Qa Crumbs'], [1e18, '星がいっぱい', 'Full Planet']].forEach(function (r, i) {
    add({ id: 'total' + i, cat: 'rub', type: 'total', n: r[0], name: { ja: r[1], en: r[2] },
      desc: { ja: '全部で' + f(r[0]) + 'つぶ集めた。', en: 'Made ' + f(r[0]) + ' crumbs in all.' },
      quote: { ja: '数えるのが大変。', en: 'Too many to count.' } });
  });
  [1, 10, 100, 1000, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9].forEach(function (n, i) {
    add({ id: 'cps' + i, cat: 'rub', type: 'cps', n: n,
      name: { ja: '毎秒 ' + f(n), en: f(n) + ' per second' },
      desc: { ja: '1秒に' + f(n) + 'つぶ集まるようになった。', en: 'Reached ' + f(n) + ' crumbs per second.' },
      quote: { ja: 'じっとしているだけでふえる。', en: 'It grows even while you sit still.' } });
  });

  // --- どうぐ ---
  var PAT = [
    [1, 'はじめての', '', 'First ', ''],
    [25, '', 'がいっぱい', '', ' Crowd'],
    [50, '', 'の町', '', ' Town'],
    [100, '', 'の国', '', ' Nation'],
    [200, '', 'のうちゅう', '', ' Universe']
  ];
  var SPECIAL_NAME = { 'ant-25': ['アリの行列', 'Ant Parade', 'みんな同じほうを向いている', 'Everyone faces the same way.'] };
  K.data.buildings.forEach(function (b) {
    PAT.forEach(function (p) {
      var sp = SPECIAL_NAME[b.id + '-' + p[0]];
      add({ id: 'b_' + b.id + '_' + p[0], cat: 'buddy', type: 'building', b: b.id, n: p[0],
        name: sp ? { ja: sp[0], en: sp[1] } : { ja: p[1] + b.name.ja + p[2], en: p[3] + b.name.en + p[4] },
        desc: { ja: b.name.ja + 'を' + p[0] + '集めた。', en: 'Own ' + p[0] + ' × ' + b.name.en + '.' },
        quote: sp ? { ja: sp[2], en: sp[3] } : { ja: b.line.ja, en: b.line.en } });
    });
  });

  // --- しんか ---
  K.data.stages.forEach(function (s) {
    if (s.n === 1) return;
    add({ id: 'stage' + s.n, cat: 'evolve', type: 'stage', n: s.n,
      name: { ja: s.name.ja + ' カス', en: s.name.en + ' Crumb' },
      desc: { ja: 'STAGE ' + s.n + ' のカスを見つけた。', en: 'Found a STAGE ' + s.n + ' crumb.' },
      quote: { ja: s.line.ja, en: s.line.en } });
  });
  [[10, 'カスはかせ見習い', 'Crumb Scholar Trainee'], [30, 'カスはかせ', 'Crumb Scholar'], [56, 'カスの神様', 'Crumb Deity'], [90, 'カスの大神様', 'Supreme Crumb Deity']].forEach(function (r, i) {
    add({ id: 'zukan' + i, cat: 'evolve', type: 'zukan', n: r[0], name: { ja: r[1], en: r[2] },
      desc: { ja: 'ずかんに' + r[0] + '種類登録した。', en: 'Found ' + r[0] + ' kinds in the Crumbpedia.' },
      quote: { ja: 'カスにもいろいろある。', en: 'There are all kinds of crumbs.' } });
  });
  [[1, 'まるめてみた', 'First Roll'], [10, 'まるめる人', 'Roll Rookie'], [100, 'まるめる達人', 'Roll Expert'], [1000, 'まるめる名人', 'Roll Master']].forEach(function (r, i) {
    add({ id: 'roll' + i, cat: 'evolve', type: 'rolls', n: r[0], name: { ja: r[1], en: r[2] },
      desc: { ja: r[0] === 1 ? 'はじめてカスをまるめた。' : f(r[0]) + '回まるめた。', en: r[0] === 1 ? 'Rolled a crumb for the first time.' : 'Rolled ' + f(r[0]) + ' times.' },
      quote: { ja: 'ころころ。', en: 'Roll, roll.' } });
  });
  add({ id: 'mix1', cat: 'evolve', type: 'mix', n: 1, name: { ja: 'まぜてみた', en: 'Mixed It Up' },
    desc: { ja: 'はじめて材料をまぜた。', en: 'Mixed in a material for the first time.' },
    quote: { ja: '何かまざった。', en: 'Something got mixed in.' } });
  [[1, '消しゴムになった', 'Became an Eraser'], [5, 'また消しゴム', 'Eraser Again'], [10, '何度も消しゴム', 'Eraser, Again and Again']].forEach(function (r, i) {
    add({ id: 'rebirth' + i, cat: 'evolve', type: 'rebirth', n: r[0], name: { ja: r[1], en: r[2] },
      desc: { ja: '消しゴムに' + r[0] + '回もどった。', en: 'Returned to the eraser ' + r[0] + ' time' + (r[0] > 1 ? 's' : '') + '.' },
      quote: { ja: '消しゴムは、また何かを消すでしょう。', en: 'The eraser will erase something again.' } });
  });

  // --- ゴールデン ---
  [[1, 'キラッ', 'Sparkle'], [7, 'ラッキー セブン', 'Lucky Seven'], [27, 'キラキラ集め', 'Sparkle Collector'], [77, '金色の指', 'Golden Finger']].forEach(function (r, i) {
    add({ id: 'golden' + i, cat: 'golden', type: 'golden', n: r[0], name: { ja: r[1], en: r[2] },
      desc: { ja: 'ゴールデン消しゴムを' + r[0] + '回使った。', en: 'Used ' + r[0] + ' Golden Eraser' + (r[0] > 1 ? 's' : '') + '.' },
      quote: { ja: 'まぶしい。', en: 'So bright.' } });
  });

  // --- ゲストけしゴム（はじめて つかった・つかった かず）---
  [['kadokeshi', 'かどがいっぱい', 'So Many Corners', 'かどはまだある。', 'Still more corners.'],
   ['sand', 'ざらざら', 'Gritty', 'つくえもけずれた気がする。', 'Feels like the desk got sanded too.'],
   ['neri', 'ねりねり', 'Squish Squish', '全部まとまった。', 'It all came together.'],
   ['kaori', 'いいにおい', 'Smells Nice', 'おなかがすいた。', 'Now you are hungry.'],
   ['rocket', 'はっしゃ', 'Liftoff', '次のこまはどこ？', 'Where did the next piece go?'],
   ['dendo', 'ウィーン', 'Whirrrr', '手はまったくつかれない。', 'Your hand is not tired at all.'],
   ['jumbo', '両手で', 'Two Hands', '消すより運ぶほうが大変。', 'Carrying it is harder than erasing with it.']].forEach(function (r) {
    add({ id: 'guest_' + r[0], cat: 'golden', type: 'guest', g: r[0], n: 1, name: { ja: r[1], en: r[2] },
      desc: { ja: K.data.guests.filter(function (g) { return g.id === r[0]; })[0].name.ja + 'をはじめて使った。',
        en: 'Used the ' + K.data.guests.filter(function (g) { return g.id === r[0]; })[0].name.en + ' for the first time.' },
      quote: { ja: r[3], en: r[4] } });
  });
  // ★5（使うほど 強く なる 消しゴム）
  add({ id: 'star5_1', cat: 'golden', type: 'star5', n: 1, name: { ja: '使いこんだ消しゴム', en: 'Well-Worn Eraser' },
    desc: { ja: '消しゴムを1種類、★5にした。', en: 'Got one eraser to ★5.' }, quote: { ja: '手になじむ。', en: 'Fits right in your hand.' } });
  add({ id: 'star5_all', cat: 'golden', type: 'star5', name: { ja: '消しゴム名人', en: 'Eraser Master' },
    desc: { ja: '来る消しゴムを全部★5にした。', en: 'Got every visiting eraser to ★5.' }, quote: { ja: '筆箱が金のシールだらけ。', en: 'Your pencil case is covered in gold stickers.' } });
  [[10, 'お客さん', 'Visitors'], [50, '消しゴムのたまり場', 'Eraser Hangout'], [100, '筆箱いっぱい', 'Full Pencil Case']].forEach(function (r, i) {
    add({ id: 'guests' + i, cat: 'golden', type: 'guests', n: r[0], name: { ja: r[1], en: r[2] },
      desc: { ja: 'やってきた消しゴムを' + r[0] + '回使った。', en: 'Used ' + r[0] + ' visiting erasers.' },
      quote: { ja: 'また来てね。', en: 'Come again soon.' } });
  });

  // --- ひみつ ---
  add({ id: 's_blow3', cat: 'secret', hidden: true, type: 'blowStreak', n: 3, name: { ja: 'ふきすぎ', en: 'Too Much Blowing' },
    desc: { ja: '3回続けてふいた。', en: 'Blew 3 times in a row.' }, quote: { ja: '目が回る。', en: 'So dizzy.' } });
  add({ id: 's_praise100', cat: 'secret', hidden: true, type: 'praises', n: 100, name: { ja: 'ほめ上手', en: 'Master Praiser' },
    desc: { ja: '100回ほめた。', en: 'Praised 100 times.' }, quote: { ja: 'そろそろ調子に乗る。', en: 'It is starting to show off.' } });
  add({ id: 's_named', cat: 'secret', hidden: true, type: 'named', n: 1, name: { ja: '名前をもらった', en: 'Got a Name' },
    desc: { ja: 'カスに名前をつけた。', en: 'Named your crumb.' }, quote: { ja: 'うれしい。', en: 'Happy.' } });
  add({ id: 's_idle', cat: 'secret', hidden: true, type: 'idle', n: 600, name: { ja: '何もしない', en: 'Doing Nothing' },
    desc: { ja: '10分、何もしなかった。', en: 'Did nothing for 10 minutes.' }, quote: { ja: 'それも大事。', en: 'That is important too.' } });
  add({ id: 's_sell', cat: 'secret', hidden: true, type: 'sell', n: 1, name: { ja: 'お別れ', en: 'Farewell' },
    desc: { ja: 'どうぐを売った。', en: 'Sold a tool.' }, quote: { ja: 'また会おうね。', en: 'See you again.' } });
  add({ id: 's_night', cat: 'secret', hidden: true, type: 'night', n: 1, name: { ja: '夜ふかし', en: 'Night Owl' },
    desc: { ja: '夜中の0時から5時に遊んだ。', en: 'Played between midnight and 5 AM.' }, quote: { ja: '早くねよう。', en: 'Go to bed.' } });
  add({ id: 's_rest', cat: 'secret', hidden: true, type: 'rested', n: 1, name: { ja: 'ひと休み', en: 'Taking a Break' },
    desc: { ja: 'ひと休みした。', en: 'Took a break.' }, quote: { ja: 'えらい。', en: 'Good job.' } });

  // --- v2 で ふえた じっせき ---
  // ずかん: STAGE ごとに 全部（色 7しゅ＋その STAGE の かたちカス）
  [1, 2, 3, 4, 5, 6, 7].forEach(function (n) {
    add({ id: 'dex' + n, cat: 'evolve', type: 'dexStage', n: n, name: { ja: 'STAGE ' + n + ' コンプリート', en: 'STAGE ' + n + ' Complete' },
      desc: { ja: 'STAGE ' + n + ' のカスを全部見つけた。', en: 'Found every STAGE ' + n + ' crumb.' },
      quote: { ja: 'みんなそろうと、つくえがせまい。', en: 'With everyone here, the desk feels small.' } });
  });
  add({ id: 'shape1', cat: 'evolve', type: 'shapes', n: 1, name: { ja: '変な形', en: 'Odd Shape' },
    desc: { ja: 'はじめてかたちカスが出た。', en: 'Got a shaped crumb for the first time.' }, quote: { ja: 'わざとじゃない。', en: 'Not on purpose.' } });
  add({ id: 'shapeAll', cat: 'evolve', type: 'shapesAll', n: 1, tier: 3, name: { ja: 'かたちカス全部', en: 'Every Shape' },
    desc: { ja: 'かたちカスを全部見つけた。', en: 'Found every shaped crumb.' }, quote: { ja: 'カスは何にでもなれる。', en: 'Crumbs can become anything.' } });
  add({ id: 'specialAll', cat: 'evolve', type: 'specialsAll', n: 1, tier: 3, name: { ja: 'とくべつなカス全部', en: 'Every Special' },
    desc: { ja: 'とくべつなカスを全部見つけた。', en: 'Found every special crumb.' }, quote: { ja: 'とくべつが、ふつうになった。', en: 'Special is the new normal.' } });
  add({ id: 'trade1', cat: 'evolve', type: 'trades', n: 1, name: { ja: 'スタンプこうかん', en: 'Stamp Trade' },
    desc: { ja: 'はじめてスタンプでこうかんした。', en: 'Traded stamps for the first time.' }, quote: { ja: 'ためたかいがあった。', en: 'It was worth saving up.' } });
  add({ id: 'dups50', cat: 'evolve', type: 'dups', n: 50, name: { ja: 'ダブりの山', en: 'Pile of Duplicates' },
    desc: { ja: 'ダブりが全部で50回出た。', en: 'Got 50 duplicates in all.' }, quote: { ja: 'ダブりも数が集まるとうれしい。', en: 'Even duplicates are nice when you have lots.' } });
  add({ id: 'shard1', cat: 'evolve', type: 'shardBuys', n: 1, name: { ja: 'はじめてのお買いもの', en: 'First Purchase' },
    desc: { ja: 'はじめてかけらを使った。', en: 'Spent shards for the first time.' }, quote: { ja: 'かけらは使うためにある。', en: 'Shards are for spending.' } });
  add({ id: 'shardAll', cat: 'evolve', type: 'shardBuys', n: K.data.shardShop.length, name: { ja: 'お店をまるごと', en: 'Bought the Whole Shop' },
    desc: { ja: 'かけらのお店のものを全部買った。', en: 'Bought everything in the Shard Shop.' }, quote: { ja: 'お店の人もびっくり。', en: 'Even the shopkeeper is surprised.' } });
  add({ id: 'drawer1', cat: 'evolve', type: 'harvests', n: 1, name: { ja: 'ひきだしの中から', en: 'From the Drawer' },
    desc: { ja: 'はじめてひきだしから取り出した。', en: 'Took something out of the drawer for the first time.' }, quote: { ja: 'しまったのをわすれていた。', en: 'Forgot it was in there.' } });
  // 消しゴムを 使いきった・あそんだ 時間
  [[1, '使いきった', 'Used It Up'], [10, '消しゴム10こ', '10 Erasers'], [100, '消しゴム100こ', '100 Erasers']].forEach(function (r, i) {
    add({ id: 'eraser' + i, cat: 'rub', type: 'erasers', n: r[0], name: { ja: r[1], en: r[2] },
      desc: { ja: '消しゴムを' + r[0] + 'こ使いきった。', en: 'Used up ' + r[0] + ' eraser' + (r[0] > 1 ? 's' : '') + '.' },
      quote: { ja: '小さくなるまでがんばった。', en: 'Worked hard until it got tiny.' } });
  });
  [[1, 'ちょっとあそんだ', 'Played a Bit'], [10, 'けっこうあそんだ', 'Played a Lot'], [100, 'ずっとあそんだ', 'Played Forever']].forEach(function (r, i) {
    add({ id: 'play' + i, cat: 'rub', type: 'playHours', n: r[0], name: { ja: r[1], en: r[2] },
      desc: { ja: '全部で' + r[0] + '時間あそんだ。', en: 'Played for ' + r[0] + ' hour' + (r[0] > 1 ? 's' : '') + ' in all.' },
      quote: { ja: 'カスも楽しかった。', en: 'The crumb had fun too.' } });
  });
  // ひみつ
  add({ id: 's_royal', cat: 'secret', hidden: true, tier: 3, type: 'royal', n: 2, name: { ja: 'えらいカスたち', en: 'Very Important Crumbs' },
    desc: { ja: 'カスキングとカス神を、両方つくえに置いた。', en: 'Put both the Crumb King and the Crumb God on the desk.' }, quote: { ja: 'つくえが少しおごそか。', en: 'The desk feels very formal now.' } });
  add({ id: 's_unlucky', cat: 'secret', hidden: true, type: 'dry', n: 9, name: { ja: 'ついてない', en: 'Unlucky' },
    desc: { ja: 'ダブりが9回続いた。', en: 'Got 9 duplicates in a row.' }, quote: { ja: '次はきっと新しい。', en: 'The next one will be new. Surely.' } });
  add({ id: 's_shards100', cat: 'secret', hidden: true, type: 'shardsHeld', n: 100, name: { ja: 'かけら持ち', en: 'Shard Hoarder' },
    desc: { ja: 'かけらを100こ持った。', en: 'Held 100 shards at once.' }, quote: { ja: 'ポケットがじゃらじゃら。', en: 'Your pockets jingle.' } });

  // --- かげ（ズル）。数にも /s にも はいらない ---
  add({ id: 's_cheated', cat: 'secret', hidden: true, shadow: true, type: 'cheated', n: 1,
    name: { ja: 'ズルしたカスはまずい', en: 'Cheated Crumbs Taste Awful' },
    desc: { ja: 'ズルをした。（このじっせきは数えない）', en: 'You cheated. (This one does not count.)' },
    quote: { ja: 'なんだか味がしない。', en: 'Somehow it tastes like nothing.' } });

  // むずかしさ（1 銅・2 銀・3 金）: おなじ 種類の 中で n が 大きいほど 上。1つだけの ものは 銅（ひみつは 銀）
  var groups = {};
  list.forEach(function (a) { var k = a.type + ':' + (a.b || a.g || ''); (groups[k] = groups[k] || []).push(a); });
  Object.keys(groups).forEach(function (k) {
    var g = groups[k].slice().sort(function (x, y) { return x.n - y.n; });
    g.forEach(function (a, i) {
      if (a.tier) return;
      if (g.length === 1) { a.tier = a.cat === 'secret' ? 2 : 1; return; }
      var r = i / (g.length - 1);
      a.tier = r < 0.34 ? 1 : r < 0.67 ? 2 : 3;
    });
  });

  K.data.achievements = list;
})(window.K = window.K || {});
