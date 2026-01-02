// scripts.js — управление гамбургер-меню и доступностью
(function(){
  const burger = document.querySelector('.burger');
  const navList = document.getElementById('main-nav-list');
  if (!burger || !navList) return;

  function openMenu(){
    navList.classList.add('is-open');
    burger.setAttribute('aria-expanded','true');
    // move focus to first link
    const firstLink = navList.querySelector('a');
    if(firstLink){ firstLink.focus(); }
    // prevent body scroll when menu open on small screens
    document.body.style.overflow = 'hidden';
  }

  function closeMenu(){
    navList.classList.remove('is-open');
    burger.setAttribute('aria-expanded','false');
    burger.focus();
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', function(){
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    if(expanded) closeMenu(); else openMenu();
  });

  // Close on escape
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' || e.key === 'Esc'){
      if(navList.classList.contains('is-open')){
        closeMenu();
      }
    }
  });

  // Close when clicking outside menu (mobile)
  document.addEventListener('click', function(e){
    if(!navList.contains(e.target) && !burger.contains(e.target) && navList.classList.contains('is-open')){
      closeMenu();
    }
  });
})();

