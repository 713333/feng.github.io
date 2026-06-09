import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { projects } from "../data/projects";
import ProjectCard from "../components/ProjectCard";

const CATEGORIES = [
  "全部",
  "数据清洗",
  "购物车分析",
  "聚类分析",
  "RFM · 用户分层",
  "时间序列",
  "相关性分析",
  "特征工程",
  "A/B 测试",
  "文本分析",
  "综合",
];

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get("cat") || "全部";
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [cat, setCat] = useState(
    CATEGORIES.includes(initialCat) ? initialCat : "全部"
  );

  // 当 URL 参数变化时（比如从首页跳过来），同步到本地状态
  useEffect(() => {
    const c = searchParams.get("cat") || "全部";
    const q = searchParams.get("q") || "";
    setCat(CATEGORIES.includes(c) ? c : "全部");
    setQuery(q);
  }, [searchParams]);

  function updateParams(partial: Record<string, string>) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(partial).forEach(([k, v]) => {
      if (v === "全部" || v === "") next.delete(k);
      else next.set(k, v);
    });
    setSearchParams(next, { replace: true });
  }

  const filtered = useMemo(() => {
    return projects
      .filter((p) => (cat === "全部" ? true : p.category.includes(cat) || p.techTags.some((t) => t.includes(cat))))
      .filter((p) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.techTags.some((t) => t.toLowerCase().includes(q))
        );
      });
  }, [query, cat]);

  return (
    <div className="container py-12">
      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-widest text-amber2-600">Project catalog</div>
        <h1 className="mt-2 font-serif text-4xl text-ink-900 md:text-5xl">10 个实训项目</h1>
        <p className="mt-3 max-w-2xl text-sm text-ink-500 md:text-base">
          按你熟悉的数据分析技术筛选，或直接搜索关键词。点击项目卡片进入详细学习步骤，完成后记得登录以保存进度。
        </p>
      </div>

      {/* 搜索 + 筛选 */}
      {cat !== "全部" && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-2 text-sm">
          <span className="font-semibold text-amber-800">当前筛选：</span>
          <span className="text-ink-700">「{cat}」</span>
          <button
            onClick={() => {
              setCat("全部");
              updateParams({ cat: "全部" });
            }}
            className="ml-2 text-xs font-semibold text-amber-800 underline underline-offset-4 hover:text-ink-900"
          >
            清除筛选
          </button>
        </div>
      )}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              updateParams({ q: e.target.value });
            }}
            placeholder="搜索项目、关键词、技术栈…"
            className="w-full rounded-full border border-ink-100 bg-white py-3 pl-11 pr-5 text-sm shadow-soft focus:border-ink-900 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-ink-500" />
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCat(c);
                updateParams({ cat: c });
              }}
              className={[
                "rounded-full px-3 py-1.5 text-xs font-medium transition",
                cat === c
                  ? "bg-ink-900 text-white shadow-soft"
                  : "border border-ink-100 bg-white text-ink-700 hover:border-ink-900",
              ].join(" ")}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-ink-200 bg-white py-20 text-center text-sm text-ink-500">
          没有匹配的项目 · 试试换个关键词 🪄
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
