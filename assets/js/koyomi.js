(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    // Node / test environment: pull SEKKI_DATA in via require so this file
    // can be `require()`-d directly without any global having been set up.
    var nodeData;
    try {
      nodeData = require("./data.js");
    } catch (e) {
      nodeData = undefined;
    }
    module.exports = factory(nodeData);
  } else {
    // Browser environment (plain <script> tags, no bundler): SEKKI_DATA is
    // expected to already be a global because data.js was loaded first.
    root.Koyomi = factory(root.SEKKI_DATA);
  }
})(typeof self !== "undefined" ? self : this, function (defaultData) {
  "use strict";

  var MS_PER_DAY = 24 * 60 * 60 * 1000;

  // Supported data range. Dates outside [MIN_YEAR, MAX_YEAR] fall back to the
  // clamped edge of the timeline (see getKoyomi below) because we do not have
  // sekki data for the years immediately before/after this window and thus
  // cannot compute a correct enclosing interval right at the boundary.
  var MIN_YEAR = 2025;
  var MAX_YEAR = 2032;

  // --- date helpers -----------------------------------------------------
  // We only ever care about calendar dates (year/month/day), never
  // wall-clock time or timezone offsets, so every date in this module is
  // normalized to a UTC-midnight timestamp for that calendar day. This
  // avoids DST/timezone drift entirely: two Date objects that represent
  // "the same calendar day" always compare equal.

  function toDayStamp(year, month, day) {
    // month is 1-based here (matches the "MM-DD" strings in data.js)
    return Date.UTC(year, month - 1, day);
  }

  function localDateToDayStamp(date) {
    // Reads the LOCAL calendar fields off a JS Date (as a user/browser would
    // perceive "today's date"), then re-expresses that same calendar day as
    // a UTC-midnight stamp so it can be compared against our internal
    // timeline, which is built the same way.
    return toDayStamp(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  function parseMonthDay(mmdd) {
    var parts = mmdd.split("-");
    return { month: parseInt(parts[0], 10), day: parseInt(parts[1], 10) };
  }

  function formatDayStamp(stamp) {
    var d = new Date(stamp);
    var y = d.getUTCFullYear();
    var m = d.getUTCMonth() + 1;
    var day = d.getUTCDate();
    return y + "-" + (m < 10 ? "0" + m : m) + "-" + (day < 10 ? "0" + day : day);
  }

  function addDays(stamp, n) {
    return stamp + n * MS_PER_DAY;
  }

  function diffDays(a, b) {
    return Math.round((a - b) / MS_PER_DAY);
  }

  // --- timeline construction ---------------------------------------------

  function buildTimeline(data) {
    var sekkiById = {};
    data.sekki.forEach(function (s) {
      sekkiById[s.id] = s;
    });

    var kouBySekki = {};
    data.kou.forEach(function (k) {
      if (!kouBySekki[k.sekkiId]) kouBySekki[k.sekkiId] = [];
      kouBySekki[k.sekkiId].push(k);
    });
    Object.keys(kouBySekki).forEach(function (sid) {
      kouBySekki[sid].sort(function (a, b) { return a.order - b.order; });
    });

    // Flatten every (sekki, year) instance into one chronological list.
    // Order of iteration below does not matter -- we sort explicitly next.
    // This is what correctly threads December-starting terms (taisetsu,
    // touji, shoukan, daikan) across the Dec 31 / Jan 1 boundary: e.g. touji
    // of year Y actually runs from mid-December of Y through early January
    // of Y+1, and that continuation is simply the next entry in this sorted
    // list, not a special case.
    var instances = [];
    data.sekki.forEach(function (s) {
      for (var year = MIN_YEAR; year <= MAX_YEAR; year++) {
        var mmdd = s.dates[year];
        if (!mmdd) continue;
        var md = parseMonthDay(mmdd);
        instances.push({
          sekki: s,
          year: year,
          startStamp: toDayStamp(year, md.month, md.day)
        });
      }
    });
    instances.sort(function (a, b) { return a.startStamp - b.startStamp; });

    // Compute endStamp for each instance = (next instance's start) - 1 day.
    // The very last instance in the whole table has no "next" (we don't
    // have data for the year after MAX_YEAR), so we estimate its length as
    // the average interval length (~15.2 days) and flag it as estimated.
    var AVG_INTERVAL_DAYS = 15;
    for (var i = 0; i < instances.length; i++) {
      if (i < instances.length - 1) {
        instances[i].endStamp = addDays(instances[i + 1].startStamp, -1);
        instances[i].endIsEstimated = false;
      } else {
        instances[i].endStamp = addDays(instances[i].startStamp, AVG_INTERVAL_DAYS - 1);
        instances[i].endIsEstimated = true;
      }
    }

    // Attach kou sub-ranges (initial/mid/final pentad) to each instance.
    instances.forEach(function (inst) {
      var kouList = kouBySekki[inst.sekki.id] || [];
      var totalDays = diffDays(inst.endStamp, inst.startStamp) + 1;
      inst.kouRanges = kouList.map(function (k, idx) {
        var start, end;
        if (idx === 0) {
          start = inst.startStamp;
          end = addDays(start, 4); // days 0-4 (5 days)
        } else if (idx === 1) {
          start = addDays(inst.startStamp, 5);
          end = addDays(inst.startStamp, 9); // days 5-9 (5 days)
        } else {
          start = addDays(inst.startStamp, 10);
          end = inst.endStamp; // remainder of the term (5-7+ days)
        }
        // Guard against pathologically short estimated tail intervals.
        if (end < start) end = start;
        return { kou: k, startStamp: start, endStamp: end };
      });
      // sanity: totalDays kept for potential debugging/inspection use only
      inst.totalDays = totalDays;
    });

    return instances;
  }

  // --- lookups ------------------------------------------------------------

  function findInstance(instances, dayStamp) {
    // Clamp out-of-range queries to the nearest edge of the supported
    // timeline (documented limitation: we only carry sekki data for
    // 2025-2032, so a query date outside that span -- or right at its very
    // first/last few days where the enclosing interval would need data we
    // don't have -- is snapped to the nearest boundary instance instead of
    // throwing).
    if (dayStamp < instances[0].startStamp) {
      return instances[0];
    }
    var last = instances[instances.length - 1];
    if (dayStamp > last.endStamp) {
      return last;
    }
    // Linear scan is fine here: only ~192 instances total (24 terms x 8
    // years). A binary search would be a drop-in optimization if the data
    // set ever grows much larger.
    for (var i = 0; i < instances.length; i++) {
      if (dayStamp >= instances[i].startStamp && dayStamp <= instances[i].endStamp) {
        return instances[i];
      }
    }
    // Should be unreachable given the clamping above, but fall back to the
    // last instance rather than returning undefined.
    return last;
  }

  function findKouRange(instance, dayStamp) {
    var ranges = instance.kouRanges;
    for (var i = 0; i < ranges.length; i++) {
      var r = ranges[i];
      if (dayStamp >= r.startStamp && dayStamp <= r.endStamp) {
        return r;
      }
    }
    // Clamp to nearest kou range if somehow outside all three (shouldn't
    // normally happen since the three ranges are contiguous and cover the
    // whole sekki span).
    if (ranges.length === 0) return null;
    return dayStamp < ranges[0].startStamp ? ranges[0] : ranges[ranges.length - 1];
  }

  function createKoyomi(data) {
    if (!data || !data.sekki || !data.kou) {
      throw new Error(
        "Koyomi.createKoyomi(data) requires an object with sekki[] and kou[] " +
        "arrays (the shape exported by data.js / SEKKI_DATA)."
      );
    }
    var instances = buildTimeline(data);

    function getKoyomi(date) {
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error("Koyomi.getKoyomi(date) requires a valid Date object.");
      }
      var dayStamp = localDateToDayStamp(date);
      var instance = findInstance(instances, dayStamp);
      var kouRange = findKouRange(instance, dayStamp);

      var totalDays = diffDays(instance.endStamp, instance.startStamp) + 1;
      var dayIndex = diffDays(dayStamp, instance.startStamp);
      // Clamp dayIndex into [0, totalDays-1] in case dayStamp was clamped to
      // an edge instance above (i.e. the actual query date lies outside the
      // instance's own start/end but we snapped to it anyway).
      if (dayIndex < 0) dayIndex = 0;
      if (dayIndex > totalDays - 1) dayIndex = totalDays - 1;
      var progress = totalDays > 0 ? dayIndex / totalDays : 0;

      var s = instance.sekki;
      var k = kouRange ? kouRange.kou : null;

      return {
        sekki: {
          id: s.id,
          ja: s.ja,
          zh: s.zh,
          en: s.en,
          season: s.season,
          startDate: formatDayStamp(instance.startStamp),
          endDate: formatDayStamp(instance.endStamp)
        },
        kou: k ? {
          id: k.id,
          sekkiId: k.sekkiId,
          order: k.order,
          ja: k.ja,
          jaReading: k.jaReading,
          zh: k.zh,
          en: k.en,
          desc: k.desc,
          food: k.food,
          flower: k.flower
        } : null,
        kouRange: kouRange ? {
          start: formatDayStamp(kouRange.startStamp),
          end: formatDayStamp(kouRange.endStamp)
        } : null,
        kouIndexInSekki: k ? k.order : null,
        progress: progress
      };
    }

    return { getKoyomi: getKoyomi, _instances: instances };
  }

  var defaultInstance = defaultData ? createKoyomi(defaultData) : null;

  return {
    createKoyomi: createKoyomi,
    getKoyomi: function (date) {
      if (!defaultInstance) {
        throw new Error(
          "Koyomi.getKoyomi: no default SEKKI_DATA was found. In the " +
          "browser, make sure data.js is loaded (as a <script> tag) before " +
          "koyomi.js. In Node, either make sure data.js is requireable at " +
          "'./data.js' relative to koyomi.js, or call " +
          "Koyomi.createKoyomi(SEKKI_DATA).getKoyomi(date) directly."
        );
      }
      return defaultInstance.getKoyomi(date);
    }
  };
});
