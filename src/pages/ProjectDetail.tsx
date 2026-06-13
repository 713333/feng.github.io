import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, ExternalLink, ListChecks, Star, Sparkles, Terminal } from "lucide-react";
import { getProject } from "../data/projects";
import { DATASETS } from "../data/datasets";
import StepTimeline from "../components/StepTimeline";
import { useAuthStore } from "../store/authStore";
import CodeBlock from "../components/CodeBlock";
import Playground from "../components/Playground";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = getProject(id || "");
  const [activeStepId, setActiveStepId] = useState<string>("");
  const progress = useAuthStore((s) => s.progress[id || ""]);
  const upsertProgress = useAuthStore((s) => s.upsertProgress);
  const [noteText, setNoteText] = useState(progress?.notes ?? "");

  useEffect(() => {
    if (project && !activeStepId) setActiveStepId(project.steps[0].id);
  }, [project, activeStepId]);

  useEffect(() => {
    setNoteText(progress?.notes ?? "");
  }, [progress?.notes]);

  if (!project) {
    return (
      <div className="container py-20 text-center">
        <p className="text-ink-500">项目不存在 · </p>
        <Link to="/projects" className="text-ink-900 underline">
          返回项目列表
        </Link>
      </div>
    );
  }

  const done = progress?.steps_completed?.length ?? 0;
  const total = project.steps.length;
  const percent = Math.round((done / total) * 100);

  function saveNote() {
    upsertProgress({
      project_id: project.id,
      completed: done === total,
      steps_completed: progress?.steps_completed ?? [],
      notes: noteText,
    });
  }

  return (
    <div className="container py-10">
      <button
        onClick={() => navigate("/projects")}
        className="mb-6 inline-flex items-center gap-2 text-sm text-ink-700 transition hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" />
        返回项目列表
      </button>

      {/* 顶部卡片 */}
      <section className="relative overflow-hidden rounded-[32px] border border-ink-100 bg-white p-8 shadow-pop md:p-10">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber2-500/10 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-ink-900 px-3 py-1 text-[11px] font-semibold text-amber-300">
                {project.difficulty}
              </span>
              <span className="rounded-full bg-ink-900/5 px-3 py-1 text-[11px] font-medium text-ink-700">
                {project.category}
              </span>
              {project.techTags.map((t) => (
                <span key={t} className="rounded-full bg-amber-100/70 px-3 py-1 text-[11px] font-medium text-amber-800">
                  #{t}
                </span>
              ))}
            </div>
            <h1 className="font-serif text-3xl leading-tight text-ink-900 md:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 text-[15px] leading-8 text-ink-700">{project.summary}</p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-ink-500">
              <span className="inline-flex items-center gap-2">
                <Download className="h-4 w-4" />
                数据集：
                <a
                  href={project.datasetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink-900 underline decoration-dotted underline-offset-4 hover:text-amber2-600"
                >
                  {project.datasetDesc}
                  <ExternalLink className="ml-1 inline h-3 w-3" />
                </a>
              </span>
              <span className="inline-flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                {total} 个训练步骤
              </span>
              <span className="inline-flex items-center gap-2">
                <Star className="h-4 w-4" />
                预计 2-4 小时可完成
              </span>
            </div>
          </div>

          <div className="min-w-[240px] max-w-sm rounded-3xl border border-ink-100 bg-ink-50/60 p-5">
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-500">
              我的进度
            </div>
            <div className="font-serif text-4xl text-ink-900">{percent}%</div>
            <div className="mt-2 text-xs text-ink-500">
              已完成 {done} / {total} 步
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white">
              <div
                className="h-full bg-gradient-to-r from-amber2-500 to-amber2-600 transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 学习目标 */}
      <section className="mt-8 grid gap-5 md:grid-cols-[1fr_2fr]">
        <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-soft">
          <h3 className="mb-3 font-serif text-xl text-ink-900">🎯 学习目标</h3>
          <ul className="space-y-2 text-sm text-ink-700">
            {project.objective.map((o, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber2-500" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-ink-100 bg-ink-900 p-6 text-ink-50 shadow-pop">
          <h3 className="mb-3 font-serif text-xl text-white">
            💡 建议学习方式
          </h3>
          <ul className="space-y-2 text-sm leading-7 text-ink-100/90">
            <li>1. 先把「数据集」下载到本地，用 Jupyter Notebook 或 VS Code 打开。</li>
            <li>2. 按步骤顺序阅读，把右侧的 Python 代码敲到你的 Notebook 里。</li>
            <li>3. 对「思考题」写出你自己的答案——这比只会复制代码重要 10 倍。</li>
            <li>4. 完成每一步后，点击「标记为已完成」，系统自动同步到你的学习中心。</li>
            <li>5. 最后把你的 Notebook 保存为 PDF 放到 GitHub / 简历作品集中。</li>
          </ul>
        </div>
      </section>

      {/* 步骤时间轴 */}
      <section className="mt-10">
        <h2 className="mb-6 font-serif text-2xl text-ink-900 md:text-3xl">按步骤学习</h2>
        <StepTimeline
          project={project}
          activeStepId={activeStepId || project.steps[0].id}
          onSelect={setActiveStepId}
        />
      </section>

      {/* 在线 Python 编辑器（Pyodide） */}
      <section className="mt-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber2-500/10 px-3 py-1 text-[11px] font-semibold text-amber2-700">
              <Terminal className="h-3.5 w-3.5" />
              直接在浏览器运行 Python
            </div>
            <h2 className="font-serif text-2xl text-ink-900 md:text-3xl">
              在线代码编辑器
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-500">
              用 Pyodide 在浏览器中直接运行 Python + pandas。数据集已按项目预置好，
              无需安装，运行结果直接展示。
            </p>
          </div>
          <Link to="/playground" className="text-xs font-semibold text-ink-500 hover:text-ink-900">
            → 打开独立编辑器 →
          </Link>
        </div>
        <Playground
          initialCode={DATASETS[project.id]?.initialCode}
          setupCode={DATASETS[project.id]?.setupCode}
          title={project.title}
          height={380}
        />
      </section>

      {/* 学习笔记 */}
      <section className="mt-12 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft md:p-8">
        <h2 className="mb-3 font-serif text-2xl text-ink-900">📓 我的学习笔记</h2>
        <p className="mb-4 text-sm text-ink-500">
          记录你的疑问、答案、或者你用真实数据跑出的有趣结论。保存在云端，下次打开还能看到。
        </p>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          rows={6}
          placeholder="例如：我发现工作日的 8 点比 7 点租车需求高 2.3 倍……"
          className="w-full rounded-2xl border border-ink-100 bg-ink-50/50 p-4 text-sm leading-7 text-ink-900 focus:border-ink-900 focus:outline-none"
        />
        <div className="mt-3 flex items-center justify-end gap-2">
          <button onClick={saveNote} className="btn-primary">
            保存笔记
          </button>
        </div>
      </section>

      {/* 小彩蛋：完整代码预览 */}
      <section className="mt-12">
        <details className="group rounded-3xl border border-ink-100 bg-white p-6 shadow-soft md:p-8">
          <summary className="flex cursor-pointer list-none items-center justify-between text-left">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-amber2-600">
                Bonus
              </div>
              <div className="mt-1 font-serif text-2xl text-ink-900">
                🐍 展开查看：把所有步骤串起来的「学习清单」
              </div>
            </div>
            <span className="text-xs text-ink-500 group-open:rotate-180 transition">▾</span>
          </summary>
          <div className="mt-6 space-y-3 text-sm leading-7 text-ink-700">
            <ol className="ml-5 list-decimal space-y-2">
              {project.steps.map((s) => (
                <li key={s.id}>{s.title}</li>
              ))}
            </ol>
            <p className="pt-3 text-xs text-ink-500">
              把整个流程用一个 Jupyter Notebook 完成，你就拥有了一份可以放进简历的作品。
            </p>
            {project.steps[0].codeHint && (
              <div className="pt-4">
                <CodeBlock code={project.steps[0].codeHint} />
              </div>
            )}
          </div>
        </details>
      </section>
    </div>
  );
}
