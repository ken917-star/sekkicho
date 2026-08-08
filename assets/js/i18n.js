(function (root) {
  "use strict";

  // Static UI-chrome translations (page skeleton text). Content coming from
  // data.js (sekki/kou names, readings, food, flower) is NOT here -- that is
  // rendered directly from SEKKI_DATA's own ja/zh/en fields depending on the
  // current language. This file only covers labels, nav, headings, etc.

  var STRINGS = {
    ja: {
      site_title: "節気帖",
      site_subtitle: "七十二候・二十四節気",
      nav_today: "今日",
      nav_koyomi: "七十二候",
      nav_sekki: "二十四節気",
      nav_about: "について",
      nav_academy: "弘顕精舎へ戻る",
      lang_label: "言語",
      today_current_sekki: "今の節気",
      today_current_kou: "今の候",
      kou_order_1: "初候",
      kou_order_2: "次候",
      kou_order_3: "末候",
      today_period: "この候の期間",
      today_progress: "節気の中の進み",
      today_story_title: "季節のものがたり",
      today_food_title: "旬の食材",
      today_flower_title: "季の花",
      today_sekki_reading_link: "この節気について読む",
      koyomi_page_title: "七十二候一覧",
      koyomi_page_lead: "一年をさらに五日刻みに分けた、七十二の小さな季節のことば。",
      sekki_page_title: "二十四節気読本",
      sekki_page_lead: "太陽の運行にもとづく、一年を二十四に分けた季節の節目。",
      about_page_title: "節気帖について",
      season_spring: "春",
      season_summer: "夏",
      season_autumn: "秋",
      season_winter: "冬",
      food_none: "—",
      footer_note: "データはすべて端末内に保存され、通信は発生しません。",
      footer_link_about: "について・プライバシー",
      back_to_today: "今日へ戻る",
      reference_year: "年",
      about_data_title: "データについて",
      about_data_body: "二十四節気の日付は 2025年から2032年まで内蔵されており、天文計算に基づく暦表と照合したうえで固定値として保持しています。七十二候は各節気を五日ずつ三つに分けたもので、初候・次候・末候それぞれに古暦にもとづく候名と、旬の食材・季の花を添えた読み物として収録しています。",
      about_privacy_title: "プライバシー",
      about_privacy_body: "節気帖はアカウント登録を必要とせず、位置情報・通知・カメラ・マイクなどの端末権限も一切要求しません。解析ツールや広告SDKは組み込まれておらず、外部サーバーへの通信は発生しません。すべての候・節気データはアプリ内に同梱されており、オフラインで完結します。",
      about_offline_title: "オフラインで動作",
      about_offline_body: "一度読み込めば、以降はネットワーク接続がなくても閲覧できます。",
      lang_ja: "日本語",
      lang_zh: "中文",
      lang_en: "English",
      notfound_body: "お探しのページは見つかりませんでした。",
      site_tagline: "一年を七十二の季節に分ける、いにしえの暦。",
      intro_title: "はじめての方へ",
      intro_sekki_title: "二十四節気とは",
      intro_sekki_body: "太陽の運行を24等分した、季節の大きな節目。",
      intro_kou_title: "七十二候とは",
      intro_kou_body: "節気をさらに三分した、五日ごとの小さな季節。",
      intro_usage_title: "この頁の使い方",
      intro_usage_body: "毎日開いて、季節の進みと物語をひとつ読む。",
      wheel_order_prefix: "第",
      wheel_order_suffix: "候",
      wheel_center_label: "七十二候のいま",
      wheel_aria_label: "七十二候の年輪図",
      wheel_start_marker_note: "起点",
      entry_now_label: "いま",
      affiliate_section_title: "この時期の楽しみ",
      affiliate_link_label: "楽天で見る →",
      about_affiliate_note: "外部ショップへのリンクにはアフィリエイトリンクが含まれる場合があります。"
    },
    zh: {
      site_title: "節気帖",
      site_subtitle: "七十二候・二十四节气",
      nav_today: "今日",
      nav_koyomi: "七十二候",
      nav_sekki: "二十四节气",
      nav_about: "关于",
      nav_academy: "返回弘顕精舎主页",
      lang_label: "语言",
      today_current_sekki: "当前节气",
      today_current_kou: "当前候",
      kou_order_1: "初候",
      kou_order_2: "次候",
      kou_order_3: "末候",
      today_period: "本候日期区间",
      today_progress: "节气内进度",
      today_story_title: "季节物语",
      today_food_title: "旬の食材",
      today_flower_title: "季节之花",
      today_sekki_reading_link: "阅读本节气长文",
      koyomi_page_title: "七十二候一览",
      koyomi_page_lead: "将一年再细分为五日一候，七十二段微小的时节词句。",
      sekki_page_title: "二十四节气读本",
      sekki_page_lead: "依太阳运行而定，将一年分为二十四段的时节标记。",
      about_page_title: "关于節気帖",
      season_spring: "春",
      season_summer: "夏",
      season_autumn: "秋",
      season_winter: "冬",
      food_none: "—",
      footer_note: "所有数据均保存于本机，不产生任何网络通信。",
      footer_link_about: "关于・隐私说明",
      back_to_today: "返回今日",
      reference_year: "年",
      about_data_title: "关于数据",
      about_data_body: "二十四节气的日期内置了2025年至2032年的数值，均已与天文历算表交叉核对后固定写入。七十二候则将每个节气再分为初候、次候、末候三个五日单元，各自收录了源自古历的候名，以及对应的旬の食材与季节之花。",
      about_privacy_title: "隐私说明",
      about_privacy_body: "節気帖无需注册账号，也不会请求定位、通知、相机或麦克风等任何系统权限。应用内不含任何统计分析工具或广告SDK，也不会向任何服务器发起网络请求。全部节气与候的数据均随应用内置，可完全离线使用。",
      about_offline_title: "离线可用",
      about_offline_body: "首次加载完成后，即使没有网络连接也可以继续浏览。",
      lang_ja: "日本語",
      lang_zh: "中文",
      lang_en: "English",
      notfound_body: "未能找到您要访问的页面。",
      site_tagline: "把一年分成七十二个小季节的古老历法。",
      intro_title: "初次访问",
      intro_sekki_title: "何谓二十四节气",
      intro_sekki_body: "依太阳运行将一年分为24段的季节节点。",
      intro_kou_title: "何谓七十二候",
      intro_kou_body: "把节气再分三段，每五日一候的微小季节。",
      intro_usage_title: "本页使用方法",
      intro_usage_body: "每天打开，看看季节走到哪，读一段物语。",
      wheel_order_prefix: "第",
      wheel_order_suffix: "候",
      wheel_center_label: "七十二候之今",
      wheel_aria_label: "七十二候年轮图",
      wheel_start_marker_note: "起点",
      entry_now_label: "此刻",
      affiliate_section_title: "本候的时令雅趣",
      affiliate_link_label: "前往乐天查看 →",
      about_affiliate_note: "指向外部商店的链接可能包含联盟（affiliate）返利链接。"
    },
    en: {
      site_title: "Sekkicho",
      site_subtitle: "72 Micro-Seasons & 24 Solar Terms",
      nav_today: "Today",
      nav_koyomi: "72 Seasons",
      nav_sekki: "24 Solar Terms",
      nav_about: "About",
      nav_academy: "Return to Koken Shoja",
      lang_label: "Language",
      today_current_sekki: "Current Solar Term",
      today_current_kou: "Current Micro-Season",
      kou_order_1: "First Pentad",
      kou_order_2: "Second Pentad",
      kou_order_3: "Final Pentad",
      today_period: "Dates of This Pentad",
      today_progress: "Progress Through the Term",
      today_story_title: "A Season's Story",
      today_food_title: "In-Season Fare",
      today_flower_title: "Flower of the Season",
      today_sekki_reading_link: "Read about this solar term",
      koyomi_page_title: "The 72 Micro-Seasons",
      koyomi_page_lead: "A year divided further into five-day spans -- seventy-two small words for small seasons.",
      sekki_page_title: "The 24 Solar Terms",
      sekki_page_lead: "The year divided into twenty-four turning points, following the sun's path.",
      about_page_title: "About Sekkicho",
      season_spring: "Spring",
      season_summer: "Summer",
      season_autumn: "Autumn",
      season_winter: "Winter",
      food_none: "—",
      footer_note: "All data lives on this device. No network requests are made.",
      footer_link_about: "About & Privacy",
      back_to_today: "Back to Today",
      reference_year: "",
      about_data_title: "About the Data",
      about_data_body: "Dates for the 24 solar terms are built in for 2025 through 2032, cross-checked against astronomical almanac tables and fixed as static values. The 72 micro-seasons split each solar term into three five-day spans -- first, second, and final pentad -- each carrying a traditional name plus notes on in-season fare and the flower of the moment.",
      about_privacy_title: "Privacy",
      about_privacy_body: "Sekkicho requires no account, and never asks for location, notifications, camera, or microphone access. There is no analytics tooling or advertising SDK built in, and the app never makes a network request to any server. Every term and micro-season is bundled inside the app itself, so it works fully offline.",
      about_offline_title: "Works Offline",
      about_offline_body: "Once loaded, the whole site can be browsed with no network connection at all.",
      lang_ja: "日本語",
      lang_zh: "中文",
      lang_en: "English",
      notfound_body: "The page you were looking for could not be found.",
      site_tagline: "An old calendar that divides the year into 72 micro-seasons.",
      intro_title: "New Here?",
      intro_sekki_title: "The 24 Solar Terms",
      intro_sekki_body: "24 turning points marking the sun's yearly path.",
      intro_kou_title: "The 72 Micro-Seasons",
      intro_kou_body: "Each solar term split into three five-day spans.",
      intro_usage_title: "How to Use This Page",
      intro_usage_body: "Open daily to see how far the season has turned.",
      wheel_order_prefix: "Micro-Season No. ",
      wheel_order_suffix: "",
      wheel_center_label: "72 Micro-Seasons, Now",
      wheel_aria_label: "Wheel of the 72 micro-seasons",
      wheel_start_marker_note: "start",
      entry_now_label: "Now",
      affiliate_section_title: "Seasonal Delights",
      affiliate_link_label: "View on Rakuten →",
      about_affiliate_note: "Links to external shops may include affiliate links."
    }
  };

  var STORAGE_KEY = "sekkicho_lang";
  var SUPPORTED = ["ja", "zh", "en"];
  var DEFAULT_LANG = "ja";

  function getLang() {
    try {
      var stored = root.localStorage ? root.localStorage.getItem(STORAGE_KEY) : null;
      if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    } catch (e) {
      // localStorage unavailable (private mode etc.) -- fall back silently.
    }
    return DEFAULT_LANG;
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    try {
      if (root.localStorage) root.localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // ignore
    }
  }

  function t(key, lang) {
    lang = lang || getLang();
    var dict = STRINGS[lang] || STRINGS[DEFAULT_LANG];
    return dict[key] !== undefined ? dict[key] : (STRINGS[DEFAULT_LANG][key] || key);
  }

  function applyStaticI18n(lang) {
    lang = lang || getLang();
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute("data-i18n");
      nodes[i].textContent = t(key, lang);
    }
    var htmlEl = document.documentElement;
    htmlEl.setAttribute("lang", lang === "zh" ? "zh" : lang);
    var langButtons = document.querySelectorAll("[data-lang-switch]");
    for (var j = 0; j < langButtons.length; j++) {
      var btnLang = langButtons[j].getAttribute("data-lang-switch");
      if (btnLang === lang) {
        langButtons[j].setAttribute("aria-current", "true");
      } else {
        langButtons[j].removeAttribute("aria-current");
      }
    }
  }

  root.SekkiI18n = {
    SUPPORTED: SUPPORTED,
    DEFAULT_LANG: DEFAULT_LANG,
    getLang: getLang,
    setLang: setLang,
    t: t,
    applyStaticI18n: applyStaticI18n
  };
})(typeof window !== "undefined" ? window : this);
