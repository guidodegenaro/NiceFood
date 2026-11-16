<template>
  <div class="filtro" role="group" aria-label="Filtrar por categoría">
    <button
      v-for="opcion in opciones"
      :key="opcion"
      type="button"
      :class="['filtro-chip', { activo: opcion === modelValue }]"
      @click="$emit('update:modelValue', opcion)"
    >
      <span v-if="iconos[opcion]" class="material-symbols-rounded">{{ iconos[opcion] }}</span>
      {{ opcion }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'CategoryFilter',
  props: {
    categorias: { type: Array, required: true },
    modelValue: { type: String, default: 'Todas' }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      iconos: {
        Todas: 'restaurant',
        Desayunos: 'egg_alt',
        'Platos principales': 'dinner_dining',
        Pastas: 'ramen_dining',
        Veggie: 'eco',
        Sopas: 'soup_kitchen',
        Postres: 'cake'
      }
    }
  },
  computed: {
    // Agregamos la opción "Todas" al principio de la lista
    opciones() {
      return ['Todas', ...this.categorias]
    }
  }
}
</script>

<style scoped>
.filtro {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 2px 8px;
  scrollbar-width: none;
}

.filtro::-webkit-scrollbar {
  display: none;
}

.filtro-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid var(--borde);
  border-radius: 999px;
  background: var(--superficie);
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.15s;
}

.filtro-chip .material-symbols-rounded {
  font-size: 18px;
}

.filtro-chip:hover {
  border-color: var(--verde);
}

.filtro-chip.activo {
  background: var(--verde);
  border-color: var(--verde);
  color: #fff;
}

@media (min-width: 1024px) {
  .filtro {
    flex-wrap: wrap;
    overflow: visible;
  }
}
</style>
