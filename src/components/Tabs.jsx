export default function Tabs({ categories, category, setCategory }) {
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
            className={"tab-chip" + (category === c ? " active" : "")}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
    </nav>
  );
}
