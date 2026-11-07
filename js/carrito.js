/* ============================================================
   Página del carrito
============================================================ */

initCommon({ active: 'carrito' });

const itemsEl = document.getElementById('cart-items');
const emptyEl = document.getElementById('cart-empty');
const actionsEl = document.getElementById('cart-actions');
const summaryCountEl = document.getElementById('summary-count');
const subtotalEl = document.getElementById('cart-subtotal');
const shippingEl = document.getElementById('cart-shipping');
const totalEl = document.getElementById('cart-total');
const noteEl = document.getElementById('free-shipping-note');
const checkoutBtn = document.getElementById('checkout-btn');
const clearBtn = document.getElementById('clear-cart');

const FREE_SHIPPING_FROM = 100;
const SHIPPING_COST = 4.95;

/* ------------------------- LÍNEA DE CARRITO ------------------------- */
function lineHTML(product, qty) {
  return `
  <article class="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <a href="producto.html?id=${product.id}" class="relative grid h-24 w-24 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${product.grad} text-4xl" aria-label="Ver ${product.name}">
      <span role="img" aria-hidden="true">${product.icon}</span>
    </a>
    <div class="flex min-w-0 flex-1 flex-col">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="text-[11px] font-bold uppercase tracking-wider text-brand-600">${product.cat}</p>
          <h2 class="mt-0.5 text-sm font-bold leading-snug text-slate-900">
            <a href="producto.html?id=${product.id}" class="transition hover:text-brand-600">${product.name}</a>
          </h2>
          <p class="mt-1 text-xs text-slate-500">${window.formatPrice(product.price)}${product.unit || ''} / ud.</p>
        </div>
        <button type="button" data-remove="${product.id}" class="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" aria-label="Eliminar ${product.name} del carrito">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
        </button>
      </div>
      <div class="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
        <div class="flex items-center gap-1.5">
          <button type="button" data-dec="${product.id}" class="qty-btn" aria-label="Reducir cantidad de ${product.name}">−</button>
          <span class="w-9 text-center text-sm font-bold text-slate-900">${qty}</span>
          <button type="button" data-inc="${product.id}" class="qty-btn" aria-label="Aumentar cantidad de ${product.name}">+</button>
        </div>
        <p class="text-base font-extrabold text-slate-900">${window.formatPrice(product.price * qty)}</p>
      </div>
    </div>
  </article>`;
}

/* ------------------------- RENDER ------------------------- */
function renderCart() {
  const cart = getCart().filter(function (item) {
    return window.findProduct(item.id);
  });
  const count = cart.reduce(function (total, item) {
    return total + item.qty;
  }, 0);

  if (!cart.length) {
    itemsEl.innerHTML = '';
    itemsEl.classList.add('hidden');
    emptyEl.classList.remove('hidden');
    actionsEl.classList.add('hidden');
    summaryCountEl.textContent = '0';
    subtotalEl.textContent = window.formatPrice(0);
    shippingEl.textContent = '—';
    shippingEl.className = 'font-semibold text-slate-900';
    totalEl.textContent = window.formatPrice(0);
    noteEl.classList.add('hidden');
    checkoutBtn.disabled = true;
    checkoutBtn.removeAttribute('data-total');
    updateCartBadge();
    return;
  }

  itemsEl.classList.remove('hidden');
  emptyEl.classList.add('hidden');
  actionsEl.classList.remove('hidden');
  checkoutBtn.disabled = false;

  itemsEl.innerHTML = cart.map(function (item) {
    return lineHTML(window.findProduct(item.id), item.qty);
  }).join('');

  const subtotal = cart.reduce(function (total, item) {
    const product = window.findProduct(item.id);
    return total + product.price * item.qty;
  }, 0);
  const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  summaryCountEl.textContent = count;
  subtotalEl.textContent = window.formatPrice(subtotal);
  shippingEl.textContent = shipping === 0 ? 'Gratis' : window.formatPrice(shipping);
  shippingEl.className = shipping === 0 ? 'font-semibold text-emerald-600' : 'font-semibold text-slate-900';
  totalEl.textContent = window.formatPrice(total);
  checkoutBtn.dataset.total = total.toFixed(2);

  if (subtotal < FREE_SHIPPING_FROM) {
    noteEl.className = 'rounded-xl bg-brand-50 px-3 py-2.5 text-xs font-medium text-brand-700';
    noteEl.textContent = 'Te faltan ' + window.formatPrice(FREE_SHIPPING_FROM - subtotal) + ' para conseguir el envío gratis.';
  } else {
    noteEl.className = 'rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-medium text-emerald-700';
    noteEl.textContent = '¡Enhorabuena! Tienes envío gratis en este pedido.';
  }
  noteEl.classList.remove('hidden');

  updateCartBadge();
}

/* ------------------------- ACCIONES ------------------------- */
function changeQty(id, delta) {
  const item = getCart().find(function (line) {
    return line.id === Number(id);
  });
  if (!item) return;

  if (item.qty + delta <= 0) {
    removeFromCart(id);
    showToast('Producto eliminado del carrito');
  } else {
    setQty(id, item.qty + delta);
  }
  renderCart();
}

itemsEl.addEventListener('click', function (event) {
  const inc = event.target.closest('[data-inc]');
  if (inc) {
    changeQty(inc.dataset.inc, 1);
    return;
  }

  const dec = event.target.closest('[data-dec]');
  if (dec) {
    changeQty(dec.dataset.dec, -1);
    return;
  }

  const remove = event.target.closest('[data-remove]');
  if (remove) {
    removeFromCart(remove.dataset.remove);
    renderCart();
    showToast('Producto eliminado del carrito');
  }
});

clearBtn.addEventListener('click', function () {
  if (!getCart().length) return;
  if (window.confirm('¿Quieres vaciar el carrito?')) {
    clearCart();
    renderCart();
    showToast('Carrito vaciado');
  }
});

checkoutBtn.addEventListener('click', function () {
  const total = Number(checkoutBtn.dataset.total || 0);
  if (!total) return;
  showToast('Pedido simulado por ' + window.formatPrice(total) + '. ¡Gracias por confiar en Aitanas Constructor!');
});

/* Inicialización */
renderCart();
