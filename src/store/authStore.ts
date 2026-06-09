import { create } from "zustand";
import { supabase, type UserProgress } from "../lib/supabase";

interface AuthState {
  user: { id: string; email: string } | null;
  loading: boolean;
  progress: Record<string, UserProgress>;
  init: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  syncProgress: () => Promise<void>;
  upsertProgress: (p: Omit<UserProgress, "user_id" | "updated_at">) => Promise<void>;
}

// 本地 localStorage mock key（未配置 Supabase 时使用）
const LOCAL_USER_KEY = "py4da.local.user";
const LOCAL_PROGRESS_KEY = "py4da.local.progress";

function readLocalUser(): { id: string; email: string } | null {
  try {
    const raw = localStorage.getItem(LOCAL_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function readLocalProgress(): Record<string, UserProgress> {
  try {
    const raw = localStorage.getItem(LOCAL_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  progress: {},

  init: async () => {
    if (supabase) {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user ?? null;
      if (sessionUser) {
        set({ user: { id: sessionUser.id, email: sessionUser.email || "" } });
        await get().syncProgress();
      }
      // 监听状态变化
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          set({ user: { id: session.user.id, email: session.user.email || "" } });
          get().syncProgress();
        } else {
          set({ user: null, progress: {} });
        }
      });
    } else {
      const u = readLocalUser();
      if (u) {
        set({ user: u, progress: readLocalProgress() });
      }
    }
    set({ loading: false });
  },

  signIn: async (email, password) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return error.message;
      if (data.user) {
        set({ user: { id: data.user.id, email: data.user.email || "" } });
        await get().syncProgress();
        return null;
      }
      return "登录失败，请检查账号密码";
    }
    // 本地 mock：任何邮箱/密码均可登录（仅演示用途）
    const user = { id: "local-" + email.slice(0, 6), email };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    set({ user, progress: readLocalProgress() });
    return null;
  },

  signUp: async (email, password) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return error.message;
      if (data.user) {
        set({ user: { id: data.user.id, email: data.user.email || "" } });
        return null;
      }
      return "注册失败";
    }
    const user = { id: "local-" + email.slice(0, 6), email };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    set({ user, progress: {} });
    return null;
  },

  signOut: async () => {
    if (supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
    set({ user: null, progress: {} });
  },

  syncProgress: async () => {
    const { user } = get();
    if (!user) return;
    if (supabase) {
      const { data, error } = await supabase
        .from("user_progress")
        .select("project_id, completed, steps_completed, notes");
      if (!error && data) {
        const map: Record<string, UserProgress> = {};
        for (const row of data) {
          map[row.project_id] = {
            user_id: user.id,
            project_id: row.project_id,
            completed: row.completed,
            steps_completed: Array.isArray(row.steps_completed) ? (row.steps_completed as string[]) : [],
            notes: row.notes || "",
          };
        }
        set({ progress: map });
      }
    }
  },

  upsertProgress: async (payload) => {
    const { user } = get();
    if (!user) return;
    const record: UserProgress = {
      user_id: user.id,
      project_id: payload.project_id,
      completed: payload.completed,
      steps_completed: payload.steps_completed,
      notes: payload.notes,
    };
    const next = { ...get().progress, [payload.project_id]: record };
    set({ progress: next });

    if (supabase) {
      await supabase.from("user_progress").upsert(
        {
          user_id: user.id,
          project_id: payload.project_id,
          completed: record.completed,
          steps_completed: record.steps_completed,
          notes: record.notes,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id, project_id" }
      );
    } else {
      localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(next));
    }
  },
}));
