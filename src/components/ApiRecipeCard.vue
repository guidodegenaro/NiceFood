<template>
  <article class="api-card tarjeta">
    <div class="imagen">
      <img :src="receta.imagen" :alt="receta.titulo" loading="lazy" />
      <span v-if="receta.origen" class="chip origen">
        <span class="material-symbols-rounded">public</span> {{ receta.origen }}
      </span>
    </div>
    <div class="cuerpo">
      <small class="categoria">{{ receta.categoriaApi }}</small>
      <h3>{{ receta.titulo }}</h3>
      <p class="resumen">{{ receta.ingredientes.length }} ingredientes · {{ receta.pasos.length }} pasos</p>

      <transition name="fade" mode="out-in">
        <div v-if="abierta" key="detalle" class="ingredientes">
          <span v-for="ing in receta.ingredientes" :key="ing" class="chip">{{ ing }}</span>
        </div>
      </transition>

      <div class="acciones">
        <button class="btn btn-contorno" @click="abierta = !abierta">
          <span class="material-symbols-rounded">{{ abierta ? 'expand_less' : 'list' }}</span>
          {{ abierta ? 'Ocultar' : 'Ingredientes' }}
        </button>
        <button class="btn btn-primario" :disabled="importada" @click="$emit('importar', receta)">
          <span class="material-symbols-rounded">{{ importada ? 'check' : 'download' }}</span>
          {{ importada ? 'Guardada' : 'Guardar' }}
        </button>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: 'ApiRecipeCard',
  props: {
    receta: { type: Object, required: true },
    importada: { type: Boolean, default: false }
  },
  emits: ['importar'],
  data() {
    return { abierta: false }
  }
}
</script>

<style scoped>
.api-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.imagen {
  position: relative;
  aspect-ratio: 16 / 10;
}

.imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.origen {
  position: absolute;
  left: 12px;
  bottom: 12px;
  background: rgba(255, 255, 255, 0.95);
}

.origen .material-symbols-rounded {
  font-size: 16px;
}

.cuerpo {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 16px;
}

.categoria {
  color: var(--terracota);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 0.72rem;
}

.cuerpo h3 {
  margin: 2px 0;
  font-size: 1.05rem;
}

.resumen {
  flex: 1;
  margin: 0 0 12px;
  color: var(--texto-suave);
  font-size: 0.88rem;
}

.ingredientes {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.ingredientes .chip {
  font-weight: 500;
}

.acciones {
  display: flex;
  gap: 8px;
}

.acciones .btn {
  flex: 1;
  padding: 0 12px;
}
</style>
