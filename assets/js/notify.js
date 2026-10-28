/* 換候のお知らせ — opt-in local notification at the start of each kou.
 *
 * Native app only (Capacitor shell). On the web this file renders nothing.
 * Off by default; the notification permission is requested only when the
 * reader turns the switch on. Everything is scheduled on-device through
 * LocalNotifications -- no server, no push token, no network.
 */
(function () {
  "use strict";
  function KN(k, lang) { return window.SekkiKouName ? window.SekkiKouName.name(k, lang) : (k[lang] || k.ja); }


  var STORAGE_KEY = "sekkicho_notify";
  var HOUR = 8;            // local time the kou notice is delivered
  var MAX_PENDING = 60;    // iOS keeps at most 64 pending local notifications

  var TEXT = {
    ja: {
      title: "換候のお知らせ",
      body: "七十二候が移る日の朝8時に、新しい候の名をお知らせします。端末内だけで予約され、通信は発生しません。",
      on: "オン", off: "オフ",
      denied: "通知が許可されていません。「設定」アプリ › 節気帖 › 通知 からオンにできます。",
      order: ["初候", "次候", "末候"],
      noticeBody: function (sekki, order, no) { return "今日から" + sekki + "の" + order + "、第" + no + "候。"; }
    },
    zh: {
      title: "换候提醒",
      body: "每逢七十二候交替之日早上8点，告诉你新一候的名字。提醒只在本机预约，不产生任何网络通信。",
      on: "开", off: "关",
      denied: "尚未允许通知。可在「设置」› 節気帖 › 通知 中开启。",
      order: ["初候", "次候", "末候"],
      noticeBody: function (sekki, order, no) { return "今天起进入" + sekki + order + "，第" + no + "候。"; }
    },
    en: {
      title: "New pentad notice",
      body: "On the morning a new pentad begins (8:00), get its name as a quiet notice. Scheduled on this device only; nothing is sent anywhere.",
      on: "On", off: "Off",
      denied: "Notifications are not allowed. You can turn them on in Settings › 節気帖 › Notifications.",
      order: ["early pentad", "middle pentad", "late pentad"],
      noticeBody: function (sekki, order, no) { return sekki + ", " + order + " — pentad " + no + " of 72 begins today."; }
    }
  };

  function plugin() {
    var C = window.Capacitor;
    if (!C || typeof C.isNativePlatform !== "function" || !C.isNativePlatform()) return null;
    return (C.Plugins && C.Plugins.LocalNotifications) || null;
  }

  function lang() {
    var l = window.SekkiI18n ? window.SekkiI18n.getLang() : "ja";
    return TEXT[l] ? l : "ja";
  }

  function isEnabled() {
    try { return window.localStorage.getItem(STORAGE_KEY) === "1"; } catch (e) { return false; }
  }

  function setEnabled(v) {
    try { window.localStorage.setItem(STORAGE_KEY, v ? "1" : "0"); } catch (e) { /* ignore */ }
  }

  // Upcoming kou starts after today, straight from koyomi.js's timeline.
  function upcomingKou() {
    var instances = window.Koyomi.createKoyomi(window.SEKKI_DATA)._instances;
    var now = new Date();
    var todayStamp = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    var list = [];
    instances.forEach(function (inst) {
      inst.kouRanges.forEach(function (r) {
        if (r.startStamp > todayStamp) list.push({ sekki: inst.sekki, kou: r.kou, startStamp: r.startStamp });
      });
    });
    list.sort(function (a, b) { return a.startStamp - b.startStamp; });
    return list.slice(0, MAX_PENDING);
  }

  function buildNotifications() {
    var l = lang();
    var t = TEXT[l];
    return upcomingKou().map(function (item) {
      var d = new Date(item.startStamp);
      var at = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), HOUR, 0, 0);
      var k = item.kou;
      var no = parseInt(k.id.replace("kou-", ""), 10);
      var title = l === "ja" ? k.ja + "（" + k.jaReading + "）" : KN(k, l);
      return {
        id: Math.floor(item.startStamp / 86400000), // days since epoch: unique per kou start
        title: title,
        body: t.noticeBody(item.sekki[l], t.order[k.order - 1], no),
        schedule: { at: at, allowWhileIdle: true }
      };
    });
  }

  function cancelAll(LN) {
    return LN.getPending().then(function (res) {
      var pending = (res && res.notifications) || [];
      if (!pending.length) return;
      return LN.cancel({ notifications: pending.map(function (n) { return { id: n.id }; }) });
    });
  }

  // Re-run on every launch so the 60-notice window keeps sliding forward.
  function reschedule(LN) {
    return cancelAll(LN).then(function () {
      return LN.schedule({ notifications: buildNotifications() });
    });
  }

  function render(container, LN) {
    var t = TEXT[lang()];
    var on = isEnabled();
    container.innerHTML =
      '<section class="notify-card">' +
        '<div class="notify-head">' +
          '<h3 class="notify-title"></h3>' +
          '<button type="button" class="notify-switch" role="switch"></button>' +
        '</div>' +
        '<p class="notify-body"></p>' +
        '<p class="notify-denied" hidden></p>' +
      '</section>';
    var btn = container.querySelector(".notify-switch");
    var denied = container.querySelector(".notify-denied");
    container.querySelector(".notify-title").textContent = t.title;
    container.querySelector(".notify-body").textContent = t.body;
    denied.textContent = t.denied;

    function paint(state) {
      btn.setAttribute("aria-checked", state ? "true" : "false");
      btn.textContent = state ? t.on : t.off;
      btn.classList.toggle("is-on", state);
    }
    paint(on);

    btn.addEventListener("click", function () {
      if (isEnabled()) {
        setEnabled(false);
        paint(false);
        denied.hidden = true;
        cancelAll(LN).catch(function () {});
        return;
      }
      LN.requestPermissions().then(function (p) {
        if (p && p.display === "granted") {
          setEnabled(true);
          paint(true);
          denied.hidden = true;
          return reschedule(LN);
        }
        denied.hidden = false;
      }).catch(function () { denied.hidden = false; });
    });
  }

  function init() {
    var container = document.getElementById("notifySection");
    var LN = plugin();
    if (!container || !LN) return;
    render(container, LN);

    if (isEnabled()) {
      LN.checkPermissions().then(function (p) {
        if (p && p.display === "granted") return reschedule(LN);
        // Permission was revoked in Settings: reflect it instead of
        // pretending notices are still coming.
        setEnabled(false);
        render(container, LN);
      }).catch(function () {});
    }

    document.addEventListener("sekkicho:langchange", function () {
      render(container, LN);
      if (isEnabled()) reschedule(LN).catch(function () {});
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
