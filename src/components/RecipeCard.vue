<template>
  <article class="card tarjeta">
    <router-link :to="`/recetas/${receta.id}`" class="card-imagen">
      <img :src="receta.imagen" :alt="receta.titulo" loading="lazy" @error="imagenRota" />
      <span class="chip card-tiempo">
        <span class="material-symbols-rounded">schedule</span>
        {{ receta.tiempo }} min
      </span>
      <span class="chip chip-verde card-categoria">{{ receta.categoria }}</span>
    </router-link>

    <button
      class="btn-icono card-favorito"
      :class="{ activo: receta.favorito }"
      :aria-label="receta.favorito ? 'Quitar de favoritas' : 'Agregar a favoritas'"
      @click="$emit('favorito', receta.id)"
    >
      <span class="material-symbols-rounded">bookmark</span>
    </button>

    <div class="card-cuerpo">
      <div class="card-meta">
        <span class="autor">
          <span class="avatar">{{ inicial }}</span>
          {{ receta.autor }}
        </span>
        <span class="chip chip-mostaza">
          <span class="material-symbols-rounded estrella">star</span>
          {{ promedio || 'Nueva' }}
          <small v-if="cantidadVotos">({{ cantidadVotos }})</small>
        </span>
      </div>

      <router-link :to="`/recetas/${receta.id}`" class="card-titulo">
        <h3>{{ receta.titulo }}</h3>
      </router-link>
      <p class="card-descripcion">{{ receta.descripcion }}</p>

      <!-- slot: el padre puede agregar contenido extra (ej: botones de acción) -->
      <div class="card-acciones">
        <slot>
          <router-link :to="`/recetas/${receta.id}`" class="btn btn-secundario ver">
            <span class="material-symbols-rounded">menu_book</span> Ver receta
          </router-link>
          <!-- Editar y eliminar solo aparecen si la receta es del usuario -->
          <template v-if="esMia">
            <router-link
              :to="`/recetas/${receta.id}/editar`"
              class="btn-icono boton-accion"
              aria-label="Editar receta"
            >
              <span class="material-symbols-rounded">edit</span>
            </router-link>
            <button class="btn-icono boton-accion borrar" aria-label="Eliminar receta" @click="$emit('eliminar', receta)">
              <span class="material-symbols-rounded">delete</span>
            </button>
          </template>
        </slot>
      </div>
    </div>
  </article>
</template>

<script>
import { promedioCalificacion, puedeEditar } from '../services/recetas'

// Si la imagen no carga, mostramos una ilustración propia (carpeta public/)
const IMAGEN_RESPALDO = '/sin-imagen.svg'

export default {
  name: 'RecipeCard',
  // Props: el padre (la vista) le pasa la receta a mostrar
  props: {
    receta: { type: Object, required: true }
  },
  // Emits: la tarjeta avisa al padre, pero NO modifica los datos ella misma
  emits: ['eliminar', 'favorito'],
  computed: {
    promedio() {
      return promedioCalificacion(this.receta)
    },
    cantidadVotos() {
      return this.receta.calificaciones ? this.receta.calificaciones.length : 0
    },
    inicial() {
      return (this.receta.autor || '?').charAt(0).toUpperCase()
    },
    esMia() {
      return puedeEditar(this.receta)
    }
  },
  methods: {
    imagenRota(evento) {
      evento.target.src = IMAGEN_RESPALDO
    }
  }
}
</script>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: var(--sombra-3);
}

.card-imagen {
  position: relative;
  display: block;
  aspect-ratio: 4 / 3;
  background: var(--piedra);
}

.card-imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-tiempo,
.card-categoria {
  position: absolute;
  top: 12px;
  background: rgba(255, 255, 255, 0.95);
}

.card-tiempo {
  left: 12px;
}

.card-tiempo .material-symbols-rounded {
  font-size: 16px;
}

.card-categoria {
  left: auto;
  top: auto;
  bottom: 12px;
  left: 12px;
  background: var(--verde-suave);
}

.card-favorito {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  color: var(--texto-suave);
}

.card-favorito.activo {
  color: var(--terracota);
}

.card-favorito.activo .material-symbols-rounded {
  font-variation-settings: 'FILL' 1;
}

.card-cuerpo {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 16px;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 0.85rem;
}

.autor {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--texto-suave);
  font-weight: 500;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.avatar {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--terracota-suave);
  color: var(--terracota-oscuro);
  font-weight: 700;
  font-size: 0.8rem;
}

.estrella {
  font-size: 16px;
  color: #c9a227;
  font-variation-settings: 'FILL' 1;
}

.card-titulo {
  color: var(--texto);
  text-decoration: none;
}

.card-titulo h3 {
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.card-descripcion {
  flex: 1;
  margin: 0 0 16px;
  color: var(--texto-suave);
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-acciones {
  display: flex;
  gap: 8px;
}

.ver {
  flex: 1;
}

.boton-accion {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: var(--verde);
  cursor: pointer;
  text-decoration: none;
}

.boton-accion.borrar {
  color: var(--error);
}
</style>
