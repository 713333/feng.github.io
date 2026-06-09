import { Link } from "react-router-dom";
import { BookOpen, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { projects } from "../data/projects";
import { useAuthStore } from "../store/authStore";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const progressMap = useAuthStore((s) => s.progress);

  // 汇总
  let totalSteps = 0;
  let doneSteps = 0;
  let completedProjects = 0;

  const rows = projects.map((p) => {
    const pr = progressMap[p.id];
    const total = p.steps.length;
    const done = pr?.steps_completed?.length ?? 0;
    totalSteps += total;
    doneSteps += done;
    if (pr?.completed) completedProjects += 1;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { project: p, done, total, percent, completed: !!pr?.completed, notes: pr?.notes || "" };
  });

  const inProgress = rows.filter((r) => r.percent > 0 && !r.completed);
  const completed = rows.filter((r) => r.completed);
  const notStarted = rows.filter((r) => r.percent === 0);

  const overall = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;

  return (
    <div className="container py-12">
      {/* 顶部个人信息 */}
      <section className="relative overflow-hidden rounded-[32px] border border-ink-100 bg-ink-900 p-8 text-white shadow-pop md:p-10">
        <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-amber2-500/20 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-[2fr_3fr]">
          <div>
            <div className="text-xs uppercase tracking-widest text-white/60">学习中心</div>
            <h1 className="mt-2 font-serif text-4xl leading-tight md:text-5xl">
              Hi，{user?.email?.split("@")[0] || "同学"} 👋
            </h1>
            <p className="mt-3 text-sm leading-7 text-white/70 md:text-base">
              欢迎回到 PyDataLab。下面是你目前的学习进度与近期笔记。保持节奏——完成 3 个项目即可挑一个放进简历。
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "总进度", value: `${overall}%`, sub: `${doneSteps}/${totalSteps} 步`, color: "text-amber-300" },
              { label: "已完成项目", value: String(completedProjects), sub: `共 ${projects.length} 个`, color: "text-emerald-300" },
              { label: "进行中", value: String(inProgress.length), sub: "加油继续", color: "text-sky-200" },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="text-xs text-white/60">{s.label}</div>
                <div className={`mt-2 font-serif text-4xl ${s.color}`}>{s.value}</div>
                <div className="mt-1 text-[11px] text-white/60">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 进行中的项目 */}
      {inProgress.length > 0 && (
        <section className="mt-10">
          <SectionTitle
            tag="In progress"
            title={`📖 进行中 · ${inProgress.length} 个项目`}
            desc="继续上次没做完的步骤，完成一个再开新的。"
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {inProgress.map((r, i) => (
              <ProgressCard key={r.project.id} {...r} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* 已完成 */}
      {completed.length > 0 && (
        <section className="mt-12">
          <SectionTitle
            tag="Completed"
            title={`✅ 已完成 · ${completed.length} 个项目`}
            desc="这些项目可以作为你的「作品集」放简历里啦。"
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {completed.map((r, i) => (
              <ProgressCard key={r.project.id} {...r} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* 未开始 */}
      {notStarted.length > 0 && (
        <section className="mt-12">
          <SectionTitle
            tag="Not started"
            title={`🗂️ 未开始 · ${notStarted.length} 个项目`}
            desc="按你正在学的主题挑一个开始。"
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {notStarted.map((r, i) => (
              <ProgressCard key={r.project.id} {...r} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* 我的笔记聚合 */}
      <section className="mt-12">
        <SectionTitle tag="Notes" title="📝 我的学习笔记" desc="把你在每个项目里写的笔记汇总到这里，方便回头翻看。" />
        <div className="space-y-4">
          {rows
            .filter((r) => r.notes.trim().length > 0)
            .map((r) => (
              <div
                key={r.project.id}
                className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft"
              >
                <div className="mb-2 flex items-center justify-between">
                  <Link to={`/projects/${r.project.id}`} className="font-serif text-lg text-ink-900 hover:underline">
                    {r.project.title}
                  </Link>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-amber2-600">
                    {r.percent}%
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-7 text-ink-700">{r.notes}</p>
              </div>
            ))}
          {rows.filter((r) => r.notes.trim().length > 0).length === 0 && (
            <div className="rounded-3xl border border-dashed border-ink-200 bg-white py-16 text-center text-sm text-ink-500">
              还没有写过笔记 —— 在项目详情页的「学习笔记」区写下你的第一条吧 ✍️
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ tag, title, desc }: { tag: string; title: string; desc: string }) {
  return (
    <div className="mb-6">
      <div className="text-xs font-semibold uppercase tracking-widest text-amber2-600">{tag}</div>
      <h2 className="mt-2 font-serif text-3xl text-ink-900">{title}</h2>
      <p className="mt-2 text-sm text-ink-500">{desc}</p>
    </div>
  );
}

function ProgressCard({
  project,
  percent,
  done,
  total,
  completed,
  index,
}: {
  project: (typeof projects)[number];
  percent: number;
  done: number;
  total: number;
  completed: boolean;
  index: number;
}) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group block rounded-3xl border border-ink-100 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-pop animate-fadeUp"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="chip">{project.difficulty}</span>
          <h3 className="mt-2 font-serif text-xl leading-snug text-ink-900">{project.title}</h3>
        </div>
        {completed ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" /> 完成
          </span>
        ) : percent === 0 ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-ink-200 px-3 py-1 text-xs font-medium text-ink-700">
            <Clock className="h-3.5 w-3.5" /> 未开始
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/70 px-3 py-1 text-xs font-semibold text-amber-800">
            <BookOpen className="h-3.5 w-3.5" /> {percent}%
          </span>
        )}
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-7 text-ink-500">{project.summary}</p>

      <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-ink-900/5">
        <div
          className="h-full bg-gradient-to-r from-amber2-500 to-amber2-600 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-ink-700">
        <span>
          {done}/{total} 步
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-ink-900 transition group-hover:gap-2">
          {completed ? "查看项目" : percent === 0 ? "开始学习" : "继续学习"}
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
