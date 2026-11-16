// Servicio de recetas: es lo ÚNICO que usan las vistas para leer y guardar datos.
//
// - Si Supabase está configurado ("modo nube"): los datos se guardan en la base de datos
//   de Supabase y además se copian en LocalStorage como caché (por si se corta internet).
// - Si no está configurado ("modo local"): todo se guarda solo en LocalStorage.
//
// Todas las funciones son async porque hablar con un servidor lleva tiempo.
import { supabase, supabaseConfigurado } from '../lib/supabase'
import { sesion } from '../lib/auth'
import * as local from './recetasStorage'

export { promedioCalificacion } from './recetasStorage'
export const modoNube = supabaseConfigurado

const CLAVE_CACHE = 'nicefood_cache'

// Pedimos cada receta junto con sus calificaciones, comentarios y favoritos (relaciones)
const CONSULTA = `
  *,
  calificaciones ( usuario_id, estrellas ),
  comentarios ( id, autor, texto, creado_en ),
  favoritos ( usuario_id )
`

// Base de datos (snake_case) → app (camelCase)
function desdeFila(fila) {
  const miId = sesion.usuario && sesion.usuario.id
  const calificaciones = fila.calificaciones || []
  const miCalificacion = calificaciones.find(c => miId && c.usuario_id === miId)
  return {
    id: fila.id,
    usuarioId: fila.usuario_id,
    titulo: fila.titulo,
    descripcion: fila.descripcion,
    categoria: fila.categoria,
    dificultad: fila.dificultad,
    tiempo: fila.tiempo,
    porciones: fila.porciones,
    imagen: fila.imagen,
    autor: fila.autor,
    ingredientes: fila.ingredientes || [],
    pasos: fila.pasos || [],
    idApi: fila.id_api,
    fecha: fila.creado_en,
    calificaciones: calificaciones.map(c => c.estrellas),
    miVoto: miCalificacion ? miCalificacion.estrellas : 0,
    comentarios: (fila.comentarios || []).map(c => ({ id: c.id, autor: c.autor, texto: c.texto, fecha: c.creado_en })),
    favorito: Boolean(miId && (fila.favoritos || []).some(f => f.usuario_id === miId))
  }
}

// App → base de datos (solo los campos que se editan en el formulario)
function haciaFila(datos) {
  return {
    titulo: datos.titulo,
    descripcion: datos.descripcion,
    categoria: datos.categoria,
    dificultad: datos.dificultad,
    tiempo: datos.tiempo,
    porciones: datos.porciones,
    imagen: datos.imagen,
    autor: datos.autor,
    ingredientes: datos.ingredientes,
    pasos: datos.pasos,
    id_api: datos.idApi || null
  }
}

function exigirSesion(accion) {
  if (!sesion.usuario) throw new Error(`Iniciá sesión para ${accion}.`)
}

function comprobar({ data, error }) {
  if (error) throw new Error(error.message)
  return data
}

// ¿El usuario actual puede editar/eliminar esta receta?
export function puedeEditar(receta) {
  if (!modoNube) return true
  return Boolean(sesion.usuario && receta.usuarioId === sesion.usuario.id)
}

// ---------- READ ----------
export async function obtenerRecetas() {
  if (!modoNube) return local.obtenerRecetas()
  try {
    const filas = comprobar(await supabase.from('recetas').select(CONSULTA).order('creado_en', { ascending: false }))
    const recetas = filas.map(desdeFila)
    localStorage.setItem(CLAVE_CACHE, JSON.stringify(recetas))
    return recetas
  } catch (error) {
    // Sin conexión: mostramos la última copia guardada en LocalStorage
    const cache = localStorage.getItem(CLAVE_CACHE)
    if (cache) return JSON.parse(cache)
    throw error
  }
}

export async function obtenerRecetaPorId(id) {
  if (!modoNube) return local.obtenerRecetaPorId(id)
  const fila = comprobar(await supabase.from('recetas').select(CONSULTA).eq('id', id).maybeSingle())
  return fila ? desdeFila(fila) : null
}

// ---------- CREATE ----------
export async function crearReceta(datos) {
  if (!modoNube) return local.crearReceta(datos)
  exigirSesion('publicar recetas')
  const fila = comprobar(await supabase
    .from('recetas')
    .insert({ ...haciaFila(datos), usuario_id: sesion.usuario.id })
    .select(CONSULTA)
    .single())
  return desdeFila(fila)
}

// ---------- UPDATE ----------
export async function actualizarReceta(id, datos) {
  if (!modoNube) return local.actualizarReceta(id, datos)
  exigirSesion('editar recetas')
  comprobar(await supabase.from('recetas').update(haciaFila(datos)).eq('id', id))
}

// ---------- DELETE ----------
export async function eliminarReceta(id) {
  if (!modoNube) return local.eliminarReceta(id)
  exigirSesion('eliminar recetas')
  comprobar(await supabase.from('recetas').delete().eq('id', id))
}

// ---------- Interacciones de la comunidad ----------
// "receta" ya viene con el valor nuevo de favorito
export async function guardarFavorito(receta) {
  if (!modoNube) return local.actualizarReceta(receta.id, { favorito: receta.favorito })
  exigirSesion('guardar favoritas')
  const tabla = supabase.from('favoritos')
  if (receta.favorito) {
    comprobar(await tabla.insert({ receta_id: receta.id, usuario_id: sesion.usuario.id }))
  } else {
    comprobar(await tabla.delete().eq('receta_id', receta.id).eq('usuario_id', sesion.usuario.id))
  }
}

// "receta.calificaciones" ya viene actualizado con el voto nuevo
export async function calificarReceta(receta, estrellas) {
  if (!modoNube) return local.actualizarReceta(receta.id, { calificaciones: receta.calificaciones })
  exigirSesion('calificar')
  // upsert: si el usuario ya votó, reemplaza su voto (1 voto por persona)
  comprobar(await supabase
    .from('calificaciones')
    .upsert({ receta_id: receta.id, usuario_id: sesion.usuario.id, estrellas }, { onConflict: 'receta_id,usuario_id' }))
}

export async function agregarComentario(receta, { autor, texto }) {
  if (!modoNube) {
    const comentario = { id: Date.now(), autor, texto, fecha: new Date().toISOString() }
    local.actualizarReceta(receta.id, { comentarios: [...receta.comentarios, comentario] })
    return comentario
  }
  exigirSesion('comentar')
  const fila = comprobar(await supabase
    .from('comentarios')
    .insert({ receta_id: receta.id, usuario_id: sesion.usuario.id, autor, texto })
    .select()
    .single())
  return { id: fila.id, autor: fila.autor, texto: fila.texto, fecha: fila.creado_en }
}

// Solo en modo local: vuelve a las recetas de ejemplo
export function restablecerRecetas() {
  return local.restablecerRecetas()
}
