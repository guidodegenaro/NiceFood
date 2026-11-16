<template>
  <!-- Barra de navegación inferior: cómoda para el pulgar en celulares y tablets -->
  <nav class="bottom-nav">
    <router-link
      v-for="enlace in enlaces"
      :key="enlace.ruta"
      :to="enlace.ruta"
      :class="['nav-item', { 'nav-crear': enlace.destacado }]"
    >
      <span class="nav-icono material-symbols-rounded">{{ enlace.icono }}</span>
      <span class="nav-texto">{{ enlace.texto }}</span>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'BottomNav',
  props: {
    enlaces: { type: Array, required: true }
  }
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 66px;
  padding: 0 8px 6px;
  background: var(--superficie);
  border-top: 1px solid var(--borde);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 56px;
  color: var(--texto-suave);
  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
}

.nav-icono {
  display: grid;
  place-items: center;
  width: 48px;
  height: 30px;
  border-radius: 999px;
  transition: background 0.15s;
}

.nav-item.router-link-exact-active {
  color: var(--verde);
}

.nav-item.router-link-exact-active .nav-icono {
  background: var(--verde-suave);
  font-variation-settings: 'FILL' 1;
}

/* Botón central "Crear" que sobresale de la barra */
.nav-crear .nav-icono {
  width: 54px;
  height: 54px;
  margin-top: -26px;
  border-radius: 50%;
  background: var(--terracota);
  color: #fff;
  font-size: 30px;
  box-shadow: var(--sombra-2);
}

.nav-crear.router-link-exact-active .nav-icono {
  background: var(--terracota-oscuro);
}

.nav-crear.router-link-exact-active {
  color: var(--terracota);
}

@media (min-width: 1024px) {
  .bottom-nav {
    display: none;
  }
}
</style>
