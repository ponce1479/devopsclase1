# Aitanas Constructor

E-commerce estático de materiales y herramientas de construcción, hecho con **HTML + Tailwind CSS compilado** y JavaScript vanilla.

## Páginas

- `index.html` — Inicio: hero, categorías, catálogo filtrable, ofertas con cuenta atrás, testimonios y newsletter.
- `producto.html?id=N` — Detalle de producto con galería, especificaciones, cantidad y productos relacionados.
- `carrito.html` — Carrito persistente con cantidades, eliminación, subtotal, envío gratis y total.

## Estructura

```
.
├── index.html
├── producto.html
├── carrito.html
├── src/
│   └── input.css          # Directivas y estilos base de Tailwind
├── dist/
│   └── styles.css         # CSS compilado (generado)
├── js/
│   ├── data.js            # Catálogo de productos y utilidades de formato
│   ├── common.js          # Header, footer, carrito (localStorage), toasts y tarjetas
│   ├── main.js            # Inicio: filtros y búsqueda
│   ├── producto.js        # Detalle de producto
│   └── carrito.js         # Lógica del carrito
├── tailwind.config.js
├── package.json
└── README.md
```

## Desarrollo

Instala las dependencias (solo la primera vez):

```bash
npm install
```

Compila el CSS:

```bash
npm run build
```

Modo vigilancia mientras editas:

```bash
npm run watch
```

## Ver la web

Sirve la carpeta con un servidor local (recomendado):

```bash
python3 -m http.server 8000
```

Abre <http://localhost:8000>. También puedes abrir `index.html` directamente, pero un servidor evita restricciones del navegador con `localStorage` en algunos casos.

## Notas

- El carrito se guarda en `localStorage` bajo la clave `aitanas-cart`.
- `dist/styles.css` está generado y versionado para que la web funcione sin ejecutar npm.
- El pago es una simulación: el botón "Finalizar compra" solo muestra una confirmación.
