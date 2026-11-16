-- =====================================================================
--  NiceFood · Base de datos en Supabase
--  Cómo usarlo: Supabase → SQL Editor → New query → pegar TODO → Run
--  Crea: usuarios (perfiles), recetas, calificaciones, comentarios y favoritos,
--  con seguridad por filas (RLS) y las 17 recetas de ejemplo.
-- =====================================================================

-- ---------- 1. USUARIOS: perfil público de cada persona que inicia sesión ----------
create table if not exists public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text,
  avatar_url text,
  email text,
  creado_en timestamptz not null default now()
);

-- Cuando alguien entra por primera vez con Google, se crea su perfil automáticamente
create or replace function public.crear_perfil_nuevo_usuario()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfiles (id, nombre, avatar_url, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', new.email),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'),
    new.email
  );
  return new;
end;
$$;

drop trigger if exists al_crear_usuario on auth.users;
create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.crear_perfil_nuevo_usuario();

-- ---------- 2. DATOS: recetas ----------
create table if not exists public.recetas (
  id bigint generated always as identity primary key,
  usuario_id uuid references auth.users (id) on delete set null, -- null = receta de ejemplo
  titulo text not null check (char_length(titulo) between 3 and 60),
  descripcion text not null check (char_length(descripcion) between 20 and 200),
  categoria text not null check (categoria in ('Desayunos', 'Platos principales', 'Pastas', 'Veggie', 'Sopas', 'Postres')),
  dificultad text not null check (dificultad in ('Fácil', 'Media', 'Difícil')),
  tiempo int not null check (tiempo between 1 and 600),
  porciones int not null check (porciones between 1 and 30),
  imagen text not null,
  autor text not null,
  ingredientes jsonb not null default '[]'::jsonb,
  pasos jsonb not null default '[]'::jsonb,
  id_api text, -- si se importó desde TheMealDB
  creado_en timestamptz not null default now()
);

-- ---------- 3. Interacciones: calificaciones, comentarios y favoritos ----------
create table if not exists public.calificaciones (
  id bigint generated always as identity primary key,
  receta_id bigint not null references public.recetas (id) on delete cascade,
  usuario_id uuid references auth.users (id) on delete cascade,
  estrellas int not null check (estrellas between 1 and 5),
  creado_en timestamptz not null default now(),
  unique (receta_id, usuario_id) -- un voto por persona
);

create table if not exists public.comentarios (
  id bigint generated always as identity primary key,
  receta_id bigint not null references public.recetas (id) on delete cascade,
  usuario_id uuid references auth.users (id) on delete cascade,
  autor text not null,
  texto text not null check (char_length(texto) between 5 and 300),
  creado_en timestamptz not null default now()
);

create table if not exists public.favoritos (
  receta_id bigint not null references public.recetas (id) on delete cascade,
  usuario_id uuid not null references auth.users (id) on delete cascade,
  creado_en timestamptz not null default now(),
  primary key (receta_id, usuario_id)
);

-- ---------- 4. Seguridad (Row Level Security) ----------
-- Todos pueden LEER las recetas; solo el dueño puede modificar o borrar lo suyo.
alter table public.perfiles enable row level security;
alter table public.recetas enable row level security;
alter table public.calificaciones enable row level security;
alter table public.comentarios enable row level security;
alter table public.favoritos enable row level security;

drop policy if exists "perfiles visibles" on public.perfiles;
create policy "perfiles visibles" on public.perfiles for select using (true);
drop policy if exists "editar mi perfil" on public.perfiles;
create policy "editar mi perfil" on public.perfiles for update to authenticated using ((select auth.uid()) = id);

drop policy if exists "recetas visibles" on public.recetas;
create policy "recetas visibles" on public.recetas for select using (true);
drop policy if exists "crear mis recetas" on public.recetas;
create policy "crear mis recetas" on public.recetas for insert to authenticated with check ((select auth.uid()) = usuario_id);
drop policy if exists "editar mis recetas" on public.recetas;
create policy "editar mis recetas" on public.recetas for update to authenticated using ((select auth.uid()) = usuario_id);
drop policy if exists "borrar mis recetas" on public.recetas;
create policy "borrar mis recetas" on public.recetas for delete to authenticated using ((select auth.uid()) = usuario_id);

drop policy if exists "calificaciones visibles" on public.calificaciones;
create policy "calificaciones visibles" on public.calificaciones for select using (true);
drop policy if exists "calificar" on public.calificaciones;
create policy "calificar" on public.calificaciones for insert to authenticated with check ((select auth.uid()) = usuario_id);
drop policy if exists "cambiar mi voto" on public.calificaciones;
create policy "cambiar mi voto" on public.calificaciones for update to authenticated using ((select auth.uid()) = usuario_id);

drop policy if exists "comentarios visibles" on public.comentarios;
create policy "comentarios visibles" on public.comentarios for select using (true);
drop policy if exists "comentar" on public.comentarios;
create policy "comentar" on public.comentarios for insert to authenticated with check ((select auth.uid()) = usuario_id);
drop policy if exists "borrar mi comentario" on public.comentarios;
create policy "borrar mi comentario" on public.comentarios for delete to authenticated using ((select auth.uid()) = usuario_id);

drop policy if exists "ver mis favoritos" on public.favoritos;
create policy "ver mis favoritos" on public.favoritos for select to authenticated using ((select auth.uid()) = usuario_id);
drop policy if exists "agregar favorito" on public.favoritos;
create policy "agregar favorito" on public.favoritos for insert to authenticated with check ((select auth.uid()) = usuario_id);
drop policy if exists "quitar favorito" on public.favoritos;
create policy "quitar favorito" on public.favoritos for delete to authenticated using ((select auth.uid()) = usuario_id);

-- Permisos para la API de Supabase (anon = visitante, authenticated = usuario logueado)
grant select on public.perfiles, public.recetas, public.calificaciones, public.comentarios to anon, authenticated;
grant select, insert, update, delete on public.recetas, public.calificaciones, public.comentarios, public.favoritos to authenticated;
grant update on public.perfiles to authenticated;

-- ---------- 5. Recetas de ejemplo ----------
-- Si lo corrés dos veces, comentá esta sección para no duplicar las recetas.
with r as (
  insert into public.recetas (titulo, descripcion, categoria, dificultad, tiempo, porciones, imagen, autor, ingredientes, pasos, creado_en)
  values ('Panqueques clásicos', 'Finitos, dorados y listos para rellenar con dulce de leche o lo que más te guste.', 'Desayunos', 'Fácil', 20, 4, 'https://www.themealdb.com/images/media/meals/rwuyqx1511383174.jpg', 'Lucía Fernández', '["2 huevos","250 ml de leche","120 g de harina","1 cda de azúcar","Manteca para la sartén"]'::jsonb, '["Mezclar los huevos con la leche y el azúcar.","Agregar la harina de a poco batiendo hasta que no queden grumos.","Dejar reposar la mezcla 10 minutos.","Cocinar en sartén con manteca, un cucharón por panqueque, vuelta y vuelta."]'::jsonb, '2026-08-02T10:00:00.000Z')
  returning id
), c as (
  insert into public.calificaciones (receta_id, estrellas)
  select id, e from r, unnest(array[5, 4, 5]) as e
)
insert into public.comentarios (receta_id, autor, texto, creado_en)
select id, x.autor, x.texto, x.creado_en::timestamptz from r, (values ('Martín', 'Salieron perfectos, los rellené con dulce de leche.', '2026-08-05T12:00:00.000Z')) as x(autor, texto, creado_en);

with r as (
  insert into public.recetas (titulo, descripcion, categoria, dificultad, tiempo, porciones, imagen, autor, ingredientes, pasos, creado_en)
  values ('Omelette francés', 'Un omelette suave y cremoso por dentro, ideal para un desayuno rápido y nutritivo.', 'Desayunos', 'Media', 10, 1, 'https://www.themealdb.com/images/media/meals/yvpuuy1511797244.jpg', 'Tomás Ruiz', '["3 huevos","1 cda de manteca","Sal y pimienta","Ciboulette picada"]'::jsonb, '["Batir los huevos con sal y pimienta.","Derretir la manteca a fuego medio en una sartén antiadherente.","Volcar los huevos y mover la sartén mientras se cuajan.","Doblar en tres y servir con ciboulette por encima."]'::jsonb, '2026-08-10T09:00:00.000Z')
  returning id
), c as (
  insert into public.calificaciones (receta_id, estrellas)
  select id, e from r, unnest(array[4, 4]) as e
)
select id from r;

with r as (
  insert into public.recetas (titulo, descripcion, categoria, dificultad, tiempo, porciones, imagen, autor, ingredientes, pasos, creado_en)
  values ('Panqueques de avena y banana', 'Versión saludable sin harina blanca, endulzada solo con banana madura.', 'Desayunos', 'Fácil', 15, 2, 'https://www.themealdb.com/images/media/meals/c400ok1764439058.jpg', 'Sofía Gómez', '["1 taza de avena","1 banana madura","1 huevo","1/2 taza de leche","1 cdita de polvo de hornear"]'::jsonb, '["Procesar todos los ingredientes hasta lograr una mezcla lisa.","Calentar una sartén apenas aceitada.","Cocinar pequeñas porciones hasta que aparezcan burbujas y dar vuelta.","Servir con frutas y miel."]'::jsonb, '2026-09-01T08:30:00.000Z')
  returning id
), c as (
  insert into public.calificaciones (receta_id, estrellas)
  select id, e from r, unnest(array[5, 5, 4, 5]) as e
)
select id from r;

with r as (
  insert into public.recetas (titulo, descripcion, categoria, dificultad, tiempo, porciones, imagen, autor, ingredientes, pasos, creado_en)
  values ('Lasaña de carne', 'Capas de pasta, salsa boloñesa y bechamel gratinadas al horno. Un clásico de domingo.', 'Pastas', 'Difícil', 90, 6, 'https://www.themealdb.com/images/media/meals/wtsvxx1511296896.jpg', 'Nonna Rosa', '["500 g de carne picada","12 láminas de lasaña","500 ml de salsa de tomate","500 ml de bechamel","200 g de mozzarella","1 cebolla"]'::jsonb, '["Rehogar la cebolla, agregar la carne y luego la salsa de tomate. Cocinar 20 minutos.","En una fuente alternar capas de salsa, láminas de pasta y bechamel.","Terminar con bechamel y mozzarella.","Hornear 40 minutos a 180 °C y dejar reposar antes de cortar."]'::jsonb, '2026-07-20T13:00:00.000Z')
  returning id
), c as (
  insert into public.calificaciones (receta_id, estrellas)
  select id, e from r, unnest(array[5, 5, 5, 4, 5]) as e
)
insert into public.comentarios (receta_id, autor, texto, creado_en)
select id, x.autor, x.texto, x.creado_en::timestamptz from r, (values ('Carla', 'La hice para el cumple de mi papá, un éxito total.', '2026-07-28T20:00:00.000Z'), ('Diego', 'Le agregué espinaca entre capas y quedó genial.', '2026-08-01T21:00:00.000Z')) as x(autor, texto, creado_en);

with r as (
  insert into public.recetas (titulo, descripcion, categoria, dificultad, tiempo, porciones, imagen, autor, ingredientes, pasos, creado_en)
  values ('Spaghetti a la boloñesa', 'Salsa de carne cocinada lentamente con tomate y vino tinto sobre spaghetti al dente.', 'Pastas', 'Media', 45, 4, 'https://www.themealdb.com/images/media/meals/sutysw1468247559.jpg', 'Tomás Ruiz', '["400 g de spaghetti","400 g de carne picada","1 lata de tomate triturado","1 zanahoria","1 cebolla","1/2 vaso de vino tinto"]'::jsonb, '["Picar cebolla y zanahoria y rehogar en aceite de oliva.","Agregar la carne y dorar. Desglasar con el vino.","Sumar el tomate y cocinar a fuego bajo 30 minutos.","Hervir la pasta, escurrir y mezclar con la salsa."]'::jsonb, '2026-08-15T19:00:00.000Z')
  returning id
), c as (
  insert into public.calificaciones (receta_id, estrellas)
  select id, e from r, unnest(array[4, 5, 4]) as e
)
select id from r;

with r as (
  insert into public.recetas (titulo, descripcion, categoria, dificultad, tiempo, porciones, imagen, autor, ingredientes, pasos, creado_en)
  values ('Spaghetti carbonara', 'La receta romana auténtica: sin crema, solo huevo, queso, panceta y pimienta negra.', 'Pastas', 'Media', 25, 2, 'https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg', 'Marco Bianchi', '["200 g de spaghetti","100 g de panceta","2 yemas y 1 huevo","50 g de queso pecorino","Pimienta negra"]'::jsonb, '["Dorar la panceta en cubos sin aceite.","Batir huevos con el queso rallado y mucha pimienta.","Hervir la pasta y reservar un poco del agua de cocción.","Fuera del fuego, mezclar pasta, panceta y huevos agregando agua hasta lograr una crema."]'::jsonb, '2026-09-12T20:30:00.000Z')
  returning id
), c as (
  insert into public.calificaciones (receta_id, estrellas)
  select id, e from r, unnest(array[5, 4, 5]) as e
)
select id from r;

with r as (
  insert into public.recetas (titulo, descripcion, categoria, dificultad, tiempo, porciones, imagen, autor, ingredientes, pasos, creado_en)
  values ('Empanadas de carne cortada a cuchillo', 'Empanadas jugosas al horno con relleno de carne, cebolla, huevo y aceitunas.', 'Platos principales', 'Media', 60, 12, 'https://www.themealdb.com/images/media/meals/dxpc7j1764370714.jpg', 'Lucía Fernández', '["12 tapas de empanada","500 g de carne cortada a cuchillo","2 cebollas","2 huevos duros","Aceitunas verdes","Comino y pimentón"]'::jsonb, '["Rehogar las cebollas, agregar la carne y condimentar con comino y pimentón.","Dejar enfriar el relleno y sumar huevo duro y aceitunas picadas.","Rellenar las tapas y hacer el repulgue.","Hornear a 200 °C durante 20 minutos hasta dorar."]'::jsonb, '2026-07-09T12:00:00.000Z')
  returning id
), c as (
  insert into public.calificaciones (receta_id, estrellas)
  select id, e from r, unnest(array[5, 5, 5, 5]) as e
)
insert into public.comentarios (receta_id, autor, texto, creado_en)
select id, x.autor, x.texto, x.creado_en::timestamptz from r, (values ('Pablo', '¡Las mejores empanadas que probé fuera de Tucumán!', '2026-07-10T22:00:00.000Z')) as x(autor, texto, creado_en);

with r as (
  insert into public.recetas (titulo, descripcion, categoria, dificultad, tiempo, porciones, imagen, autor, ingredientes, pasos, creado_en)
  values ('Matambre a la pizza', 'Matambre tierno cubierto con salsa, mozzarella y orégano. Ideal para la parrilla o el horno.', 'Platos principales', 'Media', 120, 4, 'https://www.themealdb.com/images/media/meals/wf49qs1763075222.jpg', 'Diego Paredes', '["1 matambre de ternera","1 litro de leche","300 g de mozzarella","Salsa de tomate","Orégano"]'::jsonb, '["Cocinar el matambre en leche a fuego bajo durante 1 hora y media.","Pasarlo a una placa o a la parrilla para dorarlo de ambos lados.","Cubrir con salsa de tomate y mozzarella.","Gratinar y terminar con orégano."]'::jsonb, '2026-08-20T14:00:00.000Z')
  returning id
), c as (
  insert into public.calificaciones (receta_id, estrellas)
  select id, e from r, unnest(array[5, 4]) as e
)
select id from r;

with r as (
  insert into public.recetas (titulo, descripcion, categoria, dificultad, tiempo, porciones, imagen, autor, ingredientes, pasos, creado_en)
  values ('Curry de pollo con maní', 'Pollo en salsa cremosa de curry y maní, perfumado y apenas picante. Va muy bien con arroz.', 'Platos principales', 'Media', 40, 4, 'https://www.themealdb.com/images/media/meals/yxsurp1511304301.jpg', 'Priya Shah', '["600 g de pechuga de pollo","2 cdas de pasta de curry","400 ml de leche de coco","2 cdas de mantequilla de maní","1 cebolla","Arroz blanco"]'::jsonb, '["Dorar el pollo en cubos y retirar.","Rehogar la cebolla con la pasta de curry.","Agregar leche de coco y mantequilla de maní, mezclar.","Volver a incorporar el pollo y cocinar 15 minutos. Servir con arroz."]'::jsonb, '2026-09-05T20:00:00.000Z')
  returning id
), c as (
  insert into public.calificaciones (receta_id, estrellas)
  select id, e from r, unnest(array[4, 5]) as e
)
select id from r;

with r as (
  insert into public.recetas (titulo, descripcion, categoria, dificultad, tiempo, porciones, imagen, autor, ingredientes, pasos, creado_en)
  values ('Tacos de pescado cajún', 'Pescado especiado y crocante en tortillas con repollo, palta y salsa de lima.', 'Platos principales', 'Fácil', 30, 3, 'https://www.themealdb.com/images/media/meals/uvuyxu1503067369.jpg', 'Camila Ortiz', '["400 g de filet de merluza","6 tortillas","1 cda de especias cajún","1/4 de repollo","1 palta","1 lima"]'::jsonb, '["Condimentar el pescado con las especias cajún.","Cocinarlo a la plancha 3 minutos por lado.","Calentar las tortillas.","Armar los tacos con repollo, pescado, palta y jugo de lima."]'::jsonb, '2026-09-20T13:30:00.000Z')
  returning id
), c as (
  insert into public.calificaciones (receta_id, estrellas)
  select id, e from r, unnest(array[4, 4, 5]) as e
)
select id from r;

with r as (
  insert into public.recetas (titulo, descripcion, categoria, dificultad, tiempo, porciones, imagen, autor, ingredientes, pasos, creado_en)
  values ('Falafel casero', 'Croquetas de garbanzos crocantes por fuera y verdes por dentro, con salsa de yogur.', 'Veggie', 'Media', 35, 4, 'https://www.themealdb.com/images/media/meals/u5e9qq1763795441.jpg', 'Sofía Gómez', '["300 g de garbanzos remojados","1 cebolla","2 dientes de ajo","Perejil y cilantro","1 cdita de comino","Aceite para freír"]'::jsonb, '["Procesar garbanzos crudos con cebolla, ajo, hierbas y comino.","Formar bolitas con las manos húmedas.","Freír en aceite caliente hasta dorar.","Servir con salsa de yogur y pan pita."]'::jsonb, '2026-08-28T18:00:00.000Z')
  returning id
), c as (
  insert into public.calificaciones (receta_id, estrellas)
  select id, e from r, unnest(array[5, 4, 4]) as e
)
select id from r;

with r as (
  insert into public.recetas (titulo, descripcion, categoria, dificultad, tiempo, porciones, imagen, autor, ingredientes, pasos, creado_en)
  values ('Ensalada Shopska', 'Ensalada fresca de tomate, pepino, morrón y queso rallado. Lista en 15 minutos.', 'Veggie', 'Fácil', 15, 2, 'https://www.themealdb.com/images/media/meals/bqx8mc1782684286.jpg', 'Iván Petrov', '["3 tomates","1 pepino","1 morrón asado","1/2 cebolla morada","100 g de queso feta","Aceite de oliva"]'::jsonb, '["Cortar los vegetales en cubos parejos.","Condimentar con sal, aceite de oliva y vinagre.","Rallar el queso por encima justo antes de servir."]'::jsonb, '2026-10-01T12:30:00.000Z')
  returning id
), c as (
  insert into public.calificaciones (receta_id, estrellas)
  select id, e from r, unnest(array[4]) as e
)
select id from r;

with r as (
  insert into public.recetas (titulo, descripcion, categoria, dificultad, tiempo, porciones, imagen, autor, ingredientes, pasos, creado_en)
  values ('Sopa de arvejas partidas', 'Sopa espesa y reconfortante para los días fríos, con vegetales y un toque ahumado.', 'Sopas', 'Fácil', 70, 6, 'https://www.themealdb.com/images/media/meals/xxtsvx1511814083.jpg', 'Nonna Rosa', '["400 g de arvejas partidas","2 zanahorias","1 cebolla","2 papas","1,5 l de caldo de verduras","Pimentón ahumado"]'::jsonb, '["Rehogar cebolla y zanahoria picadas.","Agregar arvejas, papas en cubos y el caldo.","Cocinar a fuego bajo 50 minutos revolviendo de vez en cuando.","Licuar la mitad para espesar y condimentar con pimentón."]'::jsonb, '2026-06-18T19:00:00.000Z')
  returning id
), c as (
  insert into public.calificaciones (receta_id, estrellas)
  select id, e from r, unnest(array[4, 3, 4]) as e
)
select id from r;

with r as (
  insert into public.recetas (titulo, descripcion, categoria, dificultad, tiempo, porciones, imagen, autor, ingredientes, pasos, creado_en)
  values ('Flan casero con dulce de leche', 'El postre de la abuela: suave, con caramelo y una buena cucharada de dulce de leche.', 'Postres', 'Media', 60, 8, 'https://www.themealdb.com/images/media/meals/0s80wo1764374393.jpg', 'Lucía Fernández', '["6 huevos","1 litro de leche","200 g de azúcar","1 cdita de esencia de vainilla","Azúcar para el caramelo"]'::jsonb, '["Hacer un caramelo en la flanera y dejar enfriar.","Batir huevos con azúcar, leche y vainilla sin incorporar aire.","Volcar en la flanera y cocinar a baño María 50 minutos a 170 °C.","Enfriar en la heladera y desmoldar. Servir con dulce de leche."]'::jsonb, '2026-07-30T17:00:00.000Z')
  returning id
), c as (
  insert into public.calificaciones (receta_id, estrellas)
  select id, e from r, unnest(array[5, 5, 4, 5]) as e
)
select id from r;

with r as (
  insert into public.recetas (titulo, descripcion, categoria, dificultad, tiempo, porciones, imagen, autor, ingredientes, pasos, creado_en)
  values ('Cheesecake de dulce de leche', 'Base de galletitas María, relleno de queso crema y una capa generosa de dulce de leche.', 'Postres', 'Difícil', 80, 10, 'https://www.themealdb.com/images/media/meals/f9qog11784574376.jpg', 'Camila Ortiz', '["200 g de galletitas María","100 g de manteca","600 g de queso crema","3 huevos","150 g de azúcar","400 g de dulce de leche"]'::jsonb, '["Procesar las galletitas con la manteca y forrar un molde.","Batir queso crema, azúcar y huevos.","Hornear a 160 °C durante 50 minutos.","Enfriar y cubrir con dulce de leche."]'::jsonb, '2026-10-10T16:00:00.000Z')
  returning id
), c as (
  insert into public.calificaciones (receta_id, estrellas)
  select id, e from r, unnest(array[5, 5]) as e
)
select id from r;

with r as (
  insert into public.recetas (titulo, descripcion, categoria, dificultad, tiempo, porciones, imagen, autor, ingredientes, pasos, creado_en)
  values ('Brownies con frambuesas', 'Brownies húmedos de chocolate amargo con frambuesas que aportan acidez.', 'Postres', 'Fácil', 45, 12, 'https://www.themealdb.com/images/media/meals/yypvst1511386427.jpg', 'Martina López', '["200 g de chocolate amargo","150 g de manteca","3 huevos","200 g de azúcar","100 g de harina","150 g de frambuesas"]'::jsonb, '["Derretir chocolate con manteca.","Batir huevos con azúcar e integrar el chocolate.","Agregar la harina y las frambuesas con movimientos suaves.","Hornear 25 minutos a 180 °C. El centro debe quedar húmedo."]'::jsonb, '2026-09-28T15:00:00.000Z')
  returning id
), c as (
  insert into public.calificaciones (receta_id, estrellas)
  select id, e from r, unnest(array[5, 4, 5]) as e
)
select id from r;

with r as (
  insert into public.recetas (titulo, descripcion, categoria, dificultad, tiempo, porciones, imagen, autor, ingredientes, pasos, creado_en)
  values ('Tarta de manzana', 'Masa quebrada, manzanas con canela y un enrejado dorado. Perfecta para la merienda.', 'Postres', 'Media', 75, 8, 'https://www.themealdb.com/images/media/meals/stnxzp1784835840.jpg', 'Martina López', '["2 discos de masa quebrada","5 manzanas verdes","100 g de azúcar","1 cdita de canela","1 huevo para pintar"]'::jsonb, '["Pelar y cortar las manzanas en láminas, mezclar con azúcar y canela.","Forrar un molde con un disco de masa y rellenar.","Cubrir con tiras de masa formando un enrejado y pintar con huevo.","Hornear 45 minutos a 180 °C."]'::jsonb, '2026-10-20T17:30:00.000Z')
  returning id
), c as (
  insert into public.calificaciones (receta_id, estrellas)
  select id, e from r, unnest(array[4, 5]) as e
)
select id from r;

