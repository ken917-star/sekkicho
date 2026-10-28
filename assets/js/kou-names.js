/* 節気帖 -- display names for the Chinese UI (generated 2026-10-25: OpenCC t2s
   plus a hand table for Japanese shinjitai, e.g. 桜→樱, 坏→坯).
   The paintings, readings and descriptions follow Japan's 本朝七十二候, while
   data.js `zh` holds the classical Chinese list, which differs for most kou.
   In zh mode we show the Japanese kou name in simplified characters and, when
   the Chinese almanac names the same period differently, a small note. */
(function () {
  "use strict";
  var MAP = {"kou-01":{"name":"东风解冻","cn":""},"kou-02":{"name":"黄莺睍睆","cn":"蛰虫始振"},"kou-03":{"name":"鱼上冰","cn":"鱼陟负冰"},"kou-04":{"name":"土脉润起","cn":"獭祭鱼"},"kou-05":{"name":"霞始叇","cn":"鸿雁来"},"kou-06":{"name":"草木萌动","cn":""},"kou-07":{"name":"蛰虫启户","cn":"桃始华"},"kou-08":{"name":"桃始笑","cn":"仓庚鸣"},"kou-09":{"name":"菜虫化蝶","cn":"鹰化为鸠"},"kou-10":{"name":"雀始巢","cn":"玄鸟至"},"kou-11":{"name":"樱始开","cn":"雷乃发声"},"kou-12":{"name":"雷乃发声","cn":"始电"},"kou-13":{"name":"玄鸟至","cn":"桐始华"},"kou-14":{"name":"鸿雁北","cn":"田鼠化为鴽"},"kou-15":{"name":"虹始见","cn":""},"kou-16":{"name":"葭始生","cn":"萍始生"},"kou-17":{"name":"霜止出苗","cn":"鸣鸠拂其羽"},"kou-18":{"name":"牡丹华","cn":"戴胜降于桑"},"kou-19":{"name":"蛙始鸣","cn":"蝼蝈鸣"},"kou-20":{"name":"蚯蚓出","cn":""},"kou-21":{"name":"竹笋生","cn":"王瓜生"},"kou-22":{"name":"蚕起食桑","cn":"苦菜秀"},"kou-23":{"name":"红花荣","cn":"靡草死"},"kou-24":{"name":"麦秋至","cn":""},"kou-25":{"name":"螳螂生","cn":""},"kou-26":{"name":"腐草为萤","cn":"鵙始鸣"},"kou-27":{"name":"梅子黄","cn":"反舌无声"},"kou-28":{"name":"乃东枯","cn":"鹿角解"},"kou-29":{"name":"菖蒲华","cn":"蜩始鸣"},"kou-30":{"name":"半夏生","cn":""},"kou-31":{"name":"温风至","cn":""},"kou-32":{"name":"莲始开","cn":"蟋蟀居壁"},"kou-33":{"name":"鹰乃学习","cn":"鹰始击"},"kou-34":{"name":"桐始结花","cn":"腐草为萤"},"kou-35":{"name":"土润溽暑","cn":""},"kou-36":{"name":"大雨时行","cn":""},"kou-37":{"name":"凉风至","cn":""},"kou-38":{"name":"寒蝉鸣","cn":"白露降"},"kou-39":{"name":"蒙雾升降","cn":"寒蝉鸣"},"kou-40":{"name":"绵柎开","cn":"鹰乃祭鸟"},"kou-41":{"name":"天地始肃","cn":""},"kou-42":{"name":"禾乃登","cn":""},"kou-43":{"name":"草露白","cn":"鸿雁来"},"kou-44":{"name":"鹡鸰鸣","cn":"玄鸟归"},"kou-45":{"name":"玄鸟去","cn":"群鸟养羞"},"kou-46":{"name":"雷乃收声","cn":"雷始收声"},"kou-47":{"name":"蛰虫坯户","cn":""},"kou-48":{"name":"水始涸","cn":""},"kou-49":{"name":"鸿雁来","cn":"鸿雁来宾"},"kou-50":{"name":"菊花开","cn":"雀入大水为蛤"},"kou-51":{"name":"蟋蟀在户","cn":"菊有黄华"},"kou-52":{"name":"霜始降","cn":"豺乃祭兽"},"kou-53":{"name":"霎时施","cn":"草木黄落"},"kou-54":{"name":"枫茑黄","cn":"蛰虫咸俯"},"kou-55":{"name":"山茶始开","cn":"水始冰"},"kou-56":{"name":"地始冻","cn":""},"kou-57":{"name":"金盏香","cn":"雉入大水为蜃"},"kou-58":{"name":"虹藏不见","cn":""},"kou-59":{"name":"朔风拂叶","cn":"天气上升地气下降"},"kou-60":{"name":"橘始黄","cn":"闭塞而成冬"},"kou-61":{"name":"闭塞成冬","cn":"鹖鴠不鸣"},"kou-62":{"name":"熊蛰穴","cn":"虎始交"},"kou-63":{"name":"鳜鱼群","cn":"荔挺出"},"kou-64":{"name":"乃东生","cn":"蚯蚓结"},"kou-65":{"name":"麋角解","cn":""},"kou-66":{"name":"雪下出麦","cn":"水泉动"},"kou-67":{"name":"芹乃荣","cn":"雁北乡"},"kou-68":{"name":"水泉动","cn":"鹊始巢"},"kou-69":{"name":"雉始雊","cn":""},"kou-70":{"name":"款冬华","cn":"鸡始乳"},"kou-71":{"name":"水泽腹坚","cn":"鸷鸟厉疾"},"kou-72":{"name":"鸡始乳","cn":"水泽腹坚"}};
  window.SekkiKouName = {
    name: function (k, lang) {
      if (window.SEKKI_EDITION === "cn") return k[lang] || k.zh; // 中国版：候名即中国七十二候
      if (lang === "zh") return (MAP[k.id] && MAP[k.id].name) || k.zh;
      return k[lang] || k.ja;
    },
    cnNote: function (k, lang) {
      if (lang !== "zh" || window.SEKKI_EDITION === "cn") return "";
      var c = MAP[k.id] && MAP[k.id].cn;
      return c ? "中国古历同期为「" + c + "」" : "";
    }
  };
})();
