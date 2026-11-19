// 工具函数：从原生 app.js 迁移

import { pickMotif } from "./motifs.js";
export function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function shade(hex, percent) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r0 = (n >> 16) & 255;
  const g0 = (n >> 8) & 255;
  const b0 = n & 255;
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent);
  const r = Math.round((t - r0) * p + r0);
  const g = Math.round((t - g0) * p + g0);
  const b = Math.round((t - b0) * p + b0);
  return "rgb(" + r + "," + g + "," + b + ")";
}

// 解析 spec 字符串得到真实宽高比例，ratio = w/h
export function parseAspect(spec) {
  let w, h;
  if (spec && typeof spec === "string") {
    const m = spec.replace(/[×xX*]/g, "×").match(/(\d+(?:\.\d+)?)\s*[×]\s*(\d+(?:\.\d+)?)/);
    if (m) {
      w = parseFloat(m[1]);
      h = parseFloat(m[2]);
    }
  }
  if (!w || !h) {
    w = 30;
    h = 40;
  }
  let ratio = w / h;
  ratio = Math.max(0.45, Math.min(2.1, ratio));
  return { w, h, ratio };
}

export function aspectType(ratio) {
  if (ratio > 1.12) return "landscape";
  if (ratio < 0.9) return "portrait";
  return "square";
}

export function stampGeometry(stamp) {
  const a = parseAspect(stamp.spec);
  const type = aspectType(a.ratio);
  const isSouvenir =
    /(小全张|小型张|小版张)/.test(stamp.name || "") ||
    /M\b|M$/.test(stamp.zihao || "") ||
    /(小全张|小型张|小版张)/.test(stamp.layout || "");
  return { ratio: a.ratio, w: a.w, h: a.h, type, isSouvenir };
}

function perforationCircles(seed, W, H, gap) {
  let dots = "";
  for (let x = gap / 2; x < W - gap / 2; x += gap) {
    dots += '<circle cx="' + x.toFixed(1) + '" cy="3" r="1.6"/>';
    dots += '<circle cx="' + x.toFixed(1) + '" cy="' + (H - 3) + '" r="1.6"/>';
  }
  for (let y = gap / 2; y < H - gap / 2; y += gap) {
    dots += '<circle cx="3" cy="' + y.toFixed(1) + '" r="1.6"/>';
    dots += '<circle cx="' + (W - 3) + '" cy="' + y.toFixed(1) + '" r="1.6"/>';
  }
  return dots;
}

function pickInitial(name) {
  return name && name.length > 1 ? name.charAt(name.length - 1) : "邮";
}

// 生成按真实比例的邮票 SVG
export function stampArt(id, name, color, zihao, year, faceValue, ratio, motif) {
  const seed = hashCode(id || name);
  const H = 230;
  const W = Math.max(120, Math.round(H * ratio));
  const type = aspectType(ratio);
  const c1 = shade(color, -0.32);
  const c2 = color;
  const c3 = shade(color, 0.32);
  const esc = escapeXml(name);
  const escZi = escapeXml(zihao || "");
  const escYear = escapeXml(year ? year + "" : "");
  const escFace = escapeXml(faceValue || "");
  const initial = pickInitial(name);
  const gradId = "g" + seed;
  const dotsId = "d" + seed;
  const perfs = perforationCircles(seed, W, H, 8);
  const pad = 6;
  const iw = W - pad * 2;
  const ih = H - pad * 2;
  const cx = W / 2;
  const cy = H / 2;
  let stampX, stampY;
  if (type === "landscape") {
    stampX = W * 0.72 + (seed % 30);
    stampY = H * 0.68 + (seed % 20);
  } else {
    stampX = W * 0.7 + (seed % 30);
    stampY = H * 0.72 + (seed % 20);
  }
  const circR = Math.max(28, Math.min(iw, ih) * 0.4);
  const initSize = Math.round(circR * 0.95);
  const topY = 24;
  const nameY = H - 54;
  const zihaoY = H - 38;
  const faceX = W - 20;
  const faceY = H - 26;
  const nameSize = type === "landscape" ? 12 : 13;

  // 中央「月洞窗」：有主题图案则放 emoji，否则回退到名称首字印章
  const motifHtml = motif
    ? '<text x="' + cx + '" y="' + cy + '" text-anchor="middle" dominant-baseline="central" font-size="' + (circR * 1.3).toFixed(1) + '">' + escapeXml(motif) + '</text>'
    : '<text x="' + cx + '" y="' + (cy + Math.round(circR * 0.38)) + '" text-anchor="middle" font-family="Kaiti SC,STKaiti,KaiTi,serif" font-size="' + initSize + '" font-weight="700" fill="' + c3 + '" opacity="0.95">' + escapeXml(initial) + '</text>';

  return (
    '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img">' +
    '<defs>' +
    '<linearGradient id="' + gradId + '" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="' + c1 + '"/>' +
    '<stop offset="1" stop-color="' + c2 + '"/>' +
    '</linearGradient>' +
    '<radialGradient id="' + dotsId + '" cx="0.5" cy="0.5" r="0.5">' +
    '<stop offset="0" stop-color="rgba(255,255,255,0.5)"/>' +
    '<stop offset="1" stop-color="rgba(255,255,255,0)"/>' +
    '</radialGradient>' +
    '</defs>' +
    '<rect x="1.5" y="1.5" width="' + (W - 3) + '" height="' + (H - 3) + '" rx="8" fill="#fbf7ef" stroke="rgba(0,0,0,0.08)"/>' +
    '<g fill="#fbf7ef">' + perfs + '</g>' +
    '<rect x="' + pad + '" y="' + pad + '" width="' + iw + '" height="' + ih + '" rx="6" fill="url(#' + gradId + ')"/>' +
    '<rect x="' + (pad + 4) + '" y="' + (pad + 4) + '" width="' + (iw - 8) + '" height="' + (ih - 8) + '" rx="4" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.4"/>' +
    '<circle cx="' + cx + '" cy="' + cy + '" r="' + (circR + 5) + '" fill="none" stroke="rgba(201,162,75,0.55)" stroke-width="1.2"/>' +
    '<circle cx="' + cx + '" cy="' + cy + '" r="' + circR + '" fill="#fbf7ef" stroke="rgba(166,58,58,0.4)" stroke-width="1.5"/>' +
    motifHtml +
    '<g transform="rotate(-6 ' + (pad + 20) + ' ' + (pad + 22) + ')">' +
    '<rect x="' + (pad + 8) + '" y="' + (pad + 10) + '" width="22" height="22" rx="2" fill="#b23a24" opacity="0.85"/>' +
    '<rect x="' + (pad + 11) + '" y="' + (pad + 13) + '" width="16" height="16" rx="1" fill="none" stroke="rgba(253,243,223,0.6)" stroke-width="1"/>' +
    '<text x="' + (pad + 19) + '" y="' + (pad + 27) + '" text-anchor="middle" font-family="Kaiti SC,STKaiti,KaiTi,serif" font-size="11" fill="rgba(253,243,223,0.9)">' + escapeXml(initial) + '</text>' +
    '</g>' +
    '<g transform="rotate(' + (seed % 40) + ' ' + stampX + ' ' + stampY + ')">' +
    '<circle cx="' + stampX + '" cy="' + stampY + '" r="20" fill="none" stroke="rgba(155,30,30,0.55)" stroke-width="2.2"/>' +
    '<circle cx="' + stampX + '" cy="' + stampY + '" r="15" fill="none" stroke="rgba(155,30,30,0.4)" stroke-width="1"/>' +
    '<text x="' + stampX + '" y="' + (stampY - 2) + '" text-anchor="middle" font-family="sans-serif" font-size="7" fill="rgba(155,30,30,0.6)">中·国·邮</text>' +
    '<text x="' + stampX + '" y="' + (stampY + 8) + '" text-anchor="middle" font-family="serif" font-size="8" fill="rgba(155,30,30,0.6)">' + escYear + '</text>' +
    '</g>' +
    '<text x="' + (W * 0.12) + '" y="' + topY + '" font-family="sans-serif" font-size="8.5" font-weight="600" letter-spacing="0.5" fill="rgba(255,255,255,0.85)">中国人民邮政</text>' +
    '<text x="' + (W * 0.88) + '" y="' + topY + '" text-anchor="end" font-family="sans-serif" font-size="8.5" font-weight="600" letter-spacing="1" fill="rgba(255,255,255,0.85)">CHINA</text>' +
    '<text x="' + cx + '" y="' + nameY + '" text-anchor="middle" font-family="sans-serif" font-size="' + nameSize + '" font-weight="700" fill="#fff">' + esc + '</text>' +
    '<text x="' + cx + '" y="' + zihaoY + '" text-anchor="middle" font-family="sans-serif" font-size="8.5" letter-spacing="1" fill="rgba(255,255,255,0.75)">' + escZi + '</text>' +
    '<text x="' + faceX + '" y="' + faceY + '" text-anchor="end" font-family="serif" font-size="11" font-weight="bold" fill="#fff" opacity="0.95">' + escFace + '</text>' +
    '</svg>'
  );
}

// 把数据里的本地图片文件名解析为可用的完整 URL。
// 图片按年分目录：public/stamps/{年份}/{id}.webp。
// 兼容旧路径：若 image 含 "/" 则按目录拼接，否则直接放 stamps/ 根目录。
// import.meta.env.BASE_URL 在开发时为 "/"，部署到子路径时自动带上前缀。
export function stampImageUrl(image, stamp) {
  if (!image) return "";
  // 已是完整 URL（http/https/data:）则原样返回，方便以后接外部图
  if (/^(https?:|data:|\/\/)/.test(image)) return image;
  const base = import.meta.env.BASE_URL + "stamps/";
  // 若 image 已经包含目录（如 "1963/1963-01.webp"）则直接拼接
  if (image.includes("/")) return base + image;
  // 否则优先按年份子目录组织
  const year = stamp && stamp.year ? stamp.year : "";
  if (year) return base + year + "/" + image;
  return base + image;
}

export function stampArtFor(stamp) {
  const g = stampGeometry(stamp);
  if (stamp.image) {
    return (
      '<img src="' + escapeXml(stampImageUrl(stamp.image, stamp)) + '" alt="' + escapeXml(stamp.name) + '" style="width:100%;height:100%;object-fit:contain;">'
    );
  }
  const motif = pickMotif(stamp);
  return stampArt(
    stamp.id,
    stamp.name,
    stamp.themeColor || "#8f8f8f",
    stamp.zihao,
    stamp.year,
    stamp.faceValue,
    g.ratio,
    motif
  );
}

// 从 date 字段解析月份，返回 1-12，失败返回 0
export function monthOf(s) {
  const d = s.date || "";
  let m = d.match(/(?:年|[-/.])(\d{1,2})月?/);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n >= 1 && n <= 12) return n;
  }
  const m2 = d.match(/(\d{1,2})月/);
  if (m2) {
    const n2 = parseInt(m2[1], 10);
    if (n2 >= 1 && n2 <= 12) return n2;
  }
  return 0;
}

// 按月份分组（1-12 升序），仅含有邮票的月份
export function groupByMonth(list) {
  const map = {};
  list.forEach(function (s) {
    const mo = monthOf(s) || 1;
    (map[mo] = map[mo] || []).push(s);
  });
  return [1,2,3,4,5,6,7,8,9,10,11,12]
    .filter(function (mo) { return map[mo]; })
    .map(function (mo) { return [mo, map[mo]]; });
}
