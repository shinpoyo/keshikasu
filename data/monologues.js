// カスの ひとりごと（企画書 9章）。場面ごと
(function (K) {
  'use strict';
  K.data = K.data || {};
  function m(ja, en, when) { return { ja: ja, en: en, when: when || {} }; }
  K.data.monologues = {
    idle: [
      m('……', '...'),
      m('ぼくは何かを消した結果なんだ', 'I am the result of erasing something.'),
      m('つくえのはしっこが世界のはしだと思ってた', 'I thought the edge of the desk was the edge of the world.'),
      m('まとまるってなんだろう', 'What does it mean to come together?'),
      m('消された文字はどこへ行くのかな', 'Where do erased letters go?'),
      m('ノートの線の上は歩きやすい', 'The lines on the notebook are easy to walk on.'),
      m('今、だれかが何かを消している', 'Right now, someone is erasing something.'),
      m('転がりたい気分', 'I feel like rolling.'),
      m('えんぴつとはふくざつな関係', 'It is complicated between me and the pencil.'),
      m('消しゴムのころを覚えてない', "I don't remember being an eraser."),
      m('ふーっとされるのはちょっとこわい', 'Being blown away is a little scary.'),
      m('じっとしているのはとくい', 'I am good at staying still.'),
      m('今日はいいカスびより', 'Nice crumb weather today.'),
      m('まちがいを消すと、ぼくが生まれる', 'When a mistake is erased, I am born.'),
      m('ほめられると、少し丸くなる', 'When praised, I get a little rounder.'),
      m('だれかの「あ」の一部だった気がする', 'I think I was part of someone\'s letter A.'),
      m('つくえのきめは、地図ににている', 'The wood grain looks like a map.'),
      m('角はもうない', 'I have no corners anymore.'),
      m('きみの指はあったかい', 'Your finger is warm.'),
      m('ぼく、一人じゃなかった', 'I was not alone.', { stage: 2 }),
      m('山になった気分は最高', 'Being a mountain feels great.', { stage: 3 }),
      m('ころころ。ころころ。', 'Roll, roll.', { stage: 4 }),
      m('顔があるって、本当？', 'Do I really have a face?', { stage: 5 }),
      m('伝説って、何をすればいいの', 'What do legends do all day?', { stage: 6 }),
      m('うちゅうから見ても、ぼくはカス', 'Even seen from space, I am a crumb.', { stage: 7 }),
      m('えんぴつの気持ちが少しわかる', 'I understand pencils a little.', { trait: 'graphite' }),
      m('今日は何色の気分？', 'What color are you feeling today?', { trait: 'rainbow' }),
      m('はなれられない…', 'Cannot... let go...', { trait: 'sticky' }),
      m('ふわふわしている', 'I am fluffy.', { trait: 'fluffy' }),
      m('ざらざらしててごめん', 'Sorry for being scratchy.', { trait: 'gritty' }),
      m('まぶしくてごめん', 'Sorry for being so bright.', { trait: 'golden' }),
      m('アリさんがこっちを見てる', 'The ants are looking at me.', { b: 'ant' }),
      m('友だちができた', 'I made a friend.', { b: 'friend' }),
      m('おじいちゃん、名前なんていうの', 'Grandpa, what is your name?', { b: 'grandpa' }),
      m('その漢字、またまちがえてるよ', 'You got that kanji wrong again.', { b: 'drill' }),
      m('勝手に動く消しゴム、ちょっとこわい', 'An eraser that moves by itself. A little scary.', { b: 'autoeraser' }),
      m('工場の音が聞こえる', 'I can hear the factory.', { b: 'factory' }),
      m('はんこになる消しゴムもいるんだね', 'Some erasers become stamps.', { b: 'stamp' }),
      m('大きい消しゴムのかげですずしい', 'Nice and cool in the big eraser\'s shade.', { b: 'bigeraser' }),
      m('月が近い', 'The moon is close.', { b: 'moon' }),
      m('ぼくのふるさとかも', 'That might be my hometown.', { b: 'eplanet' }),
      m('昨日のぼくに会った', 'I met yesterday\'s me.', { b: 'timemachine' }),
      m('もう一人のぼく…？', 'Another me...?', { b: 'other' })
    ],
    buy: [
      m('どうぐがふえた', 'More tools!'),
      m('にぎやかになってきた', 'Getting lively.'),
      m('よろしくおねがいします', 'Nice to meet you.'),
      m('つくえがせまくなってきた', 'The desk is getting crowded.')
    ],
    evolve: [
      m('何か変わった気がする', 'Something feels different.'),
      m('見た目はそんなに変わってない', 'I do not look that different.'),
      m('進化って、こういう感じ？', 'Is this what evolving feels like?'),
      m('大げさだった', 'That was a bit much.')
    ],
    mix: [
      m('何かまざった', 'Something got mixed in.'),
      m('新しい自分', 'A new me.'),
      m('色が変わった気がする', 'I think my color changed.')
    ],
    golden: [
      m('まぶしい。でも悪くない', 'Bright. Not bad.'),
      m('キラキラしてる！', 'It is sparkling!'),
      m('今の見た？', 'Did you see that?')
    ],
    praise: [
      m('えへへ', 'Hehe.'),
      m('てれる', 'You are making me blush.'),
      m('もっと言って', 'Say it again.'),
      m('そんなに？', 'Really?'),
      m('ぼく、すごい？', 'Am I great?')
    ],
    blow: [
      m('わーーー', 'Whoaaa'),
      m('ただいま', 'I am back.'),
      m('いい景色だった', 'Nice view out there.'),
      m('なんでふいたの', 'Why did you blow me away?')
    ],
    rub: [
      m('くすぐったい', 'That tickles.'),
      m('もう少し右', 'A little to the right.'),
      m('ごりごり', 'Scrub scrub.')
    ]
  };
})(window.K = window.K || {});
