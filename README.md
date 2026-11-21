# Paideia — prototipo statico del sito unico

Prototipo navigabile di struttura e funzionalità **senza backend**, preparato per la discussione con il programmatore. È **un progetto nuovo e separato** dal sito attuale; il repository `mdigregorio/paideiacultura-site` è stato consultato **solo in lettura** e non viene modificato.

## Avvio

Aprire `index.html` con un browser. Non servono Node, Python, server o collegamento Internet. Tutti i percorsi sono relativi e funzionano anche in GitHub Pages sotto `/paideia-prototipo/`.

## Pagine

- **Home**, associazione, soci e profili, notizie e un articolo collegato a più soci.
- **Scuola Estiva** come microsito interno: presentazione, edizione 2026, scheda di corso, sedi e galleria; menu proprio.
- **Incontri sul metodo**: convegno ricorrente *inventato per la demo*, con una giornata e tre interventi per edizione.
- **Il metodo come arte – In ricordo di Alberto Marradi**: giornata di studi autonoma (12 dicembre 2026, 10:00–15:00, Aula Magna dell'Università degli Studi di Firenze, Via Laura 48). Programma e relatori sono ancora da definire, e le voci presenti servono solo come segnaposto.
- **Archivio**: alternanza tra `Edizioni` (filtri `Iniziativa`, `Anno`) e `Corsi e interventi` (filtri `Iniziativa`, `Edizione`). Dalla Home i filtri sono vuoti; da ciascuna area il filtro Iniziativa viene preselezionato ma resta modificabile.
- **Area personale**: dimostrazione di login, iscrizioni, stato di pagamento, questionario, materiali e attestato. Non c'è autenticazione reale o salvataggio.

### Accesso dimostrativo

- E-mail: `demo@paideia.test`
- Password: `prototipo`

Le credenziali sono pubbliche e fittizie, e il controllo avviene solo in JavaScript nel browser. **Non usare questo meccanismo in un sito reale.**

## Dati reali e dati dimostrativi

- La presentazione generale di Paideia e i dati sintetici della Scuola Estiva 2026 sono ispirati a fonti pubbliche dell'associazione. Per corsi, date e docenti della Scuola 2026: https://www.paideiascuoleestive.it/corsi e https://www.paideiascuoleestive.it/scuola.
- `Incontri sul metodo`, i suoi programmi, i nomi di esempio dei soci, i relativi profili e gli articoli sono inventati esclusivamente per il prototipo.
- I dettagli della giornata di studi dedicata ad Alberto Marradi provengono dalle informazioni fornite per questa simulazione. Gli orari delle singole parti del programma e i nomi dei relatori sono da definire.
- L'archivio del prototipo è un campione esplicativo, non l'archivio completo dell'associazione. Il sito originale contiene uno storico molto più esteso.
- Nessuna immagine o file storico del repository originale è stato copiato in questo prototipo.

## Limiti e ambito

HTML, CSS e JavaScript nativi, nessuna dipendenza, nessun database. Non esegue iscrizioni, pagamenti, invii e-mail, recuperi password o verifiche di consenso. Le parti riservate sono dimostrative e non protette. Le scelte visive sono segnaposto, in attesa della progettazione grafica.

## Pubblicazione in nuovo repository

Creare un **nuovo** repository GitHub, ad esempio `mdigregorio/paideia-prototipo`, e caricarvi i file contenuti nella cartella. Per GitHub Pages scegliere `Settings` → `Pages` → `Deploy from a branch`, poi `main` e `/ (root)`. Il repository esistente `mdigregorio/paideiacultura-site` deve rimanere invariato.

## Revisione della navigazione e dei contenuti (novembre 2026)

- Menu globale: Home, Chi siamo, Soci, Formazione, Convegni, Progetti e altre iniziative, Notizie, Area personale. L’archivio è raggiungibile dai riquadri dedicati, non dal menu principale.
- `iniziative.html`: mostra soltanto iniziative in corso o programmate; le tre pagine per categoria mostrano anche iniziative concluse.
- Scuola Estiva, Magistri sine registro, Incontri sul metodo e Giornata Marradi utilizzano menu specifici che sostituiscono la navigazione generale. Il footer è comune.
- `associazione.html#manifesto`: manifesto storico completo, trascritto dal repository `paideiacultura-site` (solo lettura). `soci.html`: elenco dei 50 soci dal medesimo repository, con segnalazione di profili ancora da completare.
- La Scuola include staff, slideshow e galleria. Le immagini sono **caricate dal dominio storico della Scuola**: la loro visualizzazione richiede connessione Internet e la disponibilità di quel sito. Nel progetto definitivo andranno migrate con autorizzazione e relative attribuzioni.
- Il programma 2027 è presentato come *in definizione* ai soli fini dell'esempio; non viene comunicata alcuna apertura di iscrizioni effettive.
- Fonti: `https://github.com/mdigregorio/paideiacultura-site`, `https://www.paideiascuoleestive.it/scuola`, `/staff`, `/borghi`, `/esperienze`, `https://www.paideiacultura.it/le-nostre-scuole-e-iniziative/`.
- La voce «Incontri sul metodo» rimane un **convegno fittizio** indicato come tale. Le persone usate nelle vecchie schede di esempio sono fittizie.
