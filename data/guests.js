// ゲストけしゴム。ときどき つくえに やってきて、タップすると いつもの けしゴムと もちかえる
// stage: その STAGE の カスを みつけたら くるように なる（0 = さいしょから）
(function (K) {
  'use strict';
  K.data = K.data || {};
  K.data.guests = [
    { id: 'golden', stage: 0,
      name: { ja: 'ゴールデンけしゴム', en: 'Golden Eraser' },
      line: { ja: 'ぴかぴか。けすのが もったいない', en: 'So shiny. Too nice to use.' } },
    { id: 'kadokeshi', stage: 1,
      name: { ja: 'かどけし', en: 'Corner Eraser' },
      line: { ja: 'いつも あたらしい かどで けせる', en: 'Always a fresh corner to erase with.' },
      effect: { ja: 'つぎの 28かい こするのが 10ばい', en: 'Next 28 rubs x10' } },
    { id: 'sand', stage: 2,
      name: { ja: 'すなけし', en: 'Sand Eraser' },
      line: { ja: 'ボールペンも けせる…かも', en: 'Might even erase ballpoint pen...' } },
    { id: 'neri', stage: 3,
      name: { ja: 'ねりけし', en: 'Kneaded Eraser' },
      line: { ja: 'ちぎっても ちぎっても まとまる', en: 'Tear it apart, it comes back together.' } },
    { id: 'kaori', stage: 4,
      name: { ja: 'かおりつき けしゴム', en: 'Scented Eraser' },
      line: { ja: 'いちごの におい', en: 'Smells like strawberries.' } },
    { id: 'rocket', stage: 5,
      name: { ja: 'ロケットけしゴム', en: 'Rocket Eraser' },
      line: { ja: 'へったら うしろから つぎが でてくる', en: 'When one wears down, the next pops out.' } }
  ];
})(window.K = window.K || {});
