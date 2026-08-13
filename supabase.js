import { createClient } from '@supabase/supabase-js'

// Las variables de entorno se configuran en Vercel (Project Settings → Environment Variables)
// SUPABASE_URL = https://TU-PROJECT.supabase.co
// SUPABASE_KEY = TU-API-KEY

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)
