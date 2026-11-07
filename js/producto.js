/* ============================================================
   Página de detalle de producto
============================================================ */

initCommon({ active: 'productos' });

const detailEl = document.getElementById('product-detail');
const relatedEl = document.getElementById('related-products');
const relatedSection = document.getElementById('related-section');
const params = new URLSearchParams(window.location.search);
const product = window.findProduct(params.get('id'));

/* ------------------------- NO ENCONTRADO ------------------------- */
if (!product) {
  document.title = 'Producto no encontrado — Aitanas Constructor';
  detailEl.innerHTML = `
    <div class="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
      <p class="text-5xl">🔍</p>
      <h1 class="mt-4 text-2xl font-extrabold text-slate-900">Producto no encontrado</h1>
      <p class="mx-auto mt-2 max-w-md text-slate-500">El producto que buscas no existe o ya no está disponible. Echa un vistazo a nuestro catálogo.</p>
      <a href="index.html#productos" class="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-500">
        Volver al catálogo
      </a>
    </div>`;
  if (relatedSection) relatedSection.classList.add('hidden');
} else {
  renderDetail();
  renderRelated();
}

/* ------------------------- DETALLE ------------------------- */
function renderDetail() {
  document.title = product.name + ' — Aitanas Constructor';
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute('content', product.short);

  const breadcrumb = document.getElementById('breadcrumb-product');
  if (breadcrumb) breadcrumb.textContent = product.name;

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const deliveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    .toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  const oldPrice = product.oldPrice
    ? `<p class="text-lg font-semibold text-slate-400 line-through">${window.formatPrice(product.oldPrice)}</p>
       <span class="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-600">-${discount}%</span>`
    : '';

  const specs = product.specs.map(function (spec) {
    return `<div>
      <dt class="text-[11px] font-bold uppercase tracking-wider text-slate-400">${spec[0]}</dt>
      <dd class="mt-1 text-sm font-semibold text-slate-900">${spec[1]}</dd>
    </div>`;
  }).join('');

  detailEl.innerHTML = `
    <div class="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <!-- Imagen -->
      <div>
        <div class="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-3xl bg-gradient-to-br ${product.grad}">
          ${badgeHTML(product)}
          <span class="select-none text-[10rem] drop-shadow-xl sm:text-[12rem]" role="img" aria-label="${product.cat}">${product.icon}</span>
        </div>

        <div class="mt-4 grid grid-cols-3 gap-3 text-center text-xs font-semibold text-slate-600">
          <div class="rounded-xl border border-slate-200 bg-white px-2 py-3">
            <span class="block text-lg">🚚</span>
            <span class="mt-1 block">Envío 24/48h</span>
          </div>
          <div class="rounded-xl border border-slate-200 bg-white px-2 py-3">
            <span class="block text-lg">🛡️</span>
            <span class="mt-1 block">Garantía oficial</span>
          </div>
          <div class="rounded-xl border border-slate-200 bg-white px-2 py-3">
            <span class="block text-lg">↩️</span>
            <span class="mt-1 block">30 días</span>
          </div>
        </div>
      </div>

      <!-- Información -->
      <div>
        <p class="text-xs font-bold uppercase tracking-widest text-brand-600">${product.cat}</p>
        <h1 class="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">${product.name}</h1>

        <div class="mt-3 flex flex-wrap items-center gap-2">
          <span class="flex gap-0.5">${starsHTML(product.rating, 'h-4 w-4')}</span>
          <span class="text-sm font-semibold text-slate-900">${product.rating.toFixed(1)}</span>
          <span class="text-sm text-slate-500">(${product.reviews} reseñas)</span>
          <span class="text-slate-300">·</span>
          <a href="#related-section" class="text-sm font-semibold text-brand-600 hover:text-brand-700">Ver valoraciones</a>
        </div>

        <div class="mt-5 flex flex-wrap items-end gap-3">
          <p class="text-4xl font-extrabold tracking-tight text-slate-900">${window.formatPrice(product.price)}${product.unit ? '<span class="ml-1 text-base font-medium text-slate-400">' + product.unit + '</span>' : ''}</p>
          ${oldPrice}
        </div>
        <p class="mt-1 text-xs text-slate-500">IVA incluido · Envío calculado en el carrito</p>

        <p class="mt-5 text-base leading-relaxed text-slate-600">${product.description}</p>

        <div class="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
          <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
          En stock · listo para enviar
        </div>

        <!-- Cantidad y acciones -->
        <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div class="flex items-center rounded-xl border border-slate-200 bg-white">
            <button type="button" id="qty-minus" class="qty-btn m-1" aria-label="Reducir cantidad">−</button>
            <label for="qty-input" class="sr-only">Cantidad</label>
            <input id="qty-input" type="number" min="1" max="99" value="1" inputmode="numeric"
              class="w-12 border-0 bg-transparent text-center text-sm font-bold text-slate-900 outline-none">
            <button type="button" id="qty-plus" class="qty-btn m-1" aria-label="Aumentar cantidad">+</button>
          </div>

          <button type="button" id="detail-add" class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
            Añadir al carrito
          </button>

          <button type="button" id="detail-buy" class="inline-flex items-center justify-center rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-brand-500">
            Comprar ahora
          </button>
        </div>

        <!-- Entrega -->
        <div class="mt-6 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
          </span>
          <div class="text-sm">
            <p class="font-bold text-slate-900">Entrega estimada: ${deliveryDate}</p>
            <p class="mt-0.5 text-slate-500">Envío gratis en pedidos superiores a 100 €. Devolución gratuita durante 30 días.</p>
          </div>
        </div>

        <!-- Especificaciones -->
        <dl class="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-slate-200 pt-6">
          ${specs}
        </dl>
      </div>
    </div>`;

  wireDetailActions();
}

/* ------------------------- ACCIONES ------------------------- */
function wireDetailActions() {
  const qtyInput = document.getElementById('qty-input');
  const minus = document.getElementById('qty-minus');
  const plus = document.getElementById('qty-plus');
  const addButton = document.getElementById('detail-add');
  const buyButton = document.getElementById('detail-buy');

  function clampQty() {
    let value = parseInt(qtyInput.value, 10);
    if (isNaN(value)) value = 1;
    value = Math.min(99, Math.max(1, value));
    qtyInput.value = value;
    return value;
  }

  minus.addEventListener('click', function () {
    qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
  });

  plus.addEventListener('click', function () {
    qtyInput.value = Math.min(99, (parseInt(qtyInput.value, 10) || 1) + 1);
  });

  qtyInput.addEventListener('change', clampQty);

  addButton.addEventListener('click', function () {
    const qty = clampQty();
    addToCart(product.id, qty);
    showToast(product.name + ' (' + qty + ') añadido al carrito');
  });

  buyButton.addEventListener('click', function () {
    addToCart(product.id, clampQty());
    window.location.href = 'carrito.html';
  });
}

/* ------------------------- RELACIONADOS ------------------------- */
function renderRelated() {
  const sameCategory = window.PRODUCTS.filter(function (item) {
    return item.key === product.key && item.id !== product.id;
  });
  const others = window.PRODUCTS.filter(function (item) {
    return item.key !== product.key;
  });
  const related = sameCategory.concat(others).slice(0, 4);
  relatedEl.innerHTML = related.map(window.productCardHTML).join('');
}
