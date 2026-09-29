// カスニュース（企画書 6-5）。when の条件を満たすものから選ばれる
// when: { b: [施設id, 数], stage: 最低だんかい, maxStage: 最高だんかい, total: この周の合計つぶ, rebirth: 転生回数, golden: ゴールデンの数,
//         trait: いまの けいとう, found: ずかんに ある種類, praise: ほめた回数, blow: ふいた回数, night: 0〜5じ }
(function (K) {
  'use strict';
  K.data = K.data || {};
  function n(when, ja, en) { return { when: when, ja: ja, en: en }; }
  K.data.news = [
    // --- いつでも ---
    n({}, 'つくえの うえで カスが みつかる。けいさつは「ふつうの カス」と はっぴょう。', 'Crumb found on a desk. Police say it is "just a normal crumb."'),
    n({}, 'けしゴムの かどを つかう ひと、ぜんこくで ふえる。', 'More people nationwide are using the corners of their erasers.'),
    n({}, 'がくしゃ「カスは けしゴムの おもいで」と はっぴょう。', 'Scientist announces: "Crumbs are the memories of erasers."'),
    n({}, 'きょうの てんき: はれ ときどき カス。', "Today's weather: sunny with occasional crumbs."),
    n({}, 'ねりけし と カス、どちらが えらいか ろんそうに。', 'Debate rages: kneaded eraser or crumbs, which is better?'),
    n({}, 'まちで いちばん ていねいに こする ひと、インタビューを ことわる。', 'Town\'s most careful rubber declines interview.'),
    n({}, 'カスを ふーっと ふく ときは まわりを みよう。', 'Remember to look around before blowing away crumbs.'),
    n({}, 'えんぴつ「けされても また かく」と コメント。', 'Pencil comments: "Even when erased, I will write again."'),
    n({}, 'しらべ: つくえの はしっこは せかいの はしでは なかった。', 'Study finds the edge of the desk is not the edge of the world.'),
    n({}, 'ある カス「ぼくは なにかを けした けっか」と かたる。', 'A crumb says: "I am the result of erasing something."'),
    n({}, 'けしゴムの スリーブ、なぜ あおいのか。だれも しらない。', 'Why are eraser sleeves blue? Nobody knows.'),
    n({}, 'カスの あつまる つくえ、なんとなく おちつくと にんき。', 'Desks with crumbs are oddly calming, people say.'),
    n({}, 'ほうかご、きょうしつで カスの かいぎ。ぎだいは ない。', 'After-school crumb meeting held. There was no agenda.'),
    n({}, 'けしたのは まちがいでは なかった。と カスは おもっている。', 'The crumb believes what was erased was not a mistake.'),
    n({}, 'けしゴムを おとした ひと、かならず ころがる ほうこうを まちがえる。', 'People who drop erasers always guess the wrong way it will roll.'),
    n({}, 'カスの ひみつを しる ひと、「いえない」と ひとこと。', 'Person who knows the secret of crumbs: "I can\'t say."'),
    n({}, 'ノートの けいせん、きょうも まっすぐ。', 'Notebook lines are straight again today.'),
    n({}, 'けしゴムで けせない ものは ない、と おもっていた じきが ある。', 'There was a time we thought an eraser could erase anything.'),
    n({}, 'けしカスの ただしい すてかた、はじめて はっぴょう。すてなくて いい。', 'Official crumb disposal guide released. You do not have to throw them away.'),
    n({}, 'えんぴつけずりの カスと けしゴムの カス、であう。とくに なにも おきない。', 'Pencil shavings meet eraser crumbs. Nothing happens.'),

    // --- ゆび ---
    n({ b: ['finger', 1] }, 'ゆび、じどうで うごきだす。ほんにん「たのしい」。', 'Finger starts moving on its own. Finger says: "This is fun."'),
    n({ b: ['finger', 10] }, 'ゆびが 10ぽんに。てぶくろ ぎょうかい ざわつく。', 'Ten fingers now. The glove industry is buzzing.'),
    n({ b: ['finger', 50] }, 'ゆび、50ぽん。だれの ゆびかは ふめい。', 'Fifty fingers. Whose fingers they are is unclear.'),
    n({ b: ['finger', 100] }, 'ゆび 100ぽん、いっせいに こする おとが きこえる。', 'You can hear a hundred fingers rubbing at once.'),

    // --- アリさん ---
    n({ b: ['ant', 1] }, 'アリの ぎょうれつ、なぜか カスの ほうへ。', 'Line of ants heads toward the crumbs for some reason.'),
    n({ b: ['ant', 5] }, 'アリさん「さとうより カスが すき」と はつげん。', 'Ant states: "I like crumbs more than sugar."'),
    n({ b: ['ant', 25] }, 'アリの ぎょうれつ、つくえを いっしゅう。', 'The ant line now circles the whole desk.'),
    n({ b: ['ant', 100] }, 'アリさん 100ぴき、ちいさな ながぐつを はいて いる。', 'A hundred ants, all wearing tiny boots.'),

    // --- おじいちゃん ---
    n({ b: ['grandpa', 1] }, 'なぞの おじいちゃん、「むかしは よかった」と カスを こすりつづける。', 'Mysterious grandpa keeps rubbing crumbs, saying "the old days were better."'),
    n({ b: ['grandpa', 5] }, 'おじいちゃんたち、カスの むかしばなしで もりあがる。', 'Grandpas bond over old crumb stories.'),
    n({ b: ['grandpa', 25] }, 'おじいちゃん「わしが わかい ころは、カスは もっと おおきかった」。', 'Grandpa: "When I was young, crumbs were bigger."'),
    n({ b: ['grandpa', 50] }, 'おじいちゃんたち、だれも なまえを しらない。でも やさしい。', 'Nobody knows the grandpas\' names. But they are kind.'),

    // --- きょうしつ ---
    n({ b: ['classroom', 1] }, 'テストの あと、きょうしつで カスが たいりょう はっせい。', 'Large amount of crumbs found in a classroom after a test.'),
    n({ b: ['classroom', 10] }, 'せんせい「けしゴムは ていねいに」。せいと「はい」。', 'Teacher: "Erase carefully." Students: "Yes."'),
    n({ b: ['classroom', 50] }, 'きょうしつ、ぜんぶ カスの ために ある きが してきた。', 'It feels like every classroom exists for the crumbs.'),

    // --- けしゴムぶ ---
    n({ b: ['club', 1] }, 'けしゴムぶ、たいかいで ゆうしょう。しゅもくは ふめい。', 'Eraser Club wins a tournament. The event is unknown.'),
    n({ b: ['club', 10] }, 'けしゴムぶ、ぶいんが ふえすぎて ぶしつが カスだらけ。', 'Eraser Club has too many members. The clubroom is full of crumbs.'),
    n({ b: ['club', 50] }, 'けしゴムぶ OB、いまでも まいにち けしている。', 'Eraser Club alumni still erase every day.'),

    // --- こうじょう ---
    n({ b: ['factory', 1] }, 'けしゴムこうじょう、なにを けしているのか しゃちょうも しらない。', 'Eraser factory boss does not know what the factory is erasing.'),
    n({ b: ['factory', 10] }, 'こうじょうの えんとつから、ほんのり カスの におい。', 'A faint crumb smell from the factory chimney.'),
    n({ b: ['factory', 50] }, 'こうじょう、ついに じぶんの かげも けしはじめる。', 'Factory begins erasing its own shadow.'),

    // --- ロードローラー ---
    n({ b: ['roller', 1] }, 'つくえの うえに ロードローラー。だれも りゆうを きかない。', 'A road roller on the desk. Nobody asks why.'),
    n({ b: ['roller', 10] }, 'ロードローラー、カスを ぺったんこに して また まるめる。', 'Road rollers flatten crumbs, then roll them back up.'),
    n({ b: ['roller', 50] }, 'ロードローラーの じゅうたい、つくえの まんなかで はっせい。', 'Road roller traffic jam in the middle of the desk.'),

    // --- つき ---
    n({ b: ['moon', 1] }, 'つき、すこし ちかくなる。しおの みちひきに えいきょう。', 'The moon moves a little closer. Tides are affected.'),
    n({ b: ['moon', 5] }, 'つきの うさぎ、もちを やめて カスを つく。', 'Moon rabbit stops pounding rice cakes, pounds crumbs instead.'),
    n({ b: ['moon', 25] }, 'よぞらに つきが たくさん。ロマンチックでは ない。', 'Many moons in the night sky. Not romantic.'),

    // --- タイムマシン ---
    n({ b: ['timemachine', 1] }, 'タイムマシン、きのうの カスを もってくる。きのうの ひと こまる。', 'Time machine brings yesterday\'s crumbs. Yesterday\'s people are confused.'),
    n({ b: ['timemachine', 10] }, 'みらいの じぶんから てがみ。「カスは たいせつに」。', 'Letter from future self: "Take care of the crumbs."'),
    n({ b: ['timemachine', 50] }, 'れきしの きょうかしょ、けしカスの ページが ふえる。', 'History textbooks add more pages about crumbs.'),

    // --- パラレルつくえ ---
    n({ b: ['paralleldesk', 1] }, 'べつの せかいの つくえ、こちらと ほぼ おなじ。カスの いろだけ ちがう。', 'Desk from another world is almost the same. Only the crumb color differs.'),
    n({ b: ['paralleldesk', 10] }, 'べつの せかいの きみも、いま こすっている。', 'The you from another world is rubbing right now too.'),

    // --- うちゅうの いし ---
    n({ b: ['universe', 1] }, 'うちゅう、なにかを いおうとして やめる。', 'The universe starts to say something, then stops.'),
    n({ b: ['universe', 10] }, 'うちゅうの いし、「……」と はっぴょう。', 'The Will of the Universe announces: "..."'),

    // --- もうひとりの カス ---
    n({ b: ['other', 1] }, 'もうひとりの カス、「やあ」。こちらも「やあ」。', 'The Other Crumb: "Hey." Us: "Hey."'),
    n({ b: ['other', 10] }, 'もうひとりの カスが たくさん。どれが ほんものか もう わからない。', 'So many Other Crumbs. No one can tell which is real.'),

    // --- だんかい ---
    n({ stage: 2 }, 'カス、すこし ふえる。かぞくが ふえた みたいで うれしい。', 'Crumbs increase slightly. Feels like the family grew.'),
    n({ stage: 3 }, 'カスの やま、つくえの うえに かくにん。とざんか が ちゅうもく。', 'Crumb mountain confirmed on desk. Mountain climbers take interest.'),
    n({ stage: 4 }, 'カス、まるくなる。ねりけしと まちがわれる じけん はっせい。', 'Crumb rolls up. Mistaken for kneaded eraser.'),
    n({ stage: 5 }, 'カスに かおが みえると わだいに。せんもんか「きのせい」。', 'People say the crumb has a face. Experts: "Your imagination."'),
    n({ stage: 5 }, 'カスと めが あった きが する、という そうだん ふえる。', 'More reports of feeling like the crumb made eye contact.'),
    n({ stage: 6 }, 'でんせつの カス、えいがかが ちゅうもく。しゅえんは カス。', 'Legendary crumb gets a movie deal. The crumb stars.'),
    n({ stage: 7 }, 'うちゅう、カスで できていた ことが はんめい。', 'The universe turns out to be made of crumbs.'),
    n({ stage: 7 }, 'ほしぞらの ほしの いくつかは カスだった、と はっぴょう。', 'Some stars in the sky were crumbs, scientists announce.'),

    // --- すうじ ---
    n({ total: 1e6 }, 'つぶ 1M こ とっぱ。かぞえた ひとは ねむそう。', 'One million crumbs reached. The counter looks sleepy.'),
    n({ total: 1e9 }, 'つぶ 1B こ。つくえが すこし しずんだ。', 'One billion crumbs. The desk sank a little.'),
    n({ total: 1e12 }, 'つぶが おおすぎて、けしゴムに もどりたく なってきた きが する。', 'So many crumbs it almost feels time to become an eraser again.'),

    // --- ゴールデン ---
    n({ golden: 1 }, 'きんいろの カス もくげき じょうほう。「まぶしかった」。', 'Golden crumb sighting reported. "It was bright."'),
    n({ golden: 7 }, 'ゴールデンカス、ラッキーアイテムに にんてい。', 'Golden crumbs officially named a lucky item.'),

    // --- 転生 ---
    n({ rebirth: 1 }, 'けしゴムに もどった カス、「なんだか なつかしい」。', 'Crumb that returned to eraser form: "Feels familiar."'),
    n({ rebirth: 1 }, 'けしゴムの かけら、ポケットで ひっそり ひかる。', 'Eraser shards glow quietly in a pocket.'),
    n({ rebirth: 5 }, 'なんども うまれかわる カス、ほんにん「なれた」。', 'Crumb reborn many times says: "I am used to it."'),

    // --- いつでも（ついか） ---
    n({}, 'けしゴムの においが すきな ひと、ひそかに おおい。', 'Secretly, many people love the smell of erasers.'),
    n({}, 'ある しょうがくせい「けしカスは ともだち」。せんせい「そうか」。', 'A student says: "Crumbs are my friends." Teacher: "I see."'),
    n({}, 'けしゴムの カバーを はずす ひと と はずさない ひと、はんぶんずつ。', 'Half of people remove the eraser sleeve. Half do not.'),
    n({}, 'まちがえた もじ、けされる まえに「ありがとう」と いう。', 'A wrong letter says "thank you" before being erased.'),
    n({}, 'けしカスを あつめる しゅみ、ひとに いうと すこし こまられる。', 'Collecting crumbs as a hobby makes people a little confused.'),
    n({}, 'つくえの ひきだしの おく、なぞの カスが みつかる。いつのものか ふめい。', 'Mystery crumb found at the back of a desk drawer. Age unknown.'),
    n({}, 'えんぴつ と けしゴム、きょうも いっしょに かえる。', 'Pencil and eraser walk home together again today.'),
    n({}, 'シャープペンの しんが おれた。カスは なにも いわなかった。', 'A pencil lead snapped. The crumb said nothing.'),
    n({}, 'けしゴムを さいごまで つかいきった ひと、ひょうしょう される。', 'Person who used an eraser all the way to the end receives an award.'),
    n({}, 'カスの ただしい よみかた、「かす」で あっていた。', 'The correct way to read "crumb" turns out to be "crumb."'),
    n({}, 'ひとびと、つくえを ふく まえに すこし まよう ように なる。', 'People now hesitate a little before wiping their desks.'),
    n({}, 'がようし の うえの カス、「ここは ひろい」。', 'Crumb on drawing paper: "It is so spacious here."'),
    n({}, 'けしゴムを ふたつに わった ひと、ちょっと こうかい。', 'Person who broke an eraser in half feels a little regret.'),
    n({}, 'よくあさ、つくえの カスが すこし うごいていた きがする。', 'The next morning, the crumbs seemed to have moved a little.'),

    // --- けいとう ---
    n({ trait: 'graphite' }, 'えんぴつの こな いりの カス、すこし かしこそうに みえる。', 'Crumb with pencil dust looks a little smarter.'),
    n({ trait: 'rainbow' }, 'にじいろの カス、ぬりえ ぎょうかいが ちゅうもく。', 'Rainbow crumb draws attention from the coloring book industry.'),
    n({ trait: 'sticky' }, 'ねばねばの カス、つくえから はなれないと さわぎに。', 'Sticky crumb will not leave the desk. Commotion follows.'),
    n({ trait: 'fluffy' }, 'もふもふの カス、ねこと まちがえられる。', 'Fluffy crumb mistaken for a cat.'),
    n({ trait: 'gritty' }, 'ざらざらの カス、「ボールペンも けせる」と じしん。', 'Gritty crumb claims it can erase ink too.'),
    n({ trait: 'golden' }, 'きんいろの カス、ほうせきやさんが「うちでは かえない」。', 'Jeweler says of the golden crumb: "We can\'t buy that."'),

    // --- とくべつな しんか ---
    n({ found: 'king' }, 'じしょう おうさまの カス、こくみんは まだ いない。', 'Self-proclaimed crumb king still has no citizens.'),
    n({ found: 'wander' }, 'たびする カスから えはがき。「つくえの むこうは ゆかでした」。', 'Postcard from the wandering crumb: "Past the desk was the floor."'),
    n({ found: 'zen' }, 'さとった カス、「なにも しない」を 3じかん つづける。', 'Enlightened crumb continues doing nothing for three hours.'),
    n({ found: 'toasty' }, 'あつあつ カス、ふゆの あいだ だけ にんきもの。', 'Toasty crumb is popular only in winter.'),
    n({ found: 'night' }, 'よふかし カス、あさ おきられず ちこく。', 'Night owl crumb oversleeps and is late.'),
    n({ found: 'lucky' }, 'ラッキー カス、くじびきで ティッシュを あてる。', 'Lucky crumb wins a box of tissues in a raffle.'),
    n({ found: 'reborn' }, 'なんども うまれかわった カス、「まえの まえの ぼくに よろしく」。', 'Reborn crumb: "Say hi to the me before the me before."'),

    // --- ほめる・ふく ---
    n({ praise: 10 }, 'ほめられた カス、すこし まるく なった という ほうこく。', 'Reports say the praised crumb got a little rounder.'),
    n({ praise: 50 }, 'カス、ほめられすぎて ちょうしに のる。', 'The crumb has been praised too much and is getting cocky.'),
    n({ blow: 5 }, 'ふーっと ふかれた カス、となりの つくえで はっけん。', 'Blown-away crumb found on the next desk over.'),
    n({ blow: 20 }, 'カス、かぜの よみかたを おぼえる。', 'The crumb has learned to read the wind.'),

    // --- よる ---
    n({ night: true }, 'しんや、つくえの カスたちが ひそひそ はなしている。', 'Late at night, the crumbs on the desk are whispering.'),
    n({ night: true }, 'よいこは もう ねる じかん です。カスも ねます。', 'It is time for good kids to sleep. The crumbs too.'),

    // --- なかま（ついか） ---
    n({ b: ['finger', 25] }, 'ゆび たち、ささやかな ストライキ。3びょうで おわる。', 'The fingers go on a tiny strike. It lasts three seconds.'),
    n({ b: ['grandpa', 10] }, 'おじいちゃん たち、あめを くれる。なぜか ポケットに いつも ある。', 'The grandpas hand out candy. They always have some in their pockets.'),
    n({ b: ['classroom', 25] }, 'きょうしつの こくばん、「カス」と だけ かいてある。', 'The blackboard in every classroom just says "crumb."'),
    n({ b: ['roller', 5] }, 'ロードローラーの うんてんしゅ、「こまかい ことは きにしない」。', 'Road roller driver: "I don\'t sweat the small stuff."'),
    n({ b: ['moon', 10] }, 'つきが ふえすぎて、よるが すこし あかるい。', 'Too many moons. The night is a little brighter.'),
    n({ b: ['universe', 5] }, 'うちゅうの いし、すこし だけ わらった きがする。', 'The Will of the Universe seemed to smile a little.'),
    n({ b: ['other', 5] }, 'もうひとりの カスと こちらの カス、どちらも「こっちが ほんもの」と しゅちょう。', 'The Other Crumb and our crumb both say they are the real one.')
  ];
})(window.K = window.K || {});
