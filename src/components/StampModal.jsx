import { useEffect } from "react";
import { stampGeometry, stampArtFor } from "../utils.js";
import { STAMP_NOTES } from "../data/notes.js";
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

  // 合并 issue 里提取的深度资料（原图 + 说明等）
  const note = STAMP_NOTES[stamp.id];
  const s = note ? { ...stamp, image: note.image ?? stamp.image } : stamp;

  const g = stampGeometry(s);
  const modalPicCls = "modal-stamp-pic " + g.type;
  const specs = specItems(s)
    .map((i) => (
      <div className="spec" key={i[0]}>
        <div className="spec-label">{i[0]}</div>
        <div className="spec-value">{i[1]}</div>
      </div>
    ));
  const stampsHtml =
    s.stamps && s.stamps.length ? (
      <div className="modal-section">
        <h3><span className="sec-dot"></span>全套图案</h3>
        <div className="stamp-pieces">
          {s.stamps.map((p, idx) => (
            <span className="stamp-piece" key={idx}>{p}</span>
          ))}
        </div>
      </div>
    ) : null;

  const noteSections = note ? (
    <>
      {note.story && note.story.length ? (
        <div className="modal-section">
          <h3><span className="sec-dot"></span>邮票说明</h3>
          {note.story.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      ) : null}
      {note.publish && note.publish.length ? (
        <div className="modal-section">
          <h3><span className="sec-dot"></span>出版信息</h3>
          <dl className="note-publish">
            {note.publish.map(([k, v], i) => (
              <div className="note-publish-row" key={i}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        </div>
      ) : null}
      {note.anecdote && note.anecdote.length ? (
        <div className="modal-section">
          <h3><span className="sec-dot"></span>背后故事</h3>
          {note.anecdote.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      ) : null}
      {note.knowledge && note.knowledge.length ? (
        <div className="modal-section">
          <h3><span className="sec-dot"></span>相关知识</h3>
          {note.knowledge.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      ) : null}
    </>
  ) : null;

  return (
    <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-body">
          <div className="modal-hero">
            <div className={modalPicCls} dangerouslySetInnerHTML={{ __html: stampArtFor(s) }} />
            <div className="modal-heading">
              <div className="modal-title">{s.nameZh || s.name}</div>
              {s.nameZh && s.nameZh !== s.name ? (
                <div className="modal-en">{s.name}</div>
              ) : null}
              <div className="modal-sub">
                {s.theme || ""}
                {s.date ? " · " + s.date : ""}
              </div>
              {s.zihao ? <span className="modal-zihao">{s.zihao}</span> : null}
              <div className="modal-specs">{specs}</div>
            </div>
          </div>
          <div className="modal-content">
            {stampsHtml}
            <div className="modal-section">
              <h3><span className="sec-dot"></span>邮票介绍</h3>
              <p>{s.intro || "暂无介绍"}</p>
            </div>
            {noteSections}
            <Guestbook stampName={s.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
