export default function Tabs({ categories, category, setCategory, zodiacCount }) {
  return (
    <nav className="tabs">
      <div className="tabs-inner">
        <button
          className={"tab-chip" + (category === "all" ? " active" : "")}
          onClick={() => setCategory("all")}
        >
          全部
        </button>
        {categories.map((c) => (
          <button
            key={c}
            className={
              "tab-chip" +
              (c === "生肖" ? " zodiac" : "") +
              (category === c ? " active" : "")
            }
            onClick={() => setCategory(c)}
          >
            {c}
            {c === "生肖" && zodiacCount != null && (
              <span className="tab-count">{zodiacCount}</span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
