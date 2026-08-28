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
 *  category    - categoria libera, usata come etichetta
 *  description - testo descrittivo, può contenere più paragrafi (array di stringhe)
 *  cover       - immagine di copertina (usata in home e nella lista Works)
 *  gallery     - array di immagini della galleria fotografica
 *  video       - { src, poster } opzionale — se assente, la sezione video non appare
 */

const WORKS = [
  {
    id: "opera-1",
    title: "Sospensione",
    year: 2024,
    medium: "Carboncino e pastello su carta",
    dimensions: "140 × 100 cm",
    category: "Disegno",
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
    id: "opera-3",
    title: "Meridiana",
    year: 2023,
    medium: "Tecnica mista su carta",
    dimensions: "70 × 50 cm",
    category: "Disegno",
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
    category: "Fotografia",
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
    category: "Video",
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
    category: "Disegno",
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
