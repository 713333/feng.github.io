import { CheckCircle2, Circle, HelpCircle } from "lucide-react";
import type { Project, ProjectStep } from "../data/projects";
import CodeBlock from "./CodeBlock";
import { useAuthStore } from "../store/authStore";

interface Props {
  project: Project;
  activeStepId: string;
  onSelect: (id: string) => void;
}

export default function StepTimeline({ project, activeStepId, onSelect }: Props) {
  const user = useAuthStore((s) => s.user);
  const progress = useAuthStore((s) => s.progress[project.id]);
  const upsertProgress = useAuthStore((s) => s.upsertProgress);

  const completedIds = progress?.steps_completed ?? [];
  const activeIdx = Math.max(
    0,
    project.steps.findIndex((s) => s.id === activeStepId)
  );
  const activeStep: ProjectStep = project.steps[activeIdx];

  function toggleStep(stepId: string) {
    if (!user) return;
    let next = [...completedIds];
    if (next.includes(stepId)) {
      next = next.filter((x) => x !== stepId);
    } else {
      next.push(stepId);
    }
    upsertProgress({
      project_id: project.id,
      completed: next.length === project.steps.length,
      steps_completed: next,
      notes: progress?.notes ?? "",
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      {/* 左侧步骤列表 */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl border border-ink-100 bg-white p-4 shadow-soft">
          <div className="mb-3 flex items-center justify-between px-2">
            <span className="text-xs uppercase tracking-widest text-ink-500">学习步骤</span>
            <span className="text-[11px] font-semibold text-ink-900">
              {completedIds.length}/{project.steps.length}
            </span>
          </div>
          <ol className="space-y-1">
            {project.steps.map((s, i) => {
              const active = s.id === activeStepId;
              const done = completedIds.includes(s.id);
              return (
                <li key={s.id}>
                  <button
                    onClick={() => onSelect(s.id)}
                    className={[
                      "flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left text-sm transition",
                      active ? "bg-ink-900 text-white shadow-soft" : "text-ink-700 hover:bg-ink-900/5",
                    ].join(" ")}
                  >
                    <span className="mt-0.5">
                      {active ? (
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-amber2-500 text-[11px] font-bold text-ink-900">
                          {i + 1}
                        </span>
                      ) : done ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Circle className="h-5 w-5 opacity-60" />
                      )}
                    </span>
                    <span className="leading-snug">{s.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-4 border-t border-ink-100 pt-4 text-[11px] text-ink-500">
            💡 完成本步后勾选左侧圆圈，系统会自动同步到你的学习中心。
          </div>
        </div>
      </aside>

      {/* 右侧内容 */}
      <section className="min-w-0">
        <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-soft md:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-ink-900/5 px-3 py-1 font-semibold text-ink-900">
              步骤 {activeIdx + 1} / {project.steps.length}
            </span>
            <span className="rounded-full bg-amber-100/70 px-3 py-1 font-semibold text-amber-800">
              {project.difficulty}
            </span>
            {completedIds.includes(activeStep.id) && (
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-600">
                ✅ 已完成
              </span>
            )}
          </div>
          <h2 className="font-serif text-2xl leading-tight text-ink-900 md:text-3xl">
            {activeStep.title}
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-ink-700">
            {activeStep.description}
          </p>

          {activeStep.codeHint && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-700">
                🐍 参考代码
              </h3>
              <CodeBlock code={activeStep.codeHint} />
            </div>
          )}

          {activeStep.question && (
            <div className="mt-8 rounded-2xl border border-amber2-500/30 bg-amber-50 p-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-800">
                <HelpCircle className="h-4 w-4" />
                思考题 · 请在你的 Jupyter Notebook 中写下答案
              </div>
              <p className="text-[14px] leading-7 text-amber-900">{activeStep.question}</p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-ink-100 pt-6">
            <button
              onClick={() => toggleStep(activeStep.id)}
              className={[
                "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition",
                completedIds.includes(activeStep.id)
                  ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20"
                  : "bg-ink-900 text-white shadow-soft hover:-translate-y-0.5 hover:bg-ink-700",
              ].join(" ")}
            >
              {completedIds.includes(activeStep.id) ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> 本步已完成（点我撤销）
                </>
              ) : (
                <>
                  <Circle className="h-4 w-4" /> 标记为已完成
                </>
              )}
            </button>
            <div className="flex gap-2 text-xs text-ink-500">
              <button
                onClick={() => onSelect(project.steps[Math.max(0, activeIdx - 1)].id)}
                disabled={activeIdx === 0}
                className="rounded-full border border-ink-200 px-4 py-2 text-xs font-medium text-ink-700 transition hover:border-ink-900 disabled:opacity-40"
              >
                ← 上一步
              </button>
              <button
                onClick={() =>
                  onSelect(project.steps[Math.min(project.steps.length - 1, activeIdx + 1)].id)
                }
                disabled={activeIdx === project.steps.length - 1}
                className="rounded-full bg-amber2-500 px-4 py-2 text-xs font-semibold text-ink-900 transition hover:bg-amber2-600 hover:text-white disabled:opacity-40"
              >
                下一步 →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
