// 主题 → 图案（emoji）映射，用于把程序化占位图升级为"贴合主题的插画"。
// 按顺序匹配（先具体、后宽泛），命中即返回对应 emoji。
// 仅用 Unicode emoji：零版权、零外链、离线可用、跨 7277 张邮票可一键生效。
//
// 若日后想换成单色线描/汉字印章风，只需替换本文件的 RULES.e 字段即可，
// pickMotif 的接口保持不变。

const RULES = [
  // —— 生肖（干支 + 年）——
  { re: /申年/, e: "🐒" }, // 猴
  { re: /酉年/, e: "🐔" }, // 鸡
  { re: /戌年/, e: "🐕" }, // 狗
  { re: /亥年/, e: "🐖" }, // 猪
  { re: /子年/, e: "🐭" }, // 鼠
  { re: /丑年/, e: "🐂" }, // 牛
  { re: /寅年/, e: "🐯" }, // 虎
  { re: /卯年/, e: "🐇" }, // 兔
  { re: /辰年/, e: "🐲" }, // 龙
  { re: /巳年/, e: "🐍" }, // 蛇
  { re: /午年/, e: "🐎" }, // 马
  { re: /未年/, e: "🐑" }, // 羊

  // —— 具体动物 ——
  { re: /熊猫|panda/i, e: "🐼" },
  { re: /长颈鹿/, e: "🦒" },
  { re: /象|elephant/i, e: "🐘" },
  { re: /鹿|deer/i, e: "🦌" },
  { re: /猫/, e: "🐱" },
  { re: /犬|狗/, e: "🐕" },
  { re: /猪|豚/, e: "🐖" },
  { re: /牛|ox|bull/i, e: "🐂" },
  { re: /虎|tiger/i, e: "🐯" },
  { re: /兔|rabbit/i, e: "🐇" },
  { re: /鸡|chicken/i, e: "🐔" },
  { re: /猴|monkey/i, e: "🐒" },
  { re: /蛇|snake/i, e: "🐍" },
  { re: /马|horse/i, e: "🐎" },
  { re: /羊|sheep|goat/i, e: "🐑" },
  { re: /鼠|rat/i, e: "🐭" },
  { re: /鱼|fish/i, e: "🐟" },
  { re: /鸟|bird/i, e: "🐦" },
  { re: /鹤|crane/i, e: "🕊️" },
  { re: /凤|凤凰|phoenix/i, e: "🦚" },
  { re: /龙|dragon/i, e: "🐉" },
  { re: /蝴蝶|蝶|butterfly/i, e: "🦋" },
  { re: /蜜蜂|bee/i, e: "🐝" },
  { re: /恐龙|dinosaur/i, e: "🦖" },

  // —— 植物 ——
  { re: /竹|bamboo/i, e: "🎋" },
  { re: /梅|plum/i, e: "🌸" },
  { re: /莲|荷|lotus/i, e: "🪷" },
  { re: /菊|chrys/i, e: "🌼" },
  { re: /花|花卉|植物|flower|plant/i, e: "🌸" },
  { re: /茶|tea/i, e: "🍵" },
  { re: /树|forest/i, e: "🌳" },
  { re: /稻|禾|农业|农|farm/i, e: "🌾" },

  // —— 体育运动（具体优先）——
  { re: /武术|功夫|wushu|kung/i, e: "🥋" },
  { re: /游泳|swim/i, e: "🏊" },
  { re: /象棋|棋|chess/i, e: "♟️" },
  { re: /风筝|kite/i, e: "🪁" },

  // —— 名胜 / 建筑 / 地景 ——
  { re: /长城|great wall/i, e: "🏯" },
  { re: /桥|bridge/i, e: "🌉" },
  { re: /建筑|馆|楼|殿|遗址|building|monument/i, e: "🏛️" },
  { re: /寺|庙|塔|pagoda|temple/i, e: "🛕" },
  { re: /兵马俑|俑/, e: "🗿" },
  { re: /山|峰|mountain/i, e: "⛰️" },
  { re: /湖|lake/i, e: "🏞️" },
  { re: /江|河|川|水库/, e: "🌊" },
  { re: /景观|风景|名胜|风光|scenery|landscape/i, e: "🏞️" },
  { re: /雪|snow/i, e: "❄️" },
  { re: /灯|灯笼|lantern|元宵/i, e: "🏮" },
  { re: /建设|祖国/i, e: "🏗️" },

  // —— 文化艺术 ——
  { re: /名画|画|绘画|油画|painting/i, e: "🖼️" },
  { re: /书法|笔|calligraphy|篆刻|碑|印/i, e: "🖌️" },
  { re: /文学|诗|小说|作家|literature|writer/i, e: "📜" },
  { re: /音乐|乐器|music/i, e: "🎵" },
  { re: /舞蹈|舞|dance/i, e: "💃" },
  { re: /京剧|戏曲|歌剧|昆曲|opera/i, e: "🎭" },
  { re: /文物|考古|博物馆|鼎|青铜|陶|瓷|三彩/i, e: "🏺" },
  { re: /艺术|剪纸|工艺|民间/i, e: "🎨" },
  { re: /钱币|货币|贝|coin|currency/i, e: "🪙" },

  // —— 人物 / 社会 ——
  { re: /儿童|少年|child/i, e: "🧒" },
  { re: /学生/, e: "🎓" },
  { re: /妇女|女性|woman/i, e: "👩" },
  { re: /军人|军|兵|元帅|army|military/i, e: "🎖️" },
  { re: /消防|救援/, e: "🚒" },
  { re: /医|卫生|医疗|medical|health/i, e: "⚕️" },
  { re: /红十字/, e: "🏥" },
  { re: /科学家|院士|名人|人物/, e: "🧑" },

  // —— 科技 / 交通 ——
  { re: /航空|飞机|飞行|aviation|plane|air/i, e: "✈️" },
  { re: /船|舰|航海|帆|ship|boat/i, e: "⛵" },
  { re: /航天|卫星|宇宙|space|satellite/i, e: "🛰️" },
  { re: /科技|科学|原子|science|atom/i, e: "⚛️" },
  { re: /工业|工厂|机械|industry/i, e: "🏭" },
  { re: /计划/, e: "🏭" },
  { re: /输电|电力|电/, e: "⚡" },
  { re: /铁路|火车|train/i, e: "🚂" },
  { re: /汽车|car/i, e: "🚗" },
  { re: /公路/, e: "🛣️" },
  { re: /邮政|postage/i, e: "✉️" },
  { re: /地图|地理|版图|map/i, e: "🗺️" },

  // —— 国家 / 节庆 ——
  { re: /欠资/, e: "📭" },
  { re: /国庆|开国|建国|建党|国徽|旗|flag|anniv/i, e: "🚩" },
  { re: /奥运|奥林匹克|亚运|运动|体育|体操|球|田径|sport|olympi/i, e: "🏅" },
  { re: /节|festival/i, e: "🎉" },
];

// 依据邮票的名称 / 主题等字段挑选一个贴合的图案 emoji；无匹配返回 ""（回退到首字印章）。
export function pickMotif(stamp) {
  if (!stamp) return "";
  const s = [
    stamp.name || "",
    stamp.nameZh || "",
    stamp.themeEn || "",
    stamp.theme || "",
    stamp.category || "",
  ]
    .join(" ")
    .toLowerCase();
  for (const r of RULES) {
    if (r.re.test(s)) return r.e;
  }
  return "";
}
