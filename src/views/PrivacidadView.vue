<template>
  <div class="contenedor legal">
    <section class="tarjeta bloque">
      <h1>Política de privacidad</h1>
      <p class="ayuda">Última actualización: noviembre de 2026</p>

      <p>
        NiceFood es un proyecto educativo (Práctica Profesionalizante Desarrollo Web y Mobile · ISEC).
        Esta página explica qué datos usa la aplicación y para qué.
      </p>

      <h2>Qué datos usamos</h2>
      <ul>
        <li>
          Si iniciás sesión con <strong>Google</strong>, recibimos solo tu <strong>nombre</strong>, tu
          <strong>email</strong> y tu <strong>foto de perfil</strong>. No accedemos a tu contraseña,
          a tus contactos ni a ningún otro dato de tu cuenta.
        </li>
        <li>
          El contenido que publicás: recetas, calificaciones, comentarios y favoritos.
        </li>
      </ul>

      <h2>Para qué los usamos</h2>
      <ul>
        <li>Para identificarte y mostrar tu nombre y foto como autor de tus recetas y comentarios.</li>
        <li>Para que solo vos puedas editar o borrar lo que publicaste.</li>
      </ul>
      <p>No vendemos ni compartimos tus datos con terceros, y no se usan con fines publicitarios.</p>

      <h2>Dónde se guardan</h2>
      <p>
        Los datos se guardan en <strong>Supabase</strong> (base de datos y autenticación). Además, el
        navegador guarda una copia de las recetas en el <strong>LocalStorage</strong> para poder verlas
        sin conexión.
      </p>

      <h2>Cómo borrar tus datos</h2>
      <p>
        Podés borrar tus recetas desde la app en cualquier momento. Para eliminar tu cuenta y todos tus
        datos, pedilo a través del
        <a href="https://github.com/guidodegenaro/NiceFood" target="_blank" rel="noopener">repositorio del proyecto</a>.
      </p>
    </section>

    <section id="terminos" class="tarjeta bloque">
      <h1>Condiciones del servicio</h1>
      <ul>
        <li>NiceFood es un proyecto académico y se ofrece gratis, tal como está, sin garantías.</li>
        <li>Sos responsable del contenido que publicás. No subas contenido ofensivo ni que no te pertenezca.</li>
        <li>Las recetas de la sección Explorar provienen de la API pública de TheMealDB.</li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: 'PrivacidadView'
}
</script>

<style scoped>
.legal {
  display: grid;
  gap: 16px;
  max-width: 800px;
  padding-top: 24px;
}

.bloque {
  padding: 24px 20px;
  line-height: 1.6;
}

.bloque h1 {
  margin-top: 0;
  font-size: 1.6rem;
}

.bloque h2 {
  margin: 20px 0 6px;
  font-size: 1.1rem;
  color: var(--verde);
}

.bloque ul {
  padding-left: 20px;
}

.bloque a {
  color: var(--verde);
}
</style>
