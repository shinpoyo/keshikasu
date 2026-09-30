// どうぐ（施設）。値段 = cost × 1.15^持っている数（企画書 6-2）
(function (K) {
  'use strict';
  K.data = K.data || {};
  K.data.buildings = [
    { id: 'finger', cost: 15, cps: 0.1,
      name: { ja: 'ゆび', en: 'Finger' },
      line: { ja: 'じどうで こする ゆびです', en: 'A finger that rubs on its own.' } },
    { id: 'ant', cost: 100, cps: 1,
      name: { ja: 'アリさん', en: 'Ant' },
      line: { ja: 'カスを はこんで くる', en: 'Carries crumbs over to you.' } },
    { id: 'grandpa', cost: 1100, cps: 8,
      name: { ja: 'しらない おじいちゃん', en: 'Random Grandpa' },
      line: { ja: 'むかしは もっと カスが あった', en: '"Back in my day, there were more crumbs."' } },
    { id: 'classroom', cost: 12000, cps: 47,
      name: { ja: 'きょうしつ', en: 'Classroom' },
      line: { ja: 'テストの あとは とくに とれる', en: 'Especially productive after a test.' } },
    { id: 'club', cost: 130000, cps: 260,
      name: { ja: 'けしゴムぶ', en: 'Eraser Club' },
      line: { ja: 'ぶかつです', en: 'It is an after-school club.' } },
    { id: 'factory', cost: 1.4e6, cps: 1400,
      name: { ja: 'けしゴムこうじょう', en: 'Eraser Factory' },
      line: { ja: 'なにかを けしつづけている', en: 'Keeps erasing something.' } },
    { id: 'roller', cost: 2e7, cps: 7800,
      name: { ja: 'ロードローラー', en: 'Road Roller' },
      line: { ja: 'なぜか ある', en: 'It is here for some reason.' } },
    { id: 'moon', cost: 3.3e8, cps: 44000,
      name: { ja: 'つき', en: 'The Moon' },
      line: { ja: 'いんりょくで あつめてくれる', en: 'Gathers crumbs with gravity.' } },
    { id: 'timemachine', cost: 5.1e9, cps: 260000,
      name: { ja: 'タイムマシン', en: 'Time Machine' },
      line: { ja: 'きのうの カスを もってくる', en: "Brings back yesterday's crumbs." } },
    { id: 'paralleldesk', cost: 7.5e10, cps: 1.6e6,
      name: { ja: 'パラレルつくえ', en: 'Parallel Desk' },
      line: { ja: 'べつの せかいの つくえ', en: 'A desk from another world.' } },
    { id: 'universe', cost: 1e12, cps: 1e7,
      name: { ja: 'うちゅうの いし', en: 'Will of the Universe' },
      line: { ja: '……', en: '...' } },
    { id: 'other', cost: 1.4e13, cps: 6.5e7,
      name: { ja: 'もうひとりの カス', en: 'The Other Crumb' },
      line: { ja: 'やあ', en: 'Hey.' } }
  ];
  K.data.PRICE_GROWTH = 1.15;
  K.data.SELL_RATE = 0.25;
})(window.K = window.K || {});
