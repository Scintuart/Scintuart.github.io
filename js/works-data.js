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
      {
        slug: "gioielli",
        label: { it: "Gioielli", en: "Jewellery" },
        // Testo introduttivo opzionale, mostrato solo in cima alla galleria
        // di questa sottocategoria (vedi render.js). Campo facoltativo:
        // le altre sottocategorie non lo hanno e restano invariate.
        intro: {
          it: "Questi gioielli sono esemplari unici realizzati nel 2025, frutto di una ricerca sulla materia, sulla forma e sul rapporto tra legno e ornamento. Il legno d'ulivo viene lavorato interamente a mano e, in alcuni casi, arricchito con tinte per legno e foglia oro. Ogni pezzo nasce unico: le venature, le forme e il gesto manuale rendono ogni esemplare diverso da tutti gli altri. Il linguaggio, le tecniche e le forme restano invece un terreno di ricerca aperto, che può dare origine a nuovi gioielli affini ma mai identici. I pezzi qui documentati sono già stati venduti: restano come testimonianza del percorso e dello stile dell'autore.",
          en: "These jewellery pieces are unique examples made in 2025, born from a study of material, form and the relationship between wood and ornament. The olive wood is entirely hand-worked and, in some pieces, enriched with wood stains and gold leaf. Each piece is unique in itself: the grain, the shapes and the manual gesture make every example different from all others. The language, techniques and forms remain instead an open field of research, one that can give rise to new pieces — related, but never identical. The works documented here have already been sold: they remain as testimony to the author's path and style."
        }
      }
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
 * Link "torna alla sezione" per la pagina di una singola opera: calcolato
 * dinamicamente dalla categoria/sottocategoria dell'opera, quindi valido
 * per qualunque sezione del sito (non solo Disegno digitale) senza dover
 * scrivere un link diverso per ciascuna. Ritorna null se l'opera non ha
 * una categoria assegnata (es. opere non ancora categorizzate).
 */
function getWorkBackLink(work) {
  if (!work.category) return null;
  const cat = getCategoryBySlug(work.category);
  if (!cat) return null;
  const label = getWorkCategoryLabel(work);
  if (!label) return null;
  const href = work.subcategory
    ? `works.html?cat=${work.category}&sub=${work.subcategory}`
    : `works.html?cat=${work.category}`;
  return { href, label };
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
  },

  // opera-14 … opera-25: 12 opere reali di disegno digitale, dati e
  // immagini forniti direttamente dall'artista.
  {
    id: "opera-14",
    title: "Toshirō",
    year: 2025,
    medium: "Disegno con tavoletta grafica, pennelli Photoshop",
    dimensions: "NC",
    category: "disegno",
    subcategory: "disegno-digitale",
    description: [
      "L'attore intento a rilassarsi sul set, sfogando i pensieri con una sigaretta."
    ],
    cover: "assets/images/DISEGNO DIGITALE/Toshiro_Mifune.png"
  },
  {
    id: "opera-15",
    title: "RAGNAR",
    year: 2023,
    medium: "Disegno con tavoletta grafica, pennelli Photoshop",
    dimensions: "NC",
    category: "disegno",
    subcategory: "disegno-digitale",
    description: [
      "Travis Fimmel durante le riprese della terza stagione di Vikings."
    ],
    cover: "assets/images/DISEGNO DIGITALE/RAGNAR.jpg"
  },
  {
    id: "opera-16",
    title: "THOMAS",
    year: 2023,
    medium: "Disegno con tavoletta grafica, pennelli Photoshop",
    dimensions: "NC",
    category: "disegno",
    subcategory: "disegno-digitale",
    description: [
      "Il personaggio principale di Peaky Blinders, rappresentato in un momento di sofferenza e riflessione sul proprio lascito."
    ],
    cover: "assets/images/DISEGNO DIGITALE/thomas.jpg"
  },
  {
    id: "opera-17",
    title: "Anthony Hopkins",
    year: 2023,
    medium: "Disegno con tavoletta grafica, pennelli Photoshop",
    dimensions: "NC",
    category: "disegno",
    subcategory: "disegno-digitale",
    description: [
      "Ritratto \"demonizzato\" di Anthony Hopkins nei panni di Hannibal Lecter. La reference era un'immagine normale e molto delicata; nello sviluppo del disegno è stato enfatizzato lo sguardo preoccupante dell'attore, trasformandolo nel suo personaggio più celebre."
    ],
    cover: "assets/images/DISEGNO DIGITALE/Anthony_Hopkins.jpg"
  },
  {
    id: "opera-18",
    title: "Russel",
    year: 2023,
    medium: "Disegno con tavoletta grafica, pennelli Photoshop",
    dimensions: "NC",
    category: "disegno",
    subcategory: "disegno-digitale",
    description: [
      "Russell Crowe nei panni di Massimo Decimo Meridio ne Il Gladiatore."
    ],
    cover: "assets/images/DISEGNO DIGITALE/russel.png"
  },
  {
    id: "opera-19",
    title: "ROY",
    year: 2023,
    medium: "Disegno con tavoletta grafica, pennelli Photoshop",
    dimensions: "NC",
    category: "disegno",
    subcategory: "disegno-digitale",
    description: [
      "Rutger Hauer nei panni di Roy Batty, il replicante androide protagonista di Blade Runner."
    ],
    cover: "assets/images/DISEGNO DIGITALE/Roy.jpg"
  },
  {
    id: "opera-20",
    title: "Rachael",
    year: 2023,
    medium: "Disegno con tavoletta grafica, pennelli Photoshop",
    dimensions: "NC",
    category: "disegno",
    subcategory: "disegno-digitale",
    description: [
      "Sean Young nei panni della replicante Rachael dal film Blade Runner."
    ],
    cover: "assets/images/DISEGNO DIGITALE/Rachael.jpg"
  },
  {
    id: "opera-21",
    title: "Stanley",
    year: 2025,
    medium: "Disegno con tavoletta grafica, pennelli Photoshop",
    dimensions: "NC",
    category: "disegno",
    subcategory: "disegno-digitale",
    description: [
      "Il regista Stanley Kubrick mentre ascolta qualcosa, immerso nei propri pensieri e proiettato verso orizzonti sconosciuti. Il colpo di genio è rappresentato simbolicamente da una stella cadente."
    ],
    cover: "assets/images/DISEGNO DIGITALE/STANLEY.png"
  },
  {
    id: "opera-22",
    title: "David Lynch",
    year: 2025,
    medium: "Disegno con tavoletta grafica, pennelli Photoshop",
    dimensions: "NC",
    category: "disegno",
    subcategory: "disegno-digitale",
    description: [
      "Il regista David Lynch ritratto con un tocco di sangue misterioso, richiamando l'atmosfera dei casi di omicidio presenti nei suoi film."
    ],
    cover: "assets/images/DISEGNO DIGITALE/David_Lynch.png"
  },
  {
    id: "opera-23",
    title: "Apocalypse Now",
    year: 2025,
    medium: "Disegno con tavoletta grafica, pennelli Photoshop",
    dimensions: "NC",
    category: "disegno",
    subcategory: "disegno-digitale",
    description: [
      "Il momento più atteso del film: la comparsa iconica del soldato che emerge dall'acqua, con lo sguardo attento e sicuro del capitano Benjamin L. Willard."
    ],
    cover: "assets/images/DISEGNO DIGITALE/apocalypse_now.jpg"
  },
  {
    id: "opera-24",
    title: "EINAR SELVIK",
    year: 2022,
    medium: "Disegno con tavoletta grafica, pennelli Photoshop",
    dimensions: "NC",
    category: "disegno",
    subcategory: "disegno-digitale",
    description: [
      "Il musicista norvegese Einar Selvik rappresentato in chiave pagana e norrena, enfatizzato fino ad assumere l'aspetto di una figura divina."
    ],
    cover: "assets/images/DISEGNO DIGITALE/Einar_Selvik.jpg"
  },
  {
    id: "opera-25",
    title: "Nick Cave",
    year: 2025,
    medium: "Disegno con tavoletta grafica, pennelli Photoshop",
    dimensions: "NC",
    category: "disegno",
    subcategory: "disegno-digitale",
    description: [
      "Il cantautore australiano Nick Cave rappresentato in un momento pensieroso, immerso nell'atmosfera della propria canzone."
    ],
    cover: "assets/images/DISEGNO DIGITALE/NIK_Cave.png"
  },

  // opera-26 … opera-41: 16 gioielli in legno d'ulivo, lavorati a mano,
  // realizzati nel 2025. Pezzi già venduti: presentati come documentazione
  // del linguaggio artistico dell'autore, non come catalogo disponibile —
  // nessun riferimento a disponibilità, acquisto o prezzo. Tecnica indicata
  // in modo generale: precisa solo dove la fotografia lo rende certo (foglia
  // oro, filo metallico, pietra), senza attribuire una tinta per legno dove
  // non distinguibile con certezza dalla variazione naturale del legno.
  {
    id: "opera-26",
    title: "Orecchini I",
    year: 2025,
    medium: "Legno d'ulivo lavorato a mano.",
    dimensions: "NC",
    category: "legno",
    subcategory: "gioielli",
    description: [
      "Esemplare unico in legno d'ulivo, realizzato nel 2025. Pezzo già venduto."
    ],
    cover: "assets/images/GIOIELLI/orecchini-01.jpg"
  },
  {
    id: "opera-27",
    title: "Orecchini II",
    year: 2025,
    medium: "Legno d'ulivo lavorato a mano.",
    dimensions: "NC",
    category: "legno",
    subcategory: "gioielli",
    description: [
      "Esemplare unico in legno d'ulivo, realizzato nel 2025. Pezzo già venduto."
    ],
    cover: "assets/images/GIOIELLI/orecchini-02.jpg"
  },
  {
    id: "opera-28",
    title: "Orecchini III",
    year: 2025,
    medium: "Legno d'ulivo lavorato a mano, con applicazione di foglia oro.",
    dimensions: "NC",
    category: "legno",
    subcategory: "gioielli",
    description: [
      "Esemplare unico in legno d'ulivo con intervento di foglia oro. Realizzato nel 2025. Pezzo già venduto."
    ],
    cover: "assets/images/GIOIELLI/orecchini-03.jpg"
  },
  {
    id: "opera-29",
    title: "Orecchini IV",
    year: 2025,
    medium: "Legno d'ulivo lavorato a mano, con dettagli in foglia oro.",
    dimensions: "NC",
    category: "legno",
    subcategory: "gioielli",
    description: [
      "Esemplare unico in legno d'ulivo con intervento di foglia oro. Realizzato nel 2025. Pezzo già venduto."
    ],
    cover: "assets/images/GIOIELLI/orecchini-04.jpg"
  },
  {
    id: "opera-30",
    title: "Orecchini V",
    year: 2025,
    medium: "Legno d'ulivo lavorato a mano, con applicazione di foglia oro.",
    dimensions: "NC",
    category: "legno",
    subcategory: "gioielli",
    description: [
      "Esemplare unico in legno d'ulivo con intervento di foglia oro. Realizzato nel 2025. Pezzo già venduto."
    ],
    cover: "assets/images/GIOIELLI/orecchini-05.jpg"
  },
  {
    id: "opera-31",
    title: "Orecchini VI",
    year: 2025,
    medium: "Legno d'ulivo lavorato a mano, con applicazione di foglia oro.",
    dimensions: "NC",
    category: "legno",
    subcategory: "gioielli",
    description: [
      "Esemplare unico in legno d'ulivo con intervento di foglia oro. Realizzato nel 2025. Pezzo già venduto."
    ],
    cover: "assets/images/GIOIELLI/orecchini-06.jpg"
  },
  {
    id: "opera-32",
    title: "Orecchini VII",
    year: 2025,
    medium: "Legno d'ulivo lavorato a mano, con avvolgimento in filo metallico.",
    dimensions: "NC",
    category: "legno",
    subcategory: "gioielli",
    description: [
      "Esemplare unico in legno d'ulivo, realizzato nel 2025. Pezzo già venduto."
    ],
    cover: "assets/images/GIOIELLI/orecchini-07.jpg"
  },
  {
    id: "opera-33",
    title: "Orecchini VIII",
    year: 2025,
    medium: "Legno d'ulivo lavorato a mano, con avvolgimento in filo metallico.",
    dimensions: "NC",
    category: "legno",
    subcategory: "gioielli",
    description: [
      "Esemplare unico in legno d'ulivo, realizzato nel 2025. Pezzo già venduto."
    ],
    cover: "assets/images/GIOIELLI/orecchini-08.jpg"
  },
  {
    id: "opera-34",
    title: "Orecchini IX",
    year: 2025,
    medium: "Legno d'ulivo lavorato a mano, con applicazione di foglia oro.",
    dimensions: "NC",
    category: "legno",
    subcategory: "gioielli",
    description: [
      "Esemplare unico in legno d'ulivo con intervento di foglia oro. Realizzato nel 2025. Pezzo già venduto."
    ],
    cover: "assets/images/GIOIELLI/orecchini-09.jpg"
  },
  {
    id: "opera-35",
    title: "Orecchini X",
    year: 2025,
    medium: "Legno d'ulivo lavorato a mano, con dettaglio in foglia oro.",
    dimensions: "NC",
    category: "legno",
    subcategory: "gioielli",
    description: [
      "Esemplare unico in legno d'ulivo con intervento di foglia oro. Realizzato nel 2025. Pezzo già venduto."
    ],
    cover: "assets/images/GIOIELLI/orecchini-10.jpg"
  },
  {
    id: "opera-36",
    title: "Collana I",
    year: 2025,
    medium: "Legno d'ulivo lavorato a mano, con tinta per legno e foglia oro.",
    dimensions: "NC",
    category: "legno",
    subcategory: "gioielli",
    description: [
      "Esemplare unico in legno d'ulivo con interventi di tinta e foglia oro. Realizzato nel 2025. Pezzo già venduto."
    ],
    cover: "assets/images/GIOIELLI/collana-01.jpg"
  },
  {
    id: "opera-37",
    title: "Collana II",
    year: 2025,
    medium: "Legno d'ulivo lavorato a mano, con dettaglio in pietra e charm in metallo.",
    dimensions: "NC",
    category: "legno",
    subcategory: "gioielli",
    description: [
      "Esemplare unico in legno d'ulivo, realizzato nel 2025. Pezzo già venduto."
    ],
    cover: "assets/images/GIOIELLI/collana-02.jpg"
  },
  {
    id: "opera-38",
    title: "Collana III",
    year: 2025,
    medium: "Legno d'ulivo lavorato a mano, con tinta per legno.",
    dimensions: "NC",
    category: "legno",
    subcategory: "gioielli",
    description: [
      "Esemplare unico in legno d'ulivo con intervento di tinta per legno. Realizzato nel 2025. Pezzo già venduto."
    ],
    cover: "assets/images/GIOIELLI/collana-03.jpg"
  },
  {
    id: "opera-39",
    title: "Collana IV",
    year: 2025,
    medium: "Legno d'ulivo lavorato a mano, con dettaglio in pietra.",
    dimensions: "NC",
    category: "legno",
    subcategory: "gioielli",
    description: [
      "Esemplare unico in legno d'ulivo, realizzato nel 2025. Pezzo già venduto."
    ],
    cover: "assets/images/GIOIELLI/collana-04.jpg"
  },
  {
    id: "opera-40",
    title: "Collana V",
    year: 2025,
    medium: "Legno d'ulivo lavorato a mano, con dettaglio in foglia oro.",
    dimensions: "NC",
    category: "legno",
    subcategory: "gioielli",
    description: [
      "Esemplare unico in legno d'ulivo con intervento di foglia oro. Realizzato nel 2025. Pezzo già venduto."
    ],
    cover: "assets/images/GIOIELLI/collana-05.jpg"
  },
  {
    id: "opera-41",
    title: "Anelli",
    year: 2025,
    medium: "Legno d'ulivo lavorato a mano, con dettagli in pirite e metallo.",
    dimensions: "NC",
    category: "legno",
    subcategory: "gioielli",
    description: [
      "Esemplari unici in legno d'ulivo, realizzati nel 2025. Pezzi già venduti."
    ],
    cover: "assets/images/GIOIELLI/anelli.jpg"
  },
  {
    id: "opera-42",
    title: "Albero",
    year: 2024,
    medium: "Quercia sarda, pero e faggio. Lavorazione a scalpelli, tinta per legno noce, spray al bronzo.",
    dimensions: "NC",
    category: "legno",
    subcategory: "scultura",
    description: [
      "Un pezzo che vuole simboleggiare l'imponenza della natura, la bellezza delle sue forme, le curve, l'abbondanza e la diversità dei suoi frutti."
    ],
    cover: "assets/images/SCULTURA/albero-01.jpg",
    gallery: [
      "assets/images/SCULTURA/albero-02.jpg",
      "assets/images/SCULTURA/albero-03.jpg"
    ]
  },
  {
    id: "opera-43",
    title: "Testa THX 1138",
    year: 2024,
    medium: "Abete. Tecniche miste artigianali, scalpelli, sgorbie e sistemi rotativi.",
    dimensions: "NC",
    category: "legno",
    subcategory: "scultura",
    description: [
      "Questo è il primo approccio a tutto tondo. Un esplorazione del mondo scultoreo ancora inconsapevole. Opera mai ultimata."
    ],
    cover: "assets/images/SCULTURA/thx-1138-01.jpg",
    gallery: [
      "assets/images/SCULTURA/thx-1138-02.jpg",
      "assets/images/SCULTURA/thx-1138-03.jpg"
    ]
  },
  {
    id: "opera-44",
    title: "Madonna",
    year: 2024,
    medium: "Quercia da sughero. Tecnica artigianale di intaglio a sgorbia e basso rilievo.",
    dimensions: "NC",
    category: "legno",
    subcategory: "scultura",
    description: [
      "Opera ispirata alla figura della madre di Gesù nella Pietà di Michelangelo Buonarroti. Realizzata in quercia da sughero attraverso una tecnica artigianale di intaglio a sgorbia e basso rilievo. Il volto e la figura emergono direttamente dalla materia lignea, valorizzando le venature naturali del legno e il carattere manuale della lavorazione."
    ],
    cover: "assets/images/SCULTURA/madonna-02.jpg",
    gallery: [
      "assets/images/SCULTURA/madonna-01.jpg"
    ]
  },
];
// Utility condivise
function getWorkById(id) {
  return WORKS.find((w) => w.id === id);
}
