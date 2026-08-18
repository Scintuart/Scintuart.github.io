# Portfolio — Scintuart

Sito realizzato in HTML, CSS e JavaScript puro (nessun framework), pronto per
essere pubblicato gratuitamente su GitHub Pages. L'unica dipendenza esterna
è Google Fonts (per la tipografia); tutto il resto è locale.

Direzione estetica: museale, chiara, con molto spazio bianco e animazioni
ridotte al minimo (solo brevi dissolvenze, nessuno zoom, nessun parallasse).
Palette: carta/muro da galleria (#faf8f4), inchiostro quasi nero per il testo,
un unico accento bordeaux (#8d0000) ripreso dal punto rosso del logo — usato
con misura, mai come colore diffuso.

## Struttura del progetto

```
.nojekyll          Disabilita l'elaborazione Jekyll di GitHub Pages (necessario)
404.html            Pagina d'errore personalizzata
index.html          Homepage
works.html          Elenco opere (lista verticale)
work.html           Template pagina singola opera (?id=...)
about.html          Biografia
contact.html        Contatti
css/style.css       Tutti gli stili
js/works-data.js    Dati delle opere (MODIFICA QUESTO FILE per aggiornare i contenuti)
js/main.js          Navigazione, animazioni, lightbox
js/render.js        Popolamento dinamico delle pagine dai dati
assets/images/      Immagini (logo.png / logo-white.png, favicon.svg + segnaposto SVG)
assets/video/       Video (cartella vuota, vedi sotto)
```

Tutti i collegamenti interni (CSS, JS, immagini, link tra pagine) usano
percorsi **relativi** (es. `css/style.css`, non `/css/style.css`): il sito
funziona correttamente sia pubblicato nella root di un dominio, sia in un
GitHub Pages di progetto servito da una sottocartella
(`https://TUO-USERNAME.github.io/TUO-REPO/`), senza bisogno di alcuna
modifica.

Il file `.nojekyll` (vuoto, nella root) dice a GitHub Pages di pubblicare i
file così come sono, senza passarli attraverso Jekyll: è incluso perché
questo è un sito statico puro e non serve alcuna elaborazione. **Non
eliminarlo** — su alcuni sistemi i file che iniziano con `.` sono nascosti
per default: assicurati che venga effettivamente caricato su GitHub.

## Logo

`assets/images/logo.png` è la versione scura del logo (usata nell'header,
su sfondo chiaro). `assets/images/logo-white.png` è la versione chiara,
utile solo se in futuro aggiungi sezioni a sfondo scuro. Per sostituire il
logo, basta rimpiazzare questi due file mantenendo lo stesso nome, oppure
aggiornare il percorso `src` nel tag `<img class="brand">` di ogni pagina HTML.

## Come aggiungere/modificare un'opera

Apri `js/works-data.js` e aggiungi (o modifica) un oggetto nell'array `WORKS`:

```js
{
  id: "nome-univoco-opera",       // usato nell'URL: work.html?id=nome-univoco-opera
  title: "Titolo dell'opera",
  year: 2025,
  medium: "Tecnica",
  dimensions: "100 × 80 cm",
  category: "Disegno",
  description: ["Paragrafo 1", "Paragrafo 2 (opzionale)"],
  cover: "assets/images/mia-immagine.jpg",
  gallery: ["assets/images/foto1.jpg", "assets/images/foto2.jpg"],
  video: { src: "assets/video/mio-video.mp4", poster: "assets/images/poster.jpg" } // opzionale
}
```

Non serve creare nuovi file HTML: la pagina opera, la lista Works e la home
si aggiornano automaticamente.

## Sostituire i placeholder con i tuoi materiali

1. Copia le tue immagini in `assets/images/` e i tuoi video in `assets/video/`.
2. Aggiorna i percorsi corrispondenti in `js/works-data.js`.
3. Sostituisci `assets/images/hero-work.jpg` (l'immagine mostrata in home)
   e `assets/images/about-portrait.svg` con le tue immagini reali (mantieni
   lo stesso nome file oppure aggiorna i riferimenti in `index.html` /
   `about.html`).
4. Cerca "Nome Artista" e i testi segnaposto ("Testo segnaposto: ...") in
   tutte le pagine HTML e sostituiscili con i tuoi contenuti reali.

## Form di contatto

GitHub Pages non ha un backend, quindi il form in `contact.html` è collegato
(da configurare) a [Formspree](https://formspree.io), un servizio gratuito
che inoltra i messaggi via email. Basta creare un account gratuito, copiare
l'endpoint fornito e incollarlo nell'attributo `action` del `<form>`.

## Pubblicare su GitHub Pages

1. Crea un nuovo repository su GitHub (es. `portfolio`). Può essere pubblico
   o privato: GitHub Pages funziona con entrambi sui piani gratuiti attuali,
   ma se il repository è privato assicurati che il tuo piano lo consenta.
2. Carica **tutti** i file e le cartelle di questo pacchetto nella **root**
   del repository (non dentro una sottocartella) — incluso il file
   `.nojekyll`, anche se invisibile nel Finder/Esplora risorse. Via git:
   ```
   cd portfolio-artista
   git init
   git add -A
   git commit -m "Primo commit portfolio"
   git branch -M main
   git remote add origin https://github.com/TUO-USERNAME/TUO-REPO.git
   git push -u origin main
   ```
   (`git add -A` include anche i file nascosti come `.nojekyll`; con
   `git add .` su alcune versioni di git potrebbe essere escluso.)
3. Su GitHub vai in **Settings → Pages**.
4. In "Build and deployment" → "Source" seleziona **Deploy from a branch**,
   poi come branch scegli **main** e come cartella **/ (root)**. Salva.
5. Dopo 1-2 minuti il sito sarà online su
   `https://TUO-USERNAME.github.io/TUO-REPO/`. Se dopo qualche minuto vedi
   ancora un errore, ricarica la pagina delle impostazioni: in cima trovi il
   link diretto al sito pubblicato non appena il deploy è completo.
6. Verifica sul sito pubblicato che: il logo compaia in alto, le immagini
   delle opere si vedano, e la navigazione tra le pagine funzioni. Se
   qualcosa non si carica, controlla nella console del browser (F12) se
   manca qualche file — molto spesso è perché un asset non è stato caricato
   nel repository con lo stesso nome/percorso indicato in `works-data.js`.

### Dominio personalizzato (opzionale)

Se in futuro vuoi collegare un dominio tuo (es. `www.scintuart.com`), in
**Settings → Pages → Custom domain** inserisci il dominio: GitHub creerà
automaticamente un file `CNAME` nella root del repository. Non serve
crearlo a mano.

## Pagina 404

`404.html` viene mostrata automaticamente da GitHub Pages per qualsiasi URL
del sito che non esiste (comportamento nativo di GitHub Pages: cerca sempre
un file chiamato esattamente `404.html` nella root del repository). Non
serve alcuna configurazione aggiuntiva.

## Note tecniche

- Nessun bundler, nessuna build: apri semplicemente `index.html` in un
  browser per testare in locale (o usa un server locale semplice, es.
  `python3 -m http.server`, per evitare limitazioni del browser su alcuni
  fetch di moduli).
- Le animazioni rispettano `prefers-reduced-motion`.
- Il sito è completamente responsive: breakpoint principali a 900px e 560px.
- Tutti i percorsi sono relativi: il progetto è stato testato simulando
  esplicitamente un deploy in sottocartella (come funziona GitHub Pages di
  progetto) e tutte le pagine, gli script, le immagini e la navigazione
  interna risultano corretti senza alcuna modifica necessaria.
