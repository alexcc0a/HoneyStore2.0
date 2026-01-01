// catalog.js — рендер каталога и поиск (мок данных)
console.log('catalog.js loaded');
const PRODUCTS = [
  { id: 'p1', title: 'Липовый', description: 'Светлый. Ароматный.', price: 750, image: 'assets/images/lipa.png', tags: ['липа'] },
  { id: 'p2', title: 'Гречишный', description: 'Темный. Насыщенный.', price: 680, image: 'assets/images/gre.png', tags: ['гречиха'] },
  { id: 'p3', title: 'Цветочный', description: 'Сбалансированный и нежный.', price: 620, image: 'assets/images/cve.png', tags: ['цветы'] },
  { id: 'p4', title: 'Акациевый', description: 'Очень светлый, мягкий вкус.', price: 850, image: 'assets/images/acacia.png', tags: ['акация'] },
  { id: 'p5', title: 'Лесной', description: 'Сложный букет лесных растений.', price: 700, image: 'assets/images/explore.png', tags: ['лес'] }
];

function formatPrice(v){ return v + ' ₽ / 1 л.'; }

// Render a product card from template
function renderProduct(product){
  const tpl = document.getElementById('product-template');
  if(!tpl) return null;
  const el = tpl.content.firstElementChild.cloneNode(true);
  if(product.id) el.dataset.id = product.id;
  const titleEl = el.querySelector('.product-title');
  if(titleEl) titleEl.textContent = product.title || '';
  const descEl = el.querySelector('.product-desc');
  if(descEl) descEl.textContent = product.description || '';
  const priceEl = el.querySelector('.product-price');
  if(priceEl && typeof product.price !== 'undefined') priceEl.textContent = formatPrice(product.price);
  const img = el.querySelector('.product-photo');
  if(img){
    img.src = product.image || '';
    img.alt = product.title || '';
    img.loading = 'lazy';
  }
  const btn = el.querySelector('.btn-buy');
  if(btn){
    btn.addEventListener('click', () => {
      if(window.Cart){
        window.Cart.add({ id: product.id, title: product.title, price: product.price }, 1);
      }
    });
  }
  return el;
}

// Initial render for recommended on index
function renderRecommended(){
  const grid = document.getElementById('recommended-grid');
  if(!grid) return;

  // Рендерим только указанные сорта в нужном порядке
  const order = ['Липовый', 'Цветочный', 'Гречишный'];
  const items = order.map(t => PRODUCTS.find(p => p.title === t)).filter(Boolean);
  grid.innerHTML = '';
  items.forEach(p => {
    const card = renderProduct(p);
    if(!card) return;
    // Убираем описание, цену и кнопку "Купить" только в блоке Рекомендуем
    const desc = card.querySelector('.product-desc');
    if(desc) desc.remove();
    const priceEl = card.querySelector('.product-price');
    if(priceEl) priceEl.remove();
    const buyBtn = card.querySelector('.btn-buy');
    if(buyBtn) buyBtn.remove();

    // Сделать карточку кликабельной — перейти в каталог при клике или Enter
    card.classList.add('product-card--link');
    card.setAttribute('role', 'link');
    card.tabIndex = 0;
    card.addEventListener('click', () => { window.location.href = 'catalog.html'; });
    card.addEventListener('keypress', (e) => { if(e.key === 'Enter' || e.key === ' ') { window.location.href = 'catalog.html'; } });

    grid.appendChild(card);
  });
  console.log('recommended rendered, count=', grid.children.length);
}

// Catalog rendering and search
function initCatalog(){
  const grid = document.getElementById('catalog-grid');
  const search = document.getElementById('catalog-search');
  const empty = document.getElementById('catalog-empty');
  if(!grid) return;

  let results = [...PRODUCTS];

  function renderAll(list){
    grid.innerHTML = '';
    if(list.length === 0){ empty.hidden = false; return; }
    empty.hidden = true;
    list.forEach(p => grid.appendChild(renderProduct(p)));
  }

  function normalize(q){ return q.trim().toLowerCase(); }

  function doSearch(q){
    const n = normalize(q);
    if(!n) return PRODUCTS;
    return PRODUCTS.filter(p => {
      return p.title.toLowerCase().includes(n)
        || (p.description || '').toLowerCase().includes(n)
        || ((p.tags || []).some(t => t.toLowerCase().includes(n)));
    });
  }

  let debounceTimer = null;
  if(search){
    search.addEventListener('input', (e)=>{
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(()=>{
        results = doSearch(e.target.value);
        renderAll(results);
      }, 220);
    });
  }

  // initial
  renderAll(results);
}

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', ()=>{
  renderRecommended();
  initCatalog();
});

export { PRODUCTS };
