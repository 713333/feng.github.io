import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import Playground from "../components/Playground";
import { projects } from "../data/projects";
import { DATASETS } from "../data/datasets";

export default function PlaygroundPage() {
  const [currentId, setCurrentId] = useState<string>("p1");
  const currentProject = projects.find((p) => p.id === currentId);
  const currentDataset = DATASETS[currentId];

  return (
    <div className="container py-10">
      <button
        onClick={() => history.back()}
        className="mb-6 inline-flex items-center gap-2 text-sm text-ink-700 transition hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" />
        返回上一页
      </button>

      <section className="mb-8 overflow-hidden rounded-[32px] border border-ink-100 bg-white p-8 shadow-pop">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber2-500/10 px-3 py-1 text-[11px] font-semibold text-amber2-700">
          <Sparkles className="h-3.5 w-3.5" />
          在线 Python 编辑器
        </div>
        <h1 className="font-serif text-3xl leading-tight text-ink-900 md:text-5xl">
          自由写代码 · 直接看 pandas 运行结果
        </h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-8 text-ink-500">
          用 Pyodide 把 CPython 搬到浏览器里——不需要安装，不需要账号，打开就可以跑。
          切换到不同项目，数据集和示例代码会自动加载；你也可以在编辑器里自由修改实验。
        </p>

        {/* 项目选择器 */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold text-ink-500">切换数据集：</span>
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setCurrentId(p.id)}
              className={
                "rounded-full border px-3 py-1.5 text-xs font-medium transition " +
                (p.id === currentId
                  ? "border-ink-900 bg-ink-900 text-white"
                  : "border-ink-100 bg-white text-ink-700 hover:border-ink-900")
              }
            >
              {p.id.toUpperCase()} · {p.title.slice(0, 18)}
            </button>
          ))}
        </div>

        {/* 当前项目信息 */}
        {currentProject && (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-ink-50/50 px-4 py-3 text-sm text-ink-700">
            <span className="font-semibold text-ink-900">{currentProject.title}</span>
            <span className="text-ink-400">·</span>
            <span className="text-ink-500">{currentDataset?.description}</span>
            <Link
              to={`/projects/${currentProject.id}`}
              className="ml-auto text-xs font-semibold text-amber2-600 hover:text-amber2-700"
            >
              → 打开对应的学习页面
            </Link>
          </div>
        )}
      </section>

      <Playground
        key={currentId}
        title={currentProject?.title || "自由练习"}
        initialCode={currentDataset?.initialCode}
        setupCode={currentDataset?.setupCode}
        height={420}
      />
    </div>
  );
}
