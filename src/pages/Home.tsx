import { Link } from "react-router-dom";
import { Sparkles, LineChart, Users, Target, BookOpen, ArrowRight } from "lucide-react";
import { projects } from "../data/projects";
import ProjectCard from "../components/ProjectCard";
import { useAuthStore } from "../store/authStore";

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const featured = projects.slice(0, 3);

  return (
    <div className="container">
      {/* HERO */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
        {/* 背景装饰：几个彩色圆 */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-amber2-500/20 blur-3xl" />
          <div className="absolute top-40 left-0 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl text-center animate-fadeUp">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink-100 bg-white px-4 py-1.5 text-xs font-semibold text-ink-700 shadow-soft">
            <Sparkles className="h-3.5 w-3.5 text-amber2-500" />
            面向大学生 · 免费 · 10 个真实业务场景 · 永久保存学习记录
          </div>
          <h1 className="font-serif text-4xl leading-[1.15] text-ink-900 md:text-6xl">
            用 <span className="rounded-xl bg-ink-900 px-3 py-1 text-amber2-500">pandas</span> 解决真实问题，
            <br className="hidden md:block" />
            不再只会写 <span className="italic text-ink-500">"Hello World"</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-8 text-ink-500 md:text-lg">
            从超市销售、电商购物车、学生成绩聚类，到 A/B 测试与共享单车综合分析——
            把你在课堂上学到的 DataFrame / groupby / merge 用到真实业务上，用一个完整项目作为简历中的作品。
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/learning-path" className="btn-primary">
              <BookOpen className="h-4 w-4" />
              查看完整学习路径
            </Link>
            <Link to="/projects" className="btn-ghost">
              <ArrowRight className="h-4 w-4" />
              浏览课程项目
            </Link>
          </div>

          {/* 关键指标 */}
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { k: "10", v: "完整项目", icon: <Target className="h-4 w-4" />, to: "/projects" },
              { k: "50+", v: "训练步骤", icon: <Sparkles className="h-4 w-4" />, to: "/projects" },
              { k: "5", v: "分析技术栈", icon: <LineChart className="h-4 w-4" />, to: "/projects" },
              { k: "∞", v: "作品可直接放简历", icon: <Users className="h-4 w-4" />, to: "/projects" },
            ].map((m, i) => (
              <Link
                key={i}
                to={m.to}
                className="rounded-2xl border border-ink-100 bg-white/70 p-4 shadow-soft backdrop-blur transition hover:-translate-y-1 hover:border-ink-900 hover:shadow-pop animate-fadeUp"
                style={{ animationDelay: `${i * 80 + 200}ms` }}
              >
                <div className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-ink-500">
                  {m.icon}
                  {m.v}
                </div>
                <div className="font-serif text-2xl text-ink-900">{m.k}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 为什么选我们 */}
      <section className="py-10">
        <div className="mb-8 text-center">
          <h2 className="font-serif text-3xl text-ink-900 md:text-4xl">项目驱动，而不是堆砌知识点</h2>
          <p className="mt-3 text-sm text-ink-500 md:text-base">
            每个项目都对应一门你在学校听过的数据分析技术，并给出「可以直接跑的代码」。
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "数据清洗与预处理",
              desc: "缺失值、重复值、异常值、类型矫正——在 3 个项目中反复训练，形成肌肉记忆。",
              tag: "P1 · P7 · P10",
              cat: "数据清洗",
              color: "from-amber-100 to-amber-50",
            },
            {
              title: "购物车分析与漏斗",
              desc: "用真实订单数据练习「加购→下单→支付」漏斗计算，输出运营可以直接用的数字。",
              tag: "P2",
              cat: "购物车分析",
              color: "from-blue-100 to-blue-50",
            },
            {
              title: "聚类与用户分层",
              desc: "K-Means + 特征标准化 + 可视化解读，学会给用户画像打标签。",
              tag: "P3 · P4 · P10",
              cat: "聚类分析",
              color: "from-violet-100 to-violet-50",
            },
            {
              title: "时间序列与预测基础",
              desc: "移动平均、指数加权、同比环比——在销售数据上完成从清洗到预测基线的全流程。",
              tag: "P5",
              cat: "时间序列",
              color: "from-emerald-100 to-emerald-50",
            },
            {
              title: "A/B 测试与统计直觉",
              desc: "卡方检验 + 置信区间 + 辛普森悖论的切片分析，避免被总体指标误导。",
              tag: "P8",
              cat: "A/B 测试",
              color: "from-rose-100 to-rose-50",
            },
            {
              title: "文本与推荐基础",
              desc: "词频统计、停用词过滤、相关性分析——用 MovieLens / 电商评论做推荐与 NLP 入门。",
              tag: "P6 · P9",
              cat: "文本分析",
              color: "from-sky-100 to-sky-50",
            },
          ].map((c, i) => (
            <Link
              key={i}
              to={`/projects?cat=${encodeURIComponent(c.cat)}`}
              className={`group rounded-3xl border border-ink-100 bg-gradient-to-br ${c.color} p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-pop animate-fadeUp`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="mb-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-ink-700">
                {c.tag}
              </div>
              <h3 className="font-serif text-xl text-ink-900">{c.title}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-700">{c.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-ink-900 transition group-hover:gap-2">
                浏览相关项目 <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 精选项目 */}
      <section id="projects" className="py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-amber2-600">
              Featured projects
            </div>
            <h2 className="mt-2 font-serif text-3xl text-ink-900 md:text-4xl">
              立即开始的 3 个入门项目
            </h2>
          </div>
          <Link to="/projects" className="btn-ghost">
            查看全部 10 个项目 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="relative overflow-hidden rounded-[32px] bg-ink-900 px-8 py-12 text-white shadow-pop md:px-16 md:py-20">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber2-500/30 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-serif text-3xl leading-tight md:text-4xl">
                登录即可保存学习记录，
                <br />
                下次继续从上次停下的地方开始
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/70 md:text-base">
                所有项目永久免费 · 支持邮箱注册 · 进度保存在云端（或本地 mock）
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <Link to={user ? "/dashboard" : "/login"} className="btn-primary">
                {user ? "进入我的学习中心" : "免费注册 / 登录"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/projects" className="text-sm text-white/70 transition hover:text-white">
                或者先看看所有项目 →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
