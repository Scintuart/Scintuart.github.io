/**
 * MAIN.JS
 * Comportamenti condivisi su tutte le pagine:
 * - header che reagisce allo scroll
 * - menu mobile a schermo intero
 * - evidenziazione voce di navigazione attiva
 * - reveal delicato degli elementi allo scroll (Intersection Observer)
 * - lightbox per le gallerie fotografiche
 * - play/pause per i video con poster
 */

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileNav();
  initActiveNav();
  initReveal();
  initGalleryLightbox();
  initVideoPlay();
  initYear();
});

/* ---------- Header on scroll ---------- */
function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Mobile nav overlay ---------- */
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const panel = document.querySelector(".nav-mobile");
  if (!toggle || !panel) return;

  const close = () => {
    toggle.classList.remove("is-open");
    panel.classList.remove("is-open");
    document.body.style.overflow = "";
    toggle.setAttribute("aria-expanded", "false");
  };
  const open = () => {
    toggle.classList.add("is-open");
    panel.classList.add("is-open");
    document.body.style.overflow = "hidden";
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.addEventListener("click", () => {
    toggle.classList.contains("is-open") ? close() : open();
  });

  panel.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/* ---------- Active nav link ---------- */
function initActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-desktop a, .nav-mobile a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("is-active");
    }
  });
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach((el) => io.observe(el));
}

/* ---------- Gallery lightbox ---------- */
function initGalleryLightbox() {
  const grid = document.querySelector(".gallery-grid");
  if (!grid) return;

  const images = Array.from(grid.querySelectorAll("img"));
  if (!images.length) return;

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Chiudi">CHIUDI ✕</button>
    <button class="lightbox-nav lightbox-prev" aria-label="Precedente">‹</button>
    <img alt="" />
    <button class="lightbox-nav lightbox-next" aria-label="Successiva">›</button>
  `;
  document.body.appendChild(lightbox);

  const imgEl = lightbox.querySelector("img");
  let current = 0;

  const show = (i) => {
    current = (i + images.length) % images.length;
    imgEl.src = images[current].src;
    imgEl.alt = images[current].alt || "";
  };

  const open = (i) => {
    show(i);
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  images.forEach((img, i) => {
    img.closest(".g-item").addEventListener("click", () => open(i));
  });

  lightbox.querySelector(".lightbox-close").addEventListener("click", close);
  lightbox.querySelector(".lightbox-prev").addEventListener("click", () => show(current - 1));
  lightbox.querySelector(".lightbox-next").addEventListener("click", () => show(current + 1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  window.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
}

/* ---------- Video play button ---------- */
function initVideoPlay() {
  document.querySelectorAll(".video-frame").forEach((frame) => {
    const video = frame.querySelector("video");
    const btn = frame.querySelector(".video-play");
    if (!video || !btn) return;

    btn.addEventListener("click", () => {
      video.play();
    });
    video.addEventListener("play", () => frame.classList.add("is-playing"));
    video.addEventListener("pause", () => frame.classList.remove("is-playing"));
    video.addEventListener("ended", () => frame.classList.remove("is-playing"));
  });
}

/* ---------- Footer / nav year (può comparire più volte nella pagina) ---------- */
function initYear() {
  document.querySelectorAll(".js-year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}
