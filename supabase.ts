// Impor Supabase Client
import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Variabel lingkungan NEXT_PUBLIC_SUPABASE_URL atau NEXT_PUBLIC_SUPABASE_ANON_KEY tidak terdefinisi.");
}

// Inisialisasi Supabase Client dengan URL dan kunci anonim Anda
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default supabase;
