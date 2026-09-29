// すうじの表記（K/M/B/T）。言語に関係なく共通（企画書 3-2）
(function (K) {
  'use strict';
  var UNITS = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

  function sig4(v) {
    // 有効数字4桁。1.234 / 56.78 / 912.3
    if (v >= 100) return v.toFixed(1);
    if (v >= 10) return v.toFixed(2);
    return v.toFixed(3);
  }

  function trimZeros(s) {
    return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
  }

  function comma(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // n: 数, opts.decimals: 1,000,000 未満で小数を見せる桁数
  function fmt(n, opts) {
    opts = opts || {};
    if (!isFinite(n)) return '∞';
    var neg = n < 0;
    n = Math.abs(n);
    var out;
    if (n < 1e6) {
      var d = opts.decimals || 0;
      if (d > 0 && n < 1000 && n !== Math.floor(n)) {
        out = trimZeros(n.toFixed(d));
      } else {
        out = comma(Math.floor(n));
      }
    } else if (K.state && K.state.settings && K.state.settings.notation === 'sci') {
      var e = Math.floor(Math.log10(n));
      out = trimZeros((n / Math.pow(10, e)).toFixed(2)) + 'e' + e;
    } else {
      var tier = Math.floor(Math.log10(n) / 3);
      if (tier >= UNITS.length) {
        var ex = Math.floor(Math.log10(n));
        out = (n / Math.pow(10, ex)).toFixed(2) + 'e' + ex;
      } else {
        var v = n / Math.pow(1000, tier);
        // 丸めで 1000.0 になったら単位を上げる
        if (v >= 999.95) { tier++; v = v / 1000; }
        out = sig4(v) + UNITS[tier];
      }
    }
    return (neg ? '-' : '') + out;
  }

  function perSec(n) {
    return fmt(n, { decimals: 1 }) + ' /s';
  }

  function duration(sec) {
    sec = Math.max(0, Math.floor(sec));
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return { h: h, m: m, s: s };
  }

  function clock(sec) {
    var d = duration(sec);
    return (d.h ? d.h + ':' + String(d.m).padStart(2, '0') : d.m) + ':' + String(d.s).padStart(2, '0');
  }

  function date(ts) {
    var d = new Date(ts);
    return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0');
  }

  K.fmt = fmt;
  K.fmtPerSec = perSec;
  K.fmtDuration = duration;
  K.fmtClock = clock;
  K.fmtDate = date;
})(window.K = window.K || {});
