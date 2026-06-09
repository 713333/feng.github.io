import { Link } from "react-router-dom";
import { CheckCircle2, Circle, ArrowRight, Tags } from "lucide-react";
import type { Project } from "../data/projects";
import { useAuthStore } from "../store/authStore";

interface Props {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: Props) {
  const user = useAuthStore((s) => s.user);
  const progress = useAuthStore((s) => s.progress[project.id]);
  const total = project.steps.length;
  const done = progress?.steps_completed?.length ?? 0;
  const percent = user && total > 0 ? Math.round((done / total) * 100) : 0;
  const completed = progress?.completed;

  return (
    <Link
      to={user ? `/projects/${project.id}` : "/login"}
      className="group relative block overflow-hidden rounded-3xl border border-ink-100 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-pop animate-fadeUp"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* 背景装饰 */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-40 blur-3xl"
        style={{ background: `hsl(${(index * 37) % 360} 80% 85%)` }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-ink-900/5 px-3 py-1 text-[11px] font-medium text-ink-700">
            {project.difficulty} · {project.category.split(" · ")[0]}
          </div>
          <h3 className="font-serif text-xl leading-snug text-ink-900">
            {project.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">
            {project.summary}
          </p>
        </div>

        <div className="shrink-0 text-right">
          {completed ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              已完成
            </span>
          ) : user && percent > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700">
              <Circle className="h-3.5 w-3.5" />
              {percent}%
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-ink-200 px-3 py-1 text-xs font-medium text-ink-700">
              开始学习
            </span>
          )}
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap gap-1.5">
        {project.techTags.slice(0, 4).map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-full bg-ink-900/5 px-2.5 py-1 text-[11px] font-medium text-ink-700"
          >
            <Tags className="h-3 w-3 opacity-60" />
            {t}
          </span>
        ))}
      </div>

      {user && (
        <div className="relative mt-5 h-1.5 w-full overflow-hidden rounded-full bg-ink-900/5">
          <div
            className="h-full bg-gradient-to-r from-amber2-500 to-amber2-600 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}

      <div className="relative mt-5 flex items-center justify-between text-xs text-ink-700">
        <span className="inline-flex items-center gap-1">
          {project.steps.length} 步训练 · {project.objective.length} 个目标
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-ink-900 transition group-hover:gap-2">
          {user ? "进入学习" : "登录解锁"}
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
