/* ============================================================
   BOTANICUM ANCESTRAL — interações
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');

  if (navToggle && header) {
    navToggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    const closeMenu = () => {
      header.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };
    // fecha o menu com Esc, ao tocar fora dele ou ao ampliar a tela
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
    document.addEventListener('click', (e) => { if (!header.contains(e.target)) closeMenu(); });
    window.matchMedia('(min-width: 1021px)').addEventListener('change', closeMenu);

    // close mobile menu after a nav link is chosen
    header.querySelectorAll('.main-nav a, .main-nav button').forEach((link) => {
      link.addEventListener('click', () => {
        header.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  let lastScroll = 0;
  const onScroll = () => {
    const y = window.scrollY;
    if (y > 8 && lastScroll <= 8) {
      header.style.borderBottomColor = 'var(--line-strong)';
      header.style.boxShadow = '0 12px 28px -20px rgba(0,0,0,0.6)';
    } else if (y <= 8 && lastScroll > 8) {
      header.style.borderBottomColor = '';
      header.style.boxShadow = '';
    }
    lastScroll = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Smooth-scroll offset for sticky header ---------- */
  const headerHeight = () => (header ? header.offsetHeight : 0);

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight() - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});

/* ============================================================
   CONFIGURAÇÃO E CATÁLOGO (edite aqui para alterar o site)
   ============================================================ */
const CONFIG = {
  // WhatsApp que recebe os pedidos: só números, com DDI + DDD (ex.: 5511999999999)
  whatsapp: '5511999999999'
};

const WIKI = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/';

// Para trocar uma foto, use uma URL ou um arquivo local, ex.: 'img/minha-planta.jpg'
// Para ocultar uma planta, coloque ativo: false. A ordem da lista é a ordem do site.
const CATALOGO = [
  {
    numero: 1, ativo: true, preco: 89.00,
    cientifico: "Dionaea muscipula 'Big Mouth'", popular: 'Dioneia',
    descricao: 'Armadilha de mordida. Fecha em menos de meio segundo quando dois pelos sensores são tocados em sequência. Folhagem robusta, lóbulos largos, boa para iniciantes.',
    tags: ['Sol pleno', 'Dormência de inverno'],
    imagem: WIKI + 'Dionaea_muscipula.jpg'
  },
  {
    numero: 2, ativo: true, preco: 145.00,
    cientifico: 'Nepenthes ventrata', popular: 'Jarro-tropical',
    descricao: 'Armadilha de afogamento. As folhas terminam em jarros cheios de líquido digestivo; insetos escorregam pela borda cerosa e não conseguem sair. Gosta de umidade alta.',
    tags: ['Meia-sombra', 'Suspensa'],
    imagem: WIKI + 'Nepenthes_x_ventrata.jpg'
  },
  {
    numero: 3, ativo: true, preco: 62.00,
    cientifico: 'Drosera capensis', popular: 'Orvalhinha-do-cabo',
    descricao: 'Armadilha de cola. Tentáculos cobertos de gotas viscosas prendem e digerem pequenos insetos; a folha se enrola lentamente sobre a presa. Floresce com facilidade.',
    tags: ['Sol pleno', 'Fácil cultivo'],
    imagem: WIKI + 'Drosera_Capensis.jpg'
  },
  {
    numero: 4, ativo: true, preco: 168.00,
    cientifico: 'Sarracenia leucophylla', popular: 'Trombeta-branca',
    descricao: 'Armadilha de afogamento vertical. Tubos altos e nervurados atraem insetos com néctar e luz; paredes internas escorregadias impedem a fuga. Coloração intensa no verão.',
    tags: ['Sol pleno', 'Solo encharcado'],
    imagem: WIKI + 'Sarracenia_leucophylla.jpg'
  },
  {
    numero: 5, ativo: true, preco: 210.00,
    cientifico: 'Darlingtonia californica', popular: 'Lírio-cobra',
    descricao: 'Armadilha de labirinto. A câmara em forma de capuz confunde insetos com falsas saídas translúcidas até que se esgotem. Raiz sensível a solo quente.',
    tags: ['Raízes frescas', 'Espécie rara'],
    imagem: WIKI + 'Darlingtonia_californica.jpg'
  }
];

/* ============================================================
   CATÁLOGO + PEDIDOS/WHATSAPP + LIGHTBOX (100% no navegador)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_NUMBER = String(CONFIG.whatsapp).replace(/\D/g, '');

  const specimenList = document.getElementById('specimenList');
  const cartFab = document.getElementById('cartFab');
  const cartCount = document.getElementById('cartCount');
  const orderPanel = document.getElementById('orderPanel');
  const orderOverlay = document.getElementById('orderOverlay');
  const closeOrder = document.getElementById('closeOrder');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const orderForm = document.getElementById('orderForm');
  const footerWhatsApp = document.getElementById('footerWhatsApp');

  const lightbox = document.getElementById('imageLightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  const CART_KEY = 'botanicum_pedido_v1';
  const cart = [];

  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* storage indisponível */ }
  }

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      if (!Array.isArray(saved)) return;
      saved.forEach((item) => {
        // Revalida contra o catálogo: preço atual e planta ainda ativa
        const planta = CATALOGO.find(p => p.ativo && p.cientifico === item.name);
        const qty = Math.min(99, Math.max(1, parseInt(item.qty, 10) || 0));
        if (planta && qty) cart.push({ name: planta.cientifico, price: planta.preco, qty });
      });
    } catch (e) { /* dados corrompidos: começa vazio */ }
  }

  const money = (value) => value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  function escapeHTML(str) {
    return String(str ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  /* ---------- Carrinho ---------- */
  function totalItems() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function totalPrice() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function renderCart() {
    if (!cartFab || !cartCount || !cartItems || !cartTotal) return;
    const count = totalItems();
    cartCount.textContent = count;
    cartFab.setAttribute('aria-label', `Abrir pedido com ${count} item(ns)`);

    if (!cart.length) {
      cartItems.innerHTML = `
        <div class="empty-cart">
          <p>Seu pedido está vazio.</p>
          <small>Escolha uma planta no catálogo para começar.</small>
        </div>`;
    } else {
      cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-row">
          <div class="cart-row-name">${escapeHTML(item.name)}</div>
          <div class="cart-row-price">${money(item.price * item.qty)}</div>
          <div class="cart-row-controls">
            <div class="qty-controls">
              <button type="button" data-action="decrease" data-index="${index}" aria-label="Diminuir quantidade">−</button>
              <span>${item.qty}</span>
              <button type="button" data-action="increase" data-index="${index}" aria-label="Aumentar quantidade">+</button>
            </div>
            <button class="remove-item" type="button" data-action="remove" data-index="${index}">Remover</button>
          </div>
        </div>
      `).join('');
    }

    cartTotal.textContent = money(totalPrice());
    saveCart();
  }

  function openOrder() {
    if (!orderPanel || !orderOverlay) return;
    orderPanel.classList.add('is-open');
    orderOverlay.classList.add('is-open');
    orderPanel.setAttribute('aria-hidden', 'false');
    orderOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeOrderPanel() {
    if (!orderPanel || !orderOverlay) return;
    orderPanel.classList.remove('is-open');
    orderOverlay.classList.remove('is-open');
    orderPanel.setAttribute('aria-hidden', 'true');
    orderOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (cartFab) cartFab.addEventListener('click', openOrder);
  if (closeOrder) closeOrder.addEventListener('click', closeOrderPanel);
  if (orderOverlay) orderOverlay.addEventListener('click', closeOrderPanel);

  if (cartItems) {
    cartItems.addEventListener('click', (event) => {
      const button = event.target.closest('[data-action]');
      if (!button) return;

      const index = Number(button.dataset.index);
      const action = button.dataset.action;
      if (!cart[index]) return;

      if (action === 'increase') cart[index].qty = Math.min(99, cart[index].qty + 1);
      if (action === 'decrease') {
        cart[index].qty -= 1;
        if (cart[index].qty <= 0) cart.splice(index, 1);
      }
      if (action === 'remove') cart.splice(index, 1);

      renderCart();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeOrderPanel();
  });

  if (orderForm) {
    orderForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!cart.length) {
        alert('Adicione pelo menos uma planta ao pedido.');
        return;
      }

      const name = document.getElementById('customerName').value.trim();
      const note = document.getElementById('customerNote').value.trim();

      if (!name) {
        document.getElementById('customerName').focus();
        return;
      }

      const lines = cart.map(item =>
        `• ${item.name} — ${item.qty}x — ${money(item.price * item.qty)}`
      );

      let message = `Olá! Meu nome é ${name} e gostaria de fazer este pedido:\n\n`;
      message += lines.join('\n');
      message += `\n\n*Total estimado: ${money(totalPrice())}*`;

      if (note) {
        message += `\n\nObservação: ${note.replace(/\s*\n\s*/g, ' ')}`;
      }

      message += `\n\nGostaria de confirmar disponibilidade, prazo de envio e forma de pagamento.`;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  /* ---------- Lightbox (foto ampliada) ---------- */
  let lastFocused = null;

  function openLightbox(img) {
    if (!lightbox || !lightboxImage || !lightboxClose) return;
    lastFocused = img;
    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt || '';
    if (lightboxCaption) lightboxCaption.textContent = img.alt || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImage.src = '';
    if (lastFocused) lastFocused.focus();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox || event.target === lightboxImage) closeLightbox();
    });
  }
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox && lightbox.classList.contains('is-open')) closeLightbox();
  });

  /* ---------- Catálogo: renderizado a partir da lista CATALOGO ---------- */
  function cardHTML(produto) {
    const numero = produto.numero
      ? `Espécime N.º ${String(produto.numero).padStart(2, '0')}`
      : '';
    const nomePopular = produto.popular
      ? `<span class="common">— ${escapeHTML(produto.popular)}</span>` : '';
    const tags = (produto.tags || [])
      .filter(Boolean)
      .map(t => `<span class="tag">${escapeHTML(t)}</span>`)
      .join('');
    const imagem = produto.imagem
      ? `<img src="${escapeHTML(produto.imagem)}" alt="${escapeHTML(produto.cientifico)}${produto.popular ? ' — ' + escapeHTML(produto.popular) : ''}" loading="lazy" referrerpolicy="no-referrer" tabindex="0" role="button" aria-label="Ampliar foto de ${escapeHTML(produto.cientifico)}">`
      : `<div class="sem-foto" aria-hidden="true">Foto indisponível</div>`;

    return `
      <article class="specimen">
        <div class="specimen-figure photo-figure">
          ${imagem}
          <span class="photo-label">Foto da espécie</span>
        </div>
        <div class="specimen-info">
          ${numero ? `<span class="specimen-no">${numero}</span>` : ''}
          <h3><em>${escapeHTML(produto.cientifico)}</em> ${nomePopular}</h3>
          <p>${escapeHTML(produto.descricao || '')}</p>
          <div class="specimen-meta">
            ${tags}
            <span class="price">${money(produto.preco)}</span>
            <button class="order-btn" type="button" data-name="${escapeHTML(produto.cientifico)}" data-price="${produto.preco}">Adicionar ao pedido</button>
          </div>
        </div>
      </article>`;
  }

  function carregarCatalogo() {
    if (!specimenList) return;

    if (footerWhatsApp && WHATSAPP_NUMBER) {
      footerWhatsApp.href = `https://wa.me/${WHATSAPP_NUMBER}`;
      footerWhatsApp.target = '_blank';
      footerWhatsApp.rel = 'noopener noreferrer';
    }

    const produtos = CATALOGO.filter(p => p.ativo !== false);

    if (!produtos.length) {
      specimenList.innerHTML = '<p class="catalog-status">Nenhuma planta disponível no momento. Volte em breve.</p>';
      return;
    }

    specimenList.innerHTML = produtos.map(cardHTML).join('');

    // Foto que não carregar vira um ícone, sem quebrar o layout
    specimenList.querySelectorAll('.photo-figure img').forEach((img) => {
      img.addEventListener('error', () => {
        const fallback = document.createElement('div');
        fallback.className = 'sem-foto';
        fallback.setAttribute('aria-hidden', 'true');
        fallback.textContent = 'Foto indisponível';
        img.replaceWith(fallback);
      }, { once: true });
    });
  }

  // Delegação de eventos: funciona mesmo com o catálogo montado dinamicamente.
  if (specimenList) {
    specimenList.addEventListener('click', (event) => {
      const orderButton = event.target.closest('.order-btn');
      if (orderButton) {
        const name = orderButton.dataset.name;
        const price = Number(orderButton.dataset.price);
        const existing = cart.find(item => item.name === name);

        if (existing) {
          existing.qty = Math.min(99, existing.qty + 1);
        } else {
          cart.push({ name, price, qty: 1 });
        }

        renderCart();
        openOrder();

        const textoOriginal = orderButton.textContent;
        orderButton.textContent = 'Adicionado ✓';
        window.setTimeout(() => {
          orderButton.textContent = textoOriginal;
        }, 1200);
        return;
      }

      const img = event.target.closest('.photo-figure img');
      if (img) openLightbox(img);
    });

    specimenList.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const img = event.target.closest('.photo-figure img');
      if (img) {
        event.preventDefault();
        openLightbox(img);
      }
    });
  }

  loadCart();
  renderCart();
  carregarCatalogo();
});


/* ============================================================
   NAVEGAÇÃO PRINCIPAL EM ABAS
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const tabList = document.querySelector('[role="tablist"]');
  const tabs = Array.from(document.querySelectorAll('[role="tab"][data-tab]'));
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
  if (!tabList || !tabs.length || !panels.length) return;

  const validTabs = new Set(tabs.map(tab => tab.dataset.tab));

  function activateTab(name, updateHash = true) {
    if (!validTabs.has(name)) name = 'inicio';

    tabs.forEach(tab => {
      const active = tab.dataset.tab === name;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    panels.forEach(panel => {
      const panelName = panel.id.replace(/^tab-/, '');
      panel.hidden = panelName !== name;
    });

    if (updateHash) {
      const url = new URL(window.location.href);
      url.hash = name === 'inicio' ? '' : name;
      history.replaceState(null, '', url);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab));
    tab.addEventListener('keydown', event => {
      let nextIndex = null;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex !== null) {
        event.preventDefault();
        tabs[nextIndex].focus();
        activateTab(tabs[nextIndex].dataset.tab);
      }
    });
  });

  document.querySelectorAll('[data-tab].tab-link, [data-tab].footer-tab-link, .logo-home').forEach(control => {
    control.addEventListener('click', () => activateTab(control.dataset.tab || 'inicio'));
  });

  const initialHash = window.location.hash.replace('#', '');
  activateTab(validTabs.has(initialHash) ? initialHash : 'inicio', false);

  window.addEventListener('hashchange', () => {
    const name = window.location.hash.replace('#', '');
    activateTab(validTabs.has(name) ? name : 'inicio', false);
  });
});
