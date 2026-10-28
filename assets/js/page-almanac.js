/* 今日の暦 card on the Today page: the day's old-calendar date, rokuyō,
   day sign, moon, sunrise/sunset and any observances, linking to 暦. */
(function () {
  "use strict";

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  function render() {
    var C = window.SekkiCalendar, I = window.SekkiI18n;
    var el = document.getElementById("todayAlmanac");
    if (!el || !C || !C.available) return;
    var lang = I.getLang();
    var key = C.todayKey();
    var d = C.getDay(key, lang);
    if (!d) { el.hidden = true; return; }
    var chips = [];
    if (d.holiday) chips.push('<span class="cal-chip is-holiday">' + esc(d.holiday) + "</span>");
    d.events.forEach(function (e) { chips.push('<span class="cal-chip">' + esc(e) + "</span>"); });
    el.innerHTML =
      '<a class="almanac-link" href="./calendar.html#' + key + '">' +
        '<div class="almanac-head">' +
          '<h2 id="almanacTitle">' + esc(I.t("today_almanac", lang)) + "</h2>" +
          '<span class="almanac-sub">' + esc(d.wareki + " · " + d.yearKanshi) + "</span>" +
          '<svg class="almanac-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>' +
        "</div>" +
        '<div class="almanac-grid">' +
          '<div class="almanac-cell"><span class="almanac-label">' + esc(d.cn ? (lang === "en" ? "Chinese lunar" : "农历") : I.t("cal_lunar", lang)) + '</span><span class="almanac-value">' + esc(d.lunar.text) + "</span></div>" +
          (d.cn
            ? '<div class="almanac-cell"><span class="almanac-label">' + esc(lang === "en" ? "Stems & branches" : "干支") + '</span><span class="almanac-value">' + esc(lang === "en" ? d.yearGz + " · " + d.monthGz + " · " + d.dayKanshi : d.yearGz + "年 " + d.monthGz + "月 " + d.dayKanshi + "日") + "</span></div>"
            : '<div class="almanac-cell"><span class="almanac-label">' + esc(I.t("cal_rokuyo", lang)) + " · " + esc(I.t("cal_kanshi", lang)) + '</span><span class="almanac-value">' + esc(d.rokuyo + "　" + d.dayKanshi) + "</span></div>") +
          '<div class="almanac-cell"><span class="almanac-label">' + esc(I.t("cal_moon", lang)) + '</span><span class="almanac-value">' + C.moonSvg(d.moon.age, 16) + " " + d.moon.age.toFixed(1) + " " + esc(d.moon.name) + "</span></div>" +
          '<div class="almanac-cell"><span class="almanac-label">' + esc(I.t("cal_sun", lang)) + '</span><span class="almanac-value">' + esc(d.sunrise + " — " + d.sunset) + "</span></div>" +
        "</div>" +
        (chips.length ? '<div class="cal-chips">' + chips.join("") + "</div>" : "") +
      "</a>";
  }

  document.addEventListener("DOMContentLoaded", render);
  document.addEventListener("sekkicho:langchange", render);
})();
