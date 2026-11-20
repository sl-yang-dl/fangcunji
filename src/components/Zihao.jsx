import { useState, useRef } from "react";

// 目录前缀含义
const CATALOGS = {
  Mi: "米歇尔目录（德国）",
  Sg: "吉本斯目录（英国）",
  Scott: "斯科特目录（美国）",
  Col: "Colnect 自编目录",
};

// 发行形态后缀
const FORMAT = {
  KB: "小版张（Kleinbogen）",
  HB: "本票内页（Heftchenbogen，小本票）",
  BL: "小型张 / 小全张（Block）",
  Zf: "带副票的联票（Zusammendruck）",
};

// 版次 / 印次后缀
const PRINTING = {
  I: "第一版 / 首次印刷",
  II: "第二版 / 再版",
  III: "第三版",
  A: "A 版（不同印次或版别）",
  B: "B 版",
  C: "C 版",
  D: "D 版",
  E: "E 版",
  F: "F 版",
};

// 把后缀字母串拆成已知记号（如 IIKB -> [II, KB]，AKB -> [A, KB]）
function tokenizeSuffix(suf) {
  const tokens = [];
  let i = 0;
  while (i < suf.length) {
    const two = suf.slice(i, i + 3);
    const one = suf.slice(i, i + 1);
    if (FORMAT[two]) { tokens.push({ raw: two, kind: "format", text: FORMAT[two] }); i += 3; }
    else if (FORMAT[one]) { tokens.push({ raw: one, kind: "format", text: FORMAT[one] }); i += 1; }
    else if (PRINTING[two]) { tokens.push({ raw: two, kind: "print", text: PRINTING[two] }); i += 3; }
    else if (PRINTING[one]) { tokens.push({ raw: one, kind: "print", text: PRINTING[one] }); i += 1; }
    else if (/[a-z]/i.test(one)) {
      let j = i;
      while (j < suf.length && /[a-z]/i.test(suf[j])) j++;
      tokens.push({ raw: suf.slice(i, j), kind: "variety", text: "同图变体（齿孔 / 纸质 / 磷光等差异）" });
      i = j;
    } else {
      i += 1;
    }
  }
  return tokens;
}

function parseZihao(z) {
  const m = String(z).match(/^([A-Za-z]+)\s*[:：]?\s*(.+)$/);
  const catalog = m ? m[1] : null;
  const rest = m ? m[2] : String(z);
  const p_catalog_isMi = catalog === "Mi";
  const dm = rest.match(/^(\d+)([A-Za-z]*)$/);
  const num = dm ? dm[1] : null;
  const suf = dm ? dm[2] : rest.replace(/[0-9]/g, "");
  // 仅米歇尔编号按数字+后缀结构解析；Sg:/Col: 等目录格式不同，只显示目录名
  const tokens = p_catalog_isMi ? tokenizeSuffix(suf) : [];
  return { catalog, num, tokens };
}

export default function Zihao({ value, className = "" }) {
  const [pos, setPos] = useState(null);
  const ref = useRef(null);
  if (!value) return null;

  const p = parseZihao(value);
  const catalogText = p.catalog ? CATALOGS[p.catalog] || p.catalog + " 目录" : null;

  const show = () => {
    const r = ref.current.getBoundingClientRect();
    setPos({ left: r.left, bottom: r.bottom });
  };
  const hide = () => setPos(null);

  return (
    <>
      <span
        ref={ref}
        className={"zihao-wrap " + className}
        tabIndex={0}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        aria-label={"志号 " + value + "，悬停查看后缀含义"}
      >
        <span className="zihao-text">{value}</span>
      </span>
      {pos && (
        <span className="zihao-tip" style={{ left: pos.left, top: pos.bottom + 8 }} role="tooltip">
          <span className="zihao-tip-head">{value}</span>
          <span className="zihao-tip-row"><b>目录</b><span>{catalogText || "—"}</span></span>
          {p.num && <span className="zihao-tip-row"><b>编号</b><span>{p.num}</span></span>}
          {p.tokens.length > 0 && <span className="zihao-tip-sec">后缀含义</span>}
          {p.tokens.map((t, i) => (
            <span className="zihao-tip-row" key={i}>
              <b className={"ztag ztag-" + t.kind}>{t.raw}</b>
              <span>{t.text}</span>
            </span>
          ))}
          <span className="zihao-tip-note">
            同图案因发行形态 / 版次 / 变体不同，米歇尔会给出不同后缀编号，并非重复录入。
          </span>
        </span>
      )}
    </>
  );
}
