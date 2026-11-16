<template>
  <div class="contenedor explorar">
    <header class="encabezado">
      <span class="chip chip-verde"><span class="material-symbols-rounded">api</span> API TheMealDB</span>
      <h1>Explorá recetas del mundo</h1>
      <p>Estas recetas llegan en vivo desde una API externa. Guardá las que te gusten en tu recetario.</p>
    </header>

    <div class="controles">
      <SearchBar v-model="termino" placeholder="Buscá en inglés: chicken, cake, rice..." @buscar="buscar" />
      <div class="rapidos">
        <button v-for="t in terminosRapidos" :key="t.valor" class="chip" :class="{ 'chip-verde': t.valor === ultimaBusqueda }" @click="buscarRapido(t.valor)">
          {{ t.texto }}
        </button>
        <button class="chip sorpresa" @click="sorpresa">
          <span class="material-symbols-rounded">casino</span> Receta sorpresa
        </button>
      </div>
    </div>

    <!-- Estados de la petición: cargando / error / sin resultados / resultados -->
    <div v-if="cargando" class="estado">
      <span class="spinner"></span>
      <p>Buscando recetas...</p>
    </div>

    <div v-else-if="error" class="estado tarjeta error">
      <span class="material-symbols-rounded">wifi_off</span>
      <p>{{ error }}</p>
      <button class="btn btn-contorno" @click="buscar">Reintentar</button>
    </div>

    <div v-else-if="!resultados.length" class="estado tarjeta">
      <span class="material-symbols-rounded">search_off</span>
      <p>No hay resultados para "{{ ultimaBusqueda }}". Recordá buscar en inglés.</p>
    </div>

    <template v-else>
      <p class="cantidad">{{ resultados.length }} resultados para "{{ ultimaBusqueda }}"</p>
      <transition-group name="aparecer" tag="div" class="grilla">
        <ApiRecipeCard
          v-for="r in resultados"
          :key="r.idApi"
          :receta="r"
          :importada="idsImportados.includes(r.idApi)"
          @importar="importar"
        />
      </transition-group>
    </template>
  </div>
</template>

<script>
import SearchBar from '../components/SearchBar.vue'
import ApiRecipeCard from '../components/ApiRecipeCard.vue'
import { buscarRecetasApi, recetaAleatoriaApi, convertirCategoria } from '../services/mealApi'
import { crearReceta, obtenerRecetas } from '../services/recetas'

export default {
  name: 'ExplorarView',
  components: { SearchBar, ApiRecipeCard },
  emits: ['notificar'],
  data() {
    return {
      termino: 'chicken',
      ultimaBusqueda: '',
      resultados: [],
      cargando: false,
      error: '',
      idsImportados: [],
      terminosRapidos: [
        { texto: 'Pollo', valor: 'chicken' },
        { texto: 'Pasta', valor: 'pasta' },
        { texto: 'Tortas', valor: 'cake' },
        { texto: 'Arroz', valor: 'rice' },
        { texto: 'Pescado', valor: 'fish' }
      ]
    }
  },
  async created() {
    // Recordamos qué recetas de la API ya fueron guardadas antes
    try {
      const recetas = await obtenerRecetas()
      this.idsImportados = recetas.filter(r => r.idApi).map(r => r.idApi)
    } catch (e) {
      this.idsImportados = []
    }
  },
  mounted() {
    // Hook mounted(): el componente ya está en pantalla, hacemos la primera petición
    this.buscar()
  },
  methods: {
    async buscar() {
      const termino = this.termino.trim()
      if (!termino) return
      this.cargando = true
      this.error = ''
      this.ultimaBusqueda = termino
      try {
        this.resultados = await buscarRecetasApi(termino)
      } catch (e) {
        this.error = 'No pudimos conectar con la API. Revisá tu conexión a internet.'
        this.resultados = []
      } finally {
        this.cargando = false
      }
    },
    buscarRapido(valor) {
      this.termino = valor
      this.buscar()
    },
    async sorpresa() {
      this.cargando = true
      this.error = ''
      try {
        const receta = await recetaAleatoriaApi()
        this.resultados = [receta]
        this.ultimaBusqueda = receta.titulo
      } catch (e) {
        this.error = 'No pudimos conectar con la API. Revisá tu conexión a internet.'
      } finally {
        this.cargando = false
      }
    },
    // Convierte la receta de la API al formato de NiceFood y la guarda (Supabase o LocalStorage)
    async importar(r) {
      let nueva
      try {
        nueva = await crearReceta({
          idApi: r.idApi,
          titulo: r.titulo.slice(0, 60),
        descripcion: `Receta de cocina ${r.origen || 'internacional'} (${r.categoriaApi}) importada desde TheMealDB.`,
        categoria: convertirCategoria(r.categoriaApi),
        dificultad: 'Media',
        tiempo: 30,
        porciones: 4,
        imagen: r.imagen,
        autor: 'TheMealDB',
        ingredientes: r.ingredientes,
          pasos: r.pasos.length ? r.pasos : ['Ver las instrucciones originales en TheMealDB.']
        })
      } catch (e) {
        this.$emit('notificar', { mensaje: e.message, tipo: 'error' })
        return
      }
      this.idsImportados.push(r.idApi)
      this.$emit('notificar', { mensaje: `"${nueva.titulo}" se guardó en tu recetario` })
    }
  }
}
</script>

<style scoped>
.explorar {
  padding-top: 24px;
}

.encabezado h1 {
  margin: 10px 0 4px;
  font-size: 1.8rem;
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

.rapidos {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.rapidos .chip {
  min-height: 36px;
  cursor: pointer;
  background: var(--superficie);
}

.rapidos .chip-verde {
  background: var(--verde-suave);
}

.rapidos .sorpresa {
  background: var(--terracota-suave);
  border-color: transparent;
  color: var(--terracota-oscuro);
}

.rapidos .material-symbols-rounded {
  font-size: 18px;
}

.cantidad {
  color: var(--texto-suave);
  font-size: 0.9rem;
}

.estado {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 16px;
  text-align: center;
  color: var(--texto-suave);
}

.estado .material-symbols-rounded {
  font-size: 44px;
}

.estado.error .material-symbols-rounded {
  color: var(--error);
}

.spinner {
  width: 42px;
  height: 42px;
  border: 4px solid var(--verde-suave);
  border-top-color: var(--verde);
  border-radius: 50%;
  animation: girar 0.8s linear infinite;
}

@keyframes girar {
  to { transform: rotate(360deg); }
}

.aparecer-enter-active {
  transition: all 0.4s ease;
}

.aparecer-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
</style>
