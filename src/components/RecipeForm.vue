<template>
  <form class="formulario" novalidate @submit.prevent="enviar">
    <!-- Vista previa de la imagen (se actualiza sola gracias a v-model) -->
    <div class="vista-previa tarjeta">
      <img v-if="form.imagen && !errores.imagen" :src="form.imagen" alt="Vista previa" @error="errores.imagen = 'No se pudo cargar la imagen de esa URL.'" />
      <div v-else class="vista-previa-vacia">
        <span class="material-symbols-rounded">add_a_photo</span>
        <p>Pegá la URL de una foto para ver la vista previa</p>
      </div>
    </div>

    <div class="tarjeta bloque">
      <h2 class="bloque-titulo"><span class="numero">1</span> Datos principales</h2>

      <div class="campo">
        <label for="titulo">Nombre de la receta *</label>
        <input id="titulo" v-model="form.titulo" class="input" :class="{ 'con-error': errores.titulo }"
          placeholder="Ej: Milanesas a la napolitana" @blur="validarCampo('titulo')" />
        <p v-if="errores.titulo" class="mensaje-error"><span class="material-symbols-rounded">error</span>{{ errores.titulo }}</p>
      </div>

      <div class="campo">
        <label for="descripcion">Descripción *</label>
        <textarea id="descripcion" v-model="form.descripcion" class="input" :class="{ 'con-error': errores.descripcion }"
          placeholder="Contá brevemente cómo es tu plato..." @blur="validarCampo('descripcion')"></textarea>
        <p class="ayuda">{{ caracteresDescripcion }}/200 caracteres</p>
        <p v-if="errores.descripcion" class="mensaje-error"><span class="material-symbols-rounded">error</span>{{ errores.descripcion }}</p>
      </div>

      <div class="fila">
        <div class="campo">
          <label for="categoria">Categoría *</label>
          <select id="categoria" v-model="form.categoria" class="input" :class="{ 'con-error': errores.categoria }" @change="validarCampo('categoria')">
            <option value="" disabled>Elegí una categoría</option>
            <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <p v-if="errores.categoria" class="mensaje-error"><span class="material-symbols-rounded">error</span>{{ errores.categoria }}</p>
        </div>

        <div class="campo">
          <label for="dificultad">Dificultad *</label>
          <select id="dificultad" v-model="form.dificultad" class="input" :class="{ 'con-error': errores.dificultad }" @change="validarCampo('dificultad')">
            <option value="" disabled>Elegí la dificultad</option>
            <option v-for="dif in dificultades" :key="dif" :value="dif">{{ dif }}</option>
          </select>
          <p v-if="errores.dificultad" class="mensaje-error"><span class="material-symbols-rounded">error</span>{{ errores.dificultad }}</p>
        </div>
      </div>

      <div class="fila">
        <div class="campo">
          <label for="tiempo">Tiempo (minutos) *</label>
          <input id="tiempo" v-model.number="form.tiempo" type="number" min="1" max="600" class="input"
            :class="{ 'con-error': errores.tiempo }" @blur="validarCampo('tiempo')" />
          <p v-if="errores.tiempo" class="mensaje-error"><span class="material-symbols-rounded">error</span>{{ errores.tiempo }}</p>
        </div>

        <div class="campo">
          <label for="porciones">Porciones *</label>
          <input id="porciones" v-model.number="form.porciones" type="number" min="1" max="30" class="input"
            :class="{ 'con-error': errores.porciones }" @blur="validarCampo('porciones')" />
          <p v-if="errores.porciones" class="mensaje-error"><span class="material-symbols-rounded">error</span>{{ errores.porciones }}</p>
        </div>
      </div>

      <div class="campo">
        <label for="imagen">URL de la imagen *</label>
        <input id="imagen" v-model.trim="form.imagen" type="url" class="input" :class="{ 'con-error': errores.imagen }"
          placeholder="https://..." @blur="validarCampo('imagen')" />
        <p v-if="errores.imagen" class="mensaje-error"><span class="material-symbols-rounded">error</span>{{ errores.imagen }}</p>
      </div>

      <div class="campo">
        <label for="autor">Tu nombre *</label>
        <input id="autor" v-model="form.autor" class="input" :class="{ 'con-error': errores.autor }"
          placeholder="Ej: Lucía Fernández" @blur="validarCampo('autor')" />
        <p v-if="errores.autor" class="mensaje-error"><span class="material-symbols-rounded">error</span>{{ errores.autor }}</p>
      </div>
    </div>

    <!-- Lista dinámica de ingredientes -->
    <div class="tarjeta bloque">
      <h2 class="bloque-titulo"><span class="numero">2</span> Ingredientes</h2>
      <div class="agregar">
        <input v-model="nuevoIngrediente" class="input" placeholder="Ej: 2 tazas de harina" @keydown.enter.prevent="agregarIngrediente" />
        <button type="button" class="btn btn-secundario" @click="agregarIngrediente">
          <span class="material-symbols-rounded">add</span>
        </button>
      </div>
      <p v-if="errores.nuevoIngrediente" class="mensaje-error"><span class="material-symbols-rounded">error</span>{{ errores.nuevoIngrediente }}</p>

      <transition-group name="lista" tag="ul" class="lista-items">
        <li v-for="(ing, indice) in form.ingredientes" :key="ing" class="item">
          <span class="material-symbols-rounded punto">check_circle</span>
          <span class="item-texto">{{ ing }}</span>
          <button type="button" class="quitar" aria-label="Quitar ingrediente" @click="quitar('ingredientes', indice)">
            <span class="material-symbols-rounded">close</span>
          </button>
        </li>
      </transition-group>
      <p v-if="errores.ingredientes" class="mensaje-error"><span class="material-symbols-rounded">error</span>{{ errores.ingredientes }}</p>
    </div>

    <!-- Lista dinámica de pasos -->
    <div class="tarjeta bloque">
      <h2 class="bloque-titulo"><span class="numero">3</span> Preparación</h2>
      <div class="agregar">
        <textarea v-model="nuevoPaso" class="input paso-input" placeholder="Describí un paso de la preparación"></textarea>
        <button type="button" class="btn btn-secundario" @click="agregarPaso">
          <span class="material-symbols-rounded">add</span>
        </button>
      </div>
      <p v-if="errores.nuevoPaso" class="mensaje-error"><span class="material-symbols-rounded">error</span>{{ errores.nuevoPaso }}</p>

      <transition-group name="lista" tag="ol" class="lista-items">
        <li v-for="(paso, indice) in form.pasos" :key="paso" class="item">
          <span class="paso-numero">{{ indice + 1 }}</span>
          <span class="item-texto">{{ paso }}</span>
          <button type="button" class="quitar" aria-label="Quitar paso" @click="quitar('pasos', indice)">
            <span class="material-symbols-rounded">close</span>
          </button>
        </li>
      </transition-group>
      <p v-if="errores.pasos" class="mensaje-error"><span class="material-symbols-rounded">error</span>{{ errores.pasos }}</p>
    </div>

    <transition name="fade">
      <p v-if="cantidadErrores > 0 && intentoEnviar" class="resumen-errores">
        <span class="material-symbols-rounded">report</span>
        Revisá {{ cantidadErrores }} {{ cantidadErrores === 1 ? 'campo' : 'campos' }} antes de guardar.
      </p>
    </transition>

    <div class="acciones">
      <button type="button" class="btn btn-contorno" @click="$emit('cancelar')">Cancelar</button>
      <button type="submit" class="btn btn-primario" :disabled="guardando">
        <span class="material-symbols-rounded">{{ modoEdicion ? 'save' : 'publish' }}</span>
        {{ modoEdicion ? 'Guardar cambios' : 'Publicar receta' }}
      </button>
    </div>
  </form>
</template>

<script>
import { CATEGORIAS, DIFICULTADES } from '../data/recetasIniciales'
import {
  requerido, longitudMinima, longitudMaxima, numeroEnRango,
  soloLetras, urlValida, listaMinima, primerError
} from '../utils/validaciones'

const FORM_VACIO = {
  titulo: '',
  descripcion: '',
  categoria: '',
  dificultad: '',
  tiempo: 30,
  porciones: 4,
  imagen: '',
  autor: '',
  ingredientes: [],
  pasos: []
}

export default {
  name: 'RecipeForm',
  props: {
    // Si viene una receta, el formulario se usa para EDITAR; si no, para CREAR
    recetaInicial: { type: Object, default: null },
    modoEdicion: { type: Boolean, default: false },
    // Mientras se guarda en Supabase deshabilitamos el botón (evita guardar dos veces)
    guardando: { type: Boolean, default: false }
  },
  emits: ['guardar', 'cancelar'],
  data() {
    return {
      form: { ...FORM_VACIO, ingredientes: [], pasos: [] },
      errores: {},
      nuevoIngrediente: '',
      nuevoPaso: '',
      intentoEnviar: false,
      categorias: CATEGORIAS,
      dificultades: DIFICULTADES
    }
  },
  computed: {
    caracteresDescripcion() {
      return this.form.descripcion.length
    },
    cantidadErrores() {
      return Object.values(this.errores).filter(e => e).length
    }
  },
  created() {
    // Hook created(): antes de mostrar el formulario copiamos la receta a editar.
    // Copiamos (no usamos la misma referencia) para no modificar la prop directamente.
    if (this.recetaInicial) {
      this.form = JSON.parse(JSON.stringify({ ...FORM_VACIO, ...this.recetaInicial }))
    }
  },
  methods: {
    // Reglas de validación de cada campo
    reglas(campo) {
      const f = this.form
      switch (campo) {
        case 'titulo':
          return primerError(
            requerido(f.titulo, 'El nombre'),
            longitudMinima(f.titulo, 3, 'El nombre'),
            longitudMaxima(f.titulo, 60, 'El nombre')
          )
        case 'descripcion':
          return primerError(
            requerido(f.descripcion, 'La descripción'),
            longitudMinima(f.descripcion, 20, 'La descripción'),
            longitudMaxima(f.descripcion, 200, 'La descripción')
          )
        case 'categoria':
          return requerido(f.categoria, 'La categoría')
        case 'dificultad':
          return requerido(f.dificultad, 'La dificultad')
        case 'tiempo':
          return primerError(requerido(f.tiempo, 'El tiempo'), numeroEnRango(f.tiempo, 1, 600, 'El tiempo'))
        case 'porciones':
          return primerError(requerido(f.porciones, 'Las porciones'), numeroEnRango(f.porciones, 1, 30, 'Las porciones'))
        case 'imagen':
          return primerError(requerido(f.imagen, 'La imagen'), urlValida(f.imagen, 'La imagen'))
        case 'autor':
          return primerError(
            requerido(f.autor, 'Tu nombre'),
            longitudMinima(f.autor, 2, 'Tu nombre'),
            soloLetras(f.autor, 'Tu nombre')
          )
        case 'ingredientes':
          return listaMinima(f.ingredientes, 2, 'ingredientes')
        case 'pasos':
          return listaMinima(f.pasos, 2, 'pasos de preparación')
        default:
          return ''
      }
    },
    validarCampo(campo) {
      this.errores[campo] = this.reglas(campo)
    },
    validarTodo() {
      const campos = ['titulo', 'descripcion', 'categoria', 'dificultad', 'tiempo', 'porciones', 'imagen', 'autor', 'ingredientes', 'pasos']
      campos.forEach(campo => this.validarCampo(campo))
      return this.cantidadErrores === 0
    },
    agregarIngrediente() {
      const texto = this.nuevoIngrediente.trim()
      this.errores.nuevoIngrediente = primerError(
        longitudMinima(texto, 2, 'El ingrediente'),
        this.form.ingredientes.includes(texto) ? 'Ese ingrediente ya está en la lista.' : ''
      )
      if (this.errores.nuevoIngrediente) return
      this.form.ingredientes.push(texto)
      this.nuevoIngrediente = ''
      if (this.intentoEnviar) this.validarCampo('ingredientes')
    },
    agregarPaso() {
      const texto = this.nuevoPaso.trim()
      this.errores.nuevoPaso = primerError(
        longitudMinima(texto, 10, 'Cada paso'),
        this.form.pasos.includes(texto) ? 'Ese paso ya está en la lista.' : ''
      )
      if (this.errores.nuevoPaso) return
      this.form.pasos.push(texto)
      this.nuevoPaso = ''
      if (this.intentoEnviar) this.validarCampo('pasos')
    },
    quitar(lista, indice) {
      this.form[lista].splice(indice, 1)
      if (this.intentoEnviar) this.validarCampo(lista)
    },
    enviar() {
      this.intentoEnviar = true
      this.errores.nuevoIngrediente = ''
      this.errores.nuevoPaso = ''
      if (!this.validarTodo()) {
        // Llevamos al usuario hasta el primer campo con error
        this.$nextTick(() => {
          const primero = this.$el.querySelector('.con-error, .mensaje-error')
          if (primero) primero.scrollIntoView({ behavior: 'smooth', block: 'center' })
        })
        return
      }
      // Emitimos los datos al padre; el padre decide si crea o actualiza
      this.$emit('guardar', {
        titulo: this.form.titulo.trim(),
        descripcion: this.form.descripcion.trim(),
        categoria: this.form.categoria,
        dificultad: this.form.dificultad,
        tiempo: this.form.tiempo,
        porciones: this.form.porciones,
        imagen: this.form.imagen,
        autor: this.form.autor.trim(),
        ingredientes: [...this.form.ingredientes],
        pasos: [...this.form.pasos]
      })
    }
  }
}
</script>

<style scoped>
.formulario {
  display: grid;
  gap: 16px;
}

.vista-previa {
  overflow: hidden;
  aspect-ratio: 16 / 9;
}

.vista-previa img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vista-previa-vacia {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 16px;
  border: 2px dashed var(--borde);
  border-radius: var(--radio-lg);
  background: var(--piedra);
  color: var(--texto-suave);
  text-align: center;
}

.vista-previa-vacia .material-symbols-rounded {
  font-size: 40px;
  color: var(--verde);
}

.bloque {
  padding: 20px 16px 4px;
}

.bloque-titulo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  margin-bottom: 16px;
}

.numero,
.paso-numero {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--verde-suave);
  color: var(--verde);
  font-weight: 700;
  font-size: 0.85rem;
}

.fila {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0 16px;
}

.agregar {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.agregar .btn {
  flex-shrink: 0;
  padding: 0 14px;
}

.paso-input {
  min-height: 70px !important;
}

.lista-items {
  list-style: none;
  margin: 12px 0 16px;
  padding: 0;
  display: grid;
  gap: 8px;
}

.item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 8px 10px 12px;
  background: var(--piedra);
  border-radius: var(--radio);
}

.punto {
  color: var(--verde);
  font-size: 20px;
  margin-top: 2px;
}

.item-texto {
  flex: 1;
  padding-top: 2px;
  font-size: 0.92rem;
}

.quitar {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--texto-suave);
  cursor: pointer;
}

.quitar:hover {
  background: var(--error-suave);
  color: var(--error);
}

.resumen-errores {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 12px 16px;
  border-radius: var(--radio);
  background: var(--error-suave);
  color: var(--error);
  font-weight: 600;
}

.acciones {
  display: flex;
  gap: 12px;
}

.acciones .btn {
  flex: 1;
}

/* transition-group: cada ítem entra deslizándose y sale achicándose */
.lista-enter-active,
.lista-leave-active {
  transition: all 0.3s ease;
}

.lista-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.lista-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.lista-move {
  transition: transform 0.3s ease;
}

@media (min-width: 600px) {
  .fila {
    grid-template-columns: 1fr 1fr;
  }
  .bloque {
    padding: 24px 24px 8px;
  }
}
</style>
