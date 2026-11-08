/* ============================================================
   Utilidades compartidas — Aitanas Constructor
   Header, footer, carrito (localStorage), toasts y tarjetas.
============================================================ */

const CART_KEY = 'aitanas-cart';

/* ------------------------- CARRITO ------------------------- */
function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function cartCount() {
  return getCart().reduce(function (total, item) {
    return total + item.qty;
  }, 0);
}

function updateCartBadge() {
  const count = cartCount();
  document.querySelectorAll('[data-cart-count]').forEach(function (el) {
    el.textContent = count;
  });
}

function addToCart(id, qty) {
  const product = window.findProduct(id);
  if (!product) return;
  const amount = Math.max(1, Number(qty) || 1);
  const cart = getCart();
  const item = cart.find(function (line) {
    return line.id === product.id;
  });
  if (item) {
    item.qty += amount;
  } else {
    cart.push({ id: product.id, qty: amount });
  }
  saveCart(cart);
}

function setQty(id, qty) {
  const cart = getCart();
  const item = cart.find(function (line) {
    return line.id === Number(id);
  });
  if (!item) return;
  if (qty <= 0) {
    removeFromCart(id);
    return;
  }
  item.qty = qty;
  saveCart(cart);
}

function removeFromCart(id) {
  const cart = getCart().filter(function (line) {
    return line.id !== Number(id);
  });
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function cartSubtotal() {
  return getCart().reduce(function (total, item) {
    const product = window.findProduct(item.id);
    return product ? total + product.price * item.qty : total;
  }, 0);
}

/* ------------------------- TOAST ------------------------- */
let toastTimer;

function ensureToast() {
  if (document.getElementById('toast')) return;
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.className = 'pointer-events-none fixed bottom-6 right-4 z-[60] flex max-w-sm translate-y-24 items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white opacity-0 shadow-card transition-all duration-300 sm:right-6';
  toast.innerHTML = '<span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-500"><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg></span><span id="toast-msg">Producto añadido al carrito</span>';
  document.body.appendChild(toast);
}

function showToast(message) {
  ensureToast();
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = message;
  toast.classList.remove('translate-y-24', 'opacity-0');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.add('translate-y-24', 'opacity-0');
  }, 3000);
}

/* ------------------------- ESTRELLAS ------------------------- */
const STAR_PATH = 'M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z';

function starsHTML(rating, sizeClass) {
  const size = sizeClass || 'h-3.5 w-3.5';
  return Array.from({ length: 5 }, function (_, i) {
    const color = i < Math.round(rating) ? 'text-amber-400' : 'text-slate-300';
    return '<svg class="' + size + ' ' + color + '" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="' + STAR_PATH + '"/></svg>';
  }).join('');
}

/* ------------------------- TARJETA DE PRODUCTO ------------------------- */
function badgeHTML(product) {
  if (product.badge === 'Oferta') {
    return '<span class="pointer-events-none absolute left-3 top-3 rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">Oferta</span>';
  }
  if (product.badge === 'Nuevo') {
    return '<span class="pointer-events-none absolute left-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">Nuevo</span>';
  }
  return '';
}

function productCardHTML(product) {
  const href = 'producto.html?id=' + product.id;
  const oldPrice = product.oldPrice
    ? '<p class="mt-1 text-xs text-slate-400 line-through">' + window.formatPrice(product.oldPrice) + '</p>'
    : '<p class="mt-1 text-xs font-semibold text-emerald-600">En stock</p>';

  return `
  <article class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft">
    <div class="relative grid h-44 place-items-center bg-gradient-to-br ${product.grad}">
      ${badgeHTML(product)}
      <button type="button" data-fav="${product.id}" class="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-slate-500 backdrop-blur transition hover:text-rose-500" aria-label="Añadir ${product.name} a favoritos" aria-pressed="false">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
      </button>
      <a href="${href}" class="absolute inset-0 grid place-items-center" aria-label="Ver ${product.name}">
        <span class="select-none text-6xl drop-shadow-sm" role="img" aria-label="${product.cat}">${product.icon}</span>
      </a>
    </div>
    <div class="flex flex-1 flex-col p-4">
      <p class="text-[11px] font-bold uppercase tracking-wider text-brand-600">${product.cat}</p>
      <h3 class="mt-1 text-sm font-bold leading-snug text-slate-900">
        <a href="${href}" class="transition hover:text-brand-600">${product.name}</a>
      </h3>
      <div class="mt-2 flex items-center gap-1.5">
        <span class="flex gap-0.5">${starsHTML(product.rating)}</span>
        <span class="text-xs text-slate-500">${product.rating.toFixed(1)} (${product.reviews})</span>
      </div>
      <div class="mt-auto flex items-end justify-between gap-3 pt-4">
        <div>
          <p class="text-lg font-extrabold leading-none text-slate-900">${window.formatPrice(product.price)}${product.unit ? '<span class="ml-0.5 text-xs font-medium text-slate-400">' + product.unit + '</span>' : ''}</p>
          ${oldPrice}
        </div>
        <button type="button" data-add="${product.id}" class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-900 text-white transition hover:bg-brand-600" aria-label="Añadir ${product.name} al carrito">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        </button>
      </div>
    </div>
  </article>`;
}

/* ------------------------- HEADER ------------------------- */
function headerHTML(active) {
  const linkBase = 'transition hover:text-brand-600';
  const activeClass = 'text-slate-900';
  const idleClass = 'text-slate-600';
  const nav = function (key, label, href) {
    return '<a href="' + href + '" class="' + linkBase + ' ' + (active === key ? activeClass : idleClass) + '">' + label + '</a>';
  };

  return `
  <div class="hidden bg-slate-900 text-slate-300 md:block">
    <div class="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs lg:px-8">
      <p class="flex items-center gap-2">
        <svg class="h-4 w-4 text-brand-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
        Envío gratis en pedidos superiores a 100 €
      </p>
      <div class="flex items-center gap-5">
        <a href="tel:900123456" class="flex items-center gap-1.5 transition hover:text-white">
          <svg class="h-4 w-4 text-brand-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
          900 123 456
        </a>
        <span class="flex items-center gap-1.5">
          <svg class="h-4 w-4 text-brand-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
          Lun–Sáb · 8:00–20:00
        </span>
      </div>
    </div>
  </div>

  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto max-w-7xl px-4 lg:px-8">
      <div class="flex h-16 items-center justify-between gap-4 lg:h-[72px]">
        <a href="index.html" class="flex shrink-0 items-center gap-2.5" aria-label="Aitanas Constructor, inicio">
          <span class="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white shadow-soft">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" /></svg>
          </span>
          <span class="leading-none">
            <span class="block text-xl font-extrabold tracking-tight text-slate-900">Aitanas</span>
            <span class="mt-1 block text-[10px] font-bold uppercase tracking-[0.3em] text-brand-600">Constructor</span>
          </span>
        </a>

        <nav class="hidden items-center gap-7 text-sm font-semibold lg:flex" aria-label="Navegación principal">
          ${nav('inicio', 'Inicio', 'index.html')}
          ${nav('productos', 'Catálogo', 'index.html#productos')}
          ${nav('servicios', 'Servicios', 'index.html#servicios')}
          <a href="index.html#ofertas" class="flex items-center gap-1 font-semibold ${active === 'ofertas' ? 'text-brand-700' : 'text-brand-600'}">
            Ofertas
            <span class="rounded-full bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-700">-30%</span>
          </a>
          ${nav('contacto', 'Contacto', 'index.html#contacto')}
        </nav>

        <form action="index.html" method="get" class="relative hidden max-w-sm flex-1 lg:block" role="search">
          <label for="search-input" class="sr-only">Buscar productos</label>
          <svg class="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
          <input id="search-input" name="q" type="search" placeholder="Buscar cemento, taladro, pintura…" class="w-full rounded-full border border-slate-200 bg-slate-100 py-2.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100">
        </form>

        <div class="flex items-center gap-2">
          <a href="index.html#contacto" class="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:flex">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
            <span class="hidden xl:inline">Mi cuenta</span>
          </a>

          <a href="carrito.html" class="relative flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800" aria-label="Ver carrito de compra">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
            <span class="hidden sm:inline">Carrito</span>
            <span data-cart-count class="grid h-5 min-w-[20px] place-items-center rounded-full bg-brand-500 px-1 text-[11px] font-bold text-white">0</span>
          </a>

          <button type="button" id="menu-btn" class="grid h-10 w-10 place-items-center rounded-full text-slate-700 transition hover:bg-slate-100 lg:hidden" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobile-menu">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          </button>
        </div>
      </div>

      <div id="mobile-menu" class="hidden border-t border-slate-200 py-4 lg:hidden">
        <nav class="flex flex-col gap-1 text-sm font-semibold" aria-label="Navegación móvil">
          <a href="index.html" class="rounded-lg px-3 py-2.5 hover:bg-slate-100">Inicio</a>
          <a href="index.html#categorias" class="rounded-lg px-3 py-2.5 hover:bg-slate-100">Categorías</a>
          <a href="index.html#productos" class="rounded-lg px-3 py-2.5 hover:bg-slate-100">Catálogo</a>
          <a href="index.html#servicios" class="rounded-lg px-3 py-2.5 hover:bg-slate-100">Servicios</a>
          <a href="index.html#ofertas" class="rounded-lg px-3 py-2.5 text-brand-600 hover:bg-brand-50">Ofertas</a>
          <a href="carrito.html" class="rounded-lg px-3 py-2.5 hover:bg-slate-100">Carrito</a>
          <a href="index.html#contacto" class="rounded-lg px-3 py-2.5 hover:bg-slate-100">Contacto</a>
        </nav>
        <form action="index.html" method="get" class="relative mt-3" role="search">
          <label for="search-input-mobile" class="sr-only">Buscar productos</label>
          <svg class="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
          <input id="search-input-mobile" name="q" type="search" placeholder="Buscar productos…" class="w-full rounded-full border border-slate-200 bg-slate-100 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100">
        </form>
      </div>
    </div>
  </header>`;
}

/* ------------------------- FOOTER ------------------------- */
function footerHTML() {
  return `
  <footer id="contacto" class="bg-slate-950 text-slate-400">
    <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <a href="index.html" class="flex items-center gap-2.5" aria-label="Aitanas Constructor, inicio">
            <span class="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" /></svg>
            </span>
            <span class="leading-none">
              <span class="block text-lg font-extrabold tracking-tight text-white">Aitanas</span>
              <span class="mt-1 block text-[10px] font-bold uppercase tracking-[0.3em] text-brand-400">Constructor</span>
            </span>
          </a>
          <p class="mt-4 max-w-xs text-sm leading-relaxed">Materiales y herramientas para profesionales y particulares. Calidad, precio y entrega rápida desde 2010.</p>
          <div class="mt-5 flex gap-2.5">
            <a href="#" class="grid h-9 w-9 place-items-center rounded-full bg-white/5 transition hover:bg-brand-600 hover:text-white" aria-label="Facebook"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z"/></svg></a>
            <a href="#" class="grid h-9 w-9 place-items-center rounded-full bg-white/5 transition hover:bg-brand-600 hover:text-white" aria-label="Instagram"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07Zm0 1.98c-3.15 0-3.5.01-4.74.07-1.14.05-1.76.24-2.17.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.17-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.05 1.14.24 1.76.4 2.17.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.17.4 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.14-.05 1.76-.24 2.17-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.17.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.14-.24-1.76-.4-2.17a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.17-.4-1.24-.06-1.59-.07-4.74-.07Zm0 3.37a4.49 4.49 0 1 1 0 8.98 4.49 4.49 0 0 1 0-8.98Zm0 7.4a2.91 2.91 0 1 0 0-5.82 2.91 2.91 0 0 0 0 5.82Zm5.72-7.6a1.05 1.05 0 1 1-2.1 0 1.05 1.05 0 0 1 2.1 0Z"/></svg></a>
            <a href="#" class="grid h-9 w-9 place-items-center rounded-full bg-white/5 transition hover:bg-brand-600 hover:text-white" aria-label="YouTube"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z"/></svg></a>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-bold uppercase tracking-wider text-white">Tienda</h3>
          <ul class="mt-4 space-y-2.5 text-sm">
            <li><a href="index.html#productos" class="transition hover:text-brand-400">Materiales</a></li>
            <li><a href="index.html#productos" class="transition hover:text-brand-400">Herramientas</a></li>
            <li><a href="index.html#productos" class="transition hover:text-brand-400">Pintura</a></li>
            <li><a href="index.html#productos" class="transition hover:text-brand-400">Baño y cocina</a></li>
            <li><a href="index.html#servicios" class="transition hover:text-brand-400">Servicios</a></li>
            <li><a href="index.html#ofertas" class="transition hover:text-brand-400">Ofertas</a></li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-bold uppercase tracking-wider text-white">Ayuda</h3>
          <ul class="mt-4 space-y-2.5 text-sm">
            <li><a href="#" class="transition hover:text-brand-400">Envíos y entregas</a></li>
            <li><a href="#" class="transition hover:text-brand-400">Devoluciones</a></li>
            <li><a href="#" class="transition hover:text-brand-400">Formas de pago</a></li>
            <li><a href="#" class="transition hover:text-brand-400">Garantía</a></li>
            <li><a href="#" class="transition hover:text-brand-400">Preguntas frecuentes</a></li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-bold uppercase tracking-wider text-white">Contacto</h3>
          <ul class="mt-4 space-y-3 text-sm">
            <li class="flex gap-2.5">
              <svg class="mt-0.5 h-4 w-4 shrink-0 text-brand-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
              <span>Polígono Industrial Norte,<br>Calle Obra 24 · 28021 Madrid</span>
            </li>
            <li class="flex gap-2.5">
              <svg class="mt-0.5 h-4 w-4 shrink-0 text-brand-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
              <a href="tel:900123456" class="transition hover:text-brand-400">900 123 456</a>
            </li>
            <li class="flex gap-2.5">
              <svg class="mt-0.5 h-4 w-4 shrink-0 text-brand-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
              <a href="mailto:hola@aitanaconstructor.es" class="transition hover:text-brand-400">hola@aitanaconstructor.es</a>
            </li>
            <li class="flex gap-2.5">
              <svg class="mt-0.5 h-4 w-4 shrink-0 text-brand-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              <span>Lun–Sáb · 8:00–20:00</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-12 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-xs text-slate-500">© <span id="year">2026</span> Aitanas Constructor. Todos los derechos reservados.</p>
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex gap-2" aria-label="Métodos de pago aceptados">
            <span class="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-slate-300">VISA</span>
            <span class="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-slate-300">MASTERCARD</span>
            <span class="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-slate-300">PAYPAL</span>
            <span class="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-slate-300">BIZUM</span>
          </div>
          <div class="flex gap-4 text-xs">
            <a href="#" class="transition hover:text-brand-400">Privacidad</a>
            <a href="#" class="transition hover:text-brand-400">Cookies</a>
            <a href="#" class="transition hover:text-brand-400">Aviso legal</a>
          </div>
        </div>
      </div>
    </div>
  </footer>`;
}

/* ------------------------- INICIALIZACIÓN ------------------------- */
function initCommon(options) {
  const opts = options || {};

  const headerHost = document.getElementById('site-header');
  if (headerHost) headerHost.outerHTML = headerHTML(opts.active);

  const footerHost = document.getElementById('site-footer');
  if (footerHost) footerHost.outerHTML = footerHTML();

  ensureToast();
  updateCartBadge();

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      const isHidden = mobileMenu.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', String(!isHidden));
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const newsletter = document.getElementById('newsletter-form');
  if (newsletter) {
    newsletter.addEventListener('submit', function (event) {
      event.preventDefault();
      showToast('¡Gracias! Revisa tu correo para confirmar la suscripción.');
      newsletter.reset();
    });
  }

  /* Añadir al carrito y favoritos desde cualquier tarjeta */
  document.addEventListener('click', function (event) {
    const add = event.target.closest('[data-add]');
    if (add) {
      event.preventDefault();
      const product = window.findProduct(add.dataset.add);
      addToCart(add.dataset.add, 1);
      if (product) showToast(product.name + ' añadido al carrito');
      return;
    }

    const fav = event.target.closest('[data-fav]');
    if (fav) {
      event.preventDefault();
      const active = fav.classList.toggle('text-rose-500');
      fav.setAttribute('aria-pressed', active ? 'true' : 'false');
      fav.querySelector('svg').setAttribute('fill', active ? 'currentColor' : 'none');
    }
  });
}
