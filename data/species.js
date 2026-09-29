// カスの しゅるい（企画書 7章）: 7だんかい × 7けいとう ＋ とくべつ 7しゅ = 56しゅるい。まるめると 1ぴき できる（js/evolution.js）
(function (K) {
  'use strict';
  K.data = K.data || {};

  K.data.stages = [
    { n: 1, need: 0, name: { ja: 'にょろにょろの', en: 'Squiggly' },
      line: { ja: 'ふつうの けしカス。まだ なにも おもっていない。', en: 'An ordinary eraser crumb. Not thinking about anything yet.' } },
    { n: 2, need: 100, name: { ja: 'ちらばった', en: 'Scattered' },
      line: { ja: 'なかまが ふえた。みんな すこし はなれている。', en: 'More friends now. Everyone keeps a little distance.' } },
    { n: 3, need: 1e4, name: { ja: 'こんもりの', en: 'Heaped' },
      line: { ja: 'よりあつまって やまに なった。どりょくの あかし。', en: 'Gathered into a heap. Proof of hard work.' } },
    { n: 4, need: 1e6, name: { ja: 'まるまった', en: 'Rolled' },
      line: { ja: 'ころころ した。ねりけしでは ない。', en: 'It rolled up. It is not kneaded eraser.' } },
    { n: 5, need: 1e9, name: { ja: 'かおが うかんだ', en: 'Face-Appeared' },
      line: { ja: 'かおが うかんだ。きのせいかも しれない。', en: 'A face appeared. It might be your imagination.' } },
    { n: 6, need: 1e12, name: { ja: 'でんせつの', en: 'Legendary' },
      line: { ja: 'でんせつに なった。みためは ほぼ おなじ。', en: 'It became a legend. Looks almost the same.' } },
    { n: 7, need: 1e15, name: { ja: 'うちゅうの', en: 'Cosmic' },
      line: { ja: 'うちゅうの カスに なった。つくえの うえに いる。', en: 'It became a cosmic crumb. It is still on the desk.' } }
  ];

  // けいとう。filter はデザイン案（design/Zukan.dc.html）と同じ
  K.data.traits = [
    { id: 'plain', chip: '#A9A49B', filter: 'none',
      name: { ja: 'ノーマル', en: 'Plain' }, word: { ja: '', en: '' },
      lines: { ja: ['ふつうが いちばん。', 'なにも まざって いない。', 'はいいろは おちつく。'], en: ['Plain is best.', 'Nothing mixed in.', 'Gray is calming.'] } },
    { id: 'graphite', chip: '#2B2A28', filter: 'brightness(0.55) contrast(1.4)',
      name: { ja: 'くろ', en: 'Graphite' }, word: { ja: 'くろ', en: 'Graphite' },
      lines: { ja: ['えんぴつの きもちが すこし わかる。', 'くろい。ちょっと ひかる。', 'かいた もじを おもいだす。'], en: ['Understands pencils a little.', 'Black. Slightly shiny.', 'Remembers the letters it once was.'] } },
    // カラフルは フィルターで うすい はいいろに してから、にじ色の そうを かさねる（art.js の kasuPic）
    { id: 'rainbow', chip: '#C77DD6', chipBg: 'conic-gradient(#FF5A5F, #FFC23F, #8BD86A, #3FB6FF, #9A7CFF, #FF6FD1, #FF5A5F)', filter: 'grayscale(1) brightness(2.3) contrast(0.9)', tint: 'rainbow',
      name: { ja: 'カラフル', en: 'Rainbow' }, word: { ja: 'カラフル', en: 'Rainbow' },
      lines: { ja: ['24しょくぶん たのしい。', 'どの いろが ほんとうの ぼく？', 'ぬりえの あとの におい。'], en: ['As fun as 24 colors.', 'Which color is the real me?', 'Smells like a coloring book.'] } },
    { id: 'sticky', chip: '#9FC7E8', filter: 'contrast(1.25) brightness(1.2) drop-shadow(0 0 2px #FFFFFF)',
      name: { ja: 'ねばねば', en: 'Sticky' }, word: { ja: 'ねばねば', en: 'Sticky' },
      lines: { ja: ['つくえから はなれられない。', 'のびる。どこまでも。', 'ゆびに つくのは あいじょう。'], en: ['Cannot leave the desk.', 'It stretches. Forever.', 'Sticking to your finger is love.'] } },
    { id: 'fluffy', chip: '#E9E4DA', filter: 'blur(0.7px) brightness(1.5) contrast(0.8)',
      name: { ja: 'もふもふ', en: 'Fluffy' }, word: { ja: 'もふもふ', en: 'Fluffy' },
      lines: { ja: ['ほこりと なかよく なった。', 'くしゃみが でそう。', 'さわると あたたかい きがする。'], en: ['Made friends with the dust.', 'Might make you sneeze.', 'Feels warm. Maybe.'] } },
    { id: 'gritty', chip: '#C9A676', filter: 'sepia(0.6) contrast(1.7) brightness(1.05)',
      name: { ja: 'ざらざら', en: 'Gritty' }, word: { ja: 'ざらざら', en: 'Gritty' },
      lines: { ja: ['ボールペンも けせる きが する。', 'すなはまの おもいで。', 'さわると いたい。ちょっとだけ。'], en: ['Feels like it could erase ink.', 'Memories of a sandy beach.', 'A little scratchy.'] } },
    { id: 'golden', chip: '#E7B533', filter: 'sepia(1) saturate(4) hue-rotate(5deg) brightness(1.35)',
      name: { ja: 'キラキラ', en: 'Golden' }, word: { ja: 'キラキラ', en: 'Golden' },
      lines: { ja: ['まぶしくて ごめん。', 'きんいろ。でも カス。', 'おかねには ならない。'], en: ['Sorry for being so bright.', 'Gold. Still a crumb.', 'Not worth any money.'] } }
  ];

  // とくべつな カス（隠し）。まるめた ときに じょうけんを みたして いれば でる（js/evolution.js）
  K.data.specials = [
    { id: 'lucky', img: 'art/special-lucky.svg',
      name: { ja: 'ラッキー カス', en: 'Lucky Crumb' },
      hint: { ja: 'キラキラ している ときに まるめると…？', en: 'Roll while something is sparkling...?' },
      line: { ja: 'たまたま ひかっていた。うんも じつりょく。', en: 'It happened to be glowing. Luck is a skill too.' } },
    { id: 'toasty', img: 'art/special-toasty.svg',
      name: { ja: 'あつあつ カス', en: 'Toasty Crumb' },
      hint: { ja: 'ものすごく はやく こすると…？', en: 'Rub really, really fast...?' },
      line: { ja: 'こすりすぎて あったかい。やけどに ちゅうい。', en: 'Rubbed so much it is warm. Careful.' } },
    { id: 'night', img: 'art/special-night.svg',
      name: { ja: 'よふかし カス', en: 'Night Owl Crumb' },
      hint: { ja: 'よるの おそい じかんに まるめると…？', en: 'Roll very late at night...?' },
      line: { ja: 'ねむれない よる。カスも おなじ。', en: 'A sleepless night. The crumb too.' } },
    { id: 'king', img: 'art/special-king.svg',
      name: { ja: 'じしょう カスのおうさま', en: 'Self-Proclaimed Crumb King' },
      hint: { ja: 'いっぱい ほめると…？', en: 'Praise it a lot...?' },
      line: { ja: 'ほめられすぎて おうさまに なった。だれも みとめていない。', en: 'Praised too much, it crowned itself. Nobody agreed.' } },
    { id: 'wander', img: 'art/special-wander.svg',
      name: { ja: 'たびする カス', en: 'Wandering Crumb' },
      hint: { ja: 'なんども ふーっと ふくと…？', en: 'Blow on it many times...?' },
      line: { ja: 'いろんな ところへ とばされた。せかいは ひろい。', en: 'Blown to many places. The world is big.' } },
    { id: 'zen', img: 'art/special-zen.svg',
      name: { ja: 'さとった カス', en: 'Enlightened Crumb' },
      hint: { ja: 'なにも しないで ずっと まつと…？', en: 'Leave it alone for a long time...?' },
      line: { ja: 'なにも しない じかんに、すべてを しった。', en: 'In doing nothing, it learned everything.' } },
    { id: 'reborn', img: 'art/special-reborn.svg',
      name: { ja: 'なんども うまれかわった カス', en: 'Reborn Again Crumb' },
      hint: { ja: 'なんども けしゴムに もどると…？', en: 'Return to the eraser many times...?' },
      line: { ja: 'けしゴムに なって、また カスに なった。10かい いじょう。', en: 'Became an eraser, then a crumb again. Over ten times.' } }
  ];

  // ぶたい。でるように なった STAGE（state.stage）で かわる。絵は js/art.js の scene()
  K.data.scenes = [
    { id: 'desk', from: 1, name: { ja: 'つくえ', en: 'Desk' } },
    { id: 'classroom', from: 3, name: { ja: 'きょうしつ', en: 'Classroom' } },
    { id: 'school', from: 4, name: { ja: 'がっこう', en: 'School' } },
    { id: 'town', from: 5, name: { ja: 'まち', en: 'Town' } },
    { id: 'sky', from: 6, name: { ja: 'そら', en: 'Sky' } },
    { id: 'space', from: 7, name: { ja: 'うちゅう', en: 'Space' } }
  ];
  K.sceneFor = function (stage) {
    var sc = K.data.scenes[0];
    K.data.scenes.forEach(function (x) { if (stage >= x.from) sc = x; });
    return sc;
  };

  // 種類名: だんかい＋けいとう＋カス
  K.speciesId = function (stage, trait) { return stage + '-' + trait; };
})(window.K = window.K || {});
