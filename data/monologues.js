// カスの ひとりごと（企画書 9章）。場面ごと
(function (K) {
  'use strict';
  K.data = K.data || {};
  function m(ja, en, when) { return { ja: ja, en: en, when: when || {} }; }
  K.data.monologues = {
    idle: [
      m('……', '...'),
      m('ぼくは なにかを けした けっか なんだ', 'I am the result of erasing something.'),
      m('つくえの はしっこが せかいの はしだと おもってた', 'I thought the edge of the desk was the edge of the world.'),
      m('まとまるって なんだろう', 'What does it mean to come together?'),
      m('けされた もじは どこへ いくのかな', 'Where do erased letters go?'),
      m('ノートの せんの うえは あるきやすい', 'The lines on the notebook are easy to walk on.'),
      m('いま、だれかが なにかを けしている', 'Right now, someone is erasing something.'),
      m('ころがりたい きぶん', 'I feel like rolling.'),
      m('えんぴつとは ふくざつな かんけい', 'It is complicated between me and the pencil.'),
      m('けしゴムの ころを おぼえてない', "I don't remember being an eraser."),
      m('ふーっと されるのは ちょっと こわい', 'Being blown away is a little scary.'),
      m('じっと しているのは とくい', 'I am good at staying still.'),
      m('きょうは いい カスびより', 'Nice crumb weather today.'),
      m('まちがいを けすと、ぼくが うまれる', 'When a mistake is erased, I am born.'),
      m('ほめられると、すこし まるくなる', 'When praised, I get a little rounder.'),
      m('だれかの 「あ」の いちぶだった きがする', 'I think I was part of someone\'s letter A.'),
      m('つくえの きめは、ちずに にている', 'The wood grain looks like a map.'),
      m('かどは もう ない', 'I have no corners anymore.'),
      m('きみの ゆびは あったかい', 'Your finger is warm.'),
      m('ぼく、ひとりじゃ なかった', 'I was not alone.', { stage: 2 }),
      m('やまに なった きぶんは さいこう', 'Being a mountain feels great.', { stage: 3 }),
      m('ころころ。ころころ。', 'Roll, roll.', { stage: 4 }),
      m('かおが あるって、ほんとう？', 'Do I really have a face?', { stage: 5 }),
      m('でんせつって、なにを すれば いいの', 'What do legends do all day?', { stage: 6 }),
      m('うちゅうから みても、ぼくは カス', 'Even seen from space, I am a crumb.', { stage: 7 }),
      m('えんぴつの きもちが すこし わかる', 'I understand pencils a little.', { trait: 'graphite' }),
      m('きょうは なにいろの きぶん？', 'What color are you feeling today?', { trait: 'rainbow' }),
      m('はなれられない…', 'Cannot... let go...', { trait: 'sticky' }),
      m('ふわふわ している', 'I am fluffy.', { trait: 'fluffy' }),
      m('ざらざらしてて ごめん', 'Sorry for being scratchy.', { trait: 'gritty' }),
      m('まぶしくて ごめん', 'Sorry for being so bright.', { trait: 'golden' }),
      m('アリさんが こっちを みてる', 'The ants are looking at me.', { b: 'ant' }),
      m('おじいちゃん、なまえ なんていうの', 'Grandpa, what is your name?', { b: 'grandpa' }),
      m('こうじょうの おとが きこえる', 'I can hear the factory.', { b: 'factory' }),
      m('つきが ちかい', 'The moon is close.', { b: 'moon' }),
      m('きのうの ぼくに あった', 'I met yesterday\'s me.', { b: 'timemachine' }),
      m('もうひとりの ぼく…？', 'Another me...?', { b: 'other' })
    ],
    buy: [
      m('なかまが ふえた', 'A new friend!'),
      m('にぎやかに なってきた', 'Getting lively.'),
      m('よろしく おねがいします', 'Nice to meet you.'),
      m('つくえが せまく なってきた', 'The desk is getting crowded.')
    ],
    evolve: [
      m('なにか かわった きがする', 'Something feels different.'),
      m('みためは そんなに かわってない', 'I do not look that different.'),
      m('しんか って、こういう かんじ？', 'Is this what evolving feels like?'),
      m('おおげさ だった', 'That was a bit much.')
    ],
    mix: [
      m('なにか まざった', 'Something got mixed in.'),
      m('あたらしい じぶん', 'A new me.'),
      m('いろが かわった きがする', 'I think my color changed.')
    ],
    golden: [
      m('まぶしい。でも わるくない', 'Bright. Not bad.'),
      m('キラキラしてる！', 'It is sparkling!'),
      m('いまの みた？', 'Did you see that?')
    ],
    praise: [
      m('えへへ', 'Hehe.'),
      m('てれる', 'You are making me blush.'),
      m('もっと いって', 'Say it again.'),
      m('そんなに？', 'Really?'),
      m('ぼく、すごい？', 'Am I great?')
    ],
    blow: [
      m('わーーー', 'Whoaaa'),
      m('ただいま', 'I am back.'),
      m('いい けしき だった', 'Nice view out there.'),
      m('なんで ふいたの', 'Why did you blow me away?')
    ],
    rub: [
      m('くすぐったい', 'That tickles.'),
      m('もうすこし みぎ', 'A little to the right.'),
      m('ごりごり', 'Scrub scrub.')
    ]
  };
})(window.K = window.K || {});
