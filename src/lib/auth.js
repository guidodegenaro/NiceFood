// Manejo de usuarios: inicio de sesión con Google a través de Supabase Auth.
// "sesion" es un objeto reactivo: cualquier componente que lo use se actualiza
// solo cuando el usuario entra o sale.
import { reactive } from 'vue'
import { supabase, supabaseConfigurado } from './supabase'

export const sesion = reactive({
  usuario: null, // { id, nombre, email, avatar } o null si no hay sesión
  cargando: supabaseConfigurado
})

function adaptarUsuario(user) {
  if (!user) return null
  const datos = user.user_metadata || {}
  return {
    id: user.id,
    email: user.email,
    nombre: datos.full_name || datos.name || user.email,
    avatar: datos.avatar_url || datos.picture || ''
  }
}

// Se llama una sola vez al iniciar la app (main.js)
export async function iniciarAuth() {
  if (!supabaseConfigurado) return
  const { data } = await supabase.auth.getSession()
  sesion.usuario = adaptarUsuario(data.session && data.session.user)
  sesion.cargando = false

  // Escucha los cambios: login, logout, renovación del token...
  supabase.auth.onAuthStateChange((evento, nuevaSesion) => {
    sesion.usuario = adaptarUsuario(nuevaSesion && nuevaSesion.user)
  })
}

export async function ingresarConGoogle(volverA = '/') {
  // Redirige a la pantalla de Google; al terminar vuelve a nuestra app
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + volverA }
  })
  if (error) throw error
}

export async function cerrarSesion() {
  await supabase.auth.signOut()
  sesion.usuario = null
}
