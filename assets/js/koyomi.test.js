// Plain-Node test script for koyomi.js. Run with:
//   node assets/js/koyomi.test.js
// No test framework, no npm dependency -- just assert + manual PASS/FAIL
// bookkeeping so this can run in a zero-dependency static site repo.

var assert = require("assert");
var Koyomi = require("./koyomi.js");

var results = [];

function check(name, fn) {
  try {
    fn();
    results.push({ name: name, pass: true });
  } catch (e) {
    results.push({ name: name, pass: false, error: e && e.message ? e.message : String(e) });
  }
}

// local-time Date constructor helper (year, month 1-based, day)
function d(y, m, day) {
  return new Date(y, m - 1, day);
}

// ---------------------------------------------------------------------
// 1. Verification anchor: 2026-07-18 must be Shosho (Lesser Heat / 小暑),
//    final pentad (末候) "鷹乃学習" (Young Hawks Learn to Hunt).
check("2026-07-18 is shousho, final pentad (鷹乃学習)", function () {
  var r = Koyomi.getKoyomi(d(2026, 7, 18));
  assert.strictEqual(r.sekki.id, "shousho");
  assert.strictEqual(r.kou.ja, "鷹乃学習");
  assert.strictEqual(r.kouIndexInSekki, 3);
});

// ---------------------------------------------------------------------
// 2. The exact day a sekki begins must already count as that sekki's
//    first pentad, day 1 -- not the previous term.
check("2026-07-07 (shousho start day) is already shousho, initial pentad", function () {
  var r = Koyomi.getKoyomi(d(2026, 7, 7));
  assert.strictEqual(r.sekki.id, "shousho");
  assert.strictEqual(r.sekki.startDate, "2026-07-07");
  assert.strictEqual(r.kouIndexInSekki, 1);
});

// ---------------------------------------------------------------------
// 3. The last day of a sekki (day before the next sekki begins) must
//    still belong to the outgoing term, not the incoming one.
//    taisho (大暑) 2026 begins 2026-07-23, so shousho's last day is 07-22.
check("2026-07-22 (day before taisho) is still shousho, final pentad", function () {
  var r = Koyomi.getKoyomi(d(2026, 7, 22));
  assert.strictEqual(r.sekki.id, "shousho");
  assert.strictEqual(r.sekki.endDate, "2026-07-22");
  assert.strictEqual(r.kouIndexInSekki, 3);
});

// ---------------------------------------------------------------------
// 4. Cross-year boundary: 2026-01-01 falls within touji (冬至) of 2025
//    (2025-12-21 through the day before shoukan 2026-01-05, i.e. 01-04).
check("2026-01-01 belongs to touji 2025 (cross-year continuation)", function () {
  var r = Koyomi.getKoyomi(d(2026, 1, 1));
  assert.strictEqual(r.sekki.id, "touji");
  assert.strictEqual(r.sekki.startDate, "2025-12-21");
  assert.strictEqual(r.sekki.endDate, "2026-01-04");
});

// ---------------------------------------------------------------------
// 5. Cross-year boundary at the other end of the same interval:
//    2025-12-31 should also fall within touji 2025, one day before
//    the 2026-01-01 case above.
check("2025-12-31 also belongs to touji 2025", function () {
  var r = Koyomi.getKoyomi(d(2025, 12, 31));
  assert.strictEqual(r.sekki.id, "touji");
  assert.strictEqual(r.sekki.startDate, "2025-12-21");
});

// ---------------------------------------------------------------------
// 5b. Cross-year boundary near year-end 2026: touji 2026 starts 2026-12-22
//     and runs into January 2027 (shoukan 2027 starts 2027-01-05).
check("2026-12-31 belongs to touji 2026 (cross-year continuation)", function () {
  var r = Koyomi.getKoyomi(d(2026, 12, 31));
  assert.strictEqual(r.sekki.id, "touji");
  assert.strictEqual(r.sekki.startDate, "2026-12-22");
});

check("2027-01-01 also belongs to touji 2026, still cross-year", function () {
  var r = Koyomi.getKoyomi(d(2027, 1, 1));
  assert.strictEqual(r.sekki.id, "touji");
  assert.strictEqual(r.sekki.startDate, "2026-12-22");
  assert.strictEqual(r.sekki.endDate, "2027-01-04");
});

// ---------------------------------------------------------------------
// 6. Leap day 2028-02-29 must not throw, and must land in/around usui
//    (usui 2028 = 02-19, keichitsu 2028 = 03-05, so 02-29 is within usui).
check("2028-02-29 (leap day) resolves without throwing, lands in usui", function () {
  var r = Koyomi.getKoyomi(d(2028, 2, 29));
  assert.strictEqual(r.sekki.id, "usui");
  assert.ok(r.kou !== null);
});

// ---------------------------------------------------------------------
// 7. kouRange start/end dates for a known pentad computed correctly.
//    shousho 2026 starts 2026-07-07:
//      kou-31 (初候): 07-07 .. 07-11
//      kou-32 (次候): 07-12 .. 07-16
//      kou-33 (末候): 07-17 .. 07-22 (taisho 2026 begins 07-23)
check("kouRange for shousho 2026 initial pentad is 07-07..07-11", function () {
  var r = Koyomi.getKoyomi(d(2026, 7, 9));
  assert.strictEqual(r.kou.id, "kou-31");
  assert.strictEqual(r.kouRange.start, "2026-07-07");
  assert.strictEqual(r.kouRange.end, "2026-07-11");
});

check("kouRange for shousho 2026 final pentad is 07-17..07-22", function () {
  var r = Koyomi.getKoyomi(d(2026, 7, 18));
  assert.strictEqual(r.kou.id, "kou-33");
  assert.strictEqual(r.kouRange.start, "2026-07-17");
  assert.strictEqual(r.kouRange.end, "2026-07-22");
});

// ---------------------------------------------------------------------
// 8. progress is within [0,1] always, and close to 0 on a sekki's first day.
check("progress is in [0,1] range for an arbitrary date", function () {
  var r = Koyomi.getKoyomi(d(2027, 9, 15));
  assert.ok(r.progress >= 0 && r.progress <= 1, "progress out of range: " + r.progress);
});

check("progress is near 0 on the first day of a sekki", function () {
  var r = Koyomi.getKoyomi(d(2026, 7, 7)); // shousho start day
  assert.ok(r.progress >= 0 && r.progress < 0.1, "progress not near 0: " + r.progress);
});

// ---------------------------------------------------------------------
// Extra coverage across other seasons / sekki, since "the more the better"
// was explicitly welcomed by the task spec.

check("2026-03-20 (春分 start day) resolves to shunbun, initial pentad", function () {
  var r = Koyomi.getKoyomi(d(2026, 3, 20));
  assert.strictEqual(r.sekki.id, "shunbun");
  assert.strictEqual(r.kouIndexInSekki, 1);
});

check("2026-10-31 (deep autumn) resolves to soukou (霜降)", function () {
  var r = Koyomi.getKoyomi(d(2026, 10, 31));
  // soukou 2026 = 10-23, ritto (立冬) 2026 = 11-07, so 10-31 sits inside soukou
  assert.strictEqual(r.sekki.id, "soukou");
});

check("2026-01-20 (大寒 start day) resolves to daikan, initial pentad", function () {
  var r = Koyomi.getKoyomi(d(2026, 1, 20));
  assert.strictEqual(r.sekki.id, "daikan");
  assert.strictEqual(r.kouIndexInSekki, 1);
});

check("2029-02-03 (立春 start day, non-2026 year) resolves to risshun", function () {
  var r = Koyomi.getKoyomi(d(2029, 2, 3));
  assert.strictEqual(r.sekki.id, "risshun");
  assert.strictEqual(r.sekki.startDate, "2029-02-03");
});

check("date far outside supported range (2040) clamps instead of throwing", function () {
  var r = Koyomi.getKoyomi(d(2040, 6, 1));
  assert.ok(r && r.sekki && r.sekki.id, "expected a clamped fallback result, got: " + JSON.stringify(r));
});

check("date far before supported range (2010) clamps instead of throwing", function () {
  var r = Koyomi.getKoyomi(d(2010, 1, 1));
  assert.ok(r && r.sekki && r.sekki.id, "expected a clamped fallback result, got: " + JSON.stringify(r));
});

check("every kou across the full 2026 calendar year resolves with non-null desc/food/flower", function () {
  for (var month = 1; month <= 12; month++) {
    for (var day = 1; day <= 28; day += 7) {
      var r = Koyomi.getKoyomi(d(2026, month, day));
      assert.ok(r.kou, "no kou resolved for 2026-" + month + "-" + day);
      assert.ok(r.kou.desc && r.kou.desc.ja && r.kou.desc.zh && r.kou.desc.en, "missing desc for " + r.kou.id);
      assert.ok(r.kou.food && r.kou.food.ja && r.kou.food.ja.length > 0, "missing food for " + r.kou.id);
      assert.ok(r.kou.flower && r.kou.flower.ja, "missing flower for " + r.kou.id);
    }
  }
});

// ---------------------------------------------------------------------
// Report results.

var passCount = 0;
results.forEach(function (r) {
  if (r.pass) {
    passCount++;
    console.log("PASS - " + r.name);
  } else {
    console.log("FAIL - " + r.name + "\n       " + r.error);
  }
});

var total = results.length;
if (passCount === total) {
  console.log("\nALL PASS (" + passCount + "/" + total + ")");
  process.exit(0);
} else {
  console.log("\n" + (total - passCount) + " FAILURE(S) (" + passCount + "/" + total + " passed)");
  process.exit(1);
}
