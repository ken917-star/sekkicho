/* Single 候 page (kou.html?id=kou-52): name, this year's dates, the story,
   seasonal food and flower, and prev/next. Swipe left/right in the app. */
(function () {
  "use strict";
  function KN(k, lang) { return window.SekkiKouName ? window.SekkiKouName.name(k, lang) : (k[lang] || k.ja); }


  var I = window.SekkiI18n;
  var data = window.SEKKI_DATA;
  var common = window.SekkiCommon;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function num(id) { return parseInt(id.split("-")[1], 10); }
  function idOf(n) { return "kou-" + (n < 10 ? "0" + n : n); }

  // The current or next occurrence of this kou, found by walking forward
  // from today (each kou recurs once a year).
  function periodOf(id) {
    var t = new Date();
    for (var i = 0; i < 370; i++, t.setDate(t.getDate() + 1)) {
      var r;
      try { r = window.Koyomi.getKoyomi(t); } catch (e) { return null; }
      if (r.kou && r.kou.id === id) return { start: r.kouRange.start, end: r.kouRange.end };
    }
    return null;
  }

  function fmt(iso, lang) {
    var m = +iso.slice(5, 7), d = +iso.slice(8, 10);
    if (lang === "en") return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1] + " " + d;
    return m + "月" + d + "日";
  }

  function go(n) {
    if (n < 1) n = 72;
    if (n > 72) n = 1;
    window.location.replace("./kou.html?id=" + idOf(n));
  }

  function render() {
    var lang = I.getLang();
    var t = function (k) { return I.t(k, lang); };
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id") || "kou-01";
    var k = data.kou.filter(function (x) { return x.id === id; })[0] || data.kou[0];
    var s = data.sekki.filter(function (x) { return x.id === k.sekkiId; })[0];
    var n = num(k.id);
    var color = common.SEASON_COLORS[s.season];
    document.documentElement.style.setProperty("--accent", color);
    var prev = data.kou.filter(function (x) { return num(x.id) === (n === 1 ? 72 : n - 1); })[0];
    var next = data.kou.filter(function (x) { return num(x.id) === (n === 72 ? 1 : n + 1); })[0];
    var p = periodOf(k.id);
    document.title = KN(k, lang) + " -- " + t("site_title");

    var html =
      '<header class="kd-head">' +
        '<div class="kd-meta">' +
          '<p class="kd-no">' + esc(t("wheel_order_prefix") + n + t("wheel_order_suffix")) + "</p>" +
          '<p class="kd-sekki">' + esc((s[lang] || s.ja) + " · " + t("kou_order_" + k.order)) + "</p>" +
          (p ? '<p class="kd-period">' + esc(fmt(p.start, lang) + " — " + fmt(p.end, lang)) + "</p>" : "") +
        "</div>" +
        '<div class="kd-name">' +
          (k.jaReading && lang === "ja" ? '<span class="kd-reading">' + esc(k.jaReading) + "</span>" : "") +
          '<h1 class="kd-title">' + esc(lang === "zh" ? KN(k, lang) : k.ja) + "</h1>" +
        "</div>" +
      "</header>" +
      (lang === "en" ? '<p class="kd-trans">' + esc(k.en) + "</p>" : (window.SekkiKouName && window.SekkiKouName.cnNote(k, lang) ? '<p class="kd-trans kd-cn">' + esc(window.SekkiKouName.cnNote(k, lang)) + "</p>" : "")) +
      '<p class="kd-desc">' + esc(k.desc[lang]) + "</p>" +
      (window.SEKKI_EDITION === "cn" && window.SEKKI_CN_EXTRA && window.SEKKI_CN_EXTRA.kou[k.id]
        ? '<blockquote class="cx-q kd-jijie">' + esc(window.SEKKI_CN_EXTRA.kou[k.id].jijie) + "<cite>" +
          esc(lang === "en" ? "Collected Commentaries on the 72 Pentads (Wu Cheng, Yuan dynasty)" : "《月令七十二候集解》") + "</cite></blockquote>"
        : "") +
      '<div class="kd-cards">' +
        '<div class="kd-card"><span class="kd-label">' + esc(t("today_food_title")) + '</span><span class="kd-value">' + esc((k.food[lang] || []).join("・")) + "</span></div>" +
        '<div class="kd-card"><span class="kd-label">' + esc(t("today_flower_title")) + '</span><span class="kd-value">' + esc(k.flower[lang]) + "</span></div>" +
      "</div>" +
      '<div id="kdAffiliate"></div>' +
      '<nav class="kd-pager" aria-label="' + esc(t("nav_koyomi")) + '">' +
        '<a href="./kou.html?id=' + prev.id + '" data-replace="1"><span class="kd-pager-label">‹ ' + esc(t("kou_prev")) + '</span><span class="kd-pager-name">' + esc(KN(prev, lang)) + "</span></a>" +
        '<a class="is-next" href="./kou.html?id=' + next.id + '" data-replace="1"><span class="kd-pager-label">' + esc(t("kou_next")) + ' ›</span><span class="kd-pager-name">' + esc(KN(next, lang)) + "</span></a>" +
      "</nav>";

    var sceneEl = document.getElementById("kouScene");
    if (sceneEl && window.SekkiScene) {
      window.SekkiScene.show(sceneEl, n);
      sceneEl.setAttribute("aria-label", KN(k, lang));
    }

    var root = document.getElementById("kouDetail");
    root.innerHTML = html;
    if (window.SekkiAffiliate) window.SekkiAffiliate.renderCard(document.getElementById("kdAffiliate"), k.id, lang);

    // Paging between kou replaces history so Back returns to the list.
    Array.prototype.forEach.call(root.querySelectorAll("a[data-replace]"), function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); window.location.replace(a.getAttribute("href")); });
    });
    root.dataset.n = n;
  }

  document.addEventListener("DOMContentLoaded", function () {
    render();
    var x0 = null, y0 = null;
    document.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    document.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      // Ignore edge swipes (system back gesture starts at the left edge).
      if (x0 > 24 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        var n = +document.getElementById("kouDetail").dataset.n;
        go(dx < 0 ? n + 1 : n - 1);
      }
      x0 = null;
    }, { passive: true });
  });
  document.addEventListener("sekkicho:langchange", render);
})();
