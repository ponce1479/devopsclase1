/* ============================================================
   Catálogo de productos — Aitanas Constructor
   Datos compartidos por index.html, producto.html y carrito.html
============================================================ */

window.PRODUCTS = [
  {
    id: 1,
    name: 'Cemento Portland CEM II · 25 kg',
    cat: 'Materiales',
    key: 'materiales',
    icon: '🪨',
    grad: 'from-stone-200 to-stone-300',
    price: 6.95,
    oldPrice: 8.5,
    badge: 'Oferta',
    rating: 4.8,
    reviews: 214,
    unit: '',
    stock: true,
    short: 'Cemento gris de uso general para obra, albañilería y hormigón.',
    description: 'Cemento Portland CEM II/B-M 32,5 N ideal para trabajos generales de construcción, albañilería, solados y pequeñas estructuras. Fraguado uniforme y excelente trabajabilidad.',
    specs: [
      ['Formato', 'Saco de 25 kg'],
      ['Tipo', 'CEM II/B-M 32,5 N'],
      ['Uso', 'Obra general y albañilería'],
      ['Rendimiento', 'Aprox. 12,5 L por saco']
    ]
  },
  {
    id: 2,
    name: 'Taladro percutor 750 W',
    cat: 'Herramientas',
    key: 'herramientas',
    icon: '🛠️',
    grad: 'from-orange-100 to-amber-200',
    price: 89.9,
    oldPrice: 119,
    badge: 'Oferta',
    rating: 4.9,
    reviews: 186,
    unit: '',
    stock: true,
    short: 'Taladro percutor con 750 W de potencia y portabrocas de 13 mm.',
    description: 'Taladro percutor profesional con motor de 750 W, velocidad variable y función de percusión para hormigón y mampostería. Incluye empuñadura auxiliar y maletín de transporte.',
    specs: [
      ['Potencia', '750 W'],
      ['Portabrocas', '13 mm'],
      ['Velocidad', '0–3.000 rpm'],
      ['Incluye', 'Maletín y empuñadura']
    ]
  },
  {
    id: 3,
    name: 'Pintura plástica blanca mate · 15 L',
    cat: 'Pintura',
    key: 'pintura',
    icon: '🎨',
    grad: 'from-sky-100 to-indigo-200',
    price: 42.5,
    oldPrice: null,
    badge: 'Nuevo',
    rating: 4.7,
    reviews: 98,
    unit: '',
    stock: true,
    short: 'Pintura plástica mate lavable de gran cobertura para interior.',
    description: 'Pintura plástica al agua de acabado mate y alto poder cubriente para paredes y techos de interior. Bajo olor, secado rápido y excelente resistencia al lavado.',
    specs: [
      ['Formato', 'Cubo de 15 L'],
      ['Acabado', 'Mate lavable'],
      ['Rendimiento', '10–12 m²/L por mano'],
      ['Uso', 'Interior']
    ]
  },
  {
    id: 4,
    name: 'Azulejo porcelánico 60×60 cm',
    cat: 'Materiales',
    key: 'materiales',
    icon: '🧱',
    grad: 'from-slate-100 to-slate-300',
    price: 18.9,
    oldPrice: null,
    badge: '',
    rating: 4.6,
    reviews: 132,
    unit: '/m²',
    stock: true,
    short: 'Porcelánico rectificado efecto piedra, apto para suelo y pared.',
    description: 'Baldosa de porcelánico rectificado de 60×60 cm con acabado efecto piedra. Alta resistencia al desgaste, antideslizante y apta para uso en interior y exterior.',
    specs: [
      ['Medidas', '60 × 60 cm'],
      ['Acabado', 'Rectificado mate'],
      ['Resistencia', 'Uso intensivo'],
      ['Caja', '1,44 m² (4 piezas)']
    ]
  },
  {
    id: 5,
    name: 'Grifo monomando para cocina',
    cat: 'Baño',
    key: 'bano',
    icon: '🚿',
    grad: 'from-cyan-100 to-teal-200',
    price: 59,
    oldPrice: 74,
    badge: 'Oferta',
    rating: 4.8,
    reviews: 76,
    unit: '',
    stock: true,
    short: 'Monomando de acero inoxidable con caño giratorio de 360°.',
    description: 'Grifo monomando para fregadero de cocina fabricado en acero inoxidable cepillado. Caño giratorio de 360°, cartucho cerámico de larga duración y aireador antical.',
    specs: [
      ['Material', 'Acero inoxidable'],
      ['Acabado', 'Cepillado'],
      ['Caño', 'Giratorio 360°'],
      ['Garantía', '5 años']
    ]
  },
  {
    id: 6,
    name: 'Cable eléctrico 3×2,5 mm · 100 m',
    cat: 'Electricidad',
    key: 'electricidad',
    icon: '⚡',
    grad: 'from-yellow-100 to-amber-200',
    price: 74.95,
    oldPrice: null,
    badge: '',
    rating: 4.7,
    reviews: 64,
    unit: '',
    stock: true,
    short: 'Cable flexible libre de halógenos para instalaciones interiores.',
    description: 'Rollo de cable eléctrico flexible de 3 conductores de 2,5 mm² y 100 metros. Aislamiento libre de halógenos, baja emisión de humos y alta resistencia a la temperatura.',
    specs: [
      ['Sección', '3 × 2,5 mm²'],
      ['Longitud', '100 m'],
      ['Tensión', '750 V'],
      ['Normativa', 'UNE 21123']
    ]
  },
  {
    id: 7,
    name: 'Escalera de aluminio · 7 peldaños',
    cat: 'Herramientas',
    key: 'herramientas',
    icon: '🪜',
    grad: 'from-zinc-100 to-zinc-300',
    price: 129,
    oldPrice: 159,
    badge: 'Oferta',
    rating: 4.9,
    reviews: 143,
    unit: '',
    stock: true,
    short: 'Escalera tijera de aluminio con plataforma y peldaños antideslizantes.',
    description: 'Escalera de tijera en aluminio con 7 peldaños, plataforma de trabajo y peldaños antideslizantes. Ligera, plegable y con bloqueo de seguridad para un uso cómodo y estable.',
    specs: [
      ['Material', 'Aluminio'],
      ['Peldaños', '7 + plataforma'],
      ['Altura', '2,4 m'],
      ['Carga máx.', '150 kg']
    ]
  },
  {
    id: 8,
    name: 'Casco de seguridad profesional',
    cat: 'Seguridad',
    key: 'seguridad',
    icon: '⛑️',
    grad: 'from-red-100 to-orange-200',
    price: 14.9,
    oldPrice: null,
    badge: 'Nuevo',
    rating: 4.8,
    reviews: 221,
    unit: '',
    stock: true,
    short: 'Casco de protección con arnés ajustable y ventilación lateral.',
    description: 'Casco de seguridad profesional fabricado en polietileno de alta densidad. Arnés interior ajustable, ventilación lateral y ranuras para accesorios. Certificado según EN 397.',
    specs: [
      ['Material', 'Polietileno HDPE'],
      ['Talla', 'Ajustable 52–64 cm'],
      ['Normativa', 'EN 397'],
      ['Peso', '385 g']
    ]
  }
];

window.SERVICES = [
  {
    name: 'Reformas integrales',
    icon: '🏠',
    from: 6000,
    description: 'Reformamos tu vivienda de principio a fin: albañilería, instalaciones y acabados con un único responsable.'
  },
  {
    name: 'Albañilería y obra nueva',
    icon: '🧱',
    from: 1200,
    description: 'Muros, tabiques, solados, enfoscados y pequeñas estructuras ejecutadas con materiales de primera calidad.'
  },
  {
    name: 'Fontanería e instalaciones',
    icon: '🚿',
    from: 180,
    description: 'Instalación y reparación de agua, saneamiento, calefacción y termos, con materiales certificados.'
  },
  {
    name: 'Electricidad',
    icon: '⚡',
    from: 150,
    description: 'Cuadros eléctricos, cableado, iluminación LED y certificados de instalación según normativa.'
  },
  {
    name: 'Pintura y acabados',
    icon: '🎨',
    from: 350,
    description: 'Pintura interior y exterior, pladur, alisado de paredes y soluciones decorativas a medida.'
  },
  {
    name: 'Jardinería y exteriores',
    icon: '🌿',
    from: 250,
    description: 'Diseño de jardines, riego automático, césped artificial, pavimentos y mantenimiento periódico.'
  }
];

window.formatPrice = function (value) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

window.formatPriceShort = function (value) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value);
};


window.findProduct = function (id) {
  return window.PRODUCTS.find(function (p) {
    return p.id === Number(id);
  });
};
