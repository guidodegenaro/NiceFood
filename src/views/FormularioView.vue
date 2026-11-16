<template>
  <div class="contenedor formulario-vista">
    <header class="encabezado">
      <button class="btn-icono volver" aria-label="Volver" @click="$router.back()">
        <span class="material-symbols-rounded">arrow_back</span>
      </button>
      <div>
        <h1>{{ modoEdicion ? 'Editar receta' : 'Nueva receta' }}</h1>
        <p>{{ modoEdicion ? 'Modificá los datos y guardá los cambios.' : 'Compartí tu receta con la comunidad.' }}</p>
      </div>
    </header>

    <p v-if="cargando" class="tarjeta aviso">Cargando receta...</p>

    <p v-else-if="modoEdicion && !receta" class="tarjeta aviso">
      No encontramos la receta que querés editar.
      <router-link to="/recetas">Volver al listado</router-link>
    </p>

    <p v-else-if="modoEdicion && !esMia" class="tarjeta aviso">
      Solo quien publicó esta receta puede editarla.
      <router-link :to="`/recetas/${receta.id}`">Volver a la receta</router-link>
    </p>

    <!--
      La misma vista sirve para ALTA y EDICIÓN.
      Le pasamos la receta al formulario por props y escuchamos sus eventos.
      :key fuerza a recrear el formulario si cambia la ruta.
    -->
    <RecipeForm
      v-else
      :key="$route.fullPath"
      :receta-inicial="receta"
      :modo-edicion="modoEdicion"
      :guardando="guardando"
      @guardar="guardar"
      @cancelar="$router.back()"
    />
  </div>
</template>

<script>
import RecipeForm from '../components/RecipeForm.vue'
import { obtenerRecetaPorId, crearReceta, actualizarReceta, puedeEditar } from '../services/recetas'
import { sesion } from '../lib/auth'

export default {
  name: 'FormularioView',
  components: { RecipeForm },
  emits: ['notificar'],
  data() {
    return {
      receta: null,
      cargando: false,
      guardando: false
    }
  },
  computed: {
    // Si la URL tiene :id estamos editando; si no, creando
    modoEdicion() {
      return Boolean(this.$route.params.id)
    },
    esMia() {
      return puedeEditar(this.receta)
    }
  },
  async created() {
    if (this.modoEdicion) {
      this.cargando = true
      try {
        this.receta = await obtenerRecetaPorId(this.$route.params.id)
      } finally {
        this.cargando = false
      }
    } else if (sesion.usuario) {
      // Receta nueva con sesión iniciada: completamos el autor con el nombre de la cuenta
      this.receta = { autor: sesion.usuario.nombre }
    }
  },
  methods: {
    async guardar(datos) {
      this.guardando = true
      try {
        let id
        if (this.modoEdicion) {
          await actualizarReceta(this.receta.id, datos)
          id = this.receta.id
          this.$emit('notificar', { mensaje: 'Cambios guardados' })
        } else {
          id = (await crearReceta(datos)).id
          this.$emit('notificar', { mensaje: '¡Receta publicada!' })
        }
        // Navegación programática al detalle de la receta guardada
        this.$router.push({ name: 'Detalle', params: { id } })
      } catch (e) {
        this.$emit('notificar', { mensaje: 'No se pudo guardar: ' + e.message, tipo: 'error' })
      } finally {
        this.guardando = false
      }
    }
  }
}
</script>
<style scoped>
.formulario-vista {
  max-width: 760px;
  padding-top: 24px;
}

.encabezado {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.encabezado h1 {
  margin: 0;
  font-size: 1.6rem;
}

.encabezado p {
  margin: 0;
  color: var(--texto-suave);
}

.volver {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  cursor: pointer;
}

.aviso {
  padding: 20px;
}
</style>
