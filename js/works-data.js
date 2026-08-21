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
 *  label           - { it, en } etichetta visibile nelle due lingue.
 *                    Risolta a runtime con localize(label) (js/i18n.js).
 *  subcategories   - array di { slug, label }. Lascia [] se la categoria
 *                    non ha sottocategorie (es. Video): in quel caso
 *                    works.html?cat=<slug> mostra subito la galleria,
 *                    senza passare per una scelta di sottocategoria.
 */
const CATEGORIES = [
  {
    slug: "disegno",
    label: { it: "Disegno", en: "Drawing" },
    subcategories: [
      { slug: "elaborazione-digitale", label: { it: "Elaborazione digitale", en: "Digital Processing" } },
      { slug: "disegno-digitale", label: { it: "Disegno digitale", en: "Digital Drawing" } },
      { slug: "editoria", label: { it: "Editoria", en: "Publishing" } }
    ]
  },
  {
    slug: "legno",
    label: { it: "Legno", en: "Wood" },
    subcategories: [
      { slug: "scultura", label: { it: "Scultura", en: "Sculpture" } },
      { slug: "bassorilievi", label: { it: "Bassorilievi", en: "Bas-reliefs" } },
      { slug: "gioielli", label: { it: "Gioielli", en: "Jewellery" } }
    ]
  },
  {
    slug: "video",
    label: { it: "Video", en: "Video" },
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
 * Etichetta leggibile (nella lingua corrente) della categoria/sottocategoria
 * di un'opera, pronta per essere mostrata in targhetta o nell'eyebrow della
 * pagina opera. Ritorna null se l'opera non ha ancora una categoria assegnata.
 */
function getWorkCategoryLabel(work) {
  if (!work.category) return null;
  const cat = getCategoryBySlug(work.category);
  if (!cat) return null;
  if (work.subcategory) {
    const sub = getSubcategoryBySlug(work.category, work.subcategory);
    if (sub) return localize(sub.label);
  }
  return localize(cat.label);
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
    category: "legno",
    subcategory: "scultura",
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
    id: "opera-4",
    title: "Controluce",
    year: 2022,
    medium: "Fotografia stampata su alluminio",
    dimensions: "100 × 150 cm",
    // ⚠️ TODO: opera precedentemente etichettata "Fotografia", categoria
    // rimossa dalla tassonomia su richiesta dell'artista (Scintuart non è
    // un fotografo). Lasciata volutamente SENZA categoria: non comparirà
    // in nessuna galleria filtrata (Disegno/Legno/Video), ma resta
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
  },
  {
    id: "opera-7",
    title: "Gab",
    year: 2015,
    medium: "Elaborazione con Photoshop, silhouette a doppia esposizione",
    dimensions: "NC",
    category: "disegno",
    subcategory: "elaborazione-digitale",
    description: [
      "Una figura pensierosa si staglia su uno sfondo di città bagnata. La persona riflette sulle difficoltà che quella città, ormai segnata dai problemi, le pone davanti."
    ],
    cover: "assets/images/ELABORAZIONE DIGITALE/gab.jpg"
    // Nessun campo "gallery": l'unica immagine disponibile è già usata come
    // cover. Aggiungendola anche in gallery si duplicherebbe la stessa
    // immagine in una sezione "Galleria" ridondante — il campo è opzionale
    // (come "video"), quindi omesso finché non ci sono altre foto reali.
  },
  {
    id: "opera-8",
    title: "SEB",
    year: 2015,
    medium: "Elaborazione digitale con Photoshop, esposizioni multiple",
    dimensions: "NC",
    category: "disegno",
    subcategory: "elaborazione-digitale",
    description: [
      "Figura in sospensione, nella lettura della magnificenza artistica londinese. Stupore."
    ],
    cover: "assets/images/ELABORAZIONE DIGITALE/seb.jpg"
    // Nessun campo "gallery" per lo stesso motivo di opera-7 (Gab): un'unica
    // immagine reale disponibile, già usata come cover.
  },

  // opera-9 … opera-13: 5 opere reali in legno (bassorilievi). Dati forniti
  // dall'artista: anno, dimensioni, tecnica e descrizione. Immagini reali,
  // non toccate.
  {
    id: "opera-9",
    title: "Ballo",
    year: 2019,
    medium: "Incisione fatta a mano con mezzi rotativi e scalpelli. Bassorilievo e spray nero opaco.",
    dimensions: "30 × 30 cm",
    category: "legno",
    subcategory: "bassorilievi",
    description: [
      "Coppia, maschio e femmina, intenti a ballare i passi della tradizione folkloristica sarda."
    ],
    cover: "assets/images/BASSORILIEVI/ballo.png"
  },
  {
    id: "opera-10",
    title: "Coro",
    year: 2019,
    medium: "Incisione fatta a mano con mezzi rotativi e scalpelli. Bassorilievo e spray nero opaco.",
    dimensions: "60 × 20 cm",
    category: "legno",
    subcategory: "bassorilievi",
    description: [
      "Un coro sardo disposto a cerchio, con il maestro al centro."
    ],
    cover: "assets/images/BASSORILIEVI/coro.png"
  },
  {
    id: "opera-11",
    title: "Gesù",
    year: 2019,
    medium: "Incisione fatta a mano con mezzi rotativi e scalpelli. Bassorilievo e spray nero opaco.",
    dimensions: "70 × 40 cm",
    category: "legno",
    subcategory: "bassorilievi",
    description: [
      "Un Gesù sporco e macchiato, immagine tratta dal film Gesù di Nazareth con Robert Powell."
    ],
    cover: "assets/images/BASSORILIEVI/gesù.png"
  },
  {
    id: "opera-12",
    title: "Maschera",
    year: 2019,
    medium: "Incisione fatta a mano con mezzi rotativi e scalpelli. Bassorilievo e spray nero opaco.",
    dimensions: "10 × 25 cm",
    category: "legno",
    subcategory: "bassorilievi",
    description: [
      "Su Boe, la celebre maschera zoomorfa del carnevale tradizionale di Ottana (Nuoro)."
    ],
    cover: "assets/images/BASSORILIEVI/maschera.png"
  },
  {
    id: "opera-13",
    title: "Maschere",
    year: 2019,
    medium: "Pirografia.",
    dimensions: "30 × 30 cm",
    category: "legno",
    subcategory: "bassorilievi",
    description: [
      "Mamuthones, le celebri maschere tradizionali del carnevale di Mamoiada."
    ],
    cover: "assets/images/BASSORILIEVI/maschere.png"
  }
];

// Utility condivise
function getWorkById(id) {
  return WORKS.find((w) => w.id === id);
}
