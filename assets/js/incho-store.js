/* 節気帖 -- 印帳 store. One seal per kou, kept only on this device
   (localStorage; nothing leaves the phone). A seal may be pressed while its
   kou is current; pressing again in a later year simply updates the date. */
(function () {
  "use strict";
  var KEY = "sekkicho.incho.v1";

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; }
  }
  function write(map) {
    try { localStorage.setItem(KEY, JSON.stringify(map)); return true; } catch (e) { return false; }
  }
  function iso(d) {
    var p = function (n) { return (n < 10 ? "0" : "") + n; };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }

  window.SekkiIncho = {
    all: read,
    count: function () { return Object.keys(read()).length; },
    // Stamped during the occurrence that started on `rangeStart` (ISO date)?
    stampedSince: function (n, rangeStart) {
      var s = read()[n];
      return !!(s && (!rangeStart || s >= String(rangeStart).slice(0, 10)));
    },
    stamp: function (n) {
      var map = read();
      map[n] = iso(new Date());
      return write(map) ? map[n] : null;
    },
    last: function () {
      var map = read(), best = null;
      Object.keys(map).forEach(function (k) { if (!best || map[k] > map[best]) best = k; });
      return best ? { n: +best, date: map[best] } : null;
    }
  };
})();
