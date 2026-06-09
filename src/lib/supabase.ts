import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// 当环境变量缺失时也能继续运行（游客模式 + 本地 mock），避免项目构建/开发时直接崩溃
export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)
  : null;

export interface UserProgress {
  id?: string;
  user_id: string;
  project_id: string;
  completed: boolean;
  steps_completed: string[];
  notes: string;
  updated_at?: string;
}
