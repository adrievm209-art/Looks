/* NOIR · Base de datos de estilos y outfits */
(function () {
  'use strict';

  const STYLES = [
    {
      id: 'oldmoney',
      name: 'Old Money',
      group: 'masculino',
      audience: 'men',
      category: 'Elegancia clásica',
      tagline: 'La discreción que se hereda.',
      palette: [
        { name: 'Marfil', hex: '#F1E9D6' },
        { name: 'Azul marino', hex: '#1B2A41' },
        { name: 'Camel', hex: '#B08D57' },
        { name: 'Verde bosque', hex: '#2F4538' },
        { name: 'Oro viejo', hex: '#C6A664' },
      ],
      description: 'Une sastrería impecable con prendas de calidad silenciosa: lana, algodón peinado y cuero bien curtido.',
      variants: [
        'El abrigo structureado marca la línea y los accesorios pasan desapercibidos.',
        'Una camisa de cuello clásico suaviza la severidad del conjunto.',
        'La paleta se mueve entre tonos tierra y azul profundo, sin estridencias.',
        'El reloj y los zapatos de piel pulida son los únicos detalles visibles.',
        'La proporción importa más que la marca: todo cae exactamente donde debe.',
      ],
      pieces: ['Abrigo de lana', 'Camisa Oxford', 'Pantalón de pinzas', 'Suéter de cachemira', 'Mocasines de piel'],
      tip: 'Invierte en cortes atemporales y cuida el ajuste de hombros y pantalón.',
    },
    {
      id: 'streetwear',
      name: 'Streetwear',
      group: 'masculino',
      audience: 'men',
      category: 'Urbano / Contemporáneo',
      tagline: 'La ciudad como pasarela.',
      palette: [
        { name: 'Negro carbón', hex: '#141518' },
        { name: 'Gris humo', hex: '#8A8D91' },
        { name: 'Blanco roto', hex: '#EDEDE8' },
        { name: 'Rojo vivo', hex: '#C93838' },
        { name: 'Plata', hex: '#BFC3C9' },
      ],
      description: 'Volumen, capas y calzado protagonista: una mezcla de cultura urbana y prendas de diseño.',
      variants: [
        'La sudadera holgada se equilibra con un pantalón recto y zapatillas limpias.',
        'Una sola pieza de acento rompe la monotonía del negro y el gris.',
        'Las capas ligeras crean profundidad sin perder comodidad.',
        'La gorra y la mochila funcionan como extensiones del look.',
        'El contraste entre texturas mate y técnicas da personalidad al conjunto.',
      ],
      pieces: ['Sudadera oversized', 'Camiseta gráfica', 'Pantalón cargo', 'Zapatillas', 'Gorra / bucket hat'],
      tip: 'Mantén una silueta protagonista y deja que el resto de prendas acompañen.',
    },
    {
      id: 'cleanfit',
      name: 'Clean Fit',
      group: 'masculino',
      audience: 'men',
      category: 'Minimalista / Depurado',
      tagline: 'Menos ruido, más forma.',
      palette: [
        { name: 'Blanco puro', hex: '#F7F5F0' },
        { name: 'Negro', hex: '#141414' },
        { name: 'Arena', hex: '#D8CBB4' },
        { name: 'Azul pálido', hex: '#A9BCD0' },
        { name: 'Gris perla', hex: '#C8C9CC' },
      ],
      description: 'Siluetas limpias, colores neutros y ausencia de estampados: el estilo se reduce a su esencia.',
      variants: [
        'La camiseta bien ajustada y el pantalón de tiro medio dibujan una línea prolongada.',
        'El blanco roto sustituye al blanco óptico para un resultmado más natural.',
        'Un único punto de contraste dirige la mirada sin interrumpir la armonía.',
        'Los tejidos con caída son la clave de este equilibrio silencioso.',
        'El calzado coincide en tono con el pantalón y alarga visualmente la figura.',
      ],
      pieces: ['Camiseta de algodón', 'Camisa de lino', 'Pantalón sastre', 'Zapatillas minimalistas', 'Reloj discreto'],
      tip: 'Elige tres tonos como máximo y repite uno en dos prendas.',
    },
    {
      id: 'coquette',
      name: 'Coquette',
      group: 'femenino',
      audience: 'women',
      category: 'Romántico / Delicado',
      tagline: 'Dulzura con intención.',
      palette: [
        { name: 'Rosa polvo', hex: '#E7BFC7' },
        { name: 'Marfil', hex: '#F5EDE3' },
        { name: 'Borgoña', hex: '#7A2E3B' },
        { name: 'Dorado', hex: '#D8B26A' },
        { name: 'Negro', hex: '#17161A' },
      ],
      description: 'Detalles femeninos y precisos: lazos, encajes y prendas que rozan el romanticismo sin caer en exceso.',
      variants: [
        'El escote y la cintura definida concentran la atención en la silueta.',
        'Un lazo pequeño aporta el toque coqueto que ordena todo el look.',
        'Las perlas sustituyen a la joyería llamativa con elegancia natural.',
        'La combinación de encaje y lana suaviza cualquier contraste.',
        'El tono borgoña profundiza la mirada y da profundidad al conjunto.',
      ],
      pieces: ['Vestido de encaje', 'Blusa de lazos', 'Falda midi', 'Perlas', 'Zapatos de tacón bajo'],
      tip: 'Deja que un solo detalle romántico lidere y mantén el resto en tonos suaves.',
    },
    {
      id: 'kawaii',
      name: 'Kawaii',
      group: 'femenino',
      audience: 'women',
      category: 'Cute / Pastel',
      tagline: 'Alegría en miniatura.',
      palette: [
        { name: 'Rosa pastel', hex: '#F4B8C6' },
        { name: 'Lila', hex: '#C6B0DC' },
        { name: 'Crema', hex: '#FBF1DE' },
        { name: 'Celeste', hex: '#A8D5E5' },
        { name: 'Blanco', hex: '#FEFCF7' },
      ],
      description: 'Pasteles, accesorios divertidos y una ternura deliberada inspirada en la moda japonesa.',
      variants: [
        'La falda de vuelo y los calcetines altos construyen una silueta juguetona.',
        'Un accesorio de personaje convierte el look en una declaración de ánimo.',
        'Los tonos pastel se mezclan sin competir entre sí.',
        'El bolso pequeño y las zapatillas redondeadas cierran la estética.',
        'El blanco crema actúa como pausa entre tanta dulzura.',
      ],
      pieces: ['Falda de vuelo', 'Suéter pastel', 'Calcetines altos', 'Bolso mini', 'Accesorio cute'],
      tip: 'Mezcla dos pasteles como protagonistas y deja el blanco como base.',
    },
    {
      id: 'preppy',
      name: 'Preppy',
      group: 'femenino',
      audience: 'women',
      category: 'Académico / Country',
      tagline: 'Aula, campo y buena medida.',
      palette: [
        { name: 'Verde oliva', hex: '#6F7A55' },
        { name: 'Azul marino', hex: '#22314C' },
        { name: 'Blanco', hex: '#F6F2E9' },
        { name: 'Vino', hex: '#7A3346' },
        { name: 'Dorado', hex: '#C9A227' },
      ],
      description: 'Cuadros, rayas y prendas de inspiración universitaria con un acabado cuidado y fresco.',
      variants: [
        'La falda plisada y el suéter de cuello alto definen el código preppy.',
        'El cuadro típico aparece en una sola pieza para no saturar.',
        'Los zapatos de mocasín y los calcetines blancos completan el conjunto.',
        'El verde oliva y el marino forman una base elegante y natural.',
        'Los botones dorados aportan el brillo justo sin ostentación.',
      ],
      pieces: ['Falda plisada', 'Suéter de cuello alto', 'Camisa a rayas', 'Mocasines', 'Calcetines altos'],
      tip: 'Combina estampados de escalas distintas: uno grande y uno pequeño.',
    },
    {
      id: 'vintage',
      name: 'Vintage',
      group: 'mixto',
      audience: 'both',
      category: 'Retro / Atemporal',
      tagline: 'El pasado vuelve a sentarse.',
      palette: [
        { name: 'Mostaza', hex: '#C99A3E' },
        { name: 'Aguacate', hex: '#6C7A4E' },
        { name: 'Crema', hex: '#E8D8B8' },
        { name: 'Coñac', hex: '#8A5A3B' },
        { name: 'Teja', hex: '#A9533D' },
      ],
      description: 'Prendas con memoria: cortes de otra época, tejidos nobles y colores que parecen vividos.',
      variants: [
        'El tiro alto y la caída amplia devuelven la elegancia de los setenta.',
        'Los tonos mostaza y coñac crean una calidez inmediata.',
        'Una pieza encontrada genera toda la historia del look.',
        'El cuello ancho y los accesorios pequeños equilibran la silueta.',
        'El aspecto desgastado de la piel y el denim aporta autenticidad.',
      ],
      pieces: ['Camisa de cuello ancho', 'Pantalón de tiro alto', 'Chaqueta de piel', 'Gafas retro', 'Botines coñac'],
      tip: 'Busca una prenda auténtica y construye el resto alrededor de ella.',
    },
    {
      id: 'gotico',
      name: 'Gótico',
      group: 'mixto',
      audience: 'both',
      category: 'Oscuro / Dramático',
      tagline: 'Belleza en la sombra.',
      palette: [
        { name: 'Negro', hex: '#0B0B0D' },
        { name: 'Vino oscuro', hex: '#4A1220' },
        { name: 'Plata', hex: '#AEB3BA' },
        { name: 'Gris piedra', hex: '#56565D' },
        { name: 'Morado', hex: '#3B2A4A' },
      ],
      description: 'Capas oscuras, texturas ricas y un punto de brillo metálico que revela la atmósfera gótica.',
      variants: [
        'El negro en distintos tejidos evita que el conjunto se vuelva plano.',
        'La plata funciona como única fuente de luz del look.',
        'El encaje y el cuero dialogan en una tensión elegante.',
        'El vino oscuro matiza la intensidad sin abandonar la oscuridad.',
        'La silueta alargada y el calzado robusto anclan la presencia.',
      ],
      pieces: ['Abrigo largo', 'Camisa de encaje', 'Pantalón negro', 'Botas de piel', 'Joyería de plata'],
      tip: 'Trabaja con tres texturas negras distintas antes de añadir color.',
    },
    {
      id: 'hippie',
      name: 'Hippie',
      group: 'mixto',
      audience: 'both',
      category: 'Boho / Libre',
      tagline: 'Libertad con textura.',
      palette: [
        { name: 'Terracota', hex: '#B26245' },
        { name: 'Mostaza', hex: '#D9A441' },
        { name: 'Salvia', hex: '#7E9270' },
        { name: 'Denim', hex: '#4A6A8B' },
        { name: 'Crema', hex: '#EBDCC0' },
      ],
      description: 'Capas fluidas, estampados étnicos y una paleta inspirada en la tierra y los viajes.',
      variants: [
        'La falda larga y el chal liviano crean movimiento al caminar.',
        'El denim aporta estructura a una combinación de tejidos suaves.',
        'Los colores cálidos se inspiran en atardeceres y mercados.',
        'Las pulseras y collares se acumulan con naturalidad.',
        'El sombrero remata una actitud relajada y libre.',
      ],
      pieces: ['Vestido fluido', 'Chal bordado', 'Camisa de lino', 'Pantalón ancho', 'Sombrero / panuelo'],
      tip: 'Mezcla estampados con un color común que los una visualmente.',
    },
    {
      id: 'casual',
      name: 'Casual',
      group: 'mixto',
      audience: 'both',
      category: 'Diario / Relajado',
      tagline: 'El arte de lo cotidiano.',
      palette: [
        { name: 'Denim', hex: '#35506E' },
        { name: 'Blanco roto', hex: '#EFEDE6' },
        { name: 'Negro', hex: '#1D1D20' },
        { name: 'Gris', hex: '#9A9CA0' },
        { name: 'Azul claro', hex: '#8FB3D0' },
      ],
      description: 'Comodidad creíble para todos los días, con prendas simples que funcionan siempre.',
      variants: [
        'La camiseta de buena caída y el denim correcto resuelven la mañana.',
        'Un tercer objeto —chaqueta o bufanda— cambia por completo el resultado.',
        'El calzado cómodo deja de ser un accesorio secundario.',
        'Los tonos neutros permiten combinar casi todo del armario.',
        'La sencillez bien ejecutada es la verdadera sofisticación diaria.',
      ],
      pieces: ['Camiseta básica', 'Vaqueros', 'Chaqueta ligera', 'Zapatillas', 'Bolso de tela'],
      tip: 'Ten tres bases neutras y cambia solo una prenda de acento cada día.',
    },
    {
      id: 'formal',
      name: 'Formal',
      group: 'mixto',
      audience: 'both',
      category: 'Ceremonia / Sastrería',
      tagline: 'La palabra exacta.',
      palette: [
        { name: 'Negro', hex: '#101013' },
        { name: 'Azul noche', hex: '#1B2C4F' },
        { name: 'Blanco', hex: '#F7F5F1' },
        { name: 'Plata', hex: '#C0C4CA' },
        { name: 'Oro', hex: '#C7A45D' },
      ],
      description: 'Sastrería y líneas pulidas para momentos que piden presencia sin exceso de ruido.',
      variants: [
        'El traje bien entallado habla antes que cualquier accesorio.',
        'La camisa blanca y el cuello definido iluminan el rostro.',
        'El acabado de los zapatos es el último detalle que delata el cuidado.',
        'El azul noche ofrece una alternativa elegante al negro absoluto.',
        'Una joyería mínima acompaña sin disputar protagonismo.',
      ],
      pieces: ['Traje sastre', 'Camisa blanca', 'Corbata o lazo', 'Zapato de piel', 'Reloj / gemelos'],
      tip: 'Ajusta primero la manga y el bajo; el resto de detalles llegan después.',
    },
    {
      id: 'alternativo',
      name: 'Alternativo',
      group: 'mixto',
      audience: 'both',
      category: 'Indie / Reglas propias',
      tagline: 'Reglas propias.',
      palette: [
        { name: 'Negro', hex: '#111113' },
        { name: 'Morado', hex: '#4B2E5A' },
        { name: 'Plata', hex: '#A9AEB6' },
        { name: 'Rojo', hex: '#9E2F35' },
        { name: 'Verde lima', hex: '#A9C24B' },
      ],
      description: 'Una estética que combina referencias underground con piezas inesperadas y mucha personalidad.',
      variants: [
        'Las capas asimétricas rompen la simetría clásica del armario.',
        'El morado y el plata construyen una atmósfera entre minimal y rock.',
        'Un solo color ácido basta para cambiar la lectura del look.',
        'Las botas y los accesorios metálicos fijan el carácter del conjunto.',
        'La mezcla de eras es deliberada, nunca accidental.',
      ],
      pieces: ['Chaqueta asimétrica', 'Camiseta de banda', 'Pantalón ajustado', 'Botas', 'Accesorios metálicos'],
      tip: 'Elige una regla y rómpela con intención: esa es la clave alternativa.',
    },
  ];

  // Fotos de respaldo por si el manifiesto local aún no existe.
  const FALLBACK_IDS = [
    'photo-1521572163474-6864f9cf17ab', 'photo-1503342217505-b0a15ec3261c',
    'photo-1483985988355-763728e1935b', 'photo-1490481651871-ab68de25d43d',
    'photo-1515886657613-9f3515b0c78f', 'photo-1539109136881-3be0616acf4b',
    'photo-1487222477894-8943e31ef7b2', 'photo-1525507119028-ed4c629a60a3',
    'photo-1509631179647-0177331693ae', 'photo-1618354691373-d851c5c3a990',
    'photo-1529139574466-a303027c1d8b', 'photo-1552374196-c4e7ffc6e126',
    'photo-1550614000-4895a10e1bfd', 'photo-1506794778202-cad84cf45f1d',
    'photo-1500648767791-00dcc994a43e', 'photo-1534528741775-53994a69daeb',
    'photo-1524504388940-b1c1722653e1', 'photo-1517841905240-472988babdf9',
    'photo-1531123897727-8f129e1688ce', 'photo-1521119989659-a83eee488004',
    'photo-1524250502761-1ac6f2e30d43', 'photo-1531746020798-e6953c6e8e04',
    'photo-1508214751196-bcfd4ca60f91', 'photo-1492562080023-ab3db95bfbce',
    'photo-1496440737103-cd596325d314', 'photo-1568602471122-7832951cc4c5',
    'photo-1507003211169-0a1dd7228f2d',
  ];

  // Nombres propios para cada estilo: 25 por colección, sin repeticiones.
  const NAMES = {
    oldmoney: [
      'Herencia de lino', 'Cena en el club', 'Seda y coñac', 'Domingo de campo', 'Sastre de tweed',
      'Mesa de caoba', 'Paseo de otoño', 'Corbata de seda', 'Mocasines de cuero', 'Boda en la finca',
      'Librería privada', 'Golf al amanecer', 'Abrigo de lana', 'Reloj de familia', 'Terraza de verano',
      'Café con periódico', 'Cena de gala', 'Ritual de sastrería', 'Jardín inglés', 'Sobretodo clásico',
      'Almuerzo en la finca', 'Polo de algodón', 'Vuelta al club', 'Chaleco de lana', 'Bienvenida de otoño',
    ],
    streetwear: [
      'Bloque de cemento', 'Skate al atardecer', 'Jersey de barrio', 'Hoodie de lluvia', 'Zapatillas de neón',
      'Esquina de la ciudad', 'Paseo en bici', 'Estación de metro', 'Cargo y cadenas', 'Gorra girada',
      'Mural de la calle', 'Concierto en garaje', 'Combo de invierno', 'Camiseta gráfica', 'Baggy de domingo',
      'Asfalto y basket', 'Chaqueta de viento', 'Pantalón de workout', 'Ruta nocturna', 'Café de sábado',
      'Denim oversized', 'Sneakerhead', 'Paseo de barrio', 'Cancha de concreto', 'Estilo de estación',
    ],
    cleanfit: [
      'Lino al amanecer', 'Camisa impecable', 'Gris de ciudad', 'Línea limpia', 'Neutral de verano',
      'Corte exacto', 'Blanco roto', 'Zapato de piel', 'Paseo sereno', 'Camiseta perfecta',
      'Denim azul', 'Bolsa de tela', 'Silueta recta', 'Café sin prisa', 'Oficina de verano',
      'Pantalón fluido', 'Capas de algodón', 'Piedra y arena', 'Minimal de invierno', 'Aire de otoño',
      'Traje sin corbata', 'Suelo de madera', 'Elegancia callada', 'Ventana abierta', 'Mesa de cristal',
    ],
    coquette: [
      'Lazo de satén', 'Té de las cinco', 'Vestido de cereza', 'Encaje y perlas', 'Brunch rosado',
      'Falda de tul', 'Cartita de amor', 'Guantes de encaje', 'Sombrero de ala', 'Globos y fresas',
      'Balcón de flores', 'Vestido de verano', 'Perla y terciopelo', 'Cumpleaños de abril', 'Tacones de charol',
      'Mirada dulce', 'Ramo de peonías', 'Cinta en el pelo', 'Servilleta de lino', 'Música de caja',
      'Jardín de rosas', 'Beso de carmín', 'Postre de fresa', 'Carta sellada', 'Silla de terciopelo',
    ],
    kawaii: [
      'Gatito de pastel', 'Aura de algodón', 'Moño de cielo', 'Pastel de cumpleaños', 'Nube rosa',
      'Menta y crema', 'Osito de peluche', 'Luna de papel', 'Dulce de arroz', 'Ventana de pastel',
      'Falda de nata', 'Calcetines de estrella', 'Mochila de cuento', 'Helado de verano', 'Mundo de muñeca',
      'Brillo de luna', 'Pollito de abril', 'Sueño de algodón', 'Bolsa de caramelo', 'Corazón de fieltro',
      'Fiesta de té', 'Panda de terciopelo', 'Cinta de arcoíris', 'Miel y leche', 'Jardín de dulces',
    ],
    preppy: [
      'Tenis en el campo', 'Falda plisada', 'Ivy de otoño', 'Cuello de camisa', 'Suéter de argyle',
      'Club de remo', 'Biblioteca de ladrillo', 'Paseo de sábado', 'Café en el campus', 'Pantalón de pinzas',
      'Corbata de rayas', 'Blazer azul marino', 'Líneas de tenis', 'Mocasines de cuero', 'Almuerzo en el club',
      'Bolsa de lona', 'Bufanda de lana', 'Plaid de invierno', 'Verano en la costa', 'Golf de mañana',
      'Cuaderno de notas', 'Cabello recogido', 'Boda de jardín', 'Cancha de césped', 'Reunión de otoño',
    ],
    vintage: [
      'Años cincuenta', 'Rollo de celuloide', 'Feria de los setenta', 'Denim lavado', 'Gafas de carey',
      'Café de los sesenta', 'Vinilo y tweed', 'Mesa de formica', 'Boda de verano', 'Guardarropa de la abuela',
      'Viaje en tren', 'Cámara de carrete', 'Sombrero de fieltro', 'Abrigo de paño', 'Ropa de segunda mano',
      'Discoteca de los ochenta', 'Paseo en scooter', 'Vestido floral', 'Camisa de rayas', 'Reloj de cuerda',
      'Museo de la moda', 'Picnic retro', 'Corbata ancha', 'Botines de ante', 'Diario de otra era',
    ],
    gotico: [
      'Luna de encaje', 'Terciopelo negro', 'Catedral de noche', 'Corsé y plata', 'Rosas marchitas',
      'Cuervo de medianoche', 'Lágrima de obsidiana', 'Vestido de sombra', 'Bolso de cuero', 'Perla negra',
      'Velación de invierno', 'Aguja y encaje', 'Murmullo de luna', 'Ópalo oscuro', 'Manto de lana',
      'Té con canela', 'Escalera de caracol', 'Espejo antiguo', 'Círculo de velas', 'Poema de medianoche',
      'Gargantilla de encaje', 'Bata de terciopelo', 'Jardín de sombras', 'Plata lunar', 'Hora bruja',
    ],
    hippie: [
      'Festival de girasoles', 'Camino de polvo', 'Tambor al amanecer', 'Colcha de parches', 'Flores en el pelo',
      'Círculo de paz', 'Mercado de especias', 'Guitarra de madera', 'Atardecer en el camping', 'Collar de cuentas',
      'Pantalón de campana', 'Chal de lana', 'Tienda en la playa', 'Café de carretera', 'Cielo de algodón',
      'Hoja de palma', 'Canto de hoguera', 'Bolsa de yute', 'Arena y sal', 'Paseo descalzo',
      'Sol de verano', 'Caravana de colores', 'Bosque de eucalipto', 'Paz y amor', 'Río de montaña',
    ],
    casual: [
      'Café de esquina', 'Vaqueros de diario', 'Domingo sin prisa', 'Sudadera de lunes', 'Paseo al mercado',
      'Camiseta blanca', 'Zapatillas de siempre', 'Mochila de tela', 'Cine de martes', 'Compra de libros',
      'Lluvia de abril', 'Barrio de siempre', 'Almuerzo ligero', 'Chaqueta vaquera', 'Paseo del perro',
      'Viaje en metro', 'Tarde de terraza', 'Camisa de franela', 'Fin de semana', 'Café con leche',
      'Parque de septiembre', 'Look de oficina', 'Casa de amigos', 'Ropa de diario', 'Calle de vuelta',
    ],
    formal: [
      'Traje de medianoche', 'Boda de invierno', 'Esmóquin de gala', 'Entrevista de lunes', 'Salón de baile',
      'Nudo de seda', 'Vestido de etiqueta', 'Cena de empresa', 'Alfombra roja', 'Reloj y gemelos',
      'Sastrería a medida', 'Discurso de graduación', 'Gala de otoño', 'Capilla de piedra', 'Cóctel de las siete',
      'Zapato de charol', 'Vestido de noche', 'Premios de la ciudad', 'Boda de primavera', 'Apertura de temporada',
      'Traje de lana', 'Mesa de honor', 'Protocolo estricto', 'Ceremonia de alba', 'Brindis final',
    ],
    alternativo: [
      'Chaqueta de cuero', 'Grunge de lluvia', 'Punk de barrio', 'Camiseta rasgada', 'Botas de combate',
      'Concierto de garaje', 'Tinta y acero', 'Indie de domingo', 'Cadena de plata', 'Denim roto',
      'Bar de medianoche', 'Rocker de ciudad', 'Corte asimétrico', 'Estudio de arte', 'Guitarra eléctrica',
      'Sombrero de ala ancha', 'Piercing de luna', 'Franela sobre camiseta', 'Contraste de texturas', 'Antiglámour',
      'Ritmo de batería', 'Café de madrugada', 'Subcultura de barrio', 'Rebelión silenciosa', 'Mezcla imposible',
    ],
  };
  const DETAILS = [
    'La elección de tejidos aporta profundidad sin recargar la silueta.',
    'Un pequeño gesto en los accesorios sostiene toda la composición.',
    'El equilibrio entre volumen y estructura hace que el look respire.',
    'La luz cambia el tono de las telas y revela matices inesperados.',
    'Es un conjunto pensado para moverse con naturalidad durante el día.',
  ];

  // Información didáctica adicional por estilo.
  const EXTRA = {
    oldmoney: {
      when: 'Cenas formales, oficinas clásicas, bodas de día y reuniones donde la discreción dice más que un logo.',
      avoid: 'Estampados grandes, logos visibles y mezclas de demasiadas texturas brillantes.',
      combine: 'Part de una base neutra y añade una sola pieza de calidad como protagonista.',
    },
    streetwear: {
      when: 'Salidas urbanas, conciertos, clases, viajes y cualquier plan donde Prime la comodidad con carácter.',
      avoid: 'Saturar de estampados o usar demasiadas piezas holgadas a la vez.',
      combine: 'Elige un volumen protagonista y compensa con prendas más ajustadas.',
    },
    cleanfit: {
      when: 'Trabajo, citas, compras o viajes: cuando quieres verte cuidado sin parecer esforzado.',
      avoid: 'Mezclar más de tres colores, estampados llamativos y accesorios excesivos.',
      combine: 'Repite un color en dos prendas y mantén el calzado en la misma familia tonal.',
    },
    coquette: {
      when: 'Citas, brunch, cumpleaños, sesiones de fotos y eventos con código romántico.',
      avoid: 'Acumular lazos, encajes y volantes en la misma cantidad.',
      combine: 'Deja que un detalle dulce lidere y equilibra con una pieza de líneas limpias.',
    },
    kawaii: {
      when: 'Salidas casuales, cumpleaños, convenciones, cafés temáticos y días en que quieres transmitir alegría.',
      avoid: 'Mezclar demasiados personajes o colores intensos compitiendo entre sí.',
      combine: 'Dos pasteles protagonistas, blanco crema como base y un accesorio divertido.',
    },
    preppy: {
      when: 'Universidad, oficina creativa, almuerzos, tenis o fines de semana en el campo.',
      avoid: 'Romper la paleta con neón y usar estampados del mismo tamaño.',
      combine: 'Combina un estampado grande con uno pequeño y repite el color dominante.',
    },
    vintage: {
      when: 'Mercados, paseos, cenas informales, viajes y eventos con ambiente retro.',
      avoid: 'Vestirse de época por completo; parece disfraz en lugar de estilo.',
      combine: 'Integra una pieza auténtica en un conjunto actual para darle contexto.',
    },
    gotico: {
      when: 'Conciertos, exposiciones, salidas nocturnas, fotografía y eventos de estética alternativa.',
      avoid: 'Usar un solo negro plano y olvidar la textura.',
      combine: 'Mezcla encaje, cuero y lana en negro, con un único acento de plata.',
    },
    hippie: {
      when: 'Festivales, viajes, playa, mercados y días al aire libre.',
      avoid: 'Demasiados accesorios sin un color que los conecte.',
      combine: 'Repite un tono tierra en dos prendas y deja que las texturas aporten movimiento.',
    },
    casual: {
      when: 'Todos los días: clase, trabajo informal, compras, cafés y trayectos.',
      avoid: 'Confundir comodidad con descuido en el ajuste y la limpieza de la ropa.',
      combine: 'Bases neutras + una prenda de acento + calzado cómodo y cuidado.',
    },
    formal: {
      when: 'Bodas, entrevistas, galas, cenas de empresa y ceremonias.',
      avoid: 'Zapatos descuidados, mangas largas o accesorios que compitan con el corte.',
      combine: 'Ajusta la sastrería primero; después añade uno o dos detalles de calidad.',
    },
    alternativo: {
      when: 'Conciertos, salidas creativas, estudios, bares y eventos donde quieres romper la norma.',
      avoid: 'Copiar una estética completa sin filtrarla con tu propia personalidad.',
      combine: 'Toma una referencia punk, grunge o indie y mézclala con una pieza inesperada.',
    },
  };
  STYLES.forEach((s) => Object.assign(s, EXTRA[s.id]));

  const byId = {};
  STYLES.forEach((s) => (byId[s.id] = s));

  const unsplash = (id, i) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&h=950&q=80&crop=${i % 7}`;

  const imagesFor = (gender, styleId) => {
    const key = `${gender}-${styleId}`;
    const local = (window.NOIR_IMAGES || {})[key];
    const list = (local && local.length ? local : FALLBACK_IDS.map((id, i) => unsplash(id, i))).slice(0, 25);
    // Garantizamos siempre 25 looks por estilo.
    while (list.length < 25) list.push(unsplash(FALLBACK_IDS[list.length % FALLBACK_IDS.length], list.length));
    return list;
  };

  function outfitsFor(gender, styleId) {
    const style = byId[styleId];
    const images = imagesFor(gender, styleId);
    return images.map((image, i) => {
      const rot = (offset) => style.palette.map((_, k) => style.palette[(k + offset) % style.palette.length]);
      const count = 3 + (i % 3);
      return {
        id: `${gender}-${styleId}-${i + 1}`,
        index: i + 1,
        name: (NAMES[styleId] || NAMES.casual)[i % (NAMES[styleId] || NAMES.casual).length],
        styleId,
        styleName: style.name,
        style: style,
        gender,
        genderLabel: gender === 'men' ? 'Hombre' : 'Mujer',
        group: style.group,
        category: style.category,
        image,
        colors: rot(i).slice(0, count),
        description: `${style.description} ${style.variants[i % style.variants.length]} ${DETAILS[i % DETAILS.length]}`,
        pieces: style.pieces.filter((_, k) => (k + i) % 5 < 3),
        tip: style.tip,
        when: style.when,
        avoid: style.avoid,
        combine: style.combine,
      };
    });
  }

  function all(gender) {
    return STYLES.filter((s) => s.audience === 'both' || s.audience === gender).flatMap((s) =>
      outfitsFor(gender, s.id)
    );
  }

  function get(gender, styleId, index) {
    const list = outfitsFor(gender, styleId);
    return list.find((o) => o.index === Number(index)) || list[0];
  }

  window.NOIR = { styles: STYLES, byId, outfitsFor, all, get, imagesFor };
})();
