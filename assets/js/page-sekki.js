(function () {
  "use strict";

  var SEASON_ORDER = ["spring", "summer", "autumn", "winter"];
  var MIN_YEAR = 2025;
  var MAX_YEAR = 2032;

  function referenceYear() {
    var y = new Date().getFullYear();
    if (y < MIN_YEAR) return MIN_YEAR;
    if (y > MAX_YEAR) return MAX_YEAR;
    return y;
  }

  function render() {
    var lang = window.SekkiI18n.getLang();
    var t = window.SekkiI18n.t;
    var data = window.SEKKI_DATA;
    var refYear = referenceYear();
    var common = window.SekkiCommon;
    var fmt = common.formatDate;

    var container = document.getElementById("sekkiList");
    container.innerHTML = "";

    SEASON_ORDER.forEach(function (season) {
      var seasonSekki = data.sekki.filter(function (s) {
        return s.season === season;
      });
      if (seasonSekki.length === 0) return;

      var seasonColor = common.SEASON_COLORS[season];

      var group = document.createElement("section");
      group.className = "season-group";

      var giant = document.createElement("span");
      giant.className = "season-giant";
      giant.setAttribute("aria-hidden", "true");
      giant.textContent = t("season_" + season, "ja");
      giant.style.color = common.hexToRgba(seasonColor, 0.15);
      group.appendChild(giant);

      var h2 = document.createElement("h2");
      h2.style.borderBottomColor = seasonColor;
      var label = document.createElement("span");
      label.textContent = t("season_" + season, lang);
      label.style.color = seasonColor;
      h2.appendChild(label);
      var enLabel = document.createElement("span");
      enLabel.className = "season-en";
      enLabel.textContent = t("season_" + season, "en");
      h2.appendChild(enLabel);
      group.appendChild(h2);

      seasonSekki.forEach(function (s) {
        var card = document.createElement("article");
        card.className = "sekki-entry";
        card.id = s.id;

        var header = document.createElement("div");
        header.className = "entry-header";

        var chip = document.createElement("span");
        chip.className = "sekki-color-chip";
        chip.setAttribute("aria-hidden", "true");
        chip.style.background = seasonColor;
        header.appendChild(chip);

        var name = document.createElement("span");
        name.className = "entry-name";
        name.textContent = s[lang];
        header.appendChild(name);

        if (s.ja !== s[lang]) {
          var reading = document.createElement("span");
          reading.className = "entry-reading";
          reading.textContent = s.ja;
          header.appendChild(reading);
        }

        card.appendChild(header);

        var mmdd = s.dates[refYear];
        if (mmdd) {
          var dates = document.createElement("p");
          dates.className = "entry-dates";
          var iso = refYear + "-" + mmdd;
          dates.textContent = fmt(iso, lang) + (lang === "ja" ? "ごろ" : "");
          card.appendChild(dates);
        }

        var desc = document.createElement("p");
        desc.className = "entry-desc";
        desc.textContent = s.reading[lang];
        card.appendChild(desc);

        group.appendChild(card);
      });

      container.appendChild(group);
    });

    if (window.location.hash) {
      var target = document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView({ block: "start" });
    }
  }

  document.addEventListener("DOMContentLoaded", render);
  document.addEventListener("sekkicho:langchange", render);
})();
