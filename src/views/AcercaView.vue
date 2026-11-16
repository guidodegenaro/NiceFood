<template>
  <div class="contenedor acerca">
    <section class="intro tarjeta">
      <span class="logo material-symbols-rounded">skillet</span>
      <h1>Acerca de NiceFood</h1>
      <p>
        NiceFood es una aplicación de una sola página (SPA) para guardar, buscar y compartir
        recetas de cocina caseras. Podés crear tus propias recetas, editarlas, calificarlas,
        dejar comentarios y descubrir recetas de todo el mundo gracias a una API pública.
      </p>
    </section>

    <div class="columnas">
      <section class="tarjeta bloque">
        <h2>Integrantes</h2>
        <ul class="lista">
          <li v-for="persona in integrantes" :key="persona">
            <span class="avatar">{{ persona.charAt(0) }}</span> {{ persona }}
          </li>
        </ul>
        <p class="ayuda">Práctica Profesionalizante Desarrollo Web y Mobile · ISEC · Prof. Facundo Romero</p>
      </section>

      <section class="tarjeta bloque">
        <h2>Tecnologías</h2>
        <div class="tecnologias">
          <span v-for="t in tecnologias" :key="t" class="chip chip-verde">{{ t }}</span>
        </div>
      </section>
    </div>

    <section class="tarjeta bloque">
      <h2>Tus datos</h2>
      <p v-if="modoNube">
        Las recetas, calificaciones, comentarios y favoritos se guardan en una base de datos
        <strong>Supabase</strong>, así los ve toda la comunidad. Además se guarda una copia en el
        <strong>LocalStorage</strong> por si te quedás sin conexión. Hay <strong>{{ cantidadRecetas }}</strong> recetas publicadas.
      </p>
      <p v-else>
        Las recetas se guardan en el <strong>LocalStorage</strong> de tu navegador, por eso siguen ahí
        aunque cierres la pestaña. Actualmente tenés <strong>{{ cantidadRecetas }}</strong> recetas guardadas.
      </p>
      <button v-if="!modoNube" class="btn btn-contorno" @click="mostrarModal = true">
        <span class="material-symbols-rounded">restart_alt</span> Restablecer recetas de ejemplo
      </button>
    </section>

    <ConfirmModal
      :visible="mostrarModal"
      titulo="¿Restablecer datos?"
      texto-confirmar="Restablecer"
      @cancelar="mostrarModal = false"
      @confirmar="restablecer"
    >
      Se borrarán las recetas que creaste o modificaste y volverán las {{ cantidadEjemplo }} recetas de ejemplo.
    </ConfirmModal>
  </div>
</template>

<script>
import ConfirmModal from '../components/ConfirmModal.vue'
import { obtenerRecetas, restablecerRecetas, modoNube } from '../services/recetas'
import { recetasIniciales } from '../data/recetasIniciales'

export default {
  name: 'AcercaView',
  components: { ConfirmModal },
  emits: ['notificar'],
  data() {
    return {
      integrantes: ['Guido De Genaro'],
      tecnologias: ['Vue 3', 'Vue CLI', 'Vue Router 4', 'JavaScript', 'CSS (mobile-first)', 'Supabase', 'Google Auth', 'LocalStorage', 'Fetch API', 'TheMealDB', 'GitHub', 'Vercel'],
      modoNube,
      cantidadRecetas: 0,
      cantidadEjemplo: recetasIniciales.length,
      mostrarModal: false
    }
  },
  async mounted() {
    try {
      this.cantidadRecetas = (await obtenerRecetas()).length
    } catch (e) {
      this.cantidadRecetas = 0
    }
  },
  methods: {
    restablecer() {
      this.cantidadRecetas = restablecerRecetas().length
      this.mostrarModal = false
      this.$emit('notificar', { mensaje: 'Se restablecieron las recetas de ejemplo' })
    }
  }
}
</script>

<style scoped>
.acerca {
  display: grid;
  gap: 16px;
  max-width: 900px;
  padding-top: 24px;
}

.intro {
  padding: 28px 20px;
  text-align: center;
  background: var(--verde);
  color: #fff;
  border: none;
}

.intro p {
  max-width: 620px;
  margin: 0 auto;
  opacity: 0.9;
}

.logo {
  display: inline-grid;
  place-items: center;
  width: 60px;
  height: 60px;
  margin-bottom: 12px;
  border-radius: 18px;
  background: var(--mostaza);
  color: var(--verde-oscuro);
  font-size: 34px;
}

.columnas {
  display: grid;
  gap: 16px;
}

.bloque {
  padding: 20px;
}

.bloque h2 {
  font-size: 1.15rem;
}

.lista {
  list-style: none;
  margin: 0 0 12px;
  padding: 0;
  display: grid;
  gap: 10px;
}

.lista li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.avatar {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--terracota-suave);
  color: var(--terracota-oscuro);
}

.tecnologias {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (min-width: 768px) {
  .columnas {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
