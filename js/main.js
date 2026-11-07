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
