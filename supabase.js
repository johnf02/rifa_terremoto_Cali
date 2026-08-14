// supabase.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

// ⚠️ Usa la anon key (clave pública) de Supabase, nunca la service_role
const SUPABASE_URL = "https://unlvsbwpottsnphxudsr.supabase.co/rest/v1/"
const SUPABASE_KEY = "sb_publishable_bxaHosrwORoJkXdZypBgqQ_O0C6DAe9"

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
