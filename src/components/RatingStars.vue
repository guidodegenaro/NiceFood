<template>
  <div :class="['estrellas', { editable }]" :aria-label="`Calificación ${valor} de 5`">
    <button
      v-for="n in 5"
      :key="n"
      type="button"
      class="estrella"
      :class="{ llena: n <= valorVisible }"
      :disabled="!editable"
      :aria-label="`${n} estrellas`"
      @mouseenter="hover = editable ? n : 0"
      @mouseleave="hover = 0"
      @click="calificar(n)"
    >
      <span class="material-symbols-rounded">star</span>
    </button>
    <span v-if="mostrarNumero" class="numero">{{ valor ? valor.toFixed(1) : '—' }}</span>
  </div>
</template>

<script>
export default {
  name: 'RatingStars',
  props: {
    valor: { type: Number, default: 0 },
    editable: { type: Boolean, default: false },
    mostrarNumero: { type: Boolean, default: false }
  },
  emits: ['calificar'],
  data() {
    return { hover: 0 }
  },
  computed: {
    // Mientras el mouse está encima mostramos la estrella "hover"
    valorVisible() {
      return this.hover || Math.round(this.valor)
    }
  },
  methods: {
    calificar(n) {
      if (this.editable) this.$emit('calificar', n)
    }
  }
}
</script>

<style scoped>
.estrellas {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.estrella {
  display: grid;
  place-items: center;
  padding: 0;
  border: none;
  background: none;
  color: #d1d5db;
  cursor: default;
}

.estrella:disabled {
  opacity: 1;
}

.estrella .material-symbols-rounded {
  font-size: 20px;
  font-variation-settings: 'FILL' 1;
}

.estrella.llena {
  color: var(--mostaza);
}

.editable .estrella {
  width: 44px;
  height: 44px;
  cursor: pointer;
  transition: transform 0.1s;
}

.editable .estrella .material-symbols-rounded {
  font-size: 32px;
}

.editable .estrella:hover {
  transform: scale(1.15);
}

.numero {
  margin-left: 4px;
  font-weight: 700;
  font-size: 0.85rem;
}
</style>
