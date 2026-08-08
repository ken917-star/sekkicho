(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    root.SEKKI_DATA = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // NOTE on dates{}: each sekki's "dates" map gives, for a given Gregorian
  // year Y, the MM-DD on which that solar term begins WITHIN that same
  // calendar year (Jan-Dec). This mirrors the standard Japanese almanac
  // convention where all 24 terms of "year Y" are listed within Jan-Dec of Y
  // -- meaning shoukan (Lesser Cold) and daikan (Greater Cold) for year Y
  // fall in JANUARY of Y, chronologically BEFORE risshun (Feb) of the same Y.
  // koyomi.js builds the actual chronological timeline itself; it does not
  // rely on the order of this array.
  //
  // Source / confidence notes (see final report for detail):
  // - 2026: given verbatim by task spec (authoritative, do not change).
  // - 2025, 2027, 2028, 2029, 2030, 2031, 2032: cross-checked against
  //   multiple independent almanac sources (NAOJ-derived tables mirrored by
  //   9rando.info, dijizhoum.100xgj.com, koyomishokunin.com, and direct
  //   web-search summaries). All values agree across at least two
  //   independent sources except 2032 touji (winter solstice), which was
  //   estimated by analogy to 2028 (also a leap year, same phase of the
  //   4-year drift cycle) since no source returned it directly. +/-1 day
  //   tolerance applies per task spec.

  var sekki = [
    {
      id: "risshun",
      ja: "立春", zh: "立春", en: "Beginning of Spring",
      season: "spring",
      dates: { 2025: "02-03", 2026: "02-04", 2027: "02-04", 2028: "02-04", 2029: "02-03", 2030: "02-04", 2031: "02-04", 2032: "02-04" },
      reading: {
        ja: "暦の上でまだ寒さは厳しいものの、太陽の運行によって定められる二十四節気ではこの日から春が始まる。旧暦では一年の起点とされ、豆まきで厄を払う節分の翌日にあたる。梅のつぼみがほころび、氷の下で水がわずかに動き出す頃。俳句では「立春」自体が春の季語となり、寒明けの光の変化を詠む句が多い。農作業の準備も静かに始まる。",
        zh: "立春是二十四节气之首，标志着历法意义上春季的开端，尽管此时寒意仍浓。古时以立春为一年之始，民间有咬春、迎春等习俗，人们以此感知阳气初生、万物复苏的信号。梅花含苞，冰层之下水已开始流动，田间也悄然开始备耕。这一节气承载着辞旧迎新的期盼，是四时轮转最富象征意味的起点。",
        en: "Risshun marks the calendrical start of spring in the 24 solar terms, even though winter's chill still lingers across most of Japan. Traditionally treated as the beginning of the year in the old lunar-solar calendar, it follows the day after Setsubun. Plum buds swell, and beneath the ice, water begins its first quiet movement. Farmers begin preparing fields, and poets have long treasured this moment of subtle change as one of the most evocative turning points in the yearly cycle."
      }
    },
    {
      id: "usui",
      ja: "雨水", zh: "雨水", en: "Rain Water",
      season: "spring",
      dates: { 2025: "02-18", 2026: "02-18", 2027: "02-19", 2028: "02-19", 2029: "02-18", 2030: "02-18", 2031: "02-19", 2032: "02-19" },
      reading: {
        ja: "降るものが雪から雨へと変わり、氷や雪が解けて水になる頃という意味を持つ節気。まだ寒の戻りはあるが、山々の雪解け水が川に流れ込み始め、田畑を潤す準備が整っていく。昔からこの頃に雛人形を飾り始めると良縁に恵まれるという言い伝えがあり、桃の節句への支度が始まる家庭も多い。土がゆるみ、虫や草木が動き出す気配が少しずつ濃くなる季節の変わり目である。",
        zh: "雨水意味着降水由雪转为雨，冰雪渐渐消融为水。虽然倒春寒时有发生，山间融雪已开始汇入河流，为滋润田地作准备。日本民间自古有此时开始摆放雛人形的习俗，据说有助于良缘，许多家庭也借此筹备女儿节。土壤渐渐松软，草木虫豸复苏的气息一天天变得浓厚，是季节转换中承前启后的一环。",
        en: "Usui marks the point when precipitation shifts from snow to rain, and accumulated ice and snow begin melting into water. Cold snaps can still return, but meltwater from the mountains starts feeding the rivers, preparing the fields for the growing season ahead. In many households, this is traditionally when hina dolls are set out in hopes of good fortune for daughters, ahead of the Doll Festival. The soil loosens, and small signs of insects and plants stirring back to life grow steadily more noticeable."
      }
    },
    {
      id: "keichitsu",
      ja: "啓蟄", zh: "惊蛰", en: "Awakening of Insects",
      season: "spring",
      dates: { 2025: "03-05", 2026: "03-05", 2027: "03-06", 2028: "03-05", 2029: "03-05", 2030: "03-05", 2031: "03-06", 2032: "03-05" },
      reading: {
        ja: "冬の間、土の中でじっと身を潜めていた虫たちが、暖かさに誘われて穴を開いて地上に這い出してくる頃。啓は「開く」、蟄は「土中で冬眠する虫」を意味し、まさに自然界の目覚めを表す言葉である。春雷が鳴り始めるのもこの時期とされ、雷鳴とともに眠っていた生き物が驚いて動き出すという古い言い伝えも残る。桃の花がほころび始め、菜虫が蝶へと姿を変えていく変化の季節でもある。",
        zh: "启蛰意为蛰伏于土中的虫豸破土而出，是自然界苏醒的写照——「启」即开启，「蛰」指冬眠的虫类。古人认为此时春雷始鸣，惊醒了仍在沉睡的生灵，故后世又称「惊蛰」。桃花初绽，菜虫也逐渐化蝶，是万物由静转动、生机勃发的转折时节。田间的农事也随之渐渐繁忙起来。",
        en: "Keichitsu describes hibernating insects breaking open their burrows and crawling back to the surface, drawn out by returning warmth -- a vivid image of nature waking up. Spring thunder is traditionally said to begin around this time, and old folklore holds that its rumble startles slumbering creatures into motion, which is why the term is also known as the Awakening of Insects. Peach blossoms begin to open, and caterpillars start their transformation into butterflies, marking a turning point when stillness gives way to visible new life."
      }
    },
    {
      id: "shunbun",
      ja: "春分", zh: "春分", en: "Spring Equinox",
      season: "spring",
      dates: { 2025: "03-20", 2026: "03-20", 2027: "03-21", 2028: "03-20", 2029: "03-20", 2030: "03-20", 2031: "03-21", 2032: "03-20" },
      reading: {
        ja: "昼と夜の長さがほぼ等しくなる日で、この日を境に少しずつ昼が長くなっていく。国民の祝日でもあり、祖先を敬い、亡くなった人々を偲ぶ「お彼岸」の中日にあたる。桜の開花情報が話題になり始める頃でもあり、雷が鳴り出すこと、燕が海を渡って戻ってくることなど、命の活動が一気に活発化する節気として位置づけられる。寒暖を繰り返しながらも、確実に春本番へと向かっていく折り返し地点である。",
        zh: "春分昼夜几乎等长，自此白昼将逐渐延长。这一天是日本的法定假日，也是「彼岸」祭祖扫墓、缅怀先人的中心日。此时樱花开花的消息也开始成为人们热议的话题，春雷始鸣、燕子渡海归来，生命的活动骤然变得活跃。虽仍反复经历乍暖还寒，但已确实迈向春意盎然的正当时节，是四时轮转中重要的转折点。",
        en: "On the spring equinox, day and night are nearly equal in length, and from this point onward daylight steadily lengthens. It is a national holiday in Japan and falls at the midpoint of Ohigan, a week set aside for honoring ancestors and visiting family graves. Cherry blossom forecasts begin dominating conversation around this time, while thunder starts to roll and swallows return from across the sea -- signs that life's activity is surging forward all at once. Despite lingering swings between warm and cool days, the season is now unmistakably turning toward the height of spring."
      }
    },
    {
      id: "seimei",
      ja: "清明", zh: "清明", en: "Pure Brightness",
      season: "spring",
      dates: { 2025: "04-04", 2026: "04-05", 2027: "04-05", 2028: "04-04", 2029: "04-04", 2030: "04-05", 2031: "04-05", 2032: "04-04" },
      reading: {
        ja: "すべてのものが清らかで生き生きと輝いて見える頃という意味を持つ節気。空気が澄み渡り、万物がはっきりとした輪郭をもって見え始める。燕が海を渡って日本にやってきて、軒先に巣をかけ始めるのもこの頃。虹が現れ始める時期でもあり、春の光と雨とが織りなす鮮やかな景色が各地で見られる。沖縄など一部地域では、清明の頃に祖先を供養する「清明祭」が今も大切な行事として続いている。",
        zh: "清明意为万物清朗鲜明、生机盎然，故得此名。此时空气澄澈，天地万物的轮廓变得格外清晰。燕子渡海归来，开始在屋檐下筑巢安家。彩虹也在这个时节渐渐多起来，春光与春雨交织出各地缤纷的景致。在冲绳等部分地区，至今仍保留着清明时节祭祖扫墓的重要传统习俗。",
        en: "Seimei means that all things appear pure, vivid, and full of life, and the air itself grows remarkably clear, sharpening the outlines of everything in view. Swallows arrive from across the sea and begin building nests under eaves around this time. Rainbows start appearing more frequently too, as spring light and rain weave together into striking scenery across the country. In parts of Okinawa, Seimei remains an important occasion for visiting family graves and honoring ancestors, a custom still carefully observed today."
      }
    },
    {
      id: "kokuu",
      ja: "穀雨", zh: "谷雨", en: "Grain Rain",
      season: "spring",
      dates: { 2025: "04-20", 2026: "04-20", 2027: "04-20", 2028: "04-19", 2029: "04-20", 2030: "04-20", 2031: "04-20", 2032: "04-19" },
      reading: {
        ja: "田畑を潤し、穀物の成長を助ける春の雨が降る頃という意味の節気。この雨を境に霜の心配もほぼなくなるとされ、農家にとっては種まきや田植えの準備が本格化する大切な時期にあたる。牡丹が大きな花を咲かせ始めるのもこの頃で、藤の花も見頃を迎える。春から夏への橋渡しとなる、二十四節気の中でも生命力にあふれた節気である。",
        zh: "谷雨意为滋润田地、助益谷物生长的春雨降临的时节。此时霜冻的忧虑基本解除，是农家播种与备耕插秧全面展开的重要时期。牡丹在这时节绽放硕大花朵，紫藤花也迎来最佳观赏期。谷雨是春夏之交的桥梁，是二十四节气中生机格外旺盛的一环。",
        en: "Kokuu refers to the spring rains that nourish fields and help grain crops grow. By this point, the risk of frost has largely passed, making it a crucial period for farmers as they begin sowing seeds and preparing rice paddies in earnest. Peonies start unfurling their large blossoms around this time, and wisteria reaches its best viewing period as well. Serving as a bridge between spring and summer, Kokuu is one of the most vigorously life-filled terms in the entire 24-term cycle."
      }
    },
    {
      id: "rikka",
      ja: "立夏", zh: "立夏", en: "Beginning of Summer",
      season: "summer",
      dates: { 2025: "05-05", 2026: "05-05", 2027: "05-06", 2028: "05-05", 2029: "05-05", 2030: "05-05", 2031: "05-06", 2032: "05-05" },
      reading: {
        ja: "暦の上で夏が始まるとされる節気で、新緑がまぶしく輝き、爽やかな風が吹き渡る頃。まだ蒸し暑さはなく、一年で最も過ごしやすいとされる季節の始まりでもある。蛙が鳴き始め、田んぼには水が張られ、竹の子が次々と顔を出す。鯉のぼりが空を泳ぎ、子どもの日を祝う行事とも重なる、生命力にあふれた爽快な節気である。",
        zh: "立夏在历法上标志着夏季的开始，新绿耀眼夺目，清爽的风吹拂大地。此时尚无闷热之感，被认为是一年中最宜人的季节之开端。青蛙开始鸣叫，稻田陆续灌水，竹笋接连破土而出。鲤鱼旗在空中飘扬，恰逢儿童节前后的庆祝活动，是充满生机、令人神清气爽的节气。",
        en: "Rikka marks the calendrical beginning of summer, when fresh green foliage shines brilliantly and refreshing breezes sweep across the land. The oppressive humidity has not yet arrived, making this the start of what many consider the most comfortable stretch of the whole year. Frogs begin calling, rice paddies are flooded in preparation for planting, and bamboo shoots push up one after another. Carp streamers fly through the sky in celebration of Children's Day, rounding out a term brimming with vitality and refreshing energy."
      }
    },
    {
      id: "shouman",
      ja: "小満", zh: "小满", en: "Lesser Fullness of Grain",
      season: "summer",
      dates: { 2025: "05-21", 2026: "05-21", 2027: "05-21", 2028: "05-20", 2029: "05-20", 2030: "05-21", 2031: "05-21", 2032: "05-20" },
      reading: {
        ja: "秋にまいた麦などの穂が実り始め、命が満ち満ちてくる頃という意味を持つ節気。草木が生い茂り、あらゆる生き物が勢いを増す時期であり、梅の実が青々と膨らみ始めるのもこの頃。沖縄など南の地域ではこの頃から梅雨入りが始まり、じめじめとした空気が漂い始める。一方で本州の多くは爽やかな晴天が続き、初夏らしい過ごしやすさを感じられる節気でもある。",
        zh: "小满意为秋播的麦子等作物穗实渐渐饱满、生命充盈的时节。草木繁茂，万物生长势头愈发旺盛，青梅也开始渐渐鼓胀成形。冲绳等南方地区自此时起进入梅雨季，空气逐渐变得潮湿闷热；而本州大部分地区则仍是晴朗宜人的天气，让人感受到初夏特有的舒适惬意。",
        en: "Shoman refers to the point when crops such as autumn-sown wheat begin filling out their ears, and life itself feels increasingly abundant. Vegetation grows thick and every living thing gains momentum, while green plums begin swelling on the branch. In Okinawa and other southern regions, the rainy season typically begins around this time, bringing humid air, while much of mainland Japan continues to enjoy clear, pleasant weather characteristic of early summer at its most comfortable."
      }
    },
    {
      id: "boushu",
      ja: "芒種", zh: "芒种", en: "Grain in Ear",
      season: "summer",
      dates: { 2025: "06-05", 2026: "06-05", 2027: "06-06", 2028: "06-05", 2029: "06-05", 2030: "06-05", 2031: "06-06", 2032: "06-05" },
      reading: {
        ja: "芒（のぎ、稲や麦の穂先にある針状の突起）を持つ穀物の種をまく頃という意味の節気。実際にはすでに麦の収穫は終わり、代わって田植えが各地で本格化する時期にあたる。梅の実が熟し、蟷螂（かまきり）が卵から生まれ出て、蛍が舞い始めるなど、生き物たちの活動が一段と活発になる。じめじめとした梅雨入りを迎える地域も増え、湿度の高い季節への移行を感じさせる節気である。",
        zh: "芒种意为播种带有芒刺（稻麦穗尖细针状突起）的谷物种子的时节。实际上此时麦收多已结束，各地转而进入插秧的农忙高峰。梅子渐渐成熟，螳螂破卵而出，萤火虫开始翩翩飞舞，生物活动愈发热络。许多地区也陆续迎来湿闷的梅雨季，让人切实感受到向高湿季节过渡的气息。",
        en: "Boshu refers to the time for sowing grains that bear awns -- the needle-like bristles on the tips of rice and wheat ears. In practice, wheat harvesting has usually already finished by now, and rice transplanting is in full swing across the countryside instead. Plums ripen, praying mantises hatch from their egg cases, and fireflies begin their nightly dance as the activity of living creatures intensifies. More regions enter the rainy season around this time, its rising humidity signaling the shift toward the wetter half of the year."
      }
    },
    {
      id: "geshi",
      ja: "夏至", zh: "夏至", en: "Summer Solstice",
      season: "summer",
      dates: { 2025: "06-21", 2026: "06-21", 2027: "06-21", 2028: "06-21", 2029: "06-21", 2030: "06-21", 2031: "06-21", 2032: "06-21" },
      reading: {
        ja: "一年で最も昼が長く、夜が短くなる日。太陽の力が最も強まる頃とされるが、日本の多くの地域は梅雨の真っただ中にあり、晴天に恵まれることは意外に少ない。夏枯草（かこそう）が枯れ始め、菖蒲の花が咲き、半夏（からすびしゃく）という植物が生え始めるなど、雨に濡れた中でも命が確実に前へ進んでいく時期である。関西など一部地域ではこの頃にタコを食べる風習があり、稲の根がタコの足のようにしっかり張るようにと願いが込められている。",
        zh: "夏至是一年中白昼最长、黑夜最短的一天，太阳的力量在此时达到顶点，然而日本大部分地区却正值梅雨最盛之时，难得晴朗。此时夏枯草开始枯萎，菖蒲花绽放，半夏（乌柄勺）等植物也开始萌发——即便笼罩在雨水之中，生命依然确实地向前迈进。关西等地区自古有夏至食用章鱼的习俗，寄托着愿稻根如章鱼足般牢牢扎根的心愿。",
        en: "The summer solstice brings the longest day and shortest night of the year, the point when the sun's power is said to be at its peak -- though much of Japan is deep in the rainy season, and clear skies are actually rare. Certain summer grasses begin to wither, irises bloom, and a plant called karasu-bishaku starts to sprout: signs that life keeps moving steadily forward even under constant rain. In parts of the Kansai region, there is an old custom of eating octopus around this time, in hopes that rice roots will take hold as firmly as an octopus grips with its arms."
      }
    },
    {
      id: "shousho",
      ja: "小暑", zh: "小暑", en: "Lesser Heat",
      season: "summer",
      dates: { 2025: "07-07", 2026: "07-07", 2027: "07-07", 2028: "07-06", 2029: "07-07", 2030: "07-07", 2031: "07-07", 2032: "07-06" },
      reading: {
        ja: "本格的な暑さが始まる少し手前、暑さが徐々に増していく頃という意味の節気。梅雨明けが近づき、蓮の花が水面に美しく開き始める。同時に集中豪雨が起こりやすい時期でもあり、注意が必要とされてきた。暑中見舞いを出し始める時期の目安ともされ、鷹の幼鳥が飛び方や狩りの技術を親から学び始めるなど、若い命が独り立ちに向けて動き出す節気でもある。",
        zh: "小暑意为真正的酷暑到来之前、暑气正逐渐加剧的时节。梅雨渐近尾声，荷花开始在水面上娇美绽放。同时这也是集中暴雨易发的时期，历来被提醒需多加留意。此时也是开始寄送「暑中问候」的参考节点，幼鹰开始跟随亲鸟学习飞行与狩猎技巧，是幼小生命迈向独立的节气。",
        en: "Shosho marks the point just before the height of summer heat truly arrives, when the temperature gradually climbs higher. The rainy season nears its end, and lotus flowers begin opening beautifully across ponds. This is also a period prone to sudden torrential downpours, traditionally requiring extra caution. It is roughly when people begin sending midsummer greeting cards, and young hawks start learning to fly and hunt from their parents -- a term marking young lives taking their first steps toward independence."
      }
    },
    {
      id: "taisho",
      ja: "大暑", zh: "大暑", en: "Greater Heat",
      season: "summer",
      dates: { 2025: "07-22", 2026: "07-23", 2027: "07-23", 2028: "07-22", 2029: "07-22", 2030: "07-23", 2031: "07-23", 2032: "07-22" },
      reading: {
        ja: "一年で最も暑さが厳しくなる頃という意味を持つ節気。蝉の声が一段と大きくなり、入道雲がもくもくと空にそびえ立つ、いかにも夏らしい景色が広がる。「土用の丑の日」を含むことが多く、鰻を食べて夏バテを防ぐ風習が今も広く根付いている。桐の花が結実し、夕立が突然降り出すなど、夏本番ならではの荒々しくも力強い自然の営みが見られる節気である。",
        zh: "大暑意为一年中暑热最为炽烈的时节。蝉鸣愈发响亮，积雨云在天空中层层耸立，展现出夏日特有的典型景致。此节气中常包含「土用丑日」，食用鳗鱼以防中暑的习俗至今仍广泛流传。桐树开始结果，午后雷阵雨说来就来，处处可见盛夏时节自然界那股既狂野又充满力量的气息。",
        en: "Taisho marks the point of the year's most intense heat. Cicadas grow ever louder, and towering cumulonimbus clouds billow up into the sky in scenes utterly characteristic of high summer. This term often contains the midsummer ox day (doyo no ushi no hi), when eating eel to ward off summer fatigue remains a widely observed custom. Paulownia trees set their fruit, and sudden evening thunderstorms sweep through -- all part of the raw, powerful rhythm of nature at the very peak of summer."
      }
    },
    {
      id: "risshuu",
      ja: "立秋", zh: "立秋", en: "Beginning of Autumn",
      season: "autumn",
      dates: { 2025: "08-07", 2026: "08-07", 2027: "08-08", 2028: "08-07", 2029: "08-07", 2030: "08-07", 2031: "08-08", 2032: "08-07" },
      reading: {
        ja: "暦の上で秋が始まるとされる節気だが、実際には一年で最も暑さが厳しい時期にあたることが多い。この日を境に、暑中見舞いは「残暑見舞い」へと呼び方を変える。涼しい風がまだ気配程度にしか感じられない一方、蝉の種類が徐々に移り変わり、朝夕にはわずかながら秋の気配が忍び寄り始める。ススキの穂がふくらみ始めるのもこの頃で、季節の先取りを楽しむ節気である。",
        zh: "立秋在历法上标志着秋季的开始，但实际上此时往往正值一年中暑热最盛之际。以这一天为分界，「暑中问候」也随之改称为「残暑问候」。虽凉风尚只是一丝若有若无的预感，但蝉鸣的种类已悄然更替，早晚间也开始隐约透出秋意。芒草的花穗也在此时渐渐鼓胀，是一个提前品味季节转换乐趣的节气。",
        en: "Risshu marks the calendrical start of autumn, though in practice this period often brings the year's most intense heat. From this day on, midsummer greeting cards switch to being called lingering-heat greetings instead. While cool breezes remain barely more than a suggestion, the chorus of cicada species gradually shifts, and mornings and evenings begin carrying faint traces of autumn. Pampas grass plumes start to swell around this time too, making it a term for savoring the season just slightly ahead of its arrival."
      }
    },
    {
      id: "shosho",
      ja: "処暑", zh: "处暑", en: "End of Heat",
      season: "autumn",
      dates: { 2025: "08-23", 2026: "08-23", 2027: "08-23", 2028: "08-22", 2029: "08-23", 2030: "08-23", 2031: "08-23", 2032: "08-22" },
      reading: {
        ja: "厳しい暑さがようやく収まり始める頃という意味を持つ節気。「処」には「とどまる、やむ」という意味があり、暑さの峠を越えたことを示す。台風が多く発生し、各地に被害をもたらしやすい時期でもあるため、古くから警戒が呼びかけられてきた。稲穂が実り始め、朝夕の虫の声が徐々に賑やかになるなど、秋の実りと涼しさへの移行がゆっくりと進んでいく節気である。",
        zh: "处暑意为酷热终于开始消退的时节。「处」含有「停止、止息」之意，标志着暑热已越过顶峰。此时也是台风多发、易给各地带来灾害的时期，自古便被提醒需多加警惕。稲穂渐渐饱满结实，早晚的虫鸣也日渐热闹，是秋日丰收与凉意缓缓降临的过渡节气。",
        en: "Shosho signals that the fierce heat is finally beginning to subside. The character sho carries the sense of stopping or coming to rest, indicating that the peak of summer heat has passed. This is also a period when typhoons frequently form and can cause damage across the country, so caution has long been urged during this time. Rice ears begin to ripen, and the chirping of insects grows livelier morning and evening -- a term marking the slow shift toward autumn's harvest and cooler air."
      }
    },
    {
      id: "hakuro",
      ja: "白露", zh: "白露", en: "White Dew",
      season: "autumn",
      dates: { 2025: "09-07", 2026: "09-07", 2027: "09-08", 2028: "09-07", 2029: "09-07", 2030: "09-07", 2031: "09-08", 2032: "09-07" },
      reading: {
        ja: "大気が冷え込み始め、草花に宿る露が白く輝いて見える頃という意味の節気。朝の光を受けた露の粒がきらきらと光る様子は、秋の訪れを最も繊細に伝える景色の一つとされる。渡り鳥が北から日本へ渡ってくる時期でもあり、赤とんぼが群れをなして飛ぶ姿もよく見られるようになる。日中はまだ暑さが残るものの、朝晩は確実に涼しさを増していく節気である。",
        zh: "白露意为大气开始转凉，草叶上凝结的露珠在晨光下泛白闪耀的时节。晨光映照下露珠晶莹闪烁的景象，被视为最细腻传达秋意来临的风景之一。此时也是候鸟自北方飞抵日本的时期，成群飞舞的赤蜻蜓也愈发常见。虽白天仍残留暑气，但早晚的凉意却确实一天天加深，是感受秋天悄然而至的节气。",
        en: "Hakuro describes the point when the air begins to cool and dew clinging to grasses and flowers appears to shine white. The sight of dewdrops glittering in the morning light is considered one of the most delicate expressions of autumn's arrival. Migratory birds start arriving in Japan from the north, and red dragonflies are increasingly seen flying in swarms. Daytime heat still lingers, but mornings and evenings grow steadily and unmistakably cooler as this term unfolds."
      }
    },
    {
      id: "shuubun",
      ja: "秋分", zh: "秋分", en: "Autumn Equinox",
      season: "autumn",
      dates: { 2025: "09-23", 2026: "09-23", 2027: "09-23", 2028: "09-22", 2029: "09-23", 2030: "09-23", 2031: "09-23", 2032: "09-22" },
      reading: {
        ja: "春分と同様に昼と夜の長さがほぼ等しくなる日で、これ以降は夜の方が徐々に長くなっていく。国民の祝日であり、「秋の彼岸」の中日として先祖を敬う行事が各地で営まれる。空はいっそう高く澄み渡り、赤とんぼが群れ飛ぶ姿や、稲刈りの光景があちこちで見られるようになる。雷が鳴らなくなり、虫たちが冬に向けて土に隠れ始めるなど、自然界が静けさへと向かっていく折り返しの節気である。",
        zh: "秋分与春分相似，昼夜几乎等长，此后夜晚将逐渐变长。这一天是日本的法定假日，也是「秋彼岸」祭祖扫墓的中心日，各地都会举行缅怀先人的活动。天空愈发高远澄澈，成群飞舞的赤蜻蜓与遍地的稻收景象随处可见。雷声渐渐止息，虫豸也开始为过冬而潜入土中，是自然界转向宁静的重要转折节气。",
        en: "Like the spring equinox, day and night are nearly equal in length on the autumn equinox, and from here on nights steadily grow longer. It is a national holiday in Japan, falling at the midpoint of Akihigan, when families across the country honor their ancestors. The sky grows even higher and clearer, while swarms of red dragonflies and scenes of rice harvesting appear everywhere. Thunder falls silent, and insects begin retreating into the soil ahead of winter -- marking the turning point where nature starts settling into stillness."
      }
    },
    {
      id: "kanro",
      ja: "寒露", zh: "寒露", en: "Cold Dew",
      season: "autumn",
      dates: { 2025: "10-08", 2026: "10-08", 2027: "10-08", 2028: "10-08", 2029: "10-08", 2030: "10-08", 2031: "10-08", 2032: "10-08" },
      reading: {
        ja: "露が冷たさを増し、凍りそうなほど冷たくなり始める頃という意味の節気。空気は一段と澄み渡り、夜空には月や星がくっきりと美しく見えるようになる。菊の花が盛んに咲き、渡ってきた雁が空を渡っていく姿もこの頃の風物詩とされる。稲刈りが各地で最盛期を迎え、実りの秋を象徴する景色が広がる、行楽にも農作業にも適した爽やかな節気である。",
        zh: "寒露意为露水愈发冰凉、几近凝结成霜的时节。空气愈加澄澈清冽，夜空中的明月与繁星也显得格外清晰美丽。菊花盛开，南飞的雁群掠过长空，都是此时代表性的风物。稻收在各地迎来最盛之期，象征丰收之秋的景色遍布田野——是一个宜出游、也宜农忙的清爽节气。",
        en: "Kanro describes the point when dew grows noticeably colder, nearly cold enough to freeze. The air becomes even clearer, and the moon and stars appear crisp and beautiful against the night sky. Chrysanthemums bloom abundantly, and formations of geese crossing the sky are a familiar sight of this season. Rice harvesting reaches its peak across the country, filling the landscape with scenes that embody the richness of autumn -- a refreshing term well suited to both outdoor excursions and farm work alike."
      }
    },
    {
      id: "soukou",
      ja: "霜降", zh: "霜降", en: "Frost's Descent",
      season: "autumn",
      dates: { 2025: "10-23", 2026: "10-23", 2027: "10-23", 2028: "10-23", 2029: "10-23", 2030: "10-23", 2031: "10-23", 2032: "10-23" },
      reading: {
        ja: "朝晩の冷え込みが厳しくなり、各地で霜が降り始める頃という意味の節気。山々では紅葉がいよいよ見頃を迎え、赤や黄色に染まった木々の彩りが里へと少しずつ下りてくる。冬支度を本格的に始める目安ともされ、木枯らしが吹き始めるのもこの頃である。秋の最後を締めくくるにふさわしい、深まりゆく季節の気配に満ちた節気である。",
        zh: "霜降意为早晚寒意加剧、各地开始降霜的时节。山中的红叶终于迎来最佳观赏期，被染成红黄色调的树木色彩也渐渐向平地蔓延而来。此时也被视为正式开始筹备过冬的参考节点，木枯（初寒风）也大约在此时开始吹起。作为秋天的收尾，是一个充满季节渐深气息、恰如其分的节气。",
        en: "Soukou describes the point when morning and evening chill intensifies and frost begins forming across the country. Mountain foliage finally reaches its peak, with reds and yellows gradually spreading down toward the lowlands. This is also traditionally taken as a cue to start preparing in earnest for winter, and the season's first cold gusts (kogarashi) typically begin blowing around now. Fittingly closing out autumn, this term is steeped in the unmistakable feeling of a season deepening toward its end."
      }
    },
    {
      id: "rittou",
      ja: "立冬", zh: "立冬", en: "Beginning of Winter",
      season: "winter",
      dates: { 2025: "11-07", 2026: "11-07", 2027: "11-07", 2028: "11-07", 2029: "11-07", 2030: "11-07", 2031: "11-07", 2032: "11-07" },
      reading: {
        ja: "暦の上で冬が始まるとされる節気。木枯らしが吹き、木々の葉がすっかり落ちて冬支度が本格化する頃である。山では初雪の便りが届き始め、朝晩には吐く息が白く見えるようになる。こたつを出す家庭が増え、鍋料理が恋しくなる季節でもある。まだ日中は穏やかな小春日和が続くこともあるが、確実に冬へと向かっていることを実感させる節気である。",
        zh: "立冬在历法上标志着冬季的开始。木枯风起，树叶尽数飘落，各家各户开始正式筹备过冬。山间陆续传来初雪的消息，清晨呼出的气息也开始泛白可见。开始使用暖炉桌（被炉）的家庭渐渐增多，也正是让人格外想念火锅料理的季节。虽白天有时仍会出现宜人的「小阳春」天气，但已能真切感受到冬天正稳步逼近，是这样一个节气。",
        en: "Ritto marks the calendrical beginning of winter. Cold winter gusts begin to blow, trees shed the last of their leaves, and households start preparing for winter in earnest. Reports of the season's first snowfall start arriving from the mountains, and one's breath becomes visible in the morning and evening air. More homes bring out their kotatsu heated tables, and it becomes the season when hot-pot dishes start to feel especially inviting. Mild, spring-like koharu biyori days can still occur during the daytime, yet the unmistakable sense that winter is steadily approaching runs throughout this term."
      }
    },
    {
      id: "shousetsu",
      ja: "小雪", zh: "小雪", en: "Lesser Snow",
      season: "winter",
      dates: { 2025: "11-22", 2026: "11-22", 2027: "11-22", 2028: "11-22", 2029: "11-22", 2030: "11-22", 2031: "11-22", 2032: "11-22" },
      reading: {
        ja: "わずかながら雪が降り始める頃という意味の節気。本格的な積雪にはまだ早いものの、山間部などでは初雪の便りが増えてくる。木々の葉がほとんど落ち、冬枯れの景色が広がる一方、山茶花や水仙など寒さに強い花が彩りを添える。北風が冷たさを増し、防寒対策が本格的に必要になる頃でもあり、冬支度の総仕上げを促す節気である。",
        zh: "小雪意为开始零星降雪的时节。虽尚未到大规模积雪的程度，但山区一带初雪的消息渐渐增多。树叶几乎已落尽，一片冬日萧瑟的景色蔓延开来，而山茶花、水仙等耐寒花卉则为此时增添了几分色彩。北风愈发凛冽，御寒措施也进入切实需要落实的阶段，是催促人们完成冬季准备工作收尾的节气。",
        en: "Shosetsu marks the point when light snow begins to fall here and there. Heavy accumulation is still some way off, but reports of first snowfall in mountainous areas grow more frequent. Trees have shed nearly all their leaves, spreading a bare, wintry look across the land, while cold-hardy flowers like sasanqua camellia and narcissus add welcome touches of color. North winds turn sharper, making proper cold-weather preparation genuinely necessary -- a term that urges people to put the finishing touches on their winter readiness."
      }
    },
    {
      id: "taisetsu",
      ja: "大雪", zh: "大雪", en: "Greater Snow",
      season: "winter",
      dates: { 2025: "12-07", 2026: "12-07", 2027: "12-07", 2028: "12-06", 2029: "12-07", 2030: "12-07", 2031: "12-07", 2032: "12-06" },
      reading: {
        ja: "本格的に雪が降り積もり始める頃という意味の節気。山々は白く雪化粧をまとい始め、平野部でも冷え込みが一段と厳しくなる。熊が冬眠のために穴にこもり、ぶりなどの魚が旬を迎える時期でもある。年末に向けて慌ただしさが増す一方、こたつや鍋を囲む団らんが恋しくなる、冬らしい落ち着きと厳しさが同居する節気である。",
        zh: "大雪意为开始真正大量降雪的时节。群山披上皑皑白雪，平原地区的寒意也愈发凛冽刺骨。此时熊已进入洞穴冬眠，鰤鱼等鱼类也迎来当季美味的时节。随着年末临近，人们的生活也日渐忙碌，而围坐暖炉桌、共享火锅的团聚时光却愈发令人期待——这是一个冬日沉静与严寒并存的节气。",
        en: "Taisetsu marks the point when snow truly begins to accumulate in earnest. Mountains don a full coat of white, and even the lowlands feel a noticeably sharper chill. Bears retreat into their dens for hibernation, and fish such as yellowtail come into peak season. As the bustle of year-end approaches, the pull toward gathering around a kotatsu or a shared hot pot grows stronger -- a term where winter's quiet stillness and its harshness sit comfortably side by side."
      }
    },
    {
      id: "touji",
      ja: "冬至", zh: "冬至", en: "Winter Solstice",
      season: "winter",
      dates: { 2025: "12-21", 2026: "12-22", 2027: "12-22", 2028: "12-21", 2029: "12-21", 2030: "12-22", 2031: "12-22", 2032: "12-21" },
      reading: {
        ja: "一年で最も昼が短く、夜が長くなる日。この日を境に少しずつ日が長くなっていくことから、古くは「一陽来復」、すなわち陰から陽へと転じる特別な日として大切にされてきた。柚子湯に入り、かぼちゃを食べて無病息災を願う風習が今も広く残る。厳しい寒さの底にありながら、これから日照が回復していくという希望を内包した、暦の上で重要な折り返し地点である。",
        zh: "冬至是一年中白昼最短、黑夜最长的一天。以此为界，白昼将逐渐变长，因此自古便被视为「一阳来复」，即阴极转阳的特殊日子而备受重视。泡柚子汤、食用南瓜以祈求无病无灾的习俗至今仍广泛流传。虽正值严寒的谷底，却蕴含着日照即将回升的希望，是历法上意义重大的转折点。",
        en: "The winter solstice brings the shortest day and longest night of the year. Because daylight gradually begins lengthening again from this point on, it has long been treasured as a special turning point sometimes described as yang returning after yin -- the moment darkness begins yielding back to light. Bathing in yuzu-scented hot water and eating pumpkin to pray for good health remain widely observed customs even today. Though sitting at the very depths of winter's cold, this term carries within it the quiet promise that daylight is already on its way back."
      }
    },
    {
      id: "shoukan",
      ja: "小寒", zh: "小寒", en: "Lesser Cold",
      season: "winter",
      dates: { 2025: "01-05", 2026: "01-05", 2027: "01-05", 2028: "01-06", 2029: "01-05", 2030: "01-05", 2031: "01-05", 2032: "01-06" },
      reading: {
        ja: "寒さがいよいよ本格的になっていく頃という意味の節気。「寒の入り」とも呼ばれ、この日から立春前日の「寒の明け」までの約一ヶ月間が、一年で最も寒さの厳しい「寒の内」とされる。芹（せり）が生き生きと育ち始め、水面下では水がわずかに動き出すなど、厳しい寒さの中にも次の季節への小さな兆しが見え隠れする。武道や書道などで「寒稽古」が行われるのも、この時期ならではの伝統である。",
        zh: "小寒意为寒意终于开始真正加剧的时节。此日又称「寒之入」，自此直至立春前日的「寒之明」约一个月间，被视为一年中寒气最盛的「寒中」时期。水芹开始生机勃勃地生长，水面之下也悄然开始有了细微的流动——在严寒之中，依然能窥见通向下一个季节的小小征兆。武道、书道等领域进行「寒稽古」（寒中修炼），也是这一时期特有的传统。",
        en: "Shokan marks the point when the cold truly begins in earnest. Also known as the entry into cold, it opens the roughly month-long period running until the day before Risshun, traditionally regarded as the harshest, coldest stretch of the entire year. Water dropwort (seri) grows vigorously, and beneath the water's surface a faint stirring begins -- small hints of the next season peeking through even amid the deepest cold. Cold-weather training sessions in martial arts and calligraphy, known as kangeiko, are a distinctive tradition observed during this very period."
      }
    },
    {
      id: "daikan",
      ja: "大寒", zh: "大寒", en: "Greater Cold",
      season: "winter",
      dates: { 2025: "01-20", 2026: "01-20", 2027: "01-20", 2028: "01-20", 2029: "01-20", 2030: "01-20", 2031: "01-20", 2032: "01-20" },
      reading: {
        ja: "一年で最も寒さが厳しくなるとされる、二十四節気の最後を締めくくる節気。「寒の内」の終盤にあたり、この時期に汲んだ水は雑菌が少なく良質とされ、酒や味噌などの仕込みに適した「寒仕込み」が各地で行われる。鶏が卵を産み始める頃ともされ、厳しい寒さの中にも次の生命が静かに育まれている。大寒を過ぎればいよいよ立春を迎え、二十四節気は再び最初の節気へと巡っていく。",
        zh: "大寒是一年中寒气最为凛冽的节气，也是二十四节气循环的最后一环。此时正值「寒中」的尾声，这一时期汲取的水被认为杂菌较少、水质纯净，各地也因此盛行利用「寒仕込」酿造清酒、味噌等的传统做法。据说母鸡也约在此时开始产卵，即便身处严寒之中，新的生命依然在静静孕育。大寒过后便将迎来立春，二十四节气也将再度回到起点，循环往复。",
        en: "Daikan, the final term in the 24 solar terms, is traditionally regarded as the coldest stretch of the entire year. Falling near the end of the cold-within period, water drawn during this time is believed to contain fewer microbes and to be especially pure, making it well suited for the traditional cold-season brewing of sake and miso practiced in many regions. Hens are also said to begin laying eggs again around now, quietly nurturing new life even amid the harshest cold. Once Daikan passes, Risshun arrives once more, and the cycle of the 24 solar terms turns back around to its beginning."
      }
    }
  ];

  var kou = [
    {
      id: "kou-01", sekkiId: "risshun", order: 1,
      ja: "東風解凍", jaReading: "はるかぜこおりをとく",
      zh: "东风解冻", en: "East Wind Melts the Ice",
      desc: {
        ja: "東からの風がまだ冷たい大気に混じり始め、川や池に張った氷が縁からゆるみ出す。夜明けの空気にわずかな湿り気が戻り、冬の張りつめた静けさが少しずつほどけていく最初の五日間。",
        zh: "东风渐起，混入仍显寒冷的大气之中，河塘边缘的薄冰开始松动融化。清晨空气重新带上一丝湿润，冬日紧绷的寂静在这最初的五天里悄然舒展。",
        en: "An east wind begins stirring the still-cold air, and ice along the edges of rivers and ponds starts to loosen. Morning air regains a trace of moisture as winter's taut silence slowly begins to unravel."
      },
      food: { ja: ["蕗の薹", "早春キャベツ"], zh: ["蜂斗菜嫩芽", "早春卷心菜"], en: ["Butterbur sprouts (fuki-no-to)", "Early spring cabbage"] },
      flower: { ja: "梅", zh: "梅花", en: "Plum blossom" }
    },
    {
      id: "kou-02", sekkiId: "risshun", order: 2,
      ja: "黄鶯睍睆", jaReading: "うぐいすなく",
      zh: "蛰虫始振", en: "The Bush Warbler Sings",
      desc: {
        ja: "山里でウグイスが初めて美しい声で鳴き始める頃。まだ姿は見えにくいが、その澄んだ一声が春の到来をいち早く知らせる。里では梅の香りとともに、耳から春を感じ始める時期。",
        zh: "山间的树莺开始发出初春第一声清越啼鸣的时节。虽尚难觅其身影，那一声清亮已率先报告春天的到来，人们伴着梅香，最先从声音里察觉季节转换。",
        en: "In the hills, the bush warbler (uguisu) sings its first clear notes of the year. Though the bird itself stays hidden in the branches, its bright call is often the very first audible sign that spring has arrived, alongside the scent of plum blossoms."
      },
      food: { ja: ["ふきのとう味噌", "若布"], zh: ["蜂斗菜味噌", "裙带菜"], en: ["Butterbur miso", "Wakame seaweed"] },
      flower: { ja: "沈丁花", zh: "瑞香花", en: "Daphne blossom" }
    },
    {
      id: "kou-03", sekkiId: "risshun", order: 3,
      ja: "魚上氷", jaReading: "うおこおりをいずる",
      zh: "鱼陟负冰", en: "Fish Rise Beneath the Breaking Ice",
      desc: {
        ja: "池や川の氷が薄く割れ始め、その隙間から魚が姿を現す頃。冬の間じっと水底に潜んでいた魚たちが、緩んだ水温に誘われて浅瀬近くまで上がってくる。",
        zh: "池塘河川的薄冰开始裂开，鱼儿从缝隙间探出身影的时节。整个冬天蛰伏水底的鱼群，被回暖的水温唤起，渐渐游向近岸的浅处。",
        en: "The thin ice on ponds and rivers begins to crack, and fish start rising through the gaps toward the surface. After a winter spent motionless near the riverbed, they are drawn upward by the slowly warming water into the shallows."
      },
      food: { ja: ["公魚(わかさぎ)", "小松菜"], zh: ["西太公鱼", "小松菜"], en: ["Smelt (wakasagi)", "Komatsuna greens"] },
      flower: { ja: "福寿草", zh: "福寿草", en: "Amur adonis" }
    },
    {
      id: "kou-04", sekkiId: "usui", order: 1,
      ja: "土脉潤起", jaReading: "つちのしょううるおいおこる",
      zh: "獭祭鱼", en: "The Earth Grows Moist and Stirs",
      desc: {
        ja: "凍っていた土壌が水分を含んでやわらかくなり始める頃。畑の土が黒々と湿り気を帯び、鍬を入れやすくなることから、農家では畑仕事の準備が本格化する。",
        zh: "冻结的土壤开始重新吸收水分，逐渐变得松软的时节。田里的泥土转为湿润的深色，翻土也更加省力，农家开始正式着手春耕的准备工作。",
        en: "The frozen soil begins to absorb moisture and soften. Fields turn a darker, damper shade of earth, making the ground easier to till, and farmers start their preparations for the coming planting season in earnest."
      },
      food: { ja: ["菜の花", "新玉ねぎ"], zh: ["油菜花薹", "新洋葱"], en: ["Rapeseed blossoms (nanohana)", "New-season onions"] },
      flower: { ja: "猫柳", zh: "细叶红柳", en: "Pussy willow" }
    },
    {
      id: "kou-05", sekkiId: "usui", order: 2,
      ja: "霞始靆", jaReading: "かすみはじめてたなびく",
      zh: "鸿雁来", en: "Mist Begins to Trail Across the Land",
      desc: {
        ja: "山裾や遠くの景色が薄い霞に包まれ、輪郭がやわらかくぼやけて見え始める頃。冬の澄んだ空気とは違う、しっとりとした春らしい遠景が広がる。",
        zh: "山脚与远景开始笼罩在淡淡的春霞之中，轮廓变得柔和朦胧的时节。与冬日清冽的空气不同，此时的远景多了几分湿润而柔美的春意。",
        en: "Distant hillsides and landscapes begin to soften under a thin veil of haze, their outlines blurring gently. Unlike winter's crisp, transparent air, the scenery now takes on the moist, hazy quality distinctive to spring."
      },
      food: { ja: ["芹", "蛤"], zh: ["水芹", "蛤蜊"], en: ["Water dropwort (seri)", "Clams (hamaguri)"] },
      flower: { ja: "木蓮", zh: "玉兰", en: "Magnolia" }
    },
    {
      id: "kou-06", sekkiId: "usui", order: 3,
      ja: "草木萌動", jaReading: "そうもくめばえいずる",
      zh: "草木萌动", en: "Grasses and Trees Put Forth Buds",
      desc: {
        ja: "枯れて見えた草木のあちこちから、小さな新芽がいっせいに芽吹き始める頃。地面近くに目を凝らすと、名も知らぬ若草の緑がすでに顔を出している。",
        zh: "看似枯萎的草木各处开始同时萌发嫩芽的时节。俯身细看地面，便能发现许多不知名的嫩草早已探出了新绿的芽尖。",
        en: "Small new buds begin sprouting all at once from trees and grasses that had looked withered through winter. A closer look near the ground reveals unnamed young shoots of green already pushing through."
      },
      food: { ja: ["たらの芽", "独活(うど)"], zh: ["楤木芽", "独活"], en: ["Angelica tree shoots (tara-no-me)", "Udo (Japanese spikenard)"] },
      flower: { ja: "桜の蕾", zh: "樱花蓓蕾", en: "Cherry blossom buds" }
    },
    {
      id: "kou-07", sekkiId: "keichitsu", order: 1,
      ja: "蟄虫啓戸", jaReading: "すごもりむしとをひらく",
      zh: "桃始华", en: "Hibernating Insects Open Their Doors",
      desc: {
        ja: "土の中で冬を越していた虫たちが、それぞれの隠れ家の戸を開くようにして地上へ姿を現し始める頃。日だまりを歩くと、小さな虫の気配がふと足元に感じられる。",
        zh: "在土中越冬的虫豸开始打开各自的「藏身之门」，重新爬回地面的时节。行走在向阳处，脚边偶尔便能感受到小虫苏醒后的微弱动静。",
        en: "Insects that spent winter underground begin opening the doors of their burrows and re-emerging onto the surface. Walking through a sunlit patch of ground, one can suddenly sense the faint stirrings of small creatures underfoot."
      },
      food: { ja: ["蓬(よもぎ)", "浅蜊"], zh: ["艾草", "蛤仔"], en: ["Mugwort (yomogi)", "Baby clams (asari)"] },
      flower: { ja: "沈丁花満開", zh: "瑞香盛开", en: "Daphne in full bloom" }
    },
    {
      id: "kou-08", sekkiId: "keichitsu", order: 2,
      ja: "桃始笑", jaReading: "ももはじめてさく",
      zh: "仓庚鸣", en: "Peach Blossoms Begin to Smile",
      desc: {
        ja: "桃のつぼみがほころび、花开くことを昔の人は「笑う」と表現した。薄紅色の花がぽつぽつと開き始め、庭先に春らしい彩りが加わっていく。",
        zh: "桃花含苞初绽，古人将花开的姿态形容为「笑颜」。淡粉色的花朵一朵朵陆续绽放，为庭院添上一抹春天特有的色彩。",
        en: "Peach buds begin to open, an act that people in earlier times poetically described as the flowers smiling. Pale pink blossoms open one by one, adding the season's first real touch of color to gardens and hedgerows."
      },
      food: { ja: ["蕨(わらび)", "鰆(さわら)"], zh: ["蕨菜", "马鲛鱼"], en: ["Bracken fern (warabi)", "Spanish mackerel (sawara)"] },
      flower: { ja: "桃", zh: "桃花", en: "Peach blossom" }
    },
    {
      id: "kou-09", sekkiId: "keichitsu", order: 3,
      ja: "菜虫化蝶", jaReading: "なむしちょうとなる",
      zh: "鹰化为鸠", en: "Caterpillars Transform into Butterflies",
      desc: {
        ja: "青虫が羽化してモンシロチョウなどの蝶へと姿を変え、ひらひらと畑の上を舞い始める頃。地を這っていた虫が空を飛ぶ姿に変わる、季節ならではの劇的な変化の場面。",
        zh: "青虫羽化成为纹白蝶等蝴蝶，翩翩飞舞于田野之上的时节。原本匍匐地面的幼虫化身振翅飞翔之姿，是这个季节里最富戏剧性的转变。",
        en: "Green caterpillars complete their metamorphosis into cabbage white butterflies and other species, fluttering for the first time over the fields. A creature that once crawled along the ground now takes to the air -- one of the season's most dramatic transformations."
      },
      food: { ja: ["菜の花のおひたし", "鰆の西京焼き"], zh: ["凉拌油菜花", "西京烧马鲛鱼"], en: ["Blanched rapeseed blossoms", "Miso-glazed Spanish mackerel"] },
      flower: { ja: "菜の花", zh: "油菜花", en: "Rapeseed flowers" }
    },
    {
      id: "kou-10", sekkiId: "shunbun", order: 1,
      ja: "雀始巣", jaReading: "すずめはじめてすくう",
      zh: "玄鸟至", en: "Sparrows Begin Building Nests",
      desc: {
        ja: "スズメが屋根の隙間や木の穴に枯れ草などを運び込み、巣づくりを始める頃。ちゅんちゅんという鳴き声とともに、忙しく飛び回る姿が身近な場所で見られるようになる。",
        zh: "麻雀开始将枯草等衔入屋檐缝隙或树洞中筑巢的时节。伴随着啾啾的叫声，忙碌穿梭的身影在住家附近随处可见。",
        en: "Sparrows begin carrying dried grass and twigs into gaps in eaves or hollows in trees to build their nests. Their busy, chattering flight becomes a familiar everyday sight around houses and gardens."
      },
      food: { ja: ["筍(たけのこ)", "空豆"], zh: ["春笋", "蚕豆"], en: ["Bamboo shoots (takenoko)", "Fava beans"] },
      flower: { ja: "木瓜(ぼけ)の花", zh: "皱皮木瓜花", en: "Flowering quince" }
    },
    {
      id: "kou-11", sekkiId: "shunbun", order: 2,
      ja: "桜始開", jaReading: "さくらはじめてひらく",
      zh: "雷乃发声", en: "Cherry Blossoms Begin to Open",
      desc: {
        ja: "ソメイヨシノなどの桜が各地でほころび始め、花見の話題が一気に盛り上がる頃。つぼみの先端がふっくらと膨らみ、薄紅色がのぞき始める瞬間を多くの人が心待ちにしている。",
        zh: "染井吉野等樱花在各地相继绽放，赏花话题骤然升温的时节。花苞前端渐渐鼓起、透出淡淡粉色的这一瞬间，为许多人所热切期待。",
        en: "Someiyoshino and other cherry varieties begin blooming across the country, and talk of flower-viewing suddenly fills every conversation. Many people eagerly await the exact moment when a swollen bud tip finally reveals its first hint of pale pink."
      },
      food: { ja: ["桜餅", "鯛"], zh: ["樱饼", "鲷鱼"], en: ["Sakura mochi", "Sea bream (tai)"] },
      flower: { ja: "桜", zh: "樱花", en: "Cherry blossom" }
    },
    {
      id: "kou-12", sekkiId: "shunbun", order: 3,
      ja: "雷乃発声", jaReading: "かみなりすなわちこえをはっす",
      zh: "始电", en: "Thunder Begins to Sound",
      desc: {
        ja: "遠くの空から春雷がゴロゴロと響き始める頃。冬の間は鳴りをひそめていた雷が、大気の不安定さとともに再び姿を現し、季節の移り変わりを音で知らせる。",
        zh: "远方天际开始隆隆响起春雷的时节。整个冬天沉寂的雷声，随着大气变得不稳定而再度出现，以声音宣告季节的转换。",
        en: "The first rumbles of spring thunder begin echoing from distant skies. Having stayed quiet through winter, thunder returns as the atmosphere grows more unstable, announcing the changing season through sound alone."
      },
      food: { ja: ["ひじき", "新じゃが"], zh: ["羊栖菜", "新土豆"], en: ["Hijiki seaweed", "New potatoes"] },
      flower: { ja: "連翹(れんぎょう)", zh: "连翘", en: "Forsythia" }
    },
    {
      id: "kou-13", sekkiId: "seimei", order: 1,
      ja: "玄鳥至", jaReading: "つばめきたる",
      zh: "桐始华", en: "Swallows Arrive",
      desc: {
        ja: "南の国から燕が海を越えて渡ってきて、街中や田舎の軒先に姿を見せ始める頃。すいすいと低く飛び交う姿は、初夏に向けて活気づく季節の使者として親しまれている。",
        zh: "燕子从南方跨海归来，开始出现在城乡屋檐下的时节。低空轻盈穿梭的身影，被人们视为迎向初夏、生机渐盛的季节使者。",
        en: "Swallows arrive from the south, crossing the sea to appear once again under eaves in towns and countryside alike. Their low, swift flight is cherished as a familiar messenger of the season, heralding the lively months leading into early summer."
      },
      food: { ja: ["蚕豆の塩茹で", "初鰹"], zh: ["盐煮蚕豆", "初鲣"], en: ["Salt-boiled fava beans", "First bonito of the season"] },
      flower: { ja: "桐の花", zh: "泡桐花", en: "Paulownia blossom" }
    },
    {
      id: "kou-14", sekkiId: "seimei", order: 2,
      ja: "鴻雁北", jaReading: "こうがんかえる",
      zh: "田鼠化为鴽", en: "Wild Geese Fly North",
      desc: {
        ja: "冬を日本で過ごした雁の群れが、北の繁殖地を目指していっせいに飛び立っていく頃。編隊を組んで空高く去っていく姿に、去りゆく冬を実感する。",
        zh: "在日本越冬的雁群开始成群结队飞往北方繁殖地的时节。列队高飞渐行渐远的身影，令人真切感受到冬天正在远去。",
        en: "Flocks of wild geese that spent the winter in Japan take flight together, heading north toward their breeding grounds. Watching their formations rise high into the sky and disappear northward brings a real sense that winter has finally departed."
      },
      food: { ja: ["新キャベツ", "鰊(にしん)"], zh: ["新甘蓝", "鲱鱼"], en: ["New-season cabbage", "Herring"] },
      flower: { ja: "花水木", zh: "大花四照花", en: "Flowering dogwood" }
    },
    {
      id: "kou-15", sekkiId: "seimei", order: 3,
      ja: "虹始見", jaReading: "にじはじめてあらわる",
      zh: "虹始见", en: "Rainbows Begin to Appear",
      desc: {
        ja: "春の通り雨のあとに、空にくっきりとした虹がかかるようになる頃。冬の間は空気が乾いて見えにくかった虹が、湿った大気とやわらかな光によって現れやすくなる。",
        zh: "春日阵雨过后，天空开始出现清晰彩虹的时节。冬季空气干燥时难得一见的虹，此时因湿润的大气与柔和的光线而更容易显现。",
        en: "After a passing spring shower, rainbows begin arcing clearly across the sky. Rare during winter's dry air, rainbows now appear more readily thanks to the season's moist atmosphere and softer light."
      },
      food: { ja: ["筍ご飯", "鱒(ます)"], zh: ["竹笋饭", "鳟鱼"], en: ["Bamboo shoot rice", "Trout"] },
      flower: { ja: "藤の蕾", zh: "紫藤花苞", en: "Wisteria buds" }
    },
    {
      id: "kou-16", sekkiId: "kokuu", order: 1,
      ja: "葭始生", jaReading: "あしはじめてしょうず",
      zh: "萍始生", en: "Reeds Begin to Sprout",
      desc: {
        ja: "水辺の葭（あし）が水面から若い芽を出し始める頃。まだ短く柔らかいその芽は、やがて夏には人の背丈を超えるほどに大きく育っていく。",
        zh: "水边的芦苇开始从水面探出嫩芽的时节。此时纤细柔嫩的新芽，日后到了夏天将长得比人还高。",
        en: "Reeds along the water's edge begin sending up young shoots from the surface. Still short and tender now, these shoots will eventually grow taller than a person by the height of summer."
      },
      food: { ja: ["蜆(しじみ)", "新玉ねぎのサラダ"], zh: ["蚬贝", "新洋葱沙拉"], en: ["Freshwater clams (shijimi)", "New onion salad"] },
      flower: { ja: "芝桜", zh: "芝樱", en: "Moss phlox" }
    },
    {
      id: "kou-17", sekkiId: "kokuu", order: 2,
      ja: "霜止出苗", jaReading: "しもやんでなえいずる",
      zh: "鸣鸠拂其羽", en: "Frost Ends and Seedlings Emerge",
      desc: {
        ja: "霜の降りる心配がほぼなくなり、苗代で育てていた稲の苗がすくすくと育ち始める頃。農家にとっては田植えに向けた準備が加速する安心の節目でもある。",
        zh: "降霜的忧虑基本消失，秧田中培育的稻苗开始茁壮生长的时节。对农家而言，这也是安心加快插秧准备的重要节点。",
        en: "With the danger of frost essentially gone, rice seedlings growing in the nursery beds start thriving. For farmers, it marks a reassuring milestone as preparations for transplanting into the paddies pick up pace."
      },
      food: { ja: ["新茶", "鰆の煮付け"], zh: ["新茶", "炖马鲛鱼"], en: ["First-flush green tea (shincha)", "Simmered Spanish mackerel"] },
      flower: { ja: "牡丹", zh: "牡丹", en: "Peony" }
    },
    {
      id: "kou-18", sekkiId: "kokuu", order: 3,
      ja: "牡丹華", jaReading: "ぼたんはなさく",
      zh: "戴胜降于桑", en: "Peonies Bloom",
      desc: {
        ja: "「花の王」とも呼ばれる牡丹が、大輪の花を豪華に咲かせ始める頃。幾重にも重なる花びらが風に揺れる様子は、晩春を彩る華やかな見どころとなる。",
        zh: "被誉为「花王」的牡丹开始绽放硕大华丽花朵的时节。层层叠叠的花瓣随风摇曳，成为晚春时节最为绚烂夺目的景致。",
        en: "The peony, often called the king of flowers, begins blooming in full, opulent splendor. Its many-layered petals swaying in the breeze make it one of the most spectacular sights of late spring."
      },
      food: { ja: ["空豆ご飯", "初鰹のたたき"], zh: ["蚕豆饭", "初鲣鱼半烧"], en: ["Fava bean rice", "Seared first bonito (tataki)"] },
      flower: { ja: "牡丹満開", zh: "牡丹盛放", en: "Peony in full bloom" }
    },
    {
      id: "kou-19", sekkiId: "rikka", order: 1,
      ja: "蛙始鳴", jaReading: "かわずはじめてなく",
      zh: "蝼蝈鸣", en: "Frogs Begin to Call",
      desc: {
        ja: "水を張ったばかりの田んぼから、蛙のケロケロという鳴き声が響き始める頃。夕暮れ時になるとその声はいっそう賑やかになり、初夏らしい夜の合唱が始まる。",
        zh: "刚刚灌满水的稻田里，开始传出蛙鸣阵阵的时节。到了黄昏时分，蛙声愈发热闹，初夏特有的夜间大合唱由此拉开序幕。",
        en: "From newly flooded rice paddies, the croaking calls of frogs begin echoing across the fields. As dusk falls, the chorus grows livelier still, marking the start of early summer's nightly serenade."
      },
      food: { ja: ["空豆", "初鰹"], zh: ["蚕豆", "初鲣"], en: ["Fava beans", "First bonito"] },
      flower: { ja: "花菖蒲", zh: "花菖蒲", en: "Japanese iris" }
    },
    {
      id: "kou-20", sekkiId: "rikka", order: 2,
      ja: "蚯蚓出", jaReading: "みみずいずる",
      zh: "蚯蚓出", en: "Earthworms Emerge",
      desc: {
        ja: "地中で静かに過ごしていたミミズが、暖かくなった土の表面近くに姿を見せ始める頃。庭仕事や畑仕事の合間に、土のやわらかさとともにその存在を感じることが増える。",
        zh: "在土中静静蛰伏的蚯蚓，开始在渐暖的土壤表层附近现身的时节。整理庭院或耕作田地时，人们也更容易感受到松软泥土中它们的存在。",
        en: "Earthworms that lay quietly underground begin appearing near the surface as the soil warms. While tending a garden or field, one increasingly notices their presence alongside the newly softened earth."
      },
      food: { ja: ["筍", "新茶"], zh: ["竹笋", "新茶"], en: ["Bamboo shoots", "First-flush tea"] },
      flower: { ja: "芍薬", zh: "芍药", en: "Peony rose (shakuyaku)" }
    },
    {
      id: "kou-21", sekkiId: "rikka", order: 3,
      ja: "竹笋生", jaReading: "たけのこしょうず",
      zh: "王瓜生", en: "Bamboo Shoots Sprout",
      desc: {
        ja: "淡竹（はちく）などの竹の子が、地面をわずかに持ち上げながら次々と顔を出し始める頃。朝のうちに掘り出さないとあっという間に育ってしまうほどの勢いを見せる。",
        zh: "淡竹等竹笋顶开地面、接连破土而出的时节。若不趁清晨及时挖出，转眼间便会迅速抽长，展现出旺盛的生长势头。",
        en: "Bamboo shoots, including varieties like hachiku, begin pushing up through the soil one after another, lifting the ground slightly as they rise. If not dug up in the early morning, they can grow noticeably taller within just a single day."
      },
      food: { ja: ["筍の若竹煮", "空豆"], zh: ["嫩竹笋煮鲜", "蚕豆"], en: ["Bamboo shoot and wakame simmer", "Fava beans"] },
      flower: { ja: "卯の花", zh: "溲疏花", en: "Deutzia blossom (u-no-hana)" }
    },
    {
      id: "kou-22", sekkiId: "shouman", order: 1,
      ja: "蚕起食桑", jaReading: "かいこおきてくわをはむ",
      zh: "苦菜秀", en: "Silkworms Awake and Feast on Mulberry",
      desc: {
        ja: "孵化したばかりの蚕が、桑の葉を勢いよく食べ始める頃。かつて養蚕が盛んだった地域では、この時期の桑畑の賑わいが初夏の風物詩とされていた。",
        zh: "刚孵化的蚕开始大口啃食桑叶的时节。在昔日养蚕业兴盛的地区，此时桑田里的热闹景象曾是初夏时节别具特色的风物。",
        en: "Newly hatched silkworms begin voraciously feeding on mulberry leaves. In regions where sericulture once thrived, the bustle of mulberry fields at this time of year was considered a defining scene of early summer."
      },
      food: { ja: ["さくらんぼ", "空豆"], zh: ["樱桃", "蚕豆"], en: ["Cherries", "Fava beans"] },
      flower: { ja: "紫陽花の蕾", zh: "绣球花苞", en: "Hydrangea buds" }
    },
    {
      id: "kou-23", sekkiId: "shouman", order: 2,
      ja: "紅花栄", jaReading: "べにばなさかう",
      zh: "靡草死", en: "Safflowers Bloom in Abundance",
      desc: {
        ja: "紅花が畑一面に鮮やかな黄色からオレンジ色へと咲き誇る頃。かつては染料や紅の原料として大切に栽培され、山形などの産地では今も夏を彩る花として親しまれている。",
        zh: "红花在田野间由鲜黄渐染成橙红、盛放满地的时节。此花过去曾作为染料与胭脂原料而受到珍视栽培，在山形等产地至今仍是点缀夏日的重要花卉。",
        en: "Safflowers bloom in profusion across the fields, their color deepening from bright yellow to orange. Once carefully cultivated as a source of dye and rouge pigment, safflowers are still cherished today in growing regions like Yamagata as a defining flower of the season."
      },
      food: { ja: ["そら豆ご飯", "鰹の刺身"], zh: ["蚕豆饭", "鲣鱼刺身"], en: ["Fava bean rice", "Bonito sashimi"] },
      flower: { ja: "紅花", zh: "红花", en: "Safflower" }
    },
    {
      id: "kou-24", sekkiId: "shouman", order: 3,
      ja: "麦秋至", jaReading: "むぎのときいたる",
      zh: "麦秋至", en: "Wheat Ripens to Harvest",
      desc: {
        ja: "秋にまいた麦が黄金色に色づき、収穫を迎える頃。「麦秋」とは夏なのに秋の字を使う独特な言葉で、麦にとっての実りの秋という意味が込められている。",
        zh: "秋播的麦子转为金黄、迎来收获的时节。「麦秋」一词虽在夏季却用「秋」字，寓意此时正是麦子迎来丰收的「秋天」。",
        en: "Wheat sown the previous autumn turns golden and reaches harvest time. The Japanese term bakushu (literally wheat autumn) curiously uses the character for autumn even though it falls in summer, capturing the idea that this is wheat's own harvest season."
      },
      food: { ja: ["新麦の麦茶", "枇杷"], zh: ["新麦大麦茶", "枇杷"], en: ["Fresh-roasted barley tea (mugicha)", "Loquats"] },
      flower: { ja: "枇杷の実", zh: "枇杷果", en: "Ripening loquat fruit" }
    },
    {
      id: "kou-25", sekkiId: "boushu", order: 1,
      ja: "蟷螂生", jaReading: "かまきりしょうず",
      zh: "螳螂生", en: "Praying Mantises Hatch",
      desc: {
        ja: "秋に産みつけられた卵鞘から、無数の小さなカマキリの幼虫がいっせいに這い出してくる頃。生まれたばかりの姿は小さく愛らしいが、すでに一人前の狩人としての気配を漂わせている。",
        zh: "秋天产下的卵鞘中，无数细小的螳螂幼虫同时爬出的时节。刚出生的样子娇小可爱，却已隐隐透出天生猎手的气势。",
        en: "From egg cases laid the previous autumn, countless tiny mantis nymphs emerge all at once. Newly hatched, they look small and almost endearing, yet already carry the unmistakable poise of a natural-born hunter."
      },
      food: { ja: ["梅の実", "新生姜"], zh: ["青梅", "新生姜"], en: ["Fresh plums (ume)", "New ginger"] },
      flower: { ja: "紫陽花", zh: "绣球花", en: "Hydrangea" }
    },
    {
      id: "kou-26", sekkiId: "boushu", order: 2,
      ja: "腐草為螢", jaReading: "くされたるくさほたるとなる",
      zh: "鵙始鸣", en: "Rotting Grass Becomes Fireflies",
      desc: {
        ja: "古くは、湿った草むらの腐った草が蛍に変わると信じられていたことに由来する候。実際には水辺で育った蛍の幼虫が羽化し、夕闇の中に淡い光を放ちながら舞い始める頃である。",
        zh: "此候源自古人相信湿地腐草会化为萤火虫的传说。实际上是生长于水边的萤火虫幼虫此时羽化，在夜幕中泛着微光翩翩飞舞的时节。",
        en: "This name reflects an old belief that decaying grass in damp thickets transformed into fireflies. In reality, firefly larvae that grew up near the water complete their metamorphosis now, rising into the evening dusk to glow softly as they fly."
      },
      food: { ja: ["鮎の塩焼き", "新生姜"], zh: ["盐烤香鱼", "新生姜"], en: ["Salt-grilled sweetfish (ayu)", "New ginger"] },
      flower: { ja: "半夏生の葉", zh: "半夏生叶", en: "Half-summer plant leaves" }
    },
    {
      id: "kou-27", sekkiId: "boushu", order: 3,
      ja: "梅子黄", jaReading: "うめのみきばむ",
      zh: "反舌无声", en: "Plums Ripen to Yellow",
      desc: {
        ja: "青々としていた梅の実が、次第に黄色みを帯びて熟していく頃。梅仕事の季節の到来を告げ、各家庭で梅干しや梅酒の仕込みが始まる時期でもある。",
        zh: "青翠的梅子渐渐染上黄色、趋于成熟的时节。这也宣告了「梅事」季节的到来，各家各户开始着手腌制梅干、酿造梅酒。",
        en: "Plums that had been a deep green gradually take on a yellow tinge as they ripen. This signals the arrival of ume work season, when households traditionally begin preparing pickled plums (umeboshi) and plum wine (umeshu)."
      },
      food: { ja: ["梅干し仕込み", "鱧(はも)"], zh: ["腌梅干", "海鳗"], en: ["Umeboshi preparation", "Pike conger (hamo)"] },
      flower: { ja: "梔子(くちなし)", zh: "栀子花", en: "Gardenia" }
    },
    {
      id: "kou-28", sekkiId: "geshi", order: 1,
      ja: "乃東枯", jaReading: "なつかれくさかるる",
      zh: "鹿角解", en: "Self-Heal Withers",
      desc: {
        ja: "冬の間から芽を出していたウツボグサ（夏枯草）の花穂が、夏至の頃になると黒ずんで枯れ始める頃。他の草木が盛んに茂る中、ひと足先に枯れていくその姿は独特の存在感を放つ。",
        zh: "自冬季便已发芽的夏枯草花穗，到了夏至前后开始变黑枯萎的时节。在其他草木繁茂生长之际，唯独它率先枯萎，显出一种独特的存在感。",
        en: "The flower spikes of self-heal (utsubogusa), which had sprouted back in winter, begin turning dark and withering around the solstice. Amid all the other lush greenery, its early decline gives it a distinctly poignant presence."
      },
      food: { ja: ["蛸", "新生姜"], zh: ["章鱼", "新生姜"], en: ["Octopus", "New ginger"] },
      flower: { ja: "半夏生", zh: "半夏生", en: "Lizard's tail (hange-sho)" }
    },
    {
      id: "kou-29", sekkiId: "geshi", order: 2,
      ja: "菖蒲華", jaReading: "あやめはなさく",
      zh: "蜩始鸣", en: "Irises Bloom",
      desc: {
        ja: "あやめが紫や白の凛とした花を咲かせる頃。「いずれ菖蒲か杜若」という言葉が示すように、よく似た花菖蒲や杜若とともに、梅雨時の庭園や水辺を美しく彩る。",
        zh: "溪荪绽放出紫色或白色端庄花朵的时节。正如「孰为菖蒲孰为杜若」这句古语所示，此花常与相似的花菖蒲、杜若一同，为梅雨时节的庭园与水畔增添美丽色彩。",
        en: "Irises (ayame) bloom in stately shades of purple and white. As the old saying which is iris, which is rabdosia suggests, they are often mistaken for the closely related hanashobu and kakitsubata, together beautifully coloring gardens and waterside spots throughout the rainy season."
      },
      food: { ja: ["冷やし素麺", "鮎"], zh: ["凉拌素面", "香鱼"], en: ["Chilled somen noodles", "Sweetfish (ayu)"] },
      flower: { ja: "花菖蒲満開", zh: "花菖蒲盛开", en: "Japanese iris in full bloom" }
    },
    {
      id: "kou-30", sekkiId: "geshi", order: 3,
      ja: "半夏生", jaReading: "はんげしょうず",
      zh: "半夏生", en: "Crow-Dipper Sprouts",
      desc: {
        ja: "カラスビシャクという小さな薬草が地面から顔を出し始める頃。この日までに田植えを終えるのが良いとされてきた、農家にとって一つの節目となる日でもある。",
        zh: "半夏（乌柄勺）这一小型药草开始从地面探出的时节。自古以来农家便讲究在此日之前完成插秧，是农事上一个重要的节点标志。",
        en: "A small medicinal plant called karasu-bishaku (crow-dipper) begins poking up from the ground. Traditionally, farmers aimed to finish transplanting rice by this day, making it an important seasonal checkpoint in the agricultural calendar."
      },
      food: { ja: ["蛸飯", "たこ焼き"], zh: ["章鱼饭", "章鱼烧"], en: ["Octopus rice", "Takoyaki"] },
      flower: { ja: "半夏生の白い葉", zh: "半夏生白叶", en: "Half-summer plant's whitened leaves" }
    },
    {
      id: "kou-31", sekkiId: "shousho", order: 1,
      ja: "温風至", jaReading: "あつかぜいたる",
      zh: "温风至", en: "Warm Winds Begin to Blow",
      desc: {
        ja: "梅雨明けを思わせる、湿り気を帯びた生ぬるい風が吹き始める頃。まだ本格的な猛暑ではないが、風そのものにはっきりと夏の気配が混じるようになる。",
        zh: "带着湿气与暖意的风开始吹起、令人联想到梅雨将尽的时节。虽尚未进入真正的酷暑，但风中已明显掺入了夏天的气息。",
        en: "A warm, humid wind begins to blow, hinting that the rainy season is drawing to a close. Full-blown midsummer heat has not yet arrived, but the wind itself now unmistakably carries the feel of summer."
      },
      food: { ja: ["鰻のひつまぶし", "冷や汁"], zh: ["鳗鱼饭", "冷汤泡饭"], en: ["Grilled eel over rice (hitsumabushi)", "Chilled miso soup (hiyajiru)"] },
      flower: { ja: "蓮のつぼみ", zh: "荷花蓓蕾", en: "Lotus buds" }
    },
    {
      id: "kou-32", sekkiId: "shousho", order: 2,
      ja: "蓮始開", jaReading: "はすはじめてひらく",
      zh: "蟋蟀居壁", en: "Lotus Flowers Begin to Open",
      desc: {
        ja: "池や水田に咲く蓮の花が、早朝にふわりと花びらを開き始める頃。日が高くなるとつぼむその一日花の性質から、朝のうちに見に行く人が多い。",
        zh: "池塘或水田中的荷花，于清晨轻柔绽放花瓣的时节。由于日头升高后便会闭合的「一日花」特性，许多人特意选择清晨前往观赏。",
        en: "Lotus flowers blooming in ponds and paddies begin gently unfurling their petals in the early morning. Since each bloom lasts only a single day and closes again once the sun climbs higher, many people make a point of viewing them at dawn."
      },
      food: { ja: ["蓮根の煮物", "土用の丑の鰻"], zh: ["莲藕煮物", "土用丑日鳗鱼"], en: ["Simmered lotus root", "Eel for the midsummer ox day (doyo)"] },
      flower: { ja: "蓮", zh: "荷花", en: "Lotus" }
    },
    {
      id: "kou-33", sekkiId: "shousho", order: 3,
      ja: "鷹乃学習", jaReading: "たかすなわちわざをならう",
      zh: "鹰始击", en: "Young Hawks Learn to Hunt",
      desc: {
        ja: "巣立ったばかりの鷹の幼鳥が、親鳥のそばで飛び方や獲物を捕らえる技術を懸命に学び始める頃。何度も失敗を重ねながら、少しずつ一人前の姿に近づいていく。",
        zh: "刚离巢不久的幼鹰，开始在亲鸟身旁拼命学习飞行与捕猎技巧的时节。历经反复的失败，一点点靠近独当一面的猎手模样。",
        en: "Young hawks that have only just left the nest begin earnestly learning how to fly and hunt alongside their parents. Through repeated failures, they gradually inch closer to becoming capable hunters in their own right."
      },
      food: { ja: ["冷やしトマト", "枝豆"], zh: ["冷番茄", "毛豆"], en: ["Chilled tomatoes", "Edamame"] },
      flower: { ja: "向日葵の蕾", zh: "向日葵花苞", en: "Sunflower buds" }
    },
    {
      id: "kou-34", sekkiId: "taisho", order: 1,
      ja: "桐始結花", jaReading: "きりはじめてはなをむすぶ",
      zh: "腐草为萤", en: "Paulownia Trees Set Their Seed Pods",
      desc: {
        ja: "初夏に紫の花を咲かせた桐の木に、卵形の実がふっくらと結ばれ始める頃。花の記憶がまだ新しいうちに、次の世代への準備が静かに進んでいく。",
        zh: "初夏时曾开出紫花的泡桐树，此时开始结出饱满卵形果实的时节。花开的记忆尚新，孕育下一代的准备已悄然展开。",
        en: "The paulownia tree, which bloomed with purple flowers back in early summer, now begins forming plump, egg-shaped seed pods. Even while the memory of its blossoms is still fresh, preparations for the next generation quietly proceed."
      },
      food: { ja: ["鰻の蒲焼き", "西瓜"], zh: ["蒲烧鳗鱼", "西瓜"], en: ["Grilled eel (kabayaki)", "Watermelon"] },
      flower: { ja: "百日紅(さるすべり)", zh: "紫薇", en: "Crape myrtle" }
    },
    {
      id: "kou-35", sekkiId: "taisho", order: 2,
      ja: "土潤溽暑", jaReading: "つちうるおうてむしあつし",
      zh: "土润溽暑", en: "The Earth is Damp and the Air Sultry",
      desc: {
        ja: "地面に湿気がこもり、まとわりつくような蒸し暑さが続く頃。風が吹いてもどこか湿っぽく、汗ばむような重たい空気が街にも田畑にも立ちこめる。",
        zh: "地表湿气凝滞，闷热黏腻的暑气持续不散的时节。即便有风吹拂，空气中依旧带着潮意，令人汗湿的沉重感笼罩城乡各处。",
        en: "Moisture lingers heavy in the ground, and a clinging, sultry humidity persists day after day. Even when the wind blows, the air still feels damp, and a heavy, sweat-inducing atmosphere settles over towns and fields alike."
      },
      food: { ja: ["冷やし中華", "枝豆"], zh: ["凉拌中华面", "毛豆"], en: ["Chilled Chinese-style noodles (hiyashi chuka)", "Edamame"] },
      flower: { ja: "木槿(むくげ)", zh: "木槿", en: "Rose of Sharon" }
    },
    {
      id: "kou-36", sekkiId: "taisho", order: 3,
      ja: "大雨時行", jaReading: "たいうときどきにふる",
      zh: "大雨时行", en: "Heavy Rains Fall from Time to Time",
      desc: {
        ja: "強い日差しのあとに、突然の夕立や激しいにわか雨が降ることが増える頃。青空から一転、黒い雲が広がり雷とともに大粒の雨が地面をたたく。",
        zh: "在强烈日照之后，午后雷阵雨或骤然而至的暴雨愈发频繁的时节。晴空乍变，乌云骤起，伴随雷声，豆大的雨点猛烈击打大地。",
        en: "After spells of intense sunshine, sudden evening downpours and fierce cloudbursts become more frequent. A clear sky can turn dark within minutes as thunder rolls and heavy raindrops hammer the ground."
      },
      food: { ja: ["冷奴", "素麺"], zh: ["冷豆腐", "素面"], en: ["Chilled tofu (hiyayakko)", "Somen noodles"] },
      flower: { ja: "朝顔", zh: "牵牛花", en: "Morning glory" }
    },
    {
      id: "kou-37", sekkiId: "risshuu", order: 1,
      ja: "涼風至", jaReading: "すずかぜいたる",
      zh: "凉风至", en: "Cool Winds Begin to Arrive",
      desc: {
        ja: "厳しい暑さの中にも、ふとした瞬間にひんやりとした風が混じり始める頃。日中はまだ酷暑でも、朝夕の空気にわずかな変化を感じ取れるようになる。",
        zh: "在酷暑之中，忽然掺入丝丝凉意的风开始出现的时节。白天虽仍暑气逼人，但早晚的空气中已能察觉到些许微妙的变化。",
        en: "Even amid fierce heat, a fleeting hint of cool breeze begins to mix into the air. Daytime remains scorching, but mornings and evenings start to carry a subtle, noticeable shift."
      },
      food: { ja: ["冷やし茶漬け", "枝豆"], zh: ["冷茶泡饭", "毛豆"], en: ["Chilled ochazuke", "Edamame"] },
      flower: { ja: "桔梗", zh: "桔梗花", en: "Balloon flower" }
    },
    {
      id: "kou-38", sekkiId: "risshuu", order: 2,
      ja: "寒蝉鳴", jaReading: "ひぐらしなく",
      zh: "白露降", en: "Evening Cicadas Sing",
      desc: {
        ja: "カナカナと澄んだ声で鳴くヒグラシが、夕暮れどきの林に響き始める頃。にぎやかな夏の蝉とは違う、どこか物悲しさを帯びたその声は、秋への入り口を告げている。",
        zh: "以清脆「卡纳卡纳」之声鸣叫的暮蝉，开始在黄昏林间回响的时节。与盛夏喧闹的蝉鸣不同，那略带哀愁的声音正预告着秋天的入口已近。",
        en: "The higurashi cicada, with its clear, plaintive kana-kana call, begins echoing through the woods at dusk. Quite unlike the boisterous cicadas of high summer, its slightly wistful song signals that autumn's doorway is drawing near."
      },
      food: { ja: ["梨", "冷やし茄子"], zh: ["梨", "冷茄子"], en: ["Pears", "Chilled eggplant"] },
      flower: { ja: "女郎花(おみなえし)", zh: "败酱草", en: "Golden lace (ominaeshi)" }
    },
    {
      id: "kou-39", sekkiId: "risshuu", order: 3,
      ja: "蒙霧升降", jaReading: "ふかききりまとう",
      zh: "寒蝉鸣", en: "Thick Mist Rises and Falls",
      desc: {
        ja: "早朝、田畑や谷あいに深い霧がたちこめ、あたり一面を白く包み込む頃。日が昇るにつれて霧が晴れていく様子は、朝夕の気温差が広がり始めた証でもある。",
        zh: "清晨，田野与山谷间弥漫起浓雾、将四周笼罩成一片雪白的时节。随着日出雾气渐渐消散，也印证着早晚温差正在逐渐拉大。",
        en: "In the early morning, thick mist settles over fields and valleys, wrapping the surrounding landscape in white. As the sun rises and the mist gradually clears, it signals that the gap between morning and evening temperatures has begun to widen."
      },
      food: { ja: ["無花果(いちじく)", "冷やし饂飩"], zh: ["无花果", "冷乌冬面"], en: ["Figs", "Chilled udon noodles"] },
      flower: { ja: "芙蓉", zh: "芙蓉花", en: "Cotton rose (fuyo)" }
    },
    {
      id: "kou-40", sekkiId: "shosho", order: 1,
      ja: "綿柎開", jaReading: "わたのはなしべひらく",
      zh: "鹰乃祭鸟", en: "Cotton Bolls Begin to Open",
      desc: {
        ja: "綿の実を包んでいたがく（柎）が開き、中からふわふわとした白い綿毛が顔をのぞかせ始める頃。かつて綿花栽培が盛んだった地域では、収穫の目安とされてきた。",
        zh: "包裹棉铃的萼片开裂，白色蓬松的棉絮从中探出的时节。在昔日棉花种植兴盛的地区，这也是判断采收时机的重要标志。",
        en: "The calyx enclosing the cotton boll splits open, revealing soft, fluffy white fibers within. In regions where cotton cultivation once flourished, this served as a practical signal that harvest time was near."
      },
      food: { ja: ["葡萄", "冷やし饂飩"], zh: ["葡萄", "冷乌冬"], en: ["Grapes", "Chilled udon noodles"] },
      flower: { ja: "萩(はぎ)", zh: "胡枝子", en: "Bush clover (hagi)" }
    },
    {
      id: "kou-41", sekkiId: "shosho", order: 2,
      ja: "天地始粛", jaReading: "てんちはじめてさむし",
      zh: "天地始肃", en: "Heaven and Earth Begin to Turn Cool",
      desc: {
        ja: "天も地も、ようやく厳しさを収め始めるという意味の候。日差しの角度がわずかに変わり、朝晩の空気にきりっとした涼しさが感じられるようになる。",
        zh: "天地间的暑气终于开始收敛的时节。日照的角度悄然发生变化，早晚的空气中也开始透出清爽的凉意。",
        en: "Both sky and earth finally begin to ease their harsh summer intensity. The angle of sunlight shifts subtly, and mornings and evenings start to carry a crisp, noticeable coolness."
      },
      food: { ja: ["里芋", "秋刀魚"], zh: ["芋头", "秋刀鱼"], en: ["Taro", "Pacific saury (sanma)"] },
      flower: { ja: "彼岸花の蕾", zh: "彼岸花花苞", en: "Red spider lily buds" }
    },
    {
      id: "kou-42", sekkiId: "shosho", order: 3,
      ja: "禾乃登", jaReading: "こくものすなわちみのる",
      zh: "禾乃登", en: "Rice and Grains Ripen",
      desc: {
        ja: "稲や粟などの穀物が黄金色に色づき、いよいよ実りの時を迎える頃。頭を垂れた稲穂が風にそよぐ田園風景は、この季節ならではの豊かな趣を見せる。",
        zh: "稻米、粟等谷物转为金黄、终于迎来结实之时的时节。垂首的稻穗随风摇曳的田园景色，展现出这个季节特有的丰饶意趣。",
        en: "Rice, millet, and other grains turn a rich golden color as harvest time finally approaches. The sight of heavy, bowed ears of rice swaying in the wind across the paddies captures the season's distinctive sense of abundance."
      },
      food: { ja: ["新米", "秋茄子"], zh: ["新米", "秋茄子"], en: ["New-harvest rice", "Autumn eggplant"] },
      flower: { ja: "彼岸花", zh: "彼岸花", en: "Red spider lily" }
    },
    {
      id: "kou-43", sekkiId: "hakuro", order: 1,
      ja: "草露白", jaReading: "くさのつゆしろし",
      zh: "鸿雁来", en: "Dew on the Grass Turns White",
      desc: {
        ja: "草の葉先にたまった露が、朝の光を受けて白く輝いて見え始める頃。夜のうちに気温が下がり、空気中の水蒸気が冷やされて露となって結ぶ。",
        zh: "凝聚在草叶尖端的露珠，在晨光映照下开始泛白闪光的时节。夜间气温下降，空气中的水汽遇冷凝结成露。",
        en: "Dew gathering at the tips of grass blades begins appearing white in the morning light. As temperatures drop overnight, the moisture in the air cools and condenses into these gleaming droplets."
      },
      food: { ja: ["梨", "秋刀魚の塩焼き"], zh: ["梨", "盐烤秋刀鱼"], en: ["Pears", "Salt-grilled saury"] },
      flower: { ja: "萩の花", zh: "胡枝子花", en: "Bush clover blossom" }
    },
    {
      id: "kou-44", sekkiId: "hakuro", order: 2,
      ja: "鶺鴒鳴", jaReading: "せきれいなく",
      zh: "玄鸟归", en: "Wagtails Sing",
      desc: {
        ja: "川原や水辺で、尾を上下に振りながら歩くセキレイの鳴き声が響き始める頃。ちちちと軽やかに鳴くその声は、澄んだ秋の空気によく通る。",
        zh: "在河滩水边一边摇尾一边行走的鶺鴒鸟，开始发出鸣叫的时节。那清脆的「啾啾」声，在澄澈的秋日空气中格外悠远动听。",
        en: "Wagtails, seen bobbing their tails as they walk along riverbanks and shorelines, begin calling out. Their light, chirping notes carry unusually clearly through the crisp autumn air."
      },
      food: { ja: ["さつまいも", "栗ご飯"], zh: ["番薯", "栗子饭"], en: ["Sweet potatoes", "Chestnut rice"] },
      flower: { ja: "葛の花", zh: "葛花", en: "Kudzu blossom" }
    },
    {
      id: "kou-45", sekkiId: "hakuro", order: 3,
      ja: "玄鳥去", jaReading: "つばめさる",
      zh: "群鸟养羞", en: "Swallows Depart",
      desc: {
        ja: "春から夏にかけて日本で過ごした燕が、南の国へ向けていっせいに飛び立っていく頃。空っぽになった巣を見上げると、去っていった夏の名残がふと寂しく感じられる。",
        zh: "自春夏以来在日本停留的燕子，此时开始成群结队飞往南方的时节。仰望空荡荡的燕巢，那份属于夏天的余韵不禁令人感到些许寂寥。",
        en: "Swallows that spent spring and summer in Japan take flight together, heading south once more. Looking up at their now-empty nests, one feels a quiet touch of loneliness for the summer that has just slipped away."
      },
      food: { ja: ["柿", "秋刀魚"], zh: ["柿子", "秋刀鱼"], en: ["Persimmons", "Pacific saury"] },
      flower: { ja: "金木犀の蕾", zh: "金桂花苞", en: "Fragrant olive buds" }
    },
    {
      id: "kou-46", sekkiId: "shuubun", order: 1,
      ja: "雷乃収声", jaReading: "かみなりすなわちこえをおさむ",
      zh: "雷始收声", en: "Thunder Falls Silent",
      desc: {
        ja: "春から夏にかけて頻繁に鳴っていた雷が、次第にその声をひそめていく頃。大気が安定し、突然の夕立や雷鳴も少しずつ影をひそめていく。",
        zh: "自春至夏频繁作响的雷声，此时逐渐归于沉寂的时节。大气趋于稳定，骤然而至的雷阵雨也一天天变得少见。",
        en: "Thunder, which rumbled frequently through spring and summer, gradually quiets down. As the atmosphere stabilizes, sudden downpours and claps of thunder become noticeably rarer."
      },
      food: { ja: ["栗", "松茸"], zh: ["栗子", "松茸"], en: ["Chestnuts", "Matsutake mushrooms"] },
      flower: { ja: "曼珠沙華", zh: "曼珠沙华", en: "Red spider lily (higanbana)" }
    },
    {
      id: "kou-47", sekkiId: "shuubun", order: 2,
      ja: "蟄虫坏戸", jaReading: "むしかくれてとをふさぐ",
      zh: "蛰虫坯户", en: "Insects Seal Their Burrow Doors",
      desc: {
        ja: "虫たちが冬ごもりに備え、土中の巣穴の入り口を塞ぎ始める頃。啓蟄で開いた戸を、今度は自ら閉じていく対照的な営みが季節の一巡を感じさせる。",
        zh: "虫豸为准备冬眠，开始封闭土中巢穴入口的时节。与惊蛰时打开的「门户」恰成对照，如今又亲手将其封闭，令人感受到季节循环一周的意味。",
        en: "Insects begin sealing the entrances to their underground burrows in preparation for hibernation. In a fitting counterpoint to Keichitsu, when they opened those very doors in spring, they now close them again -- a quiet reminder that the seasonal cycle has come full circle."
      },
      food: { ja: ["さつまいもご飯", "梨"], zh: ["番薯饭", "梨"], en: ["Sweet potato rice", "Pears"] },
      flower: { ja: "竜胆(りんどう)", zh: "龙胆花", en: "Gentian" }
    },
    {
      id: "kou-48", sekkiId: "shuubun", order: 3,
      ja: "水始涸", jaReading: "みずはじめてかるる",
      zh: "水始涸", en: "Water Begins to Dry from the Fields",
      desc: {
        ja: "稲刈りに向けて、田んぼに張られていた水を抜き始める頃。水が引いた田んぼには黄金色の稲穂が広がり、収穫の秋本番を迎える準備が整っていく。",
        zh: "为迎接稻收，稻田中蓄积的水开始被排干的时节。水退之后的田野铺展开一片金黄稻穗，收获的秋天正式来临的准备就此就绪。",
        en: "In preparation for the rice harvest, water that had been flooding the paddies begins to be drained away. Once the water recedes, fields of golden rice ears stretch out across the land, fully ready for autumn's main harvest to begin."
      },
      food: { ja: ["新米の握り飯", "柿"], zh: ["新米饭团", "柿子"], en: ["Rice balls made with new harvest rice", "Persimmons"] },
      flower: { ja: "金木犀", zh: "金桂", en: "Fragrant olive (kinmokusei)" }
    },
    {
      id: "kou-49", sekkiId: "kanro", order: 1,
      ja: "鴻雁来", jaReading: "こうがんきたる",
      zh: "鸿雁来宾", en: "Wild Geese Arrive",
      desc: {
        ja: "北方から渡ってきた雁の群れが、日本各地の湖沼や田んぼに姿を見せ始める頃。春に飛び去った雁とは入れ替わりに、冬を日本で過ごす渡り鳥たちの季節が始まる。",
        zh: "自北方飞来的雁群，开始出现在日本各地湖沼与稻田间的时节。与春天离去的雁群交替，候鸟们即将在日本度过整个冬天的季节由此开始。",
        en: "Flocks of geese that have migrated from the north begin appearing on lakes, marshes, and rice paddies across Japan. Taking the place of the geese that departed in spring, this marks the start of the season when migratory birds settle in to spend winter here."
      },
      food: { ja: ["柿", "栗ご飯"], zh: ["柿子", "栗子饭"], en: ["Persimmons", "Chestnut rice"] },
      flower: { ja: "菊", zh: "菊花", en: "Chrysanthemum" }
    },
    {
      id: "kou-50", sekkiId: "kanro", order: 2,
      ja: "菊花開", jaReading: "きくのはなひらく",
      zh: "雀入大水为蛤", en: "Chrysanthemums Bloom",
      desc: {
        ja: "各地で菊の花が見頃を迎え、菊人形や菊まつりなどの行事が催される頃。清らかな香りと整った花の姿は、古くから長寿を象徴する花として愛でられてきた。",
        zh: "各地菊花迎来最佳观赏期，菊人形展与菊花节等活动纷纷举办的时节。菊花清雅的芬芳与端整的花姿，自古便作为象征长寿的花卉受到人们喜爱。",
        en: "Chrysanthemums reach peak bloom across the country, and events like chrysanthemum doll displays and flower festivals are held in many towns. Prized since ancient times for its refined fragrance and elegant form, the chrysanthemum has long been cherished as a symbol of longevity."
      },
      food: { ja: ["食用菊のおひたし", "秋鮭"], zh: ["凉拌食用菊", "秋鲑"], en: ["Blanched edible chrysanthemum", "Autumn salmon"] },
      flower: { ja: "菊満開", zh: "菊花盛放", en: "Chrysanthemum in full bloom" }
    },
    {
      id: "kou-51", sekkiId: "kanro", order: 3,
      ja: "蟋蟀在戸", jaReading: "きりぎりすとにあり",
      zh: "菊有黄华", en: "Crickets Chirp Near the Doorway",
      desc: {
        ja: "コオロギなどの秋の虫が、家の戸口近くまで来て鳴き始める頃。夜が更けるにつれて虫の声が幾重にも重なり合い、静けさの中に豊かな秋の音色が満ちていく。",
        zh: "蟋蟀等秋虫开始在家门附近鸣叫的时节。随着夜色渐深，虫鸣层层交织，在寂静之中充盈着秋天丰富的音色。",
        en: "Crickets and other autumn insects draw close to doorways and begin chirping. As the night deepens, their calls layer over one another, filling the quiet air with the rich, textured sound of autumn."
      },
      food: { ja: ["里芋の煮っころがし", "秋刀魚"], zh: ["煮芋头", "秋刀鱼"], en: ["Simmered taro", "Pacific saury"] },
      flower: { ja: "秋桜(コスモス)", zh: "秋樱(波斯菊)", en: "Cosmos" }
    },
    {
      id: "kou-52", sekkiId: "soukou", order: 1,
      ja: "霜始降", jaReading: "しもはじめてふる",
      zh: "豺乃祭兽", en: "Frost Begins to Fall",
      desc: {
        ja: "その年はじめての霜が、朝の畑や屋根にうっすらと降りる頃。真っ白に色づいた景色は美しい反面、農作物にとっては注意が必要な季節の変わり目でもある。",
        zh: "当年首次的霜降，薄薄地覆盖在清晨田野与屋顶上的时节。虽白茫茫的景致美不胜收，但对农作物而言，这也是需要格外留意的季节转折点。",
        en: "The year's first frost lightly settles over morning fields and rooftops. As beautiful as the frosted white landscape is, this transitional moment also calls for extra care to protect crops from the cold."
      },
      food: { ja: ["柚子", "大根"], zh: ["柚子", "萝卜"], en: ["Yuzu citrus", "Daikon radish"] },
      flower: { ja: "山茶花(さざんか)", zh: "山茶花", en: "Sasanqua camellia" }
    },
    {
      id: "kou-53", sekkiId: "soukou", order: 2,
      ja: "霎時施", jaReading: "こさめときどきふる",
      zh: "草木黄落", en: "Light Showers Fall from Time to Time",
      desc: {
        ja: "パラパラと降ってはすぐにやむ、通り雨のような小雨が繰り返される頃。傘を差すかどうか迷うほどのはかない雨が、晩秋らしいしっとりとした風情を添える。",
        zh: "淅淅沥沥、下过便停的阵雨反复出现的时节。这种令人犹豫是否要撑伞的短暂细雨，为晚秋增添了一份湿润而含蓄的韵味。",
        en: "Brief, passing showers fall in light patters and then quickly stop, over and over. The kind of fleeting rain that leaves one unsure whether to bother with an umbrella, it lends late autumn a distinctly soft, contemplative mood."
      },
      food: { ja: ["焼き芋", "蕪(かぶ)"], zh: ["烤番薯", "芜菁"], en: ["Roasted sweet potato", "Turnip"] },
      flower: { ja: "皇帝ダリア", zh: "木立大丽花", en: "Tree dahlia" }
    },
    {
      id: "kou-54", sekkiId: "soukou", order: 3,
      ja: "楓蔦黄", jaReading: "もみじつたきばむ",
      zh: "蛰虫咸俯", en: "Maple Leaves and Ivy Turn Golden",
      desc: {
        ja: "楓や蔦の葉が赤や黄色に色づき、山々を鮮やかに染め上げていく頃。紅葉狩りが各地で盛んに行われ、一年のうちでも特に彩り豊かな景色が楽しめる時期である。",
        zh: "枫叶与藤蔓叶片染上红黄色调，将山峦装点得绚丽夺目的时节。各地纷纷举行赏枫活动，是一年之中色彩尤为丰富的观景时期。",
        en: "Maple and ivy leaves turn brilliant shades of red and yellow, dyeing the mountainsides in vivid color. Leaf-viewing excursions are held enthusiastically across the country, making this one of the most visually rich stretches of the entire year."
      },
      food: { ja: ["栗きんとん", "秋鮭の塩焼き"], zh: ["栗子金团", "盐烤秋鲑"], en: ["Sweet chestnut paste (kuri kinton)", "Salt-grilled autumn salmon"] },
      flower: { ja: "紅葉", zh: "枫叶(赏红叶)", en: "Autumn maple foliage" }
    },
    {
      id: "kou-55", sekkiId: "rittou", order: 1,
      ja: "山茶始開", jaReading: "つばきはじめてひらく",
      zh: "水始冰", en: "Sasanqua Camellias Begin to Bloom",
      desc: {
        ja: "山茶花（さざんか）が、寒さの中でも凛とした花を咲かせ始める頃。他の花が少なくなるこの時期にあって、その鮮やかな色合いは庭先の貴重な彩りとなる。",
        zh: "山茶花在寒意中开始绽放端庄花朵的时节。在这个百花稀少的季节里，其鲜艳的色彩成为庭院中难得的一抹亮色。",
        en: "Sasanqua camellias begin blooming with quiet dignity even in the growing cold. With few other flowers left in bloom at this time of year, their vivid color becomes a precious accent in gardens."
      },
      food: { ja: ["蕪の漬物", "鰤(ぶり)"], zh: ["腌芜菁", "鰤鱼"], en: ["Pickled turnip", "Yellowtail (buri)"] },
      flower: { ja: "山茶花", zh: "山茶花", en: "Sasanqua camellia" }
    },
    {
      id: "kou-56", sekkiId: "rittou", order: 2,
      ja: "地始凍", jaReading: "ちはじめてこおる",
      zh: "地始冻", en: "The Ground Begins to Freeze",
      desc: {
        ja: "朝の冷え込みで、地面がかたく凍りつき始める頃。霜柱が立つようになり、踏むとサクサクと音を立てるその感触に、冬の到来を確かに感じ取れる。",
        zh: "受清晨严寒影响，地面开始变得坚硬冰冻的时节。霜柱开始出现，踩踏时发出沙沙声响的触感，让人真切感受到冬天已然来临。",
        en: "Under the morning chill, the ground begins to freeze solid. Needle ice starts forming, and the crunching sound underfoot when walking over it offers unmistakable confirmation that winter has arrived."
      },
      food: { ja: ["白菜鍋", "蜜柑"], zh: ["白菜火锅", "橘子"], en: ["Napa cabbage hot pot", "Mandarin oranges"] },
      flower: { ja: "寒椿", zh: "寒山茶", en: "Winter camellia" }
    },
    {
      id: "kou-57", sekkiId: "rittou", order: 3,
      ja: "金盞香", jaReading: "きんせんかさく",
      zh: "雉入大水为蜃", en: "Narcissus Flowers Grow Fragrant",
      desc: {
        ja: "水仙の花が甘く上品な香りを漂わせながら咲き始める頃。「金盞」とは水仙の異名で、黄色い部分を金の盃に見立てた古い呼び名に由来する。",
        zh: "水仙花开始绽放，散发出甘甜雅致香气的时节。「金盏」是水仙的别称，源自古人将其黄色花心比作金杯的雅致称呼。",
        en: "Narcissus flowers begin blooming, releasing a sweet, refined fragrance into the winter air. The Japanese name kinsenka (golden cup) refers to an old poetic comparison likening the flower's yellow center to a cup of gold."
      },
      food: { ja: ["水仙鍋(ふぐ)", "葱"], zh: ["河豚火锅", "大葱"], en: ["Fugu hot pot", "Green onions"] },
      flower: { ja: "水仙", zh: "水仙花", en: "Narcissus" }
    },
    {
      id: "kou-58", sekkiId: "shousetsu", order: 1,
      ja: "虹蔵不見", jaReading: "にじかくれてみえず",
      zh: "虹藏不见", en: "Rainbows Hide and No Longer Appear",
      desc: {
        ja: "空気が乾燥し、日差しも弱まることで、虹がほとんど見られなくなる頃。春から秋にかけて空を彩っていた虹は、この時期を境に姿を潜めていく。",
        zh: "空气转干、日照也随之减弱，彩虹几乎不再出现的时节。曾在春秋两季点缀天空的彩虹，自此时起便悄然隐去了身影。",
        en: "As the air turns dry and sunlight weakens, rainbows become an increasingly rare sight. Having colored the sky from spring through autumn, rainbows now largely disappear until the warmer months return."
      },
      food: { ja: ["牡蠣", "大根おろし"], zh: ["牡蛎", "萝卜泥"], en: ["Oysters", "Grated daikon"] },
      flower: { ja: "枇杷の花", zh: "枇杷花", en: "Loquat blossom" }
    },
    {
      id: "kou-59", sekkiId: "shousetsu", order: 2,
      ja: "朔風払葉", jaReading: "きたかぜこのはをはらう",
      zh: "天气上升地气下降", en: "North Winds Sweep the Leaves Away",
      desc: {
        ja: "冷たい北風が吹きつけ、木々に残っていた最後の葉を一気に払い落としていく頃。地面には落ち葉が積もり、丸裸になった枝が冬空にくっきりと浮かび上がる。",
        zh: "凛冽的北风吹起，将树上残留的最后一批叶片一举扫落的时节。落叶堆积在地面，光秃秃的枝干在冬日天空下轮廓分明地显现出来。",
        en: "Cold north winds gust through, sweeping away the last leaves still clinging to the trees. Fallen leaves pile up on the ground while bare branches stand out sharply against the winter sky."
      },
      food: { ja: ["蓮根", "鰤大根"], zh: ["莲藕", "鰤鱼炖萝卜"], en: ["Lotus root", "Simmered yellowtail and daikon"] },
      flower: { ja: "皇帝ダリア満開", zh: "木立大丽花盛放", en: "Tree dahlia in full bloom" }
    },
    {
      id: "kou-60", sekkiId: "shousetsu", order: 3,
      ja: "橘始黄", jaReading: "たちばなはじめてきばむ",
      zh: "闭塞而成冬", en: "Tachibana Citrus Turns Yellow",
      desc: {
        ja: "日本原産の柑橘である橘の実が、青から黄色へと色づき始める頃。古くから「非時香菓（ときじくのかくのこのみ）」とも呼ばれ、常緑の葉とともに長寿の象徴とされてきた。",
        zh: "日本原生柑橘「橘」的果实，开始由青转黄的时节。此果自古又被称为「非时香果」，与其常绿的叶片一同，被视为长寿的象征。",
        en: "The fruit of tachibana, a citrus native to Japan, begins turning from green to yellow. Known since ancient times by the poetic name the eternally fragrant fruit, it has long been regarded, along with its evergreen leaves, as a symbol of longevity."
      },
      food: { ja: ["蜜柑", "おでん"], zh: ["橘子", "关东煮"], en: ["Mandarin oranges", "Oden hot pot"] },
      flower: { ja: "橘", zh: "橘树花果", en: "Tachibana citrus" }
    },
    {
      id: "kou-61", sekkiId: "taisetsu", order: 1,
      ja: "閉塞成冬", jaReading: "そらさむくふゆとなる",
      zh: "鹖鴠不鸣", en: "The Sky Closes In and Winter Sets",
      desc: {
        ja: "空一面に重たい雲が垂れ込め、いかにも冬らしい閉ざされた空模様になる頃。日照時間も短くなり、どんよりとした灰色の空が続く日が増えていく。",
        zh: "天空布满沉重云层，呈现出冬日特有的封闭阴郁天色的时节。日照时间也变得更短，灰蒙蒙的阴天日益增多。",
        en: "Heavy clouds blanket the entire sky, creating the closed-in, distinctly wintry atmosphere characteristic of this time of year. Daylight hours shorten further, and dull gray skies become the norm on more and more days."
      },
      food: { ja: ["白子", "ふぐ鍋"], zh: ["鱼白", "河豚火锅"], en: ["Shirako (fish milt)", "Fugu hot pot"] },
      flower: { ja: "水仙満開", zh: "水仙盛开", en: "Narcissus in full bloom" }
    },
    {
      id: "kou-62", sekkiId: "taisetsu", order: 2,
      ja: "熊蟄穴", jaReading: "くまあなにこもる",
      zh: "虎始交", en: "Bears Retreat into Their Dens",
      desc: {
        ja: "熊が冬眠のため、山中の穴や木のうろに姿を隠し始める頃。食いだめをして体に脂肪を蓄えた熊たちは、春が来るまで長い眠りにつく。",
        zh: "熊为准备冬眠，开始躲入山中洞穴或树洞的时节。储备了充足脂肪的熊，将在此后进入直至春天到来的漫长冬眠。",
        en: "Bears begin retreating into mountain dens or hollow trees to hibernate. Having eaten heavily to build up fat reserves, they now settle in for a long sleep that will last until spring returns."
      },
      food: { ja: ["牡蠣鍋", "ほうれん草"], zh: ["牡蛎火锅", "菠菜"], en: ["Oyster hot pot", "Spinach"] },
      flower: { ja: "寒木瓜", zh: "寒木瓜花", en: "Winter-flowering quince" }
    },
    {
      id: "kou-63", sekkiId: "taisetsu", order: 3,
      ja: "鱖魚群", jaReading: "さけのうおむらがる",
      zh: "荔挺出", en: "Salmon Gather in the Rivers",
      desc: {
        ja: "産卵のため、鮭の群れが生まれ育った川をさかのぼり始める頃。力強く流れに逆らって進む姿は、命をつなぐための壮大な営みとして知られている。",
        zh: "为产卵洄游，鲑鱼群开始逆流而上、返回出生河流的时节。奋力逆流而进的身姿，是延续生命这一壮阔历程的象征。",
        en: "Salmon begin swimming upstream in schools, returning to the rivers where they were born in order to spawn. Their powerful struggle against the current is well known as one of nature's most striking displays of life perpetuating itself."
      },
      food: { ja: ["鮭のちゃんちゃん焼き", "大根"], zh: ["鲑鱼铁板烧", "萝卜"], en: ["Chan-chan yaki grilled salmon", "Daikon radish"] },
      flower: { ja: "八手(やつで)の花", zh: "八角金盘花", en: "Fatsia japonica blossom" }
    },
    {
      id: "kou-64", sekkiId: "touji", order: 1,
      ja: "乃東生", jaReading: "なつかれくさしょうず",
      zh: "蚯蚓结", en: "Self-Heal Sprouts Anew",
      desc: {
        ja: "夏至の頃に枯れたウツボグサ（夏枯草）が、冬至を迎える頃になると再び小さな芽を出し始める頃。他の草木が眠りにつく中、ひっそりと動き出すその姿が対照的である。",
        zh: "夏至前后枯萎的夏枯草，到了冬至时节又重新萌发出细小新芽的时节。在其他草木沉睡之际，它却悄然开始生长，形成鲜明的对照。",
        en: "Self-heal (utsubogusa), which withered back around the summer solstice, quietly begins sprouting fresh new shoots again as the winter solstice arrives. While other plants lie dormant, its quiet stirring stands in striking contrast."
      },
      food: { ja: ["南瓜(かぼちゃ)", "柚子湯"], zh: ["南瓜", "柚子浴汤"], en: ["Pumpkin (kabocha)", "Yuzu bath"] },
      flower: { ja: "寒椿満開", zh: "寒山茶盛开", en: "Winter camellia in full bloom" }
    },
    {
      id: "kou-65", sekkiId: "touji", order: 2,
      ja: "麋角解", jaReading: "さわしかのつのおつる",
      zh: "麋角解", en: "Deer Antlers Fall Away",
      desc: {
        ja: "大きな鹿（麋）の角が、根元からぽろりと落ちる頃。春になれば新しい角が生え変わることから、命の循環を静かに物語る候とされてきた。",
        zh: "大鹿（麋）的角从根部脱落的时节。由于春天到来时又会重新长出新角，此候被视为静静诉说生命循环的象征。",
        en: "The antlers of large deer (mi-jika) fall away from the base. Since fresh antlers will grow back again once spring arrives, this pentad has long been seen as a quiet reflection on life's ongoing cycle of renewal."
      },
      food: { ja: ["冬至粥", "小豆"], zh: ["冬至粥", "红豆"], en: ["Winter solstice porridge", "Azuki beans"] },
      flower: { ja: "蝋梅の蕾", zh: "蜡梅花苞", en: "Wintersweet buds" }
    },
    {
      id: "kou-66", sekkiId: "touji", order: 3,
      ja: "雪下出麦", jaReading: "ゆきわたりてむぎいずる",
      zh: "水泉动", en: "Wheat Sprouts Beneath the Snow",
      desc: {
        ja: "積もった雪の下で、麦がひそかに芽を出し始める頃。地表は雪に覆われ静まり返っていても、その下では次の実りに向けた命の準備が着実に進んでいる。",
        zh: "在积雪之下，麦子悄悄开始发芽的时节。地表虽被白雪覆盖、一片寂静，但雪下的麦苗却已为下一次丰收扎实地做着准备。",
        en: "Beneath a blanket of snow, wheat quietly begins to sprout. Though the surface lies still and silent under white snow, life underneath is steadily preparing for the next harvest to come."
      },
      food: { ja: ["冬至南瓜の煮物", "蓮根"], zh: ["冬至炖南瓜", "莲藕"], en: ["Simmered winter-solstice pumpkin", "Lotus root"] },
      flower: { ja: "福寿草の蕾", zh: "福寿草花苞", en: "Amur adonis buds" }
    },
    {
      id: "kou-67", sekkiId: "shoukan", order: 1,
      ja: "芹乃栄", jaReading: "せりすなわちさかう",
      zh: "雁北乡", en: "Water Dropwort Thrives",
      desc: {
        ja: "春の七草の一つでもある芹が、冷たい水辺で青々と勢いよく育ち始める頃。厳しい寒さの中でもみずみずしく茂るその姿は、生命力の強さを感じさせる。",
        zh: "作为春之七草之一的水芹，在冰冷的水边开始青翠茁壮生长的时节。即便身处严寒，依旧鲜嫩繁茂的姿态，让人感受到旺盛的生命力。",
        en: "Water dropwort, one of the seven herbs of spring, begins growing lush and green in the cold water along stream banks. Its vibrant growth even amid harsh cold conveys a real sense of resilient vitality."
      },
      food: { ja: ["七草粥の下ごしらえ", "芹"], zh: ["七草粥食材准备", "水芹"], en: ["Ingredients for seven-herb rice porridge", "Water dropwort"] },
      flower: { ja: "蝋梅", zh: "蜡梅", en: "Wintersweet" }
    },
    {
      id: "kou-68", sekkiId: "shoukan", order: 2,
      ja: "水泉動", jaReading: "しみずあたたかをふくむ",
      zh: "鹊始巢", en: "Underground Springs Begin to Stir",
      desc: {
        ja: "地上は凍りついていても、地中深くの泉ではわずかに水が動き、温もりを含み始める頃。目には見えない場所で、季節は着実に次へと向かっている。",
        zh: "尽管地表仍旧冰封，地下深处的泉水却已开始出现细微流动、渐渐含有暖意的时节。在肉眼看不见的地方，季节正稳步迈向下一个阶段。",
        en: "Even as the ground above stays frozen, springs deep underground begin to stir faintly, gaining the first traces of warmth. Unseen beneath the surface, the season is already steadily advancing toward what comes next."
      },
      food: { ja: ["七草粥", "小豆粥"], zh: ["七草粥", "红豆粥"], en: ["Seven-herb rice porridge", "Azuki bean porridge"] },
      flower: { ja: "福寿草開花", zh: "福寿草开花", en: "Amur adonis in bloom" }
    },
    {
      id: "kou-69", sekkiId: "shoukan", order: 3,
      ja: "雉始雊", jaReading: "きじはじめてなく",
      zh: "雉始雊", en: "Pheasants Begin to Call",
      desc: {
        ja: "雄の雉が、繁殖期に向けてケーンケーンという甲高い声で鳴き始める頃。羽を激しく打ち鳴らす「母衣打ち」とともに、寒空にその存在感を響かせる。",
        zh: "雄雉为迎接繁殖期，开始发出高亢「啯啯」鸣声的时节。伴随着振翅拍打的「母衣打」动作，其存在感在寒冬的天空下格外响亮。",
        en: "Male pheasants begin calling with a sharp, piercing cry in anticipation of the breeding season ahead. Accompanied by a dramatic wing-drumming display, their presence rings out unmistakably against the cold winter sky."
      },
      food: { ja: ["寒締めほうれん草", "鴨鍋"], zh: ["寒摘菠菜", "鸭肉火锅"], en: ["Cold-hardened spinach", "Duck hot pot"] },
      flower: { ja: "蝋梅満開", zh: "蜡梅盛开", en: "Wintersweet in full bloom" }
    },
    {
      id: "kou-70", sekkiId: "daikan", order: 1,
      ja: "款冬華", jaReading: "ふきのはなさく",
      zh: "鸡始乳", en: "Butterbur Flowers Bloom",
      desc: {
        ja: "蕗の薹（ふきのとう）が、雪の下や地面の隙間からひょっこりと顔を出し、花を咲かせ始める頃。ほろ苦い早春の味覚として、天ぷらなどで親しまれている。",
        zh: "蜂斗菜嫩芽从积雪下或地面缝隙中探出头来、绽放花朵的时节。作为带有微苦滋味的早春时鲜，常以天妇罗等方式受到人们喜爱。",
        en: "Butterbur sprouts (fuki-no-to) poke their way up through snow or cracks in the ground and begin to flower. Prized for their faintly bitter, distinctly early-spring flavor, they are a favorite ingredient for tempura and other dishes."
      },
      food: { ja: ["蕗の薹の天ぷら", "寒鰤"], zh: ["蜂斗菜天妇罗", "寒鰤鱼"], en: ["Butterbur tempura", "Winter yellowtail"] },
      flower: { ja: "蕗の薹", zh: "蜂斗菜花", en: "Butterbur sprout" }
    },
    {
      id: "kou-71", sekkiId: "daikan", order: 2,
      ja: "水沢腹堅", jaReading: "さわみずこおりつめる",
      zh: "鸷鸟厉疾", en: "Marsh Water Freezes Thick and Solid",
      desc: {
        ja: "沢や湿地に張った氷が、底までびっしりと厚く凍りつく頃。一年のうちで最も氷の厚みが増す時期とされ、寒さの底にあることを実感させる。",
        zh: "溪谷与湿地上的冰层，冻结得厚实坚硬、几乎彻底冰封的时节。这被视为一年中冰层最厚的时期，让人真切感受到寒冬已至谷底。",
        en: "Ice covering marshes and wetlands freezes thick and solid, all the way down. Regarded as the point when ice reaches its greatest thickness of the entire year, it makes unmistakably clear that winter has reached its very depths."
      },
      food: { ja: ["寒締め大根", "味噌の仕込み"], zh: ["寒摘萝卜", "味噌腌制"], en: ["Cold-hardened daikon", "Miso preparation"] },
      flower: { ja: "節分草", zh: "节分草", en: "Setsubun-so (Shibateranthis pinnatifida)" }
    },
    {
      id: "kou-72", sekkiId: "daikan", order: 3,
      ja: "鶏始乳", jaReading: "にわとりはじめてとやにつく",
      zh: "水泽腹坚", en: "Hens Begin Laying Eggs",
      desc: {
        ja: "日照時間が少しずつ延びていくのを感じ取り、鶏が卵を産み始める頃とされる候。二十四節気最後の候であり、次にはいよいよ立春、東風解凍へと巡っていく。",
        zh: "母鸡似乎感知到日照时间正一点点延长，开始重新产卵的时节。这是二十四节气的最后一候，此后便将再度迎来立春的东风解冻，循环重启。",
        en: "Sensing the daylight hours gradually lengthening, hens are said to begin laying eggs again. As the very last pentad of the 24 solar terms, it closes the cycle just before Risshun and the east wind melts the ice begin the whole sequence anew."
      },
      food: { ja: ["寒卵", "七草粥の名残"], zh: ["寒卵", "七草粥余韵"], en: ["Winter-laid eggs (kantamago)", "The last of the seven-herb porridge season"] },
      flower: { ja: "節分草開花", zh: "节分草开花", en: "Setsubun-so in bloom" }
    }
  ];

  return { sekki: sekki, kou: kou };
});
