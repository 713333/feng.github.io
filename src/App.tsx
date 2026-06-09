import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import LearningPath from "@/pages/LearningPath";
import { useAuthStore } from "@/store/authStore";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Shell>
              <Home />
            </Shell>
          }
        />
        <Route
          path="/learning-path"
          element={
            <Shell>
              <LearningPath />
            </Shell>
          }
        />
        <Route
          path="/projects"
          element={
            <Shell>
              <Projects />
            </Shell>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <Shell>
              <ProtectedRoute>
                <ProjectDetail />
              </ProtectedRoute>
            </Shell>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Shell>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Shell>
          }
        />
        <Route
          path="/login"
          element={
            <Shell>
              <Login />
            </Shell>
          }
        />
        <Route
          path="*"
          element={
            <Shell>
              <div className="container grid min-h-[60vh] place-items-center text-center">
                <div>
                  <div className="font-serif text-4xl text-ink-900">404</div>
                  <p className="mt-3 text-sm text-ink-500">页面不存在 · 请检查 URL</p>
                </div>
              </div>
            </Shell>
          }
        />
      </Routes>
    </Router>
  );
}
