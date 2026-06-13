import { Link, NavLink } from "react-router-dom";
import { GraduationCap, BookOpen, BarChart3, UserCircle2, LogOut } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="group flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ink-900 text-amber-300 shadow-soft transition-transform group-hover:-rotate-6">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-lg text-ink-900">PyDataLab</span>
            <span className="text-[11px] uppercase tracking-widest text-ink-500">大学生 pandas 实训平台</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={navClass}>首页</NavLink>
          <NavLink to="/learning-path" className={navClass}>学习路径</NavLink>
          <NavLink to="/projects" className={navClass}>所有项目</NavLink>
          <NavLink to="/playground" className={navClass}>在线代码</NavLink>
          {user && <NavLink to="/dashboard" className={navClass}>学习中心</NavLink>}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden items-center gap-2 rounded-full bg-ink-900/5 px-3 py-1.5 text-xs text-ink-700 md:inline-flex">
                <UserCircle2 className="h-4 w-4" />
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-4 py-2 text-xs font-medium text-ink-700 transition hover:border-ink-900 hover:text-ink-900"
              >
                <LogOut className="h-4 w-4" />
                退出
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-full bg-amber2-500 px-4 py-2 text-xs font-semibold text-ink-900 shadow-soft transition hover:-translate-y-0.5 hover:bg-amber2-600 hover:text-white"
            >
              <BookOpen className="h-4 w-4" />
              登录 / 注册
            </Link>
          )}
        </div>
      </div>
      {user && (
        <div className="flex items-center gap-1 border-t border-ink-100 bg-ink-50/50 px-4 py-2 text-xs md:hidden">
          <NavLink to="/" end className={navClassMobile}>首页</NavLink>
          <NavLink to="/learning-path" className={navClassMobile}>路径</NavLink>
          <NavLink to="/projects" className={navClassMobile}>项目</NavLink>
          <NavLink to="/playground" className={navClassMobile}>代码</NavLink>
          <NavLink to="/dashboard" className={navClassMobile}>我的</NavLink>
        </div>
      )}
      {!user && (
        <div className="flex items-center gap-1 border-t border-ink-100 bg-ink-50/50 px-4 py-2 text-xs md:hidden">
          <NavLink to="/" end className={navClassMobile}>首页</NavLink>
          <NavLink to="/learning-path" className={navClassMobile}>路径</NavLink>
          <NavLink to="/projects" className={navClassMobile}>项目</NavLink>
          <NavLink to="/playground" className={navClassMobile}>代码</NavLink>
          <NavLink to="/login" className={navClassMobile}>登录</NavLink>
        </div>
      )}
    </header>
  );
}

function navClass({ isActive }: { isActive: boolean }) {
  return [
    "rounded-full px-4 py-2 text-sm font-medium transition",
    isActive ? "bg-ink-900 text-white shadow-soft" : "text-ink-700 hover:bg-ink-900/5",
  ].join(" ");
}
function navClassMobile({ isActive }: { isActive: boolean }) {
  return [
    "rounded-full px-3 py-1 text-xs font-medium transition",
    isActive ? "bg-ink-900 text-white" : "text-ink-700",
  ].join(" ");
}

// 保留 BarChart3 引用（避免 lint 警告），后续可在 hero 区复用
export { BarChart3 };
