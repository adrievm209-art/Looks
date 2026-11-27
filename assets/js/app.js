/* NOIR · Interacciones */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const PLACEHOLDER = 'assets/img/placeholder.svg';
  const page = document.body.dataset.page || 'home';
  const params = new URLSearchParams(location.search);

  let context = { list: [], index: 0 };
  let observer = null;

  const esc = (value) =>
    String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function shuffle(array) {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /* ---------- Sonido de la presentación ---------- */
  const SplashSound = (() => {
    let ctx = null;
    let master = null;
    let voices = [];
    let started = false;
    let enabled = true;
    let blocked = false;
    let stopTimer = null;

    function note(freq, at, duration, volume) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(volume, at + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
      osc.connect(gain).connect(master);
      osc.start(at);
      osc.stop(at + duration + 0.05);
      voices.push(osc);
    }

    function build() {
      master = ctx.createGain();
      master.gain.value = enabled ? 0.55 : 0;
      master.connect(ctx.destination);

      // Colchón grave y cálido, como un acorde que se abre.
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(1500, ctx.currentTime + 1.8);
      const padGain = ctx.createGain();
      padGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      padGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.7);
      padGain.gain.setValueAtTime(0.12, ctx.currentTime + 2.2);
      padGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 2.9);
      filter.connect(padGain).connect(master);
      [110, 164.81, 220].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = i === 2 ? 'triangle' : 'sine';
        osc.frequency.value = freq;
        osc.connect(filter);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 3);
        voices.push(osc);
      });

      // Campanadas suaves que acompañan la entrada de las letras.
      [0.45, 0.85, 1.25, 1.65].forEach((offset, i) => {
        note([523.25, 659.25, 783.99, 1046.5][i], ctx.currentTime + offset, 0.55, 0.07);
      });
    }

    function play() {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return Promise.resolve(false);
      clearTimeout(stopTimer);
      if (!ctx) {
        try {
          ctx = new Ctx();
        } catch {
          return Promise.resolve(false);
        }
      }
      if (!started) {
        build();
        started = true;
      }
      return ctx
        .resume()
        .then(() => {
          blocked = ctx.state !== 'running';
          const hint = $('#splash-sound-hint');
          if (hint) hint.classList.toggle('hidden', !blocked);
          return !blocked;
        })
        .catch(() => {
          blocked = true;
          const hint = $('#splash-sound-hint');
          if (hint) hint.classList.remove('hidden');
          return false;
        });
    }

    function stop() {
      if (!ctx || !started) return;
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 0.35);
      started = false;
      stopTimer = setTimeout(() => {
        voices.forEach((osc) => {
          try {
            osc.stop();
          } catch {}
        });
        voices = [];
        ctx.suspend().catch(() => {});
      }, 420);
    }

    function toggle() {
      enabled = !enabled;
      if (ctx && master) {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setTargetAtTime(enabled ? 0.55 : 0, ctx.currentTime, 0.05);
      }
      if (enabled) play();
      return enabled;
    }

    return { play, stop, toggle };
  })();

  const QUIZ = [
    {
      q: '¿Qué quieres transmitir con tu ropa?',
      options: [
        { label: 'Seguridad discreta, sin logos', scores: { oldmoney: 3, cleanfit: 2, formal: 1 } },
        { label: 'Personalidad y energía de calle', scores: { streetwear: 3, alternativo: 2, gotico: 1 } },
        { label: 'Dulzura y detalles cuidados', scores: { coquette: 3, kawaii: 2, preppy: 1 } },
        { label: 'Libertad y naturalidad', scores: { hippie: 3, vintage: 2, casual: 1 } },
      ],
    },
    {
      q: '¿Qué paleta te atrae más?',
      options: [
        { label: 'Neutros, negros y plata', scores: { gotico: 3, formal: 2, cleanfit: 2 } },
        { label: 'Tierra, mostaza y coñac', scores: { vintage: 3, hippie: 2, oldmoney: 1 } },
        { label: 'Pasteles y tonos suaves', scores: { kawaii: 3, coquette: 2, preppy: 2 } },
        { label: 'Rojo, negro y contraste alto', scores: { alternativo: 3, streetwear: 2, gotico: 1 } },
      ],
    },
    {
      q: '¿Dónde usarías el look más a menudo?',
      options: [
        { label: 'Oficina, entrevista o evento', scores: { formal: 3, oldmoney: 2, preppy: 2 } },
        { label: 'Calle, clase o plan diario', scores: { casual: 3, streetwear: 2, cleanfit: 2 } },
        { label: 'Salida creativa o concierto', scores: { alternativo: 3, gotico: 2, kawaii: 1 } },
        { label: 'Festival, viaje o mercado', scores: { hippie: 3, vintage: 2, coquette: 1 } },
      ],
    },
  ];

  function activeGender() {
    if (page === 'women') return 'women';
    if (page === 'men') return 'men';
    if (page === 'style') return params.get('g') === 'women' ? 'women' : 'men';
    return null;
  }

  function allowedStyles() {
    const gender = activeGender();
    return NOIR.styles.filter((s) => !gender || s.audience === 'both' || s.audience === gender);
  }

  function allImages() {
    const manifest = window.NOIR_IMAGES || {};
    const images = Object.values(manifest).flat();
    return images.length ? images : Object.keys(manifest).flatMap((key) => NOIR.imagesFor(...key.split('-')));
  }

  function randomImage() {
    const images = allImages();
    return images.length ? images[Math.floor(Math.random() * images.length)] : PLACEHOLDER;
  }

  let toastTimer = null;
  function toast(message) {
    const box = $('#noir-toast');
    if (!box) return;
    box.textContent = message;
    box.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => box.classList.remove('is-visible'), 2400);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    const input = document.createElement('textarea');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    if (typeof document.execCommand === 'function') document.execCommand('copy');
    input.remove();
    return Promise.resolve();
  }

  const FAV_KEY = 'noir_favorites';
  const GENDER_KEY = 'noir_gender';
  let favCache = null;
  function favorites() {
    if (favCache === null) {
      try {
        const parsed = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
        favCache = Array.isArray(parsed) ? parsed : [];
      } catch {
        favCache = [];
      }
    }
    return favCache.slice();
  }
  function saveFavorites(list) {
    favCache = list.slice();
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(list));
    } catch {
      /* almacenamiento no disponible: los favoritos duran solo en esta sesión */
    }
    updateFavCount();
  }
  function rememberGender(gender) {
    try {
      sessionStorage.setItem(GENDER_KEY, gender);
    } catch {}
  }
  function clearGender() {
    try {
      sessionStorage.removeItem(GENDER_KEY);
    } catch {}
  }
  function genderChosen() {
    try {
      return !!sessionStorage.getItem(GENDER_KEY);
    } catch {
      return false;
    }
  }
  function updateFavCount() {
    const badge = $('#fav-count');
    if (badge) badge.textContent = favorites().length;
  }
  function toggleFavorite(id) {
    const list = favorites();
    const i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1);
    else list.push(id);
    saveFavorites(list);
    return i < 0;
  }
  function outfitById(id) {
    const [gender, style, index] = id.split('-');
    return NOIR.get(gender, style, index);
  }

  /* ---------- Tarjetas ---------- */
  function paintFavButton(btn, saved) {
    btn.classList.toggle('is-saved', saved);
    btn.setAttribute('aria-pressed', String(saved));
    btn.setAttribute('aria-label', saved ? 'Quitar de favoritos' : 'Guardar en favoritos');
    btn.textContent = saved ? '♥' : '♡';
  }

  function handleFavClick(event) {
    const btn = event.target.closest('[data-fav]');
    if (!btn) return;
    event.preventDefault();
    event.stopPropagation();
    const added = toggleFavorite(btn.dataset.fav);
    paintFavButton(btn, added);
    toast(added ? 'Look guardado en favoritos' : 'Look eliminado de favoritos');
  }

  function cardHTML(outfit) {
    const swatches = outfit.colors.map((c) => `<i style="background:${esc(c.hex)}" title="${esc(c.name)}"></i>`).join('');
    const saved = favorites().includes(outfit.id);
    return `
      <article class="outfit-card" role="button" tabindex="0"
        data-gender="${esc(outfit.gender)}" data-style="${esc(outfit.styleId)}" data-index="${outfit.index}"
        aria-label="Ver detalle de ${esc(outfit.name)}">
        <div class="card-image">
          <img src="${esc(outfit.image)}" alt="Outfit ${esc(outfit.styleName)} ${esc(outfit.genderLabel)}" loading="lazy">
          <span class="card-style">${esc(outfit.styleName)}</span>
          <span class="card-num">${String(outfit.index).padStart(2, '0')}</span>
          <button class="card-fav${saved ? ' is-saved' : ''}" type="button" data-fav="${esc(outfit.id)}"
            aria-pressed="${saved}" aria-label="${saved ? 'Quitar de favoritos' : 'Guardar en favoritos'}">${saved ? '♥' : '♡'}</button>
        </div>
        <div class="card-info">
          <h3>${esc(outfit.name)}</h3>
          <p>${esc(outfit.category)} · ${esc(outfit.genderLabel)}</p>
          <div class="swatches">${swatches}</div>
          <span class="card-cta" aria-hidden="true">↗</span>
        </div>
      </article>`;
  }

  function setupObserver() {
    if (observer) return;
    if (!('IntersectionObserver' in window)) {
      observer = { observe: (el) => el.classList.add('is-visible'), disconnect() {} };
      return;
    }
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '80px', threshold: 0.05 }
    );
  }

  function renderCards(container, list) {
    setupObserver();
    container.innerHTML = list.map(cardHTML).join('');
    $$('.outfit-card', container).forEach((card) => observer.observe(card));
  }

  function bindCardClicks(container, listForDetail) {
    container.addEventListener('click', (event) => {
      if (event.target.closest('[data-fav]')) return;
      const card = event.target.closest('.outfit-card');
      if (!card) return;
      const outfit = NOIR.get(card.dataset.gender, card.dataset.style, card.dataset.index);
      openDetail(outfit, (listForDetail && listForDetail()) || (context.list.length ? context.list : [outfit]));
    });
    container.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const card = event.target.closest('.outfit-card');
      if (!card || event.target !== card) return;
      event.preventDefault();
      const outfit = NOIR.get(card.dataset.gender, card.dataset.style, card.dataset.index);
      openDetail(outfit, (listForDetail && listForDetail()) || (context.list.length ? context.list : [outfit]));
    });
  }

  /* ---------- Modal de detalle ---------- */
  const detailOverlay = $('#detail-overlay');

  function openDetail(outfit, list) {
    context.list = list && list.length ? list : [outfit];
    context.index = Math.max(0, context.list.findIndex((o) => o.id === outfit.id));
    paintDetail();
    detailOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    $('.detail-body', detailOverlay).scrollTop = 0;
  }

  function paintDetail() {
    const outfit = context.list[context.index];
    if (!outfit) return;
    const colors = outfit.colors
      .map(
        (c) => `<button class="color-item" type="button" data-hex="${esc(c.hex)}" data-name="${esc(c.name)}" title="Copiar ${esc(c.hex)}">
          <i style="background:${esc(c.hex)}"></i><span>${esc(c.name)}<small>${esc(c.hex)}</small></span></button>`
      )
      .join('');
    const saved = favorites().includes(outfit.id);
    const pieces = outfit.pieces.map((p) => `<span>${esc(p)}</span>`).join('');
    $('.detail-box', detailOverlay).innerHTML = `
      <button class="modal-close" type="button" aria-label="Cerrar detalle">✕</button>
      <div class="detail-image">
        <img src="${esc(outfit.image)}" alt="Detalle del outfit ${esc(outfit.name)}">
        <span class="detail-badge">NOIR · ${esc(outfit.genderLabel.toUpperCase())}</span>
        <div class="detail-nav">
          <button type="button" data-nav="-1" aria-label="Outfit anterior">←</button>
          <button type="button" data-nav="1" aria-label="Siguiente outfit">→</button>
        </div>
      </div>
      <div class="detail-body">
        <span class="eyebrow">Look ${String(outfit.index).padStart(2, '0')} · ${esc(outfit.styleName)}</span>
        <h2>${esc(outfit.name)}</h2>
        <p class="detail-tagline">${esc(outfit.style.tagline)}</p>
        <div class="detail-section">
          <span class="detail-label">Categoría</span>
          <span class="detail-category">${esc(outfit.category)} · ${esc(outfit.style.group)} · ${esc(outfit.genderLabel)}</span>
        </div>
        <div class="detail-section">
          <span class="detail-label">Paleta de colores</span>
          <div class="color-list">${colors}</div>
        </div>
        <div class="detail-section">
          <span class="detail-label">Sobre este outfit</span>
          <p>${esc(outfit.description)}</p>
        </div>
        <div class="detail-section">
          <span class="detail-label">Prendas clave</span>
          <div class="piece-list">${pieces}</div>
        </div>
        <div class="detail-section">
          <span class="detail-label">Cuándo usarlo</span>
          <p>${esc(outfit.when)}</p>
        </div>
        <div class="detail-section">
          <span class="detail-label">Cómo combinarlo</span>
          <p>${esc(outfit.combine)}</p>
        </div>
        <div class="detail-section">
          <span class="detail-label">Qué evitar</span>
          <p>${esc(outfit.avoid)}</p>
        </div>
        <div class="detail-section">
          <span class="detail-label">Consejo NOIR</span>
          <p>${esc(outfit.tip)}</p>
        </div>
        <div class="detail-actions">
          <a class="btn btn--small" href="style.html?c=${esc(outfit.styleId)}&g=${esc(outfit.gender)}">Ver estilo completo</a>
          <button class="btn btn--ghost btn--small" type="button" data-random-detail>✦ Otro al azar</button>
          <button class="btn btn--ghost btn--small" type="button" data-favorite="${esc(outfit.id)}">${saved ? '♥ Guardado' : '♡ Guardar'}</button>
        </div>
      </div>`;

    $('.modal-close', detailOverlay).addEventListener('click', closeDetail);
    $$('[data-nav]', detailOverlay).forEach((btn) =>
      btn.addEventListener('click', () => {
        context.index = (context.index + Number(btn.dataset.nav) + context.list.length) % context.list.length;
        paintDetail();
      })
    );
    $('[data-random-detail]', detailOverlay).addEventListener('click', pickRandom);
    $('[data-favorite]', detailOverlay).addEventListener('click', () => {
      const added = toggleFavorite(outfit.id);
      paintDetail();
      toast(added ? 'Look guardado en favoritos' : 'Look eliminado de favoritos');
    });
    $$('.color-item', detailOverlay).forEach((btn) =>
      btn.addEventListener('click', () => {
        copyText(btn.dataset.hex);
        toast(`${btn.dataset.name} · ${btn.dataset.hex} copiado`);
      })
    );
  }

  function closeDetail() {
    detailOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  /* ---------- Menú de búsqueda ---------- */
  const searchOverlay = $('#search-overlay');

  function buildSearch() {
    const strip = $('#search-strip');
    if (strip) strip.innerHTML = shuffle(allImages()).slice(0, 4).map((src) => `<img src="${esc(src)}" alt="">`).join('');

    const container = $('#category-groups');
    if (!container) return;
    const groups = [
      ['masculino', 'Estilos masculinos'],
      ['femenino', 'Estilos femeninos'],
      ['mixto', 'Estilos mixtos'],
    ];
    container.innerHTML = groups
      .map(([group, label]) => {
        const styles = allowedStyles().filter((s) => s.group === group);
        if (!styles.length) return '';
        const items = styles
          .map((s) => {
            const images =
              s.audience === 'both'
                ? shuffle([...NOIR.imagesFor('men', s.id), ...NOIR.imagesFor('women', s.id)])
                : NOIR.imagesFor(s.audience, s.id);
            const thumb = images.length ? images[Math.floor(Math.random() * images.length)] : PLACEHOLDER;
            return `<button class="category-item" type="button" data-style-id="${esc(s.id)}">
              <img src="${esc(thumb)}" alt="">
              <span><b>${esc(s.name)}</b><small>25 looks · ${esc(s.category)}</small></span>
            </button>`;
          })
          .join('');
        return `<div><div class="group-title">${label}</div><div class="category-grid">${items}</div></div>`;
      })
      .join('');

    $$('.category-item', container).forEach((item) =>
      item.addEventListener('click', () => goToStyle(item.dataset.styleId))
    );

    const input = $('#search-input');
    if (input) {
      input.value = '';
      input.oninput = () => {
        const term = input.value.trim().toLowerCase();
        $$('.category-item', container).forEach((item) => {
          item.classList.toggle('hidden', !item.textContent.toLowerCase().includes(term));
        });
        $$('.category-grid', container).forEach((grid) => {
          const visible = $$('.category-item:not(.hidden)', grid).length;
          grid.parentElement.classList.toggle('hidden', !visible);
        });
      };
    }
  }

  function openSearch() {
    buildSearch();
    searchOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    searchOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  const chooseOverlay = $('#choose-overlay');
  let pendingStyle = null;

  function goToStyle(styleId) {
    const style = NOIR.byId[styleId];
    if (!style) return;
    if (style.audience === 'both' && !activeGender()) {
      pendingStyle = styleId;
      $('#choose-name').textContent = style.name;
      chooseOverlay.classList.add('is-open');
      return;
    }
    const gender = style.audience === 'both' ? activeGender() : style.audience;
    if (gender) rememberGender(gender);
    location.href = `style.html?c=${encodeURIComponent(styleId)}&g=${gender}`;
  }

  function injectSharedUI() {
    // Cambiar de colección siempre vuelve a empezar por la pantalla de selección.
    $$('a[href="men.html"], a[href="women.html"]').forEach((link) => {
      link.href = 'select.html';
    });
    const nav = $('.nav');
    if (nav && !$('#fav-trigger')) {
      const btn = document.createElement('button');
      btn.className = 'btn btn--small';
      btn.id = 'fav-trigger';
      btn.type = 'button';
      btn.dataset.openFavorites = '';
      btn.innerHTML = `♡ Favoritos <span class="fav-count-badge" id="fav-count">0</span>`;
      nav.insertBefore(btn, nav.querySelector('[data-open-search]'));
    }
    if (!$('#favorites-overlay')) {
      const fav = document.createElement('div');
      fav.id = 'favorites-overlay';
      fav.innerHTML = `<div class="fav-panel" role="dialog" aria-label="Favoritos">
        <div class="fav-panel-head"><div><span class="eyebrow">Tu selección</span><h2 class="serif">Favoritos</h2></div>
        <button class="icon-close" type="button" data-close-favs aria-label="Cerrar">✕</button></div>
        <div id="fav-content"></div></div>`;
      document.body.appendChild(fav);
    }
    if (!$('#noir-toast')) {
      const t = document.createElement('div');
      t.id = 'noir-toast';
      t.className = 'toast';
      document.body.appendChild(t);
    }
    updateFavCount();
  }

  function renderFavorites() {
    const box = $('#fav-content');
    if (!box) return;
    const list = favorites().map(outfitById).filter(Boolean);
    if (!list.length) {
      box.innerHTML = `<div class="fav-empty">Aún no has guardado looks. Abre cualquier outfit y pulsa <b>♡ Guardar</b>.</div>`;
      return;
    }
    box.innerHTML = `<div class="card-grid">${list
      .map((o) => `<div class="fav-item"><button class="fav-remove" type="button" data-remove-fav="${esc(o.id)}" aria-label="Quitar">✕</button>${cardHTML(o)}</div>`)
      .join('')}</div>`;
    setupObserver();
    $$('.outfit-card', box).forEach((card) => observer.observe(card));
    $$('.fav-remove', box).forEach((btn) =>
      btn.addEventListener('click', () => {
        saveFavorites(favorites().filter((id) => id !== btn.dataset.removeFav));
        renderFavorites();
        toast('Look eliminado');
      })
    );
    bindCardClicks(box, () => list);
    $$('.outfit-card', box).forEach((card) =>
      card.addEventListener('click', (event) => {
        if (!event.target.closest('[data-fav]')) closeFavorites();
      })
    );
  }

  function openFavorites() {
    renderFavorites();
    $('#favorites-overlay').classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeFavorites() {
    $('#favorites-overlay')?.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  /* ---------- Test de estilo ---------- */
  let quizStep = 0;
  let quizScores = {};

  function openQuiz() {
    const overlay = $('#quiz-overlay');
    if (!overlay) return;
    quizStep = 0;
    quizScores = {};
    $('#quiz-flow').classList.remove('hidden');
    $('#quiz-result').classList.add('hidden');
    renderQuizQuestion();
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeQuiz() {
    $('#quiz-overlay')?.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function renderQuizQuestion() {
    const question = QUIZ[quizStep];
    $('#quiz-step').textContent = `Pregunta ${quizStep + 1} de ${QUIZ.length}`;
    $('#quiz-bar-fill').style.width = `${((quizStep + 1) / QUIZ.length) * 100}%`;
    $('#quiz-question').textContent = question.q;
    $('#quiz-options').innerHTML = question.options
      .map((opt, i) => `<button class="quiz-option" type="button" data-option="${i}">${esc(opt.label)}</button>`)
      .join('');
    $$('#quiz-options .quiz-option').forEach((btn) =>
      btn.addEventListener('click', () => {
        const opt = question.options[Number(btn.dataset.option)];
        Object.entries(opt.scores).forEach(([id, value]) => (quizScores[id] = (quizScores[id] || 0) + value));
        quizStep++;
        if (quizStep < QUIZ.length) renderQuizQuestion();
        else finishQuiz();
      })
    );
  }

  function finishQuiz() {
    const best = Object.entries(quizScores).sort((a, b) => b[1] - a[1])[0];
    const style = NOIR.byId[best ? best[0] : 'casual'];
    const gender = style.audience === 'both' ? 'men' : style.audience;
    const images = NOIR.imagesFor(gender, style.id);
    const image = images[Math.floor(Math.random() * images.length)];
    const buttons =
      style.audience === 'both'
        ? ['men', 'women'].map((g) => `<button class="btn ${g === 'men' ? '' : 'btn--ghost'}" type="button" data-quiz-go="${g}">Ver en ${g === 'men' ? 'hombre' : 'mujer'}</button>`).join('')
        : `<button class="btn" type="button" data-quiz-go="${style.audience}">Ver 25 looks</button>`;
    $('#quiz-flow').classList.add('hidden');
    const result = $('#quiz-result');
    result.classList.remove('hidden');
    result.innerHTML = `
      <span class="eyebrow">Tu estilo recomendado</span>
      <h2 class="serif">${esc(style.name)}</h2>
      <img class="result-image" src="${esc(image)}" alt="Outfit ${esc(style.name)}">
      <p><b>${esc(style.tagline)}</b> ${esc(style.description)}</p>
      <div class="result-palette">${style.palette.map((c) => `<i style="background:${esc(c.hex)}" title="${esc(c.name)}"></i>`).join('')}</div>
      <p>${esc(style.when)}</p>
      <div class="choose-actions">${buttons}</div>`;
    $$('[data-quiz-go]', result).forEach((btn) =>
      btn.addEventListener('click', () => {
        rememberGender(btn.dataset.quizGo);
        location.href = `style.html?c=${encodeURIComponent(style.id)}&g=${btn.dataset.quizGo}`;
      })
    );
  }

  function handleImageError(e) {
    if (e.target && e.target.tagName === 'IMG' && !e.target.dataset.fallback) {
      e.target.dataset.fallback = '1';
      e.target.src = PLACEHOLDER;
    }
  }

  function bindGlobalUI() {
    document.addEventListener('click', handleFavClick, true);
    document.addEventListener('error', handleImageError, true);

    // La pantalla de selección solo muestra el logo y las dos opciones.
    if (page === 'select') return;

    injectSharedUI();
    $$('[data-open-search]').forEach((el) => el.addEventListener('click', openSearch));
    $$('[data-close-search]').forEach((el) => el.addEventListener('click', closeSearch));
    $$('[data-close-detail]').forEach((el) => el.addEventListener('click', closeDetail));
    $$('[data-random]').forEach((el) => el.addEventListener('click', pickRandom));
    $$('[data-open-favorites]').forEach((el) => el.addEventListener('click', openFavorites));
    $$('[data-close-favs]').forEach((el) => el.addEventListener('click', closeFavorites));
    $('#favorites-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'favorites-overlay') closeFavorites();
    });
    searchOverlay?.addEventListener('click', (e) => {
      if (e.target === searchOverlay) closeSearch();
    });
    detailOverlay?.addEventListener('click', (e) => {
      if (e.target === detailOverlay) closeDetail();
    });
    $$('[data-choose-gender]').forEach((el) =>
      el.addEventListener('click', () => {
        if (!pendingStyle) return;
        rememberGender(el.dataset.chooseGender);
        location.href = `style.html?c=${encodeURIComponent(pendingStyle)}&g=${el.dataset.chooseGender}`;
      })
    );
    $('#choose-close')?.addEventListener('click', () => chooseOverlay.classList.remove('is-open'));
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      closeDetail();
      closeSearch();
      closeFavorites();
      chooseOverlay?.classList.remove('is-open');
    });
  }

  function pickRandom() {
    const styles = allowedStyles();
    const style = styles[Math.floor(Math.random() * styles.length)];
    const gender =
      style.audience === 'both'
        ? activeGender() || (Math.random() > 0.5 ? 'men' : 'women')
        : style.audience;
    const list = NOIR.outfitsFor(gender, style.id);
    const outfit = list[Math.floor(Math.random() * list.length)];
    rememberGender(gender);
    chooseOverlay.classList.remove('is-open');
    closeSearch();
    openDetail(outfit, shuffle(list));
  }

  /* ---------- Página de inicio ---------- */
  function initHome() {
    // Cada visita al inicio reinicia el recorrido y permite elegir otro género.
    clearGender();

    const styleMap = $('#style-map');
    if (styleMap) {
      styleMap.innerHTML = NOIR.styles
        .map(
          (s) => `<button class="style-tile" type="button" data-style-id="${esc(s.id)}">
            <small>${esc(s.group)}</small>
            <h3>${esc(s.name)}</h3>
            <p>${esc(s.tagline)}</p>
          </button>`
        )
        .join('');
      $$('[data-style-id]', styleMap).forEach((tile) =>
        tile.addEventListener('click', () => goToStyle(tile.dataset.styleId))
      );
    }

    const tipBox = $('#tip-box');
    if (tipBox) {
      const showTip = () => {
        const s = NOIR.styles[Math.floor(Math.random() * NOIR.styles.length)];
        $('#tip-text').textContent = `“${s.tip}” — ${s.name}`;
      };
      showTip();
      tipBox.addEventListener('click', showTip);
      tipBox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showTip();
        }
      });
    }

    const mosaic = $('#mosaic');
    if (mosaic) {
      const pool = [...NOIR.all('men'), ...NOIR.all('women')];
      mosaic.innerHTML = shuffle(pool)
        .slice(0, 12)
        .map(
          (o) => `<button type="button" data-gender="${esc(o.gender)}" data-style="${esc(o.styleId)}" data-index="${o.index}">
            <img src="${esc(o.image)}" alt="Outfit aleatorio ${esc(o.styleName)}" loading="lazy"><span>${esc(o.styleName)} · ${esc(o.genderLabel)}</span>
          </button>`
        )
        .join('');
      mosaic.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const outfit = NOIR.get(btn.dataset.gender, btn.dataset.style, btn.dataset.index);
        openDetail(outfit, shuffle([...NOIR.all(outfit.gender)]));
      });
    }

    const splash = $('#splash');
    if (splash) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        SplashSound.stop();
        splash.classList.add('is-hidden');
        document.documentElement.style.overflow = '';
        setTimeout(() => {
          location.href = 'select.html';
        }, 900);
      };
      document.documentElement.style.overflow = 'hidden';
      SplashSound.play();
      const resumeSound = () => {
        if (!finished) SplashSound.play();
      };
      document.addEventListener('pointerdown', resumeSound, { once: true });
      document.addEventListener('keydown', resumeSound, { once: true });
      $('#splash-sound').addEventListener('click', () => {
        const on = SplashSound.toggle();
        const btn = $('#splash-sound');
        btn.textContent = on ? '♫ Sonido' : '♪ Sin sonido';
        btn.setAttribute('aria-pressed', String(on));
      });
      $('#splash-skip').addEventListener('click', finish);
      setTimeout(finish, reduced ? 400 : 3000);
    }
  }

  /* ---------- Páginas de género / estilo ---------- */
  function initLookbook() {
    const grid = $('#card-grid');
    if (!grid) return;
    const styleId = params.get('c');
    const gender = params.get('g') === 'women' ? 'women' : 'men';
    const back = $('.back-link');
    if (back) {
      back.href = 'select.html';
      back.textContent = '← Cambiar de colección';
    }

    if (styleId && NOIR.byId[styleId]) {
      const style = NOIR.byId[styleId];
      const list = NOIR.outfitsFor(gender, styleId);
      context.list = list;
      $('#page-eyebrow').textContent = `${style.group} · ${style.category}`;
      $('#page-title').textContent = style.name;
      $('#page-description').textContent = `${style.tagline} ${style.description}`;
      $('#page-count').textContent = `${list.length} looks registrados`;
      document.title = `${style.name} · NOIR`;
      renderCards(grid, list);
      $('#style-filters')?.classList.add('hidden');
    } else {
      const list = NOIR.all(gender);
      context.list = list;
      $('#page-eyebrow').textContent = gender === 'men' ? 'Colección masculina' : 'Colección femenina';
      $('#page-title').textContent = gender === 'men' ? 'Hombre' : 'Mujer';
      $('#page-description').textContent =
        'Todos los looks registrados en NOIR. Explora por estilo, descubre su paleta y guarda el que mejor represente tu forma de vestir.';
      $('#page-count').textContent = `${list.length} looks registrados`;
      document.title = `${gender === 'men' ? 'Hombre' : 'Mujer'} · NOIR`;
      renderCards(grid, list);

      const filters = $('#style-filters');
      if (filters) {
        const styles = allowedStyles();
        filters.innerHTML =
          `<button class="chip is-active" type="button" data-filter="all">Todos</button>` +
          styles.map((s) => `<button class="chip" type="button" data-filter="${esc(s.id)}">${esc(s.name)}</button>`).join('');
        filters.addEventListener('click', (e) => {
          const chip = e.target.closest('.chip');
          if (!chip) return;
          $$('.chip', filters).forEach((c) => c.classList.toggle('is-active', c === chip));
          const filter = chip.dataset.filter;
          $$('.outfit-card', grid).forEach((card) => {
            card.classList.toggle('hidden', filter !== 'all' && card.dataset.style !== filter);
          });
          context.list = filter === 'all' ? list : list.filter((o) => o.styleId === filter);
          $('#page-count').textContent = `${context.list.length} looks registrados`;
        });
      }
    }
    bindCardClicks(grid);
  }

  /* ---------- Pantalla de selección ---------- */
  function initSelectPage() {
    // Elegir género es una decisión de entrada: para cambiar hay que reiniciar.
    if (genderChosen()) {
      location.replace('index.html');
      return;
    }
    $$('[data-preview]').forEach((card) => {
      const gender = card.dataset.preview;
      const images = shuffle(NOIR.all(gender))
        .slice(0, 4)
        .map((o) => o.image);
      $('.select-preview', card).innerHTML = images.map((src) => `<img src="${esc(src)}" alt="">`).join('');
    });
    $$('[data-gender]').forEach((card) =>
      card.addEventListener('click', (event) => {
        event.preventDefault();
        rememberGender(card.dataset.gender);
        location.href = `${card.dataset.gender}.html`;
      })
    );
  }

  /* ---------- Inicio ---------- */
  bindGlobalUI();
  if (page === 'home') initHome();
  else if (page === 'select') initSelectPage();
  else initLookbook();
})();
