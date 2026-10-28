/* 節気帖 -- native chrome for the App Store build (v1.1 prototype).
   Under the Capacitor shell the web header, season band and footer are
   hidden and the system UINavigationBar + UITabBar take over (Liquid Glass
   on iOS 26+), via @capgo/capacitor-native-navigation. The web pages are
   untouched: everything below returns early outside the native shell. */
(function () {
  var C = window.Capacitor;
  if (!C || typeof C.isNativePlatform !== "function" || !C.isNativePlatform()) return;
  var NN = C.Plugins && C.Plugins.NativeNavigation;
  if (!NN) return;

  document.documentElement.classList.add("native-shell");

  // v1.1 美工: three tabs -- 今 (living painting) / 絵巻 (the year scroll) /
  // 印帳 (seal book). 暦, 候 pages and the old lists open as child pages.
  var TAB_TITLE = {
    today: { ja: "今", zh: "今", en: "Now" },
    emaki: { ja: "絵巻", zh: "绘卷", en: "Scroll" },
    incho: { ja: "印帳", zh: "印帐", en: "Seals" }
  };
  var PAGES = {
    "index.html": { tab: "today" },
    "emaki.html": { tab: "emaki" },
    "incho.html": { tab: "incho" },
    "calendar.html": { tab: "today", child: true, back: "today" },
    "kou.html": { tab: "emaki", child: true, back: "emaki" },
    "koyomi.html": { tab: "emaki", child: true, back: "emaki" },
    "sekki.html": { tab: "emaki", child: true, back: "emaki" },
    "about.html": { about: true, child: true, titleKey: "nav_about" }
  };
  var TAB_URL = { today: "./index.html", emaki: "./emaki.html", incho: "./incho.html" };

  var file = window.location.pathname.split("/").pop() || "index.html";
  var page = PAGES[file] || PAGES["index.html"];
  // 設定 (about) opens as a child of the tab it was reached from, so the tab
  // bar stays on screen there and on the way back (?from=today|emaki|incho).
  if (page.about) {
    var from = (window.location.search.match(/[?&]from=(today|emaki|incho)\b/) || [])[1] || "today";
    page = { about: true, child: true, tab: from, back: from, titleKey: page.titleKey };
  }

  // 今 opens immersive: the painting alone, no tab bar and no settings button.
  // page-index.js turns it on at load and off as soon as the user scrolls.
  var immersive = false;
  var animateNext = false; // immersive toggles slide the bars instead of snapping

  function accent() {
    var v = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    return v || "#6B6457";
  }

  function render() {
    var I = window.SekkiI18n;
    var lang = I.getLang();
    var isAbout = !!page.about;
    var isChild = !!page.child;

    NN.setNavbar({
      // Tab pages keep their own Mincho page title; the system title font
      // (SF) clashes with the serif type, so the bar carries no title there.
      title: isAbout ? I.t(page.titleKey, lang) : "",
      large: false,
      transparent: true,
      animated: animateNext,
      backButton: {
        visible: isChild,
        title: TAB_TITLE[page.back] ? (TAB_TITLE[page.back][lang] || TAB_TITLE[page.back].ja) : ({ ja: "戻る", zh: "返回", en: "Back" })[lang] || "戻る"
      },
      rightItems: (isChild || immersive) ? [] : [{
        id: "settings",
        accessibilityLabel: I.t("nav_about", lang),
        icon: { ios: { sfSymbol: "gearshape" } }
      }]
    });

    NN.setTabbar({
      selectedId: page.tab || undefined,
      hidden: immersive,
      animated: animateNext,
      colors: { tint: accent(), inactiveTint: "#6B6457" },
      tabs: [
        { id: "today", title: TAB_TITLE.today[lang] || "今",
          icon: { ios: { sfSymbol: "sun.horizon" } }, selectedIcon: { ios: { sfSymbol: "sun.horizon.fill" } } },
        { id: "emaki", title: TAB_TITLE.emaki[lang] || "絵巻",
          icon: { ios: { sfSymbol: "scroll" } }, selectedIcon: { ios: { sfSymbol: "scroll.fill" } } },
        { id: "incho", title: TAB_TITLE.incho[lang] || "印帳",
          icon: { ios: { sfSymbol: "seal" } }, selectedIcon: { ios: { sfSymbol: "seal.fill" } } }
      ]
    });
  }

  // About doubles as the settings screen in the app: the language switch
  // moves out of the (hidden) header into the page body.
  function moveLangSwitch() {
    if (!page.about) return;
    var sw = document.querySelector(".site-header .lang-switch");
    var host = document.querySelector("main .wrap");
    if (sw && host) host.insertBefore(sw, host.firstChild);
  }

  NN.configure({ contentInsetMode: "css" });

  NN.addListener("tabSelect", function (e) {
    if ((e.id !== page.tab || page.child) && TAB_URL[e.id]) window.location.replace(TAB_URL[e.id]);
  });
  NN.addListener("navbarItemTap", function (e) {
    if (e.id === "settings") window.location.href = "./about.html?from=" + (page.tab || "today");
  });
  NN.addListener("navbarBack", function () {
    window.history.back();
  });

  document.addEventListener("DOMContentLoaded", function () {
    moveLangSwitch();
    // common.js applies the season accent on DOMContentLoaded too; defer one
    // tick so the tab tint picks it up.
    setTimeout(render, 0);
  });
  document.addEventListener("sekkicho:langchange", render);
  // Coming back with history.back() can restore a page from WKWebView's
  // back-forward cache without re-running DOMContentLoaded, while the native
  // bars still hold the previous page's state -- so re-apply them on show.
  window.addEventListener("pageshow", function (e) { if (e.persisted) render(); });

  window.SekkiShell = {
    setImmersive: function (on) {
      if (page.tab !== "today" || page.child || on === immersive) return;
      immersive = on;
      document.documentElement.classList.toggle("is-immersive", on);
      animateNext = true;
      render();
      animateNext = false;
    }
  };
})();
