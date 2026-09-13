# Changelog

## v8.1 - Section controls fix

- Fixed a generated JavaScript escaping error that prevented OK / Afwijking / N.v.t. buttons from responding in Sections 2 and higher.
- Section 1 Overzicht remains read-only and automatic.
- Section 2+ controls, comments, photos, disk-space fields and corrective-action generation remain interactive.


## 2026-08-13 — Automatisch hoofdoverzicht
- Sectie 1 is nu altijd een automatisch, alleen-lezen overzicht van alle secties vanaf 2.
- Overzicht toont status, aantal afwijkingen en herstelwerkzaamheden per sectie.
- Sectie 1 bevat geen invoervelden of selecteerbare statussen.
- Bestaande projecten/CSV's worden genormaliseerd zodat inspectiesecties vanaf 2 starten.
- Oude Managementsamenvatting/Overzicht-sectie 1 wordt vervangen door het gegenereerde overzicht.
## 2026-08-12 - Automatische herstelwerkzaamheden

- Het veld **Benodigde herstelwerkzaamheden / actiepunten** per sectie wordt automatisch opgebouwd uit alle controlepunten met status **Afwijking**.
- Controlepunten met **N.v.t.** worden niet in de automatische herstelwerkzaamheden opgenomen.
- Checknummer, controlepunt en ingevulde opmerking worden overgenomen; bij schijfruimte wordt ook het berekende gebruikte percentage meegenomen.
- Zodra een sectie volledig is gecontroleerd zonder afwijkingen, wordt automatisch vastgelegd dat geen herstelwerkzaamheden vereist zijn.
- De automatisch gegenereerde tekst blijft handmatig bewerkbaar. Met **Opnieuw vullen vanuit afwijkingen** kan de automatische inhoud worden hersteld.
- De actiepunten blijven onderdeel van opslaan/openen en Word/PDF-uitvoer.

# Latest update

- Checks marked **N.v.t.** are excluded from Word and PDF/print reports.
- N.v.t. checks no longer require mandatory comments or photos during report validation.
- N.v.t. remains visible in the inspection form and is still saved/restored with the inspection.

## 3.2.2

- Changed disk-space checks to enter **Total** and **Used** space.
- Used percentage is calculated automatically as `Used / Total × 100`.
- Added validation when Used exceeds Total.
- Saved inspections now store Total and Used; older Used + Free saves are migrated automatically when opened.
- Word/PDF output keeps the calculated used percentage.

## 2026-07-28

- Blokkeer PDF- en Word-export wanneer een verplichte foto of opmerking ontbreekt.
- Markeer ontbrekende verplichte invoer direct in het rapport.
- Houd de bovenbanner stabiel bij afdrukken/PDF-generatie.
- Toon inspectiefoto's in PDF/print en Word-export.
- Vervang de aparte back-upknop door **Opslaan**, dat lokaal bewaart en een JSON-bestand downloadt.
- Voeg export naar een bewerkbaar Microsoft Word-bestand (`.doc`) toe.

# Changelog

## 3.1.0
- Added dedicated `builder.html` page linked from the main application.
- Added customer logo and branding controls.
- Added visual section and check editor.
- Added live preview.
- Added export of one standalone checksheet HTML file.
- Removed the need to export configuration back to GitHub for each checklist.


## 3.0.0

- Added browser-based Administration portal.
- Added Customer Manager and logo upload.
- Added visual Template Builder with required-photo and required-comment settings.
- Added template duplication and version fields.
- Added Word `.docx` import.
- Added workspace backup and restore.
- Added repository-ready ZIP export containing customers, logos, templates and manifest.
- Retained inspection execution, photos, local save and PDF export.

## 2.0.0

- Added initial visual Template Editor.

## 3.2.0
- Added Microsoft Word (.docx) checklist import to the standalone builder.
- Word headings become sections; paragraphs, lists, and table rows become checks.
- Added mobile/tablet camera capture using the rear-facing camera where supported.
- Added separate camera and photo-library controls with removable previews.

## v2.1 – Photo selection and preview
- Made camera and gallery file inputs reliably tappable on tablets and mobile Safari/Chrome.
- Added support for common image extensions, including HEIC/HEIF selection where the browser can decode them.
- Added a safe fallback to the original image when canvas resizing is unavailable.
- Added visible upload status and per-file error handling.
- Preserved photo previews, JSON save/restore, Word export and print/PDF output.

## Section corrective actions
- Added a "Benodigde herstelwerkzaamheden / actiepunten" field at the end of every inspection section.
- Section action text is autosaved, included in JSON backups/restores, and included in Word/PDF output.
- Existing Total + Used disk-space percentage calculation remains supported.
