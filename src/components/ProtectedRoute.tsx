import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const init = useAuthStore((s) => s.init);
  const location = useLocation();

  useEffect(() => {
    if (loading) init();
  }, [loading, init]);

  if (loading) {
    return (
      <div className="container grid min-h-[60vh] place-items-center text-sm text-ink-500">
        正在校验登录状态…
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}
