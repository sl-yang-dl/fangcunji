import { useEffect } from "react";
import { stampGeometry, stampArtFor } from "../utils.js";
import Guestbook from "./Guestbook.jsx";

function specItems(s) {
  const items = [
    ["志号", s.zihao],
    ["发行日期", s.date],
    ["类别", s.category],
    ["专题", s.theme],
    ["全套枚数", s.total ? s.total + "枚" : ""],
    ["全套面值", s.faceValue],
    ["邮票规格", s.spec],
    ["设计者", s.designer],
    ["印制厂", s.printer],
  ];
  return items.filter((i) => i[1]);
}

export default function StampModal({ stamp, onClose }) {
  // ESC 关闭
  useEffect(() => {
    if (!stamp) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [stamp, onClose]);

  if (!stamp) return null;

  const g = stampGeometry(stamp);
  const modalPicCls = "modal-stamp-pic " + g.type;
  const specs = specItems(stamp)
    .map((i) => (
      <div className="spec" key={i[0]}>
        <div className="spec-label">{i[0]}</div>
        <div className="spec-value">{i[1]}</div>
      </div>
    ));
  const stampsHtml =
    stamp.stamps && stamp.stamps.length ? (
      <div className="modal-section">
        <h3><span className="sec-dot"></span>全套图案</h3>
        <div className="stamp-pieces">
          {stamp.stamps.map((p, idx) => (
            <span className="stamp-piece" key={idx}>{p}</span>
          ))}
        </div>
      </div>
    ) : null;

  return (
    <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-body">
          <div className="modal-hero">
            <div className={modalPicCls} dangerouslySetInnerHTML={{ __html: stampArtFor(stamp) }} />
            <div className="modal-heading">
              <div className="modal-title">{stamp.nameZh || stamp.name}</div>
              {stamp.nameZh && stamp.nameZh !== stamp.name ? (
                <div className="modal-en">{stamp.name}</div>
              ) : null}
              <div className="modal-sub">
                {stamp.theme || ""}
                {stamp.date ? " · " + stamp.date : ""}
              </div>
              {stamp.zihao ? <span className="modal-zihao">{stamp.zihao}</span> : null}
              <div className="modal-specs">{specs}</div>
            </div>
          </div>
          <div className="modal-content">
            {stampsHtml}
            <div className="modal-section">
              <h3><span className="sec-dot"></span>邮票介绍</h3>
              <p>{stamp.intro || "暂无介绍"}</p>
            </div>
            <Guestbook stampName={stamp.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
