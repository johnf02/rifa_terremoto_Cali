import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://TU-PROJECT.supabase.co',
  'TU-API-KEY'
)
