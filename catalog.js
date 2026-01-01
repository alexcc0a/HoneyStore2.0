// catalog.js — рендер каталога и поиск (мок данных)
const PRODUCTS = [
  { id: 'p1', title: 'Липовый', description: 'Светлый. Ароматный.', price: 750, image: 'assets/images/lipa.png', tags: ['липа'] },
  { id: 'p2', title: 'Гречишный', description: 'Темный. Насыщенный.', price: 680, image: 'assets/images/gre.png', tags: ['гречиха'] },
  { id: 'p3', title: 'Цветочный', description: 'Сбалансированный и нежный.', price: 620, image: 'assets/images/cve.png', tags: ['цветы'] },
  { id: 'p4', title: 'Акациевый', description: 'Очень светлый, мягкий вкус.', price: 850, image: 'assets/images/acacia.png', tags: ['акация'] },
  { id: 'p5', title: 'Лесной', description: 'Сложный букет лесных растений.', price: 700, image: 'assets/images/explore.png', tags: ['лес'] }
];

function formatPrice(v){ return v + ' ₽'; }

// Render a product card from template
function renderProduct(product){
  const tpl = document.getElementById('product-template');
  if(!tpl) return null;
  const el = tpl.content.firstElementChild.cloneNode(true);
  el.dataset.id = product.id;
  el.querySelector('.product-title').textContent = product.title;
  el.querySelector('.product-desc').textContent = product.description;
  el.querySelector('.product-price').textContent = formatPrice(product.price);
  const img = el.querySelector('.product-photo');
  if(img){
    img.src = product.image || '';
    img.alt = product.title;
    img.loading = 'lazy';
  }
  const btn = el.querySelector('.btn-buy');
  btn.addEventListener('click', () => {
    // add to cart via global Cart API
    if(window.Cart){
      window.Cart.add({ id: product.id, title: product.title, price: product.price }, 1);
    }
  });
  return el;
}

// Initial render for recommended on index
function renderRecommended(){
  const grid = document.getElementById('recommended-grid');
  if(!grid) return;
  const items = PRODUCTS.slice(0,3);
  items.forEach(p => grid.appendChild(renderProduct(p)));
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
      return p.title.toLowerCase().includes(n) || p.description.toLowerCase().includes(n) || (p.tags||[]).some(t => t.includes(n));
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
