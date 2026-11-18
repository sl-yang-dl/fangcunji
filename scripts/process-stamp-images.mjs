// ============================================================
// 邮票图片批量处理脚本
// 配合 .github/workflows/images.yml 使用，也可本地运行。
//
// 输入：仓库根目录 assets-src/stamps/ 下的原始图片（png/jpg/webp）
//       文件名需与 src/data.js 中邮票的 id 一致，例如 t46-hou.png
// 输出：public/stamps/{id}.webp（压缩后的 WebP）
//       并同步把 src/data.js 中该邮票的 image 字段更新为 "{id}.webp"
// ============================================================
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC_DIR = join(ROOT, "assets-src", "stamps");
const OUT_DIR = join(ROOT, "public", "stamps");
const DATA_FILE = join(ROOT, "src", "data.js");

// 输出图片的最长边与质量（可调）
const MAX_EDGE = 900;
const QUALITY = 82;

// 支持的源图片扩展名
const SRC_EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);

function main() {
  if (!statSafe(SRC_DIR)) {
    console.error(`未找到目录 ${SRC_DIR}，请在仓库根目录创建 assets-src/stamps/ 并放入原始图片。`);
    process.exit(1);
  }

  const srcFiles = readdirSync(SRC_DIR).filter((f) => SRC_EXT.has(extname(f).toLowerCase()));
  if (srcFiles.length === 0) {
    console.error(`目录 ${SRC_DIR} 中没有 png/jpg/webp 图片。`);
    process.exit(1);
  }

  const byId = {}; // id -> 源文件路径
  for (const f of srcFiles) {
    const id = basename(f, extname(f));
    byId[id] = join(SRC_DIR, f);
  }

  // 读取并解析 data.js 中的 id 列表
  const dataJs = readFileSync(DATA_FILE, "utf8");
  const ids = [...dataJs.matchAll(/\bid:\s*"([^"]+)"/g)].map((m) => m[1]);
  console.log(`data.js 中共 ${ids.length} 条邮票记录。`);

  let converted = 0;
  let matched = 0;
  let newData = dataJs;

  for (const id of ids) {
    const src = byId[id];
    if (!src) continue;
    matched++;

    const out = join(OUT_DIR, id + ".webp");
    const before = statSafe(out) ? statSync(out).size : 0;

    sharp(src)
      .rotate() // 保留 EXIF 方向
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFileSync(out);

    const after = statSync(out).size;
    console.log(`✓ ${id}: ${basename(src)} -> ${id}.webp (${fmt(before)} -> ${fmt(after)})`);

    // 更新 data.js 中该邮票的 image 字段为 {id}.webp
    newData = updateImageField(newData, id, id + ".webp");
    converted++;
  }

  if (converted > 0) {
    writeFileSync(DATA_FILE, newData, "utf8");
    console.log(`完成：共转换 ${converted} 张，已同步更新 data.js 的 image 字段。`);
  } else {
    console.log("未匹配到任何图片（文件名需与 data.js 中的 id 对应）。");
  }

  const missing = ids.filter((id) => !byId[id]);
  if (missing.length) {
    console.log(`\n提示：以下 ${missing.length} 条记录没有对应图片（将保持占位图）：\n  - ${missing.join("\n  - ")}`);
  }
}

// 在 data.js 中，把"指定 id 所在对象"里的 image 字段更新为指定值
function updateImageField(text, id, imageValue) {
  // 定位 "id: "xxx"" 之后到下一个 "id: " 或数组结束之间的 image 字段
  const idRe = new RegExp(`id:\\s*"${escapeRe(id)}"`);
  const idMatch = idRe.exec(text);
  if (!idMatch) return text;

  const start = idMatch.index;
  // 对象结束：下一个顶层 "  id: "（缩进2空格的 id）或 "};" 结束数组
  const endRe = /\n\s{2}id:\s*"/;
  const rest = text.slice(start + idMatch[0].length);
  const nextId = rest.search(endRe);
  const blockEnd = nextId === -1 ? text.length : start + idMatch[0].length + nextId;

  const block = text.slice(start, blockEnd);
  const newBlock = block.replace(
    /(\n\s*image:\s*)"[^"]*"/,
    (_m, lead) => `${lead}"${escapeJson(imageValue)}"`
  );
  if (newBlock === block) {
    console.warn(`  ! ${id} 对象中未找到 image 字段，跳过字段更新。`);
    return text;
  }
  return text.slice(0, start) + newBlock + text.slice(blockEnd);
}

function statSafe(p) {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeJson(s) {
  return s.replace(/"/g, '\\"').replace(/\\/g, "\\\\");
}

function fmt(bytes) {
  return bytes > 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(2) + "MB" : (bytes / 1024).toFixed(1) + "KB";
}

main();
