/* 中国版 · 今日页附加内容：集解原文、养生（起居/饮食/情志/运动）、这个节气做什么、节令食单。
   只在 SEKKI_EDITION === "cn"（中文 / 英文界面）时渲染。古籍引文保留中文原文，英文界面附英译。 */
(function () {
  "use strict";
  var X = window.SEKKI_CN_EXTRA;
  var L = {
    jijie: { zh: "集解", en: "From the Collected Commentaries" },
    yang: { zh: "养生", en: "Living with the Season" },
    cus: { zh: "这个节气做什么", en: "What People Do" },
    eat: { zh: "节令食单", en: "Seasonal Table" },
    folk: { zh: "民俗", en: "folk custom" },
    time: { zh: "时令", en: "in season" },
    ys: { "起居": "Rest", "饮食": "Diet", "情志": "Mind", "运动": "Movement" }
  };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function tr(k, lang) { return (L[k][lang] || L[k].zh); }
  function srcLabel(src, lang) {
    if (src === "民俗") return tr("folk", lang);
    if (src === "时令") return tr("time", lang);
    if (lang !== "en") return src;
    var books = X.books_en || {};
    for (var b in books) if (src.indexOf(b.replace(/[《》]/g, "").slice(0, 4)) !== -1) return books[b];
    return src;
  }

  function render() {
    var el = document.getElementById("cnExtras");
    if (!el) return;
    if (window.SEKKI_EDITION !== "cn" || !X) { el.hidden = true; return; }
    var lang = window.SekkiI18n.getLang(), en = lang === "en";
    var r = window.Koyomi.getKoyomi(new Date());
    var S = X.sekki[r.sekki.id], K = X.kou[r.kou.id] || {};
    if (!S) { el.hidden = true; return; }
    var h = "";
    // 集解: the day's pentad and its solar term, quoted
    h += '<section class="cx-block"><h2 class="cx-h">' + esc(tr("jijie", lang)) + "</h2>" +
      '<blockquote class="cx-q">' + esc(K.jijie || "") + "<cite>" + esc(srcLabel("《月令七十二候集解》", lang)) + "</cite></blockquote>" +
      '<blockquote class="cx-q cx-q-s">' + esc(r.sekki.ja + "：" + S.jijie) + "</blockquote></section>";
    // 养生
    var ys4 = en ? S.yangsheng4.en : S.yangsheng4.zh;
    h += '<section class="cx-block"><h2 class="cx-h">' + esc(tr("yang", lang)) + "</h2>";
    S.yangsheng.forEach(function (y) {
      h += '<blockquote class="cx-q">' + esc(y.text) + (en && y.en ? '<span class="cx-en">' + esc(y.en) + "</span>" : "") + "<cite>" + esc(srcLabel(y.src, lang)) + "</cite></blockquote>";
    });
    h += '<div class="cx-grid">';
    Object.keys(ys4).forEach(function (k) { h += '<div class="cx-cell"><b>' + esc(k) + "</b><p>" + esc(ys4[k]) + "</p></div>"; });
    h += '</div><p class="cx-note">' + esc(en ? X.note_en : X.note) + "</p></section>";
    // 这个节气做什么
    h += '<section class="cx-block"><h2 class="cx-h">' + esc(tr("cus", lang)) + '</h2><ul class="cx-list">';
    S.customs.forEach(function (c) {
      var t = en && c.en ? c.en : { title: c.title, plain: c.plain };
      h += "<li><b>" + esc(t.title) + "</b>" + (c.src === "民俗" ? '<span class="cx-tag">' + esc(tr("folk", lang)) + "</span>" : "") +
        "<p>" + esc(t.plain) + "</p>" +
        (c.text ? '<blockquote class="cx-q cx-q-s">' + esc(c.text) + "<cite>" + esc(srcLabel(c.src, lang)) + "</cite></blockquote>" : "") + "</li>";
    });
    h += "</ul></section>";
    // 节令食单
    h += '<section class="cx-block"><h2 class="cx-h">' + esc(tr("eat", lang)) + '</h2><ul class="cx-eat">';
    S.eat.forEach(function (x) {
      var t = en && x.en ? x.en : { name: x.name, note: x.note };
      h += "<li><b>" + esc(t.name) + '</b><span class="cx-tag' + (x.src.charAt(0) === "《" ? " is-book" : "") + '">' + esc(srcLabel(x.src, lang)) + "</span><p>" + esc(t.note) + "</p></li>";
    });
    h += "</ul></section>";
    el.innerHTML = h;
    el.hidden = false;
  }
  document.addEventListener("DOMContentLoaded", render);
  document.addEventListener("sekkicho:langchange", render);
})();
