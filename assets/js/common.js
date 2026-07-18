(function () {
  "use strict";

  var SEASON_COLORS = {
    spring: "#C48A9C",
    summer: "#6E8B74",
    autumn: "#B5762A",
    winter: "#6B7A8C"
  };

  // Same four colors expressed as "r,g,b" triplets so CSS can compose
  // rgba(var(--accent-rgb), <alpha>) for low-opacity seasonal washes
  // (hero background wash, wheel arcs, etc.) without needing color-mix().
  var SEASON_RGB = {
    spring: "196,138,156",
    summer: "110,139,116",
    autumn: "181,118,42",
    winter: "107,122,140"
  };

  function hexToRgbaString(hex, alpha) {
    var h = String(hex).replace("#", "");
    var r = parseInt(h.substring(0, 2), 16);
    var g = parseInt(h.substring(2, 4), 16);
    var b = parseInt(h.substring(4, 6), 16);
    return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
  }

  function applySeasonAccent() {
    try {
      var r = window.Koyomi.getKoyomi(new Date());
      var season = r && r.sekki && r.sekki.season;
      var color = SEASON_COLORS[season] || SEASON_COLORS.autumn;
      var rgb = SEASON_RGB[season] || SEASON_RGB.autumn;
      document.documentElement.style.setProperty("--accent", color);
      document.documentElement.style.setProperty("--accent-rgb", rgb);
      document.documentElement.setAttribute("data-season", season || "");
      return r;
    } catch (e) {
      // Data unavailable for some reason -- keep the default accent so the
      // page still renders instead of throwing.
      return null;
    }
  }

  function wireLangSwitch() {
    var buttons = document.querySelectorAll("[data-lang-switch]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function (ev) {
        var lang = ev.currentTarget.getAttribute("data-lang-switch");
        window.SekkiI18n.setLang(lang);
        window.SekkiI18n.applyStaticI18n(lang);
        var evt = document.createEvent("Event");
        evt.initEvent("sekkicho:langchange", true, true);
        document.dispatchEvent(evt);
      });
    }
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("./sw.js").catch(function () {
          // Offline-first is a nice-to-have; failure to register (e.g. when
          // opened via file://) must never break the page itself.
        });
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    window.SekkiI18n.applyStaticI18n();
    applySeasonAccent();
    wireLangSwitch();
    registerServiceWorker();
  });

  var MONTH_JA_ZH = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  var MONTH_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // iso is "YYYY-MM-DD" as produced by koyomi.js. Renders a compact,
  // language-appropriate date label without pulling in Intl formatting
  // (kept simple and dependency-free on purpose).
  function formatDate(iso, lang) {
    var parts = iso.split("-");
    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    var day = parseInt(parts[2], 10);
    if (lang === "en") {
      return MONTH_EN[m - 1] + " " + day + ", " + y;
    }
    // ja / zh share the same "N月N日" convention.
    return y + (lang === "ja" ? "年" : "年") + MONTH_JA_ZH[m - 1] + "月" + day + "日";
  }

  window.SekkiCommon = {
    SEASON_COLORS: SEASON_COLORS,
    SEASON_RGB: SEASON_RGB,
    hexToRgba: hexToRgbaString,
    applySeasonAccent: applySeasonAccent,
    formatDate: formatDate
  };
})();
