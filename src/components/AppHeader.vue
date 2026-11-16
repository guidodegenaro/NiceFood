<template>
  <header class="header">
    <div class="contenedor header-interior">
      <router-link to="/" class="logo" aria-label="Ir al inicio">
        <span class="logo-icono material-symbols-rounded">skillet</span>
        <span>Nice<strong>Food</strong></span>
      </router-link>

      <!-- Menú visible solo en escritorio (en celular se usa BottomNav) -->
      <nav class="menu-escritorio">
        <router-link
          v-for="enlace in enlaces"
          :key="enlace.ruta"
          :to="enlace.ruta"
          :class="['menu-item', { 'menu-crear': enlace.destacado }]"
        >
          <span class="material-symbols-rounded">{{ enlace.icono }}</span>
          {{ enlace.texto }}
        </router-link>
      </nav>

      <!-- Botón de usuario: foto de Google si hay sesión, "Ingresar" si no -->
      <router-link v-if="configurado" to="/ingresar" class="usuario" :aria-label="usuario ? 'Mi cuenta' : 'Ingresar'">
        <img v-if="usuario && usuario.avatar" :src="usuario.avatar" alt="" referrerpolicy="no-referrer" />
        <span v-else-if="usuario" class="inicial">{{ usuario.nombre.charAt(0) }}</span>
        <template v-else>
          <span class="material-symbols-rounded">login</span>
          <span class="usuario-texto">Ingresar</span>
        </template>
      </router-link>
    </div>
  </header>
</template>

<script>
import { sesion } from '../lib/auth'
import { supabaseConfigurado } from '../lib/supabase'

export default {
  name: 'AppHeader',
  props: {
    enlaces: { type: Array, required: true }
  },
  data() {
    return { configurado: supabaseConfigurado }
  },
  computed: {
    usuario() {
      return sesion.usuario
    }
  }
}
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(250, 250, 248, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--borde);
}

.header-interior {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--verde);
  text-decoration: none;
}

.logo strong {
  font-weight: 800;
}

.logo-icono {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--verde);
  color: var(--mostaza);
}

.menu-escritorio {
  display: none;
}

.usuario {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 44px;
  height: 44px;
  margin-left: auto;
  padding: 0 14px;
  border: 1.5px solid var(--borde);
  border-radius: 999px;
  background: var(--superficie);
  color: var(--verde);
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
}

.usuario:has(img),
.usuario:has(.inicial) {
  padding: 0;
  width: 44px;
  overflow: hidden;
}

.usuario img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.inicial {
  font-weight: 700;
  text-transform: uppercase;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  color: var(--texto-suave);
  font-weight: 600;
  font-size: 0.92rem;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}

.menu-item .material-symbols-rounded {
  font-size: 20px;
}

.menu-item:hover {
  color: var(--verde);
  background: var(--verde-suave);
}

/* Vue Router agrega esta clase al enlace de la página actual */
.menu-item.router-link-exact-active {
  color: var(--verde);
  background: var(--verde-suave);
}

.menu-crear,
.menu-crear:hover,
.menu-crear.router-link-exact-active {
  background: var(--terracota);
  color: #fff;
}

@media (min-width: 1024px) {
  .menu-escritorio {
    display: flex;
    gap: 4px;
    margin-left: auto;
  }
  .usuario {
    margin-left: 12px;
  }
  .header-interior {
    height: 72px;
  }
}
</style>
