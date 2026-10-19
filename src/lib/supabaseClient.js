import { createClient } from '@supabase/supabase-js'

// Estas variables se configuran en un archivo .env.local (en local) y en
// Vercel -> Settings -> Environment Variables (en producción). Ver .env.example.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    '[RoadTrip Finanzas] Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ' +
      'La app funcionará solo con este navegador (localStorage) hasta que configures Supabase. ' +
      'Consulta el README para el paso a paso.'
  )
}

// Si no hay credenciales configuradas, exportamos null y el resto de la app
// recurre automáticamente al modo local (ver src/utils/storage.js).
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null
