/**
 * RENDER.JS
 * Popola dinamicamente le sezioni basate sui dati di works-data.js.
 * Richiede che works-data.js sia caricato PRIMA di questo file.
 */

document.addEventListener("DOMContentLoaded", () => {
  renderHomeTeaser();
  renderWorksList();
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

/* ---------- Works page: lista verticale grande ---------- */
function renderWorksList() {
  const el = document.querySelector("[data-works-list]");
  if (!el || typeof WORKS === "undefined") return;

  el.innerHTML = WORKS.map((w, i) => {
    const num = String(i + 1).padStart(2, "0");
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
              <span>${w.category}</span>
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

  root.innerHTML = `
    <section class="work-hero container page-intro">
      <div class="eyebrow reveal">${work.category} · ${work.year}</div>
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
