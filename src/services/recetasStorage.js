// Persistencia con LocalStorage.
// LocalStorage solo guarda TEXTO, por eso convertimos los datos con
// JSON.stringify() al guardar y JSON.parse() al leer.
import { recetasIniciales } from '../data/recetasIniciales'

const CLAVE = 'nicefood_recetas'

// Copia "profunda" para no modificar nunca los datos de ejemplo originales
function copiar(datos) {
  return JSON.parse(JSON.stringify(datos))
}

export function guardarRecetas(recetas) {
  localStorage.setItem(CLAVE, JSON.stringify(recetas))
}

export function obtenerRecetas() {
  const guardadas = localStorage.getItem(CLAVE)

  // Primera vez que se abre la app: cargamos las recetas de ejemplo
  if (!guardadas) {
    const iniciales = copiar(recetasIniciales)
    guardarRecetas(iniciales)
    return iniciales
  }

  try {
    return JSON.parse(guardadas)
  } catch (error) {
    // Si el texto guardado está dañado, volvemos a los datos de ejemplo
    console.error('Error leyendo LocalStorage', error)
    return restablecerRecetas()
  }
}

export function obtenerRecetaPorId(id) {
  return obtenerRecetas().find(r => r.id === Number(id)) || null
}

// CREATE
export function crearReceta(datos) {
  const recetas = obtenerRecetas()
  const nueva = {
    ...datos,
    id: Date.now(), // número único basado en la fecha/hora actual
    fecha: new Date().toISOString(),
    calificaciones: [],
    comentarios: [],
    favorito: false
  }
  recetas.push(nueva)
  guardarRecetas(recetas)
  return nueva
}

// UPDATE
export function actualizarReceta(id, cambios) {
  const recetas = obtenerRecetas()
  const indice = recetas.findIndex(r => r.id === Number(id))
  if (indice === -1) return null
  recetas[indice] = { ...recetas[indice], ...cambios }
  guardarRecetas(recetas)
  return recetas[indice]
}

// DELETE
export function eliminarReceta(id) {
  const recetas = obtenerRecetas().filter(r => r.id !== Number(id))
  guardarRecetas(recetas)
}

export function restablecerRecetas() {
  const iniciales = copiar(recetasIniciales)
  guardarRecetas(iniciales)
  return iniciales
}

// Utilidad compartida: promedio de estrellas de una receta
export function promedioCalificacion(receta) {
  const notas = receta.calificaciones || []
  if (notas.length === 0) return 0
  const suma = notas.reduce((acc, n) => acc + n, 0)
  return Math.round((suma / notas.length) * 10) / 10
}
