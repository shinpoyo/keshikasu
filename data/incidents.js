// ふしぎなできごと（序盤の ボケ）。1つずつ じゅんばんに、いちどだけ おこる（js/incidents.js）
// when: カスニュースと おなじ 条件（js/news.js の ok）。sec: ごほうび = いまの /s × sec（すくなくとも min）
(function (K) {
  'use strict';
  K.data = K.data || {};
  function c(ja, en, rja, ren) { return { label: { ja: ja, en: en }, result: { ja: rja, en: ren } }; }
  K.data.incidents = [
    { id: 'wasabi', when: { total: 60 }, sec: 120, min: 30,
      label: { ja: 'みどりのカス？', en: 'Green crumb?' },
      title: { ja: 'みどりのカス', en: 'The Green Crumb' },
      text: { ja: 'つくえの上に、みどり色のカスが落ちていた。はじめて見る色だ。新しいしゅるいかもしれない。', en: 'There is a green crumb on the desk. You have never seen this color before. Could it be a new kind?' },
      choices: [
        c('こすってみる', 'Rub it', 'こすったら、なみだが出てきた。わさびだった。だれのおべんとうから来たのかは、わからない。', 'You rubbed it and your eyes started watering. It was wasabi. Whose lunch it came from, nobody knows.'),
        c('においをかぐ', 'Sniff it', '鼻がつーんとした。わさびだった。だれのおべんとうから来たのかは、わからない。', 'Your nose burned. It was wasabi. Whose lunch it came from, nobody knows.')
      ] },
    { id: 'letter', when: { total: 400 }, sec: 120, min: 100,
      label: { ja: '手紙が来た', en: 'A letter!' },
      title: { ja: 'カスあての手紙', en: 'A Letter for the Crumb' },
      text: { ja: 'カスに手紙がとどいた。送り主は「10年後のカス」。ふうとうが少し、こげている。', en: 'A letter arrived for the crumb. It is from "the crumb, 10 years from now." The envelope is a little burnt.' },
      choices: [
        c('読む', 'Read it', '中には「もっと こすれ」とだけ書いてあった。字がとてもきたない。', 'It just says: "RUB MORE." The handwriting is terrible.'),
        c('読まずにしまう', 'Put it away', 'しまったとたん、もう1通とどいた。「読め」と書いてあった。', 'The moment you put it away, a second letter arrived. It says: "READ IT."')
      ] },
    { id: 'tax', when: { total: 3000 }, sec: 150, min: 600,
      label: { ja: 'お知らせです', en: 'A notice' },
      title: { ja: 'カスぜいのお知らせ', en: 'Crumb Tax Notice' },
      text: { ja: 'スーツの人が来て、紙を1まい置いていった。「このつくえのカスに、カスぜいがかかります」', en: 'A person in a suit dropped off a sheet of paper. "The crumbs on this desk are now subject to Crumb Tax."' },
      choices: [
        c('はらう', 'Pay', '1つぶ はらった。スーツの人はていねいにおじぎをして、おつりをくれた。おつりのほうが多かった。', 'You paid 1 crumb. The person bowed politely and gave you change. The change was more than you paid.'),
        c('にげる', 'Run', 'にげた。スーツの人もにげた。あとには、おみやげのつぶがのこっていた。', 'You ran. The person in the suit also ran. They left a gift of crumbs behind.')
      ] },
    { id: 'mother', when: { total: 20000 }, sec: 150, min: 4000,
      label: { ja: 'だれか来た', en: 'A visitor' },
      title: { ja: 'カスの母', en: "The Crumb's Mother" },
      text: { ja: '「カスの母です」と名乗る消しゴムが来た。まだ一度も使われていない、まっ白で角のぴんとした消しゴムだ。', en: 'An eraser came to visit, saying, "I am the crumb\'s mother." It is brand new: perfectly white, with sharp corners.' },
      choices: [
        c('お茶を出す', 'Serve tea', '母はお茶を少しだけ消して、帰っていった。', 'The mother erased a little of the tea and went home.'),
        c('計算が合わない', "That's impossible", '母は「それは言わない約束」と言って、帰っていった。', 'The mother said, "We agreed never to talk about that," and went home.')
      ] },
    { id: 'tv', when: { total: 150000 }, sec: 180, min: 30000,
      label: { ja: 'テレビが来た', en: 'TV crew!' },
      title: { ja: 'テレビの取材', en: 'TV Interview' },
      text: { ja: 'テレビ局が「世界のすごいカス」の取材に来た。カメラが、カスに向けられている。', en: 'A TV crew is here for the show "Amazing Crumbs of the World." The camera is pointed at the crumb.' },
      choices: [
        c('ポーズをとる', 'Strike a pose', '放送された。カスは3びょう うつった。となりのほこりのほうが長くうつっていた。', 'It aired. The crumb was on screen for 3 seconds. The dust next to it got more screen time.'),
        c('カスにマイクを向ける', 'Hand it the mic', 'カスは何も言わなかった。番組は「深い」と大人気になった。', 'The crumb said nothing. Viewers called it "deep." The show was a huge hit.')
      ] },
    { id: 'ufo', when: { total: 2e6 }, sec: 180, min: 4e5,
      label: { ja: 'UFOだ！', en: 'A UFO!' },
      title: { ja: 'うちゅうからの使者', en: 'Visitors from Space' },
      text: { ja: 'UFOがつくえの上に止まった。中から出てきたうちゅう人が言った。「このカスを、わが星の王にしたい」', en: 'A UFO landed on the desk. An alien stepped out and said, "We wish to make this crumb the king of our planet."' },
      choices: [
        c('ことわる', 'Refuse', 'うちゅう人は少し考えて、かわりにえんぴつけずりのくずを王にして帰っていった。', 'The alien thought for a moment, then made a pencil shaving their king instead and left.'),
        c('行かせる', 'Let it go', 'カスは王になり、3分で帰ってきた。「思ってたのとちがった」そうだ。', 'The crumb became king and came back 3 minutes later. "It wasn\'t what I expected," it said.')
      ] },
    { id: 'twins', when: { total: 3e7 }, sec: 180, min: 6e6,
      label: { ja: 'カスがふえた？', en: 'Two crumbs?' },
      title: { ja: 'にせもののカス', en: 'The Fake Crumb' },
      text: { ja: 'つくえの上に、そっくりなカスが2つならんでいる。どちらかは、にせものらしい。', en: 'Two identical crumbs sit side by side. One of them is apparently a fake.' },
      choices: [
        c('左', 'Left', '左が本物だった。右もそう言っている。', 'The left one was real. The right one says the same thing.'),
        c('右', 'Right', '右はわさびだった。', 'The right one was wasabi.')
      ] },
    { id: 'ceo', when: { total: 5e8 }, sec: 180, min: 1e8,
      label: { ja: '社長が来た', en: 'A CEO!' },
      title: { ja: '1つ10億', en: 'One Billion Each' },
      text: { ja: '大きな会社の社長が来て言った。「このカスを、1つ10億で買いたい」', en: 'The CEO of a huge company says, "I would like to buy this crumb. One billion each."' },
      choices: [
        c('売らない', 'Not for sale', '社長は泣きながら帰っていった。置いていっためいしは、消しゴムでできていた。', 'The CEO left in tears. Their business card was made of eraser.'),
        c('ねぎる', 'Haggle', '「では1つ1円で」と社長。気がつくと、カスが1つへって、1円玉が置いてあった。', '"Then, one yen each," said the CEO. You look down. One crumb is gone, and a one-yen coin sits in its place.')
      ] }
  ];
})(window.K = window.K || {});
