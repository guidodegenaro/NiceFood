# Pasos del segundo cuatrimestre · Supabase + GitHub + Vercel

El código ya está preparado. Lo que sigue lo tenés que hacer vos, porque necesita tus cuentas.
El orden es el de la consigna.

> En la consigna, el profe arma la app con **Google AI Studio**. NiceFood ya está hecha con Vue CLI,
> así que **Google AI Studio no hace falta**: el SQL ya está escrito en `supabase/schema.sql` y la
> conexión con Supabase ya está programada. Si te piden mostrar el prompt, ver el final de este archivo.

---

## 1. Supabase: crear el proyecto

1. Entrá a [supabase.com](https://supabase.com) → **New project**.
2. Nombre: `nicefood`. Elegí una contraseña para la base de datos y la región más cercana (São Paulo).
3. Esperá que termine de crearse (1–2 minutos).
4. **Copiá la URL del proyecto** (`https://xxxx.supabase.co`) → la pide el campus.

## 2. Crear las tablas (SQL Editor)

1. En Supabase: menú izquierdo → **SQL Editor** → **New query**.
2. Abrí [`supabase/schema.sql`](supabase/schema.sql), copiá **todo** y pegalo.
3. Tocá **Run**. Tiene que decir *Success. No rows returned*.
4. Revisá en **Table Editor** que estén las tablas `perfiles`, `recetas` (17 filas), `calificaciones`,
   `comentarios` y `favoritos`.

> ⚠️ Corrélo **una sola vez**. Si lo corrés de nuevo se duplican las recetas de ejemplo
> (en ese caso borrá la sección 5 del archivo antes de volver a ejecutarlo).

## 3. Login con Google (Auth → Sign In / Providers → Google)

Para esto hacen falta credenciales de Google:

1. Entrá a [console.cloud.google.com](https://console.cloud.google.com) → creá un proyecto (`NiceFood`).
2. **APIs y servicios → Pantalla de consentimiento de OAuth**: tipo *Externo*, nombre "NiceFood", tu email. Guardar.
3. **APIs y servicios → Credenciales → Crear credenciales → ID de cliente de OAuth**:
   - Tipo: **Aplicación web**.
   - **URI de redireccionamiento autorizados**: pegá la *Callback URL* que muestra Supabase
     en Authentication → Sign In / Providers → Google (es algo como `https://xxxx.supabase.co/auth/v1/callback`).
4. Google te da un **Client ID** y un **Client Secret**.
5. En Supabase: **Authentication → Sign In / Providers → Google** → activalo, pegá el Client ID y el Secret → **Save**.
6. En Supabase: **Authentication → URL Configuration**:
   - **Site URL**: la URL de Vercel (paso 6). Mientras tanto: `http://localhost:8080`.
   - **Redirect URLs**: agregá `http://localhost:8080/**` y después `https://TU-APP.vercel.app/**`.

## 4. Conectar la app (Connect → framework Vue)

1. En Supabase tocá **Connect** (arriba) → pestaña **App Frameworks** → elegí **Vue**.
2. Ahí aparecen la **URL** y la clave pública (puede llamarse **anon key** o **publishable key**, `sb_publishable_...`; sirve cualquiera de las dos).
3. En la carpeta `nicefood`, copiá `.env.example` como **`.env.local`** y pegá los valores
   (ojo: en Vue CLI el prefijo es **`VUE_APP_`**, no `VITE_`):
   ```
   VUE_APP_SUPABASE_URL=https://xxxx.supabase.co
   VUE_APP_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
4. Reiniciá `npm run serve`. Ahora arriba a la derecha aparece **Ingresar** → entrá con Google.

> `.env.local` **no se sube a GitHub** (está en `.gitignore`). La anon key es pública por diseño:
> la seguridad la dan las políticas RLS del SQL.

## 5. GitHub

```bash
cd nicefood
git init
git add .
git commit -m "NiceFood: SPA de recetas con Vue, Supabase y Google Auth"
```
Creá un repositorio vacío en [github.com/new](https://github.com/new) (`nicefood`) y seguí las instrucciones
de "push an existing repository":
```bash
git remote add origin https://github.com/TU-USUARIO/nicefood.git
git branch -M main
git push -u origin main
```

## 6. Vercel (publicar)

1. [vercel.com](https://vercel.com) → **Add New → Project** → importá el repo `nicefood`.
2. Framework: **Vue.js** (lo detecta solo). Build: `npm run build`. Output: `dist`.
3. **Environment Variables**: agregá las mismas dos variables del `.env.local`
   (`VUE_APP_SUPABASE_URL` y `VUE_APP_SUPABASE_ANON_KEY`).
4. **Deploy**. Copiá la URL (`https://nicefood-xxx.vercel.app`) → **al campus**.
5. Volvé a Supabase → Authentication → URL Configuration y poné esa URL como **Site URL**
   y en **Redirect URLs** (`https://nicefood-xxx.vercel.app/**`). Si no, el login con Google vuelve a localhost.

## 7. Comprobar que todo anda

- Entrar con Google → aparece tu foto arriba a la derecha.
- En Supabase → Authentication → Users aparece tu usuario, y en Table Editor → `perfiles` tu perfil.
- Crear una receta → aparece en la tabla `recetas` con tu `usuario_id`.
- Calificar, comentar y marcar favorita → aparecen filas en esas tablas.
- Abrir la app en otro navegador → se ven las mismas recetas (datos compartidos en la nube).

---

## Qué cambió en el código

| Archivo | Para qué |
|---|---|
| `src/lib/supabase.js` | Crea el cliente de Supabase con las variables de entorno |
| `src/lib/auth.js` | Login/logout con Google y el estado reactivo `sesion` |
| `src/services/recetas.js` | CRUD contra Supabase (y LocalStorage si no está configurado o como caché sin internet) |
| `src/views/IngresarView.vue` | Pantalla "Continuar con Google" / perfil / cerrar sesión |
| `src/router/index.js` | Ruta `/ingresar` + guard: crear/editar exige sesión |
| `src/components/AppHeader.vue` | Botón Ingresar / foto del usuario |
| `supabase/schema.sql` | Tablas, seguridad RLS, trigger de perfiles y recetas de ejemplo |
| `.env.example` | Modelo de las variables de entorno |

Si `.env.local` no existe, la app funciona igual que antes (**modo local**, todo en LocalStorage).

---

## Prompt para Google AI Studio (por si lo piden)

> Tengo una SPA de recetas hecha con Vue 3 + Vue CLI conectada a Supabase con login de Google.
> Generá el SQL para Supabase con: tabla `perfiles` vinculada a `auth.users` con trigger al registrarse;
> tabla `recetas` (título, descripción, categoría, dificultad, tiempo, porciones, imagen, autor,
> ingredientes y pasos en jsonb, usuario dueño); tablas `calificaciones` (1 voto por usuario),
> `comentarios` y `favoritos`; Row Level Security para que todos lean y solo el dueño modifique;
> y datos de ejemplo.

El resultado es equivalente a `supabase/schema.sql`, que ya está probado.
