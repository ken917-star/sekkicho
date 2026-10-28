/* 節気帖 -- which edition to show.
   ja → 日本版 (本朝七十二候, JST, 江户风俗画)   zh / en → 中国版 (中国七十二候, 北京时间, 宋代风俗画)
   Must load after data.js and data-cn.js and BEFORE koyomi.js, so that the
   default Koyomi instance is built on the right dataset. Switching language
   across editions reloads the page. */
(function (root) {
  "use strict";
  function lang() {
    try {
      var s = root.localStorage && root.localStorage.getItem("sekkicho_lang");
      if (s === "ja" || s === "zh" || s === "en") return s;
    } catch (e) { /* storage blocked */ }
    var n = ((root.navigator && (root.navigator.language || "")) + "").toLowerCase();
    return n.indexOf("zh") === 0 ? "zh" : n.indexOf("ja") === 0 ? "ja" : "en";
  }
  var loadedLang = lang();
  var edition = loadedLang === "ja" ? "jp" : "cn";
  root.SEKKI_EDITION = edition;
  if (edition === "cn" && root.SEKKI_DATA_CN) {
    root.SEKKI_DATA_JP = root.SEKKI_DATA;
    root.SEKKI_DATA = root.SEKKI_DATA_CN;
  }
  if (root.document) {
    root.document.documentElement.setAttribute("data-edition", edition);
    root.document.addEventListener("sekkicho:langchange", function () {
      if ((lang() === "ja" ? "jp" : "cn") !== edition) root.location.reload();
    });
    // history.back() may restore this page from the back-forward cache after
    // the language was changed elsewhere (設定) -- reload so it isn't stale.
    root.addEventListener("pageshow", function (e) {
      if (e.persisted && lang() !== loadedLang) root.location.reload();
    });
  }
})(typeof window !== "undefined" ? window : this);
