/* 節気帖 -- 暦 (perpetual calendar) lookups over the generated SEKKI_CAL
   table (calendar-data.js). Pure functions, no network, no storage.
   Everything is keyed by "YYYY-MM-DD" in Japan time. */
(function (root) {
  "use strict";

  var CAL = root.SEKKI_CAL;
  var DAY = 86400000;
  var SYNODIC = 29.530588853;

  var STEMS = "甲乙丙丁戊己庚辛壬癸";
  var BRANCHES = "子丑寅卯辰巳午未申酉戌亥";
  var KANJI_NUM = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

  var NAMES = {
    ja: {
      weekday: ["日", "月", "火", "水", "木", "金", "土"],
      monthName: ["睦月", "如月", "弥生", "卯月", "皐月", "水無月", "文月", "葉月", "長月", "神無月", "霜月", "師走"],
      rokuyo: ["大安", "赤口", "先勝", "友引", "先負", "仏滅"],
      moon: ["新月", "三日月", "上弦の月", "十日夜の月", "満月", "寝待月", "下弦の月", "有明月"],
      lunarLabel: "旧暦", leap: "閏",
      holidays: {
        ganjitsu: "元日", seijin: "成人の日", kenkoku: "建国記念の日", tennou: "天皇誕生日",
        shunbunNoHi: "春分の日", shouwa: "昭和の日", kenpou: "憲法記念日", midori: "みどりの日",
        kodomo: "こどもの日", umi: "海の日", yama: "山の日", keirou: "敬老の日",
        shuubunNoHi: "秋分の日", sports: "スポーツの日", bunka: "文化の日", kinrou: "勤労感謝の日",
        furikae: "振替休日", kokumin: "国民の休日"
      },
      events: {
        setsubun: "節分", hachijuhachiya: "八十八夜", nihyakutoka: "二百十日", nihyakuhatsuka: "二百二十日",
        higanIri: "彼岸入り", higanAke: "彼岸明け", nyuubai: "入梅", hangeshou: "半夏生",
        doyouIri: "土用入り", doyouUshi: "土用の丑の日",
        jinjitsu: "人日の節句", joushi: "桃の節句", tango: "端午の節句", tanabata: "七夕", chouyou: "重陽の節句",
        oomisoka: "大晦日", jugoya: "十五夜", jusanya: "十三夜"
      }
    },
    zh: {
      weekday: ["日", "一", "二", "三", "四", "五", "六"],
      monthName: ["睦月", "如月", "弥生", "卯月", "皐月", "水无月", "文月", "叶月", "长月", "神无月", "霜月", "师走"],
      rokuyo: ["大安", "赤口", "先胜", "友引", "先负", "佛灭"],
      moon: ["新月", "蛾眉月", "上弦月", "盈凸月", "满月", "亏凸月", "下弦月", "残月"],
      lunarLabel: "旧历", leap: "闰",
      holidays: {
        ganjitsu: "元日", seijin: "成人之日", kenkoku: "建国纪念日", tennou: "天皇诞生日",
        shunbunNoHi: "春分之日", shouwa: "昭和之日", kenpou: "宪法纪念日", midori: "绿之日",
        kodomo: "儿童节", umi: "海之日", yama: "山之日", keirou: "敬老之日",
        shuubunNoHi: "秋分之日", sports: "体育之日", bunka: "文化之日", kinrou: "勤劳感谢之日",
        furikae: "补休日", kokumin: "国民休息日"
      },
      events: {
        setsubun: "节分", hachijuhachiya: "八十八夜", nihyakutoka: "二百十日", nihyakuhatsuka: "二百二十日",
        higanIri: "彼岸入", higanAke: "彼岸明", nyuubai: "入梅", hangeshou: "半夏生",
        doyouIri: "土用入", doyouUshi: "土用丑日",
        jinjitsu: "人日", joushi: "上巳（桃花节）", tango: "端午", tanabata: "七夕", chouyou: "重阳",
        oomisoka: "大晦日", jugoya: "十五夜", jusanya: "十三夜"
      }
    },
    en: {
      weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      monthName: ["Mutsuki", "Kisaragi", "Yayoi", "Uzuki", "Satsuki", "Minazuki", "Fumizuki", "Hazuki", "Nagatsuki", "Kannazuki", "Shimotsuki", "Shiwasu"],
      rokuyo: ["Taian", "Shakkō", "Senshō", "Tomobiki", "Senbu", "Butsumetsu"],
      moon: ["New moon", "Waxing crescent", "First quarter", "Waxing gibbous", "Full moon", "Waning gibbous", "Last quarter", "Waning crescent"],
      lunarLabel: "Old calendar", leap: "leap ",
      holidays: {
        ganjitsu: "New Year's Day", seijin: "Coming of Age Day", kenkoku: "National Foundation Day", tennou: "Emperor's Birthday",
        shunbunNoHi: "Vernal Equinox Day", shouwa: "Shōwa Day", kenpou: "Constitution Day", midori: "Greenery Day",
        kodomo: "Children's Day", umi: "Marine Day", yama: "Mountain Day", keirou: "Respect for the Aged Day",
        shuubunNoHi: "Autumnal Equinox Day", sports: "Sports Day", bunka: "Culture Day", kinrou: "Labor Thanksgiving Day",
        furikae: "Substitute holiday", kokumin: "Citizens' holiday"
      },
      events: {
        setsubun: "Setsubun", hachijuhachiya: "88th night of spring", nihyakutoka: "210th day", nihyakuhatsuka: "220th day",
        higanIri: "Higan begins", higanAke: "Higan ends", nyuubai: "Start of the rainy season", hangeshou: "Hangeshō",
        doyouIri: "Doyō begins", doyouUshi: "Day of the Ox in Doyō",
        jinjitsu: "Festival of Seven Herbs", joushi: "Peach Festival", tango: "Boys' Festival", tanabata: "Tanabata", chouyou: "Chrysanthemum Festival",
        oomisoka: "New Year's Eve", jugoya: "Harvest moon (15th night)", jusanya: "13th night moon"
      }
    }
  };

  function names(lang) { return NAMES[lang] || NAMES.ja; }
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function key(y, m, d) { return y + "-" + pad(m) + "-" + pad(d); }
  function dayNo(s) { return Math.round(Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) / DAY); }
  // UTC ms of JST noon (月齢 is conventionally given for noon JST)
  function jstNoon(s) { return Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10), 3); }

  function todayKey() {
    // The device clock in Japan time, whatever the device timezone.
    var d = new Date(Date.now() + 9 * 3600000);
    return key(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
  }

  function inRange(s) { return !!CAL && s >= CAL.start && s <= CAL.end; }

  function kanjiDay(n) {
    if (n <= 10) return n === 10 ? "十" : KANJI_NUM[n];
    if (n < 20) return "十" + KANJI_NUM[n - 10];
    if (n === 20) return "二十";
    if (n < 30) return "二十" + KANJI_NUM[n - 20];
    return "三十";
  }
  function kanjiMonth(m) { return m === 1 ? "正" : m <= 10 ? (m === 10 ? "十" : KANJI_NUM[m]) : "十" + KANJI_NUM[m - 10]; }

  function lunation(s) {
    var L = CAL.lunations, lo = 0, hi = L.length - 1;
    while (lo < hi) {
      var mid = (lo + hi + 1) >> 1;
      if (L[mid][0] <= s) lo = mid; else hi = mid - 1;
    }
    return { cur: L[lo], prev: L[lo - 1] || null };
  }

  // Days that carry a principal phase (新月/上弦/満月/下弦, from the table)
  // take that name; every other day takes the in-between name of its quarter.
  function moonBucket(age) {
    return (Math.floor((age / SYNODIC) * 4) % 4) * 2 + 1;
  }

  function getDay(s, lang) {
    if (!inRange(s)) return null;
    var N = names(lang);
    var found = lunation(s);
    var L = found.cur;
    var lunarDay = dayNo(s) - dayNo(L[0]) + 1;
    var lunarMonth = L[1], leap = !!L[2];
    var age = (jstNoon(s) - L[3]) / DAY;
    // New moon later than noon on its own day: the moon at noon is still the
    // old one, so age counts from the previous new moon.
    if (age < 0) age = found.prev ? (jstNoon(s) - found.prev[3]) / DAY : age + SYNODIC;
    var phase = CAL.phases[s];
    var bucket = phase === undefined ? moonBucket(age) : phase * 2;
    var dow = new Date(Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10))).getUTCDay();
    var ki = (dayNo(s) + CAL.kanshiOffset) % 60;
    var y = +s.slice(0, 4);
    var yi = ((y - 4) % 60 + 60) % 60;
    var i = dayNo(s) - dayNo(CAL.start);
    var sun = CAL.sun.substr(i * 8, 8);
    var holidayId = CAL.holidays[s] || null;
    var eventIds = CAL.events[s] || [];

    var lunarText;
    if (lang === "en") lunarText = (leap ? N.leap : "") + "Month " + lunarMonth + ", day " + lunarDay;
    else lunarText = (leap ? N.leap : "") + kanjiMonth(lunarMonth) + "月" + kanjiDay(lunarDay) + (lang === "zh" ? "" : "日");

    return {
      key: s,
      year: y, month: +s.slice(5, 7), day: +s.slice(8, 10),
      weekday: dow,
      weekdayName: N.weekday[dow],
      wareki: lang === "en" ? "Reiwa " + (y - 2018) : "令和" + (y - 2018) + "年",
      yearKanshi: STEMS[yi % 10] + BRANCHES[yi % 12],
      dayKanshi: STEMS[ki % 10] + BRANCHES[ki % 12],
      monthName: N.monthName[lunarMonth - 1],
      lunar: { month: lunarMonth, day: lunarDay, leap: leap, text: lunarText, label: N.lunarLabel },
      rokuyo: N.rokuyo[(lunarMonth + lunarDay) % 6],
      moon: { age: Math.round(age * 10) / 10, name: N.moon[bucket], principal: phase === undefined ? null : phase },
      sunrise: sun.slice(0, 2) + ":" + sun.slice(2, 4),
      sunset: sun.slice(4, 6) + ":" + sun.slice(6, 8),
      holiday: holidayId ? N.holidays[holidayId] : null,
      events: eventIds.map(function (id) { return N.events[id]; })
    };
  }

  // Weeks (Sunday first) covering month m of year y; days outside the month
  // are null so the grid keeps its shape.
  function monthGrid(y, m) {
    var first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
    var count = new Date(Date.UTC(y, m, 0)).getUTCDate();
    var cells = [];
    for (var i = 0; i < first; i++) cells.push(null);
    for (var d = 1; d <= count; d++) cells.push(key(y, m, d));
    while (cells.length % 7) cells.push(null);
    var weeks = [];
    for (var w = 0; w < cells.length; w += 7) weeks.push(cells.slice(w, w + 7));
    return weeks;
  }

  // Moon disc as inline SVG: lit limb on the right while waxing, left while
  // waning; the terminator is an elliptical arc.
  function moonSvg(age, size) {
    var r = size / 2, cx = r, cy = r;
    var p = ((age / SYNODIC) % 1 + 1) % 1;
    var rx = Math.abs(Math.cos(2 * Math.PI * p)) * r;
    var waxing = p < 0.5;
    var outerSweep = waxing ? 1 : 0;
    var termSweep = (p < 0.25 || (p >= 0.5 && p < 0.75)) ? 0 : 1;
    var lit = "M" + cx + " " + (cy - r) +
      " A" + r + " " + r + " 0 0 " + outerSweep + " " + cx + " " + (cy + r) +
      " A" + rx.toFixed(2) + " " + r + " 0 0 " + termSweep + " " + cx + " " + (cy - r) + "Z";
    return '<svg class="moon" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + " " + size + '" aria-hidden="true">' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 0.5) + '" class="moon-dark"/>' +
      (p > 0.02 && p < 0.98 ? '<path d="' + lit + '" class="moon-lit"/>' : "") + "</svg>";
  }

  // ---- 中国版 (SEKKI_EDITION === "cn"): 农历/干支/节日/日出日落 by Beijing time,
  // from SEKKI_CAL_CN (calendar-data-cn.js). The moon age reuses the JP
  // lunation table (the phase instant is the same everywhere).
  var CN = root.SEKKI_CAL_CN;
  var CN_ON = root.SEKKI_EDITION === "cn" && !!CN;
  var CN_NAMES = {
    zh: {
      zodiac: "鼠牛虎兔龙蛇马羊猴鸡狗猪",
      fest: { chunjie: "春节", yuanxiao: "元宵节", longtaitou: "龙抬头", duanwu: "端午节", qixi: "七夕", zhongyuan: "中元节",
        zhongqiu: "中秋节", chongyang: "重阳节", laba: "腊八节", chuxi: "除夕", yuandan: "元旦", laodong: "劳动节", guoqing: "国庆节" },
      place: "北京", note: "农历、干支与节气均按北京时间（东八区）推算。"
    },
    en: {
      zodiac: ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"],
      fest: { chunjie: "Spring Festival", yuanxiao: "Lantern Festival", longtaitou: "Dragon Raises Its Head", duanwu: "Dragon Boat Festival",
        qixi: "Qixi (Double Seventh)", zhongyuan: "Ghost Festival", zhongqiu: "Mid-Autumn Festival", chongyang: "Double Ninth Festival",
        laba: "Laba Festival", chuxi: "New Year's Eve", yuandan: "New Year's Day", laodong: "Labour Day", guoqing: "National Day" },
      place: "Beijing", note: "Lunar dates, stems-and-branches and solar terms are reckoned in Beijing time (UTC+8)."
    }
  };
  var CN_DAYNUM = ["初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
    "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
    "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"];
  var CN_MONTH = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"];
  var cnJie = null; // per day: [jie no. (odd 1..23) in force, 立春-year]
  function cnJieTable() {
    if (cnJie) return cnJie;
    cnJie = [];
    var cur = 21, lyear = +CN.start.slice(0, 4) - 1, base = dayNo(CN.start);
    for (var i = 0; i < CN.days.length; i++) {
      var j = CN.days[i][3];
      if (j && j % 2 === 1) { cur = j; if (j === 1) lyear = new Date((base + i) * DAY).getUTCFullYear(); }
      cnJie.push([cur, lyear]);
    }
    return cnJie;
  }
  function gz(i) { i = ((i % 60) + 60) % 60; return STEMS[i % 10] + BRANCHES[i % 12]; }

  function cnTodayKey() {
    var d = new Date(Date.now() + 8 * 3600000);
    return key(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
  }
  function cnInRange(s) { return s >= CN.start && s <= CN.end; }

  function cnGetDay(s, lang) {
    if (!cnInRange(s)) return null;
    var en = lang === "en", N = names(lang), CNN = CN_NAMES[en ? "en" : "zh"];
    var i = dayNo(s) - dayNo(CN.start);
    var row = CN.days[i];
    var lm = Math.abs(row[0]), leap = row[0] < 0, ld = row[1];
    var y = +s.slice(0, 4), gm = +s.slice(5, 7), gd = +s.slice(8, 10);
    var ly = (lm >= 11 && gm <= 2) ? y - 1 : y;          // lunar year
    var lyi = ly - 4;
    var jt = cnJieTable()[i], m = (jt[0] - 1) / 2;       // 0 = 寅月
    var ys = ((jt[1] - 4) % 10 + 10) % 10;
    var mStem = ((ys % 5) * 2 + 2 + m) % 10, mBranch = (2 + m) % 12;
    var monthGz = STEMS[mStem] + BRANCHES[mBranch];
    var ki = (dayNo(s) + 17) % 60;
    var zi = ((lyi % 12) + 12) % 12;
    var zodiac = en ? CNN.zodiac[zi] : CNN.zodiac.charAt(zi);
    var mText = (leap ? "闰" : "") + CN_MONTH[lm - 1] + "月";
    // moon: age at Beijing noon from the JP lunation table, if loaded
    var age = (ld - 1) + 0.5, phase;
    if (CAL && inRange(s)) {
      var f = lunation(s), noon = jstNoon(s) + 3600000;
      age = (noon - f.cur[3]) / DAY;
      if (age < 0) age = f.prev ? (noon - f.prev[3]) / DAY : age + SYNODIC;
      phase = CAL.phases[s];
    }
    var bucket = phase === undefined ? moonBucket(age) : phase * 2;
    var dow = new Date(Date.UTC(y, gm - 1, gd)).getUTCDay();
    var sun = row[4];
    return {
      key: s, cn: true,
      year: y, month: gm, day: gd,
      weekday: dow, weekdayName: N.weekday[dow],
      wareki: en ? "Year of the " + zodiac : "农历" + gz(lyi) + "年",
      yearKanshi: en ? gz(lyi) : "属" + zodiac,
      yearGz: gz(lyi), monthGz: monthGz, dayKanshi: gz(ki),
      zodiac: zodiac,
      monthName: en ? "" : monthGz + "月",
      lunar: {
        month: lm, day: ld, leap: leap, label: N.lunarLabel,
        monthText: en ? (leap ? "Leap " : "") + "M" + lm : mText,
        dayText: en ? String(ld) : CN_DAYNUM[ld - 1],
        text: en ? (leap ? "Leap month " : "Month ") + lm + ", day " + ld : mText + CN_DAYNUM[ld - 1]
      },
      rokuyo: "",
      moon: { age: Math.round(age * 10) / 10, name: N.moon[bucket], principal: phase === undefined ? null : phase },
      sunrise: sun.slice(0, 2) + ":" + sun.slice(2, 4),
      sunset: sun.slice(4, 6) + ":" + sun.slice(6, 8),
      holiday: row[2] ? CNN.fest[row[2]] : null,
      events: [],
      place: CNN.place, note: CNN.note
    };
  }

  root.SekkiCalendar = CN_ON ? {
    available: true, cn: true,
    start: CN.start, end: CN.end,
    todayKey: cnTodayKey, key: key, inRange: cnInRange, getDay: cnGetDay,
    monthGrid: monthGrid, moonSvg: moonSvg, names: names
  } : {
    available: !!CAL,
    start: CAL ? CAL.start : null,
    end: CAL ? CAL.end : null,
    todayKey: todayKey,
    key: key,
    inRange: inRange,
    getDay: getDay,
    monthGrid: monthGrid,
    moonSvg: moonSvg,
    names: names
  };
})(typeof self !== "undefined" ? self : this);
