/* ============================================================
   Página de inicio — catálogo, filtros y búsqueda
============================================================ */

initCommon({ active: 'inicio' });

const grid = document.getElementById('product-grid');
const tabs = document.getElementById('product-tabs');
const searchInputs = [
  document.getElementById('search-input'),
  document.getElementById('search-input-mobile')
].filter(Boolean);

let activeFilter = 'todos';

/* ------------------------- RENDER ------------------------- */
function renderProducts() {
  const query = (searchInputs[0] ? searchInputs[0].value : '').trim().toLowerCase();
  const list = window.PRODUCTS.filter(function (product) {
    const matchesCategory = activeFilter === 'todos' || product.key === activeFilter;
    const matchesQuery = !query ||
      product.name.toLowerCase().includes(query) ||
      product.cat.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  if (!list.length) {
    grid.innerHTML = `
      <div class="col-span-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
        <p class="text-3xl">🔍</p>
        <p class="mt-3 font-bold text-slate-900">Sin resultados</p>
        <p class="mt-1 text-sm text-slate-500">Prueba con otra búsqueda o categoría.</p>
      </div>`;
    return;
  }

  grid.innerHTML = list.map(window.productCardHTML).join('');
}

/* ------------------------- FILTROS ------------------------- */
function setFilter(filter) {
  activeFilter = filter;
  tabs.querySelectorAll('button').forEach(function (button) {
    const isActive = button.dataset.filter === filter;
    button.className = 'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ' +
      (isActive
        ? 'bg-slate-900 text-white'
        : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-600');
    button.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  renderProducts();
}

tabs.querySelectorAll('button').forEach(function (button) {
  button.setAttribute('role', 'tab');
});

tabs.addEventListener('click', function (event) {
  const button = event.target.closest('button[data-filter]');
  if (button) setFilter(button.dataset.filter);
});

document.querySelectorAll('[data-cat-link]').forEach(function (link) {
  link.addEventListener('click', function () {
    setFilter(link.dataset.catLink);
  });
});

/* ------------------------- BÚSQUEDA ------------------------- */
searchInputs.forEach(function (input) {
  input.addEventListener('input', function (event) {
    searchInputs.forEach(function (other) {
      if (other !== event.target) other.value = event.target.value;
    });
    renderProducts();
  });
});

/* Si llegamos con ?q=... desde el buscador del header */
const initialQuery = new URLSearchParams(window.location.search).get('q') || '';
if (initialQuery) {
  searchInputs.forEach(function (input) {
    input.value = initialQuery;
  });
}

/* Inicialización */
setFilter('todos');

/* ============================================================
   SERVICIOS — tarjetas y modal de presupuesto
============================================================ */

const servicesGrid = document.getElementById('services-grid');
const quoteModal = document.getElementById('quote-modal');
const quoteForm = document.getElementById('quote-form');
const quoteService = document.getElementById('quote-service');

function serviceCardHTML(service) {
  return `
  <article class="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft">
    <div class="flex items-start justify-between gap-3">
      <span class="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-2xl transition group-hover:bg-brand-100" role="img" aria-label="${service.name}">${service.icon}</span>
      <span class="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600">Desde ${window.formatPriceShort(service.from)}</span>
    </div>
    <h3 class="mt-4 text-base font-bold text-slate-900">${service.name}</h3>
    <p class="mt-1.5 flex-1 text-sm leading-relaxed text-slate-500">${service.description}</p>
    <button type="button" data-service="${service.name}" class="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600">
      Pedir presupuesto
      <svg class="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
    </button>
  </article>`;
}

if (servicesGrid && Array.isArray(window.SERVICES)) {
  servicesGrid.innerHTML = window.SERVICES.map(serviceCardHTML).join('');
}

/* Rellenar el desplegable del formulario */
if (quoteService && Array.isArray(window.SERVICES)) {
  window.SERVICES.forEach(function (service) {
    const option = document.createElement('option');
    option.value = service.name;
    option.textContent = service.name;
    quoteService.appendChild(option);
  });
}

/* ------------------------- MODAL ------------------------- */
function openQuote(serviceName) {
  if (!quoteModal) return;
  if (serviceName && quoteService) quoteService.value = serviceName;
  quoteModal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
  const nameField = document.getElementById('quote-name');
  if (nameField) nameField.focus();
}

function closeQuote() {
  if (!quoteModal) return;
  quoteModal.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
}

document.addEventListener('click', function (event) {
  const trigger = event.target.closest('[data-service]');
  if (trigger) {
    event.preventDefault();
    openQuote(trigger.dataset.service);
    return;
  }

  if (event.target.closest('[data-close-quote]')) {
    closeQuote();
  }
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && quoteModal && !quoteModal.classList.contains('hidden')) {
    closeQuote();
  }
});

if (quoteForm) {
  quoteForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('quote-name').value.trim();
    showToast('¡Gracias' + (name ? ', ' + name : '') + '! Hemos recibido tu solicitud de presupuesto.');
    quoteForm.reset();
    closeQuote();
  });
}
