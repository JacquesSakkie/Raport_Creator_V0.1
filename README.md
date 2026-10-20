# Inspectie Studio v8

## Bewerken na het invullen — volledige back-ups

De bouwer en zelfstandige checksheet gebruiken nu hetzelfde back-upformaat. Een
**bewerkbare back-up** bevat de checksheetdefinitie én alle ingevulde antwoorden,
opmerkingen, foto's, locatiegegevens en herstelwerkzaamheden. Word en PDF blijven
bedoeld voor de uiteindelijke rapportuitvoer.

1. Kies in de ingevulde checksheet **Bewerkbare back-up** (of **Opslaan**).
2. Open de bouwer (`index.html`) en ga naar **Import / export**.
3. Kies **Project / inspectie-JSON openen** en selecteer de back-up.
4. Voeg in **Bouwer** controlepunten of secties toe. Bestaande antwoorden blijven
   gekoppeld aan hun controlepunt, ook na verplaatsen of hernoemen.
5. Download opnieuw een bewerkbare back-up of exporteer de bijgewerkte HTML.

**HTML opslaan** in de ingevulde checksheet maakt ook een zelfstandig HTML-bestand
met de actuele inspectie erin. Dit kan later opnieuw worden geopend en ingevuld,
ook zonder de browseropslag van het oorspronkelijke apparaat.

### Bestaande inspecties herstellen

Oude `*-opgeslagen.json`-bestanden bevatten antwoorden en foto's maar geen
checksheetdefinitie. Open bij **Import / export** eerst de oorspronkelijke
**checksheet-HTML** en daarna de bijbehorende oude inspectie-JSON. Download daarna
een volledige bewerkbare back-up. Oudere bouwproject-JSON blijft ook ondersteund.

Een niet-passende of ongeldige back-up wordt geweigerd voordat de huidige
inspectie wordt vervangen. Herhaald openen vervangt de foto's; het voegt ze niet
dubbel toe. Verwijderde controlepunten blijven in de inspectieback-up bewaard,
maar verschijnen niet in de actuele checksheet of het rapport.

### Grote rapporten en privacy

Browseropslag kan te klein zijn voor inspecties met veel foto's. De checksheet
meldt dit zichtbaar; downloaden van JSON of HTML blijft beschikbaar. Bewaar dus
regelmatig een bestand. Foto's worden bij export/import niet opnieuw gecomprimeerd.

Zet uitsluitend de applicatiebestanden in GitHub. Upload ingevulde inspecties,
klantfoto's en persoonlijke back-ups niet naar een openbare repository.

### Tests

De applicatie heeft geen buildstap nodig. De back-upvalidatie kan worden getest
met Node.js: `node --test tests/backup.test.cjs`. Daarnaast is de volledige
workflow getest in Microsoft Edge, inclusief export/import, het toevoegen en
verplaatsen van controles, volle browseropslag en een inspectie met 136 foto's.

Nederlandstalige, statische checksheetbouwer voor GitHub Pages. Geen buildstap, server of database nodig.

## Belangrijk

De toepassing gebruikt geen automatisch gegenereerd `.xlsx`-sjabloon meer. Microsoft Excel kan programmatisch gegenereerde werkmappen soms repareren. Gebruik daarom het meegeleverde `templates/checksheet-sjabloon.csv`:

1. Open het CSV-bestand in Microsoft Excel.
2. Voeg rijen toe of wijzig de inhoud.
3. Kies **Opslaan als → CSV UTF-8 (door komma's gescheiden)**. De importeur ondersteunt zowel puntkomma's als komma's.
4. Importeer het bestand in Inspectie Studio.

U kunt de checklist ook volledig in de visuele editor maken, zonder Excel.

## GitHub Pages

1. Kopieer alle bestanden naar de hoofdmap van uw repository.
2. Commit en push naar `main`.
3. Open **Settings → Pages**.
4. Kies **Deploy from a branch**, `main`, `/ (root)`.

## Functies

- Visuele sectie- en controlepunteneditor
- Lokaal project opslaan, openen en verwijderen
- JSON-back-up import/export
- CSV-import/export voor Microsoft Excel
- Klantlogo, titel, kleuren en locatie
- Live voorbeeld
- Zelfstandig checksheet-HTML exporteren
- Mobiele camera en fotokeuze
- Automatisch lokaal opslaan van inspectievoortgang
- Inspectieback-up downloaden en openen
- Afdrukken / PDF

## Browser/camera note
Tablet camera capture requires the exported HTML to be opened from GitHub Pages or another HTTPS website. Opening directly inside a ZIP is not supported.

### Herstelwerkzaamheden per sectie
Elke sectie in de gegenereerde inspectie bevat onderaan een veld **Benodigde herstelwerkzaamheden / actiepunten**. Dit veld wordt automatisch gevuld vanuit de controlepunten die in diezelfde sectie als **Afwijking** zijn gemarkeerd. Het checknummer, de naam en de ingevulde opmerking worden samengevoegd tot de actielijst. **N.v.t.** wordt genegeerd. Bij een volledig gecontroleerde sectie zonder afwijkingen wordt automatisch vermeld dat geen herstelwerkzaamheden vereist zijn. De tekst blijft handmatig aanpasbaar en kan met **Opnieuw vullen vanuit afwijkingen** opnieuw automatisch worden opgebouwd. De inhoud wordt meegenomen in opslaan/openen en Word/PDF-uitvoer.


## N.v.t. in rapporten

Wanneer een controlepunt als **N.v.t.** wordt gemarkeerd, blijft die keuze opgeslagen in de inspectie maar wordt het controlepunt niet opgenomen in Word- of PDF/print-rapporten. Verplichte foto/opmerking-regels worden voor N.v.t. niet toegepast.


## Sectie 1 — automatisch overzicht

Sectie **1. Overzicht** is gereserveerd en wordt door de toepassing automatisch opgebouwd uit alle inspectiesecties vanaf sectie 2. De gebruiker kan in deze sectie geen status selecteren, opmerkingen typen of andere gegevens invullen. Per sectie toont het overzicht de actuele status, het aantal afwijkingen en de herstelwerkzaamheden/actiepunten. De status verandert automatisch naar **Niet gecontroleerd**, **Deels gecontroleerd**, **OK**, **Afwijking** of **N.v.t.** op basis van de onderliggende controles. CSV-import, JSON-projecten en oudere opgeslagen projecten worden automatisch genormaliseerd zodat echte inspectiesecties bij sectie 2 beginnen. Een oude sectie 1 met de naam Managementsamenvatting/Overzicht wordt vervangen door het nieuwe gegenereerde overzicht.

## Section 1 overview behavior

Section 1 is an automatically generated, read-only overview. All inspection controls start at Section 2. The OK, Afwijking and N.v.t. buttons in Sections 2 and higher are fully interactive.
