(function () {
  "use strict";

  // Traditional Japanese colors (nipponcolors.com hex), each >= 4.5:1 on the
  // #F7F4EC paper so the accent can carry small text: 蘇芳 suō / 木賊 tokusa /
  // 檜皮 hiwada / 藍 ai.
  var SEASON_COLORS = {
    spring: "#8E354A",
    summer: "#2D6D4B",
    autumn: "#854836",
    winter: "#0D5661"
  };

  // Same four colors expressed as "r,g,b" triplets so CSS can compose
  // rgba(var(--accent-rgb), <alpha>) for low-opacity seasonal washes
  // (hero background wash, wheel arcs, etc.) without needing color-mix().
  var SEASON_RGB = {
    spring: "142,53,74",
    summer: "45,109,75",
    autumn: "133,72,54",
    winter: "13,86,97"
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
    var isWebProtocol =
      window.location.protocol === "http:" ||
      window.location.protocol === "https:";
    // Native app shells (e.g. Capacitor's capacitor:// / ionic:// schemes)
    // don't need or support the offline service worker; only register it
    // when actually served over http(s).
    if (isWebProtocol && "serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("./sw.js").catch(function () {
          // Offline-first is a nice-to-have; failure to register (e.g. when
          // opened via file://) must never break the page itself.
        });
      });
    }
  }

  // App Store build (Capacitor shell): the app stays a self-contained
  // almanac, so the web-only links back to the parent site -- the floating
  // return button and the footer operator line -- are removed in the app.
  // The web pages keep them unchanged.
  function stripParentSiteLinksInApp() {
    var p = window.location.protocol;
    if (p === "http:" || p === "https:") return;
    var links = document.querySelectorAll('a[href^="https://kenoushin.com"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      if (!a.isConnected) continue;
      var line = a.closest(".academy-back-button") || a.closest("p") || a;
      line.parentNode.removeChild(line);
    }
  }

  // App only: expose the system safe areas to CSS (env(safe-area-inset-*)) so the
  // header can step around the iPhone Duo status rail while the page itself stays
  // full-bleed. The web pages keep the default viewport.
  function coverViewportInApp() {
    var p = window.location.protocol;
    if (p === "http:" || p === "https:") return;
    var meta = document.querySelector('meta[name="viewport"]');
    if (meta && meta.content.indexOf("viewport-fit") === -1) {
      meta.content += ", viewport-fit=cover";
    }
  }
  coverViewportInApp();

  // Search engines: every page / language / kou gets its own canonical URL on
  // kenoushin.com (the github.io copy folds into it), with ja/zh/en hreflang
  // alternates and the language-less URL as x-default. Web only.
  var SEO_BASE = "https://kenoushin.com/sekkicho/";
  function applySeoLinks() {
    var p = window.location.protocol;
    if (p !== "http:" && p !== "https:") return;
    var file = window.location.pathname.split("/").pop() || "index.html";
    if (file === "index.html") file = "";
    var q = window.location.search;
    var id = (q.match(/[?&]id=(kou-\d{2})(?:&|$)/) || [])[1];
    var lang = (q.match(/[?&]lang=(ja|zh|en)(?:&|$)/) || [])[1];
    function url(l) {
      var parts = [];
      if (id) parts.push("id=" + id);
      if (l) parts.push("lang=" + l);
      return SEO_BASE + file + (parts.length ? "?" + parts.join("&") : "");
    }
    var head = document.head;
    Array.prototype.forEach.call(head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]'), function (n) { n.parentNode.removeChild(n); });
    function add(rel, href, hl) {
      var l = document.createElement("link"); l.rel = rel; l.href = href;
      if (hl) l.hreflang = hl;
      head.appendChild(l);
    }
    add("canonical", url(lang));
    add("alternate", url("ja"), "ja");
    add("alternate", url("zh"), "zh-Hans");
    add("alternate", url("en"), "en");
    add("alternate", url(null), "x-default");
  }

  // When the page was opened with ?lang=, keep it on internal links so a
  // crawler (no storage between pages) stays in the same language.
  function carryLangOnLinks() {
    var lang = (window.location.search.match(/[?&]lang=(ja|zh|en)(?:&|$)/) || [])[1];
    if (!lang) return;
    Array.prototype.forEach.call(document.querySelectorAll("a[href]"), function (a) {
      var h = a.getAttribute("href");
      if (!/^\.\/[a-z0-9-]*(\.html)?(\?[^#]*)?(#.*)?$/i.test(h)) return;
      if (/[?&]lang=/.test(h)) { a.setAttribute("href", h.replace(/([?&])lang=(ja|zh|en)/, "$1lang=" + lang)); return; }
      var hash = h.indexOf("#") >= 0 ? h.slice(h.indexOf("#")) : "";
      var base = hash ? h.slice(0, h.indexOf("#")) : h;
      a.setAttribute("href", base + (base.indexOf("?") >= 0 ? "&" : "?") + "lang=" + lang + hash);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    applySeoLinks();
    stripParentSiteLinksInApp();
    window.SekkiI18n.applyStaticI18n();
    applySeasonAccent();
    wireLangSwitch();
    registerServiceWorker();
    carryLangOnLinks();
    setTimeout(carryLangOnLinks, 0); // links rendered by page scripts on DOMContentLoaded
  });
  document.addEventListener("sekkicho:langchange", function () { setTimeout(carryLangOnLinks, 0); });

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
