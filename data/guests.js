// ゲストけしゴム。ときどき つくえに やってきて、タップすると いつもの けしゴムと もちかえる
// stage: その STAGE の カスを みつけたら くるように なる（0 = さいしょから）
(function (K) {
  'use strict';
  K.data = K.data || {};
  K.data.guests = [
    { id: 'golden', stage: 0,
      name: { ja: 'ゴールデン消しゴム', en: 'Golden Eraser' },
      line: { ja: 'ぴかぴか。消すのがもったいない', en: 'So shiny. Too nice to use.' } },
    { id: 'kadokeshi', stage: 1,
      name: { ja: 'かどけし', en: 'Corner Eraser' },
      line: { ja: 'いつも新しい角で消せる', en: 'Always a fresh corner to erase with.' },
      effect: { ja: '次の28回こするのが10倍', en: 'Next 28 rubs x10' } },
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
      line: { ja: 'へったら後ろから次が出てくる', en: 'When one wears down, the next pops out.' } }
  ];
})(window.K = window.K || {});
