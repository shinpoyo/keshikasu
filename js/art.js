// 絵（インラインSVG）。カスの本体は art/*.svg（design/art から生成したもの）を使う
(function (K) {
  'use strict';
  var INK = '#2B2A28';

  function svg(vb, inner, w, h, extra) {
    return '<svg viewBox="' + vb + '" width="' + w + '" height="' + h + '" aria-hidden="true" focusable="false"' + (extra || '') + '>' + inner + '</svg>';
  }

  // なかま（施設）のアイコン。デザイン案（design/Main.dc.html）から移植＋のこりを同じタッチで追加
  var BUILDING = {
    finger: ['0 0 26 34', '<rect x="7" y="2" width="12" height="28" rx="6" fill="#F4D7BE" stroke="' + INK + '" stroke-width="1.8"/><rect x="9.5" y="4.5" width="7" height="7" rx="3" fill="#FFFFFF" stroke="' + INK + '" stroke-width="1.2"/><path d="M9 22h8" stroke="' + INK + '" stroke-width="1.2"/>'],
    ant: ['0 0 34 22', '<path d="M8 14 3 20M12 14l-2 7M18 14l2 7M22 14l6 6M10 8 6 3M24 8l4-5" stroke="' + INK + '" stroke-width="1.5" stroke-linecap="round"/><ellipse cx="7" cy="11" rx="5" ry="4.5" fill="' + INK + '"/><ellipse cx="15" cy="12" rx="4" ry="3.5" fill="' + INK + '"/><ellipse cx="25" cy="11" rx="7" ry="5.5" fill="' + INK + '"/><circle cx="30" cy="5" r="2.5" fill="#A9A49B" stroke="' + INK + '" stroke-width="1"/>'],
    grandpa: ['8 7 56 68.4', '<path d="M8 88c0-16 9-26 28-26s28 10 28 26z" fill="#A9BF95" stroke="' + INK + '" stroke-width="3.2" stroke-linejoin="round"/><path d="M28 63.5 36 76l8-12.5c-2.4-.9-5-1.3-8-1.3s-5.6.4-8 1.3z" fill="#FFFFFF" stroke="' + INK + '" stroke-width="2.24" stroke-linejoin="round"/><path d="M30.5 56v6.5c3.5 2 7.5 2 11 0V56" fill="#F2D2B6" stroke="' + INK + '" stroke-width="2.24"/><path d="M54.5 42c3-1 5.5-4 4.5-8c2.5-2 2-6.5-.5-8c1-3-1-6-4-6c-.5 3-1 8-.5 13c0 3 0 6 .5 9z" fill="#FFFFFF" stroke="#8C8A84" stroke-width="2.24" stroke-linejoin="round"/><path d="M17.5 42c-3-1-5.5-4-4.5-8c-2.5-2-2-6.5.5-8c-1-3 1-6 4-6c.5 3 1 8 .5 13c0 3 0 6-.5 9z" fill="#FFFFFF" stroke="#8C8A84" stroke-width="2.24" stroke-linejoin="round"/><ellipse cx="15.5" cy="37" rx="4.2" ry="5.6" fill="#F2CFB2" stroke="' + INK + '" stroke-width="2.56"/><ellipse cx="56.5" cy="37" rx="4.2" ry="5.6" fill="#F2CFB2" stroke="' + INK + '" stroke-width="2.56"/><path d="M36 13c11.5 0 20 8.5 20 21 0 14-8.6 24-20 24S16 48 16 34c0-12.5 8.5-21 20-21z" fill="#F7DDC6" stroke="' + INK + '" stroke-width="3.2"/><path d="M22.5 29.5c2.5-3.2 7-3.8 10-1.4-2.2.9-5.8 1-10 1.4z" fill="#FFFFFF" stroke="#8C8A84" stroke-width="1.92" stroke-linejoin="round"/><path d="M49.5 29.5c-2.5-3.2-7-3.8-10-1.4 2.2.9 5.8 1 10 1.4z" fill="#FFFFFF" stroke="#8C8A84" stroke-width="1.92" stroke-linejoin="round"/><path d="M24.8 36.3c1.6-2 4.4-2 6 0M41.2 36.3c1.6-2 4.4-2 6 0" stroke="' + INK + '" stroke-width="3.04" stroke-linecap="round" fill="none"/><circle cx="27.8" cy="36.4" r="5.6" fill="#FFFFFF" fill-opacity="0.18" stroke="#8A6A3E" stroke-width="1.92"/><circle cx="44.2" cy="36.4" r="5.6" fill="#FFFFFF" fill-opacity="0.18" stroke="#8A6A3E" stroke-width="1.92"/><path d="M33.4 36c1.6-1.2 3.6-1.2 5.2 0M22.2 35.4 17 34.4M49.8 35.4l5.2-1" stroke="#8A6A3E" stroke-width="1.76" fill="none" stroke-linecap="round"/><ellipse cx="23.5" cy="44.5" rx="4" ry="2.6" fill="#F29CA3" opacity="0.55"/><ellipse cx="48.5" cy="44.5" rx="4" ry="2.6" fill="#F29CA3" opacity="0.55"/><path d="M36 38.5c3.2 0 4.6 2.6 4.3 4.6-.3 2-2.3 2.8-4.3 2.8s-4-.8-4.3-2.8c-.3-2 1.1-4.6 4.3-4.6z" fill="#EFBFA0" stroke="' + INK + '" stroke-width="1.92"/><path d="M36 45.8c-2.5-1.6-6.5-1.8-9 .4-1.4 1.3-1 3.3.8 3.6 3 .5 6-.4 8.2-2.2 2.2 1.8 5.2 2.7 8.2 2.2 1.8-.3 2.2-2.3.8-3.6-2.5-2.2-6.5-2-9-.4z" fill="#FFFFFF" stroke="#8C8A84" stroke-width="1.92" stroke-linejoin="round"/><path d="M32.2 51.2c2.4 1.8 5.2 1.8 7.6 0" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round" fill="none"/>'],
    classroom: ['0 0 52 44', '<path d="M4 16 26 4l22 12" fill="none" stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"/><rect x="7" y="16" width="38" height="26" rx="2" fill="#FBF8F1" stroke="' + INK + '" stroke-width="1.8"/><rect x="12" y="20" width="28" height="11" rx="1.5" fill="#3C5A48" stroke="' + INK + '" stroke-width="1.4"/><path d="M16 25h8M16 28h13" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round"/><rect x="22" y="33" width="8" height="9" fill="#F29CA3" stroke="' + INK + '" stroke-width="1.4"/>'],
    club: ['0 0 44 36', '<rect x="3" y="10" width="38" height="22" rx="5" fill="#F29CA3" stroke="' + INK + '" stroke-width="2"/><rect x="18" y="10" width="23" height="22" fill="#3E6FB0" stroke="' + INK + '" stroke-width="2"/><rect x="22" y="16" width="15" height="7" rx="1.5" fill="#FFFFFF" opacity="0.9"/><path d="M8 4h28" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/><path d="M12 4v6M32 4v6" stroke="' + INK + '" stroke-width="1.6"/>'],
    factory: ['0 0 48 40', '<path d="M3 38V20l10 6v-6l10 6v-6l10 6V8h7v30z" fill="#FBF8F1" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/><rect x="33" y="8" width="7" height="6" fill="#3E6FB0" stroke="' + INK + '" stroke-width="1.6"/><path d="M36 6c0-3 3-3 3-5M40 6c0-2 3-2 3-4" stroke="#A9A49B" stroke-width="1.6" fill="none" stroke-linecap="round"/><rect x="7" y="29" width="8" height="5" rx="1.5" fill="#F29CA3" stroke="' + INK + '" stroke-width="1.4"/><rect x="19" y="29" width="8" height="5" rx="1.5" fill="#F29CA3" stroke="' + INK + '" stroke-width="1.4"/><path d="M1 38h46" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>'],
    roller: ['0 0 52 40', '<rect x="14" y="6" width="22" height="16" rx="3" fill="#E7B533" stroke="' + INK + '" stroke-width="2"/><rect x="18" y="9" width="10" height="8" rx="1.5" fill="#DCE3EC" stroke="' + INK + '" stroke-width="1.4"/><rect x="10" y="20" width="32" height="8" rx="2" fill="#E7B533" stroke="' + INK + '" stroke-width="2"/><rect x="2" y="24" width="20" height="14" rx="7" fill="#8C8A84" stroke="' + INK + '" stroke-width="2"/><circle cx="40" cy="31" r="7" fill="#6B6A66" stroke="' + INK + '" stroke-width="2"/><circle cx="40" cy="31" r="2.2" fill="#FBF8F1"/>'],
    moon: ['0 0 40 40', '<path d="M26 4a16 16 0 1 0 10 26A13 13 0 0 1 26 4z" fill="#F3E3A6" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/><circle cx="15" cy="16" r="2.4" fill="#E0CB84"/><circle cx="12" cy="26" r="3" fill="#E0CB84"/><circle cx="21" cy="30" r="1.6" fill="#E0CB84"/>'],
    timemachine: ['0 0 40 40', '<rect x="5" y="8" width="30" height="28" rx="5" fill="#DCE3EC" stroke="' + INK + '" stroke-width="2"/><circle cx="20" cy="21" r="9" fill="#FBF8F1" stroke="' + INK + '" stroke-width="2"/><path d="M20 15v6l4 3" stroke="' + INK + '" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M11 4l-4 4M29 4l4 4" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/><path d="M4 30a17 17 0 0 0 6 6M36 12a17 17 0 0 0-5-5" stroke="#3E6FB0" stroke-width="2" fill="none" stroke-linecap="round"/>'],
    paralleldesk: ['0 0 48 40', '<g opacity="0.45"><rect x="12" y="4" width="32" height="7" rx="1.5" fill="#D9B98C" stroke="' + INK + '" stroke-width="1.6"/><path d="M15 11v16M41 11v16" stroke="' + INK + '" stroke-width="1.6"/></g><rect x="4" y="14" width="32" height="7" rx="1.5" fill="#D9B98C" stroke="' + INK + '" stroke-width="2"/><path d="M7 21v16M33 21v16" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/><rect x="14" y="10" width="10" height="4" rx="1" fill="#F29CA3" stroke="' + INK + '" stroke-width="1.4"/>'],
    universe: ['0 0 40 40', '<path d="M20 4c9 0 16 6 16 15s-6 17-16 17S4 29 4 20 11 4 20 4z" fill="#2E3350" stroke="' + INK + '" stroke-width="2"/><circle cx="13" cy="15" r="1.3" fill="#FFF6D6"/><circle cx="25" cy="11" r="0.9" fill="#FFF6D6"/><circle cx="27" cy="24" r="1.6" fill="#E7B533"/><circle cx="15" cy="27" r="1" fill="#FFF6D6"/><circle cx="20" cy="19" r="0.8" fill="#F29CA3"/><path d="M8 20c6-4 18-6 25-2" stroke="#8FA7C8" stroke-width="1.2" fill="none" opacity="0.8"/>'],
    other: ['0 0 40 40', '<path d="M9 26c-3-6 1-14 9-16 7-2 15 1 16 9 1 7-5 13-13 13-6 0-10-2-12-6z" fill="#5A5956" stroke="' + INK + '" stroke-width="2"/><path d="M14 18c2-3 6-4 9-3" stroke="#9A9893" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M34 12l3-3M36 17l4-1" stroke="' + INK + '" stroke-width="1.6" stroke-linecap="round"/>']
  };

  function building(id, w, h) {
    var b = BUILDING[id];
    return b ? svg(b[0], b[1], w, h) : '';
  }

  // ざいりょう・アップグレードのアイコン
  var UP = {
    pencil: ['0 0 28 28', '<path d="M6 22 20 8l3 3L9 25H6z" fill="#E7B533" stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"/><path d="M20 8l2-2a2 2 0 0 1 3 3l-2 2" fill="#F29CA3" stroke="' + INK + '" stroke-width="1.8"/>'],
    rub: ['0 0 28 28', '<rect x="4" y="9" width="20" height="11" rx="3" fill="#F29CA3" stroke="' + INK + '" stroke-width="1.8"/><rect x="12" y="9" width="12" height="11" fill="#3E6FB0" stroke="' + INK + '" stroke-width="1.8"/><path d="M5 24h4M11 25h3" stroke="#A9A49B" stroke-width="2" stroke-linecap="round"/>'],
    graphite: ['0 0 28 28', '<path d="M5 20 18 7l4 4L9 24z" fill="#3A3937" stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"/><circle cx="20" cy="22" r="1.6" fill="' + INK + '"/><circle cx="24" cy="19" r="1.1" fill="' + INK + '"/><circle cx="16" cy="25" r="1" fill="' + INK + '"/>'],
    colored: ['0 0 28 28', '<path d="M4 18 14 8l3 3-10 10z" fill="#F29CA3" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 22 19 12l3 3-10 10z" fill="#8FA7C8" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/><path d="M13 10 20 3l3 3-7 7z" fill="#A9BF95" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/>'],
    glue: ['0 0 28 28', '<rect x="8" y="10" width="12" height="15" rx="3" fill="#FBF8F1" stroke="' + INK + '" stroke-width="1.8"/><rect x="10" y="4" width="8" height="6" rx="1.5" fill="#F29CA3" stroke="' + INK + '" stroke-width="1.8"/><path d="M11 16h6" stroke="' + INK + '" stroke-width="1.5"/>'],
    dust: ['0 0 28 28', '<circle cx="14" cy="14" r="8" fill="#E2DDD3" stroke="' + INK + '" stroke-width="1.6" stroke-dasharray="2 2"/><path d="M8 10l-3-2M20 9l3-3M21 19l3 2M8 19l-3 3M14 6V3" stroke="#8C8A84" stroke-width="1.4" stroke-linecap="round"/>'],
    sand: ['0 0 28 28', '<rect x="4" y="8" width="20" height="12" rx="3" fill="#C9A676" stroke="' + INK + '" stroke-width="1.8"/><rect x="4" y="8" width="8" height="12" rx="3" fill="#8FA7C8" stroke="' + INK + '" stroke-width="1.8"/><circle cx="16" cy="12" r="0.9" fill="' + INK + '"/><circle cx="20" cy="15" r="0.9" fill="' + INK + '"/><circle cx="17" cy="17" r="0.9" fill="' + INK + '"/>'],
    gold: ['0 0 28 28', '<path d="M14 3l2.5 6.5L23 12l-6.5 2.5L14 21l-2.5-6.5L5 12l6.5-2.5z" fill="#E7B533" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/><circle cx="22" cy="22" r="2" fill="#E7B533" stroke="' + INK + '" stroke-width="1.2"/>'],
    golden: ['0 0 28 28', '<circle cx="14" cy="14" r="9" fill="#E7B533" stroke="' + INK + '" stroke-width="1.8"/><path d="M14 8v12M8 14h12" stroke="#FFF6D6" stroke-width="2" stroke-linecap="round"/>'],
    shard: ['0 0 28 28', '<path d="M6 10 16 5l7 7-5 11-10-3z" fill="#F29CA3" stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"/><path d="M16 5l-3 10 10-3M13 15l-5 5" stroke="' + INK + '" stroke-width="1.2" fill="none"/>'],
    star: ['0 0 28 28', '<path d="M14 3l3 6.6 7.2.8-5.4 4.9 1.5 7.1L14 18.8l-6.3 3.6 1.5-7.1L3.8 10.4l7.2-.8z" fill="#E7B533" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/>']
  };

  UP.none = UP.rub;

  function upIcon(id, size) {
    size = size || 28;
    if (BUILDING[id]) {
      // 施設アップグレード: 施設アイコン＋小さな星
      var b = BUILDING[id];
      return '<span class="up-icon-b">' + svg(b[0], b[1], size, size) + '<span class="up-star">' + svg(UP.star[0], UP.star[1], 14, 14) + '</span></span>';
    }
    var u = UP[id] || UP.star;
    return svg(u[0], u[1], size, size);
  }

  var UI = {
    logo: ['0 0 40 40', '<rect x="3" y="9" width="34" height="22" rx="6" fill="#F29CA3"/><rect x="15" y="9" width="22" height="22" fill="#3E6FB0"/><circle cx="8" cy="35" r="2" fill="#B8B4AC"/><circle cx="13" cy="36.5" r="1.3" fill="#B8B4AC"/>'],
    zukan: ['0 0 24 24', '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/><path d="M9 8h6"/></g>'],
    ach: ['0 0 24 24', '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/></g>'],
    stats: ['0 0 24 24', '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M21 20H3"/></g>'],
    settings: ['0 0 24 24', '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></g>'],
    praise: ['0 0 24 24', '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'],
    blow: ['0 0 24 24', '<g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 12h16a3 3 0 1 1-3 3"/><path d="M3 16h7"/></g>'],
    roll: ['0 0 24 24', '<g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="7"/><path d="M8 12c1-2 3-3 5-2.5M4 6l2 2M20 6l-2 2M12 2v2.5"/></g>'],
    tabKasu: ['0 0 24 24', '<path d="M11.5 3.5c5-.5 9 3 9 8.3s-3.7 8.7-8.6 8.7-9-3.2-9-8.2 3.6-8.3 8.6-8.8z" fill="none" stroke="currentColor" stroke-width="2"/>'],
    tabDesk: ['0 0 24 24', '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 9h18"/><path d="M5 9v11M19 9v11"/><path d="M3 5h18v4H3z"/></g>'],
    tabShop: ['0 0 24 24', '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h16l-1.5 11h-13z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></g>'],
    tabMenu: ['0 0 24 24', '<path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'],
    close: ['0 0 24 24', '<path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'],
    back: ['0 0 24 24', '<path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'],
    lock: ['0 0 24 24', '<g fill="none" stroke="#A59A86" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></g>'],
    crumb: ['0 0 10 10', '<path d="M2 6c0-2 2-4 4-3.5S9 5 8 7 3 8.5 2 6z" fill="#A9A49B" stroke="' + INK + '" stroke-width="1"/>'],
    eraser: ['0 0 22 16', '<rect x="1" y="2" width="20" height="12" rx="3" fill="#F29CA3" stroke="' + INK + '" stroke-width="1.5"/><rect x="9" y="2" width="12" height="12" fill="#3E6FB0" stroke="' + INK + '" stroke-width="1.5"/>'],
    sound: ['0 0 24 24', '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/></g>'],
    save: ['0 0 24 24', '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v3h16v-3"/></g>'],
    parents: ['0 0 24 24', '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M14 20c0-2.4 1.4-4.3 3-4.3s3.5 1.9 3.5 4.3"/></g>']
  };

  function ui(id, size) {
    var u = UI[id];
    return u ? svg(u[0], u[1], size || 20, size || 20) : '';
  }

  // カスの本体（だんかいの絵）。design/art/make.py と special.py で生成
  function kasuSrc(stage) {
    var n = Math.min(Math.max(stage, 1), 7);
    return 'art/kasu-stage' + n + '.svg';
  }

  // こする 消しゴム（大きい絵）。左はしが こすれて まるく、すこし よごれている
  var ERASER = ['0 0 220 124',
    '<ellipse cx="116" cy="112" rx="98" ry="9" fill="#5C401E" opacity="0.18"/>' +
    '<path d="M22 14h72v92H24c-9 0-15-6-16-15-1-9-1-53 0-62 1-9 6-15 14-15z" fill="#F29CA3" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M16 26c-2 16-2 50 0 66" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.45"/>' +
    '<path d="M9 72c1 10 5 18 13 21" stroke="#6B6A66" stroke-width="7" stroke-linecap="round" opacity="0.28"/>' +
    '<path d="M30 22h60" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.5"/>' +
    '<rect x="78" y="8" width="134" height="102" rx="7" fill="#3E6FB0" stroke="' + INK + '" stroke-width="3"/>' +
    '<rect x="78" y="44" width="134" height="22" fill="#FFFFFF" stroke="' + INK + '" stroke-width="2.4"/>' +
    '<rect x="78" y="70" width="134" height="5" fill="' + INK + '"/>' +
    '<path d="M90 20h108" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.35"/>' +
    '<circle cx="104" cy="55" r="4" fill="#F29CA3" stroke="' + INK + '" stroke-width="1.6"/><circle cx="118" cy="55" r="4" fill="#3E6FB0" stroke="' + INK + '" stroke-width="1.6"/>'];

  function eraser(w, h) { return svg(ERASER[0], ERASER[1], w || '100%', h || '100%'); }

  // カスの絵（けいとうの色つき）。tint は 形で切りぬいた 色の そう（カラフルは 何色も まざる）
  function kasuPic(info, opt) {
    opt = opt || {};
    var plain = !!opt.plain;
    var f = plain || !info.filter || info.filter === 'none' ? '' : ' style="filter:' + info.filter + '"';
    var tint = !plain && info.tint ? '<i class="kpic-tint kpic-' + info.tint + '" style="-webkit-mask-image:url(' + info.art + ');mask-image:url(' + info.art + ')"></i>' : '';
    return '<span class="kpic"><img src="' + info.art + '" alt="" draggable="false"' + f + (opt.lazy ? ' loading="lazy"' : '') + '>' + tint + '</span>';
  }

  K.art = { svg: svg, building: building, upIcon: upIcon, ui: ui, kasuSrc: kasuSrc, kasuPic: kasuPic, eraser: eraser, BUILDING: BUILDING };
})(window.K = window.K || {});
