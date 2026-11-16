<template>
  <div class="contenedor listado">
    <header class="encabezado">
      <h1>Recetas</h1>
      <p>Buscá por nombre, ingrediente o autor.</p>
    </header>

    <div class="controles">
      <!-- v-model sobre componentes propios (SearchBar y CategoryFilter) -->
      <SearchBar v-model="busqueda" />
      <CategoryFilter v-model="categoria" :categorias="categorias" />

      <div class="barra">
        <p class="resultados">
          <strong>{{ recetasFiltradas.length }}</strong>
          {{ recetasFiltradas.length === 1 ? 'receta encontrada' : 'recetas encontradas' }}
        </p>
        <div class="barra-derecha">
          <label class="solo-favoritas">
            <input v-model="soloFavoritas" type="checkbox" />
            <span class="material-symbols-rounded">bookmark</span> Favoritas
          </label>
          <select v-model="orden" class="input orden" aria-label="Ordenar por">
            <option value="recientes">Más recientes</option>
            <option value="nombre">Nombre (A-Z)</option>
            <option value="tiempo">Menor tiempo</option>
            <option value="calificacion">Mejor calificadas</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="cargando" class="vacio">
      <span class="material-symbols-rounded">hourglass_top</span>
      <p>Cargando recetas...</p>
    </div>

    <!-- transition-group anima las tarjetas al filtrar, ordenar o eliminar -->
    <transition-group v-else-if="recetasFiltradas.length" name="tarjetas" tag="div" class="grilla">
      <RecipeCard
        v-for="receta in recetasFiltradas"
        :key="receta.id"
        :receta="receta"
        @favorito="alternarFavorito"
        @eliminar="pedirConfirmacion"
      />
    </transition-group>

    <div v-else class="vacio tarjeta">
      <span class="material-symbols-rounded">search_off</span>
      <h3>No encontramos recetas</h3>
      <p>Probá con otra palabra o cambiá la categoría.</p>
      <button class="btn btn-contorno" @click="limpiarFiltros">Limpiar filtros</button>
    </div>

    <ConfirmModal
      :visible="recetaAEliminar !== null"
      titulo="¿Eliminar receta?"
      @cancelar="recetaAEliminar = null"
      @confirmar="confirmarEliminacion"
    >
      Vas a eliminar <strong>{{ recetaAEliminar && recetaAEliminar.titulo }}</strong>. Esta acción no se puede deshacer.
    </ConfirmModal>
  </div>
</template>

<script>
import SearchBar from '../components/SearchBar.vue'
import CategoryFilter from '../components/CategoryFilter.vue'
import RecipeCard from '../components/RecipeCard.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import { CATEGORIAS } from '../data/recetasIniciales'
import { obtenerRecetas, guardarFavorito, eliminarReceta, promedioCalificacion } from '../services/recetas'

// Quita acentos y pasa a minúsculas para que "limón" y "limon" coincidan
function normalizar(texto) {
  return String(texto).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export default {
  name: 'RecetasView',
  components: { SearchBar, CategoryFilter, RecipeCard, ConfirmModal },
  emits: ['notificar'],
  data() {
    return {
      recetas: [],
      categorias: CATEGORIAS,
      busqueda: '',
      categoria: 'Todas',
      orden: 'recientes',
      soloFavoritas: false,
      recetaAEliminar: null,
      cargando: true
    }
  },
  computed: {
    // Propiedad computada principal: filtra y ordena.
    // Se recalcula sola cuando cambia la búsqueda, la categoría, el orden o las recetas.
    recetasFiltradas() {
      const texto = normalizar(this.busqueda.trim())

      const filtradas = this.recetas.filter(r => {
        const coincideTexto = !texto || normalizar(
          [r.titulo, r.descripcion, r.autor, ...r.ingredientes].join(' ')
        ).includes(texto)
        const coincideCategoria = this.categoria === 'Todas' || r.categoria === this.categoria
        const coincideFavorito = !this.soloFavoritas || r.favorito
        return coincideTexto && coincideCategoria && coincideFavorito
      })

      const criterios = {
        recientes: (a, b) => new Date(b.fecha) - new Date(a.fecha),
        nombre: (a, b) => a.titulo.localeCompare(b.titulo),
        tiempo: (a, b) => a.tiempo - b.tiempo,
        calificacion: (a, b) => promedioCalificacion(b) - promedioCalificacion(a)
      }
      return filtradas.sort(criterios[this.orden])
    }
  },
  watch: {
    // Mantenemos los filtros en la URL (?q=...&categoria=...) para poder compartirla
    busqueda() { this.actualizarUrl() },
    categoria() { this.actualizarUrl() },
    orden() { this.actualizarUrl() }
  },
  async created() {
    // Leemos los filtros que vengan en la URL (query params) y después pedimos las recetas
    const { q, categoria, orden } = this.$route.query
    if (q) this.busqueda = q
    if (categoria && CATEGORIAS.includes(categoria)) this.categoria = categoria
    if (orden) this.orden = orden
    try {
      this.recetas = await obtenerRecetas()
    } catch (e) {
      this.$emit('notificar', { mensaje: 'No se pudieron cargar las recetas', tipo: 'error' })
    } finally {
      this.cargando = false
    }
  },
  methods: {
    actualizarUrl() {
      const query = {}
      if (this.busqueda) query.q = this.busqueda
      if (this.categoria !== 'Todas') query.categoria = this.categoria
      if (this.orden !== 'recientes') query.orden = this.orden
      // replace: no llena el historial con cada letra que se escribe
      this.$router.replace({ query })
    },
    async alternarFavorito(id) {
      const receta = this.recetas.find(r => r.id === id)
      receta.favorito = !receta.favorito
      try {
        await guardarFavorito(receta)
        this.$emit('notificar', {
          mensaje: receta.favorito ? 'Guardada en favoritas' : 'Quitada de favoritas',
          tipo: 'info'
        })
      } catch (e) {
        receta.favorito = !receta.favorito // deshacemos el cambio
        this.$emit('notificar', { mensaje: e.message, tipo: 'error' })
      }
    },
    pedirConfirmacion(receta) {
      this.recetaAEliminar = receta
    },
    async confirmarEliminacion() {
      const receta = this.recetaAEliminar
      this.recetaAEliminar = null
      try {
        await eliminarReceta(receta.id)
        this.recetas = this.recetas.filter(r => r.id !== receta.id)
        this.$emit('notificar', { mensaje: `"${receta.titulo}" fue eliminada` })
      } catch (e) {
        this.$emit('notificar', { mensaje: e.message, tipo: 'error' })
      }
    },
    limpiarFiltros() {
      this.busqueda = ''
      this.categoria = 'Todas'
      this.soloFavoritas = false
    }
  }
}
</script>

<style scoped>
.listado {
  padding-top: 24px;
}

.encabezado h1 {
  font-size: 1.8rem;
  margin: 0;
}

.encabezado p {
  margin: 0 0 16px;
  color: var(--texto-suave);
}

.controles {
  display: grid;
  gap: 12px;
  margin-bottom: 20px;
}

.barra {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.resultados {
  margin: 0;
  color: var(--texto-suave);
  font-size: 0.9rem;
}

.barra-derecha {
  display: flex;
  align-items: center;
  gap: 8px;
}

.solo-favoritas {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 44px;
  padding: 0 12px;
  border: 1.5px solid var(--borde);
  border-radius: var(--radio);
  background: var(--superficie);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
}

.solo-favoritas input {
  accent-color: var(--terracota);
}

.solo-favoritas .material-symbols-rounded {
  font-size: 18px;
  color: var(--terracota);
}

.orden {
  width: auto;
  min-height: 44px;
  padding: 6px 12px;
  font-size: 0.88rem;
}

.vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 16px;
  text-align: center;
}

.vacio .material-symbols-rounded {
  font-size: 48px;
  color: var(--texto-suave);
}

.vacio p {
  color: var(--texto-suave);
}

/* Animaciones del transition-group */
.tarjetas-enter-active,
.tarjetas-leave-active {
  transition: all 0.35s ease;
}

.tarjetas-enter-from,
.tarjetas-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(16px);
}

.tarjetas-move {
  transition: transform 0.35s ease;
}
</style>
