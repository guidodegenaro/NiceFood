// Cliente de Supabase (base de datos + autenticación en la nube).
// Los datos de conexión vienen de variables de entorno (.env.local o Vercel),
// así la URL y la clave no quedan escritas dentro del código.
import { createClient } from '@supabase/supabase-js'

const url = process.env.VUE_APP_SUPABASE_URL
const clave = process.env.VUE_APP_SUPABASE_ANON_KEY

// Si todavía no se configuró Supabase, la app sigue funcionando solo con LocalStorage
export const supabaseConfigurado = Boolean(url && clave && !url.includes('TU-PROYECTO'))

export const supabase = supabaseConfigurado ? createClient(url, clave) : null
