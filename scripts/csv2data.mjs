/**
 * csv2data.mjs —— 把 Colnect 导出的 CSV 转换为项目的 src/data/{年份}.js
 *
 * 输入：CSV 文件目录（默认 assets-src/data/，文件名形如 *_year_1996.csv）
 * 输出：src/data/{年份}.js（每年一个文件，一邮票一记录）
 *        src/data/index.js（汇总导出）
 *
 * 用法：
 *   node scripts/csv2data.mjs                # 使用默认目录 assets-src/data/
 *   node scripts/csv2data.mjs <csv目录>       # 指定 CSV 所在目录
 *   node scripts/csv2data.mjs <csv目录> --out <输出目录>
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname, "..");

// ---------------- 参数解析 ----------------
const args = process.argv.slice(2);
let csvDir = join(ROOT, "assets-src", "data");
let outDir = join(ROOT, "src", "data");
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--out") {
    outDir = resolve(args[i + 1]);
    i++;
  } else if (!args[i].startsWith("--")) {
    csvDir = resolve(args[i]);
  }
}

// ---------------- CSV 解析 ----------------
/** 解析一行 CSV（处理引号包裹、转义引号、逗号、换行） */
function parseLine(line) {
  const cells = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else inQuotes = false;
      } else cur += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") { cells.push(cur); cur = ""; }
      else cur += ch;
    }
  }
  cells.push(cur);
  return cells;
}

/** 去掉字段首尾空白，清理 Colnect 的 <i> 标签等 HTML */
function clean(v) {
  if (v == null) return "";
  return String(v)
    .replace(/<i>/g, "")
    .replace(/<\/i>/g, "")
    .trim();
}

/**
 * 从一行数据 cells 构造一条邮票记录。
 * headerMap: { csv列名(清洗后): index }
 */
function rowToStamp(row, headerMap, year) {
  const get = (name) => {
    const i = headerMap[name];
    return i == null ? "" : clean(row[i]);
  };

  // 目录编号（如 "Mi:CN 683, Sn:CN 655, ..."）取第一段做临时志号
  const catNo = get("目录编号");
  let zihao = "";
  if (catNo) {
    // 优先取 Michel 编号，其次任意第一段
    const mi = catNo.match(/Mi:CN\s*([0-9A-Za-z]+)/i);
    const col = catNo.match(/Col:CN\s*([0-9.\-]+)/i);
    if (mi) zihao = "Mi:" + mi[1];
    else if (col) zihao = "Col:" + col[1];
    else zihao = catNo.split(",")[0].trim();
  }

  // 发行日期：YYYY-MM-DD
  const dateRaw = get("发行日期：");
  const dateMatch = dateRaw.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  let year2 = year;
  let date = "";
  if (dateMatch) {
    year2 = parseInt(dateMatch[1], 10);
    date = `${dateMatch[1]}年${parseInt(dateMatch[2], 10)}月${parseInt(dateMatch[3], 10)}日`;
  }

  // 宽度 × 高度（毫米）
  const w = get("宽度");
  const h = get("高度");
  let spec = "";
  if (w && h) spec = `${w}×${h}毫米`;

  // 面值
  const face = get("FaceValue");
  const faceValue = face ? String(face) : "面值待补";
  // 发行数量
  const mintage = get("发行数量");
  // 颜色、主题
  const color = get("颜色");
  // 中文化：theme 用中文「主题」列（如「建筑物,会议」），英文「专题」保留到 themeEn 备用
  const themeEn = get("专题");
  const theme = get("主题") || themeEn;
  const topic = get("主题");
  // 发行方式（纪念邮票/特种邮票/普通邮票）作为 category；版式（邮票/小本票/版张）作为 layout
  const category = get("发行方式") || "邮票";
  const layout = get("版式");
  const colnectId = get("链接").match(/stamp\/(\d+)/)?.[1] || "";

  return {
    zihao,
    name: get("名字"),
    // 中文官方名称（nameZh），来自 assets-src/zh-names.json；找不到则留空，前端回退英文 name
    nameZh: zhNames[colnectId] || "",
    year: year2,
    date,
    category,
    layout,
    theme,
    themeEn,
    total: 1,
    faceValue,
    spec,
    designer: get("设计师"),
    printer: get("印刷厂"),
    intro: get("说明") || topic || "",
    stamps: [],
    mintage,
    color,
    colnectId,
    source: "colnect",
  };
}

// ---------------- 中文名映射 ----------------
// assets-src/zh-names.json：{ colnectId: "中文名" }，用于为邮票补中文官方名称（nameZh）
const zhNamesFile = join(ROOT, "assets-src", "zh-names.json");
let zhNames = {};
if (existsSync(zhNamesFile)) {
  try {
    const parsed = JSON.parse(readFileSync(zhNamesFile, "utf-8"));
    for (const k of Object.keys(parsed)) {
      if (k === "_说明") continue;
      zhNames[k] = parsed[k];
    }
    console.log(`已加载中文名映射：${Object.keys(zhNames).length} 条`);
  } catch (e) {
    console.warn(`⚠ 读取 zh-names.json 失败：${e.message}`);
  }
}

// ---------------- 主流程 ----------------
if (!existsSync(csvDir)) {
  console.error(`✗ CSV 目录不存在：${csvDir}`);
  process.exit(1);
}

const files = readdirSync(csvDir).filter((f) => /_year_(\d+)\.csv$/i.test(f));
if (files.length === 0) {
  console.error(`✗ 在 ${csvDir} 未找到 *_year_*.csv 文件`);
  process.exit(1);
}

console.log(`找到 ${files.length} 个 CSV 文件`);

mkdirSync(outDir, { recursive: true });

const allRecords = [];
const yearOrder = [];

for (const f of files) {
  const yearMatch = f.match(/_year_(\d+)\.csv/i);
  const year = parseInt(yearMatch[1], 10);
  const content = readFileSync(join(csvDir, f), "utf-8");

  const records = [];
  let headerMap = null;
  let inData = false;
  let headerIndex = -1;

  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // 跳过前 7 行（说明行）后，第一行是表头
    // 更稳妥：找到以 "名字,国家" 开头的表头行
    if (!headerMap) {
      if (line.trim().startsWith("名字,国家") || line.startsWith('"名字","国家"')) {
        headerMap = {};
        const cells = parseLine(line);
        cells.forEach((c, idx) => { headerMap[clean(c)] = idx; });
        inData = true;
        continue;
      }
      continue;
    }
    if (!line.trim() || line.trim().startsWith('"END of Colnect')) continue;
    const row = parseLine(line);
    if (!row[0] || !row[0].trim()) continue; // 空行
    records.push(rowToStamp(row, headerMap, year));
  }

  // 生成唯一 id：年份-序号（按数据出现顺序，01 起）
  records.forEach((r, idx) => {
    r.id = `${r.year}-${String(idx + 1).padStart(2, "0")}`;
  });

  if (records.length === 0) {
    console.log(`  - ${year}: 0 条，跳过`);
    continue;
  }

  yearOrder.push(year);
  allRecords.push({ year, records });

  // 写 {年份}.js
  const fileContent =
    `/**\n` +
    ` * ${year}年 邮票数据\n` +
    ` * 数据来源：Colnect（https://colnect.cn）\n` +
    ` * 共 ${records.length} 条（一邮票一记录）\n` +
    ` * 志号为 Colnect 编号（临时），正式志号待补\n` +
    ` */\n\n` +
    `const YEAR_${year} = ${JSON.stringify(records, null, 2)};\n\n` +
    `export default YEAR_${year};\n`;
  writeFileSync(join(outDir, `${year}.js`), fileContent, "utf-8");
  console.log(`  ✓ ${year}: ${records.length} 条 → src/data/${year}.js`);
}

yearOrder.sort((a, b) => a - b);

// 写 index.js
const imports = yearOrder.map((y) => `import data_${y} from "./${y}.js";`).join("\n");
const exports_ = `export const YEARS = [${yearOrder.join(", ")}];\n\n`;
const merged = `export const STAMP_DATA = [\n${yearOrder.map((y) => `  ...data_${y},`).join("\n")}\n];\n`;
const indexContent =
  `/**\n` +
  ` * 中国邮票数据索引\n` +
  ` * 按年拆分，每年一个文件（src/data/{年份}.js）\n` +
  ` * 自动生成，请勿手动编辑。\n` +
  ` */\n\n` +
  imports + "\n\n" +
  exports_ +
  merged +
  `export default STAMP_DATA;\n`;
writeFileSync(join(outDir, "index.js"), indexContent, "utf-8");

// 写 DATA_META
const total = allRecords.reduce((acc, g) => acc + g.records.length, 0);
const metaContent =
  `export const DATA_META = {\n` +
  `  version: "1.1.0",\n` +
  `  updatedAt: "${new Date().toISOString().slice(0, 10)}",\n` +
  `  imageDir: "public/stamps",\n` +
  `  imageExt: "webp",\n` +
  `  source: "Colnect",\n` +
  `  years: ${yearOrder.length},\n` +
  `  count: ${total},\n` +
  `};\n`;
writeFileSync(join(outDir, "meta.js"), metaContent, "utf-8");

console.log(`\n完成：共 ${yearOrder.length} 个年份，${total} 条邮票记录`);
console.log(`输出目录：${outDir}`);
