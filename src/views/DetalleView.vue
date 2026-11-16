<template>
  <div class="detalle">
    <div v-if="cargando" class="contenedor no-existe">
      <span class="material-symbols-rounded">hourglass_top</span>
      <p>Cargando receta...</p>
    </div>

    <!-- Si el id de la URL no existe mostramos un aviso -->
    <div v-else-if="!receta" class="contenedor no-existe tarjeta">
      <span class="material-symbols-rounded">no_meals</span>
      <h2>Esta receta no existe</h2>
      <p>Puede que haya sido eliminada.</p>
      <router-link to="/recetas" class="btn btn-secundario">Ver todas las recetas</router-link>
    </div>

    <template v-else>
      <div class="portada">
        <img :src="receta.imagen" :alt="receta.titulo" />
        <div class="portada-botones contenedor">
          <button class="btn-icono" aria-label="Volver" @click="$router.back()">
            <span class="material-symbols-rounded">arrow_back</span>
          </button>
          <button class="btn-icono" :class="{ favorito: receta.favorito }" aria-label="Favorita" @click="alternarFavorito">
            <span class="material-symbols-rounded">bookmark</span>
          </button>
        </div>
      </div>

      <div class="contenedor cuerpo">
        <section class="cabecera tarjeta">
          <span class="chip chip-verde">{{ receta.categoria }}</span>
          <h1>{{ receta.titulo }}</h1>
          <p class="descripcion">{{ receta.descripcion }}</p>

          <div class="autor-fila">
            <span class="avatar">{{ receta.autor.charAt(0) }}</span>
            <div>
              <strong>{{ receta.autor }}</strong>
              <small>Publicada el {{ fechaFormateada }}</small>
            </div>
            <RatingStars class="promedio" :valor="promedio" mostrar-numero />
          </div>

          <ul class="datos">
            <li><span class="material-symbols-rounded">schedule</span><strong>{{ receta.tiempo }} min</strong><small>Tiempo</small></li>
            <li><span class="material-symbols-rounded">group</span><strong>{{ receta.porciones }}</strong><small>Porciones</small></li>
            <li><span class="material-symbols-rounded">signal_cellular_alt</span><strong>{{ receta.dificultad }}</strong><small>Dificultad</small></li>
          </ul>

          <!-- Solo quien publicó la receta puede editarla o eliminarla -->
          <div v-if="esMia" class="acciones">
            <router-link :to="`/recetas/${receta.id}/editar`" class="btn btn-contorno">
              <span class="material-symbols-rounded">edit</span> Editar
            </router-link>
            <button class="btn btn-contorno borrar" @click="mostrarModal = true">
              <span class="material-symbols-rounded">delete</span> Eliminar
            </button>
          </div>
        </section>

        <div class="columnas">
          <section class="tarjeta bloque">
            <div class="bloque-titulo">
              <h2>Ingredientes</h2>
              <small>{{ ingredientesMarcados }}/{{ receta.ingredientes.length }} listos</small>
            </div>
            <!-- Tocar un ingrediente lo tacha (lista de compras) -->
            <ul class="ingredientes">
              <li v-for="(ing, i) in receta.ingredientes" :key="ing">
                <label :class="{ tachado: marcados[i] }">
                  <input v-model="marcados[i]" type="checkbox" />
                  {{ ing }}
                </label>
              </li>
            </ul>
          </section>

          <section class="tarjeta bloque">
            <div class="bloque-titulo"><h2>Preparación</h2></div>
            <ol class="pasos">
              <li v-for="(paso, i) in receta.pasos" :key="i">
                <span class="paso-numero">{{ i + 1 }}</span>
                <p>{{ paso }}</p>
              </li>
            </ol>
          </section>
        </div>

        <!-- Calificar -->
        <section class="tarjeta bloque calificar">
          <h2>¿La cocinaste? Calificala</h2>
          <RatingStars :valor="miVoto" editable @calificar="calificar" />
          <transition name="fade">
            <p v-if="miVoto" class="gracias">¡Gracias! Le diste {{ miVoto }} {{ miVoto === 1 ? 'estrella' : 'estrellas' }}.</p>
          </transition>
        </section>

        <!-- Comentarios -->
        <section class="tarjeta bloque">
          <div class="bloque-titulo">
            <h2>Comentarios</h2>
            <small>{{ receta.comentarios.length }}</small>
          </div>

          <!-- En modo nube hay que iniciar sesión para comentar -->
          <p v-if="necesitaSesion" class="ingresa">
            <router-link :to="{ name: 'Ingresar', query: { volver: $route.fullPath } }">Ingresá con Google</router-link>
            para calificar y comentar.
          </p>

          <form v-else class="comentar" novalidate @submit.prevent="comentar">
            <p v-if="usuario" class="comentas-como">Comentás como <strong>{{ usuario.nombre }}</strong></p>
            <div v-else class="campo">
              <input v-model="nuevoComentario.autor" class="input" :class="{ 'con-error': erroresComentario.autor }" placeholder="Tu nombre" />
              <p v-if="erroresComentario.autor" class="mensaje-error"><span class="material-symbols-rounded">error</span>{{ erroresComentario.autor }}</p>
            </div>
            <div class="campo">
              <textarea v-model="nuevoComentario.texto" class="input" :class="{ 'con-error': erroresComentario.texto }" placeholder="¿Cómo te salió? ¿Le cambiaste algo?"></textarea>
              <p v-if="erroresComentario.texto" class="mensaje-error"><span class="material-symbols-rounded">error</span>{{ erroresComentario.texto }}</p>
            </div>
            <button type="submit" class="btn btn-primario">
              <span class="material-symbols-rounded">send</span> Comentar
            </button>
          </form>

          <transition-group name="comentario" tag="ul" class="comentarios">
            <li v-for="c in comentariosOrdenados" :key="c.id" class="comentario">
              <span class="avatar">{{ c.autor.charAt(0) }}</span>
              <div>
                <strong>{{ c.autor }}</strong>
                <small>{{ formatearFecha(c.fecha) }}</small>
                <p>{{ c.texto }}</p>
              </div>
            </li>
          </transition-group>
          <p v-if="!receta.comentarios.length" class="sin-comentarios">Todavía no hay comentarios. ¡Sé la primera persona!</p>
        </section>
      </div>

      <ConfirmModal :visible="mostrarModal" titulo="¿Eliminar receta?" @cancelar="mostrarModal = false" @confirmar="eliminar">
        Vas a eliminar <strong>{{ receta.titulo }}</strong>. Esta acción no se puede deshacer.
      </ConfirmModal>
    </template>
  </div>
</template>

<script>
import RatingStars from '../components/RatingStars.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import {
  obtenerRecetaPorId, eliminarReceta, guardarFavorito, calificarReceta,
  agregarComentario, puedeEditar, promedioCalificacion, modoNube
} from '../services/recetas'
import { sesion } from '../lib/auth'
import { requerido, longitudMinima, longitudMaxima, soloLetras, primerError } from '../utils/validaciones'

export default {
  name: 'DetalleView',
  components: { RatingStars, ConfirmModal },
  emits: ['notificar'],
  data() {
    return {
      receta: null,
      cargando: true,
      marcados: [],
      miVoto: 0,
      mostrarModal: false,
      nuevoComentario: { autor: '', texto: '' },
      erroresComentario: {}
    }
  },
  computed: {
    usuario() {
      return sesion.usuario
    },
    necesitaSesion() {
      return modoNube && !this.usuario
    },
    esMia() {
      return puedeEditar(this.receta)
    },
    promedio() {
      return promedioCalificacion(this.receta)
    },
    ingredientesMarcados() {
      return this.marcados.filter(Boolean).length
    },
    fechaFormateada() {
      return this.formatearFecha(this.receta.fecha)
    },
    comentariosOrdenados() {
      return [...this.receta.comentarios].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    }
  },
  async created() {
    // Leemos el parámetro dinámico de la URL: /recetas/:id
    try {
      this.receta = await obtenerRecetaPorId(this.$route.params.id)
      if (this.receta) {
        this.marcados = this.receta.ingredientes.map(() => false)
        this.miVoto = this.receta.miVoto || 0
      }
    } catch (e) {
      this.$emit('notificar', { mensaje: 'No se pudo cargar la receta', tipo: 'error' })
    } finally {
      this.cargando = false
    }
  },
  methods: {
    formatearFecha(fecha) {
      return new Date(fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
    },
    avisarError(e) {
      this.$emit('notificar', { mensaje: e.message, tipo: 'error' })
    },
    async alternarFavorito() {
      this.receta.favorito = !this.receta.favorito
      try {
        await guardarFavorito(this.receta)
        this.$emit('notificar', {
          mensaje: this.receta.favorito ? 'Guardada en favoritas' : 'Quitada de favoritas',
          tipo: 'info'
        })
      } catch (e) {
        this.receta.favorito = !this.receta.favorito // deshacemos el cambio
        this.avisarError(e)
      }
    },
    async calificar(estrellas) {
      const anteriores = [...this.receta.calificaciones]
      if (this.miVoto) {
        // Si ya votó, reemplazamos su voto anterior
        const indice = this.receta.calificaciones.lastIndexOf(this.miVoto)
        this.receta.calificaciones.splice(indice, 1, estrellas)
      } else {
        this.receta.calificaciones.push(estrellas)
      }
      try {
        await calificarReceta(this.receta, estrellas)
        this.miVoto = estrellas
      } catch (e) {
        this.receta.calificaciones = anteriores
        this.avisarError(e)
      }
    },
    async comentar() {
      // Con sesión iniciada, el autor es el nombre de la cuenta de Google
      const autor = this.usuario ? this.usuario.nombre : this.nuevoComentario.autor
      const texto = this.nuevoComentario.texto
      this.erroresComentario = {
        autor: primerError(requerido(autor, 'Tu nombre'), longitudMinima(autor, 2, 'Tu nombre'), soloLetras(autor, 'Tu nombre')),
        texto: primerError(requerido(texto, 'El comentario'), longitudMinima(texto, 5, 'El comentario'), longitudMaxima(texto, 300, 'El comentario'))
      }
      if (this.usuario) this.erroresComentario.autor = ''
      if (this.erroresComentario.autor || this.erroresComentario.texto) return

      try {
        const comentario = await agregarComentario(this.receta, { autor: autor.trim(), texto: texto.trim() })
        this.receta.comentarios.push(comentario)
        this.nuevoComentario.texto = ''
        this.$emit('notificar', { mensaje: '¡Comentario publicado!' })
      } catch (e) {
        this.avisarError(e)
      }
    },
    async eliminar() {
      this.mostrarModal = false
      try {
        await eliminarReceta(this.receta.id)
        this.$emit('notificar', { mensaje: `"${this.receta.titulo}" fue eliminada` })
        // replace: así el botón "atrás" no vuelve a una receta que ya no existe
        this.$router.replace('/recetas')
      } catch (e) {
        this.avisarError(e)
      }
    }
  }
}
</script>

<style scoped>
.portada {
  position: relative;
  height: 280px;
  background: var(--piedra);
}

.portada img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.portada-botones {
  position: absolute;
  top: 16px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
}

.portada-botones .btn-icono {
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: var(--sombra-1);
}

.portada-botones .favorito {
  color: var(--terracota);
}

.portada-botones .favorito .material-symbols-rounded {
  font-variation-settings: 'FILL' 1;
}

.cuerpo {
  display: grid;
  gap: 16px;
  margin-top: -40px;
  position: relative;
}

.cabecera {
  padding: 20px;
}

.cabecera h1 {
  margin: 10px 0 6px;
  font-size: 1.7rem;
}

.descripcion {
  margin: 0 0 16px;
  color: var(--texto-suave);
}

.autor-fila {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--borde);
}

.autor-fila div {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.autor-fila small {
  color: var(--texto-suave);
}

.promedio {
  margin-left: auto;
}

.avatar {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--terracota-suave);
  color: var(--terracota-oscuro);
  font-weight: 700;
  text-transform: uppercase;
}

.datos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 16px 0;
  padding: 0;
  list-style: none;
  text-align: center;
}

.datos li {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 4px;
  border-radius: var(--radio);
  background: var(--piedra);
}

.datos .material-symbols-rounded {
  color: var(--verde);
}

.datos small {
  color: var(--texto-suave);
  font-size: 0.75rem;
}

.acciones {
  display: flex;
  gap: 10px;
}

.acciones .btn {
  flex: 1;
}

.borrar {
  color: var(--error);
}

.borrar:hover {
  border-color: var(--error);
  color: var(--error);
}

.columnas {
  display: grid;
  gap: 16px;
}

.bloque {
  padding: 20px;
}

.bloque-titulo {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.bloque h2 {
  font-size: 1.2rem;
}

.bloque-titulo small {
  color: var(--texto-suave);
  font-weight: 600;
}

.ingredientes {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
}

.ingredientes label {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  border-bottom: 1px dashed var(--borde);
  cursor: pointer;
  transition: color 0.2s;
}

.ingredientes input {
  width: 22px;
  height: 22px;
  accent-color: var(--verde);
  flex-shrink: 0;
}

.tachado {
  color: var(--texto-suave);
  text-decoration: line-through;
}

.pasos {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  display: grid;
  gap: 14px;
}

.pasos li {
  display: flex;
  gap: 12px;
}

.pasos p {
  margin: 0;
  padding-top: 3px;
}

.paso-numero {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--verde-suave);
  color: var(--verde);
  font-weight: 700;
}

.calificar {
  text-align: center;
  background: var(--mostaza-suave);
  border-color: transparent;
}

.gracias {
  margin: 8px 0 0;
  font-weight: 600;
  color: #7a5c00;
}

.comentar {
  margin: 12px 0 16px;
}

.ingresa,
.comentas-como {
  margin: 12px 0;
  color: var(--texto-suave);
}

.ingresa a {
  font-weight: 700;
}

.comentar .campo {
  margin-bottom: 10px;
}

.comentar textarea {
  min-height: 80px;
}

.comentarios {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.comentario {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: var(--radio);
  background: var(--piedra);
}

.comentario small {
  margin-left: 8px;
  color: var(--texto-suave);
}

.comentario p {
  margin: 4px 0 0;
}

.sin-comentarios {
  color: var(--texto-suave);
  text-align: center;
}

.comentario-enter-active {
  transition: all 0.4s ease;
}

.comentario-enter-from {
  opacity: 0;
  transform: translateY(-16px);
}

.no-existe {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  padding: 40px 16px;
  text-align: center;
}

.no-existe .material-symbols-rounded {
  font-size: 48px;
  color: var(--terracota);
}

@media (min-width: 768px) {
  .portada {
    height: 380px;
  }
  .columnas {
    grid-template-columns: 2fr 3fr; /* ingredientes a la izquierda, pasos a la derecha */
    align-items: start;
  }
  .cabecera {
    padding: 28px;
  }
  .cabecera h1 {
    font-size: 2.2rem;
  }
}

@media (min-width: 1024px) {
  .portada {
    height: 440px;
    max-width: 1140px;
    margin: 24px auto 0;
    border-radius: var(--radio-xl);
    overflow: hidden;
  }
  .acciones {
    max-width: 360px;
  }
}
</style>
