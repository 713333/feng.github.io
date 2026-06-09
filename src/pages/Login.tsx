import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { isSupabaseConfigured } from "../lib/supabase";

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const signIn = useAuthStore((s) => s.signIn);
  const signUp = useAuthStore((s) => s.signUp);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/dashboard";

  if (user) {
    return (
      <div className="container grid min-h-[70vh] place-items-center">
        <div className="rounded-3xl border border-ink-100 bg-white p-10 text-center shadow-soft">
          <h2 className="font-serif text-3xl text-ink-900">你已经登录啦 🎉</h2>
          <p className="mt-3 text-sm text-ink-500">邮箱：{user.email}</p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/dashboard" className="btn-primary">
              进入学习中心 <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/projects" className="btn-ghost">
              浏览所有项目
            </Link>
          </div>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (password.length < 6) {
        setError("密码至少 6 位。");
        setBusy(false);
        return;
      }
      const err = mode === "login" ? await signIn(email, password) : await signUp(email, password);
      if (err) {
        setError(err);
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError("登录失败，请稍后再试。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container grid min-h-[80vh] place-items-center py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-ink-100 bg-white shadow-pop md:grid-cols-2">
        {/* 左侧装饰 */}
        <div className="relative hidden overflow-hidden bg-ink-900 p-10 text-white md:block">
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-amber2-500/30 blur-3xl" />
          <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              PyDataLab
            </div>
            <h1 className="mt-6 font-serif text-4xl leading-tight">
              用 10 个真实项目，
              <br />
              把 pandas 练到能用。
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/70">
              登录后自动保存你的学习进度与笔记，下次打开直接从上次停下的地方继续。
            </p>
            <div className="mt-10 space-y-4 text-sm text-white/80">
              {[
                { t: "免费使用", d: "所有项目、所有代码完全免费。" },
                { t: "进度保存", d: "每一步的完成情况都自动同步。" },
                { t: "作品导向", d: "完成的 Notebook 可以直接放简历。" },
              ].map((x, i) => (
                <div key={i} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber2-500 text-[11px] font-bold text-ink-900">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-white">{x.t}</div>
                    <div className="text-xs text-white/60">{x.d}</div>
                  </div>
                </div>
              ))}
            </div>
            {!isSupabaseConfigured && (
              <p className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4 text-[11px] leading-6 text-white/60">
                ⚙️ 当前使用本地 mock 登录（任意邮箱密码即可）。
                配置 Supabase 后，进度将保存到云端数据库。详见项目 README。
              </p>
            )}
          </div>
        </div>

        {/* 右侧表单 */}
        <div className="p-8 md:p-12">
          <div className="mb-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-amber2-600">
              {mode === "login" ? "Welcome back" : "Create account"}
            </div>
            <h2 className="mt-2 font-serif text-3xl text-ink-900">
              {mode === "login" ? "登录你的账户" : "创建一个免费账户"}
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              用邮箱和密码即可完成，无需任何其他信息。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs font-semibold text-ink-700">邮箱</span>
              <div className="mt-1 flex items-center rounded-full border border-ink-100 bg-white px-4 py-3 shadow-soft focus-within:border-ink-900">
                <Mail className="h-4 w-4 text-ink-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@school.edu.cn"
                  className="ml-3 w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-500/60"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-ink-700">密码</span>
              <div className="mt-1 flex items-center rounded-full border border-ink-100 bg-white px-4 py-3 shadow-soft focus-within:border-ink-900">
                <Lock className="h-4 w-4 text-ink-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少 6 位"
                  className="ml-3 w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-500/60"
                />
              </div>
            </label>

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                {error}
              </div>
            )}

            <button type="submit" disabled={busy} className="btn-primary w-full justify-center">
              {busy ? "请稍候…" : mode === "login" ? "登录" : "创建账户并继续"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-500">
            <button
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError(null);
              }}
              className="font-semibold text-ink-900 underline decoration-dotted underline-offset-4 hover:text-amber2-600"
            >
              {mode === "login" ? "还没有账户？创建一个 →" : "已经有账户？去登录 →"}
            </button>
            <Link to="/" className="hover:text-ink-900">
              ← 回到首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
