// ゲストけしゴム。ときどき つくえに やってきて、タップすると いつもの けしゴムと もちかえる
// stage: その STAGE の カスを みつけたら くるように なる（0 = さいしょから）
// ゴールデン いがいは 使うほど ★が 上がって 強くなる（js/guest.js の GS.STAR）
(function (K) {
  'use strict';
  K.data = K.data || {};
  K.data.guests = [
    { id: 'golden', stage: 0,
      name: { ja: 'ゴールデン消しゴム', en: 'Golden Eraser' },
      line: { ja: 'ぴかぴか。消すのがもったいない', en: 'So shiny. Too nice to use.' } },
    { id: 'kadokeshi', stage: 1,
      name: { ja: 'かどけし', en: 'Corner Eraser' },
      line: { ja: 'いつも新しい角で消せる', en: 'Always a fresh corner to erase with.' } },
    { id: 'sand', stage: 2,
      name: { ja: 'すなけし', en: 'Sand Eraser' },
      line: { ja: 'ボールペンも消せる…かも', en: 'Might even erase ballpoint pen...' } },
    { id: 'neri', stage: 3,
      name: { ja: 'ねりけし', en: 'Kneaded Eraser' },
      line: { ja: 'ちぎってもちぎってもまとまる', en: 'Tear it apart, it comes back together.' } },
    { id: 'kaori', stage: 4,
      name: { ja: '香りつき消しゴム', en: 'Scented Eraser' },
      line: { ja: 'いちごのにおい', en: 'Smells like strawberries.' } },
    { id: 'rocket', stage: 5,
      name: { ja: 'ロケット消しゴム', en: 'Rocket Eraser' },
      line: { ja: 'へったら後ろから次が出てくる', en: 'When one wears down, the next pops out.' } },
    { id: 'dendo', stage: 6,
      name: { ja: '電動消しゴム', en: 'Electric Eraser' },
      line: { ja: 'スイッチを入れると、ウィーンと回る', en: 'Flip the switch and it goes whirrrr.' } },
    { id: 'jumbo', stage: 7,
      name: { ja: 'ジャンボ消しゴム', en: 'Jumbo Eraser' },
      line: { ja: '両手で持つ。筆箱に入らない', en: 'Takes both hands. Does not fit in a pencil case.' } }
  ];
})(window.K = window.K || {});
