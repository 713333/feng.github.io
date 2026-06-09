import { Link } from "react-router-dom";
import { ArrowRight, BookOpenCheck, Target, Clock, Sparkles } from "lucide-react";
import { projects } from "../data/projects";

interface Stage {
  title: string;
  subtitle: string;
  weeks: string;
  ids: string[];
  color: string;
  accent: string;
}

const STAGES: Stage[] = [
  {
    title: "阶段一 · 基础技能",
    subtitle: "掌握 pandas 核心：清洗、聚合、切片、类型矫正",
    weeks: "约 2 周",
    ids: ["p1", "p7"],
    color: "from-amber-100 to-amber-50",
    accent: "text-amber-700",
  },
  {
    title: "阶段二 · 业务分析",
    subtitle: "把数据变成业务结论：购物车漏斗、RFM、时序基线、实验分析",
    weeks: "约 3 周",
    ids: ["p2", "p4", "p5", "p8"],
    color: "from-sky-100 to-sky-50",
    accent: "text-sky-700",
  },
  {
    title: "阶段三 · 聚类与画像",
    subtitle: "聚类分析 + 相关性解读，产出「用户画像」",
    weeks: "约 2 周",
    ids: ["p3", "p6"],
    color: "from-violet-100 to-violet-50",
    accent: "text-violet-700",
  },
  {
    title: "阶段四 · 文本与综合",
    subtitle: "词频统计、文本情感直觉，最后用一个综合项目收尾",
    weeks: "约 2 周",
    ids: ["p9", "p10"],
    color: "from-emerald-100 to-emerald-50",
    accent: "text-emerald-700",
  },
];

export default function LearningPath() {
  const projectById = Object.fromEntries(projects.map((p) => [p.id, p]));

  return (
    <div className="container py-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] border border-ink-100 bg-white p-8 shadow-pop md:p-12">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber2-500/20 blur-3xl" />
        <div className="relative max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-ink-900/5 px-4 py-1.5 text-xs font-semibold text-ink-700">
            <Sparkles className="h-3.5 w-3.5 text-amber2-600" />
            学习路径 · 免费 · 全开放
          </div>
          <h1 className="font-serif text-4xl leading-tight text-ink-900 md:text-5xl">
            用 4 个阶段、10 个项目，
            <br />
            把你从「会 pandas」带到「能做数据分析」。
          </h1>
          <p className="mt-4 text-sm leading-8 text-ink-500 md:text-base">
            这是一条为在校大学生定制的实战路径。你不需要掌握所有高级库——
            扎实地完成 10 个项目，就能把「数据分析」写入简历。
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: <Clock className="h-4 w-4" />, v: "9 周", label: "推荐学习周期" },
              { icon: <Target className="h-4 w-4" />, v: "10 个", label: "完整项目" },
              { icon: <BookOpenCheck className="h-4 w-4" />, v: "50+", label: "训练步骤" },
            ].map((m, i) => (
              <div
                key={i}
                className="rounded-2xl border border-ink-100 bg-ink-50/40 p-4"
              >
                <div className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-ink-500">
                  {m.icon}
                  {m.label}
                </div>
                <div className="font-serif text-2xl text-ink-900">{m.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 四个阶段 */}
      <section className="mt-10 space-y-6">
        {STAGES.map((stage, idx) => {
          const stageProjects = stage.ids
            .map((id) => projectById[id])
            .filter(Boolean);

          return (
            <div
              key={stage.title}
              className={`relative overflow-hidden rounded-3xl border border-ink-100 bg-gradient-to-br ${stage.color} p-6 shadow-soft md:p-8`}
            >
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className={`text-xs font-semibold uppercase tracking-widest ${stage.accent}`}>
                    STAGE 0{idx + 1} · {stage.weeks}
                  </div>
                  <h2 className="mt-1 font-serif text-2xl text-ink-900 md:text-3xl">{stage.title}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-700">
                    {stage.subtitle}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {stageProjects.map((p, i) => (
                  <Link
                    key={p.id}
                    to={`/projects/${p.id}`}
                    className="group rounded-2xl border border-ink-100 bg-white/80 p-5 transition hover:-translate-y-0.5 hover:shadow-pop"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-ink-900/5 px-3 py-1 text-[11px] font-semibold text-ink-700">
                        {p.difficulty} · {p.category.split(" · ")[0]}
                      </span>
                      <span className="text-[11px] font-semibold text-ink-500">
                        项目 {String(projects.indexOf(p) + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg text-ink-900">{p.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-7 text-ink-500">{p.summary}</p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-ink-900 transition group-hover:gap-2">
                      开始学习 <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                    <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-ink-900/5">
                      <div
                        className="h-full bg-gradient-to-r from-amber2-500 to-amber2-600"
                        style={{ width: `${(i + 1) * 25}%` }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* CTA */}
      <section className="mt-12 overflow-hidden rounded-[32px] bg-ink-900 p-8 text-white shadow-pop md:p-12">
        <div className="relative grid items-center gap-6 md:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="font-serif text-3xl leading-tight md:text-4xl">
              准备好了吗？
              <br />
              从阶段一的第一个项目开始吧。
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/70 md:text-base">
              点击下面的按钮，直接进入「超市销售数据清洗与探索」。这是所有后续分析的基础。
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <Link to="/projects/p1" className="btn-primary">
              进入项目一 · 数据清洗
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/projects" className="text-sm text-white/70 transition hover:text-white">
              先查看全部项目 →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
