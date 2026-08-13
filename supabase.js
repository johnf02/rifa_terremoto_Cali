// supabase.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

// ⚠️ Usa la anon key (clave pública) de Supabase, nunca la service_role
const SUPABASE_URL = "https://TU-PROJECT.supabase.co"
const SUPABASE_KEY = "TU-ANON-KEY"

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
