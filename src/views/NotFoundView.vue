<template>
  <div class="contenedor no-encontrado">
    <span class="numero">404</span>
    <h1>¡Ups! Se nos quemó esta página</h1>
    <p>La dirección <code>{{ $route.fullPath }}</code> no existe.</p>
    <router-link to="/" class="btn btn-primario">
      <span class="material-symbols-rounded">home</span> Volver al inicio
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView'
}
</script>

<style scoped>
.no-encontrado {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
  text-align: center;
}

.numero {
  font-size: 5rem;
  font-weight: 800;
  line-height: 1;
  color: var(--terracota);
}

code {
  padding: 2px 6px;
  border-radius: 6px;
  background: var(--piedra);
  word-break: break-all;
}
</style>
