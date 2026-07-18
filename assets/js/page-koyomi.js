(function () {
  "use strict";

  var SEASON_ORDER = ["spring", "summer", "autumn", "winter"];

  function render() {
    var lang = window.SekkiI18n.getLang();
    var t = window.SekkiI18n.t;
    var data = window.SEKKI_DATA;

    var sekkiById = {};
    data.sekki.forEach(function (s) {
      sekkiById[s.id] = s;
    });

    var container = document.getElementById("koyomiList");
    container.innerHTML = "";

    SEASON_ORDER.forEach(function (season) {
      var seasonSekki = data.sekki.filter(function (s) {
        return s.season === season;
      });
      if (seasonSekki.length === 0) return;

      var group = document.createElement("section");
      group.className = "season-group";

      var h2 = document.createElement("h2");
      var jaZhLabel = document.createElement("span");
      jaZhLabel.textContent = t("season_" + season, lang);
      h2.appendChild(jaZhLabel);
      var enLabel = document.createElement("span");
      enLabel.className = "season-en";
      enLabel.textContent = t("season_" + season, "en");
      h2.appendChild(enLabel);
      group.appendChild(h2);

      seasonSekki.forEach(function (s) {
        var kouList = data.kou.filter(function (k) {
          return k.sekkiId === s.id;
        }).sort(function (a, b) {
          return a.order - b.order;
        });

        kouList.forEach(function (k) {
          var card = document.createElement("article");
          card.className = "entry-card";
          card.id = k.id;

          var header = document.createElement("div");
          header.className = "entry-header";

          var order = document.createElement("span");
          order.className = "entry-order";
          order.textContent = t("kou_order_" + k.order, lang) + " -- " + s[lang];
          header.appendChild(order);

          var name = document.createElement("span");
          name.className = "entry-name";
          name.textContent = k[lang];
          header.appendChild(name);

          if (k.jaReading) {
            var reading = document.createElement("span");
            reading.className = "entry-reading";
            reading.textContent = k.ja + "（" + k.jaReading + "）";
            header.appendChild(reading);
          }

          card.appendChild(header);

          var desc = document.createElement("p");
          desc.className = "entry-desc";
          desc.textContent = k.desc[lang];
          card.appendChild(desc);

          var extra = document.createElement("div");
          extra.className = "entry-extra";

          var foodSpan = document.createElement("span");
          var foodStrong = document.createElement("strong");
          foodStrong.textContent = t("today_food_title", lang);
          foodSpan.appendChild(foodStrong);
          foodSpan.appendChild(document.createTextNode((k.food[lang] || []).join("・")));
          extra.appendChild(foodSpan);

          var flowerSpan = document.createElement("span");
          var flowerStrong = document.createElement("strong");
          flowerStrong.textContent = t("today_flower_title", lang);
          flowerSpan.appendChild(flowerStrong);
          flowerSpan.appendChild(document.createTextNode(k.flower[lang]));
          extra.appendChild(flowerSpan);

          card.appendChild(extra);
          group.appendChild(card);
        });
      });

      container.appendChild(group);
    });

    // Preserve the in-page anchor scroll position across a language switch.
    if (window.location.hash) {
      var target = document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView({ block: "start" });
    }
  }

  document.addEventListener("DOMContentLoaded", render);
  document.addEventListener("sekkicho:langchange", render);
})();
