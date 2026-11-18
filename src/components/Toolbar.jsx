export default function Toolbar({
  search,
  setSearch,
  year,
  onYearChange,
  years,
  category,
  setCategory,
  categories,
  view,
  setView,
  onReset,
}) {
  const showViewSwitch = year !== "all";
  const effectiveView = showViewSwitch ? view : "card";

  return (
    <div className="toolbar">
      <div className="toolbar-inner">
        <div className="search-box">
          <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索邮票名称 / 志号 / 年代..."
          />
          <button
            className={"search-clear" + (search ? " show" : "")}
            aria-label="清空搜索"
            onClick={() => setSearch("")}
          >
            ×
          </button>
        </div>

        <div className="filter-group">
          <label className="filter-label">年代</label>
          <select
            className="filter-select"
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
          >
            <option value="all">全部年代</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>{y}年</option>
            ))}
          </select>

          <label className="filter-label">类别</label>
          <select
            className="filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">全部类别</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button className="filter-btn ghost" onClick={onReset}>重置</button>

          {showViewSwitch && (
            <div className="view-switch">
              <button
                className={"view-btn" + (effectiveView === "card" ? " active" : "")}
                data-view="card"
                onClick={() => setView("card")}
              >
                卡片
              </button>
              <button
                className={"view-btn" + (effectiveView === "month" ? " active" : "")}
                data-view="month"
                onClick={() => setView("month")}
              >
                月份横轴
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
