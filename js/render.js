/**
 * RENDER.JS
 * Popola dinamicamente le sezioni basate sui dati di works-data.js.
 * Richiede che js/i18n.js e js/works-data.js siano caricati PRIMA di
 * questo file (i18n.js fornisce t()/localize()/getLang()).
 */

document.addEventListener("DOMContentLoaded", () => {
  renderHomeCategoryLinks();
  renderHomeTeaser();
  renderWorksPage();
  renderWorkDetail();
});

/* ---------- Homepage: link categoria "Disegno · Legno · Video" ---------- */
/**
 * Popola dinamicamente il rigo di link categoria nell'hero della home,
 * leggendo direttamente da CATEGORIES (stessa fonte usata da works.html):
 * aggiungere/rinominare una categoria in works-data.js aggiorna
 * automaticamente anche questo testo, in entrambe le lingue, senza
 * bisogno di toccare index.html.
 */
function renderHomeCategoryLinks() {
  const el = document.querySelector("[data-category-links]");
  if (!el || typeof CATEGORIES === "undefined") return;

  el.innerHTML = CATEGORIES.map((cat) => `<a href="works.html?cat=${cat.slug}">${localize(cat.label)}</a>`).join(
    " <strong>·</strong> "
  );
}

/* ---------- Homepage: striscia di opere selezionate ---------- */
function renderHomeTeaser() {
  const el = document.querySelector("[data-teaser-strip]");
  if (!el || typeof WORKS === "undefined") return;

  const featured = WORKS.slice(0, 3);
  el.innerHTML = featured
    .map(
      (w) => `
      <figure class="teaser-item">
        <a href="work.html?id=${w.id}" aria-label="${localize(w.title)}">
          <img src="${w.cover}" alt="${localize(w.title)}" loading="lazy" />
        </a>
        <figcaption><em>${String(w.year)}</em> — ${localize(w.title)}</figcaption>
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
 *  - ?cat=X senza sottocategorie           → galleria diretta (es. Video)
 *  - ?cat=X&sub=Y                          → galleria filtrata per sottocategoria
 * Aggiorna anche il titolo della pagina e il piccolo breadcrumb sopra il titolo.
 */
/**
 * Costruisce il breadcrumb con i livelli intermedi cliccabili: ogni
 * segmento tranne l'ultimo (la pagina corrente) diventa un link verso il
 * proprio URL. Es. Lavori(link) → Disegno(link) → Disegno digitale(testo).
 * segments: array di { label, href? } — omettere href per un segmento non
 * cliccabile (usato per il segmento finale, la pagina in cui ci si trova).
 */
function renderBreadcrumb(el, segments) {
  if (!el) return;
  el.innerHTML = segments
    .map((seg, i) => {
      const isCurrent = i === segments.length - 1 || !seg.href;
      return isCurrent ? seg.label : `<a href="${seg.href}">${seg.label}</a>`;
    })
    .join(" → ");
}

function renderWorksPage() {
  const listEl = document.querySelector("[data-works-list]");
  if (!listEl || typeof WORKS === "undefined") return; // non siamo su works.html

  const tilesEl = document.querySelector("[data-category-tiles]");
  const breadcrumbEl = document.querySelector("[data-breadcrumb]");
  const titleEl = document.querySelector("[data-page-title]");
  const ledeEl = document.querySelector("[data-page-lede]");
  const bannerEl = document.querySelector("[data-subcategory-banner]");

  // La fascia visiva è disattivata di default: viene accesa esplicitamente
  // solo per la combinazione esatta cat=disegno&sub=disegno-digitale, mai
  // altrove (nessuna scheda opera, nessuna galleria filtrata diversa,
  // nessuna vista a tile, nessun archivio).
  function setBanner(active) {
    if (!bannerEl) return;
    if (active) {
      bannerEl.style.backgroundImage = "url('assets/images/disegno-digitale-banner.jpg')";
      bannerEl.classList.add("is-active");
    } else {
      bannerEl.classList.remove("is-active");
      bannerEl.style.backgroundImage = "";
    }
  }
  setBanner(false);

  const params = new URLSearchParams(window.location.search);
  let catSlug = params.get("cat");
  let subSlug = params.get("sub");

  // Alias di compatibilità: "Scultura" era una categoria di primo livello
  // (?cat=scultura) prima di diventare una sottocategoria di "Legno". Un
  // eventuale link vecchio salvato da qualcuno continua a funzionare,
  // mostrando la stessa galleria di prima.
  if (catSlug === "scultura") {
    catSlug = "legno";
    subSlug = "scultura";
  }

  const category = catSlug ? getCategoryBySlug(catSlug) : null;

  // Nessuna categoria in URL, o slug non riconosciuto → archivio completo
  if (!catSlug || !category) {
    document.title = `${t("nav.works")} — Scintuart`;
    if (breadcrumbEl) renderBreadcrumb(breadcrumbEl, [{ label: t("works.archiveBreadcrumb") }]);
    if (titleEl) titleEl.textContent = t("nav.works");
    if (ledeEl) ledeEl.textContent = t("works.archiveLede");
    if (tilesEl) tilesEl.innerHTML = "";
    renderWorksList(WORKS, listEl);
    return;
  }

  const subcategory = subSlug ? getSubcategoryBySlug(catSlug, subSlug) : null;
  const catLabel = localize(category.label);

  // Categoria con sottocategorie (Disegno, Legno) e nessuna scelta → tile
  if (category.subcategories.length && !subcategory) {
    document.title = `${catLabel} — Scintuart`;
    if (breadcrumbEl) {
      renderBreadcrumb(breadcrumbEl, [
        { label: t("nav.works"), href: "works.html" },
        { label: catLabel }
      ]);
    }
    if (titleEl) titleEl.textContent = catLabel;
    if (ledeEl) ledeEl.textContent = t("works.chooseSub");
    listEl.innerHTML = "";
    renderCategoryTiles(category, tilesEl);
    return;
  }

  // Fascia visiva di apertura sezione: solo Disegno → Disegno digitale.
  if (catSlug === "disegno" && subSlug === "disegno-digitale") {
    setBanner(true);
  }

  // Categoria senza sottocategorie (Video) → galleria diretta
  // oppure categoria + sottocategoria valida → galleria filtrata
  const works = getWorksByCategory(catSlug, subcategory ? subSlug : null);
  const subLabel = subcategory ? localize(subcategory.label) : null;
  const activeLabel = subLabel || catLabel;

  document.title = `${activeLabel} — Scintuart`;
  if (breadcrumbEl) {
    renderBreadcrumb(
      breadcrumbEl,
      subLabel
        ? [
            { label: t("nav.works"), href: "works.html" },
            { label: catLabel, href: `works.html?cat=${catSlug}` },
            { label: subLabel }
          ]
        : [
            { label: t("nav.works"), href: "works.html" },
            { label: catLabel }
          ]
    );
  }
  if (titleEl) titleEl.textContent = activeLabel;
  if (ledeEl) {
    ledeEl.textContent = works.length
      ? `${works.length} ${works.length === 1 ? t("works.countSingular") : t("works.countPlural")} ${t("works.countSuffix")}`
      : t("works.emptySection");
  }
  if (tilesEl) tilesEl.innerHTML = "";
  renderWorksList(works, listEl);
}

/* ---------- Works page: tile di scelta sottocategoria (es. dentro Disegno/Legno) ---------- */
function renderCategoryTiles(category, container) {
  if (!container) return;
  container.innerHTML = category.subcategories
    .map((sub) => {
      const count = getWorksByCategory(category.slug, sub.slug).length;
      const countLabel = count === 1 ? t("works.countSingular") : t("works.countPlural");
      return `
        <a class="category-tile reveal" href="works.html?cat=${category.slug}&sub=${sub.slug}">
          <h3>${localize(sub.label)}</h3>
          <span class="eyebrow">${count} ${countLabel}</span>
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
    const title = localize(w.title);
    return `
      <article class="work-row reveal">
        <div class="work-row-index">${num}</div>
        <div class="work-row-body">
          <a class="work-row-image" href="work.html?id=${w.id}" aria-label="${title}">
            <img src="${w.cover}" alt="${title}" loading="lazy" />
          </a>
          <div class="work-row-info">
            <h3><a href="work.html?id=${w.id}">${title}</a></h3>
            <div class="work-plaque">
              <span><b>${w.year}</b></span>
              <span>${localize(w.medium)}</span>
              <span>${localize(w.dimensions)}</span>
              ${categoryLabel ? `<span>${categoryLabel}</span>` : ""}
            </div>
            <a class="btn-line view-link" href="work.html?id=${w.id}">${t("work.viewLink")}</a>
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

  const title = localize(work.title);
  const medium = localize(work.medium);
  const dimensions = localize(work.dimensions);
  const description = localize(work.description) || [];

  document.title = `${title} — ${work.year}`;

  const idx = WORKS.findIndex((w) => w.id === work.id);
  const prev = WORKS[(idx - 1 + WORKS.length) % WORKS.length];
  const next = WORKS[(idx + 1) % WORKS.length];

  const categoryLabel = getWorkCategoryLabel(work);
  const backLink = getWorkBackLink(work);

  root.innerHTML = `
    <section class="work-hero container page-intro">
      ${backLink ? `<a class="btn-line work-back-link reveal" href="${backLink.href}">← ${backLink.label}</a>` : ""}
      <div class="eyebrow reveal">${categoryLabel ? `${categoryLabel} · ${work.year}` : work.year}</div>
      <h1 class="reveal">${title}</h1>

      <div class="work-cover reveal">
        <img src="${work.cover}" alt="${title}" />
      </div>

      <dl class="work-meta-grid reveal">
        <div><dt>${t("card.title")}</dt><dd>${title}</dd></div>
        <div><dt>${t("card.year")}</dt><dd>${work.year}</dd></div>
        <div><dt>${t("card.medium")}</dt><dd>${medium}</dd></div>
        <div><dt>${t("card.dimensions")}</dt><dd>${dimensions}</dd></div>
      </dl>

      <div class="work-description reveal">
        ${description.map((p) => `<p>${p}</p>`).join("")}
      </div>
    </section>

    ${
      work.gallery && work.gallery.length
        ? `<section class="container">
            <div class="section-head reveal">
              <h2>${t("work.gallery")}</h2>
              <span class="eyebrow">${work.gallery.length} ${work.gallery.length === 1 ? t("work.imageSingular") : t("work.imagePlural")}</span>
            </div>
            <div class="gallery-grid reveal">
              ${work.gallery
                .map(
                  (src, i) =>
                    `<figure class="g-item"><img src="${src}" alt="${title} — ${i + 1}" loading="lazy" /></figure>`
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
              <h2>${t("work.videoSection")}</h2>
              <span class="eyebrow">${t("work.videoCaption")}</span>
            </div>
            <div class="video-frame reveal">
              <video controls preload="none" poster="${work.video.poster}" playsinline>
                <source src="${work.video.src}" type="video/mp4" />
              </video>
              <button class="video-play" aria-label="${t("work.videoPlayAria")}">
                <svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="27"/><path d="M22 17 L40 28 L22 39 Z"/></svg>
              </button>
            </div>
          </section>`
        : ""
    }

    <nav class="work-nav container">
      <a class="prev" href="work.html?id=${prev.id}">
        <span class="eyebrow">← ${t("work.prevLabel")}</span>
        <h4>${localize(prev.title)}</h4>
      </a>
      <a class="next" href="work.html?id=${next.id}">
        <span class="eyebrow">${t("work.nextLabel")} →</span>
        <h4>${localize(next.title)}</h4>
      </a>
    </nav>
  `;

  initReveal();
  initGalleryLightbox();
  initVideoPlay();
}
