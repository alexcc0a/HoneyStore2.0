// cart.js — простая реализация Cart API с localStorage и событиями
const STORAGE_KEY = 'honeyStore.cart_v1';

function createCart(){
  const state = { items: {} };
  const listeners = new Set();

  function persist(){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }catch(e){
      console.error('Не удалось сохранить корзину в localStorage', e);
    }
    emit();
  }

  function emit(){
    const detail = { items: getItems(), total: getTotal(), count: count() };
    window.dispatchEvent(new CustomEvent('cart:changed', { detail }));
    listeners.forEach(fn => fn(detail));
  }

  function restore(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return;
      const parsed = JSON.parse(raw);
      if(parsed && parsed.items){
        state.items = parsed.items;
      }
    }catch(e){ console.error('Ошибка при восстановлении корзины', e); }
  }

  function add(product, qty=1){
    if(!product || !product.id) return;
    const id = product.id;
    const existing = state.items[id];
    if(existing){
      existing.qty = (existing.qty || 0) + qty;
    }else{
      state.items[id] = { id, title: product.title||'', price: product.price||0, qty };
    }
    persist();
  }

  function remove(id){
    delete state.items[id];
    persist();
  }

  function update(id, qty){
    const n = Number(qty);
    if(isNaN(n) || n < 0) return;
    if(n === 0){ remove(id); return; }
    if(state.items[id]){
      state.items[id].qty = n;
      persist();
    }
  }

  function getItems(){ return Object.values(state.items); }
  function getTotal(){ return getItems().reduce((s,i)=>s + (Number(i.price)||0) * (Number(i.qty)||0), 0); }
  function count(){ return getItems().reduce((s,i)=>s + (Number(i.qty)||0), 0); }

  function clear(){ state.items = {}; persist(); }

  function onChange(fn){ listeners.add(fn); return ()=>listeners.delete(fn); }

  // sync across tabs
  window.addEventListener('storage', (e)=>{
    if(e.key === STORAGE_KEY){ restore(); emit(); }
  });

  restore();

  return { add, remove, update, getItems, getTotal, count, clear, onChange };
}

// expose global Cart
if(!window.Cart){
  window.Cart = createCart();
}

// Simple UI bindings for header cart count and cart page
window.addEventListener('DOMContentLoaded', ()=>{
  const updateUI = ()=>{
    const countNode = document.getElementById('cart-count');
    if(countNode){
      const c = window.Cart.count();
      // не отображаем 0 рядом с "Корзина" — скрываем спан, показываем число только если > 0
      if(Number(c) > 0){
        countNode.textContent = c;
        countNode.style.display = '';
      }else{
        countNode.textContent = '';
        countNode.style.display = 'none';
      }
    }

    const totalNode = document.getElementById('cart-total');
    if(totalNode) totalNode.textContent = window.Cart.getTotal();

    const table = document.getElementById('cart-table');
    if(table && window.Cart){
      // remove previous rows except header
      const rows = Array.from(table.querySelectorAll('.cart-row')).filter(r=>!r.classList.contains('cart-row--head'));
      rows.forEach(r=>r.remove());
      const items = window.Cart.getItems();
      items.forEach(item=>{
        const row = document.createElement('div');
        row.className = 'cart-row';
        row.innerHTML = `
          <div class="col name">${escapeHtml(item.title)}</div>
          <div class="col qty"><input type="number" min="0" value="${item.qty}" data-id="${item.id}" class="qty-input"></div>
          <div class="col price">${item.price} ₽</div>
        `;
        table.appendChild(row);
      });

      // attach listeners for qty inputs
      $all('.qty-input', table).forEach(inp =>{
        inp.addEventListener('change', (e)=>{
          const id = e.target.dataset.id;
          const v = Number(e.target.value);
          window.Cart.update(id, v);
        });
      });
    }
  };

  // helper selectors
  function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, (c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }

  updateUI();

  // subscribe
  window.Cart.onChange(()=>updateUI());

  // checkout form
  const form = document.getElementById('checkout-form');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      // simple validation handled by required attributes
      const data = new FormData(form);
      const payload = Object.fromEntries(data.entries());
      // in real app we'd post to server. Here show console and clear cart
      console.info('Оформлен заказ', payload, window.Cart.getItems());
      window.Cart.clear();
      form.reset();
      alert('Спасибо! Мы получили ваш заказ — это демо.');
    });
  }

});

export default window.Cart;

