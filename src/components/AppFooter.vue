<template>
  <footer class="footer">
    <div class="contenedor footer-interior">
      <p class="footer-marca">
        <span class="material-symbols-rounded">skillet</span>
        NiceFood · Recetas de la comunidad
      </p>
      <p class="footer-texto">
        ISEC · Diseño Multimedial · {{ anio }} — Recetas externas por
        <a href="https://www.themealdb.com" target="_blank" rel="noopener">TheMealDB</a>
        · <router-link to="/privacidad">Privacidad</router-link>
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  computed: {
    anio() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
.footer {
  margin-top: 40px;
  padding: 24px 0;
  border-top: 1px solid var(--borde);
  background: var(--piedra);
  font-size: 0.85rem;
  color: var(--texto-suave);
}

.footer-interior {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.footer-interior p {
  margin: 0;
}

.footer-marca {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  color: var(--verde);
}

@media (min-width: 768px) {
  .footer-interior {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
