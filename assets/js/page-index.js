(function () {
  "use strict";
  function KN(k, lang) { return window.SekkiKouName ? window.SekkiKouName.name(k, lang) : (k[lang] || k.ja); }


  var SEAL_L = {
    press: { ja: "この候の印を押す", zh: "盖下这一候的印", en: "Press this season's seal" },
    done: { ja: "押印済み · 印帳を見る", zh: "已盖印 · 查看印帐", en: "Sealed · open Seal Book" }
  };

  function renderActions(r, lang) {
    var el = document.getElementById("todayActions");
    var S = window.SekkiIncho;
    if (!el || !S) return;
    var n = window.SekkiScene ? window.SekkiScene.numberOf(r.kou.id) : parseInt(r.kou.id.split("-")[1], 10);
    var seal = KN(r.kou, lang).slice(0, 2);
    if (S.stampedSince(n, r.kouRange.start)) {
      el.innerHTML = '<a class="seal-done" href="./incho.html"><span class="seal-mark" aria-hidden="true">' + seal + "</span>" +
        (SEAL_L.done[lang] || SEAL_L.done.ja) + "</a>";
    } else {
      el.innerHTML = '<button type="button" class="seal-press"><span class="seal-mark" aria-hidden="true">' + seal + "</span>" +
        (SEAL_L.press[lang] || SEAL_L.press.ja) + "</button>";
      el.querySelector("button").addEventListener("click", function () {
        if (!S.stamp(n)) return;
        el.classList.add("is-stamping");
        setTimeout(function () { el.classList.remove("is-stamping"); renderActions(r, lang); }, 700);
      });
    }
  }

  function render() {
    var lang = window.SekkiI18n.getLang();
    var r = window.Koyomi.getKoyomi(new Date());
    var t = window.SekkiI18n.t;
    var fmt = window.SekkiCommon.formatDate;

    var heroEl = document.getElementById("kouHero");
    heroEl.innerHTML = "";
    var heroName = document.createElement("span");
    heroName.className = "kou-hero-name";
    heroName.textContent = KN(r.kou, lang);
    heroEl.appendChild(heroName);
    // under the vertical name: kana reading in Japanese, 節気・候 in Chinese
    var under = lang === "ja" ? r.kou.jaReading
      : lang === "zh" ? r.sekki.zh + "·" + t("kou_order_" + r.kouIndexInSekki, lang) : "";
    if (under) {
      var heroFurigana = document.createElement("span");
      heroFurigana.className = "kou-hero-furigana";
      heroFurigana.textContent = under;
      heroEl.appendChild(heroFurigana);
    }

    var sceneEl = document.getElementById("kouScene");
    if (sceneEl && window.SekkiScene) {
      window.SekkiScene.show(sceneEl, window.SekkiScene.numberOf(r.kou.id), { fade: !document.documentElement.classList.contains("native-shell") });
      sceneEl.setAttribute("aria-label", KN(r.kou, lang) + (r.kou.jaReading && lang === "ja" ? "（" + r.kou.jaReading + "）" : ""));
    }

    document.getElementById("sekkiName").textContent = r.sekki[lang];
    document.getElementById("sekkiSeason").textContent = (lang === "en" ? "(" : "（") + t("season_" + r.sekki.season, lang) + (lang === "en" ? ")" : "）");

    document.getElementById("kouOrderBadge").textContent = t("kou_order_" + r.kouIndexInSekki, lang);
    document.getElementById("kouReading").textContent = r.kou.jaReading ? r.kou.ja + "（" + r.kou.jaReading + "）" : "";
    var cnEl = document.getElementById("kouCnNote");
    if (cnEl) { var cn = window.SekkiKouName ? window.SekkiKouName.cnNote(r.kou, lang) : ""; cnEl.textContent = cn; cnEl.hidden = !cn; }

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

    var affiliateEl = document.getElementById("affiliateSection");
    if (affiliateEl && window.SekkiAffiliate) {
      window.SekkiAffiliate.renderCard(affiliateEl, r.kou.id, lang);
    }

    renderActions(r, lang);

    document.title = (lang === "ja" ? r.kou.ja + "／" + r.sekki.ja : KN(r.kou, lang) + " / " + r.sekki[lang]) + " -- 節気帖";
  }

  // App only: the painting stays put while a sheet of paper rises over it.
  // Everything after the scene is gathered into one .today-paper so it can
  // carry a single rounded top edge and shadow.
  function buildPaper() {
    if (!document.documentElement.classList.contains("native-shell")) return;
    var scene = document.getElementById("kouScene");
    if (!scene || document.querySelector(".today-paper")) return;
    document.documentElement.classList.add("has-today-scene");
    var paper = document.createElement("div");
    paper.className = "today-paper";
    ["today-sheet", "story-card", "cn-extras", "almanac", "today-actions"].forEach(function (cls) {
      var el = document.querySelector("main ." + cls);
      if (el) paper.appendChild(el);
    });
    var notify = document.getElementById("notifySection");
    if (notify) paper.appendChild(notify);
    scene.parentNode.insertBefore(paper, scene.nextSibling);

    var hero = document.querySelector(".kou-hero");
    if (hero) scene.appendChild(hero); // the title slip stays pasted on the painting
    var hint = document.createElement("span");
    hint.className = "scene-hint";
    hint.setAttribute("aria-hidden", "true");
    scene.appendChild(hint);
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var ticking = false, hintShown = null;
    function onScroll() {
      ticking = false;
      var h = scene.offsetHeight || 1;
      var p = Math.min(1, Math.max(0, window.scrollY / (h * 0.85)));
      scene.style.setProperty("--cover", p.toFixed(3));
      if (hero) hero.style.opacity = String(1 - Math.min(1, p * 1.8));
      // the painting is shown alone until the user scrolls; a little
      // hysteresis keeps the bars from flickering around the threshold
      var y = window.scrollY;
      if (window.SekkiShell) {
        if (y > 48) window.SekkiShell.setImmersive(false);
        else if (y < 8) window.SekkiShell.setImmersive(true);
      }
      var atTop = y < 8;
      if (atTop !== hintShown) {
        hintShown = atTop;
        hint.classList.toggle("is-gone", !atTop);
        if (atTop) { hint.classList.remove("is-bob"); void hint.offsetWidth; hint.classList.add("is-bob"); }
      }
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    if (reduce) scene.classList.add("is-still");
    onScroll();
  }

  document.addEventListener("DOMContentLoaded", function () { buildPaper(); render(); });
  document.addEventListener("sekkicho:langchange", render);
})();
