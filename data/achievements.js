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
   [100, 'こする人', 'Rubber', 'だんだんなれてきた。', 'Getting used to it.'],
   [1000, 'こする達人', 'Rub Expert', '指が少しつかれた。', 'Finger is a little tired.'],
   [10000, 'こする名人', 'Rub Master', '指がとけそう。', 'Finger might melt.'],
   [100000, 'こする伝説', 'Rub Legend', '指にありがとう。', 'Thank your finger.']
  ].forEach(function (r, i) {
    add({ id: 'rubs' + i, cat: 'rub', type: 'rubs', n: r[0], name: { ja: r[1], en: r[2] },
      desc: { ja: r[0] === 1 ? 'はじめてこすった。' : f(r[0]) + '回こすった。', en: r[0] === 1 ? 'Rubbed for the first time.' : 'Rubbed ' + f(r[0]) + ' times.' },
      quote: { ja: r[3], en: r[4] } });
  });
  [[1000, '手作り', 'Handmade'], [1e6, '手作りの力', 'Power of Handmade'], [1e9, '手作りのきわみ', 'Handmade Mastery']].forEach(function (r, i) {
    add({ id: 'hand' + i, cat: 'rub', type: 'handmade', n: r[0], name: { ja: r[1], en: r[2] },
      desc: { ja: 'こすって' + f(r[0]) + 'つぶ集めた。', en: 'Made ' + f(r[0]) + ' crumbs by rubbing.' },
      quote: { ja: '自分の指で。', en: 'With your own finger.' } });
  });
  [[1, 'はじめのひとつぶ', 'The First Crumb'], [1000, 'ひとにぎり', 'A Handful'], [1e5, 'ちょっとした山', 'A Small Pile'],
   [1e6, '1M つぶ', '1M Crumbs'], [1e8, 'つくえがいっぱい', 'Desk Full'], [1e9, '1B つぶ', '1B Crumbs'],
   [1e11, '部屋がいっぱい', 'Room Full'], [1e12, '1T つぶ', '1T Crumbs'], [1e14, '町がいっぱい', 'Town Full'],
   [1e15, '1Qa つぶ', '1Qa Crumbs'], [1e18, '星がいっぱい', 'Planet Full']].forEach(function (r, i) {
    add({ id: 'total' + i, cat: 'rub', type: 'total', n: r[0], name: { ja: r[1], en: r[2] },
      desc: { ja: '全部で' + f(r[0]) + 'つぶ集めた。', en: 'Made ' + f(r[0]) + ' crumbs in all.' },
      quote: { ja: '数えるのが大変。', en: 'Hard to count.' } });
  });
  [1, 10, 100, 1000, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9].forEach(function (n, i) {
    add({ id: 'cps' + i, cat: 'rub', type: 'cps', n: n,
      name: { ja: '毎秒 ' + f(n), en: f(n) + ' per second' },
      desc: { ja: '1秒に' + f(n) + 'つぶ集まるようになった。', en: 'Reached ' + f(n) + ' crumbs per second.' },
      quote: { ja: 'じっとしているだけでふえる。', en: 'It grows while you sit still.' } });
  });

  // --- どうぐ ---
  var PAT = [
    [1, 'はじめての', '', 'First ', ''],
    [25, '', 'がいっぱい', 'Lots of ', ''],
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
        desc: { ja: b.name.ja + 'を' + p[0] + '集めた。', en: 'Have ' + p[0] + ' ' + b.name.en + '.' },
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
  [[1, 'まるめてみた', 'First Roll'], [10, 'まるめる人', 'Roller'], [100, 'まるめる達人', 'Roll Expert'], [1000, 'まるめる名人', 'Roll Master']].forEach(function (r, i) {
    add({ id: 'roll' + i, cat: 'evolve', type: 'rolls', n: r[0], name: { ja: r[1], en: r[2] },
      desc: { ja: r[0] === 1 ? 'はじめてカスをまるめた。' : f(r[0]) + '回まるめた。', en: r[0] === 1 ? 'Rolled a crumb for the first time.' : 'Rolled ' + f(r[0]) + ' times.' },
      quote: { ja: 'ころころ。', en: 'Roll roll.' } });
  });
  add({ id: 'mix1', cat: 'evolve', type: 'mix', n: 1, name: { ja: 'まぜてみた', en: 'Mixed It Up' },
    desc: { ja: 'はじめて材料をまぜた。', en: 'Mixed in a material for the first time.' },
    quote: { ja: '何かまざった。', en: 'Something got mixed in.' } });
  [[1, '消しゴムになった', 'Became an Eraser'], [5, 'また消しゴム', 'Eraser Again'], [10, '何度も消しゴム', 'Eraser Over and Over']].forEach(function (r, i) {
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
   ['neri', 'ねりねり', 'Knead Knead', '全部まとまった。', 'It all came together.'],
   ['kaori', 'いいにおい', 'Smells Nice', 'おなかがすいた。', 'Now I am hungry.'],
   ['rocket', 'はっしゃ', 'Liftoff', '次のこまはどこ？', 'Where did the next piece go?']].forEach(function (r) {
    add({ id: 'guest_' + r[0], cat: 'golden', type: 'guest', g: r[0], n: 1, name: { ja: r[1], en: r[2] },
      desc: { ja: K.data.guests.filter(function (g) { return g.id === r[0]; })[0].name.ja + 'をはじめて使った。',
        en: 'Used a ' + K.data.guests.filter(function (g) { return g.id === r[0]; })[0].name.en + ' for the first time.' },
      quote: { ja: r[3], en: r[4] } });
  });
  [[10, 'お客さん', 'Visitors'], [50, '消しゴムのたまり場', 'Eraser Hangout'], [100, '筆箱いっぱい', 'Full Pencil Case']].forEach(function (r, i) {
    add({ id: 'guests' + i, cat: 'golden', type: 'guests', n: r[0], name: { ja: r[1], en: r[2] },
      desc: { ja: 'やってきた消しゴムを' + r[0] + '回使った。', en: 'Used ' + r[0] + ' visiting erasers.' },
      quote: { ja: 'また来てね。', en: 'Come again.' } });
  });

  // --- ひみつ ---
  add({ id: 's_blow3', cat: 'secret', hidden: true, type: 'blowStreak', n: 3, name: { ja: 'ふきすぎ', en: 'Too Much Blowing' },
    desc: { ja: '3回続けてふいた。', en: 'Blew 3 times in a row.' }, quote: { ja: '目が回る。', en: 'So dizzy.' } });
  add({ id: 's_praise100', cat: 'secret', hidden: true, type: 'praises', n: 100, name: { ja: 'ほめ上手', en: 'Master Praiser' },
    desc: { ja: '100回ほめた。', en: 'Praised 100 times.' }, quote: { ja: 'そろそろ調子に乗る。', en: 'It is getting a big head.' } });
  add({ id: 's_named', cat: 'secret', hidden: true, type: 'named', n: 1, name: { ja: '名前をもらった', en: 'Got a Name' },
    desc: { ja: 'カスに名前をつけた。', en: 'Named your crumb.' }, quote: { ja: 'うれしい。', en: 'Happy.' } });
  add({ id: 's_idle', cat: 'secret', hidden: true, type: 'idle', n: 600, name: { ja: '何もしない', en: 'Doing Nothing' },
    desc: { ja: '10分、何もしなかった。', en: 'Did nothing for 10 minutes.' }, quote: { ja: 'それも大事。', en: 'That matters too.' } });
  add({ id: 's_sell', cat: 'secret', hidden: true, type: 'sell', n: 1, name: { ja: 'お別れ', en: 'Farewell' },
    desc: { ja: 'どうぐを売った。', en: 'Sold a tool.' }, quote: { ja: 'また会おうね。', en: 'See you again.' } });
  add({ id: 's_night', cat: 'secret', hidden: true, type: 'night', n: 1, name: { ja: '夜ふかし', en: 'Night Owl' },
    desc: { ja: '夜中の0時から5時に遊んだ。', en: 'Played between midnight and 5 AM.' }, quote: { ja: '早くねよう。', en: 'Go to bed.' } });
  add({ id: 's_rest', cat: 'secret', hidden: true, type: 'rested', n: 1, name: { ja: 'ひと休み', en: 'Taking a Break' },
    desc: { ja: 'ひと休みした。', en: 'Took a break.' }, quote: { ja: 'えらい。', en: 'Good job.' } });

  // --- かげ（ズル）。数にも /s にも はいらない ---
  add({ id: 's_cheated', cat: 'secret', hidden: true, shadow: true, type: 'cheated', n: 1,
    name: { ja: 'ズルしたカスはまずい', en: 'Cheated Crumbs Taste Awful' },
    desc: { ja: 'ズルをした。（このじっせきは数えない）', en: 'You cheated. (This one does not count.)' },
    quote: { ja: 'なんだか味がしない。', en: 'Somehow it tastes like nothing.' } });

  K.data.achievements = list;
})(window.K = window.K || {});
