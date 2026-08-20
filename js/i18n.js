/**
 * I18N.JS
 * --------
 * Sistema bilingue IT/EN minimale, senza framework.
 * Deve essere caricato PRIMA di works-data.js, main.js e render.js,
 * perché entrambi usano le funzioni t()/localize()/getLang() definite qui.
 *
 * Come funziona:
 *  - STRINGS contiene le stringhe di interfaccia (menu, targhette, testi di
 *    servizio) in italiano e inglese, per chiave stabile.
 *  - getLang()/setLang() leggono e scrivono la lingua scelta in
 *    localStorage, così la preferenza resta la stessa passando da una
 *    pagina all'altra (il sito è multipagina, non una SPA).
 *  - t(chiave) restituisce la stringa nella lingua corrente (fallback IT
 *    se manca la chiave in inglese, e la chiave stessa come ultima risorsa
 *    per non rompere mai il rendering).
 *  - localize(campo) è il resolver "pronto per il futuro" per i CONTENUTI
 *    delle opere (titolo, descrizione, tecnica...): se il campo è ancora
 *    una stringa/array semplice (come oggi per tutte le opere) lo
 *    restituisce invariato; se in futuro diventerà { it: ..., en: ... }
 *    lo risolve automaticamente nella lingua corrente. Non serve toccare
 *    render.js quando aggiungerai le prime opere bilingue.
 *
 * Per aggiungere una nuova stringa di interfaccia: aggiungila con la
 * stessa chiave sia in STRINGS.it sia in STRINGS.en.
 */

const STRINGS = {
  it: {
    "nav.home": "Home",
    "nav.works": "Lavori",
    "nav.about": "Chi sono",
    "nav.contact": "Contatti",

    "works.archiveBreadcrumb": "Archivio",
    "works.archiveLede": "Una selezione di opere realizzate tra disegno, legno e video.",
    "works.chooseSub": "Scegli una sottocategoria per continuare.",
    "works.countSingular": "opera",
    "works.countPlural": "opere",
    "works.countSuffix": "in questa sezione.",
    "works.emptySection": "Nessuna opera pubblicata in questa sezione, per ora.",

    "work.viewLink": "Vedi opera →",
    "work.prevLabel": "Opera precedente",
    "work.nextLabel": "Opera successiva",
    "work.gallery": "Galleria",
    "work.imageSingular": "immagine",
    "work.imagePlural": "immagini",
    "work.videoSection": "Video",
    "work.videoCaption": "Riprese dell'opera",
    "work.videoPlayAria": "Riproduci video",

    "card.title": "Titolo",
    "card.year": "Anno",
    "card.medium": "Tecnica",
    "card.dimensions": "Dimensioni"
  },
  en: {
    "nav.home": "Home",
    "nav.works": "Works",
    "nav.about": "About",
    "nav.contact": "Contact",

    "works.archiveBreadcrumb": "Archive",
    "works.archiveLede": "A selection of works spanning drawing, wood and video.",
    "works.chooseSub": "Choose a subcategory to continue.",
    "works.countSingular": "work",
    "works.countPlural": "works",
    "works.countSuffix": "in this section.",
    "works.emptySection": "No works published in this section yet.",

    "work.viewLink": "View work →",
    "work.prevLabel": "Previous work",
    "work.nextLabel": "Next work",
    "work.gallery": "Gallery",
    "work.imageSingular": "image",
    "work.imagePlural": "images",
    "work.videoSection": "Video",
    "work.videoCaption": "Work footage",
    "work.videoPlayAria": "Play video",

    "card.title": "Title",
    "card.year": "Year",
    "card.medium": "Technique",
    "card.dimensions": "Dimensions"
  }
};

const LANG_STORAGE_KEY = "scintuart:lang";
const DEFAULT_LANG = "it";

function getLang() {
  try {
    return window.localStorage.getItem(LANG_STORAGE_KEY) === "en" ? "en" : DEFAULT_LANG;
  } catch (e) {
    // localStorage non disponibile (es. modalità privata restrittiva):
    // si ricade sempre sull'italiano, il sito resta comunque funzionante.
    return DEFAULT_LANG;
  }
}

function setLang(lang) {
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang === "en" ? "en" : "it");
  } catch (e) {
    // Se localStorage non è disponibile la scelta semplicemente non
    // persiste tra le pagine, ma non blocca l'uso del sito.
  }
}

function t(key) {
  const lang = getLang();
  if (STRINGS[lang] && key in STRINGS[lang]) return STRINGS[lang][key];
  if (key in STRINGS.it) return STRINGS.it[key];
  return key;
}

/**
 * Risolve un campo potenzialmente bilingue.
 * - stringa semplice, numero, array → restituito invariato (retrocompatibile
 *   con tutte le opere attuali, che usano ancora questo formato).
 * - oggetto { it: ..., en: ... } → restituisce il valore nella lingua
 *   corrente, con fallback a it, poi a en.
 */
function localize(field) {
  if (field == null) return field;
  if (typeof field === "object" && !Array.isArray(field) && ("it" in field || "en" in field)) {
    return field[getLang()] || field.it || field.en;
  }
  return field;
}

/* ---------- Applicazione automatica ai testi statici ---------- */
function applyTranslations() {
  document.documentElement.lang = getLang();

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });

  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    const isActive = btn.getAttribute("data-lang-btn") === getLang();
    btn.setAttribute("aria-current", isActive ? "true" : "false");
  });
}

/* ---------- Selettore IT | EN ---------- */
function initLangSwitch() {
  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang-btn");
      if (lang !== getLang()) {
        setLang(lang);
        // Ricarica la pagina corrente (stessa URL, stessi ?cat=/?sub=/?id=):
        // il modo più semplice e robusto per un sito multipagina senza
        // framework di riapplicare la lingua ovunque, restando nella
        // stessa sezione in cui ci si trovava.
        window.location.reload();
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyTranslations();
  initLangSwitch();
});
