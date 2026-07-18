(function () {
  "use strict";

  // 節気帖 signature visual: the "72 Micro-Seasons Wheel" (七十二候年輪).
  // Pure JS + inline SVG, no external resources. Draws 72 tick marks around
  // a circle (one per kou), four season-colored quarter arcs, highlights
  // today's kou, and links every tick to its entry on koyomi.html.

  var NS = "http://www.w3.org/2000/svg";
  var SEASON_ORDER = ["spring", "summer", "autumn", "winter"];
  var TOTAL_KOU = 72;

  function polar(cx, cy, r, angleDeg) {
    // angleDeg = 0 is straight up (12 o'clock), increasing clockwise.
    var rad = (angleDeg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function svgEl(name, attrs) {
    var el = document.createElementNS(NS, name);
    for (var key in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, key)) {
        el.setAttribute(key, attrs[key]);
      }
    }
    return el;
  }

  function kouGlobalIndex(kouId) {
    // kou ids are "kou-01".."kou-72", already in chronological order in
    // data.js. Parsing the numeric suffix gives a stable 1-72 order without
    // touching data.js/koyomi.js.
    return parseInt(kouId.split("-")[1], 10);
  }

  function buildWheel(containerId) {
    var container = document.getElementById(containerId);
    if (!container || !window.SEKKI_DATA || !window.Koyomi) return;

    var lang = window.SekkiI18n.getLang();
    var t = window.SekkiI18n.t;
    var common = window.SekkiCommon;
    var data = window.SEKKI_DATA;

    var sekkiById = {};
    data.sekki.forEach(function (s) {
      sekkiById[s.id] = s;
    });

    var kouList = data.kou.slice().sort(function (a, b) {
      return kouGlobalIndex(a.id) - kouGlobalIndex(b.id);
    });

    var todayResult;
    try {
      todayResult = window.Koyomi.getKoyomi(new Date());
    } catch (e) {
      todayResult = null;
    }
    var todayKouId = todayResult && todayResult.kou ? todayResult.kou.id : null;

    var size = 300;
    var cx = size / 2;
    var cy = size / 2;
    var outerR = size / 2 - 20;
    var tickInnerR = outerR - 12;
    var tickInnerRToday = outerR - 22;
    var arcR = outerR + 8;

    var svg = svgEl("svg", {
      viewBox: "0 0 " + size + " " + size,
      width: "100%",
      height: "100%",
      class: "kou-wheel-svg",
      role: "img",
      "aria-label": t("wheel_aria_label", lang)
    });

    // Four season-colored quarter arcs (18 kou = 90deg each), starting at
    // the top (risshun / start of spring).
    SEASON_ORDER.forEach(function (season, si) {
      var startAngle = si * 90;
      var endAngle = startAngle + 90;
      var p1 = polar(cx, cy, arcR, startAngle);
      var p2 = polar(cx, cy, arcR, endAngle);
      var path = svgEl("path", {
        d: "M " + p1.x.toFixed(2) + " " + p1.y.toFixed(2) +
          " A " + arcR + " " + arcR + " 0 0 1 " + p2.x.toFixed(2) + " " + p2.y.toFixed(2),
        fill: "none",
        stroke: common.SEASON_COLORS[season],
        "stroke-width": "1.5",
        opacity: "0.55"
      });
      svg.appendChild(path);
    });

    // 72 tick marks, one per kou.
    kouList.forEach(function (k, idx) {
      var angle = idx * (360 / TOTAL_KOU);
      var sekki = sekkiById[k.sekkiId];
      if (!sekki) return;
      var isToday = k.id === todayKouId;
      var color = common.SEASON_COLORS[sekki.season];

      var innerR = isToday ? tickInnerRToday : tickInnerR;
      var p1 = polar(cx, cy, outerR, angle);
      var p2 = polar(cx, cy, innerR, angle);

      var a = svgEl("a", { href: "./koyomi.html#" + k.id });
      var titleEl = svgEl("title", {});
      titleEl.textContent = k[lang] + " -- " + sekki[lang];
      a.appendChild(titleEl);

      var line = svgEl("line", {
        x1: p1.x.toFixed(2),
        y1: p1.y.toFixed(2),
        x2: p2.x.toFixed(2),
        y2: p2.y.toFixed(2),
        stroke: isToday ? color : "#3A362E",
        "stroke-opacity": isToday ? "1" : "0.32",
        "stroke-width": isToday ? "2.5" : "1",
        "stroke-linecap": "round"
      });
      a.appendChild(line);

      if (isToday) {
        var dotP = polar(cx, cy, outerR + 7, angle);
        var dot = svgEl("circle", {
          cx: dotP.x.toFixed(2),
          cy: dotP.y.toFixed(2),
          r: "3.2",
          fill: color
        });
        a.appendChild(dot);
      }

      svg.appendChild(a);
    });

    // Start-of-cycle marker ("立春", translated) at the top of the wheel.
    var startSekki = sekkiById.risshun;
    if (startSekki) {
      var labelP = polar(cx, cy, arcR + 12, 0);
      var startLabel = svgEl("text", {
        x: labelP.x.toFixed(2),
        y: labelP.y.toFixed(2),
        "text-anchor": "middle",
        class: "kou-wheel-start-label"
      });
      startLabel.textContent = startSekki[lang];
      svg.appendChild(startLabel);
    }

    container.innerHTML = "";
    container.appendChild(svg);

    // Center overlay (plain HTML, easier to style/i18n than SVG text).
    var center = document.createElement("div");
    center.className = "kou-wheel-center";
    var orderNum = todayKouId ? kouGlobalIndex(todayKouId) : null;

    var big = document.createElement("p");
    big.className = "kou-wheel-order";
    big.textContent = orderNum !== null
      ? t("wheel_order_prefix", lang) + orderNum + t("wheel_order_suffix", lang)
      : "";
    center.appendChild(big);

    var small = document.createElement("p");
    small.className = "kou-wheel-label";
    small.textContent = t("wheel_center_label", lang);
    center.appendChild(small);

    container.appendChild(center);

    container.setAttribute("role", "img");
    container.setAttribute("aria-label", t("wheel_aria_label", lang));
  }

  window.SekkiWheel = { buildWheel: buildWheel };

  function renderIfPresent() {
    if (document.getElementById("kouWheel")) buildWheel("kouWheel");
  }

  document.addEventListener("DOMContentLoaded", renderIfPresent);
  document.addEventListener("sekkicho:langchange", renderIfPresent);
})();
