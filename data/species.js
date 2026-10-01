// カスの しゅるい（企画書 7章）: 7だんかい × 7けいとう ＋ とくべつ 7しゅ ＋ かたちカス 32しゅ = 88しゅるい。まるめると 1ぴき できる（js/evolution.js）
(function (K) {
  'use strict';
  K.data = K.data || {};

  K.data.stages = [
    { n: 1, need: 0, name: { ja: 'にょろにょろの', en: 'Squiggly' },
      line: { ja: 'ふつうのけしカス。まだ何も思っていない。', en: 'An ordinary eraser crumb. Not thinking about anything yet.' } },
    { n: 2, need: 100, name: { ja: '散らばった', en: 'Scattered' },
      line: { ja: '仲間がふえた。みんな少しはなれている。', en: 'More friends now. Everyone keeps a little distance.' } },
    { n: 3, need: 1e4, name: { ja: 'こんもりの', en: 'Heaped' },
      line: { ja: 'より集まって山になった。努力のあかし。', en: 'Gathered into a heap. Proof of hard work.' } },
    { n: 4, need: 1e6, name: { ja: 'まるまった', en: 'Rolled' },
      line: { ja: 'ころころした。ねりけしではない。', en: 'It rolled into a ball. It is not a kneaded eraser. Please stop asking.' } },
    { n: 5, need: 1e9, name: { ja: '顔がうかんだ', en: 'Face-ish' },
      line: { ja: '顔がうかんだ。気のせいかもしれない。', en: 'A face appeared. It might be your imagination.' } },
    { n: 6, need: 1e12, name: { ja: '伝説の', en: 'Legendary' },
      line: { ja: '伝説になった。見た目はほぼ同じ。', en: 'It became a legend. Looks almost the same.' } },
    { n: 7, need: 1e15, name: { ja: 'うちゅうの', en: 'Cosmic' },
      line: { ja: 'うちゅうのカスになった。つくえの上にいる。', en: 'It became a cosmic crumb. It is still on the desk.' } }
  ];

  // けいとう。filter はデザイン案（design/Zukan.dc.html）と同じ
  K.data.traits = [
    { id: 'plain', chip: '#A9A49B', filter: 'none',
      name: { ja: 'ノーマル', en: 'Plain' }, word: { ja: '', en: '' },
      lines: { ja: ['ふつうが一番。', '何もまざっていない。', 'はいいろは落ち着く。'], en: ['Plain is best.', 'Nothing mixed in.', 'Gray is calming.'] } },
    { id: 'graphite', chip: '#2B2A28', filter: 'brightness(0.55) contrast(1.4)',
      name: { ja: '黒', en: 'Graphite' }, word: { ja: '黒', en: 'Graphite' },
      lines: { ja: ['えんぴつの気持ちが少し分かる。', '黒い。ちょっと光る。', '書いた文字を思い出す。'], en: ['Understands pencils a little.', 'Black. Slightly shiny.', 'Remembers the letters it once was.'] } },
    // カラフルは フィルターで うすい はいいろに してから、にじ色の そうを かさねる（art.js の kasuPic）
    { id: 'rainbow', chip: '#C77DD6', chipBg: 'conic-gradient(#FF5A5F, #FFC23F, #8BD86A, #3FB6FF, #9A7CFF, #FF6FD1, #FF5A5F)', filter: 'grayscale(1) brightness(2.3) contrast(0.9)', tint: 'rainbow',
      name: { ja: 'カラフル', en: 'Rainbow' }, word: { ja: 'カラフル', en: 'Rainbow' },
      lines: { ja: ['24色ぶん楽しい。', 'どの色が本当のぼく？', 'ぬりえの後のにおい。'], en: ['As fun as a 24-color pencil set.', 'Which color is the real me?', 'Smells like a coloring book.'] } },
    { id: 'sticky', chip: '#9FC7E8', filter: 'contrast(1.25) brightness(1.2) drop-shadow(0 0 2px #FFFFFF)',
      name: { ja: 'ねばねば', en: 'Sticky' }, word: { ja: 'ねばねば', en: 'Sticky' },
      lines: { ja: ['つくえからはなれられない。', 'のびる。どこまでも。', '指につくのはあいじょう。'], en: ['Cannot leave the desk.', 'It stretches. Forever.', 'If it sticks to your finger, that is love.'] } },
    { id: 'fluffy', chip: '#E9E4DA', filter: 'blur(0.7px) brightness(1.5) contrast(0.8)',
      name: { ja: 'もふもふ', en: 'Fluffy' }, word: { ja: 'もふもふ', en: 'Fluffy' },
      lines: { ja: ['ほこりと仲良くなった。', 'くしゃみが出そう。', 'さわると温かい気がする。'], en: ['Made friends with the dust.', 'Might make you sneeze.', 'Feels warm. Maybe.'] } },
    { id: 'gritty', chip: '#C9A676', filter: 'sepia(0.6) contrast(1.7) brightness(1.05)',
      name: { ja: 'ざらざら', en: 'Gritty' }, word: { ja: 'ざらざら', en: 'Gritty' },
      lines: { ja: ['ボールペンも消せる気がする。', 'すなはまの思い出。', 'さわるといたい。ちょっとだけ。'], en: ['Feels like it could erase ink.', 'Memories of a sandy beach.', 'A little scratchy.'] } },
    { id: 'golden', chip: '#E7B533', filter: 'sepia(1) saturate(4) hue-rotate(5deg) brightness(1.35)',
      name: { ja: 'キラキラ', en: 'Golden' }, word: { ja: 'キラキラ', en: 'Golden' },
      lines: { ja: ['まぶしくてごめん。', '金色。でもカス。', 'お金にはならない。'], en: ['Sorry for being so bright.', 'Gold. Still a crumb.', 'Not worth any money.'] } }
  ];

  // とくべつな カス（隠し）。まるめた ときに じょうけんを みたして いれば でる（js/evolution.js）
  K.data.specials = [
    { id: 'lucky', img: 'art/special-lucky.svg',
      name: { ja: 'ラッキー カス', en: 'Lucky Crumb' },
      hint: { ja: 'キラキラしている時にまるめると…？', en: 'Roll while something is sparkling...?' },
      line: { ja: 'たまたま光っていた。運も実力。', en: 'It happened to be glowing. Luck is a skill too.' } },
    { id: 'toasty', img: 'art/special-toasty.svg',
      name: { ja: 'あつあつ カス', en: 'Toasty Crumb' },
      hint: { ja: 'ものすごく速くこすると…？', en: 'Rub really, really fast...?' },
      line: { ja: 'こすりすぎてあったかい。やけどに注意。', en: 'Rubbed so hard it got warm. Do not burn yourself.' } },
    { id: 'night', img: 'art/special-night.svg',
      name: { ja: '夜ふかし カス', en: 'Night Owl Crumb' },
      hint: { ja: '夜のおそい時間にまるめると…？', en: 'Roll very late at night...?' },
      line: { ja: 'ねむれない夜。カスも同じ。', en: 'A sleepless night. The crumb too.' } },
    { id: 'king', img: 'art/special-king.svg',
      name: { ja: 'じしょう カスの王様', en: 'Self-Proclaimed Crumb King' },
      hint: { ja: 'いっぱいほめると…？', en: 'Praise it a lot...?' },
      line: { ja: 'ほめられすぎて王様になった。だれもみとめていない。', en: 'Praised too much, it crowned itself. Nobody agreed.' } },
    { id: 'wander', img: 'art/special-wander.svg',
      name: { ja: '旅する カス', en: 'Wandering Crumb' },
      hint: { ja: '何度もふーっとふくと…？', en: 'Blow on it many times...?' },
      line: { ja: 'いろんなところへ飛ばされた。世界は広い。', en: 'Blown to many places. The world is big.' } },
    { id: 'zen', img: 'art/special-zen.svg',
      name: { ja: 'さとった カス', en: 'Enlightened Crumb' },
      hint: { ja: '何もしないでずっと待つと…？', en: 'Leave it alone for a long time...?' },
      line: { ja: '何もしない時間に、すべてを知った。', en: 'In doing nothing, it learned everything.' } },
    { id: 'reborn', img: 'art/special-reborn.svg',
      name: { ja: '何度も生まれ変わった カス', en: 'Recycled Crumb' },
      hint: { ja: '何度も消しゴムにもどると…？', en: 'Return to the eraser many times...?' },
      line: { ja: '消しゴムになって、またカスになった。10回以上。', en: 'Became an eraser, then a crumb again. Over ten times.' } }
  ];

  // かたちカス。まるめると ときどき へんな かたちに なる（ざいりょうとは かんけい なし）。stage = その STAGE が でるように なったら でる
  // 絵は design/art/katachi.py で つくる
  K.data.shapes = [
    { id: 'k-tiny', stage: 1, img: 'art/katachi-tiny.svg', name: { ja: 'カスのカス', en: 'Crumb of a Crumb' }, line: { ja: '小さすぎて見えない。でもいる。', en: 'Too small to see. But it is there.' } },
    { id: 'k-snake', stage: 1, img: 'art/katachi-snake.svg', name: { ja: 'へびカス', en: 'Snake Crumb' }, line: { ja: 'ほぼにょろにょろ。でもへびだと言いはる。', en: 'Basically squiggly. Insists it is a snake.' } },
    { id: 'k-longest', stage: 1, img: 'art/katachi-longest.svg', name: { ja: '長ーいカス', en: 'Loooong Crumb' }, line: { ja: '世界一長い。たぶん1メートル。はかっていない。', en: 'The longest in the world. Maybe 1 meter. Nobody measured.' } },
    { id: 'k-bone', stage: 1, img: 'art/katachi-bone.svg', name: { ja: 'ほねカス', en: 'Bone Crumb' }, line: { ja: '犬がほしがる。あげない。', en: 'Dogs want it. They cannot have it.' } },
    { id: 'k-heart', stage: 1, img: 'art/katachi-heart.svg', name: { ja: 'ハートカス', en: 'Heart Crumb' }, line: { ja: '好きな子にわたしたい。わたせない。', en: 'Meant for someone special. Never given.' } },
    { id: 'k-caterpillar', stage: 2, img: 'art/katachi-caterpillar.svg', name: { ja: 'いもむしカス', en: 'Caterpillar Crumb' }, line: { ja: 'ちょうちょになる予定はない。', en: 'No plans to become a butterfly.' } },
    { id: 'k-snail', stage: 2, img: 'art/katachi-snail.svg', name: { ja: 'かたつむりカス', en: 'Snail Crumb' }, line: { ja: 'からも中身もカス。', en: 'Crumb shell. Crumb inside.' } },
    { id: 'k-glasses', stage: 2, img: 'art/katachi-glasses.svg', name: { ja: 'めがねカス', en: 'Glasses Crumb' }, line: { ja: 'かけても何も見えない。', en: 'You cannot see anything through it.' } },
    { id: 'k-star', stage: 2, img: 'art/katachi-star.svg', name: { ja: '星カス', en: 'Star Crumb' }, line: { ja: '流れない。願いもかなえない。', en: 'Not a shooting star. Grants no wishes.' } },
    { id: 'k-onigiri', stage: 2, img: 'art/katachi-onigiri.svg', name: { ja: 'おにぎりカス', en: 'Rice Ball Crumb' }, line: { ja: 'のりはえんぴつのカス。食べないでね。', en: 'The seaweed is pencil dust. Do not eat.' } },
    { id: 'k-cat', stage: 3, img: 'art/katachi-cat.svg', name: { ja: 'ねこカス', en: 'Cat Crumb' }, line: { ja: 'まるまってねている。起こすとばらばらになる。', en: 'Curled up asleep. Falls apart if you wake it.' } },
    { id: 'k-dog', stage: 3, img: 'art/katachi-dog.svg', name: { ja: '犬カス', en: 'Dog Crumb' }, line: { ja: 'しっぽをふりすぎてとれた。', en: 'Wagged its tail so hard it fell off.' } },
    { id: 'k-chick', stage: 3, img: 'art/katachi-chick.svg', name: { ja: 'ひよこカス', en: 'Chick Crumb' }, line: { ja: 'ぴよ。とは言わない。', en: 'Does not say "peep."' } },
    { id: 'k-ribbon', stage: 3, img: 'art/katachi-ribbon.svg', name: { ja: 'リボンカス', en: 'Ribbon Crumb' }, line: { ja: 'ほどけない。結んでいないから。', en: 'Cannot be untied. It was never tied.' } },
    { id: 'k-donut', stage: 3, img: 'art/katachi-donut.svg', name: { ja: 'ドーナツカス', en: 'Donut Crumb' }, line: { ja: '真ん中のあなは最初からない。', en: 'Never had a hole in the middle.' } },
    { id: 'k-rabbit', stage: 4, img: 'art/katachi-rabbit.svg', name: { ja: 'うさぎカス', en: 'Rabbit Crumb' }, line: { ja: '耳が長い。すぐちぎれる。', en: 'Long ears. They snap off easily.' } },
    { id: 'k-crab', stage: 4, img: 'art/katachi-crab.svg', name: { ja: 'かにカス', en: 'Crab Crumb' }, line: { ja: '横に歩く。消しゴムのほうへ。', en: 'Walks sideways. Toward the eraser.' } },
    { id: 'k-penguin', stage: 4, img: 'art/katachi-penguin.svg', name: { ja: 'ペンギンカス', en: 'Penguin Crumb' }, line: { ja: '飛べない。そもそも動けない。', en: 'Cannot fly. Cannot move, really.' } },
    { id: 'k-hedgehog', stage: 4, img: 'art/katachi-hedgehog.svg', name: { ja: 'ハリネズミカス', en: 'Hedgehog Crumb' }, line: { ja: 'はりは全部ひょろひょろ。いたくない。', en: 'All the spikes are floppy. Does not hurt.' } },
    { id: 'k-softcream', stage: 4, img: 'art/katachi-softcream.svg', name: { ja: 'ソフトクリームカス', en: 'Soft Serve Crumb' }, line: { ja: 'おいしそう。食べられない。コーンだけ本物。', en: 'Looks tasty. Not edible. Only the cone is real.' } },
    { id: 'k-letter-a', stage: 4, img: 'art/katachi-letter-a.svg', name: { ja: '「あ」カス', en: '"A" Crumb' }, line: { ja: '漢字ドリルで生まれた。ひらがなだけど。', en: 'Born in a spelling workbook. Never learned the rest of the alphabet.' } },
    { id: 'k-octopus', stage: 5, img: 'art/katachi-octopus.svg', name: { ja: 'たこカス', en: 'Octopus Crumb' }, line: { ja: '足が8本。数えたら7本。', en: 'Eight legs. Counted seven.' } },
    { id: 'k-whale', stage: 5, img: 'art/katachi-whale.svg', name: { ja: 'くじらカス', en: 'Whale Crumb' }, line: { ja: 'つくえの海を泳ぐ。しおはふかない。', en: 'Swims across the desk like it is the sea. Never sprays water.' } },
    { id: 'k-seahorse', stage: 5, img: 'art/katachi-seahorse.svg', name: { ja: 'たつのおとしごカス', en: 'Seahorse Crumb' }, line: { ja: 'おとしごだけど、おとしものではない。', en: 'Not a horse. Has never been to the sea.' } },
    { id: 'k-robot', stage: 5, img: 'art/katachi-robot.svg', name: { ja: 'ロボットカス', en: 'Robot Crumb' }, line: { ja: '四角くしたかった。無理だった。', en: 'Tried to be square. Could not.' } },
    { id: 'k-bicycle', stage: 5, img: 'art/katachi-bicycle.svg', name: { ja: '自転車カス', en: 'Bicycle Crumb' }, line: { ja: '乗れない。こげない。たおれない。', en: 'Cannot ride it. Cannot pedal it. Will not fall over.' } },
    { id: 'k-plane', stage: 5, img: 'art/katachi-plane.svg', name: { ja: '飛行機カス', en: 'Airplane Crumb' }, line: { ja: '飛ばない。ふーっとすると少し飛ぶ。', en: 'Does not fly. Blow on it and it flies a bit.' } },
    { id: 'k-dragon', stage: 6, img: 'art/katachi-dragon.svg', name: { ja: 'カスドラゴン', en: 'Crumb Dragon' }, line: { ja: 'カスでできているのでひょろひょろ。ほのおは出ない。けむりもカス。', en: 'Made of crumbs, so it is scrawny. No fire. Even the smoke is crumbs.' } },
    { id: 'k-trex', stage: 6, img: 'art/katachi-trex.svg', name: { ja: 'きょうりゅうカス', en: 'Dinosaur Crumb' }, line: { ja: 'ほねはない。全部カス。', en: 'No bones. All crumb.' } },
    { id: 'k-human', stage: 6, img: 'art/katachi-human.svg', name: { ja: '人間カス', en: 'Human Crumb' }, line: { ja: 'ちょっと、きみににてる。', en: 'Looks a little like you.' } },
    { id: 'k-eraser', stage: 6, img: 'art/katachi-eraser.svg', name: { ja: '消しゴムカス', en: 'Eraser Crumb' }, line: { ja: 'カスでできた消しゴム。こするとカスが出る。', en: 'An eraser made of crumbs. Rub it and crumbs come out.' } },
    { id: 'k-ufo', stage: 7, img: 'art/katachi-ufo.svg', name: { ja: 'UFOカス', en: 'UFO Crumb' }, line: { ja: 'つくえの外には出られない。', en: 'Cannot leave the desk. Still unidentified.' } },
    { id: 'k-king', stage: 7, img: 'art/katachi-king.svg', name: { ja: 'カスキング', en: 'Crumb King' }, line: { ja: '本物の王さま。自分で言っているわけではない。', en: 'A real king. Not like that other one.' } },
    { id: 'k-god', stage: 7, img: 'art/katachi-god.svg', name: { ja: 'カス神', en: 'Crumb God' }, line: { ja: '手がいっぱい。何本あるかは神さまも知らない。', en: 'So many hands. Even the god does not know how many.' } }
  ];

  // ぶたい。でるように なった STAGE（state.stage）で かわる。絵は js/art.js の scene()
  K.data.scenes = [
    { id: 'desk', from: 1, name: { ja: 'つくえ', en: 'Desk' } },
    { id: 'classroom', from: 3, name: { ja: '教室', en: 'Classroom' } },
    { id: 'school', from: 4, name: { ja: '学校', en: 'School' } },
    { id: 'town', from: 5, name: { ja: '町', en: 'Town' } },
    { id: 'sky', from: 6, name: { ja: '空', en: 'Sky' } },
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
