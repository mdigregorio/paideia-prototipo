# Paideia prototipo del sito unico

Prototipo statico navigabile, pubblicato esclusivamente in **mdigregorio/paideia-prototipo**. Il repository `mdigregorio/paideiacultura-site` è una fonte in sola lettura.

Il [report dell’audit](AUDIT.md) distingue le richieste completate dai materiali ancora da consegnare e dai limiti di verifica.

## Consultazione

Sito: <https://mdigregorio.github.io/paideia-prototipo/>

Le 37 pagine usano HTML, CSS e JavaScript senza dipendenze. Si può aprire `index.html` anche localmente. Per controllare i percorsi come nel sito pubblicato è preferibile un server statico, ad esempio `python -m http.server 4173` dalla cartella del progetto. Le fotografie della Scuola richiedono il collegamento al suo dominio ufficiale.

## Pagine e contenuti

- Home, Chi siamo e manifesto, Soci con Direttivo attuale e Direttivi 2015–2018 e 2012–2015, profili, formazione, convegni, progetti e iniziative.
- Articolo **In ricordo di Alberto Marradi**, con il testo fornito integralmente e conservato anche in `data/ricordo-marradi.txt`. Galleria commemorativa in attesa di foto e video.
- Micrositi Scuola Estiva, Magistri sine registro, Incontri sul metodo e giornata di studi Il metodo come arte. Barra Paideia e breadcrumb scuri sticky, intestazione propria, menu mobile a scomparsa e footer comune.
- Scuola: edizione 2026 con sei corsi e PDF locale, scheda di corso, staff con Giovanni Di Franco, sedi, galleria, regolamento, contatti e iscrizione dimostrativa.
- Newsletter come articoli nella categoria Newsletter, pubblicate anche nelle Notizie e raccolte nell’archivio datato. Home con «Leggi ultima newsletter» e iscrizione demo.
- Contatti istituzionali e pagina unica «Privacy e note legali», con informativa, cookie e diritto d’autore per il futuro sito. Il footer collega anche il Manifesto e l’archivio delle iniziative.

## Archivio

`data/catalogo-formazione.json` è una copia integrale del catalogo istituzionale consultato il 21 novembre 2026: **60 edizioni e 201 moduli**. Non è un collegamento al database futuro.

Il comando di preparazione genera due file: `assets/catalogo-edizioni.js` (13.287 byte) e `assets/catalogo-corsi.js` (61.652 byte). I corsi vengono caricati quando si apre la relativa vista o si esegue una ricerca nell’archivio. Il catalogo iniziale precedente era di 75.729 byte. Nessun caricamento del catalogo nelle altre pagine.

- **Edizioni**: filtri Iniziativa e Anno.
- **Corsi e interventi**: filtri Iniziativa ed Edizione.
- 24 risultati iniziali, poi «Mostra altre voci».
- Ricerca per docente, relatore, titolo o argomento, combinata con i filtri della vista. In Edizioni sono ricercabili anche i corsi e gli interventi collegati.
- Collegamenti diretti con `iniziativa`, `vista`, `anno`, `edizione` e `q` per il testo della ricerca.
- Dati mancanti espliciti e indicazione «Da verificare» conservata. Un titolo nullo viene mostrato come «Titolo non disponibile».
- Le cinque edizioni e i sei interventi delle altre iniziative sono distinti dai 60/201 record formativi; senza filtri si vedono quindi 65 edizioni o 207 corsi/interventi.

## Aggiornamenti e controlli

```text
node scripts/build.mjs
node scripts/verify.mjs
```

`scripts/build.mjs` aggiorna i file del catalogo, i menu, il footer, i riquadri delle Notizie, l’ultima newsletter e gli spazi partner. Non richiede accesso alla rete e non pubblica nulla autonomamente.

- Modificare i modelli in `templates/` per il footer o i menu condivisi.
- Per una newsletter, creare l’articolo HTML e aggiungere i suoi metadati in `data/news.json` con categoria `Newsletter`, data e indicazione demo. Ricostruire: comparirà anche in Notizie, nell’archivio e come ultimo numero se più recente.
- Aggiungere i partner verificati in `data/partners.json`, con nome, logo locale e URL ufficiale. Gli spazi senza materiali restano privi di collegamenti fittizi.
- Aggiornare il catalogo solo da una fonte validata. Il controllo attuale richiede 60/201 record e relazioni valide; modificare tale vincolo solo per un aggiornamento reale del catalogo.

`scripts/verify.mjs` controlla link e ancore locali, footer, menu, testo commemorativo, PDF, catalogo, newsletter e comportamento dei filtri/caricamenti. I controlli delle interazioni usano il codice effettivo con controlli simulati in Node; non sostituiscono una verifica grafica nel browser.

## Dati dimostrativi

Incontri sul metodo e i vecchi profili di esempio sono fittizi e segnalati. I numeri della newsletter e le loro date sono dimostrativi. La pagina memoriale non è un testo inventato. La giornata Marradi è distinta dall’articolo commemorativo.

Accesso demo: `demo@paideia.test` / `prototipo`. Non esistono autenticazione protetta, database, invii e-mail, iscrizioni, pagamenti o attestati validi. La compilazione dei moduli cambia soltanto l’interfaccia aperta. La pagina «Privacy e note legali» è una bozza da completare in base ai servizi che saranno attivati sul sito definitivo.

I loghi della Scuola e dei suoi partner sono copie delle immagini ufficiali. I social sono collegamenti testuali attestati dalle pagine ufficiali; nessun widget incorporato. Instagram e LinkedIn istituzionale non sono aggiunti in assenza di una fonte affidabile.
