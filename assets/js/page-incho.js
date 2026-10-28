/* 印帳 -- one seal per kou, pressed from the Today screen while that kou is
   current. Stamped seals are vermilion; the current kou is outlined; the rest
   wait. Everything lives in this device only (incho-store.js). */
(function () {
  "use strict";
  function KN(k, lang) { return window.SekkiKouName ? window.SekkiKouName.name(k, lang) : (k[lang] || k.ja); }


  var I = window.SekkiI18n, data = window.SEKKI_DATA, store = window.SekkiIncho;
  var SEASONS = ["spring", "summer", "autumn", "winter"];
  var L = {
    title: { ja: "印帳", zh: "印帐", en: "Seal Book" },
    lede: {
      ja: "候ごとに一つ、今日の画面から印を押せます。一年で七十二。記録はこの端末の中だけに残ります。",
      zh: "每个候可以在「今」页盖下一枚印，一年七十二枚。记录只保存在这台设备里。",
      en: "Press one seal for each micro-season from the Today screen — seventy-two in a year. Records stay on this device only."
    },
    season: { ja: ["春", "夏", "秋", "冬"], zh: ["春", "夏", "秋", "冬"], en: ["Spring", "Summer", "Autumn", "Winter"] },
    last: { ja: "最後に押した印", zh: "最近盖的印", en: "Latest seal" },
    empty: { ja: "まだ印はありません。今日の候から始めましょう。", zh: "还没有盖印。从今天这一候开始吧。", en: "No seals yet. Begin with today's season." },
    now: { ja: "いま", zh: "现在", en: "now" }
  };
  function tr(k, lang) { return (L[k][lang] || L[k].ja); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function num(id) { return parseInt(id.split("-")[1], 10); }
  function sealText(k, lang) { return KN(k, lang === "en" ? "ja" : lang).slice(0, 2); }
  function tilt(n) { return ((n * 37) % 13) - 6; }

  function render() {
    var lang = I.getLang();
    var current = null;
    try { current = window.Koyomi.getKoyomi(new Date()).kou.id; } catch (e) { current = null; }
    var stamps = store.all();
    document.getElementById("icTitle").textContent = tr("title", lang);
    document.title = tr("title", lang) + " -- " + I.t("site_title", lang);
    document.getElementById("icCount").textContent = store.count() + " / 72";
    document.getElementById("icLede").textContent = tr("lede", lang);

    var html = "";
    SEASONS.forEach(function (se, si) {
      var kous = data.kou.filter(function (k) {
        var s = data.sekki.filter(function (x) { return x.id === k.sekkiId; })[0];
        return s && s.season === se;
      }).sort(function (a, b) { return num(a.id) - num(b.id); });
      html += '<section class="ic-season" style="--acc:' + window.SekkiCommon.SEASON_COLORS[se] + '"><h2>' + esc(tr("season", lang)[si]) + '</h2><div class="ic-grid">';
      kous.forEach(function (k) {
        var n = num(k.id), got = stamps[n], isNow = k.id === current;
        var cls = got ? "is-got" : (isNow ? "is-now" : "is-wait");
        var label = KN(k, lang) + (got ? " · " + got : "");
        html += '<a class="ic-seal ' + cls + '" href="./kou.html?id=' + k.id + '" aria-label="' + esc(label) + '"' +
          (got ? ' style="--r:' + tilt(n) + 'deg"' : "") + ">" + esc(sealText(k, lang)) + "</a>";
      });
      html += "</div></section>";
    });

    var last = store.last(), lastHtml;
    if (last) {
      var k = data.kou.filter(function (x) { return num(x.id) === last.n; })[0];
      lastHtml = '<a class="ic-last" href="./kou.html?id=' + k.id + '"><img src="./assets/' + (window.SEKKI_EDITION === "cn" ? "scenes-cn/" : "scenes/") + last.n + '.webp" alt="">' +
        '<span><small>' + esc(tr("last", lang)) + "</small><b>" + esc(KN(k, lang)) + "</b><em>" + esc(last.date) + "</em></span></a>";
    } else {
      lastHtml = '<p class="ic-empty">' + esc(tr("empty", lang)) + "</p>";
    }
    document.getElementById("icBody").innerHTML = lastHtml + html;
  }

  document.addEventListener("DOMContentLoaded", render);
  document.addEventListener("sekkicho:langchange", render);
  window.addEventListener("pageshow", render);
})();
