(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    root.SekkiAffiliate = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // =======================================================================
  // CONFIG -- the ONLY thing that needs to change once a Rakuten Affiliate
  // account is approved. Paste the affiliate ID string here (e.g. the
  // "aID" value from a Rakuten Affiliate dynamic/generic link). Leave it
  // as "" to keep shipping plain, non-monetized Rakuten search links --
  // the feature works correctly either way.
  var RAKUTEN_AFFILIATE_ID = "";
  // =======================================================================

  // -----------------------------------------------------------------------
  // "この時期の楽しみ" data -- two Rakuten-searchable seasonal picks per
  // micro-season (kou-01..kou-72), independent of data.js (which stays
  // untouched). Each entry is deliberately NOT a duplicate of data.js's own
  // food/flower fields -- these are purchasable "enjoy this season" ideas
  // (wagashi, tea, seasonal produce, potted flowers, crafts) that resonate
  // with the same kou's story, in the same quiet, tasteful register.
  var ITEMS = {
    "kou-01": [
      { ja: "梅の枝もの", zh: "梅花枝条", en: "Plum Blossom Branch", hint: "早咲きの紅梅を、一輪挿しに飾る。", keyword: "梅の枝 生花 一輪挿し" },
      { ja: "蕗味噌", zh: "蜂斗菜味噌", en: "Butterbur Miso", hint: "ほろ苦い蕗味噌で、春の兆しを味わう。", keyword: "蕗味噌 お取り寄せ" }
    ],
    "kou-02": [
      { ja: "沈丁花の鉢植え", zh: "瑞香盆栽", en: "Daphne Potted Plant", hint: "甘く香る沈丁花を、玄関先に迎える。", keyword: "沈丁花 鉢植え" },
      { ja: "生わかめ", zh: "生裙带菜", en: "Fresh Wakame Seaweed", hint: "早春の生わかめで、磯の香りを楽しむ。", keyword: "生わかめ お取り寄せ" }
    ],
    "kou-03": [
      { ja: "福寿草の鉢植え", zh: "福寿草盆栽", en: "Amur Adonis Potted Plant", hint: "黄金色の福寿草で、春を先取りする。", keyword: "福寿草 鉢植え" },
      { ja: "わかさぎ佃煮", zh: "西太公鱼佃煮", en: "Simmered Smelt (Tsukudani)", hint: "公魚の佃煮で、湖の恵みを食卓へ。", keyword: "わかさぎ 佃煮 お取り寄せ" }
    ],
    "kou-04": [
      { ja: "猫柳の枝もの", zh: "细叶红柳枝条", en: "Pussy Willow Branches", hint: "銀色に光る猫柳を、床の間に生ける。", keyword: "猫柳 枝物 生花" },
      { ja: "菜の花漬け", zh: "腌油菜花", en: "Pickled Rapeseed Blossoms", hint: "ほろ苦い菜の花漬けで、春の膳を彩る。", keyword: "菜の花漬け お取り寄せ" }
    ],
    "kou-05": [
      { ja: "木蓮の鉢植え", zh: "玉兰盆栽", en: "Magnolia Potted Plant", hint: "白木蓮の鉢植えで、霞む庭を彩る。", keyword: "木蓮 鉢植え" },
      { ja: "潮汁用の蛤", zh: "潮汁用蛤蜊", en: "Clams for Clear Broth", hint: "旬の蛤で、潮の香り豊かな汁物を。", keyword: "蛤 お取り寄せ 潮汁" }
    ],
    "kou-06": [
      { ja: "桜の盆栽", zh: "樱花盆栽", en: "Cherry Blossom Bonsai", hint: "小さな桜盆栽で、開花を待つ愉しみを。", keyword: "桜 盆栽" },
      { ja: "たらの芽", zh: "楤木芽", en: "Angelica Tree Shoots", hint: "たらの芽の天ぷらで、春の苦みを味わう。", keyword: "たらの芽 お取り寄せ" }
    ],
    "kou-07": [
      { ja: "よもぎ蒸しセット", zh: "艾草蒸浴套装", en: "Mugwort Steam Set", hint: "蓬の香りで、春のひとときを整える。", keyword: "よもぎ蒸し お取り寄せ" },
      { ja: "浅蜊(あさり)", zh: "蛤仔", en: "Baby Clams", hint: "旬の浅蜊で、春の潮汁を仕立てる。", keyword: "浅蜊 お取り寄せ" }
    ],
    "kou-08": [
      { ja: "桃の枝もの", zh: "桃花枝条", en: "Peach Blossom Branches", hint: "桃の枝もので、雛祭りの室礼を整える。", keyword: "桃の花 枝物" },
      { ja: "蕨餅", zh: "蕨饼", en: "Bracken Starch Mochi", hint: "本蕨仕立ての蕨餅で、春を味わう。", keyword: "蕨餅 お取り寄せ" }
    ],
    "kou-09": [
      { ja: "西京漬けセット", zh: "西京渍套装", en: "Saikyo Miso-Marinated Fish Set", hint: "西京漬けで、春の魚を上品にいただく。", keyword: "西京漬け お取り寄せ" },
      { ja: "菜の花の苗", zh: "油菜花苗", en: "Rapeseed Blossom Seedlings", hint: "菜の花の苗で、庭にも黄色い春を。", keyword: "菜の花 苗" }
    ],
    "kou-10": [
      { ja: "木瓜(ぼけ)の盆栽", zh: "木瓜盆栽", en: "Flowering Quince Bonsai", hint: "木瓜の盆栽で、小さな春の庭を作る。", keyword: "木瓜 盆栽" },
      { ja: "朝掘り筍", zh: "现挖春笋", en: "Freshly Dug Bamboo Shoots", hint: "朝掘りの筍で、春の炊き込みご飯を。", keyword: "筍 お取り寄せ" }
    ],
    "kou-11": [
      { ja: "桜茶", zh: "樱花茶", en: "Sakura Blossom Tea", hint: "桜湯で、花見気分をひと足先に。", keyword: "桜茶 桜湯" },
      { ja: "桜餅", zh: "樱饼", en: "Sakura Mochi", hint: "老舗の桜餅で、花見の卓を彩る。", keyword: "桜餅 お取り寄せ" }
    ],
    "kou-12": [
      { ja: "連翹の枝もの", zh: "连翘枝条", en: "Forsythia Branches", hint: "黄金色の連翹を、春の生け花に。", keyword: "連翹 枝物" },
      { ja: "ひじき煮", zh: "羊栖菜煮物", en: "Simmered Hijiki Seaweed", hint: "ひじきの炊き物で、春の食卓を整える。", keyword: "ひじき煮 お取り寄せ" }
    ],
    "kou-13": [
      { ja: "初鰹のたたき", zh: "初鲣半烧", en: "Seared First Bonito", hint: "初鰹のたたきで、南から来た燕を迎える。", keyword: "初鰹 たたき お取り寄せ" },
      { ja: "桐箱入り銘茶", zh: "桐木盒装名茶", en: "Fine Tea in Paulownia Box", hint: "桐箱入りの銘茶で、来客をもてなす。", keyword: "桐箱 銘茶" }
    ],
    "kou-14": [
      { ja: "花水木の苗木", zh: "大花四照花苗木", en: "Flowering Dogwood Sapling", hint: "花水木の苗木で、庭に初夏を呼び込む。", keyword: "花水木 苗木" },
      { ja: "身欠き鰊", zh: "干鲱鱼片", en: "Dried Herring Fillets", hint: "身欠き鰊で、山菜と炊き合わせる。", keyword: "身欠きにしん お取り寄せ" }
    ],
    "kou-15": [
      { ja: "藤の鉢植え", zh: "紫藤盆栽", en: "Wisteria Potted Plant", hint: "藤の鉢仕立てで、垂れる花房を愉しむ。", keyword: "藤 鉢植え" },
      { ja: "鱒寿司", zh: "鳟鱼寿司", en: "Trout Pressed Sushi", hint: "名物の鱒寿司を、旬の便りとともに。", keyword: "鱒寿司 お取り寄せ" }
    ],
    "kou-16": [
      { ja: "芝桜の苗", zh: "芝樱苗", en: "Moss Phlox Seedlings", hint: "芝桜の苗で、地面を薄紅色に染める。", keyword: "芝桜 苗" },
      { ja: "しじみ汁セット", zh: "蚬贝汤套装", en: "Freshwater Clam Soup Set", hint: "旬の蜆で、滋味深い汁物を仕立てる。", keyword: "しじみ お取り寄せ" }
    ],
    "kou-17": [
      { ja: "新茶(八十八夜)", zh: "八十八夜新茶", en: "First-Flush Tea (88th Day)", hint: "八十八夜の新茶で、無病息災を願う。", keyword: "新茶 八十八夜" },
      { ja: "牡丹の鉢植え", zh: "牡丹盆栽", en: "Peony Potted Plant", hint: "大輪の牡丹を、庭先の主役に据える。", keyword: "牡丹 鉢植え" }
    ],
    "kou-18": [
      { ja: "空豆(そら豆)", zh: "蚕豆", en: "Fava Beans", hint: "旬の空豆で、晩春の膳を整える。", keyword: "そら豆 お取り寄せ" },
      { ja: "牡丹の切花", zh: "牡丹切花", en: "Peony Cut Flowers", hint: "牡丹の切花で、一輪だけの豪奢を。", keyword: "牡丹 切花" }
    ],
    "kou-19": [
      { ja: "花菖蒲の苗", zh: "花菖蒲苗", en: "Japanese Iris Seedlings", hint: "花菖蒲の苗で、水辺の風情を庭先に。", keyword: "花菖蒲 苗" },
      { ja: "初鰹(一本)", zh: "整条初鲣", en: "Whole First Bonito", hint: "脂の少ない初鰹を、薬味とともに。", keyword: "初鰹 お取り寄せ" }
    ],
    "kou-20": [
      { ja: "芍薬の切花", zh: "芍药切花", en: "Peony Rose Cut Flowers", hint: "芍薬の一輪で、立てば芍薬の姿を。", keyword: "芍薬 切花" },
      { ja: "新茶", zh: "新茶", en: "First-Flush Green Tea", hint: "みずみずしい新茶で、若葉の香りを。", keyword: "新茶 お取り寄せ" }
    ],
    "kou-21": [
      { ja: "うつぎの苗木", zh: "溲疏苗木", en: "Deutzia Sapling", hint: "卯の花の苗木で、垣根に初夏を添える。", keyword: "うつぎ 苗木" },
      { ja: "若竹煮セット", zh: "嫩笋若布煮套装", en: "Bamboo & Wakame Simmer Set", hint: "筍と若布の若竹煮で、初夏の一椀を。", keyword: "若竹煮 お取り寄せ" }
    ],
    "kou-22": [
      { ja: "さくらんぼ", zh: "樱桃", en: "Cherries", hint: "山形産さくらんぼで、初夏の甘みを。", keyword: "さくらんぼ お取り寄せ" },
      { ja: "紫陽花の鉢植え", zh: "绣球花盆栽", en: "Hydrangea Potted Plant", hint: "色づき始めの紫陽花を、庭に迎える。", keyword: "紫陽花 鉢植え" }
    ],
    "kou-23": [
      { ja: "紅花染めの手ぬぐい", zh: "红花染手巾", en: "Safflower-Dyed Tenugui Cloth", hint: "紅花染めの手ぬぐいで、夏の彩りを。", keyword: "紅花染め 手ぬぐい" },
      { ja: "鰹のたたき", zh: "鲣鱼半烧", en: "Seared Bonito", hint: "脂ののった鰹で、初夏の膳を豊かに。", keyword: "鰹たたき お取り寄せ" }
    ],
    "kou-24": [
      { ja: "枇杷", zh: "枇杷", en: "Loquats", hint: "旬の枇杷で、麦秋の甘い便りを味わう。", keyword: "枇杷 お取り寄せ" },
      { ja: "麦茶", zh: "大麦茶", en: "Roasted Barley Tea", hint: "香ばしい麦茶で、夏へ向かう体を整える。", keyword: "麦茶 お取り寄せ" }
    ],
    "kou-25": [
      { ja: "梅仕込みセット", zh: "梅子腌制套装", en: "Plum Preserving Kit", hint: "梅仕込みセットで、梅仕事の季節を。", keyword: "梅仕込みセット" },
      { ja: "新生姜", zh: "新生姜", en: "New Ginger", hint: "新生姜の甘酢漬けで、爽やかな一品を。", keyword: "新生姜 お取り寄せ" }
    ],
    "kou-26": [
      { ja: "鮎の一夜干し", zh: "香鱼一夜干", en: "Sweetfish Overnight-Dried", hint: "旬の鮎で、清流の恵みを食卓に運ぶ。", keyword: "鮎 お取り寄せ" },
      { ja: "江戸切子のグラス", zh: "江户切子玻璃杯", en: "Edo Kiriko Cut Glass", hint: "江戸切子の器で、蛍舞う夜を涼やかに。", keyword: "江戸切子 グラス" }
    ],
    "kou-27": [
      { ja: "紀州南高梅の梅干し", zh: "纪州南高梅干", en: "Kishu Nanko Pickled Plums", hint: "紀州南高梅の梅干しで、夏の滋養を。", keyword: "紀州南高梅 梅干し" },
      { ja: "梔子(くちなし)の鉢植え", zh: "栀子花盆栽", en: "Gardenia Potted Plant", hint: "梔子の甘い香りを、梅雨の庭先に。", keyword: "くちなし 鉢植え" }
    ],
    "kou-28": [
      { ja: "明石だこ", zh: "明石章鱼", en: "Akashi Octopus", hint: "旬の蛸で、夏至の縁起を食卓で味わう。", keyword: "明石だこ お取り寄せ" },
      { ja: "半夏生(草)の苗", zh: "半夏生草苗", en: "Lizard's Tail Plant Seedling", hint: "葉が白く化粧する半夏生を、水辺の鉢に。", keyword: "半夏生 苗" }
    ],
    "kou-29": [
      { ja: "揖保乃糸の素麺", zh: "揖保乃系素面", en: "Ibonoito Somen Noodles", hint: "揖保乃糸の素麺で、梅雨時の卓を涼しく。", keyword: "揖保乃糸 素麺" },
      { ja: "花菖蒲の切花", zh: "花菖蒲切花", en: "Japanese Iris Cut Flowers", hint: "凛とした花菖蒲の一枝を、床の間に。", keyword: "花菖蒲 切花" }
    ],
    "kou-30": [
      { ja: "たこ焼き粉セット", zh: "章鱼烧粉套装", en: "Takoyaki Batter Set", hint: "半夏生の日は、蛸で田植えの労をねぎらう。", keyword: "たこ焼き粉 お取り寄せ" },
      { ja: "讃岐うどん", zh: "赞岐乌冬面", en: "Sanuki Udon Noodles", hint: "喉ごしのよい讃岐うどんで、梅雨の合間を。", keyword: "讃岐うどん お取り寄せ" }
    ],
    "kou-31": [
      { ja: "国産うなぎ蒲焼", zh: "国产蒲烧鳗鱼", en: "Domestic Grilled Eel", hint: "国産うなぎの蒲焼で、来る土用に備える。", keyword: "国産うなぎ 蒲焼 お取り寄せ" },
      { ja: "鉢蓮(はちす)", zh: "盆栽荷花", en: "Bowl Lotus Potted Plant", hint: "鉢蓮で、蓮の開花をひと夏楽しむ。", keyword: "鉢蓮 鉢植え" }
    ],
    "kou-32": [
      { ja: "蓮根(れんこん)", zh: "莲藕", en: "Lotus Root", hint: "穴の空いた蓮根で、見通しのよい夏を。", keyword: "蓮根 お取り寄せ" },
      { ja: "蓮の切花", zh: "荷花切花", en: "Lotus Cut Flower", hint: "早朝に開く蓮の一輪を、涼やかに飾る。", keyword: "蓮 切花" }
    ],
    "kou-33": [
      { ja: "向日葵の花束", zh: "向日葵花束", en: "Sunflower Bouquet", hint: "大輪の向日葵で、夏の力強さを部屋に。", keyword: "ひまわり 花束" },
      { ja: "枝豆", zh: "毛豆", en: "Edamame", hint: "塩茹で向きの枝豆で、夏の晩酌を彩る。", keyword: "枝豆 お取り寄せ" }
    ],
    "kou-34": [
      { ja: "ブランド西瓜", zh: "品牌西瓜", en: "Premium Watermelon", hint: "ブランド西瓜で、盛夏の甘みを味わう。", keyword: "スイカ お取り寄せ" },
      { ja: "百日紅(さるすべり)の鉢植え", zh: "紫薇盆栽", en: "Crape Myrtle Potted Plant", hint: "百日紅の鉢植えで、長く続く夏花を。", keyword: "さるすべり 鉢植え" }
    ],
    "kou-35": [
      { ja: "むくげの苗木", zh: "木槿苗木", en: "Rose of Sharon Sapling", hint: "一日花の木槿で、夏の茶花を絶やさない。", keyword: "むくげ 苗木" },
      { ja: "冷やし中華のたれ", zh: "凉拌中华面调味汁", en: "Chilled Chinese Noodle Sauce", hint: "名店の冷やし中華で、蒸し暑さをしのぐ。", keyword: "冷やし中華 お取り寄せ" }
    ],
    "kou-36": [
      { ja: "朝顔の鉢植え", zh: "牵牛花盆栽", en: "Morning Glory Potted Plant", hint: "朝顔の鉢で、夕立前のひとときを彩る。", keyword: "朝顔 鉢植え" },
      { ja: "上質な豆腐", zh: "优质豆腐", en: "Premium Tofu", hint: "上質な豆腐の冷奴で、夕立の後の涼を。", keyword: "豆腐 お取り寄せ" }
    ],
    "kou-37": [
      { ja: "桔梗の鉢植え", zh: "桔梗盆栽", en: "Balloon Flower Potted Plant", hint: "凛とした桔梗で、秋の気配を先取る。", keyword: "桔梗 鉢植え" },
      { ja: "出汁茶漬けセット", zh: "高汤茶泡饭套装", en: "Dashi Ochazuke Set", hint: "上質な出汁茶漬けで、涼風とともに一服。", keyword: "お茶漬け お取り寄せ" }
    ],
    "kou-38": [
      { ja: "梨(幸水・豊水)", zh: "梨(幸水/丰水)", en: "Japanese Pears", hint: "みずみずしい梨で、晩夏の喉を潤す。", keyword: "梨 お取り寄せ" },
      { ja: "女郎花(おみなえし)の切花", zh: "败酱草切花", en: "Golden Lace Cut Flower", hint: "女郎花の一枝で、秋の七草を先取り。", keyword: "女郎花 切花" }
    ],
    "kou-39": [
      { ja: "いちじく", zh: "无花果", en: "Figs", hint: "とろりと熟れた無花果で、初秋を味わう。", keyword: "いちじく お取り寄せ" },
      { ja: "芙蓉の鉢植え", zh: "芙蓉盆栽", en: "Cotton Rose Potted Plant", hint: "一日花の芙蓉で、朝夕の霧を彩る。", keyword: "芙蓉 鉢植え" }
    ],
    "kou-40": [
      { ja: "シャインマスカット", zh: "阳光玫瑰葡萄", en: "Shine Muscat Grapes", hint: "種なし葡萄で、実りの秋を先取りする。", keyword: "シャインマスカット お取り寄せ" },
      { ja: "萩(はぎ)の苗木", zh: "胡枝子苗木", en: "Bush Clover Sapling", hint: "秋の七草・萩の苗で、庭先に風情を。", keyword: "萩 苗木" }
    ],
    "kou-41": [
      { ja: "秋刀魚(さんま)", zh: "秋刀鱼", en: "Pacific Saury", hint: "脂ののった秋刀魚を、塩焼きで味わう。", keyword: "秋刀魚 お取り寄せ" },
      { ja: "里芋", zh: "芋头", en: "Taro", hint: "ねっとり系の里芋で、名月の膳を整える。", keyword: "里芋 お取り寄せ" }
    ],
    "kou-42": [
      { ja: "新米", zh: "新米", en: "New-Harvest Rice", hint: "実り立ての新米で、豊穣を寿ぐ食卓を。", keyword: "新米 お取り寄せ" },
      { ja: "彼岸花の球根", zh: "彼岸花球根", en: "Red Spider Lily Bulbs", hint: "彼岸花の球根で、来秋の彩りを仕込む。", keyword: "彼岸花 球根" }
    ],
    "kou-43": [
      { ja: "お月見団子セット", zh: "赏月团子套装", en: "Moon-Viewing Dango Set", hint: "お月見団子で、露結ぶ夜長を愛でる。", keyword: "月見団子 お取り寄せ" },
      { ja: "萩の花の切花", zh: "胡枝子切花", en: "Bush Clover Cut Flower", hint: "萩の花を一枝、露の朝に活ける。", keyword: "萩の花 切花" }
    ],
    "kou-44": [
      { ja: "さつまいも(紅はるか等)", zh: "番薯(红东等)", en: "Sweet Potatoes", hint: "蜜の滴るさつまいもで、実りの秋を。", keyword: "さつまいも お取り寄せ" },
      { ja: "和栗", zh: "和栗", en: "Japanese Chestnuts", hint: "丹波栗などの和栗で、栗ご飯を仕立てる。", keyword: "和栗 お取り寄せ" }
    ],
    "kou-45": [
      { ja: "ブランド柿", zh: "品牌柿子", en: "Premium Persimmons", hint: "甘く熟した柿で、去りゆく夏を惜しむ。", keyword: "柿 お取り寄せ" },
      { ja: "金木犀の鉢植え", zh: "金桂盆栽", en: "Fragrant Olive Potted Plant", hint: "金木犀の香りで、燕去りし庭を満たす。", keyword: "金木犀 鉢植え" }
    ],
    "kou-46": [
      { ja: "国産松茸", zh: "国产松茸", en: "Domestic Matsutake Mushrooms", hint: "香り高い松茸で、実りの秋を贅沢に。", keyword: "松茸 お取り寄せ" },
      { ja: "曼珠沙華の球根", zh: "曼珠沙华球根", en: "Red Spider Lily Bulbs (Higanbana)", hint: "曼珠沙華の球根で、彼岸の景色を仕込む。", keyword: "曼珠沙華 球根" }
    ],
    "kou-47": [
      { ja: "竜胆(りんどう)の切花", zh: "龙胆切花", en: "Gentian Cut Flower", hint: "竜胆の凛とした青紫を、秋の卓に。", keyword: "りんどう 切花" },
      { ja: "石焼き芋", zh: "石烤番薯", en: "Stone-Baked Sweet Potato", hint: "石焼き芋の甘みで、虫の声を聞きながら。", keyword: "焼き芋 お取り寄せ" }
    ],
    "kou-48": [
      { ja: "新米おにぎりセット", zh: "新米饭团套装", en: "New-Rice Onigiri Set", hint: "新米の塩むすびで、実りの秋を噛みしめる。", keyword: "新米 おにぎりセット" },
      { ja: "金木犀のお香", zh: "金桂香", en: "Fragrant Olive Incense", hint: "金木犀のお香で、水引く田の香りを部屋に。", keyword: "金木犀 お香" }
    ],
    "kou-49": [
      { ja: "観賞菊の鉢植え", zh: "观赏菊盆栽", en: "Ornamental Chrysanthemum Pot", hint: "重陽を過ぎた菊で、長寿の香りを愛でる。", keyword: "菊 鉢植え" },
      { ja: "栗きんとん", zh: "栗子金团", en: "Sweet Chestnut Paste", hint: "栗きんとんで、雁渡る頃の甘みを味わう。", keyword: "栗きんとん お取り寄せ" }
    ],
    "kou-50": [
      { ja: "秋鮭といくら", zh: "秋鲑与鲑鱼子", en: "Autumn Salmon & Roe", hint: "秋鮭といくらで、実りの膳を華やかに。", keyword: "秋鮭 いくら お取り寄せ" },
      { ja: "菊をあしらった和食器", zh: "菊纹和风食器", en: "Chrysanthemum-Motif Tableware", hint: "菊をあしらった器で、長寿を祝う卓を。", keyword: "菊 和食器" }
    ],
    "kou-51": [
      { ja: "コスモスの苗", zh: "秋樱苗", en: "Cosmos Seedlings", hint: "コスモスの苗で、虫の声に色を添える。", keyword: "コスモス 苗" },
      { ja: "里芋(煮っころがし用)", zh: "煮芋头用芋头", en: "Taro for Simmered Dish", hint: "小ぶりな里芋で、月夜の煮物を仕立てる。", keyword: "里芋 煮っころがし お取り寄せ" }
    ],
    "kou-52": [
      { ja: "柚子(ゆず)", zh: "柚子", en: "Yuzu Citrus", hint: "香り高い柚子で、霜降る朝の膳に添える。", keyword: "柚子 お取り寄せ" },
      { ja: "山茶花(さざんか)の苗木", zh: "山茶花苗木", en: "Sasanqua Camellia Sapling", hint: "山茶花の苗木で、霜の朝も咲く花を。", keyword: "山茶花 苗木" }
    ],
    "kou-53": [
      { ja: "千枚漬け", zh: "千枚渍", en: "Kyoto-Style Turnip Pickles", hint: "京の千枚漬けで、蕪の甘みを楽しむ。", keyword: "千枚漬け お取り寄せ" },
      { ja: "皇帝ダリアの苗", zh: "木立大丽花苗", en: "Tree Dahlia Seedling", hint: "空を仰ぐ皇帝ダリアで、庭に高さを。", keyword: "皇帝ダリア 苗" }
    ],
    "kou-54": [
      { ja: "もみじ饅頭", zh: "枫叶馒头", en: "Maple-Leaf Manju Sweets", hint: "紅葉をかたどった菓子で、山の彩りを。", keyword: "もみじ饅頭 お取り寄せ" },
      { ja: "紅葉の苔玉", zh: "红叶苔藓球", en: "Maple Kokedama (Moss Ball)", hint: "小さな紅葉の苔玉で、山の錦を手元に。", keyword: "紅葉 盆栽" }
    ],
    "kou-55": [
      { ja: "寒鰤(かんぶり)", zh: "寒鰤鱼", en: "Winter Yellowtail", hint: "脂の乗った寒鰤で、冬の恵みを味わう。", keyword: "寒ブリ お取り寄せ" },
      { ja: "山茶花(さざんか)の切花", zh: "山茶花切花", en: "Sasanqua Camellia Cut Flower", hint: "花の少ない時季に、山茶花を一輪。", keyword: "山茶花 切花" }
    ],
    "kou-56": [
      { ja: "白菜(鍋用)", zh: "火锅白菜", en: "Napa Cabbage for Hot Pot", hint: "霜を経て甘みを増した白菜で、鍋を囲む。", keyword: "白菜 お取り寄せ" },
      { ja: "蜜柑(みかん)", zh: "橘子", en: "Mandarin Oranges", hint: "こたつに欠かせない蜜柑を、箱で味わう。", keyword: "みかん お取り寄せ" }
    ],
    "kou-57": [
      { ja: "ふぐのてっちり", zh: "河豚火锅", en: "Fugu Hot Pot", hint: "水仙の頃、ふぐ鍋で冬の贅沢を楽しむ。", keyword: "ふぐ てっちり お取り寄せ" },
      { ja: "水仙の鉢植え", zh: "水仙盆栽", en: "Narcissus Potted Plant", hint: "水仙の甘い香りを、玄関先に一鉢。", keyword: "水仙 鉢植え" }
    ],
    "kou-58": [
      { ja: "牡蠣(かき)", zh: "牡蛎", en: "Oysters", hint: "旬の牡蠣で、寒さ深まる季節の滋養を。", keyword: "牡蠣 お取り寄せ" },
      { ja: "大根(青首・練馬等)", zh: "萝卜", en: "Daikon Radish", hint: "みずみずしい大根で、おろしや煮物を。", keyword: "大根 お取り寄せ" }
    ],
    "kou-59": [
      { ja: "鰤大根セット", zh: "鰤鱼炖萝卜套装", en: "Yellowtail & Daikon Set", hint: "鰤大根で、北風に負けぬ体を温める。", keyword: "鰤大根 お取り寄せ" },
      { ja: "蓮根(れんこん)", zh: "莲藕", en: "Lotus Root", hint: "穴の多い蓮根で、見通しの良い年の瀬を。", keyword: "蓮根 お取り寄せ" }
    ],
    "kou-60": [
      { ja: "おでん種セット", zh: "关东煮食材套装", en: "Oden Ingredient Set", hint: "老舗のおでん種で、冷えた体を温める。", keyword: "おでん お取り寄せ" },
      { ja: "橘(たちばな)の鉢植え", zh: "橘树盆栽", en: "Tachibana Citrus Potted Plant", hint: "常緑の橘で、長寿の縁起を庭先に。", keyword: "橘 鉢植え" }
    ],
    "kou-61": [
      { ja: "白子(たら白子等)", zh: "鳕鱼白子", en: "Cod Milt (Shirako)", hint: "とろりとした白子で、冬本番の膳を彩る。", keyword: "白子 お取り寄せ" },
      { ja: "湯たんぽ", zh: "热水袋", en: "Hot Water Bottle", hint: "湯たんぽのぬくもりで、閉ざす冬を和らげる。", keyword: "湯たんぽ" }
    ],
    "kou-62": [
      { ja: "寒締めほうれん草", zh: "寒摘菠菜", en: "Cold-Hardened Spinach", hint: "寒締めほうれん草で、熊眠る頃の滋味を。", keyword: "寒締めほうれん草 お取り寄せ" },
      { ja: "寒木瓜(かんぼけ)の盆栽", zh: "寒木瓜盆栽", en: "Winter-Flowering Quince Bonsai", hint: "寒木瓜の盆栽で、眠る山にも咲く花を。", keyword: "寒木瓜 盆栽" }
    ],
    "kou-63": [
      { ja: "秋味鮭(時鮭)", zh: "秋味鲑鱼", en: "Autumn Salmon", hint: "川を遡る鮭で、ちゃんちゃん焼きを仕立てる。", keyword: "鮭 ちゃんちゃん焼き お取り寄せ" },
      { ja: "八手(やつで)の鉢植え", zh: "八角金盘盆栽", en: "Fatsia Japonica Potted Plant", hint: "八手の白い花を、師走の庭にひっそりと。", keyword: "やつで 鉢植え" }
    ],
    "kou-64": [
      { ja: "冬至かぼちゃ", zh: "冬至南瓜", en: "Winter Solstice Pumpkin", hint: "冬至かぼちゃで、無病息災を願う。", keyword: "かぼちゃ お取り寄せ" },
      { ja: "柚子湯用の柚子", zh: "柚子浴用柚子", en: "Yuzu for Solstice Bath", hint: "香り豊かな柚子で、冬至の柚子湯を。", keyword: "柚子 柚子湯用 お取り寄せ" }
    ],
    "kou-65": [
      { ja: "小豆(あずき)", zh: "红豆", en: "Azuki Beans", hint: "小豆粥で、冬至の夜の無病息災を祈る。", keyword: "小豆 お取り寄せ" },
      { ja: "蝋梅(ろうばい)の鉢植え", zh: "蜡梅盆栽", en: "Wintersweet Potted Plant", hint: "蝋梅の蕾で、角落つる頃の香りを迎える。", keyword: "蝋梅 鉢植え" }
    ],
    "kou-66": [
      { ja: "蓮根(煮物用)", zh: "煮物用莲藕", en: "Lotus Root for Simmering", hint: "雪の下で麦芽吹く頃、蓮根の煮物を。", keyword: "蓮根 煮物用 お取り寄せ" },
      { ja: "福寿草の鉢植え", zh: "福寿草盆栽", en: "Amur Adonis Potted Plant", hint: "福寿草の鉢で、雪の下の春待つ心を。", keyword: "福寿草 鉢植え" }
    ],
    "kou-67": [
      { ja: "七草粥セット", zh: "七草粥套装", en: "Seven-Herb Porridge Set", hint: "七草粥セットで、芹茂る頃の無病を願う。", keyword: "七草粥セット お取り寄せ" },
      { ja: "蝋梅の切花", zh: "蜡梅切花", en: "Wintersweet Cut Flower", hint: "透き通る蝋梅の花を、寒中の一輪に。", keyword: "蝋梅 切花" }
    ],
    "kou-68": [
      { ja: "小豆粥セット", zh: "红豆粥套装", en: "Azuki Porridge Set", hint: "小豆粥で、地中に動く泉の温もりを。", keyword: "小豆粥 お取り寄せ" },
      { ja: "福寿草(開花株)", zh: "福寿草开花株", en: "Blooming Amur Adonis Plant", hint: "開花した福寿草で、春の兆しを部屋に。", keyword: "福寿草 開花株" }
    ],
    "kou-69": [
      { ja: "鴨鍋セット", zh: "鸭肉火锅套装", en: "Duck Hot Pot Set", hint: "寒締め野菜と鴨鍋で、雉鳴く寒夜を温める。", keyword: "鴨鍋 お取り寄せ" },
      { ja: "蝋梅の枝もの", zh: "蜡梅枝条", en: "Wintersweet Branches", hint: "満開の蝋梅を、香り立つ一枝で楽しむ。", keyword: "蝋梅 枝物" }
    ],
    "kou-70": [
      { ja: "蕗の薹(天ぷら用)", zh: "蜂斗菜(天妇罗用)", en: "Butterbur Sprouts for Tempura", hint: "ほろ苦い蕗の薹で、大寒の底の春を知る。", keyword: "蕗の薹 お取り寄せ" },
      { ja: "寒鰤の刺身用柵", zh: "寒鰤鱼刺身块", en: "Winter Yellowtail Sashimi Block", hint: "脂の乗った寒鰤の刺身で、寒さを楽しむ。", keyword: "寒ブリ 刺身用 お取り寄せ" }
    ],
    "kou-71": [
      { ja: "手前味噌キット", zh: "自制味噌套装", en: "Homemade Miso Kit", hint: "寒仕込みの手前味噌で、一年の恵みを仕込む。", keyword: "手前味噌 キット" },
      { ja: "節分草の鉢植え", zh: "节分草盆栽", en: "Setsubun-so Potted Plant", hint: "節分草の可憐な花で、氷厚き頃を慰める。", keyword: "節分草 鉢植え" }
    ],
    "kou-72": [
      { ja: "寒卵(産みたて)", zh: "寒卵(新鲜产)", en: "Fresh Winter-Laid Eggs", hint: "寒卵で、日脚伸びる頃の滋養をいただく。", keyword: "寒卵 お取り寄せ" },
      { ja: "福豆(節分用)", zh: "福豆(节分用)", en: "Lucky Beans for Setsubun", hint: "福豆で、大寒明けの立春を迎える支度を。", keyword: "福豆 節分 お取り寄せ" }
    ]
  };

  // -----------------------------------------------------------------------
  // Link building.
  //
  // Without an affiliate ID: plain Rakuten Ichiba mall search -- works for
  // any visitor, earns nothing, never breaks.
  //
  // With an affiliate ID: wrap the same search URL through Rakuten
  // Affiliate's generic redirect host (hb.afl.rakuten.co.jp). This is the
  // standard "dynamic link" shape Rakuten Affiliate issues for arbitrary
  // destination URLs. 甄総 -- once the Rakuten Affiliate application is
  // approved, paste ONLY the ID string into RAKUTEN_AFFILIATE_ID at the top
  // of this file; no other code needs to change.
  function buildRakutenUrl(keyword) {
    var encoded = encodeURIComponent(keyword);
    return "https://search.rakuten.co.jp/search/mall/" + encoded + "/";
  }

  function buildLink(keyword) {
    var searchUrl = buildRakutenUrl(keyword);
    if (!RAKUTEN_AFFILIATE_ID) return searchUrl;
    return (
      "https://hb.afl.rakuten.co.jp/hgc/" +
      encodeURIComponent(RAKUTEN_AFFILIATE_ID) +
      "/?pc=" + encodeURIComponent(searchUrl) +
      "&m=" + encodeURIComponent(searchUrl)
    );
  }

  // -----------------------------------------------------------------------
  // Platform gate. This feature must NEVER render inside the Capacitor
  // native app shell (capacitor:// / ionic:// / file:// schemes) -- Apple
  // App Store Review Guideline 3.1.1 forbids external purchase/affiliate
  // links inside a native app binary. It is web-only, by construction.
  function isWebPlatform() {
    try {
      var proto = root.location && root.location.protocol;
      return proto === "http:" || proto === "https:";
    } catch (e) {
      return false;
    }
  }

  function getItems(kouId) {
    var list = ITEMS[kouId];
    return list ? list.slice() : [];
  }

  // -----------------------------------------------------------------------
  // Rendering. Builds the "この時期の楽しみ" card into containerEl (cleared
  // first). Returns true if something was rendered, false otherwise (native
  // shell, unknown kouId, or missing container) so callers can decide
  // whether to keep a wrapping section visible.
  function renderCard(containerEl, kouId, lang) {
    if (!containerEl) return false;
    containerEl.innerHTML = "";

    if (!isWebPlatform()) return false;

    var items = getItems(kouId);
    if (items.length === 0) return false;

    var t = (root.SekkiI18n && root.SekkiI18n.t) || function (key) { return key; };
    var activeLang = lang || (root.SekkiI18n && root.SekkiI18n.getLang && root.SekkiI18n.getLang()) || "ja";

    containerEl.className = containerEl.className
      ? containerEl.className + " affiliate-card"
      : "affiliate-card";

    var badge = document.createElement("p");
    badge.className = "affiliate-badge";
    badge.textContent = t("affiliate_section_title", activeLang);
    containerEl.appendChild(badge);

    var list = document.createElement("div");
    list.className = "affiliate-list";

    items.forEach(function (item) {
      var entry = document.createElement("div");
      entry.className = "affiliate-item";

      var name = document.createElement("p");
      name.className = "affiliate-item-name";
      name.textContent = item[activeLang] || item.ja;
      entry.appendChild(name);

      var hint = document.createElement("p");
      hint.className = "affiliate-item-hint";
      hint.textContent = item.hint;
      entry.appendChild(hint);

      var link = document.createElement("a");
      link.className = "affiliate-item-link";
      link.href = buildLink(item.keyword);
      link.target = "_blank";
      link.rel = "noopener sponsored";
      link.textContent = t("affiliate_link_label", activeLang);
      entry.appendChild(link);

      list.appendChild(entry);
    });

    containerEl.appendChild(list);
    return true;
  }

  return {
    ITEMS: ITEMS,
    buildLink: buildLink,
    buildRakutenUrl: buildRakutenUrl,
    isWebPlatform: isWebPlatform,
    getItems: getItems,
    renderCard: renderCard
  };
});
