// Recetas de ejemplo que se cargan la PRIMERA vez que se abre la app.
// Después de eso, los datos se leen y guardan en LocalStorage.
const IMG = 'https://www.themealdb.com/images/media/meals/'

export const CATEGORIAS = [
  'Desayunos',
  'Platos principales',
  'Pastas',
  'Veggie',
  'Sopas',
  'Postres'
]

export const DIFICULTADES = ['Fácil', 'Media', 'Difícil']

export const recetasIniciales = [
  {
    id: 1,
    titulo: 'Panqueques clásicos',
    descripcion: 'Finitos, dorados y listos para rellenar con dulce de leche o lo que más te guste.',
    categoria: 'Desayunos',
    tiempo: 20,
    porciones: 4,
    dificultad: 'Fácil',
    imagen: IMG + 'rwuyqx1511383174.jpg',
    autor: 'Lucía Fernández',
    fecha: '2026-08-02T10:00:00.000Z',
    ingredientes: ['2 huevos', '250 ml de leche', '120 g de harina', '1 cda de azúcar', 'Manteca para la sartén'],
    pasos: [
      'Mezclar los huevos con la leche y el azúcar.',
      'Agregar la harina de a poco batiendo hasta que no queden grumos.',
      'Dejar reposar la mezcla 10 minutos.',
      'Cocinar en sartén con manteca, un cucharón por panqueque, vuelta y vuelta.'
    ],
    calificaciones: [5, 4, 5],
    comentarios: [
      { id: 1, autor: 'Martín', texto: 'Salieron perfectos, los rellené con dulce de leche.', fecha: '2026-08-05T12:00:00.000Z' }
    ],
    favorito: false
  },
  {
    id: 2,
    titulo: 'Omelette francés',
    descripcion: 'Un omelette suave y cremoso por dentro, ideal para un desayuno rápido y nutritivo.',
    categoria: 'Desayunos',
    tiempo: 10,
    porciones: 1,
    dificultad: 'Media',
    imagen: IMG + 'yvpuuy1511797244.jpg',
    autor: 'Tomás Ruiz',
    fecha: '2026-08-10T09:00:00.000Z',
    ingredientes: ['3 huevos', '1 cda de manteca', 'Sal y pimienta', 'Ciboulette picada'],
    pasos: [
      'Batir los huevos con sal y pimienta.',
      'Derretir la manteca a fuego medio en una sartén antiadherente.',
      'Volcar los huevos y mover la sartén mientras se cuajan.',
      'Doblar en tres y servir con ciboulette por encima.'
    ],
    calificaciones: [4, 4],
    comentarios: [],
    favorito: false
  },
  {
    id: 3,
    titulo: 'Panqueques de avena y banana',
    descripcion: 'Versión saludable sin harina blanca, endulzada solo con banana madura.',
    categoria: 'Desayunos',
    tiempo: 15,
    porciones: 2,
    dificultad: 'Fácil',
    imagen: IMG + 'c400ok1764439058.jpg',
    autor: 'Sofía Gómez',
    fecha: '2026-09-01T08:30:00.000Z',
    ingredientes: ['1 taza de avena', '1 banana madura', '1 huevo', '1/2 taza de leche', '1 cdita de polvo de hornear'],
    pasos: [
      'Procesar todos los ingredientes hasta lograr una mezcla lisa.',
      'Calentar una sartén apenas aceitada.',
      'Cocinar pequeñas porciones hasta que aparezcan burbujas y dar vuelta.',
      'Servir con frutas y miel.'
    ],
    calificaciones: [5, 5, 4, 5],
    comentarios: [],
    favorito: true
  },
  {
    id: 4,
    titulo: 'Lasaña de carne',
    descripcion: 'Capas de pasta, salsa boloñesa y bechamel gratinadas al horno. Un clásico de domingo.',
    categoria: 'Pastas',
    tiempo: 90,
    porciones: 6,
    dificultad: 'Difícil',
    imagen: IMG + 'wtsvxx1511296896.jpg',
    autor: 'Nonna Rosa',
    fecha: '2026-07-20T13:00:00.000Z',
    ingredientes: ['500 g de carne picada', '12 láminas de lasaña', '500 ml de salsa de tomate', '500 ml de bechamel', '200 g de mozzarella', '1 cebolla'],
    pasos: [
      'Rehogar la cebolla, agregar la carne y luego la salsa de tomate. Cocinar 20 minutos.',
      'En una fuente alternar capas de salsa, láminas de pasta y bechamel.',
      'Terminar con bechamel y mozzarella.',
      'Hornear 40 minutos a 180 °C y dejar reposar antes de cortar.'
    ],
    calificaciones: [5, 5, 5, 4, 5],
    comentarios: [
      { id: 1, autor: 'Carla', texto: 'La hice para el cumple de mi papá, un éxito total.', fecha: '2026-07-28T20:00:00.000Z' },
      { id: 2, autor: 'Diego', texto: 'Le agregué espinaca entre capas y quedó genial.', fecha: '2026-08-01T21:00:00.000Z' }
    ],
    favorito: true
  },
  {
    id: 5,
    titulo: 'Spaghetti a la boloñesa',
    descripcion: 'Salsa de carne cocinada lentamente con tomate y vino tinto sobre spaghetti al dente.',
    categoria: 'Pastas',
    tiempo: 45,
    porciones: 4,
    dificultad: 'Media',
    imagen: IMG + 'sutysw1468247559.jpg',
    autor: 'Tomás Ruiz',
    fecha: '2026-08-15T19:00:00.000Z',
    ingredientes: ['400 g de spaghetti', '400 g de carne picada', '1 lata de tomate triturado', '1 zanahoria', '1 cebolla', '1/2 vaso de vino tinto'],
    pasos: [
      'Picar cebolla y zanahoria y rehogar en aceite de oliva.',
      'Agregar la carne y dorar. Desglasar con el vino.',
      'Sumar el tomate y cocinar a fuego bajo 30 minutos.',
      'Hervir la pasta, escurrir y mezclar con la salsa.'
    ],
    calificaciones: [4, 5, 4],
    comentarios: [],
    favorito: false
  },
  {
    id: 6,
    titulo: 'Spaghetti carbonara',
    descripcion: 'La receta romana auténtica: sin crema, solo huevo, queso, panceta y pimienta negra.',
    categoria: 'Pastas',
    tiempo: 25,
    porciones: 2,
    dificultad: 'Media',
    imagen: IMG + 'llcbn01574260722.jpg',
    autor: 'Marco Bianchi',
    fecha: '2026-09-12T20:30:00.000Z',
    ingredientes: ['200 g de spaghetti', '100 g de panceta', '2 yemas y 1 huevo', '50 g de queso pecorino', 'Pimienta negra'],
    pasos: [
      'Dorar la panceta en cubos sin aceite.',
      'Batir huevos con el queso rallado y mucha pimienta.',
      'Hervir la pasta y reservar un poco del agua de cocción.',
      'Fuera del fuego, mezclar pasta, panceta y huevos agregando agua hasta lograr una crema.'
    ],
    calificaciones: [5, 4, 5],
    comentarios: [],
    favorito: false
  },
  {
    id: 7,
    titulo: 'Empanadas de carne cortada a cuchillo',
    descripcion: 'Empanadas jugosas al horno con relleno de carne, cebolla, huevo y aceitunas.',
    categoria: 'Platos principales',
    tiempo: 60,
    porciones: 12,
    dificultad: 'Media',
    imagen: IMG + 'dxpc7j1764370714.jpg',
    autor: 'Lucía Fernández',
    fecha: '2026-07-09T12:00:00.000Z',
    ingredientes: ['12 tapas de empanada', '500 g de carne cortada a cuchillo', '2 cebollas', '2 huevos duros', 'Aceitunas verdes', 'Comino y pimentón'],
    pasos: [
      'Rehogar las cebollas, agregar la carne y condimentar con comino y pimentón.',
      'Dejar enfriar el relleno y sumar huevo duro y aceitunas picadas.',
      'Rellenar las tapas y hacer el repulgue.',
      'Hornear a 200 °C durante 20 minutos hasta dorar.'
    ],
    calificaciones: [5, 5, 5, 5],
    comentarios: [
      { id: 1, autor: 'Pablo', texto: '¡Las mejores empanadas que probé fuera de Tucumán!', fecha: '2026-07-10T22:00:00.000Z' }
    ],
    favorito: true
  },
  {
    id: 8,
    titulo: 'Matambre a la pizza',
    descripcion: 'Matambre tierno cubierto con salsa, mozzarella y orégano. Ideal para la parrilla o el horno.',
    categoria: 'Platos principales',
    tiempo: 120,
    porciones: 4,
    dificultad: 'Media',
    imagen: IMG + 'wf49qs1763075222.jpg',
    autor: 'Diego Paredes',
    fecha: '2026-08-20T14:00:00.000Z',
    ingredientes: ['1 matambre de ternera', '1 litro de leche', '300 g de mozzarella', 'Salsa de tomate', 'Orégano'],
    pasos: [
      'Cocinar el matambre en leche a fuego bajo durante 1 hora y media.',
      'Pasarlo a una placa o a la parrilla para dorarlo de ambos lados.',
      'Cubrir con salsa de tomate y mozzarella.',
      'Gratinar y terminar con orégano.'
    ],
    calificaciones: [5, 4],
    comentarios: [],
    favorito: false
  },
  {
    id: 9,
    titulo: 'Curry de pollo con maní',
    descripcion: 'Pollo en salsa cremosa de curry y maní, perfumado y apenas picante. Va muy bien con arroz.',
    categoria: 'Platos principales',
    tiempo: 40,
    porciones: 4,
    dificultad: 'Media',
    imagen: IMG + 'yxsurp1511304301.jpg',
    autor: 'Priya Shah',
    fecha: '2026-09-05T20:00:00.000Z',
    ingredientes: ['600 g de pechuga de pollo', '2 cdas de pasta de curry', '400 ml de leche de coco', '2 cdas de mantequilla de maní', '1 cebolla', 'Arroz blanco'],
    pasos: [
      'Dorar el pollo en cubos y retirar.',
      'Rehogar la cebolla con la pasta de curry.',
      'Agregar leche de coco y mantequilla de maní, mezclar.',
      'Volver a incorporar el pollo y cocinar 15 minutos. Servir con arroz.'
    ],
    calificaciones: [4, 5],
    comentarios: [],
    favorito: false
  },
  {
    id: 10,
    titulo: 'Tacos de pescado cajún',
    descripcion: 'Pescado especiado y crocante en tortillas con repollo, palta y salsa de lima.',
    categoria: 'Platos principales',
    tiempo: 30,
    porciones: 3,
    dificultad: 'Fácil',
    imagen: IMG + 'uvuyxu1503067369.jpg',
    autor: 'Camila Ortiz',
    fecha: '2026-09-20T13:30:00.000Z',
    ingredientes: ['400 g de filet de merluza', '6 tortillas', '1 cda de especias cajún', '1/4 de repollo', '1 palta', '1 lima'],
    pasos: [
      'Condimentar el pescado con las especias cajún.',
      'Cocinarlo a la plancha 3 minutos por lado.',
      'Calentar las tortillas.',
      'Armar los tacos con repollo, pescado, palta y jugo de lima.'
    ],
    calificaciones: [4, 4, 5],
    comentarios: [],
    favorito: false
  },
  {
    id: 11,
    titulo: 'Falafel casero',
    descripcion: 'Croquetas de garbanzos crocantes por fuera y verdes por dentro, con salsa de yogur.',
    categoria: 'Veggie',
    tiempo: 35,
    porciones: 4,
    dificultad: 'Media',
    imagen: IMG + 'u5e9qq1763795441.jpg',
    autor: 'Sofía Gómez',
    fecha: '2026-08-28T18:00:00.000Z',
    ingredientes: ['300 g de garbanzos remojados', '1 cebolla', '2 dientes de ajo', 'Perejil y cilantro', '1 cdita de comino', 'Aceite para freír'],
    pasos: [
      'Procesar garbanzos crudos con cebolla, ajo, hierbas y comino.',
      'Formar bolitas con las manos húmedas.',
      'Freír en aceite caliente hasta dorar.',
      'Servir con salsa de yogur y pan pita.'
    ],
    calificaciones: [5, 4, 4],
    comentarios: [],
    favorito: false
  },
  {
    id: 12,
    titulo: 'Ensalada Shopska',
    descripcion: 'Ensalada fresca de tomate, pepino, morrón y queso rallado. Lista en 15 minutos.',
    categoria: 'Veggie',
    tiempo: 15,
    porciones: 2,
    dificultad: 'Fácil',
    imagen: IMG + 'bqx8mc1782684286.jpg',
    autor: 'Iván Petrov',
    fecha: '2026-10-01T12:30:00.000Z',
    ingredientes: ['3 tomates', '1 pepino', '1 morrón asado', '1/2 cebolla morada', '100 g de queso feta', 'Aceite de oliva'],
    pasos: [
      'Cortar los vegetales en cubos parejos.',
      'Condimentar con sal, aceite de oliva y vinagre.',
      'Rallar el queso por encima justo antes de servir.'
    ],
    calificaciones: [4],
    comentarios: [],
    favorito: false
  },
  {
    id: 13,
    titulo: 'Sopa de arvejas partidas',
    descripcion: 'Sopa espesa y reconfortante para los días fríos, con vegetales y un toque ahumado.',
    categoria: 'Sopas',
    tiempo: 70,
    porciones: 6,
    dificultad: 'Fácil',
    imagen: IMG + 'xxtsvx1511814083.jpg',
    autor: 'Nonna Rosa',
    fecha: '2026-06-18T19:00:00.000Z',
    ingredientes: ['400 g de arvejas partidas', '2 zanahorias', '1 cebolla', '2 papas', '1,5 l de caldo de verduras', 'Pimentón ahumado'],
    pasos: [
      'Rehogar cebolla y zanahoria picadas.',
      'Agregar arvejas, papas en cubos y el caldo.',
      'Cocinar a fuego bajo 50 minutos revolviendo de vez en cuando.',
      'Licuar la mitad para espesar y condimentar con pimentón.'
    ],
    calificaciones: [4, 3, 4],
    comentarios: [],
    favorito: false
  },
  {
    id: 14,
    titulo: 'Flan casero con dulce de leche',
    descripcion: 'El postre de la abuela: suave, con caramelo y una buena cucharada de dulce de leche.',
    categoria: 'Postres',
    tiempo: 60,
    porciones: 8,
    dificultad: 'Media',
    imagen: IMG + '0s80wo1764374393.jpg',
    autor: 'Lucía Fernández',
    fecha: '2026-07-30T17:00:00.000Z',
    ingredientes: ['6 huevos', '1 litro de leche', '200 g de azúcar', '1 cdita de esencia de vainilla', 'Azúcar para el caramelo'],
    pasos: [
      'Hacer un caramelo en la flanera y dejar enfriar.',
      'Batir huevos con azúcar, leche y vainilla sin incorporar aire.',
      'Volcar en la flanera y cocinar a baño María 50 minutos a 170 °C.',
      'Enfriar en la heladera y desmoldar. Servir con dulce de leche.'
    ],
    calificaciones: [5, 5, 4, 5],
    comentarios: [],
    favorito: true
  },
  {
    id: 15,
    titulo: 'Cheesecake de dulce de leche',
    descripcion: 'Base de galletitas María, relleno de queso crema y una capa generosa de dulce de leche.',
    categoria: 'Postres',
    tiempo: 80,
    porciones: 10,
    dificultad: 'Difícil',
    imagen: IMG + 'f9qog11784574376.jpg',
    autor: 'Camila Ortiz',
    fecha: '2026-10-10T16:00:00.000Z',
    ingredientes: ['200 g de galletitas María', '100 g de manteca', '600 g de queso crema', '3 huevos', '150 g de azúcar', '400 g de dulce de leche'],
    pasos: [
      'Procesar las galletitas con la manteca y forrar un molde.',
      'Batir queso crema, azúcar y huevos.',
      'Hornear a 160 °C durante 50 minutos.',
      'Enfriar y cubrir con dulce de leche.'
    ],
    calificaciones: [5, 5],
    comentarios: [],
    favorito: false
  },
  {
    id: 16,
    titulo: 'Brownies con frambuesas',
    descripcion: 'Brownies húmedos de chocolate amargo con frambuesas que aportan acidez.',
    categoria: 'Postres',
    tiempo: 45,
    porciones: 12,
    dificultad: 'Fácil',
    imagen: IMG + 'yypvst1511386427.jpg',
    autor: 'Martina López',
    fecha: '2026-09-28T15:00:00.000Z',
    ingredientes: ['200 g de chocolate amargo', '150 g de manteca', '3 huevos', '200 g de azúcar', '100 g de harina', '150 g de frambuesas'],
    pasos: [
      'Derretir chocolate con manteca.',
      'Batir huevos con azúcar e integrar el chocolate.',
      'Agregar la harina y las frambuesas con movimientos suaves.',
      'Hornear 25 minutos a 180 °C. El centro debe quedar húmedo.'
    ],
    calificaciones: [5, 4, 5],
    comentarios: [],
    favorito: false
  },
  {
    id: 17,
    titulo: 'Tarta de manzana',
    descripcion: 'Masa quebrada, manzanas con canela y un enrejado dorado. Perfecta para la merienda.',
    categoria: 'Postres',
    tiempo: 75,
    porciones: 8,
    dificultad: 'Media',
    imagen: IMG + 'stnxzp1784835840.jpg',
    autor: 'Martina López',
    fecha: '2026-10-20T17:30:00.000Z',
    ingredientes: ['2 discos de masa quebrada', '5 manzanas verdes', '100 g de azúcar', '1 cdita de canela', '1 huevo para pintar'],
    pasos: [
      'Pelar y cortar las manzanas en láminas, mezclar con azúcar y canela.',
      'Forrar un molde con un disco de masa y rellenar.',
      'Cubrir con tiras de masa formando un enrejado y pintar con huevo.',
      'Hornear 45 minutos a 180 °C.'
    ],
    calificaciones: [4, 5],
    comentarios: [],
    favorito: false
  }
]
