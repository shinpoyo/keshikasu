// じっせき（企画書 6-8）。1つにつき /s +1%
// cat: rub / buddy / evolve / golden / secret
(function (K) {
  'use strict';
  K.data = K.data || {};
  var list = [];
  function add(a) { list.push(a); }
  var f = function (n) { return K.fmt(n); };

  // --- こする ---
  [[1, 'はじめての こする', 'First Rub', 'ごし', 'Rub.'],
   [100, 'こする ひと', 'Rubber', 'だんだん なれてきた。', 'Getting used to it.'],
   [1000, 'こする たつじん', 'Rub Expert', 'ゆびが すこし つかれた。', 'Finger is a little tired.'],
   [10000, 'こする めいじん', 'Rub Master', 'ゆびが とけそう。', 'Finger might melt.'],
   [100000, 'こする でんせつ', 'Rub Legend', 'ゆびに ありがとう。', 'Thank your finger.']
  ].forEach(function (r, i) {
    add({ id: 'rubs' + i, cat: 'rub', type: 'rubs', n: r[0], name: { ja: r[1], en: r[2] },
      desc: { ja: r[0] === 1 ? 'はじめて こすった。' : f(r[0]) + 'かい こすった。', en: r[0] === 1 ? 'Rubbed for the first time.' : 'Rubbed ' + f(r[0]) + ' times.' },
      quote: { ja: r[3], en: r[4] } });
  });
  [[1000, 'てづくり', 'Handmade'], [1e6, 'てづくりの ちから', 'Power of Handmade'], [1e9, 'てづくりの きわみ', 'Handmade Mastery']].forEach(function (r, i) {
    add({ id: 'hand' + i, cat: 'rub', type: 'handmade', n: r[0], name: { ja: r[1], en: r[2] },
      desc: { ja: 'こすって ' + f(r[0]) + ' つぶ あつめた。', en: 'Made ' + f(r[0]) + ' crumbs by rubbing.' },
      quote: { ja: 'じぶんの ゆびで。', en: 'With your own finger.' } });
  });
  [[1, 'はじめの ひとつぶ', 'The First Crumb'], [1000, 'ひとにぎり', 'A Handful'], [1e5, 'ちょっとした やま', 'A Small Pile'],
   [1e6, '1M つぶ', '1M Crumbs'], [1e8, 'つくえが いっぱい', 'Desk Full'], [1e9, '1B つぶ', '1B Crumbs'],
   [1e11, 'へやが いっぱい', 'Room Full'], [1e12, '1T つぶ', '1T Crumbs'], [1e14, 'まちが いっぱい', 'Town Full'],
   [1e15, '1Qa つぶ', '1Qa Crumbs'], [1e18, 'ほしが いっぱい', 'Planet Full']].forEach(function (r, i) {
    add({ id: 'total' + i, cat: 'rub', type: 'total', n: r[0], name: { ja: r[1], en: r[2] },
      desc: { ja: 'ぜんぶで ' + f(r[0]) + ' つぶ あつめた。', en: 'Made ' + f(r[0]) + ' crumbs in all.' },
      quote: { ja: 'かぞえるのが たいへん。', en: 'Hard to count.' } });
  });
  [1, 10, 100, 1000, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9].forEach(function (n, i) {
    add({ id: 'cps' + i, cat: 'rub', type: 'cps', n: n,
      name: { ja: 'まいびょう ' + f(n), en: f(n) + ' per second' },
      desc: { ja: '1びょうに ' + f(n) + ' つぶ あつまる ように なった。', en: 'Reached ' + f(n) + ' crumbs per second.' },
      quote: { ja: 'じっと しているだけで ふえる。', en: 'It grows while you sit still.' } });
  });

  // --- なかま ---
  var PAT = [
    [1, 'はじめての ', '', 'First ', ''],
    [25, '', 'が いっぱい', 'Lots of ', ''],
    [50, '', 'の まち', '', ' Town'],
    [100, '', 'の くに', '', ' Nation'],
    [200, '', 'の うちゅう', '', ' Universe']
  ];
  var SPECIAL_NAME = { 'ant-25': ['アリの ぎょうれつ', 'Ant Parade', 'みんな おなじ ほうを むいている', 'Everyone faces the same way.'] };
  K.data.buildings.forEach(function (b) {
    PAT.forEach(function (p) {
      var sp = SPECIAL_NAME[b.id + '-' + p[0]];
      add({ id: 'b_' + b.id + '_' + p[0], cat: 'buddy', type: 'building', b: b.id, n: p[0],
        name: sp ? { ja: sp[0], en: sp[1] } : { ja: p[1] + b.name.ja + p[2], en: p[3] + b.name.en + p[4] },
        desc: { ja: b.name.ja + 'を ' + p[0] + ' あつめた。', en: 'Have ' + p[0] + ' ' + b.name.en + '.' },
        quote: sp ? { ja: sp[2], en: sp[3] } : { ja: b.line.ja, en: b.line.en } });
    });
  });

  // --- しんか ---
  K.data.stages.forEach(function (s) {
    if (s.n === 1) return;
    add({ id: 'stage' + s.n, cat: 'evolve', type: 'stage', n: s.n,
      name: { ja: s.name.ja + ' カス', en: s.name.en + ' Crumb' },
      desc: { ja: 'STAGE ' + s.n + ' に しんかした。', en: 'Evolved to STAGE ' + s.n + '.' },
      quote: { ja: s.line.ja, en: s.line.en } });
  });
  [[10, 'カスはかせ みならい', 'Crumb Scholar Trainee'], [30, 'カスはかせ', 'Crumb Scholar'], [56, 'カスの かみさま', 'Crumb Deity']].forEach(function (r, i) {
    add({ id: 'zukan' + i, cat: 'evolve', type: 'zukan', n: r[0], name: { ja: r[1], en: r[2] },
      desc: { ja: 'ずかんに ' + r[0] + 'しゅるい とうろく した。', en: 'Found ' + r[0] + ' kinds in the Crumbpedia.' },
      quote: { ja: 'カスにも いろいろ ある。', en: 'There are all kinds of crumbs.' } });
  });
  add({ id: 'mix1', cat: 'evolve', type: 'mix', n: 1, name: { ja: 'まぜてみた', en: 'Mixed It Up' },
    desc: { ja: 'はじめて ざいりょうを まぜた。', en: 'Mixed in a material for the first time.' },
    quote: { ja: 'なにか まざった。', en: 'Something got mixed in.' } });
  [[1, 'けしゴムに なった', 'Became an Eraser'], [5, 'また けしゴム', 'Eraser Again'], [10, 'なんども けしゴム', 'Eraser Over and Over']].forEach(function (r, i) {
    add({ id: 'rebirth' + i, cat: 'evolve', type: 'rebirth', n: r[0], name: { ja: r[1], en: r[2] },
      desc: { ja: 'けしゴムに ' + r[0] + 'かい もどった。', en: 'Returned to the eraser ' + r[0] + ' time' + (r[0] > 1 ? 's' : '') + '.' },
      quote: { ja: 'けしゴムは、また なにかを けすでしょう。', en: 'The eraser will erase something again.' } });
  });

  // --- ゴールデン ---
  [[1, 'キラッ', 'Sparkle'], [7, 'ラッキー セブン', 'Lucky Seven'], [27, 'キラキラ あつめ', 'Sparkle Collector'], [77, 'きんいろの ゆび', 'Golden Finger']].forEach(function (r, i) {
    add({ id: 'golden' + i, cat: 'golden', type: 'golden', n: r[0], name: { ja: r[1], en: r[2] },
      desc: { ja: 'ゴールデンカスを ' + r[0] + 'こ おした。', en: 'Clicked ' + r[0] + ' Golden Crumb' + (r[0] > 1 ? 's' : '') + '.' },
      quote: { ja: 'まぶしい。', en: 'So bright.' } });
  });

  // --- ひみつ ---
  add({ id: 's_blow3', cat: 'secret', hidden: true, type: 'blowStreak', n: 3, name: { ja: 'ふきすぎ', en: 'Too Much Blowing' },
    desc: { ja: '3かい つづけて ふいた。', en: 'Blew 3 times in a row.' }, quote: { ja: 'めが まわる。', en: 'So dizzy.' } });
  add({ id: 's_praise100', cat: 'secret', hidden: true, type: 'praises', n: 100, name: { ja: 'ほめじょうず', en: 'Master Praiser' },
    desc: { ja: '100かい ほめた。', en: 'Praised 100 times.' }, quote: { ja: 'そろそろ ちょうしに のる。', en: 'It is getting a big head.' } });
  add({ id: 's_named', cat: 'secret', hidden: true, type: 'named', n: 1, name: { ja: 'なまえを もらった', en: 'Got a Name' },
    desc: { ja: 'カスに なまえを つけた。', en: 'Named your crumb.' }, quote: { ja: 'うれしい。', en: 'Happy.' } });
  add({ id: 's_idle', cat: 'secret', hidden: true, type: 'idle', n: 600, name: { ja: 'なにも しない', en: 'Doing Nothing' },
    desc: { ja: '10ぷん なにも しなかった。', en: 'Did nothing for 10 minutes.' }, quote: { ja: 'それも だいじ。', en: 'That matters too.' } });
  add({ id: 's_sell', cat: 'secret', hidden: true, type: 'sell', n: 1, name: { ja: 'おわかれ', en: 'Farewell' },
    desc: { ja: 'なかまを うった。', en: 'Sold a buddy.' }, quote: { ja: 'また あおうね。', en: 'See you again.' } });
  add({ id: 's_night', cat: 'secret', hidden: true, type: 'night', n: 1, name: { ja: 'よふかし', en: 'Night Owl' },
    desc: { ja: 'よなかの 0じから 5じに あそんだ。', en: 'Played between midnight and 5 AM.' }, quote: { ja: 'はやく ねよう。', en: 'Go to bed.' } });
  add({ id: 's_rest', cat: 'secret', hidden: true, type: 'rested', n: 1, name: { ja: 'ひとやすみ', en: 'Taking a Break' },
    desc: { ja: 'ひとやすみ した。', en: 'Took a break.' }, quote: { ja: 'えらい。', en: 'Good job.' } });

  K.data.achievements = list;
})(window.K = window.K || {});
