(function () {
  "use strict";

  function render() {
    var lang = window.SekkiI18n.getLang();
    var r = window.Koyomi.getKoyomi(new Date());
    var t = window.SekkiI18n.t;
    var fmt = window.SekkiCommon.formatDate;

    var heroEl = document.getElementById("kouHero");
    heroEl.innerHTML = "";
    var heroName = document.createElement("span");
    heroName.className = "kou-hero-name";
    heroName.textContent = r.kou[lang];
    heroEl.appendChild(heroName);
    if (r.kou.jaReading) {
      var heroFurigana = document.createElement("span");
      heroFurigana.className = "kou-hero-furigana";
      heroFurigana.textContent = r.kou.jaReading;
      heroEl.appendChild(heroFurigana);
    }

    document.getElementById("sekkiName").textContent = r.sekki[lang];
    document.getElementById("sekkiSeason").textContent = "(" + t("season_" + r.sekki.season, lang) + ")";

    document.getElementById("kouOrderBadge").textContent = t("kou_order_" + r.kouIndexInSekki, lang);
    document.getElementById("kouReading").textContent = r.kou.jaReading ? r.kou.ja + "（" + r.kou.jaReading + "）" : "";

    document.getElementById("kouDates").textContent =
      fmt(r.kouRange.start, lang) + " ~ " + fmt(r.kouRange.end, lang);

    var pct = Math.round(r.progress * 100);
    var segs = document.querySelectorAll("#progressLine .progress-seg");
    for (var i = 0; i < segs.length; i++) {
      var segNum = i + 1;
      segs[i].classList.remove("is-done", "is-current", "is-upcoming");
      if (segNum < r.kouIndexInSekki) {
        segs[i].classList.add("is-done");
      } else if (segNum === r.kouIndexInSekki) {
        segs[i].classList.add("is-current");
      } else {
        segs[i].classList.add("is-upcoming");
      }
    }
    document.getElementById("progressLabel").textContent = t("today_progress", lang) + "  " + pct + "%";

    document.getElementById("kouDesc").textContent = r.kou.desc[lang];

    var foodList = document.getElementById("foodList");
    foodList.innerHTML = "";
    var foods = r.kou.food[lang] || [];
    if (foods.length === 0) {
      var li0 = document.createElement("li");
      li0.textContent = t("food_none", lang);
      foodList.appendChild(li0);
    } else {
      foods.forEach(function (f) {
        var li = document.createElement("li");
        li.textContent = f;
        foodList.appendChild(li);
      });
    }

    document.getElementById("flowerName").textContent = r.kou.flower[lang];

    var link = document.getElementById("sekkiReadingLink");
    link.setAttribute("href", "./sekki.html#" + r.sekki.id);

    document.title = (lang === "ja" ? r.kou.ja + "／" + r.sekki.ja : r.kou[lang] + " / " + r.sekki[lang]) + " -- 節気帖";
  }

  document.addEventListener("DOMContentLoaded", render);
  document.addEventListener("sekkicho:langchange", render);
})();
