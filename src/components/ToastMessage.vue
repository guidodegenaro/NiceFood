<template>
  <!-- <transition> anima la entrada y salida del aviso -->
  <transition name="toast">
    <div v-if="mensaje" :class="['toast', 'toast-' + tipo]" role="status">
      <span class="material-symbols-rounded">{{ icono }}</span>
      <span class="toast-texto">{{ mensaje }}</span>
      <button class="toast-cerrar" aria-label="Cerrar aviso" @click="$emit('cerrar')">
        <span class="material-symbols-rounded">close</span>
      </button>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ToastMessage',
  props: {
    mensaje: { type: String, default: '' },
    tipo: {
      type: String,
      default: 'exito',
      validator: valor => ['exito', 'error', 'info'].includes(valor)
    }
  },
  emits: ['cerrar'],
  computed: {
    icono() {
      const iconos = { exito: 'check_circle', error: 'error', info: 'info' }
      return iconos[this.tipo]
    }
  }
}
</script>

<style scoped>
.toast {
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 86px;
  z-index: 300;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 420px;
  margin: 0 auto;
  padding: 12px 8px 12px 16px;
  border-radius: var(--radio-lg);
  color: #fff;
  box-shadow: var(--sombra-3);
}

.toast-exito { background: var(--verde); }
.toast-error { background: var(--error); }
.toast-info { background: var(--texto); }

.toast-texto {
  flex: 1;
  font-weight: 600;
  font-size: 0.92rem;
}

.toast-cerrar {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #fff;
  cursor: pointer;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

@media (min-width: 1024px) {
  .toast {
    bottom: 24px;
  }
}
</style>
