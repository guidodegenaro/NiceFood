<template>
  <div class="app-layout">
    <AppHeader :enlaces="enlaces" />

    <main class="contenido">
      <!-- Acá el router "inyecta" la vista de la URL actual, con una transición -->
      <router-view v-slot="{ Component }">
        <transition name="vista" mode="out-in">
          <!-- :key hace que la vista se vuelva a crear al cambiar de URL (ej: de editar a nueva) -->
          <component :is="Component" :key="$route.path" @notificar="mostrarAviso" />
        </transition>
      </router-view>
    </main>

    <AppFooter />
    <BottomNav :enlaces="enlaces" />

    <ToastMessage :mensaje="aviso.mensaje" :tipo="aviso.tipo" @cerrar="cerrarAviso" />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import BottomNav from './components/BottomNav.vue'
import ToastMessage from './components/ToastMessage.vue'

export default {
  name: 'App',
  components: { AppHeader, AppFooter, BottomNav, ToastMessage },
  data() {
    return {
      // Un solo array de enlaces que comparten el menú superior y la barra inferior (props)
      enlaces: [
        { ruta: '/', texto: 'Inicio', icono: 'home' },
        { ruta: '/recetas', texto: 'Recetas', icono: 'menu_book' },
        { ruta: '/recetas/nueva', texto: 'Crear', icono: 'add', destacado: true },
        { ruta: '/explorar', texto: 'Explorar', icono: 'public' },
        { ruta: '/acerca', texto: 'Acerca', icono: 'info' }
      ],
      aviso: { mensaje: '', tipo: 'exito' },
      temporizador: null
    }
  },
  methods: {
    // Las vistas emiten "notificar" y App muestra el aviso flotante
    mostrarAviso({ mensaje, tipo = 'exito' }) {
      this.aviso = { mensaje, tipo }
      clearTimeout(this.temporizador)
      this.temporizador = setTimeout(this.cerrarAviso, 3000)
    },
    cerrarAviso() {
      this.aviso.mensaje = ''
    }
  },
  unmounted() {
    clearTimeout(this.temporizador)
  }
}
</script>

<style>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: 76px; /* espacio para que la barra inferior no tape contenido */
}

.contenido {
  flex: 1;
}

/* Transición entre páginas */
.vista-enter-active,
.vista-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.vista-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.vista-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (min-width: 1024px) {
  .app-layout {
    padding-bottom: 0; /* en escritorio no hay barra inferior */
  }
}
</style>
