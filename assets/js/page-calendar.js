/* 暦 page: month grid + the selected day's almanac. Selection lives in the
   URL hash (#YYYY-MM-DD) so a language switch or a return visit keeps it. */
(function () {
  "use strict";
  function KN(k, lang) { return window.SekkiKouName ? window.SekkiKouName.name(k, lang) : (k[lang] || k.ja); }


  var C = window.SekkiCalendar;
  var I = window.SekkiI18n;
  var state = { y: 0, m: 0, sel: "" };

  // 節気 start days within the calendar's range: "YYYY-MM-DD" -> sekki
  var sekkiStarts = {};
  window.SEKKI_DATA.sekki.forEach(function (s) {
    Object.keys(s.dates).forEach(function (y) { sekkiStarts[y + "-" + s.dates[y]] = s; });
  });

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  function kouOn(key) {
    try {
      return window.Koyomi.getKoyomi(new Date(+key.slice(0, 4), +key.slice(5, 7) - 1, +key.slice(8, 10)));
    } catch (e) { return null; }
  }

  function monthLabel(y, m, lang) {
    if (lang === "en") return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][m - 1] + " " + y;
    return y + "年" + m + "月";
  }

  function canGo(y, m) {
    var k = C.key(y, m, 1);
    return k.slice(0, 7) >= C.start.slice(0, 7) && k.slice(0, 7) <= C.end.slice(0, 7);
  }

  function step(delta) {
    var m = state.m + delta, y = state.y;
    if (m < 1) { m = 12; y--; }
    if (m > 12) { m = 1; y++; }
    if (!canGo(y, m)) return;
    state.y = y; state.m = m;
    var last = new Date(Date.UTC(y, m, 0)).getUTCDate();
    state.sel = C.key(y, m, Math.min(+state.sel.slice(8, 10) || 1, last));
    render();
  }

  function select(key) {
    state.sel = key;
    state.y = +key.slice(0, 4);
    state.m = +key.slice(5, 7);
    render();
  }

  function cellSub(key, info, lang) {
    var sk = sekkiStarts[key];
    if (sk) return '<span class="cal-sub is-sekki">' + esc(sk[lang] || sk.ja) + "</span>";
    if (info.cn && info.holiday) return '<span class="cal-sub is-holiday">' + esc(info.holiday.replace(/节$/, "")) + "</span>";
    if (info.holiday) return '<span class="cal-sub is-holiday">' + esc(({ ja: "祝日", zh: "假日", en: "Holiday" })[lang] || "祝日") + "</span>";
    if (info.cn) {
      if (info.lunar.day === 1) return '<span class="cal-sub is-lunar-first">' + esc(info.lunar.monthText) + "</span>";
      return '<span class="cal-sub">' + esc(info.lunar.dayText) + "</span>";
    }
    if (info.lunar.day === 1) return '<span class="cal-sub is-lunar-first">' + esc(lang === "en" ? "M" + info.lunar.month : info.lunar.text.replace(/一日$/, "").replace(/一$/, "")) + "</span>";
    return '<span class="cal-sub">' + (lang === "en" ? info.lunar.day : esc(info.lunar.text.split("月")[1].replace(/日$/, ""))) + "</span>";
  }

  function renderGrid(lang) {
    var today = C.todayKey();
    var N = C.names(lang);
    var html = '<div class="cal-head">' +
      '<button type="button" class="cal-nav" data-step="-1" aria-label="' + esc(I.t("cal_prev", lang)) + '"' + (canGo(state.m === 1 ? state.y - 1 : state.y, state.m === 1 ? 12 : state.m - 1) ? "" : " disabled") + '>' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<h2 class="cal-title">' + esc(monthLabel(state.y, state.m, lang)) + "</h2>" +
      '<button type="button" class="cal-nav" data-step="1" aria-label="' + esc(I.t("cal_next", lang)) + '"' + (canGo(state.m === 12 ? state.y + 1 : state.y, state.m === 12 ? 1 : state.m + 1) ? "" : " disabled") + '>' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>' +
      (state.sel !== today && C.inRange(today) ? '<button type="button" class="cal-today-btn" data-today="1">' + esc(I.t("cal_today", lang)) + "</button>" : "") +
      "</div>";

    html += '<div class="cal-grid" role="grid">';
    for (var w = 0; w < 7; w++) {
      html += '<div class="cal-wd' + (w === 0 ? " is-sun" : w === 6 ? " is-sat" : "") + '" role="columnheader">' + esc(N.weekday[w]) + "</div>";
    }
    C.monthGrid(state.y, state.m).forEach(function (week) {
      week.forEach(function (key) {
        if (!key) { html += '<div class="cal-cell is-empty" aria-hidden="true"></div>'; return; }
        var info = C.getDay(key, lang);
        var cls = "cal-cell";
        if (info.weekday === 0 || info.holiday) cls += " is-sun";
        else if (info.weekday === 6) cls += " is-sat";
        if (key === today) cls += " is-today";
        if (key === state.sel) cls += " is-selected";
        var moon = info.moon.principal === 0 || info.moon.principal === 2 ? '<span class="cal-moon">' + C.moonSvg(info.moon.age, 9) + "</span>" : "";
        html += '<button type="button" class="' + cls + '" data-key="' + key + '" aria-pressed="' + (key === state.sel) + '" aria-label="' + esc(info.month + "/" + info.day + " " + (info.holiday || "")) + '">' +
          '<span class="cal-d">' + info.day + "</span>" + cellSub(key, info, lang) + moon + "</button>";
      });
    });
    html += "</div>";
    return html;
  }

  function row(label, value, extra) {
    return '<div class="cal-row"><dt>' + esc(label) + "</dt><dd>" + value + (extra || "") + "</dd></div>";
  }

  function renderDetail(lang) {
    var info = C.getDay(state.sel, lang);
    if (!info) return '<p class="cal-empty">' + esc(I.t("cal_out_of_range", lang)) + "</p>";
    var k = kouOn(state.sel);
    var dateLine = lang === "en"
      ? info.weekdayName + ", " + monthLabel(info.year, info.month, lang).split(" ")[0] + " " + info.day
      : info.month + "月" + info.day + "日（" + info.weekdayName + "）";

    var html = '<header class="cal-detail-head">' +
      '<p class="cal-detail-date">' + esc(dateLine) + "</p>" +
      '<p class="cal-detail-sub">' + esc(info.wareki + " · " + info.yearKanshi) + "</p></header>";

    var notes = [];
    if (info.holiday) notes.push('<span class="cal-chip is-holiday">' + esc(info.holiday) + "</span>");
    if (sekkiStarts[state.sel]) notes.push('<span class="cal-chip is-sekki">' + esc(sekkiStarts[state.sel][lang] || sekkiStarts[state.sel].ja) + "</span>");
    info.events.forEach(function (e) { notes.push('<span class="cal-chip">' + esc(e) + "</span>"); });
    if (notes.length) html += '<div class="cal-chips" aria-label="' + esc(I.t("cal_notes", lang)) + '">' + notes.join("") + "</div>";

    html += '<dl class="cal-rows">';
    if (info.cn) {
      var en = lang === "en";
      html += row(en ? "Chinese lunar" : "农历", esc(info.lunar.text));
      html += row(en ? "Stems & branches" : "干支", esc(en ? info.yearGz + " year · " + info.monthGz + " month · " + info.dayKanshi + " day" : info.yearGz + "年 " + info.monthGz + "月 " + info.dayKanshi + "日"));
      html += row(en ? "Zodiac" : "生肖", esc(info.zodiac));
    } else {
      html += row(I.t("cal_lunar", lang), esc(info.lunar.text) + '<span class="cal-muted">' + esc(info.monthName) + "</span>");
      html += row(I.t("cal_rokuyo", lang), esc(info.rokuyo));
      html += row(I.t("cal_kanshi", lang), esc(info.dayKanshi));
    }
    html += row(I.t("cal_moon", lang), C.moonSvg(info.moon.age, 18) + " " + info.moon.age.toFixed(1) + '<span class="cal-muted">' + esc(info.moon.name) + "</span>");
    html += row(I.t("cal_sun", lang), esc(info.sunrise + " — " + info.sunset), '<span class="cal-muted">' + esc(info.place || I.t("cal_tokyo", lang)) + "</span>");
    if (k && k.kou) {
      var n = parseInt(k.kou.id.split("-")[1], 10);
      html += row(I.t("cal_sekki", lang), esc(k.sekki[lang] || k.sekki.ja));
      html += '<div class="cal-row"><dt>' + esc(I.t("cal_kou", lang)) + '</dt><dd><a class="cal-kou-link" href="./kou.html?id=' + k.kou.id + '">' +
        esc(KN(k.kou, lang)) + '<span class="cal-muted">' + esc(I.t("wheel_order_prefix", lang) + n + I.t("wheel_order_suffix", lang)) + "</span></a></dd></div>";
    }
    html += "</dl>";
    html += '<p class="cal-note">' + esc(info.note || I.t("cal_rokuyo_note", lang)) + "</p>";
    return html;
  }

  function render() {
    var lang = I.getLang();
    document.getElementById("cal").innerHTML = renderGrid(lang);
    document.getElementById("calDetail").innerHTML = renderDetail(lang);
    if (window.history.replaceState) window.history.replaceState(null, "", "#" + state.sel);
  }

  function init() {
    if (!C || !C.available) return;
    var h = window.location.hash.slice(1);
    var start = /^\d{4}-\d{2}-\d{2}$/.test(h) && C.inRange(h) ? h : C.todayKey();
    if (!C.inRange(start)) start = C.start;
    select(start);

    var cal = document.getElementById("cal");
    cal.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b || b.disabled) return;
      if (b.dataset.step) step(+b.dataset.step);
      else if (b.dataset.today) select(C.todayKey());
      else if (b.dataset.key) select(b.dataset.key);
    });
    // Horizontal swipe on the grid pages months.
    var x0 = null, y0 = null;
    cal.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    cal.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
      x0 = null;
    }, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", init);
  document.addEventListener("sekkicho:langchange", render);
})();
