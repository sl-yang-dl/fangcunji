import { useEffect, useMemo, useRef, useState } from "react";
import { groupByMonth } from "../utils.js";
import StampCard from "./StampCard.jsx";

const PAGE_SIZE = 60;

function buildHint({ search, year, category }) {
  let hint = "";
  if (search) hint += "关键词「" + search + "」";
  if (year !== "all") hint += (hint ? " · " : "") + year + "年";
  if (category !== "all") hint += (hint ? " · " : "") + category;
  return hint;
}

export default function StampGrid({
  list,
  view,
  year,
  search,
  category,
  total,
  resultBarVisible,
  onOpen,
}) {
  const hint = useMemo(
    () => buildHint({ search, year, category }),
    [search, year, category]
  );

  // 增量渲染：card 视图下每次显示 PAGE_SIZE 条，滚动加载更多
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef(null);
  const isCardView = view !== "month" && year !== "all" ? view === "card" : view !== "month";

  // 当筛选条件变化时重置加载数量
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, year, category, view]);

  // IntersectionObserver 触底加载
  useEffect(() => {
    if (view === "month") return;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((n) =>
            n < list.length ? n + PAGE_SIZE : n
          );
        }
      },
      { rootMargin: "400px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [list.length, view]);

  const monthGroups = useMemo(
    () => (view === "month" ? groupByMonth(list) : []),
    [view, list]
  );

  if (!resultBarVisible || list.length === 0) {
    return (
      <div className="empty-state" style={{ display: "block" }}>
        <div className="empty-art" aria-hidden="true">空</div>
        <p>未有觅得 · 此间无票</p>
        <p style={{ marginTop: 6, fontSize: 13, opacity: 0.7 }}>
          试试调整筛选条件或更换关键词
        </p>
      </div>
    );
  }

  let hintText;
  if (view === "month") {
    hintText = hint
      ? "当前筛选：" + hint
      : year + " 年 · 按月份分隔";
  } else if (year !== "all") {
    hintText = hint
      ? "当前筛选：" + hint
      : year + " 年 · 卡片视图";
  } else {
    hintText = hint ? "当前筛选：" + hint : "共收录" + total + "枚";
  }

  const visibleList = isCardView ? list.slice(0, visibleCount) : list;
  const hasMore = isCardView && visibleCount < list.length;

  return (
    <>
      <main className="grid-wrap">
        <div className="grid-result-bar">
          <span className="grid-count">
            <b>{list.length}</b> 枚邮票
          </span>
          <span className="grid-hint">{hintText}</span>
        </div>

        {view === "month" ? (
          <div className="grid tl-h">
            {monthGroups.map(([month, stamps]) => (
              <section
                className="tl-month"
                key={month}
                id={"tl-" + year + "-" + month}
              >
                <h3 className="tl-month-title">
                  <span className="m-num">
                    {month}
                    <small>月</small>
                  </span>
                  <span className="m-cnt">
                    本月 <b>{stamps.length}</b> 套
                  </span>
                </h3>
                <div className="tl-grid">
                  {stamps.map((s) => (
                    <StampCard key={s.id} stamp={s} onOpen={onOpen} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <>
            <div className="grid">
              {visibleList.map((s) => (
                <StampCard key={s.id} stamp={s} onOpen={onOpen} />
              ))}
            </div>
            {hasMore && (
              <div className="grid-sentinel" ref={sentinelRef} style={{ height: 40 }}></div>
            )}
            {!hasMore && list.length > PAGE_SIZE && (
              <div className="grid-end" style={{ textAlign: "center", padding: "20px 0", color: "#8a857a", fontSize: 13 }}>
                —— 已全部加载 · 共 {list.length} 枚 ——
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
