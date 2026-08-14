// supabase.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const SUPABASE_URL = "https://unlvsbwpottsnphxudsr.supabase.co/"
const SUPABASE_KEY = "sb_publishable_bxaHosrwORoJkXdZypBgqQ_O0C6DAe9"

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
