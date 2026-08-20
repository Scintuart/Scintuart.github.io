/**
 * CATEGORIES
 * ----------
 * Tassonomia delle categorie/sottocategorie del portfolio, separata dalle
 * opere. Per aggiungere in futuro una nuova categoria top-level o una nuova
 * sottocategoria, basta aggiungere una voce qui sotto: works.html la userà
 * automaticamente (nessuna nuova pagina HTML da creare).
 *
 * Ogni categoria ha:
 *  slug            - identificativo stabile usato in works.html?cat=...
 *  label           - etichetta visibile
 *  subcategories   - array di { slug, label }. Lascia [] se la categoria
 *                    non ha sottocategorie (es. Scultura, Video): in quel
 *                    caso works.html?cat=<slug> mostra subito la galleria,
 *                    senza passare per una scelta di sottocategoria.
 */
const CATEGORIES = [
  {
    slug: "disegno",
    label: "Disegno",
    subcategories: [
      { slug: "elaborazione-digitale", label: "Elaborazione digitale" },
      { slug: "disegno-digitale", label: "Disegno digitale" },
      { slug: "editoria", label: "Editoria" }
    ]
  },
  {
    slug: "scultura",
    label: "Scultura",
    subcategories: []
  },
  {
    slug: "video",
    label: "Video",
    subcategories: []
  }
];

function getCategoryBySlug(slug) {
  return CATEGORIES.find((c) => c.slug === slug) || null;
}

function getSubcategoryBySlug(catSlug, subSlug) {
  const cat = getCategoryBySlug(catSlug);
  if (!cat || !subSlug) return null;
  return cat.subcategories.find((s) => s.slug === subSlug) || null;
}

/**
 * Restituisce le opere di una categoria (ed eventualmente di una
 * sottocategoria specifica). Le opere senza categoria (category: null)
 * non vengono mai incluse in questi risultati filtrati.
 */
function getWorksByCategory(catSlug, subSlug) {
  return WORKS.filter((w) => {
    if (w.category !== catSlug) return false;
    if (subSlug) return w.subcategory === subSlug;
    return true;
  });
}

/**
 * Etichetta leggibile della categoria/sottocategoria di un'opera, pronta
 * per essere mostrata in targhetta o nell'eyebrow della pagina opera.
 * Ritorna null se l'opera non ha ancora una categoria assegnata.
 */
function getWorkCategoryLabel(work) {
  if (!work.category) return null;
  const cat = getCategoryBySlug(work.category);
  if (!cat) return null;
  if (work.subcategory) {
    const sub = getSubcategoryBySlug(work.category, work.subcategory);
    if (sub) return sub.label;
  }
  return cat.label;
}

/**
 * WORKS DATA
 * ----------
 * Ogni oggetto rappresenta un'opera. Per aggiungere una nuova opera,
 * aggiungi un nuovo oggetto a questo array: comparirà automaticamente
 * nella pagina Works e sarà raggiungibile su work.html?id=IL-TUO-ID
 *
 * Campi:
 *  id          - identificativo unico usato nell'URL (senza spazi)
 *  title       - titolo dell'opera
 *  year        - anno di realizzazione
 *  medium      - tecnica (es. "Olio su tela")
 *  dimensions  - dimensioni (es. "120 × 90 cm")
 *  category    - slug della categoria top-level, deve corrispondere a uno
 *                slug presente in CATEGORIES (es. "disegno"). Usa null se
 *                l'opera non ha ancora una categoria assegnata.
 *  subcategory - slug della sottocategoria (solo per categorie che ne
 *                hanno, es. "elaborazione-digitale" dentro "disegno").
 *                Lascia null/omesso per categorie senza sottocategorie.
 *  description - testo descrittivo, può contenere più paragrafi (array di stringhe)
 *  cover       - immagine di copertina (usata in home e nella lista Works)
 *  gallery     - array di immagini della galleria fotografica
 *  video       - { src, poster } opzionale — se assente, la sezione video non appare
 */

const WORKS = [
  // ℹ️ Nota: opera-1, opera-3 e opera-6 sono ancora opere segnaposto con
  // tecniche analogiche (carboncino, tecnica mista, matita) che non
  // corrispondono davvero alle sottocategorie di Disegno indicate
  // (pensate per lavori digitali/editoriali). Le ho distribuite in modo
  // arbitrario tra le tre sottocategorie solo per popolare la demo e
  // poter verificare che ogni galleria funzioni. Quando inserirai le tue
  // opere di disegno reali, riassegna subcategory con lo slug corretto.

  {
    id: "opera-1",
    title: "Sospensione",
    year: 2024,
    medium: "Carboncino e pastello su carta",
    dimensions: "140 × 100 cm",
    category: "disegno",
    subcategory: "disegno-digitale",
    description: [
      "Testo segnaposto: descrivi qui il concetto, il contesto e il processo dietro quest'opera.",
      "Puoi aggiungere un secondo paragrafo con note tecniche, ispirazioni o il contesto della mostra in cui è stata esposta."
    ],
    cover: "assets/images/opera-1-cover.svg",
    gallery: [
      "assets/images/opera-1-gallery-1.svg",
      "assets/images/opera-1-gallery-2.svg",
      "assets/images/opera-1-gallery-3.svg"
    ],
    video: {
      src: "assets/video/opera-1.mp4",
      poster: "assets/images/opera-1-video-poster.svg"
    }
  },
  {
    id: "opera-2",
    title: "Frattura Silenziosa",
    year: 2023,
    medium: "Scultura in bronzo",
    dimensions: "60 × 40 × 35 cm",
    category: "scultura",
    description: [
      "Testo segnaposto: descrivi qui il concetto, il contesto e il processo dietro quest'opera."
    ],
    cover: "assets/images/opera-2-cover.svg",
    gallery: [
      "assets/images/opera-2-gallery-1.svg",
      "assets/images/opera-2-gallery-2.svg",
      "assets/images/opera-2-gallery-3.svg"
    ],
    video: {
      src: "assets/video/opera-2.mp4",
      poster: "assets/images/opera-2-video-poster.svg"
    }
  },
  {
    id: "opera-3",
    title: "Meridiana",
    year: 2023,
    medium: "Tecnica mista su carta",
    dimensions: "70 × 50 cm",
    category: "disegno",
    subcategory: "elaborazione-digitale",
    description: [
      "Testo segnaposto: descrivi qui il concetto, il contesto e il processo dietro quest'opera."
    ],
    cover: "assets/images/opera-3-cover.svg",
    gallery: [
      "assets/images/opera-3-gallery-1.svg",
      "assets/images/opera-3-gallery-2.svg",
      "assets/images/opera-3-gallery-3.svg"
    ]
  },
  {
    id: "opera-4",
    title: "Controluce",
    year: 2022,
    medium: "Fotografia stampata su alluminio",
    dimensions: "100 × 150 cm",
    // ⚠️ TODO: opera precedentemente etichettata "Fotografia", categoria
    // rimossa dalla tassonomia su richiesta dell'artista (Scintuart non è
    // un fotografo). Lasciata volutamente SENZA categoria: non comparirà
    // in nessuna galleria filtrata (Disegno/Scultura/Video), ma resta
    // visibile nell'archivio completo works.html (senza ?cat=). Assegnale
    // una categoria reale quando deciderai dove collocarla, oppure
    // rimuovila se non deve più far parte del portfolio.
    category: null,
    subcategory: null,
    description: [
      "Testo segnaposto: descrivi qui il concetto, il contesto e il processo dietro quest'opera."
    ],
    cover: "assets/images/opera-4-cover.svg",
    gallery: [
      "assets/images/opera-4-gallery-1.svg",
      "assets/images/opera-4-gallery-2.svg",
      "assets/images/opera-4-gallery-3.svg"
    ],
    video: {
      src: "assets/video/opera-4.mp4",
      poster: "assets/images/opera-4-video-poster.svg"
    }
  },
  {
    id: "opera-5",
    title: "Deriva",
    year: 2022,
    medium: "Video, colore, senza audio",
    dimensions: "4′12″ — loop",
    category: "video",
    description: [
      "Testo segnaposto: descrivi qui il concetto, il contesto e il processo dietro quest'opera."
    ],
    cover: "assets/images/opera-5-cover.svg",
    gallery: [
      "assets/images/opera-5-gallery-1.svg",
      "assets/images/opera-5-gallery-2.svg",
      "assets/images/opera-5-gallery-3.svg"
    ],
    video: {
      src: "assets/video/opera-5.mp4",
      poster: "assets/images/opera-5-video-poster.svg"
    }
  },
  {
    id: "opera-6",
    title: "Quiete Apparente",
    year: 2021,
    medium: "Matita e grafite su carta",
    dimensions: "90 × 90 cm",
    category: "disegno",
    subcategory: "editoria",
    description: [
      "Testo segnaposto: descrivi qui il concetto, il contesto e il processo dietro quest'opera."
    ],
    cover: "assets/images/opera-6-cover.svg",
    gallery: [
      "assets/images/opera-6-gallery-1.svg",
      "assets/images/opera-6-gallery-2.svg",
      "assets/images/opera-6-gallery-3.svg"
    ],
    video: {
      src: "assets/video/opera-6.mp4",
      poster: "assets/images/opera-6-video-poster.svg"
    }
  }
];

// Utility condivise
function getWorkById(id) {
  return WORKS.find((w) => w.id === id);
}
