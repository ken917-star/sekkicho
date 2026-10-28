/* 絵巻 -- the whole year as one endless handscroll: 72 paintings side by
   side, grouped under their 節気, opening on today's kou. The scroll is a
   ring -- past 大寒 it rolls straight on into 立春 again, joined by a narrow
   「周而復始」 strip -- so it is driven by our own drag/inertia engine
   instead of native overflow scrolling (which cannot wrap).

   Effects (all off under prefers-reduced-motion): the painting inside each
   panel drifts against the drag (parallax), panels away from the centre
   dim a little, the page wash follows the season at the centre, and the
   seal on the join strip lights up as the year turns over.

   The year bar under the scroll is a slider: drag or tap it to travel the
   year; a bubble names the kou while dragging. */
(function () {
  "use strict";
  function KN(k, lang) { return window.SekkiKouName ? window.SekkiKouName.name(k, lang) : (k[lang] || k.ja); }

  var I = window.SekkiI18n, data = window.SEKKI_DATA;
  var SEASONS = ["spring", "summer", "autumn", "winter"];
  var SEASON_LABEL = { ja: ["春", "夏", "秋", "冬"], zh: ["春", "夏", "秋", "冬"], en: ["Spring", "Summer", "Autumn", "Winter"] };
  var TITLE = { ja: "絵巻", zh: "绘卷", en: "Scroll" };
  var NOW = { ja: "いま", zh: "今", en: "Now" };
  var JOIN = { ja: "めぐりて　また春", zh: "周而复始", en: "and round again" };
  var JOIN_SEAL = { ja: "巡", zh: "岁", en: "岁" };
  var SLIDER = { ja: "一年の位置", zh: "一年中的位置", en: "Place in the year" };
  var POS_KEY = "sekkicho.emaki.center";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var base = window.SEKKI_EDITION === "cn" ? "./assets/scenes-cn/" : "./assets/scenes/";

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function num(id) { return parseInt(id.split("-")[1], 10); }
  function mod(a, n) { return ((a % n) + n) % n; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  var current = null;
  try { current = window.Koyomi.getKoyomi(new Date()).kou.id; } catch (e) { current = null; }

  // ---- state ---------------------------------------------------------
  var stage, track, bar, dot, bubble, nowMark;
  var items = [];      // { el, img, shade, w, s, kou?, sekki?, join? }  in ring order
  var kouItems = [];   // the 72 kou items only (snap targets)
  var W = 0;           // ring length in px
  var VW = 0;          // viewport (stage) width
  var PH = 0;          // painting height
  var x = 0;           // ring coordinate of the stage's left edge (unbounded)
  var raf = 0, anim = null, lastSeason = null, joinLit = false;

  // ---- build ---------------------------------------------------------
  function render() {
    var lang = I.getLang();
    document.getElementById("ekTitle").textContent = TITLE[lang] || TITLE.ja;
    document.title = (TITLE[lang] || TITLE.ja) + " -- " + I.t("site_title", lang);

    var html = "";
    data.sekki.forEach(function (s) {
      var kous = data.kou.filter(function (k) { return k.sekkiId === s.id; }).sort(function (a, b) { return a.order - b.order; });
      kous.forEach(function (k, i) {
        var n = num(k.id), isNow = k.id === current;
        html += '<a class="ek-panel' + (isNow ? " is-now" : "") + (i === 0 ? " is-first" : "") + '" data-kou="' + k.id + '" data-season="' + s.season + '"' +
          ' style="--acc:' + window.SekkiCommon.SEASON_COLORS[s.season] + '" href="./kou.html?id=' + k.id + '"' + (isNow ? ' aria-current="date"' : "") + ">" +
          '<span class="ek-sk">' + (i === 0 ? esc(s[lang] || s.ja) : "") + "</span>" +
          '<span class="ek-frame"><img data-src="' + base + n + '.webp" alt="" decoding="async" draggable="false"><i class="ek-shade"></i>' +
          '<span class="ek-name">' + esc(KN(k, lang)) + "</span>" +
          (isNow ? '<span class="ek-seal">' + esc(NOW[lang] || NOW.ja) + "</span>" : "") +
          "</span></a>";
      });
    });
    html += '<div class="ek-join" aria-hidden="true"><span class="ek-sk"></span><span class="ek-frame"><span class="ek-join-text">' + esc(JOIN[lang] || JOIN.ja) +
      '</span><span class="ek-join-seal">' + esc(JOIN_SEAL[lang] || JOIN_SEAL.ja) + "</span></span></div>";
    track.innerHTML = html;

    items = []; kouItems = [];
    Array.prototype.forEach.call(track.children, function (el) {
      var it = { el: el, img: el.querySelector("img"), shade: el.querySelector(".ek-shade"), join: el.classList.contains("ek-join"),
        kou: el.dataset.kou || null, season: el.dataset.season || null, w: 0, s: 0, loaded: false, on: true };
      items.push(it);
      if (it.kou) kouItems.push(it);
    });

    var seasons = document.getElementById("ekSeasons");
    seasons.innerHTML = SEASONS.map(function (se, i) {
      return '<button type="button" data-season="' + se + '" style="--acc:' + window.SekkiCommon.SEASON_COLORS[se] + '">' + esc((SEASON_LABEL[lang] || SEASON_LABEL.ja)[i]) + "</button>";
    }).join("");
    Array.prototype.forEach.call(seasons.querySelectorAll("button"), function (b) {
      b.addEventListener("click", function () {
        var first = kouItems.filter(function (it) { return it.season === b.dataset.season; })[0];
        if (first) glideTo(nearest(centerX(first)), 900);
      });
    });
    bar.setAttribute("aria-label", SLIDER[lang] || SLIDER.ja);
    layout();
  }

  // ---- geometry --------------------------------------------------------
  function layout() {
    var keep = centerKou();
    VW = stage.clientWidth;
    var labelH = 22;
    PH = Math.max(160, stage.clientHeight - labelH);
    var pw = Math.round(PH / 2.4), jw = Math.max(44, Math.round(pw * 0.28)), s = 0;
    items.forEach(function (it) {
      it.w = it.join ? jw : pw;
      it.s = s; s += it.w;
      it.el.style.width = it.w + "px";
      if (it.img) { it.img.style.width = Math.round(PH / 1.5) + "px"; }
    });
    W = s;
    var now = nowItem();
    if (now) nowMark.style.left = (mod(centerX(now), W) / W * 100).toFixed(2) + "%";
    if (keep) centerOn(keep); else draw();
  }
  function centerX(it) { return it.s + it.w / 2; }
  function viewCenter() { return x + VW / 2; }
  function nowItem() { return kouItems.filter(function (it) { return it.kou === current; })[0] || null; }
  // the ring-equivalent of target x closest to where we are now
  function nearest(cx) { var t = cx - VW / 2; return x + (mod(t - x + W / 2, W) - W / 2); }
  function centerKou() {
    if (!W) return null;
    var c = mod(viewCenter(), W), best = null;
    kouItems.forEach(function (it) { if (c >= it.s && c < it.s + it.w) best = it; });
    if (!best) best = kouItems[0]; // on the join strip: count it as 立春's side
    return best && best.kou;
  }
  function centerOn(id) {
    var it = kouItems.filter(function (k) { return k.kou === id; })[0];
    if (it) x = centerX(it) - VW / 2;
    draw();
  }
  function snapTarget(fromX) {
    var c = fromX + VW / 2, cm = mod(c, W), best = null, bd = Infinity;
    kouItems.forEach(function (it) {
      var d = mod(centerX(it) - cm + W / 2, W) - W / 2;
      if (Math.abs(d) < Math.abs(bd)) { bd = d; best = it; }
    });
    return best ? fromX + bd : fromX;
  }

  // ---- paint -----------------------------------------------------------
  function draw() {
    if (!W) return;
    var half = VW / 2, preload = VW * 1.2;
    items.forEach(function (it) {
      var rel = mod(it.s - x + preload, W) - preload; // screen x of the item's left edge
      var vis = rel > -it.w - preload && rel < VW + preload;
      if (!vis) { if (it.on) { it.el.style.visibility = "hidden"; it.on = false; } return; }
      if (!it.on) { it.el.style.visibility = ""; it.on = true; }
      it.el.style.transform = "translate3d(" + rel.toFixed(1) + "px,0,0)";
      if (it.img && !it.loaded) { it.img.src = it.img.dataset.src; it.loaded = true; }
      if (rel > VW || rel < -it.w) return;
      var off = (rel + it.w / 2 - half) / half; // -1 … 1 across the screen
      if (it.img) {
        var spare = (PH / 1.5 - it.w) / 2;
        var drift = reduce ? 0 : clamp(-off, -1, 1) * spare * 0.55;
        it.img.style.transform = "translate3d(" + (-spare + drift).toFixed(1) + "px,0,0)";
      }
      if (it.shade && !reduce) it.shade.style.opacity = Math.min(0.32, Math.abs(off) * 0.26).toFixed(3);
    });

    // year bar
    var p = mod(viewCenter(), W) / W;
    dot.style.left = (p * 100).toFixed(2) + "%";
    var id = centerKou(), it = kouItems.filter(function (k) { return k.kou === id; })[0];
    if (it) {
      var idx = kouItems.indexOf(it);
      bar.setAttribute("aria-valuenow", String(idx + 1));
      var k = data.kou.filter(function (q) { return q.id === id; })[0];
      var lang = I.getLang();
      if (k) {
        var sk = data.sekki.filter(function (q) { return q.id === k.sekkiId; })[0];
        var label = (sk ? (sk[lang] || sk.ja) + " · " : "") + KN(k, lang);
        bar.setAttribute("aria-valuetext", label);
        bubble.textContent = label;
      }
      // keep the bubble on screen at either end of the bar
      var bw = bubble.offsetWidth, barW = bar.clientWidth;
      bubble.style.left = clamp(p * barW, bw / 2, Math.max(bw / 2, barW - bw / 2)).toFixed(1) + "px";
      if (it.season !== lastSeason) {
        lastSeason = it.season;
        document.documentElement.style.setProperty("--ek-wash", window.SekkiCommon.SEASON_COLORS[it.season]);
        Array.prototype.forEach.call(document.querySelectorAll("#ekSeasons button"), function (b) {
          b.setAttribute("aria-pressed", b.dataset.season === it.season ? "true" : "false");
        });
      }
    }
    // the join strip lights up while it passes the middle third
    var join = items[items.length - 1];
    if (join && join.join) {
      var jr = mod(join.s - x + VW, W) - VW + join.w / 2;
      var lit = jr > VW * 0.25 && jr < VW * 0.75;
      if (lit !== joinLit) { joinLit = lit; join.el.classList.toggle("is-lit", lit); }
    }
  }
  function frame() { raf = 0; draw(); }
  function schedule() { if (!raf) raf = requestAnimationFrame(frame); }

  // ---- motion ----------------------------------------------------------
  function stop() { if (anim) { cancelAnimationFrame(anim.id); anim = null; } }
  // momentum that lands exactly on a panel: exponential approach (iOS-like)
  function settle(target, tau) {
    stop();
    if (reduce) { x = target; draw(); save(); return; }
    var from = x, t0 = performance.now();
    anim = { id: 0 };
    (function step(now) {
      var t = now - t0, d = (target - from) * Math.exp(-t / tau);
      x = target - d; draw();
      if (Math.abs(d) < 0.4) { x = target; draw(); anim = null; save(); return; }
      anim.id = requestAnimationFrame(step);
    })(t0);
  }
  function glideTo(target, ms) {
    stop();
    if (reduce) { x = target; draw(); save(); return; }
    var from = x, t0 = performance.now();
    anim = { id: 0 };
    (function step(now) {
      var p = Math.min(1, (now - t0) / ms), e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      x = from + (target - from) * e; draw();
      if (p >= 1) { anim = null; save(); return; }
      anim.id = requestAnimationFrame(step);
    })(t0);
  }
  function save() { try { sessionStorage.setItem(POS_KEY, centerKou() || ""); } catch (e) { /* storage blocked */ } }

  // ---- drag the scroll ---------------------------------------------------
  function bindDrag() {
    var down = null, samples = [], dragged = false, suppressClick = false;
    stage.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) return;
      stop();
      down = { x: e.clientX, y: e.clientY, x0: x, id: e.pointerId, captured: false };
      samples = [{ t: performance.now(), x: e.clientX }];
      dragged = false;
    });
    stage.addEventListener("pointermove", function (e) {
      if (!down || e.pointerId !== down.id) return;
      var dx = e.clientX - down.x;
      if (!down.captured) {
        if (Math.abs(dx) < 7) return;
        if (Math.abs(e.clientY - down.y) > Math.abs(dx)) { down = null; return; } // vertical: let the page have it
        down.captured = true; dragged = true;
        try { stage.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ }
        stage.classList.add("is-dragging");
      }
      x = down.x0 - dx;
      samples.push({ t: performance.now(), x: e.clientX });
      if (samples.length > 6) samples.shift();
      schedule();
    });
    function release(e) {
      if (!down || e.pointerId !== down.id) return;
      var wasDrag = down.captured; down = null;
      stage.classList.remove("is-dragging");
      if (!wasDrag) return;
      suppressClick = true; setTimeout(function () { suppressClick = false; }, 60);
      var a = samples[0], b = samples[samples.length - 1], dt = Math.max(1, b.t - a.t);
      var v = (performance.now() - b.t > 90) ? 0 : -(b.x - a.x) / dt; // px per ms, in x terms
      var tau = 325;
      settle(snapTarget(x + v * tau), tau);
    }
    stage.addEventListener("pointerup", release);
    stage.addEventListener("pointercancel", release);
    // a drag must not also open the painting under the finger
    stage.addEventListener("click", function (e) { if (dragged && suppressClick) { e.preventDefault(); e.stopPropagation(); } dragged = false; }, true);

    var wheelT = 0;
    stage.addEventListener("wheel", function (e) {
      stop();
      x += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      e.preventDefault(); schedule();
      clearTimeout(wheelT);
      wheelT = setTimeout(function () { settle(snapTarget(x), 180); }, 140);
    }, { passive: false });

    stage.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      var it = kouItems.filter(function (k) { return k.kou === centerKou(); })[0], i = kouItems.indexOf(it);
      var nx = kouItems[mod(i + (e.key === "ArrowRight" ? 1 : -1), kouItems.length)];
      glideTo(nearest(centerX(nx)), 420);
    });
  }

  // ---- drag the year bar -------------------------------------------------
  function bindBar() {
    var on = null;
    function toX(clientX) {
      var r = bar.getBoundingClientRect();
      if (!r.width || !W) return x;
      return nearest(clamp((clientX - r.left) / r.width, 0, 0.99999) * W);
    }
    bar.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) return;
      stop();
      on = e.pointerId;
      try { bar.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ }
      bar.classList.add("is-active");
      // tap on the line glides there; then follows the finger
      glideTo(toX(e.clientX), 260);
      e.preventDefault();
    });
    bar.addEventListener("pointermove", function (e) {
      if (on !== e.pointerId) return;
      stop();
      // follow the finger, but don't wrap the long way when crossing 大寒→立春
      var r = bar.getBoundingClientRect();
      if (!r.width || !W) return;
      var p = clamp((e.clientX - r.left) / r.width, 0, 0.99999);
      var target = p * W - VW / 2, cycle = Math.floor((x + VW / 2) / W) * W;
      var cand = cycle + target, prev = x;
      if (Math.abs(cand - prev) > W / 2) cand += cand > prev ? -W : W;
      x = cand; schedule();
    });
    function end(e) {
      if (on !== e.pointerId) return;
      on = null; bar.classList.remove("is-active");
      settle(snapTarget(x), 160);
    }
    bar.addEventListener("pointerup", end);
    bar.addEventListener("pointercancel", end);
    bar.addEventListener("keydown", function (e) {
      var step = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      var it = kouItems.filter(function (k) { return k.kou === centerKou(); })[0], i = kouItems.indexOf(it);
      glideTo(nearest(centerX(kouItems[mod(i + step, kouItems.length)])), 300);
    });
  }

  // ---- boot --------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", function () {
    stage = document.getElementById("ekStage");
    track = document.getElementById("ekRoll");
    bar = document.getElementById("ekYear");
    dot = document.getElementById("ekYearDot");
    bubble = document.getElementById("ekBubble");
    nowMark = document.getElementById("ekYearNow");
    if (reduce) document.documentElement.classList.add("ek-reduce");
    render();
    var start = null;
    try { start = sessionStorage.getItem(POS_KEY); } catch (e) { start = null; }
    centerOn(start || current || (kouItems[0] && kouItems[0].kou));
    bindDrag(); bindBar();
    var rt = 0;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(layout, 120); });
  });
  document.addEventListener("sekkicho:langchange", function () { var c = centerKou(); render(); centerOn(c); });
})();
