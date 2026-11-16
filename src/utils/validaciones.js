// Validaciones personalizadas reutilizables.
// Cada función devuelve un MENSAJE DE ERROR (string) o '' si el valor es válido.

export function requerido(valor, campo) {
  const vacio = valor === null || valor === undefined || String(valor).trim() === ''
  return vacio ? `Falta completar ${campo.toLowerCase()}.` : ''
}

export function longitudMinima(valor, minimo, campo) {
  return String(valor || '').trim().length < minimo
    ? `${campo} debe tener al menos ${minimo} caracteres.`
    : ''
}

export function longitudMaxima(valor, maximo, campo) {
  return String(valor || '').trim().length > maximo
    ? `${campo} no puede superar los ${maximo} caracteres.`
    : ''
}

export function numeroEnRango(valor, minimo, maximo, campo) {
  const numero = Number(valor)
  if (!Number.isInteger(numero)) return `${campo} debe ser un número entero.`
  if (numero < minimo || numero > maximo) return `${campo} debe estar entre ${minimo} y ${maximo}.`
  return ''
}

// Formato: solo letras (con acentos y ñ) y espacios
export function soloLetras(valor, campo) {
  return /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(String(valor).trim())
    ? ''
    : `${campo} solo puede contener letras y espacios.`
}

// Formato: dirección web que empiece con http:// o https://
export function urlValida(valor, campo) {
  return /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(String(valor).trim())
    ? ''
    : `${campo} debe ser una URL válida (que empiece con http:// o https://).`
}

export function listaMinima(lista, minimo, campo) {
  return lista.length < minimo ? `Agregá al menos ${minimo} ${campo}.` : ''
}

// Ejecuta varias reglas en orden y devuelve el primer error que encuentre
export function primerError(...resultados) {
  return resultados.find(mensaje => mensaje !== '') || ''
}
