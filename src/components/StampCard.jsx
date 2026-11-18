import { memo } from "react";
import { stampGeometry, stampArtFor } from "../utils.js";

function StampCard({ stamp, onOpen }) {
  const g = stampGeometry(stamp);
  const cls =
    "stamp-card " + g.type + (g.isSouvenir ? " souvenir" : "");
  const souvTag = g.isSouvenir ? <span className="souvenir-tag">小型张</span> : null;
  const displayName = stamp.nameZh || stamp.name;

  return (
    <div
      className={cls}
      data-id={stamp.id}
      data-ratio={g.ratio.toFixed(3)}
      onClick={() => onOpen(stamp.id)}
    >
      {souvTag}
      <div className="stamp-thumb" dangerouslySetInnerHTML={{ __html: stampArtFor(stamp) }} />
      <div className="stamp-info">
        <div className="stamp-name">{displayName}</div>
        <div className="stamp-meta">
          <span>{stamp.year}年</span>
          <span className="stamp-cat">{stamp.category}</span>
        </div>
        <span className="stamp-zihao">
          {stamp.nameZh && stamp.name !== stamp.nameZh ? stamp.name + " · " : ""}{stamp.zihao || ""}
        </span>
      </div>
    </div>
  );
}

export default memo(StampCard);
