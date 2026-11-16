<template>
  <transition name="modal">
    <div v-if="visible" class="modal-fondo" @click.self="$emit('cancelar')">
      <div class="modal tarjeta" role="dialog" aria-modal="true" :aria-label="titulo">
        <span class="modal-icono material-symbols-rounded">warning</span>
        <h3>{{ titulo }}</h3>
        <!-- slot: el padre decide el texto del mensaje -->
        <p class="modal-texto">
          <slot>¿Estás seguro? Esta acción no se puede deshacer.</slot>
        </p>
        <div class="modal-acciones">
          <button class="btn btn-contorno" @click="$emit('cancelar')">Cancelar</button>
          <button class="btn btn-peligro" @click="$emit('confirmar')">{{ textoConfirmar }}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    visible: { type: Boolean, default: false },
    titulo: { type: String, default: 'Confirmar acción' },
    textoConfirmar: { type: String, default: 'Eliminar' }
  },
  emits: ['confirmar', 'cancelar']
}
</script>

<style scoped>
.modal-fondo {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 16px;
  background: rgba(31, 41, 55, 0.45);
}

.modal {
  width: 100%;
  max-width: 420px;
  padding: 24px;
  text-align: center;
  box-shadow: var(--sombra-3);
  border-radius: var(--radio-xl);
}

.modal-icono {
  display: inline-grid;
  place-items: center;
  width: 56px;
  height: 56px;
  margin-bottom: 12px;
  border-radius: 50%;
  background: var(--error-suave);
  color: var(--error);
  font-size: 30px;
}

.modal-texto {
  color: var(--texto-suave);
  margin: 0 0 20px;
}

.modal-acciones {
  display: flex;
  gap: 12px;
}

.modal-acciones .btn {
  flex: 1;
}

/* Transición: el fondo aparece y la tarjeta sube */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: translateY(40px);
}

@media (min-width: 600px) {
  .modal-fondo {
    align-items: center;
  }
}
</style>
