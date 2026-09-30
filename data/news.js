// カスニュース（企画書 6-5）。when の条件を満たすものから選ばれる
// when: { b: [施設id, 数], stage: 最低だんかい, maxStage: 最高だんかい, total: この周の合計つぶ, rebirth: 転生回数, golden: ゴールデンの数,
//         trait: いまの けいとう, found: ずかんに ある種類, praise: ほめた回数, blow: ふいた回数, night: 0〜5じ }
(function (K) {
  'use strict';
  K.data = K.data || {};
  function n(when, ja, en) { return { when: when, ja: ja, en: en }; }
  K.data.news = [
    // --- いつでも ---
    n({}, 'つくえの上でカスが見つかる。落とし物としてとどけられたが、持ち主はあらわれず。', 'Crumb found on a desk and turned in as lost property. No owner has come forward.'),
    n({}, '消しゴムの角を使う人、全国でふえる。', 'More people nationwide are using the corners of their erasers.'),
    n({}, '学者「カスは消しゴムの思い出」と発表。', 'Scientist announces: "Crumbs are the memories of erasers."'),
    n({}, '今日の天気: 晴れときどきカス。', "Today's weather: sunny with occasional crumbs."),
    n({}, 'ねりけしとカス、どちらがえらいかろんそうに。', 'Debate rages: kneaded eraser or crumbs, which is better?'),
    n({}, '町で一番ていねいにこする人、インタビューをことわる。', 'Town\'s most careful rubber declines interview.'),
    n({}, 'カスをふーっとふく時は周りを見よう。', 'Remember to look around before blowing away crumbs.'),
    n({}, 'えんぴつ「消されてもまた書く」とコメント。', 'Pencil comments: "Even when erased, I will write again."'),
    n({}, '調べ: つくえのはしっこは世界のはしではなかった。', 'Study finds the edge of the desk is not the edge of the world.'),
    n({}, 'あるカス「ぼくは何かを消した結果」と語る。', 'A crumb says: "I am the result of erasing something."'),
    n({}, '消しゴムのスリーブ、なぜ青いのか。だれも知らない。', 'Why are eraser sleeves blue? Nobody knows.'),
    n({}, 'カスの集まるつくえ、なんとなく落ち着くと人気。', 'Desks with crumbs are oddly calming, people say.'),
    n({}, '放課後、教室でカスの会議。議題はない。', 'After-school crumb meeting held. There was no agenda.'),
    n({}, '消したのはまちがいではなかった。とカスは思っている。', 'The crumb believes what was erased was not a mistake.'),
    n({}, '消しゴムを落とした人、必ず転がる方向をまちがえる。', 'People who drop erasers always guess the wrong way it will roll.'),
    n({}, 'カスのひみつを知る人、「言えない」と一言。', 'Person who knows the secret of crumbs: "I can\'t say."'),
    n({}, 'ノートのけいせん、今日もまっすぐ。', 'Notebook lines are straight again today.'),
    n({}, '消しゴムで消せないものはない、と思っていた時期がある。', 'There was a time we thought an eraser could erase anything.'),
    n({}, 'けしカスの正しいすて方、初めて発表。すてなくていい。', 'Official crumb disposal guide released. You do not have to throw them away.'),
    n({}, 'えんぴつけずりのカスと消しゴムのカス、出会う。特に何も起きない。', 'Pencil shavings meet eraser crumbs. Nothing happens.'),

    // --- ゆび ---
    n({ b: ['finger', 1] }, '指、自動で動き出す。本人「楽しい」。', 'Finger starts moving on its own. Finger says: "This is fun."'),
    n({ b: ['finger', 10] }, '指が10本に。手ぶくろ業界ざわつく。', 'Ten fingers now. The glove industry is buzzing.'),
    n({ b: ['finger', 50] }, '指、50本。だれの指かは不明。', 'Fifty fingers. Whose fingers they are is unclear.'),
    n({ b: ['finger', 100] }, '指100本、いっせいにこする音が聞こえる。', 'You can hear a hundred fingers rubbing at once.'),

    // --- アリさん ---
    n({ b: ['ant', 1] }, 'アリの行列、なぜかカスの方へ。', 'Line of ants heads toward the crumbs for some reason.'),
    n({ b: ['ant', 5] }, 'アリさん「さとうよりカスが好き」と発言。', 'Ant states: "I like crumbs more than sugar."'),
    n({ b: ['ant', 25] }, 'アリの行列、つくえを一周。', 'The ant line now circles the whole desk.'),
    n({ b: ['ant', 100] }, 'アリさん100ぴき、小さな長ぐつをはいている。', 'A hundred ants, all wearing tiny boots.'),

    // --- ともだち ---
    n({ b: ['friend', 1] }, 'となりの席の友だち、だまって消しゴムをかしてくれる。', 'The friend in the next seat quietly lends you an eraser.'),
    n({ b: ['friend', 10] }, '友だちの友だちも来た。つくえが足りない。', 'Friends of friends came too. Not enough desks.'),
    n({ b: ['friend', 50] }, 'クラス全員友だちに。カスのせいで。', 'The whole class is friends now. Thanks to crumbs.'),

    // --- おじいちゃん ---
    n({ b: ['grandpa', 1] }, 'なぞのおじいちゃん、「昔はよかった」とカスをこすり続ける。', 'Mysterious grandpa keeps rubbing crumbs, saying "the old days were better."'),
    n({ b: ['grandpa', 5] }, 'おじいちゃんたち、カスの昔話でもり上がる。', 'Grandpas bond over old crumb stories.'),
    n({ b: ['grandpa', 25] }, 'おじいちゃん「わしがわかいころは、カスはもっと大きかった」。', 'Grandpa: "When I was young, crumbs were bigger."'),
    n({ b: ['grandpa', 50] }, 'おじいちゃんたち、だれも名前を知らない。でもやさしい。', 'Nobody knows the grandpas\' names. But they are kind.'),

    // --- かんじドリル ---
    n({ b: ['drill', 1] }, '漢字ドリル、1ページ目から消しゴムのあとだらけ。', 'Kanji drill covered in eraser marks from page one.'),
    n({ b: ['drill', 10] }, '「ほね」の漢字、今日もまちがえられる。', 'The kanji for "bone" gets written wrong again today.'),
    n({ b: ['drill', 50] }, '漢字ドリル、うすくなりすぎて向こうが見える。', 'Kanji drill pages are now see-through.'),

    // --- きょうしつ ---
    n({ b: ['classroom', 1] }, 'テストの後、教室でカスが大量発生。', 'Large amount of crumbs found in a classroom after a test.'),
    n({ b: ['classroom', 10] }, '先生「消しゴムはていねいに」。生徒「はい」。', 'Teacher: "Erase carefully." Students: "Yes."'),
    n({ b: ['classroom', 50] }, '教室、全部カスのためにある気がしてきた。', 'It feels like every classroom exists for the crumbs.'),

    // --- けしゴムぶ ---
    n({ b: ['club', 1] }, '消しゴム部、大会でゆうしょう。種目は不明。', 'Eraser Club wins a tournament. The event is unknown.'),
    n({ b: ['club', 10] }, '消しゴム部、部員がふえすぎて部室がカスだらけ。', 'Eraser Club has too many members. The clubroom is full of crumbs.'),
    n({ b: ['club', 50] }, '消しゴム部OB、今でも毎日消している。', 'Eraser Club alumni still erase every day.'),

    // --- ぜんじどう けしゴム ---
    n({ b: ['autoeraser', 1] }, '全自動消しゴム、何も書いていないところも消す。', 'Auto eraser also erases where nothing was written.'),
    n({ b: ['autoeraser', 10] }, '全自動消しゴム、夜中に勝手にこすっていた。', 'Auto erasers were rubbing on their own in the middle of the night.'),
    n({ b: ['autoeraser', 50] }, '全自動消しゴム、電池を勝手に買いに行く。', 'Auto erasers now go buy their own batteries.'),

    // --- こうじょう ---
    n({ b: ['factory', 1] }, '消しゴム工場、何を消しているのか社長も知らない。', 'Eraser factory boss does not know what the factory is erasing.'),
    n({ b: ['factory', 10] }, '工場のえんとつから、ほんのりカスのにおい。', 'A faint crumb smell from the factory chimney.'),
    n({ b: ['factory', 50] }, '工場、ついに自分のかげも消し始める。', 'Factory begins erasing its own shadow.'),

    // --- けしゴムはんこ ---
    n({ b: ['stamp', 1] }, '消しゴムはんこ、ほったらカスの方が多かった。', 'Carved an eraser stamp. Made more crumbs than stamp.'),
    n({ b: ['stamp', 10] }, '消しゴムはんこのもよう、なぜか全部カス。', 'Every eraser stamp design is a crumb, for some reason.'),

    // --- ロードローラー ---
    n({ b: ['roller', 1] }, 'つくえの上にロードローラー。だれも理由を聞かない。', 'A road roller on the desk. Nobody asks why.'),
    n({ b: ['roller', 10] }, 'ロードローラー、カスをぺったんこにしてまたまるめる。', 'Road rollers flatten crumbs, then roll them back up.'),
    n({ b: ['roller', 50] }, 'ロードローラーのじゅうたい、つくえの真ん中で発生。', 'Road roller traffic jam in the middle of the desk.'),

    // --- ちょうおおがた けしゴム ---
    n({ b: ['bigeraser', 1] }, 'ちょうおおがた消しゴム、教室のドアを通らない。', 'Super-size eraser does not fit through the classroom door.'),
    n({ b: ['bigeraser', 10] }, 'ちょうおおがた消しゴムで校庭の線を消してしまう。', 'Super-size eraser accidentally erases the lines on the school field.'),

    // --- つき ---
    n({ b: ['moon', 1] }, '月、少し近くなる。しおの満ち引きにえいきょう。', 'The moon moves a little closer. Tides are affected.'),
    n({ b: ['moon', 5] }, '月のうさぎ、もちをやめてカスをつく。', 'Moon rabbit stops pounding rice cakes, pounds crumbs instead.'),
    n({ b: ['moon', 25] }, '夜空に月がたくさん。ロマンチックではない。', 'Many moons in the night sky. Not romantic.'),

    // --- タイムマシン ---
    n({ b: ['timemachine', 1] }, 'タイムマシン、なぜかいつも5分前にしか行けない。', 'The time machine can only ever go back five minutes.'),
    n({ b: ['timemachine', 10] }, '未来の自分から手紙。「カスは大切に」。', 'Letter from future self: "Take care of the crumbs."'),
    n({ b: ['timemachine', 50] }, '歴史の教科書、けしカスのページがふえる。', 'History textbooks add more pages about crumbs.'),

    // --- パラレルつくえ ---
    n({ b: ['paralleldesk', 1] }, '別の世界のつくえ、こちらとほぼ同じ。カスの色だけちがう。', 'Desk from another world is almost the same. Only the crumb color differs.'),
    n({ b: ['paralleldesk', 10] }, '別の世界のつくえでは、カスが人をこすっているらしい。', 'On the desk in another world, the crumbs rub the people.'),

    // --- けしゴムぼし ---
    n({ b: ['eplanet', 1] }, '新しい星発見。全部消しゴムだった。', 'New planet discovered. It is all eraser.'),
    n({ b: ['eplanet', 10] }, '消しゴム星のカス、流れ星になってふってくる。', 'Crumbs from the Eraser Planet fall as shooting stars.'),

    // --- うちゅうの いし ---
    n({ b: ['universe', 1] }, 'うちゅう、何かを言おうとしてやめる。', 'The universe starts to say something, then stops.'),
    n({ b: ['universe', 10] }, 'うちゅうの意思、「……」と発表。', 'The Will of the Universe announces: "..."'),

    // --- もうひとりの カス ---
    n({ b: ['other', 1] }, 'もう一人のカス、「やあ」。こちらも「やあ」。', 'The Other Crumb: "Hey." Us: "Hey."'),
    n({ b: ['other', 10] }, 'もう一人のカスがたくさん。どれが本物かもうわからない。', 'So many Other Crumbs. No one can tell which is real.'),

    // --- だんかい ---
    n({ stage: 2 }, 'カス、少しふえる。家族がふえたみたいでうれしい。', 'Crumbs increase slightly. Feels like the family grew.'),
    n({ stage: 3 }, 'カスの山、つくえの上にかくにん。登山家が注目。', 'Crumb mountain confirmed on desk. Mountain climbers take interest.'),
    n({ stage: 4 }, 'カス、丸くなる。ねりけしとまちがわれるじけん発生。', 'Crumb rolls up. Mistaken for kneaded eraser.'),
    n({ stage: 5 }, 'カスに顔が見えると話題に。せんもんか「気のせい」。', 'People say the crumb has a face. Experts: "Your imagination."'),
    n({ stage: 5 }, 'カスと目が合った気がする、という相談ふえる。', 'More reports of feeling like the crumb made eye contact.'),
    n({ stage: 6 }, '伝説のカス、えいが化が注目。しゅえんはカス。', 'Legendary crumb gets a movie deal. The crumb stars.'),
    n({ stage: 7 }, 'うちゅう、カスでできていたことがはんめい。', 'The universe turns out to be made of crumbs.'),
    n({ stage: 7 }, '星空の星のいくつかはカスだった、と発表。', 'Some stars in the sky were crumbs, scientists announce.'),

    // --- すうじ ---
    n({ total: 1e6 }, 'つぶ1Mこ、とっぱ。数えた人はねむそう。', 'One million crumbs reached. The counter looks sleepy.'),
    n({ total: 1e9 }, 'つぶ1Bこ。つくえが少ししずんだ。', 'One billion crumbs. The desk sank a little.'),
    n({ total: 1e12 }, 'つぶが多すぎて、消しゴムにもどりたくなってきた気がする。', 'So many crumbs it almost feels time to become an eraser again.'),

    // --- ゴールデン ---
    n({ golden: 1 }, '金色のカス、もくげきじょうほう。「まぶしかった」。', 'Golden crumb sighting reported. "It was bright."'),
    n({ guests: 3 }, 'つくえにいろんな消しゴムが遊びに来る。筆箱はからっぽ。', 'All kinds of erasers visit the desk. The pencil case is empty.'),
    n({ guests: 20 }, 'かどけしの角、全部で28こ。数えた人がいる。', 'Someone counted the corners on a corner eraser: 28.'),
    n({ golden: 7 }, 'ゴールデン消しゴム、ラッキーアイテムににんてい。', 'Golden Erasers officially named a lucky item.'),

    // --- 転生 ---
    n({ rebirth: 1 }, '消しゴムにもどったカス、「なんだかなつかしい」。', 'Crumb that returned to eraser form: "Feels familiar."'),
    n({ rebirth: 1 }, '消しゴムのかけら、ポケットでひっそり光る。', 'Eraser shards glow quietly in a pocket.'),
    n({ rebirth: 5 }, '何度も生まれ変わるカス、本人「なれた」。', 'Crumb reborn many times says: "I am used to it."'),

    // --- いつでも（ついか） ---
    n({}, '消しゴムのにおいが好きな人、ひそかに多い。', 'Secretly, many people love the smell of erasers.'),
    n({}, 'ある小学生「けしカスは友だち」。先生「そうか」。', 'A student says: "Crumbs are my friends." Teacher: "I see."'),
    n({}, '消しゴムのカバーを外す人と外さない人、半分ずつ。', 'Half of people remove the eraser sleeve. Half do not.'),
    n({}, 'まちがえた文字、消される前に「ありがとう」と言う。', 'A wrong letter says "thank you" before being erased.'),
    n({}, 'けしカスを集めるしゅみ、人に言うと少しこまられる。', 'Collecting crumbs as a hobby makes people a little confused.'),
    n({}, 'つくえの引き出しのおく、なぞのカスが見つかる。いつのものか不明。', 'Mystery crumb found at the back of a desk drawer. Age unknown.'),
    n({}, 'えんぴつと消しゴム、今日もいっしょに帰る。', 'Pencil and eraser walk home together again today.'),
    n({}, 'シャープペンのしんが折れた。カスは何も言わなかった。', 'A pencil lead snapped. The crumb said nothing.'),
    n({}, '消しゴムを最後まで使い切った人、ひょうしょうされる。', 'Person who used an eraser all the way to the end receives an award.'),
    n({}, 'カスの正しい読み方、「かす」で合っていた。', 'The correct way to read "crumb" turns out to be "crumb."'),
    n({}, '人々、つくえをふく前に少しまようようになる。', 'People now hesitate a little before wiping their desks.'),
    n({}, '画用紙の上のカス、「ここは広い」。', 'Crumb on drawing paper: "It is so spacious here."'),
    n({}, '消しゴムを二つにわった人、ちょっとこうかい。', 'Person who broke an eraser in half feels a little regret.'),
    n({}, 'よくあさ、つくえのカスが少し動いていた気がする。', 'The next morning, the crumbs seemed to have moved a little.'),

    // --- けいとう ---
    n({ trait: 'graphite' }, 'えんぴつのこな入りのカス、少しかしこそうに見える。', 'Crumb with pencil dust looks a little smarter.'),
    n({ trait: 'rainbow' }, 'にじ色のカス、ぬりえ業界が注目。', 'Rainbow crumb draws attention from the coloring book industry.'),
    n({ trait: 'sticky' }, 'ねばねばのカス、つくえからはなれないとさわぎに。', 'Sticky crumb will not leave the desk. Commotion follows.'),
    n({ trait: 'fluffy' }, 'もふもふのカス、ねことまちがえられる。', 'Fluffy crumb mistaken for a cat.'),
    n({ trait: 'gritty' }, 'ざらざらのカス、「ボールペンも消せる」と自信。', 'Gritty crumb claims it can erase ink too.'),
    n({ trait: 'golden' }, '金色のカス、ほうせき屋さんが「うちでは買えない」。', 'Jeweler says of the golden crumb: "We can\'t buy that."'),

    // --- とくべつな しんか ---
    n({ found: 'king' }, 'じしょう王様のカス、国民はまだいない。', 'Self-proclaimed crumb king still has no citizens.'),
    n({ found: 'wander' }, '旅するカスから絵はがき。「つくえの向こうはゆかでした」。', 'Postcard from the wandering crumb: "Past the desk was the floor."'),
    n({ found: 'zen' }, 'さとったカス、「何もしない」を3時間続ける。', 'Enlightened crumb continues doing nothing for three hours.'),
    n({ found: 'toasty' }, 'あつあつカス、冬の間だけ人気者。', 'Toasty crumb is popular only in winter.'),
    n({ found: 'night' }, '夜ふかしカス、朝起きられずちこく。', 'Night owl crumb oversleeps and is late.'),
    n({ found: 'lucky' }, 'ラッキーカス、くじ引きでティッシュを当てる。', 'Lucky crumb wins a box of tissues in a raffle.'),
    n({ found: 'reborn' }, '何度も生まれ変わったカス、「前の前のぼくによろしく」。', 'Reborn crumb: "Say hi to the me before the me before."'),

    // --- ほめる・ふく ---
    n({ praise: 10 }, 'ほめられたカス、少し丸くなったというほうこく。', 'Reports say the praised crumb got a little rounder.'),
    n({ praise: 50 }, 'カス、ほめられすぎて調子に乗る。', 'The crumb has been praised too much and is getting cocky.'),
    n({ blow: 5 }, 'ふーっとふかれたカス、となりのつくえで発見。', 'Blown-away crumb found on the next desk over.'),
    n({ blow: 20 }, 'カス、風の読み方を覚える。', 'The crumb has learned to read the wind.'),

    // --- よる ---
    n({ night: true }, '深夜、つくえのカスたちがひそひそ話している。', 'Late at night, the crumbs on the desk are whispering.'),
    n({ night: true }, 'よい子はもうねる時間です。カスもねます。', 'It is time for good kids to sleep. The crumbs too.'),

    // --- どうぐ（ついか） ---
    n({ b: ['finger', 25] }, '指たち、じゃんけんでこする順番を決める。ずっとあいこ。', 'The fingers play rock-paper-scissors to decide who rubs next. Always a tie.'),
    n({ b: ['grandpa', 10] }, 'おじいちゃんたち、あめをくれる。なぜかポケットにいつもある。', 'The grandpas hand out candy. They always have some in their pockets.'),
    n({ b: ['classroom', 25] }, '教室の黒板、「カス」とだけ書いてある。', 'The blackboard in every classroom just says "crumb."'),
    n({ b: ['roller', 5] }, 'ロードローラーの運転手、「細かいことは気にしない」。', 'Road roller driver: "I don\'t sweat the small stuff."'),
    n({ b: ['moon', 10] }, '月がふえすぎて、夜が少し明るい。', 'Too many moons. The night is a little brighter.'),
    n({ b: ['universe', 5] }, 'うちゅうの意思、少しだけ笑った気がする。', 'The Will of the Universe seemed to smile a little.'),
    n({ b: ['other', 5] }, 'もう一人のカスとこちらのカス、どちらも「こっちが本物」としゅちょう。', 'The Other Crumb and our crumb both say they are the real one.')
  ];
})(window.K = window.K || {});
