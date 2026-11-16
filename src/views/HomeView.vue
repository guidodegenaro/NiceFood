<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="contenedor hero-interior">
        <div class="hero-texto">
          <span class="chip chip-mostaza">
            <span class="material-symbols-rounded">local_fire_department</span>
            {{ totalRecetas }} recetas en la comunidad
          </span>
          <h1>¿Qué cocinamos hoy?</h1>
          <p>Descubrí, guardá y compartí recetas caseras. Buscá por nombre o por lo que tengas en la heladera.</p>
          <SearchBar v-model="busqueda" placeholder="Ej: pollo, dulce de leche, pasta..." @buscar="irABuscar" />
          <div class="sugerencias">
            <span>Probá con:</span>
            <button v-for="s in sugerencias" :key="s" class="chip" @click="irABuscar(s)">{{ s }}</button>
          </div>
        </div>
        <img v-if="imagenHero" class="hero-imagen" :src="imagenHero" alt="" />
      </div>
    </section>

    <div class="contenedor">
      <!-- Categorías: navegan al listado usando query params (?categoria=...) -->
      <section class="seccion">
        <div class="seccion-titulo"><h2>Categorías</h2></div>
        <div class="categorias">
          <router-link
            v-for="cat in categorias"
            :key="cat.nombre"
            :to="{ name: 'Listado', query: { categoria: cat.nombre } }"
            class="categoria tarjeta"
          >
            <span class="categoria-icono material-symbols-rounded">{{ cat.icono }}</span>
            <span class="categoria-nombre">{{ cat.nombre }}</span>
            <small>{{ cantidadPorCategoria[cat.nombre] || 0 }} recetas</small>
          </router-link>
        </div>
      </section>

      <!-- Llamado a la acción -->
      <section class="cta tarjeta">
        <span class="cta-icono material-symbols-rounded">restaurant</span>
        <div class="cta-texto">
          <h2>Compartí tu creación culinaria</h2>
          <p>Subí tu receta con foto, ingredientes y pasos. ¡La comunidad la va a calificar!</p>
        </div>
        <router-link to="/recetas/nueva" class="btn btn-primario">
          <span class="material-symbols-rounded">edit_note</span> Escribir receta
        </router-link>
      </section>

      <section class="seccion">
        <div class="seccion-titulo">
          <h2>Favoritas de la comunidad</h2>
          <router-link :to="{ name: 'Listado', query: { orden: 'calificacion' } }" class="ver-todas">Ver todas →</router-link>
        </div>
        <div class="grilla">
          <!-- Usamos el slot de RecipeCard para mostrar solo el botón "Cocinar" (sin editar/eliminar) -->
          <RecipeCard v-for="r in mejorCalificadas" :key="r.id" :receta="r" @favorito="alternarFavorito">
            <router-link :to="`/recetas/${r.id}`" class="btn btn-secundario boton-ancho">
              <span class="material-symbols-rounded">skillet</span> Cocinar esta receta
            </router-link>
          </RecipeCard>
        </div>
      </section>

      <section class="seccion">
        <div class="seccion-titulo">
          <h2>Recién salidas del horno</h2>
          <router-link :to="{ name: 'Listado', query: { orden: 'recientes' } }" class="ver-todas">Ver todas →</router-link>
        </div>
        <div class="recientes">
          <router-link v-for="r in recientes" :key="r.id" :to="`/recetas/${r.id}`" class="reciente tarjeta">
            <img :src="r.imagen" :alt="r.titulo" loading="lazy" />
            <div>
              <strong>{{ r.titulo }}</strong>
              <small>{{ r.autor }} · {{ r.tiempo }} min</small>
            </div>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import SearchBar from '../components/SearchBar.vue'
import RecipeCard from '../components/RecipeCard.vue'
import { obtenerRecetas, guardarFavorito, promedioCalificacion } from '../services/recetas'

export default {
  name: 'HomeView',
  components: { SearchBar, RecipeCard },
  emits: ['notificar'],
  data() {
    return {
      recetas: [],
      busqueda: '',
      sugerencias: ['pollo', 'chocolate', 'huevos', 'tomate'],
      categorias: [
        { nombre: 'Desayunos', icono: 'egg_alt' },
        { nombre: 'Platos principales', icono: 'dinner_dining' },
        { nombre: 'Pastas', icono: 'ramen_dining' },
        { nombre: 'Veggie', icono: 'eco' },
        { nombre: 'Sopas', icono: 'soup_kitchen' },
        { nombre: 'Postres', icono: 'cake' }
      ]
    }
  },
  computed: {
    totalRecetas() {
      return this.recetas.length
    },
    // Las 3 recetas con mejor promedio de estrellas
    mejorCalificadas() {
      return [...this.recetas]
        .sort((a, b) => promedioCalificacion(b) - promedioCalificacion(a))
        .slice(0, 3)
    },
    // Las 4 recetas más nuevas
    recientes() {
      return [...this.recetas]
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 4)
    },
    // Objeto { 'Postres': 4, 'Pastas': 3, ... }
    cantidadPorCategoria() {
      return this.recetas.reduce((conteo, r) => {
        conteo[r.categoria] = (conteo[r.categoria] || 0) + 1
        return conteo
      }, {})
    },
    imagenHero() {
      return this.recetas.length ? this.mejorCalificadas[0].imagen : ''
    }
  },
  async created() {
    // Hook created(): pedimos las recetas (Supabase o LocalStorage) apenas se crea el componente
    try {
      this.recetas = await obtenerRecetas()
    } catch (e) {
      this.$emit('notificar', { mensaje: 'No se pudieron cargar las recetas', tipo: 'error' })
    }
  },
  methods: {
    irABuscar(texto) {
      // Navegación programática pasando la búsqueda como query param
      this.$router.push({ name: 'Listado', query: { q: texto || this.busqueda } })
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
    }
  }
}
</script>

<style scoped>
.hero {
  padding: 24px 0 8px;
  background: linear-gradient(180deg, var(--verde-suave), var(--fondo));
}

.hero-interior {
  display: grid;
  gap: 24px;
  align-items: center;
}

.hero-texto h1 {
  margin: 12px 0 8px;
  font-size: 1.9rem;
  color: var(--verde-oscuro);
}

.hero-texto p {
  margin: 0 0 20px;
  color: var(--texto-suave);
}

.sugerencias {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 0.85rem;
  color: var(--texto-suave);
}

.sugerencias .chip {
  cursor: pointer;
  background: var(--superficie);
}

.hero-imagen {
  display: none;
}

.categorias {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.categoria {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 6px;
  text-align: center;
  text-decoration: none;
  color: var(--texto);
  transition: transform 0.15s, border-color 0.15s;
}

.categoria:hover {
  transform: translateY(-2px);
  border-color: var(--verde);
}

.categoria-icono {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--terracota-suave);
  color: var(--terracota);
  font-size: 26px;
}

.categoria-nombre {
  font-weight: 700;
  font-size: 0.82rem;
  line-height: 1.2;
}

.categoria small {
  color: var(--texto-suave);
  font-size: 0.72rem;
}

.cta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 20px;
  background: var(--mostaza-suave);
  border-color: transparent;
}

.cta-icono {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--terracota-suave);
  color: var(--terracota);
}

.cta-texto h2 {
  font-size: 1.15rem;
  margin-bottom: 4px;
}

.cta-texto p {
  margin: 0;
  color: var(--texto-suave);
  font-size: 0.92rem;
}

.boton-ancho {
  width: 100%;
}

.ver-todas {
  flex-shrink: 0;
  white-space: nowrap;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  color: var(--terracota);
}

.recientes {
  display: grid;
  gap: 12px;
}

.reciente {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  text-decoration: none;
  color: var(--texto);
}

.reciente img {
  width: 72px;
  height: 72px;
  border-radius: var(--radio);
  object-fit: cover;
}

.reciente div {
  display: flex;
  flex-direction: column;
}

.reciente small {
  color: var(--texto-suave);
}

@media (min-width: 600px) {
  .categorias {
    grid-template-columns: repeat(6, 1fr);
  }
  .recientes {
    grid-template-columns: repeat(2, 1fr);
  }
  .cta {
    flex-direction: row;
    align-items: center;
  }
  .cta-texto {
    flex: 1;
  }
}

@media (min-width: 1024px) {
  .hero {
    padding: 48px 0 24px;
  }
  .hero-interior {
    grid-template-columns: 1.2fr 1fr;
    gap: 48px;
  }
  .hero-texto h1 {
    font-size: 2.6rem;
  }
  .hero-imagen {
    display: block;
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 32px;
    box-shadow: var(--sombra-3);
    transform: rotate(2deg);
  }
  .recientes {
    grid-template-columns: repeat(4, 1fr);
  }
  .reciente {
    flex-direction: column;
    align-items: flex-start;
  }
  .reciente img {
    width: 100%;
    height: 140px;
  }
}
</style>
