import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { sesion } from '../lib/auth'
import { supabaseConfigurado } from '../lib/supabase'

// Cada ruta asocia una URL con una vista (página).
// Las vistas que no son la de inicio se cargan con "lazy loading":
// el archivo se descarga recién cuando el usuario visita esa página.
const routes = [
  {
    path: '/',
    name: 'Inicio',
    component: HomeView,
    meta: { titulo: 'Inicio' }
  },
  {
    path: '/recetas',
    name: 'Listado',
    component: () => import('../views/RecetasView.vue'),
    meta: { titulo: 'Recetas' }
  },
  {
    // Va ANTES de /recetas/:id, si no "nueva" se tomaría como un id
    path: '/recetas/nueva',
    name: 'Alta',
    component: () => import('../views/FormularioView.vue'),
    meta: { titulo: 'Nueva receta', requiereSesion: true }
  },
  {
    // Ruta dinámica: :id es un parámetro que leemos con this.$route.params.id
    path: '/recetas/:id',
    name: 'Detalle',
    component: () => import('../views/DetalleView.vue'),
    meta: { titulo: 'Receta' }
  },
  {
    path: '/recetas/:id/editar',
    name: 'Edicion',
    component: () => import('../views/FormularioView.vue'),
    meta: { titulo: 'Editar receta', requiereSesion: true }
  },
  {
    path: '/ingresar',
    name: 'Ingresar',
    component: () => import('../views/IngresarView.vue'),
    meta: { titulo: 'Ingresar' }
  },
  {
    path: '/explorar',
    name: 'Explorar',
    component: () => import('../views/ExplorarView.vue'),
    meta: { titulo: 'Explorar el mundo' }
  },
  {
    path: '/acerca',
    name: 'Acerca',
    component: () => import('../views/AcercaView.vue'),
    meta: { titulo: 'Acerca de' }
  },
  {
    // Ruta comodín: cualquier URL que no exista muestra la página 404
    path: '/:pathMatch(.*)*',
    name: 'NoEncontrado',
    component: () => import('../views/NotFoundView.vue'),
    meta: { titulo: 'Página no encontrada' }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  // Al cambiar de página vuelve arriba; con el botón "atrás" recupera la posición
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// Guard global: se ejecuta antes de cada navegación.
// 1) Cambia el título de la pestaña del navegador.
// 2) Si la página necesita usuario (crear/editar) y no hay sesión, manda a /ingresar.
router.beforeEach((to) => {
  document.title = `${to.meta.titulo || 'NiceFood'} · NiceFood`
  if (to.meta.requiereSesion && supabaseConfigurado && !sesion.usuario) {
    return { name: 'Ingresar', query: { volver: to.fullPath } }
  }
})

export default router
