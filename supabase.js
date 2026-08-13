// supabase.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

// En Vercel debes definir las variables como "Environment Variables"
// con prefijo VITE_ o NEXT_PUBLIC_ para que sean accesibles en el navegador.
// Ejemplo: VITE_SUPABASE_URL y VITE_SUPABASE_KEY

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
)
