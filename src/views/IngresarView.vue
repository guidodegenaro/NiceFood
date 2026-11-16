<template>
  <div class="contenedor ingresar">
    <section class="tarjeta panel">
      <span class="logo material-symbols-rounded">skillet</span>

      <!-- Supabase todavía no está configurado (.env.local / Vercel) -->
      <template v-if="!configurado">
        <h1>Modo local</h1>
        <p>
          El inicio de sesión todavía no está conectado. Mientras tanto, todas tus recetas
          se guardan en este navegador con LocalStorage.
        </p>
        <router-link to="/" class="btn btn-secundario">Volver al inicio</router-link>
      </template>

      <!-- Ya hay sesión iniciada -->
      <template v-else-if="usuario">
        <img v-if="usuario.avatar" :src="usuario.avatar" alt="" class="avatar" referrerpolicy="no-referrer" />
        <h1>¡Hola, {{ primerNombre }}!</h1>
        <p class="email">{{ usuario.email }}</p>
        <div class="acciones">
          <router-link to="/recetas/nueva" class="btn btn-primario">
            <span class="material-symbols-rounded">edit_note</span> Escribir receta
          </router-link>
          <button class="btn btn-contorno" @click="salir">
            <span class="material-symbols-rounded">logout</span> Cerrar sesión
          </button>
        </div>
      </template>

      <!-- Sin sesión -->
      <template v-else>
        <h1>Ingresá a NiceFood</h1>
        <p>Iniciá sesión para publicar recetas, calificarlas, comentar y guardar tus favoritas.</p>
        <button class="btn google" :disabled="cargando" @click="ingresar">
          <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/>
          </svg>
          {{ cargando ? 'Redirigiendo...' : 'Continuar con Google' }}
        </button>
        <p v-if="error" class="mensaje-error"><span class="material-symbols-rounded">error</span>{{ error }}</p>
      </template>
    </section>
  </div>
</template>

<script>
import { sesion, ingresarConGoogle, cerrarSesion } from '../lib/auth'
import { supabaseConfigurado } from '../lib/supabase'

export default {
  name: 'IngresarView',
  emits: ['notificar'],
  data() {
    return {
      configurado: supabaseConfigurado,
      cargando: false,
      error: ''
    }
  },
  computed: {
    usuario() {
      return sesion.usuario
    },
    primerNombre() {
      return this.usuario.nombre.split(' ')[0]
    },
    // A dónde volver después de iniciar sesión (ej: /recetas/nueva)
    destino() {
      return this.$route.query.volver || '/'
    }
  },
  watch: {
    // Si la sesión aparece mientras estamos acá, seguimos a la página que se quería ver
    usuario(nuevo) {
      if (nuevo && this.$route.query.volver) this.$router.replace(this.destino)
    }
  },
  methods: {
    async ingresar() {
      this.cargando = true
      this.error = ''
      try {
        await ingresarConGoogle(this.destino)
      } catch (e) {
        this.error = 'No se pudo iniciar sesión: ' + e.message
        this.cargando = false
      }
    },
    async salir() {
      await cerrarSesion()
      this.$emit('notificar', { mensaje: 'Cerraste sesión', tipo: 'info' })
    }
  }
}
</script>

<style scoped>
.ingresar {
  display: flex;
  justify-content: center;
  padding-top: 40px;
}

.panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 420px;
  padding: 32px 24px;
  text-align: center;
}

.panel p {
  margin: 0 0 12px;
  color: var(--texto-suave);
}

.logo {
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  border-radius: 18px;
  background: var(--verde);
  color: var(--mostaza);
  font-size: 34px;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
}

.email {
  font-size: 0.9rem;
}

.acciones {
  display: grid;
  gap: 10px;
  width: 100%;
}

.google {
  width: 100%;
  background: var(--superficie);
  border-color: var(--borde);
  color: var(--texto);
  box-shadow: var(--sombra-1);
}

.google:hover {
  border-color: var(--verde);
}
</style>
