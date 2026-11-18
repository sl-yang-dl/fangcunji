import { useMemo, useState } from "react";
import STAMP_DATA from "./data.js";
import Header from "./components/Header.jsx";
import Toolbar from "./components/Toolbar.jsx";
import Tabs from "./components/Tabs.jsx";
import StampGrid from "./components/StampGrid.jsx";
import StampModal from "./components/StampModal.jsx";

export default function App() {
  // 筛选状态
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");
  const [category, setCategory] = useState("all"); // 顶部标签 + 下拉：按"类别"过滤
  const [view, setView] = useState("card"); // 仅选中年份生效：card / month
  // 弹窗
  const [activeId, setActiveId] = useState(null);

  // 派生数据：类别（Colnect 专题过多且为英文，顶部标签改为按"类别"分组）
  const categories = useMemo(() => {
    const map = {};
    STAMP_DATA.forEach((s) => {
      map[s.category] = (map[s.category] || 0) + 1;
    });
    return Object.keys(map).sort();
  }, []);

  const years = useMemo(() => {
    const set = {};
    STAMP_DATA.forEach((s) => {
      set[s.year] = true;
    });
    return Object.keys(set)
      .map(Number)
      .sort((a, b) => a - b);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return STAMP_DATA.filter((s) => {
      if (year !== "all" && String(s.year) !== year) return false;
      if (category !== "all" && s.category !== category) return false;
      if (q) {
        const hay = (
          s.name + " " + (s.zihao || "") + " " + (s.theme || "") + " " + (s.intro || "")
        ).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }, [search, year, category]);

  const activeStamp = activeId
    ? STAMP_DATA.find((s) => s.id === activeId) || null
    : null;

  const handleYearChange = (val) => {
    setYear(val);
    if (val === "all") setView("card");
  };

  const handleReset = () => {
    setSearch("");
    setYear("all");
    setCategory("all");
    setView("card");
  };

  const resultBarVisible = filtered.length > 0;

  return (
    <>
      <Header total={STAMP_DATA.length} />
      <Toolbar
        search={search}
        setSearch={setSearch}
        year={year}
        onYearChange={handleYearChange}
        years={years}
        category={category}
        setCategory={setCategory}
        categories={categories}
        view={view}
        setView={setView}
        onReset={handleReset}
      />
      <Tabs categories={categories} category={category} setCategory={setCategory} />
      <StampGrid
        list={filtered}
        view={year !== "all" ? view : "card"}
        year={year}
        search={search}
        category={category}
        total={STAMP_DATA.length}
        resultBarVisible={resultBarVisible}
        onOpen={setActiveId}
      />
      <StampModal stamp={activeStamp} onClose={() => setActiveId(null)} />
    </>
  );
}
