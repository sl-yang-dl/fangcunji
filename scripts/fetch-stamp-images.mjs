/**
 * fetch-stamp-images.mjs —— 用 Wikimedia Commons API 为邮票匹配真实图片 URL
 *
 * 输出：assets-src/zh-images.json（{ colnectId: "https://.../xxx.jpg" }）
 * 前端 stampImageUrl 已支持 http(s) 直链，注入 image 字段即可直接显示真实图。
 *
 * 用法：
 *   node scripts/fetch-stamp-images.mjs <年份列表，逗号分隔> [--all]
 *     --all  当未匹配到时，把第一个候选 URL 也记下（用于人工复核），默认只记高置信候选
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_FILE = join(ROOT, "assets-src", "zh-images.json");
const UA = "StampGallery/1.0 (philately research; contact@example.com)";
const API = "https://commons.wikimedia.org/w/api.php";

const USE_ALL = process.argv.includes("--all");

function loadRecords(year) {
  const file = join(ROOT, "src", "data", `${year}.js`);
  if (!existsSync(file)) return [];
  const code = readFileSync(file, "utf8");
  const m = code.match(/const YEAR_\d+ = (\[[\s\S]*?\]);\s*\nexport/);
  if (!m) return [];
  try { return JSON.parse(m[1]); } catch { return []; }
}

// 构造搜索词：优先中文名+邮票，其次英文名+stamp
function buildQuery(rec) {
  const zh = (rec.nameZh || "").trim();
  const en = (rec.name || "").trim();
  const qs = [];
  if (zh) qs.push(encodeURIComponent(`${zh} 邮票`));
  else qs.push(encodeURIComponent(`${en} stamp`));
  // 加一个无"邮票"的中文查询作为备选
  if (zh) qs.push(encodeURIComponent(zh));
  return qs;
}

async function searchImages(query, limit = 6) {
  const url =
    `${API}?action=query&generator=search&gsrsearch=filetype:bitmap%20${query}` +
    `&gsrlimit=${limit}&gsrnamespace=6&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=800&format=json`;
  try {
    const resp = await fetch(url, { headers: { "User-Agent": UA } });
    if (!resp.ok) return [];
    const data = await resp.json();
    const pages = (data.query && data.query.pages) || {};
    const results = [];
    for (const p of Object.values(pages)) {
      const ii = (p.imageinfo || [])[0];
      if (!ii) continue;
      results.push({
        title: p.title,
        url: ii.url,
        thumb: ii.thumburl || ii.url,
        mime: ii.mime,
        w: ii.width,
        h: ii.height,
      });
    }
    return results;
  } catch (e) {
    return [];
  }
}

// 简单过滤：排除 SVG、过大过小、尺寸异常
function isGood(img) {
  if (!img || img.mime === "image/svg+xml") return false;
  if (!img.w || !img.h) return false;
  if (img.w < 200 || img.h < 200) return false;   // 太小
  if (img.w > 8000 || img.h > 8000) return false; // 超大
  // 横竖比在 0.4~2.5 之间（邮票/小型张比例）
  const ratio = img.w / img.h;
  if (ratio < 0.4 || ratio > 2.5) return false;
  return true;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== "--all");
  if (args.length === 0) {
    console.error("用法：node scripts/fetch-stamp-images.mjs <年份列表，逗号分隔>");
    process.exit(1);
  }
  const years = args[0].split(",").map((s) => s.trim()).filter(Boolean);

  let images = {};
  if (existsSync(OUT_FILE)) {
    try { images = JSON.parse(readFileSync(OUT_FILE, "utf8")); } catch {}
  }
  if (images._说明 === undefined) images._说明 = "邮票图片映射：key 为 colnectId，value 为 Wikimedia Commons 图片直链 URL。分批补充中。";

  for (const year of years) {
    const records = loadRecords(year);
    console.log(`\n=== ${year} 年（${records.length} 条）===\n`);
    let ok = 0, miss = 0;
    for (const rec of records) {
      const cid = String(rec.colnectId);
      if (images[cid] && images[cid] !== "_待复核") { ok++; continue; }
      const queries = buildQuery(rec);
      let picked = null;
      for (const q of queries) {
        const results = (await searchImages(q)).filter(isGood);
        if (results.length) {
          picked = USE_ALL ? results[0] : results.find((r) => /stamp|邮票|PRC|China/i.test(r.title)) || results[0];
          if (picked) break;
        }
        await sleep(300);
      }
      if (picked) {
        images[cid] = picked.thumb || picked.url;
        ok++;
        console.log(`  ✓ ${cid} ${rec.nameZh||rec.name}: ${(picked.thumb||picked.url).slice(0,80)}`);
      } else {
        miss++;
        console.log(`  · ${cid} ${rec.nameZh||rec.name}: 未匹配`);
      }
      await sleep(250);
    }
    console.log(`  → ${year}: 匹配 ${ok} / 共 ${records.length}`);
  }

  const sorted = {};
  Object.keys(images).sort().forEach((k) => { sorted[k] = images[k]; });
  writeFileSync(OUT_FILE, JSON.stringify(sorted, null, 2) + "\n", "utf8");
  console.log(`\n完成：zh-images.json 现有 ${Object.keys(sorted).length - 1} 条图片映射。`);
}

main();
