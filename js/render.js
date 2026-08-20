/**
 * RENDER.JS
 * Popola dinamicamente le sezioni basate sui dati di works-data.js.
 * Richiede che works-data.js sia caricato PRIMA di questo file.
 */

document.addEventListener("DOMContentLoaded", () => {
  renderHomeTeaser();
  renderWorksPage();
  renderWorkDetail();
});

/* ---------- Homepage: striscia di opere selezionate ---------- */
function renderHomeTeaser() {
  const el = document.querySelector("[data-teaser-strip]");
  if (!el || typeof WORKS === "undefined") return;

  const featured = WORKS.slice(0, 3);
  el.innerHTML = featured
    .map(
      (w) => `
      <figure class="teaser-item">
        <a href="work.html?id=${w.id}" aria-label="${w.title}">
          <img src="${w.cover}" alt="${w.title}" loading="lazy" />
        </a>
        <figcaption><em>${String(w.year)}</em> — ${w.title}</figcaption>
      </figure>`
    )
    .join("");
}

/* ---------- Works page: archivio, scelta sottocategoria o galleria filtrata ---------- */
/**
 * Punto d'ingresso per works.html. Legge ?cat= e ?sub= dall'URL e decide
 * cosa mostrare:
 *  - nessun ?cat (o slug sconosciuto)      → archivio completo (comportamento storico)
 *  - ?cat=X con sottocategorie e senza sub → tile di scelta sottocategoria
 *  - ?cat=X senza sottocategorie           → galleria diretta (es. Scultura, Video)
 *  - ?cat=X&sub=Y                          → galleria filtrata per sottocategoria
 * Aggiorna anche il titolo della pagina e il piccolo breadcrumb sopra il titolo.
 */
function renderWorksPage() {
  const listEl = document.querySelector("[data-works-list]");
  if (!listEl || typeof WORKS === "undefined") return; // non siamo su works.html

  const tilesEl = document.querySelector("[data-category-tiles]");
  const breadcrumbEl = document.querySelector("[data-breadcrumb]");
  const titleEl = document.querySelector("[data-page-title]");
  const ledeEl = document.querySelector("[data-page-lede]");

  const params = new URLSearchParams(window.location.search);
  const catSlug = params.get("cat");
  const category = catSlug ? getCategoryBySlug(catSlug) : null;

  // Nessuna categoria in URL, o slug non riconosciuto → archivio completo
  if (!catSlug || !category) {
    document.title = "Lavori — Scintuart";
    if (breadcrumbEl) breadcrumbEl.textContent = "Archivio";
    if (titleEl) titleEl.textContent = "Lavori";
    if (ledeEl) ledeEl.textContent = "Una selezione di opere realizzate tra disegno, scultura e video.";
    if (tilesEl) tilesEl.innerHTML = "";
    renderWorksList(WORKS, listEl);
    return;
  }

  const subSlug = params.get("sub");
  const subcategory = subSlug ? getSubcategoryBySlug(catSlug, subSlug) : null;

  // Categoria con sottocategorie (Disegno) e nessuna sottocategoria scelta → tile
  if (category.subcategories.length && !subcategory) {
    document.title = `${category.label} — Scintuart`;
    if (breadcrumbEl) breadcrumbEl.textContent = `Lavori → ${category.label}`;
    if (titleEl) titleEl.textContent = category.label;
    if (ledeEl) ledeEl.textContent = "Scegli una sottocategoria per continuare.";
    listEl.innerHTML = "";
    renderCategoryTiles(category, tilesEl);
    return;
  }

  // Categoria senza sottocategorie (Scultura, Video) → galleria diretta
  // oppure categoria + sottocategoria valida → galleria filtrata
  const works = getWorksByCategory(catSlug, subcategory ? subSlug : null);
  const activeLabel = subcategory ? subcategory.label : category.label;

  document.title = `${activeLabel} — Scintuart`;
  if (breadcrumbEl) {
    breadcrumbEl.textContent = subcategory
      ? `Lavori → ${category.label} → ${subcategory.label}`
      : `Lavori → ${category.label}`;
  }
  if (titleEl) titleEl.textContent = activeLabel;
  if (ledeEl) {
    ledeEl.textContent = works.length
      ? `${works.length} ${works.length === 1 ? "opera" : "opere"} in questa sezione.`
      : "Nessuna opera pubblicata in questa sezione, per ora.";
  }
  if (tilesEl) tilesEl.innerHTML = "";
  renderWorksList(works, listEl);
}

/* ---------- Works page: tile di scelta sottocategoria (es. dentro Disegno) ---------- */
function renderCategoryTiles(category, container) {
  if (!container) return;
  container.innerHTML = category.subcategories
    .map((sub) => {
      const count = getWorksByCategory(category.slug, sub.slug).length;
      return `
        <a class="category-tile reveal" href="works.html?cat=${category.slug}&sub=${sub.slug}">
          <h3>${sub.label}</h3>
          <span class="eyebrow">${count} ${count === 1 ? "opera" : "opere"}</span>
        </a>`;
    })
    .join("");
  initReveal();
}

/* ---------- Works page: lista verticale grande (riusabile: archivio o galleria filtrata) ---------- */
function renderWorksList(works, container) {
  const el = container || document.querySelector("[data-works-list]");
  if (!el || typeof WORKS === "undefined") return;

  if (!works || !works.length) {
    el.innerHTML = "";
    return;
  }

  el.innerHTML = works.map((w, i) => {
    const num = String(i + 1).padStart(2, "0");
    const categoryLabel = getWorkCategoryLabel(w);
    return `
      <article class="work-row reveal">
        <div class="work-row-index">${num}</div>
        <div class="work-row-body">
          <a class="work-row-image" href="work.html?id=${w.id}" aria-label="${w.title}">
            <img src="${w.cover}" alt="${w.title}" loading="lazy" />
          </a>
          <div class="work-row-info">
            <h3><a href="work.html?id=${w.id}">${w.title}</a></h3>
            <div class="work-plaque">
              <span><b>${w.year}</b></span>
              <span>${w.medium}</span>
              <span>${w.dimensions}</span>
              ${categoryLabel ? `<span>${categoryLabel}</span>` : ""}
            </div>
            <a class="btn-line view-link" href="work.html?id=${w.id}">Vedi opera →</a>
          </div>
        </div>
      </article>`;
  }).join("");

  initReveal();
}

/* ---------- Work detail page ---------- */
function renderWorkDetail() {
  const root = document.querySelector("[data-work-detail]");
  if (!root || typeof WORKS === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const work = getWorkById(id) || WORKS[0];

  document.title = `${work.title} — ${work.year}`;

  const idx = WORKS.findIndex((w) => w.id === work.id);
  const prev = WORKS[(idx - 1 + WORKS.length) % WORKS.length];
  const next = WORKS[(idx + 1) % WORKS.length];

  const categoryLabel = getWorkCategoryLabel(work);

  root.innerHTML = `
    <section class="work-hero container page-intro">
      <div class="eyebrow reveal">${categoryLabel ? `${categoryLabel} · ${work.year}` : work.year}</div>
      <h1 class="reveal">${work.title}</h1>

      <div class="work-cover reveal">
        <img src="${work.cover}" alt="${work.title}" />
      </div>

      <dl class="work-meta-grid reveal">
        <div><dt>Titolo</dt><dd>${work.title}</dd></div>
        <div><dt>Anno</dt><dd>${work.year}</dd></div>
        <div><dt>Tecnica</dt><dd>${work.medium}</dd></div>
        <div><dt>Dimensioni</dt><dd>${work.dimensions}</dd></div>
      </dl>

      <div class="work-description reveal">
        ${work.description.map((p) => `<p>${p}</p>`).join("")}
      </div>
    </section>

    ${
      work.gallery && work.gallery.length
        ? `<section class="container">
            <div class="section-head reveal">
              <h2>Galleria</h2>
              <span class="eyebrow">${work.gallery.length} immagini</span>
            </div>
            <div class="gallery-grid reveal">
              ${work.gallery
                .map(
                  (src, i) =>
                    `<figure class="g-item"><img src="${src}" alt="${work.title} — dettaglio ${i + 1}" loading="lazy" /></figure>`
                )
                .join("")}
            </div>
          </section>`
        : ""
    }

    ${
      work.video
        ? `<section class="container work-video">
            <div class="section-head reveal">
              <h2>Video</h2>
              <span class="eyebrow">Riprese dell'opera</span>
            </div>
            <div class="video-frame reveal">
              <video controls preload="none" poster="${work.video.poster}" playsinline>
                <source src="${work.video.src}" type="video/mp4" />
              </video>
              <button class="video-play" aria-label="Riproduci video">
                <svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="27"/><path d="M22 17 L40 28 L22 39 Z"/></svg>
              </button>
            </div>
          </section>`
        : ""
    }

    <nav class="work-nav container">
      <a class="prev" href="work.html?id=${prev.id}">
        <span class="eyebrow">← Opera precedente</span>
        <h4>${prev.title}</h4>
      </a>
      <a class="next" href="work.html?id=${next.id}">
        <span class="eyebrow">Opera successiva →</span>
        <h4>${next.title}</h4>
      </a>
    </nav>
  `;

  initReveal();
  initGalleryLightbox();
  initVideoPlay();
}
