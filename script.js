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
  // WhatsApp que recebe os pedidos: só números, com DDI + DDD (ex.: 5511965913157)
  whatsapp: '5511965913157',

  // E-mail do dono que também recebe cada pedido (deixe '' para enviar só por WhatsApp).
  // O envio usa o serviço gratuito FormSubmit: no primeiro pedido o dono recebe um
  // e-mail de ativação e precisa clicar em "Activate Form" uma única vez.
  emailDono: '',

  // Instagram da loja (link do perfil)
  instagram: 'https://www.instagram.com/'
};

const WIKI = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/';

// Para trocar uma foto, use uma URL ou um arquivo local, ex.: 'img/minha-planta.jpg'
// Para ocultar uma planta, coloque ativo: false. A ordem da lista é a ordem do site.
// Categorias do filtro. O 'id' é o valor usado em "categoria" de cada planta.
const CATEGORIAS = [
  { id: 'carnivoras', nome: 'Carnívoras' },
  { id: 'cactos',     nome: 'Cactos' },
  { id: 'suculentas', nome: 'Suculentas' }
];

/* Para adicionar uma planta, copie um bloco abaixo e troque os dados.
   categoria: 'carnivoras' | 'cactos' | 'suculentas'                  */
const CATALOGO = [
  {
    numero: 1, ativo: true, categoria: 'carnivoras', preco: 89.00,
    cientifico: "Dionaea muscipula 'Big Mouth'", popular: 'Dioneia',
    descricao: 'Armadilha de mordida. Fecha em menos de meio segundo quando dois pelos sensores são tocados em sequência. Folhagem robusta, lóbulos largos, boa para iniciantes.',
    tags: ['Sol pleno', 'Dormência de inverno'],
    imagem: WIKI + 'Dionaea_muscipula.jpg'
  },
  {
    numero: 2, ativo: true, categoria: 'carnivoras', preco: 145.00,
    cientifico: 'Nepenthes ventrata', popular: 'Jarro-tropical',
    descricao: 'Armadilha de afogamento. As folhas terminam em jarros cheios de líquido digestivo; insetos escorregam pela borda cerosa e não conseguem sair. Gosta de umidade alta.',
    tags: ['Meia-sombra', 'Suspensa'],
    imagem: WIKI + 'Nepenthes_x_ventrata.jpg'
  },
  {
    numero: 3, ativo: true, categoria: 'carnivoras', preco: 62.00,
    cientifico: 'Drosera capensis', popular: 'Orvalhinha-do-cabo',
    descricao: 'Armadilha de cola. Tentáculos cobertos de gotas viscosas prendem e digerem pequenos insetos; a folha se enrola lentamente sobre a presa. Floresce com facilidade.',
    tags: ['Sol pleno', 'Fácil cultivo'],
    imagem: WIKI + 'Drosera_Capensis.jpg'
  },
  {
    numero: 4, ativo: true, categoria: 'carnivoras', preco: 168.00,
    cientifico: 'Sarracenia leucophylla', popular: 'Trombeta-branca',
    descricao: 'Armadilha de afogamento vertical. Tubos altos e nervurados atraem insetos com néctar e luz; paredes internas escorregadias impedem a fuga. Coloração intensa no verão.',
    tags: ['Sol pleno', 'Solo encharcado'],
    imagem: WIKI + 'Sarracenia_leucophylla.jpg'
  },
  {
    numero: 5, ativo: true, categoria: 'carnivoras', preco: 210.00,
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
    cart.length = 0;
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
    const anterior = Number(cartFab.dataset.count || 0);
    cartCount.textContent = count;
    if (count > anterior) {
      cartFab.classList.remove('bump');
      void cartFab.offsetWidth; // reinicia a animação
      cartFab.classList.add('bump');
    }
    cartFab.dataset.count = count;
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

      // validação (campos obrigatórios, CPF, telefone e CEP)
      if (typeof customChecks !== 'undefined') customChecks.forEach((run) => run());
      if (!orderForm.reportValidity()) return;

      const val = (id) => document.getElementById(id).value.trim();
      const name = val('customerName');
      const note = val('customerNote');
      const complement = val('customerComplement');

      const lines = cart.map(item =>
        `• ${item.name} — ${item.qty}x — ${money(item.price * item.qty)}`
      );

      let message = `Olá! Gostaria de fazer este pedido:\n\n`;
      message += lines.join('\n');
      message += `\n\n*Total estimado: ${money(totalPrice())}*`;

      message += `\n\n*Dados do cliente*`;
      message += `\nNome completo: ${name}`;
      message += `\nCPF: ${val('customerCpf')}`;
      message += `\nTelefone: ${val('customerPhone')}`;
      message += `\nE-mail: ${val('customerEmail')}`;

      message += `\n\n*Endereço de entrega*`;
      message += `\nRua e número: ${val('customerStreet')}`;
      if (complement) message += `\nComplemento: ${complement}`;
      message += `\nBairro: ${val('customerDistrict')}`;
      message += `\nCidade/Estado: ${val('customerCity')} - ${val('customerState')}`;
      message += `\nCEP: ${val('customerZip')}`;

      if (note) {
        message += `\n\nObservação: ${note.replace(/\s*\n\s*/g, ' ')}`;
      }

      message += `\n\nGostaria de confirmar disponibilidade, prazo de envio e forma de pagamento.`;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener,noreferrer');

      // Cópia do pedido por e-mail para o dono (em paralelo; o WhatsApp já foi aberto)
      enviarEmailDono({
        _subject: `Novo pedido — ${name}`,
        _template: 'table',
        _captcha: 'false',
        email: val('customerEmail'),
        'Pedido': lines.join('\n'),
        'Total estimado': money(totalPrice()),
        'Nome completo': name,
        'CPF': val('customerCpf'),
        'Telefone': val('customerPhone'),
        'Rua e número': val('customerStreet'),
        'Complemento': complement || '—',
        'Bairro': val('customerDistrict'),
        'Cidade': val('customerCity'),
        'Estado': val('customerState'),
        'CEP': val('customerZip'),
        'Observação': note || '—'
      });

      // Pedido finalizado: só agora o carrinho (e o localStorage) é zerado
      cart.length = 0;
      renderCart();
      orderForm.reset();
      try { localStorage.removeItem(FORM_KEY); } catch (e) { /* ignora */ }
      closeOrderPanel();

      const submitBtn = orderForm.querySelector('.whatsapp-btn');
      if (submitBtn) {
        const original = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Pedido enviado ✓';
        window.setTimeout(() => { submitBtn.innerHTML = original; }, 2500);
      }
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
    const cat = CATEGORIAS.find(c => c.id === produto.categoria);
    const numero = [
      cat ? cat.nome : '',
      produto.numero ? `Espécime N.º ${String(produto.numero).padStart(2, '0')}` : ''
    ].filter(Boolean).join(' · ');
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

    const footerInstagram = document.getElementById('footerInstagram');
    if (footerInstagram && CONFIG.instagram) footerInstagram.href = CONFIG.instagram;

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

    // ----- Filtro por categoria -----
    const filterBar = document.getElementById('filterBar');
    let categoriaAtual = 'todos';

    function renderLista() {
      const visiveis = categoriaAtual === 'todos'
        ? produtos
        : produtos.filter(p => p.categoria === categoriaAtual);

      if (!visiveis.length) {
        const cat = CATEGORIAS.find(c => c.id === categoriaAtual);
        specimenList.innerHTML = `<p class="catalog-status">Ainda não há plantas em ${escapeHTML(cat ? cat.nome : 'esta categoria')}. Novas espécies em breve.</p>`;
        return;
      }

      specimenList.innerHTML = visiveis.map(cardHTML).join('');

      // Foto que não carregar vira um aviso, sem quebrar o layout
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

    if (filterBar) {
      const contar = (id) => id === 'todos'
        ? produtos.length
        : produtos.filter(p => p.categoria === id).length;

      filterBar.innerHTML = [{ id: 'todos', nome: 'Todos' }, ...CATEGORIAS].map(c => `
        <button type="button" class="filter-btn${c.id === categoriaAtual ? ' is-active' : ''}" data-cat="${c.id}" aria-pressed="${c.id === categoriaAtual}">
          ${escapeHTML(c.nome)} <span class="filter-count">${contar(c.id)}</span>
        </button>`).join('');

      filterBar.addEventListener('click', (event) => {
        const btn = event.target.closest('.filter-btn');
        if (!btn || btn.dataset.cat === categoriaAtual) return;
        categoriaAtual = btn.dataset.cat;
        filterBar.querySelectorAll('.filter-btn').forEach((b) => {
          const ativo = b === btn;
          b.classList.toggle('is-active', ativo);
          b.setAttribute('aria-pressed', String(ativo));
        });
        renderLista();
      });
    }

    renderLista();
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

  /* ---------- Dados do formulário salvos no navegador ---------- */
  const FORM_KEY = 'botanicum_dados_v1';
  const nameInput = document.getElementById('customerName');
  const noteInput = document.getElementById('customerNote');

  function saveForm() {
    try {
      localStorage.setItem(FORM_KEY, JSON.stringify({
        name: nameInput ? nameInput.value : '',
        note: noteInput ? noteInput.value : ''
      }));
    } catch (e) { /* storage indisponível */ }
  }

  function loadForm() {
    try {
      const saved = JSON.parse(localStorage.getItem(FORM_KEY) || '{}');
      if (nameInput && typeof saved.name === 'string') nameInput.value = saved.name;
      if (noteInput && typeof saved.note === 'string') noteInput.value = saved.note;
    } catch (e) { /* dados corrompidos: ignora */ }
  }

  if (nameInput) nameInput.addEventListener('input', saveForm);
  if (noteInput) noteInput.addEventListener('input', saveForm);

  // Mantém várias abas abertas do site sincronizadas
  window.addEventListener('storage', (event) => {
    if (event.key === CART_KEY) { loadCart(); renderCart(); }
  });

  /* ---------- Cópia do pedido por e-mail (opcional) ---------- */
  function enviarEmailDono(dados) {
    if (!CONFIG.emailDono) return Promise.resolve(false);
    return fetch(`https://formsubmit.co/ajax/${CONFIG.emailDono.trim()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(dados),
      keepalive: true
    }).then((r) => r.ok).catch(() => false);
  }

  if (CONFIG.emailDono) {
    const aviso = document.querySelector('.order-disclaimer');
    if (aviso) aviso.textContent = aviso.textContent.replace('por mensagem de WhatsApp', 'por WhatsApp e e-mail');
  }

  /* ---------- Máscaras e validação dos dados do cliente ---------- */
  const digits = (v) => v.replace(/\D/g, '');
  const cpfOk = (v) => {
    const d = digits(v);
    if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
    for (let t = 9; t < 11; t++) {
      let s = 0;
      for (let i = 0; i < t; i++) s += Number(d[i]) * (t + 1 - i);
      if (((s * 10) % 11) % 10 !== Number(d[t])) return false;
    }
    return true;
  };
  const maskCpf = (v) => digits(v).slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  const maskPhone = (v) => {
    const d = digits(v).slice(0, 11);
    if (d.length <= 2) return d ? `(${d}` : '';
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    const cut = d.length === 11 ? 7 : 6;
    return `(${d.slice(0, 2)}) ${d.slice(2, cut)}-${d.slice(cut)}`;
  };
  const maskCep = (v) => digits(v).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');

  const cpfInput = document.getElementById('customerCpf');
  const phoneInput = document.getElementById('customerPhone');
  const zipInput = document.getElementById('customerZip');

  const customChecks = [];
  function bindMask(input, mask, check) {
    if (!input) return;
    customChecks.push(() => input.setCustomValidity(input.value ? check(input.value) : ''));
    input.addEventListener('input', () => {
      input.value = mask(input.value);
      input.setCustomValidity('');
    });
    input.addEventListener('blur', () => {
      if (input.value) input.setCustomValidity(check(input.value));
    });
    input.addEventListener('invalid', () => {
      if (input.value) input.setCustomValidity(check(input.value));
    });
  }
  bindMask(cpfInput, maskCpf, (v) => (cpfOk(v) ? '' : 'Informe um CPF válido.'));
  bindMask(phoneInput, maskPhone, (v) => ([10, 11].includes(digits(v).length) ? '' : 'Informe o telefone com DDD.'));
  bindMask(zipInput, maskCep, (v) => (digits(v).length === 8 ? '' : 'Informe um CEP com 8 números.'));

  loadCart();
  loadForm();
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

    // volta ao topo sem rolagem animada: o conteúdo novo já entra com fade
    window.scrollTo({ top: 0, behavior: 'instant' });
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

/* ============================================================
   CORONA — assistente virtual (mesma base do assistente "Orion")
   Respostas por palavras-chave, sem API, servidor ou biblioteca.
   Para personalizar: edite CORONA_CONFIG (perguntas no array faq).
   Links especiais: "@whatsapp", "@email" e "@tab:colecao" / "@tab:cultivo".
   ============================================================ */
const CORONA_CONFIG = {
  name: 'Corona',
  subtitle: 'Assistente virtual · respostas automáticas',
  hello: 'Olá! Eu sou a Corona, assistente virtual da Botanicum Ancestral. Pergunte sobre plantas, cultivo, pedidos, entrega ou contato.',
  suggestions: ['Quais plantas vocês têm?', 'Como faço um pedido?', 'Como cuidar das plantas?', 'Entrega e pagamento'],
  contact: {
    whatsapp: CONFIG.whatsapp,   // vem da configuração do site
    email: CONFIG.emailDono,     // vem da configuração do site
    instagram: CONFIG.instagram  // vem da configuração do site
  },
  fallback: {
    answer: 'Não tenho uma resposta para essa pergunta. Tente perguntar sobre plantas, cultivo, pedidos, entrega ou contato — ou fale direto com o vendedor.',
    links: [
      { text: 'WhatsApp', href: '@whatsapp' },
      { text: 'E-mail', href: '@email' }
    ]
  },
  // "answer" pode ser um texto ou uma função que devolve texto (dados sempre atualizados do CATALOGO)
  faq: [
    {
      keys: ['preco', 'custo', 'custa', 'valor', 'quanto', 'cobra', 'barato', 'caro'],
      answer: () => 'Estes são os valores atuais:\n\n' + CATALOGO.filter(p => p.ativo !== false)
        .map(p => `• ${p.cientifico}: ${coronaMoney(p.preco)}`).join('\n'),
      links: [{ text: 'Ver catálogo', href: '@tab:colecao' }]
    },
    {
      keys: ['cultivo', 'cultivar', 'cuidar', 'cuidado', 'cuidados', 'manter', 'iniciante', 'dica', 'dicas', 'morrer', 'morreu'],
      answer: 'Plantas carnívoras pedem poucos critérios:\n\n• Água: chuva, destilada ou osmose reversa\n• Luz: no mínimo seis horas de sol direto (dioneias e sarracênias)\n• Substrato: turfa de esfagno e areia de sílica, sem adubo\n• Dormência: um inverno frio e curto para espécies temperadas\n\nPergunte sobre qualquer um desses pontos para saber mais.',
      links: [{ text: 'Dicas de cultivo', href: '@tab:cultivo' }]
    },
    {
      keys: ['catalogo', 'planta', 'especie', 'categoria', 'vende', 'vendem', 'tem', 'temos', 'colecao', 'cacto', 'suculenta', 'carnivora', 'disponivel', 'estoque'],
      answer: () => {
        const ativos = CATALOGO.filter(p => p.ativo !== false);
        const linhas = CATEGORIAS.map(c => {
          const n = ativos.filter(p => p.categoria === c.id).length;
          return `• ${c.nome}: ${n ? n + (n === 1 ? ' espécie' : ' espécies') : 'em breve'}`;
        });
        return 'Nosso catálogo é organizado em categorias:\n\n' + linhas.join('\n') + '\n\nUse o filtro do catálogo para ver só o grupo que você quiser.';
      },
      links: [{ text: 'Ver catálogo', href: '@tab:colecao' }]
    },
    {
      keys: ['pedido', 'pedir', 'comprar', 'compra', 'carrinho', 'encomendar', 'adquirir', 'como faco'],
      answer: 'Fazer um pedido é simples:\n\n1. Em Coleção, clique em "Adicionar ao pedido" nas plantas desejadas\n2. Abra o carrinho no botão "Pedido"\n3. Preencha seus dados e o endereço de entrega\n4. Envie: o pedido segue para o WhatsApp do vendedor, que confirma disponibilidade e prazo',
      links: [{ text: 'Ver catálogo', href: '@tab:colecao' }]
    },
    {
      keys: ['pagamento', 'pagar', 'pix', 'cartao', 'boleto', 'parcela', 'parcelar', 'dinheiro'],
      answer: 'O pagamento não é feito no site. A forma de pagamento e a confirmação são combinadas diretamente com o vendedor pelo WhatsApp, depois que você envia o pedido.',
      links: [{ text: 'WhatsApp', href: '@whatsapp' }]
    },
    {
      keys: ['entrega', 'entregam', 'envio', 'enviam', 'enviar', 'frete', 'correio', 'correios', 'prazo', 'demora', 'chega', 'brasil', 'transportadora'],
      answer: 'Enviamos para todo o Brasil. Cada planta é entregue enraizada, catalogada e acompanhada de orientações de cultivo. Prazo e frete são confirmados pelo vendedor assim que o pedido chega pelo WhatsApp.',
      links: [{ text: 'WhatsApp', href: '@whatsapp' }]
    },
    {
      keys: ['cpf', 'dados', 'endereco', 'cep', 'cadastro', 'informacoes', 'seguro', 'seguranca', 'privacidade'],
      answer: 'Ao fechar o pedido pedimos nome completo, CPF, telefone com DDD, e-mail e endereço de entrega. Esses dados são enviados ao vendedor junto com o pedido, por mensagem de WhatsApp, e usados apenas para entrega e contato. CPF, telefone, e-mail e endereço não ficam guardados no seu navegador.'
    },
    {
      keys: ['agua', 'regar', 'rega', 'regando', 'torneira', 'chuva', 'destilada', 'osmose'],
      answer: 'Use somente água da chuva, destilada ou de osmose reversa. Os minerais da água da torneira se acumulam no substrato e queimam as raízes ao longo dos meses.',
      links: [{ text: 'Dicas de cultivo', href: '@tab:cultivo' }]
    },
    {
      keys: ['luz', 'sol', 'sombra', 'luminosidade', 'iluminacao', 'claridade'],
      answer: 'São necessárias pelo menos seis horas de sol direto para dioneias e sarracênias. Jarros e drósseras toleram luz filtrada. Pouca luz enfraquece a armadilha antes da folha.',
      links: [{ text: 'Dicas de cultivo', href: '@tab:cultivo' }]
    },
    {
      keys: ['substrato', 'terra', 'solo', 'adubo', 'adubar', 'fertilizante', 'turfa', 'esfagno', 'vaso'],
      answer: 'Use turfa de esfagno com areia de sílica, sem fertilizante. O solo pobre é o motivo pelo qual a planta caça: adubar o solo é o erro mais comum de iniciante.',
      links: [{ text: 'Dicas de cultivo', href: '@tab:cultivo' }]
    },
    {
      keys: ['dormencia', 'inverno', 'frio', 'repouso', 'florescer', 'flor'],
      answer: 'Espécies de clima temperado precisam de um inverno frio e curto de luz para florescer na primavera seguinte. Pular esse repouso encurta a vida da planta.',
      links: [{ text: 'Dicas de cultivo', href: '@tab:cultivo' }]
    },
    {
      keys: ['contato', 'contatar', 'whatsapp', 'zap', 'email', 'e mail', 'telefone', 'falar', 'chamar', 'conversar', 'atendente', 'vendedor', 'humano', 'instagram', 'insta', 'rede social', 'redes sociais', 'perfil'],
      answer: 'Você pode falar com o vendedor pelo WhatsApp ou acompanhar a Botanicum Ancestral no Instagram.',
      links: [
        { text: 'WhatsApp', href: '@whatsapp' },
        { text: 'Instagram', href: '@instagram' },
        { text: 'E-mail', href: '@email' }
      ]
    },
    {
      keys: ['quem', 'sobre', 'estufa', 'historia', 'botanicum', 'ancestral', 'marca', 'loja', 'desde'],
      answer: 'A Botanicum Ancestral é uma estufa especializada em plantas de coleção, em cultivo desde 2013, com mais de 40 espécies mantidas em ambiente controlado. Nosso lema: a natureza em sua forma primordial.',
      links: [{ text: 'Ver catálogo', href: '@tab:colecao' }]
    },
    {
      keys: ['oi', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'e ai', 'hello', 'hey', 'opa', 'hi', 'corona'],
      answer: 'Olá! Como posso ajudar? Pergunte sobre plantas, cultivo, pedidos, entrega ou contato.'
    },
    {
      keys: ['obrigad', 'valeu', 'agradec', 'brigad', 'vlw'],
      answer: 'Por nada! Se precisar de mais alguma coisa, é só perguntar.'
    }
  ]
};

const coronaMoney = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

document.addEventListener('DOMContentLoaded', () => {
  const config = CORONA_CONFIG;
  const panel = document.getElementById('corona');
  const log = document.getElementById('corona-log');
  const input = document.getElementById('corona-input');
  const openButton = document.getElementById('corona-open');
  const closeButton = document.getElementById('corona-close');
  const form = document.getElementById('corona-form');
  if (!panel || !log || !input || !openButton || !closeButton || !form) return;

  const normalize = (text) => ' ' + String(text).toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim() + ' ';

  const escapeText = (text) => String(text).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  // Uma entrada por espécie do catálogo: perguntar "dioneia" ou "drosera" já responde.
  function speciesItems() {
    return CATALOGO.filter(p => p.ativo !== false).map(p => {
      const genus = String(p.cientifico).split(' ')[0];
      return {
        keys: [p.popular, genus, p.cientifico].filter(Boolean),
        answer: () => `${p.cientifico}${p.popular ? ' (' + p.popular + ')' : ''}\n\n${p.descricao}\n\n` +
          `${(p.tags || []).join(' · ')}\nValor: ${coronaMoney(p.preco)}`,
        links: [{ text: 'Ver no catálogo', href: '@tab:colecao' }]
      };
    });
  }

  // Chaves de até 3 letras valem só como palavra inteira; as maiores também como começo de palavra
  // (assim "planta" encontra "plantas" e "cuidar" encontra "cuidarei").
  function keyMatches(normalized, key) {
    const k = normalize(key).trim();
    return normalized.includes(k.length <= 3 ? ` ${k} ` : ` ${k}`);
  }

  function findAnswer(text) {
    const normalized = normalize(text);
    let best = null;
    let score = 0;
    for (const item of [...speciesItems(), ...config.faq]) {
      const current = item.keys.reduce((total, key) => total + (keyMatches(normalized, key) ? 1 : 0), 0);
      if (current > score) { score = current; best = item; }
    }
    return best || config.fallback;
  }

  function linkHTML(link) {
    const href = link.href;
    if (href.startsWith('@tab:')) {
      return `<button type="button" class="corona-link" data-go="${escapeText(href.slice(5))}">${escapeText(link.text)}</button>`;
    }
    let target = href;
    if (href === '@whatsapp') {
      const number = String(config.contact.whatsapp || '').replace(/\D/g, '');
      target = number ? `https://wa.me/${number}` : '';
    } else if (href === '@instagram') {
      target = config.contact.instagram || '';
    } else if (href === '@email') {
      target = config.contact.email ? `mailto:${config.contact.email}` : '';
    }
    if (!target) return '';
    const external = /^https?:\/\//i.test(target) ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a class="corona-link" href="${escapeText(target)}"${external}>${escapeText(link.text)}</a>`;
  }

  function answerHTML(item) {
    const text = typeof item.answer === 'function' ? item.answer() : item.answer;
    const links = (item.links || []).map(linkHTML).filter(Boolean).join('');
    return `<p>${escapeText(text).replace(/\n/g, '<br>')}</p>` + (links ? `<div class="corona-links">${links}</div>` : '');
  }

  const scrollLog = () => log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' });

  function addMessage(type, html) {
    const message = document.createElement('div');
    message.className = `corona-message ${type}`;
    message.innerHTML = html;
    log.appendChild(message);
    scrollLog();
    return message;
  }

  function ask(text) {
    log.querySelectorAll('.corona-chips').forEach((el) => el.remove());
    addMessage('user', `<p>${escapeText(text)}</p>`);
    const typing = addMessage('bot typing', '<span></span><span></span><span></span>');
    window.setTimeout(() => {
      typing.remove();
      addMessage('bot', answerHTML(findAnswer(text)));
    }, 650);
  }

  function openAssistant() {
    if (!log.children.length) {
      const chips = (config.suggestions || []).map((s) => `<button type="button" class="corona-chip">${escapeText(s)}</button>`).join('');
      addMessage('bot', `<p>${escapeText(config.hello)}</p>` + (chips ? `<div class="corona-chips">${chips}</div>` : ''));
    }
    panel.hidden = false;
    openButton.setAttribute('aria-expanded', 'true');
    input.focus({ preventScroll: true });
    scrollLog();
  }

  function closeAssistant() {
    panel.hidden = true;
    openButton.setAttribute('aria-expanded', 'false');
    openButton.focus();
  }

  openButton.addEventListener('click', openAssistant);
  closeButton.addEventListener('click', closeAssistant);

  log.addEventListener('click', (event) => {
    const chip = event.target.closest('.corona-chip');
    if (chip) { ask(chip.textContent); return; }
    const go = event.target.closest('[data-go]');
    if (go) {
      const tabButton = document.getElementById('tab-btn-' + go.dataset.go);
      if (tabButton) tabButton.click();
      // no celular o painel cobre a tela: fecha para mostrar a página
      if (window.matchMedia('(max-width: 600px)').matches) {
        panel.hidden = true;
        openButton.setAttribute('aria-expanded', 'false');
      }
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    input.value = '';
    ask(value);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) closeAssistant();
  });

  document.getElementById('corona-name').textContent = config.name;
  document.getElementById('corona-subtitle').textContent = config.subtitle;
});

/* ---------- Animação de entrada das seções ao rolar ---------- */
document.addEventListener('DOMContentLoaded', () => {
  if (!('IntersectionObserver' in window)) return; // sem suporte: tudo já fica visível

  const grupos = ['.strip-text', '.trust-strip div', '.section-head', '.care-figure', '.care-item', '.footer-brand', '.footer-links > div', '.photo-credit'];
  const alvos = document.querySelectorAll(grupos.join(','));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

  document.documentElement.classList.add('js');
  alvos.forEach((el) => {
    // atraso escalonado entre irmãos do mesmo tipo (cartões, itens de lista)
    const irmaos = [...el.parentElement.children].filter((s) => s.matches(grupos.join(',')));
    el.style.setProperty('--d', Math.min(irmaos.indexOf(el), 4));
    el.classList.add('reveal');
    observer.observe(el);
  });
});
