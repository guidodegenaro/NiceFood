// Punto de entrada de la aplicación.
// Primero averiguamos si hay un usuario con sesión iniciada (Supabase Auth),
// después creamos la app de Vue, le agregamos el router y la montamos en <div id="app">.
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { iniciarAuth } from './lib/auth'
import './assets/main.css'

iniciarAuth().finally(() => {
  createApp(App).use(router).mount('#app')
})
