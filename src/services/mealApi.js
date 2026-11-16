// Consumo de API externa con Fetch.
// TheMealDB es una API pública y gratuita de recetas: https://www.themealdb.com/api.php
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

// La API devuelve los ingredientes en 20 campos separados
// (strIngredient1, strMeasure1, ...). Los juntamos en un array prolijo.
function adaptarReceta(meal) {
  const ingredientes = []
  for (let i = 1; i <= 20; i++) {
    const nombre = meal['strIngredient' + i]
    const medida = meal['strMeasure' + i]
    if (nombre && nombre.trim()) {
      ingredientes.push(`${(medida || '').trim()} ${nombre.trim()}`.trim())
    }
  }

  const pasos = (meal.strInstructions || '')
    .split(/\r?\n/)
    .map(p => p.replace(/^(step\s*)?\d+[.):]?\s*/i, '').trim())
    .filter(p => p.length > 5)

  return {
    idApi: meal.idMeal,
    titulo: meal.strMeal,
    categoriaApi: meal.strCategory,
    origen: meal.strArea,
    imagen: meal.strMealThumb,
    ingredientes,
    pasos
  }
}

async function pedir(ruta) {
  const respuesta = await fetch(BASE_URL + ruta)
  if (!respuesta.ok) {
    throw new Error(`La API respondió con el código ${respuesta.status}`)
  }
  const datos = await respuesta.json()
  return (datos.meals || []).map(adaptarReceta)
}

// Buscar recetas por nombre (en inglés: "chicken", "cake", "pasta"...)
export function buscarRecetasApi(termino) {
  return pedir('/search.php?s=' + encodeURIComponent(termino))
}

// Una receta al azar
export async function recetaAleatoriaApi() {
  const lista = await pedir('/random.php')
  return lista[0]
}

// Pasar una categoría de TheMealDB a las categorías de NiceFood
export function convertirCategoria(categoriaApi) {
  const mapa = {
    Breakfast: 'Desayunos',
    Pasta: 'Pastas',
    Dessert: 'Postres',
    Vegetarian: 'Veggie',
    Vegan: 'Veggie'
  }
  return mapa[categoriaApi] || 'Platos principales'
}
