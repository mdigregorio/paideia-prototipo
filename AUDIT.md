# Audit Paideia prototipo del 21 novembre 2026

Le modifiche riguardano esclusivamente `mdigregorio/paideia-prototipo`. La revisione parte dal commit `a845314b1f02797b8ee8f64fcc6e3890180d35cf`. `mdigregorio/paideiacultura-site` è stato usato soltanto in lettura.

Sito: <https://mdigregorio.github.io/paideia-prototipo/>. Il commit che comprende questo report contiene le modifiche elencate; il collegamento al commit e l’esito della pubblicazione sono riportati anche nella consegna finale.

## Richieste e risultati

| N. | Richiesta | Risultato |
| --- | --- | --- |
| 1 | Articolo commemorativo Marradi | Creata `in-ricordo-di-alberto-marradi.html`. Titolo e quattro paragrafi riproducono parola per parola il testo ricevuto. Fondatore e presidente onorario indicati separatamente dal testo, che non è stato riscritto. Richiami in Soci, profilo Marradi, Scuola, staff, giornata di studi, Notizie e newsletter demo. Spazi fotografici e video vuoti, senza media inventati. |
| 2 | Direttivi | Soci evidenzia il Direttivo attuale: Rita Bichi Presidente, Domenico Secondulfo Vicepresidente, Gabriella Punziano Direttrice. Direttivi precedenti esattamente 2015–2018: Rita Bichi Presidente, Paolo Parra Saiani Vice-Presidente, Fabrizio Martire Direttore; 2012–2015: Gianni Losito Presidente, Rita Bichi Vice-Presidente, Maria Concetta Pitrone Direttrice. Nessun altro mandato attribuito. |
| 3 | Giovanni Di Franco | Inserito nello staff come «Ex-direttore e docente», con collegamento alla pagina ufficiale dello staff. |
| 4 | Logo Scuola | Sostituito SE in tutte le intestazioni Scuola con l’immagine ufficiale `logo_testata.jpg`, salvata localmente. L’allegato della chat storica non era recuperabile: il confronto con quell’allegato rimane non verificato. |
| 5 | Footer e Contatti | Footer condiviso su tutte le 37 pagine, con denominazione E.T.S., Via Koristka 8, 20154 Milano, C.F. 97340340583, P.I. 13438590963 e tutti i link richiesti. Creata Contatti. Rimossa l’e-mail generica non confermata; mantenuti recapiti Scuola attestati. |
| 6 | Privacy Cookie Copyright | Create tre pagine esplicitamente dimostrative, collegate dal footer. Distinguono il funzionamento attuale dagli elementi da definire per i servizi effettivi. |
| 7 | Social | Aggiunti Facebook istituzionale, Facebook e LinkedIn della Scuola, attestati dalle pagine ufficiali. Non aggiunti Instagram o LinkedIn istituzionale senza riscontro. LinkedIn Scuola restituisce 403 alla verifica automatica, ma l’indirizzo è presente nel footer ufficiale della Scuola. |
| 8 | Partner | Spazi dedicati nelle pagine di ciascuna iniziativa e delle edizioni. Scuola con tre loghi ufficiali cliccabili: Università di Salerno, DISPC e AIS. Altre iniziative con spazi vuoti in attesa di loghi e collegamenti confermati. `data/partners.json` alimenta i collegamenti effettivi senza inventare sponsor o URL. |
| 9 | Menu mobile | Menu hamburger a scomparsa su sito principale e tutti i micrositi. Pulsante con stato espanso e controllo associato, chiusura con Escape e ritorno del focus, clic esterno e cambio dimensione. Menu visibile se JavaScript è disattivato. |
| 10 | Regolamento e Contatti Scuola | Create due pagine interne. Il Regolamento è una sintesi esplicita delle regole ufficiali, con collegamento alla versione integrale. Contatti comprende segreteria, direttore, Giuseppe Tancredi, telefono, e-mail e accesso a Tortorella dalla fonte indicata. |
| 11 | Archivio completo e prestazioni | Conservati 60/201 record del JSON integrale e tutte le relazioni. Due viste e filtri richiesti funzionanti. Caricamento corsi differito e memorizzato nella pagina; indice delle edizioni, 24 risultati iniziali e incremento progressivo, gestione errori e tentativi successivi. Risolto anche il blocco causato dai titoli nulli presenti nella fonte. |
| 12 | PDF e nota fonte | Copiato nel prototipo il PDF effettivo `2026-locandina-scuola-estiva.pdf`, collegato dalla pagina 2026 e dall’archivio. Eliminati link «Programma sul sito attuale» e nota «Fonte dei dati» dall’interfaccia. Completato il riepilogo dei sei corsi 2026. |
| 13 | Newsletter e Notizie | Home con «Leggi ultima newsletter» e iscrizione demo. Due numeri dimostrativi come articoli, Notizie con date, archivio newsletter datato e accesso dall’articolo. Un’unica lista di metadati alimenta Notizie, archivio e ultimo numero al comando di preparazione. |
| 14 | Intestazioni micrositi | Conservate barra Paideia e breadcrumb scuri sticky insieme all’intestazione specifica e al footer condiviso. Aggiunti Regolamento e Contatti al menu della Scuola. |
| 15 | Verifica e consegna | Controllate struttura HTML, risorse, ancore, contenuti, catalogo, filtri, caricamento differito e menu. Report aggiornato nel repository. Pubblicazione mediante commit nel solo repository del prototipo, con verifica successiva della versione servita. |

## Verifiche svolte

- 37 pagine HTML controllate; nessuna chiusura di tag incoerente o ID duplicato rilevato.
- 1.252 collegamenti, ancore e risorse interni risolti correttamente.
- `node scripts/verify.mjs`: 14 gruppi di controlli superati. Confronto esatto del testo commemorativo; validazione PDF; integrità 60/201; newsletter presenti nei tre punti previsti; menu e interazioni dell’archivio verificati con il codice effettivo in Node.
- I filtri dell’archivio sono stati provati anche mediante URL, durante un caricamento ancora in corso e dopo un errore con successivo tentativo. Sei corsi presenti per la Scuola 2026.
- 61 URL esterni controllati: 60 rispondono con HTTP 200; LinkedIn Scuola restituisce 403. Nessun 404 rilevato nella versione finale controllata. I vecchi URL della Scuola privi di `.html`, che restituivano 404, sono stati corretti.
- Il PDF locale è il documento effettivo di 2.508.207 byte. I collegamenti alle locandine storiche corrispondono ai percorsi del repository di riferimento e sono raggiungibili.
- Dati iniziali dell’archivio ridotti da 75.729 a 13.287 byte, circa **82,5% in meno**. I 61.652 byte dei corsi sono richiesti solo aprendo la relativa vista. Questo dato misura i file trasferiti, non un tempo di caricamento nel browser.

L’anteprima del browser non era disponibile: apertura e ripristino sono terminati per timeout del servizio. La verifica grafica e l’uso reale su dispositivi mobili non sono quindi attestati da questo audit. I controlli funzionali in Node e quelli dei file non sostituiscono tale verifica.

## Materiali e attività ancora necessari

1. Foto, video, didascalie e autorizzazioni per la galleria commemorativa. La struttura è pronta; nessun materiale è stato inventato.
2. Loghi e URL confermati per i partner delle altre iniziative. Gli spazi sono predisposti; solo i partner ufficiali della Scuola sono attualmente cliccabili.
3. Eventuali indirizzi Instagram e LinkedIn istituzionale, se l’associazione vuole inserirli. Occorre un riferimento ufficiale; nessun indirizzo è stato dedotto dal nome.
4. Eventuale riscontro che il logo recuperato dal sito ufficiale coincida con l’allegato storico dell’utente.
5. Verifica grafica finale nel browser su desktop e smartphone, poiché il servizio di anteprima non ha funzionato durante questa sessione.

Database, gestione editoriale automatica, invio newsletter, autenticazione, iscrizioni e pagamenti effettivi restano servizi futuri del prototipo. Le pagine legali sono dimostrative come richiesto e dovranno essere completate quando tali servizi saranno definiti.

## Fonti

- Testo commemorativo: messaggio dell’utente nella presente conversazione, conservato in `data/ricordo-marradi.txt`.
- Direttivo e mandati: [03-chi-siamo.md](https://github.com/mdigregorio/paideiacultura-site/blob/main/contenuti/03-chi-siamo.md).
- Archivio: [catalogo-formazione.json](https://github.com/mdigregorio/paideiacultura-site/blob/main/contenuti/catalogo-formazione.json), copiato integralmente in `data/`.
- Regolamento: <https://www.paideiascuoleestive.it/regolamento.html>.
- Contatti: <https://www.paideiascuoleestive.it/contatti.html>.
- Staff: <https://www.paideiascuoleestive.it/staff.html>.
- Logo Scuola: <https://www.paideiascuoleestive.it/web/layout/img/logo_testata.jpg>.
- Partner e social Scuola: footer del sito ufficiale; social Paideia: sito istituzionale e contenuto Contatti nel repository di riferimento.
- PDF 2026: `uploads/formazione/2026-locandina-scuola-estiva.pdf` del repository di riferimento, copiato in `assets/pdf/` del solo prototipo.
