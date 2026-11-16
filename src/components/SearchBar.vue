<template>
  <form class="buscador" role="search" @submit.prevent="$emit('buscar', modelValue)">
    <span class="material-symbols-rounded lupa">search</span>
    <!--
      Componente compatible con v-model:
      recibe "modelValue" como prop y emite "update:modelValue" al escribir.
    -->
    <input
      type="search"
      class="buscador-input"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <button
      v-if="modelValue"
      type="button"
      class="limpiar"
      aria-label="Borrar búsqueda"
      @click="$emit('update:modelValue', '')"
    >
      <span class="material-symbols-rounded">close</span>
    </button>
  </form>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'Buscar recetas o ingredientes...' }
  },
  emits: ['update:modelValue', 'buscar']
}
</script>

<style scoped>
.buscador {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.lupa {
  position: absolute;
  left: 16px;
  color: var(--texto-suave);
  pointer-events: none;
}

.buscador-input {
  width: 100%;
  height: 50px;
  padding: 0 48px;
  background: var(--superficie);
  border: 1.5px solid var(--borde);
  border-radius: 999px;
  outline: none;
  box-shadow: var(--sombra-1);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.buscador-input::placeholder {
  color: #9ca3af;
}

.buscador-input:focus {
  border-color: var(--verde);
  box-shadow: 0 0 0 3px var(--verde-suave);
}

/* Ocultamos la "x" nativa del input search para usar la nuestra */
.buscador-input::-webkit-search-cancel-button {
  display: none;
}

.limpiar {
  position: absolute;
  right: 6px;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--texto-suave);
  cursor: pointer;
}
</style>
