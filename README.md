# NiceFood 🍳

SPA (Single Page Application) mobile-first de recetas de cocina, hecha con **Vue 3 + Vue CLI**.

Práctica Profesionalizante Desarrollo Web y Mobile · ISEC · Prof. Facundo Romero

## Integrantes

- _Integrante 1_ (completar)
- _Integrante 2_ (completar)

## Descripción

NiceFood es un **gestor de recetas** de la comunidad. Permite crear, ver, editar y eliminar recetas;
buscarlas por nombre, ingrediente o autor; filtrarlas por categoría; ordenarlas; marcarlas como favoritas;
calificarlas con estrellas y dejar comentarios. Además incluye una sección **Explorar** que consume la API
pública [TheMealDB](https://www.themealdb.com/api.php) para descubrir recetas del mundo e importarlas al recetario.

Todos los datos se guardan en el **LocalStorage** del navegador, así que persisten al cerrar la pestaña.

## Tecnologías utilizadas

- Vue 3 (Options API) y Single File Components (`.vue`)
- Vue CLI 5
- Vue Router 4
- JavaScript (ES6+), HTML5, CSS3 (mobile-first, Grid y Flexbox)
- Supabase (PostgreSQL + Auth) con login de Google
- LocalStorage (caché y modo sin conexión)
- GitHub + Vercel
- Fetch API + TheMealDB
- Google Fonts (Plus Jakarta Sans) y Material Symbols

## Supabase

Configuración paso a paso (proyecto, SQL, Google, variables, GitHub y Vercel) en
[PASOS_SUPABASE_VERCEL.md](PASOS_SUPABASE_VERCEL.md). Sin `.env.local` la app funciona en modo local.

## Instalación

Requisitos: [Node.js](https://nodejs.org) 18 o superior.

```bash
npm install        # instala las dependencias
npm run serve      # servidor de desarrollo en http://localhost:8080
npm run build      # genera la versión de producción en /dist
```

### Despliegue en Vercel

1. Subir el proyecto a un repositorio de GitHub.
2. En Vercel: _Add New → Project_ → elegir el repositorio.
3. Framework: **Vue.js** · Build command: `npm run build` · Output: `dist`.
4. El archivo `vercel.json` redirige todas las rutas a `index.html` para que Vue Router funcione al recargar.

## Funcionalidades implementadas

| Requisito | Dónde está |
|---|---|
| CRUD completo | `RecetasView`, `DetalleView`, `FormularioView` + `services/recetasStorage.js` |
| +15 elementos | 17 recetas de ejemplo en `data/recetasIniciales.js` |
| Buscador por texto | `SearchBar.vue` (busca en nombre, descripción, autor e ingredientes) |
| Filtro por categoría | `CategoryFilter.vue` |
| Ordenamiento | Recientes, nombre A-Z, menor tiempo, mejor calificadas |
| Vue Router | Inicio, Listado, Detalle (`/recetas/:id`), Alta/Edición, Explorar, Acerca, 404 |
| Formularios con v-model | `RecipeForm.vue`, comentarios en `DetalleView.vue` |
| Validaciones personalizadas | `utils/validaciones.js`: obligatorios, longitud mín./máx., URL, solo letras, rangos numéricos |
| Base de datos y usuarios | Supabase: `lib/supabase.js`, `lib/auth.js`, `services/recetas.js`, `supabase/schema.sql` |
| Login con Google | `views/IngresarView.vue` + guard en `router/index.js` |
| LocalStorage | `services/recetasStorage.js` (modo local y caché) |
| Fetch a API | `services/mealApi.js` → `ExplorarView.vue` |
| Componentes reutilizables (11) | AppHeader, BottomNav, AppFooter, RecipeCard, ApiRecipeCard, SearchBar, CategoryFilter, RecipeForm, ConfirmModal, RatingStars, ToastMessage |
| Props y emits | En todos los componentes (ver guía) |
| Computed | `recetasFiltradas`, `mejorCalificadas`, `recientes`, `cantidadPorCategoria`, `promedio`, `cantidadErrores`… |
| Ciclo de vida | `created()` (leer LocalStorage), `mounted()` (pedir a la API), `unmounted()` (limpiar timer) |
| Responsive | 1 columna en celular, 2 en tablet, 3 en escritorio; barra inferior en mobile y menú superior en escritorio |
| Animaciones | `<transition>` entre páginas, modal y aviso; `<transition-group>` en tarjetas, ingredientes, pasos y comentarios |

## Capturas de pantalla

_Agregar capturas en una carpeta `capturas/` (celular, tablet y escritorio)._

## Estructura

```
src/
├── assets/main.css          # estilos globales y variables de color
├── components/              # componentes reutilizables
├── views/                   # páginas completas (una por ruta)
├── router/index.js          # configuración de Vue Router
├── services/                # LocalStorage y API (lógica de datos)
├── data/recetasIniciales.js # 17 recetas de ejemplo
├── utils/validaciones.js    # funciones de validación
├── App.vue                  # componente raíz (layout)
└── main.js                  # punto de entrada
```
