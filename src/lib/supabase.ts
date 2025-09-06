import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ Variáveis do Supabase não configuradas corretamente!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
