/* Serialized into exported HTML; keep this function independent of builder code. */
globalThis.attachInspectionBackups = function attachInspectionBackups(env) {
  'use strict';
  const { CFG, KEY, BACKUP, capture, apply, update, downloadFile } = env;
  const $ = id => document.getElementById(id);
  const name = String(CFG.projectName || 'inspectie').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'inspectie';
  function notice(text, warning) {
    $('backupStatus').textContent = text;
    $('backupStatus').style.color = warning ? '#a33b20' : '#496373';
  }
  function persist(current) {
    try {
      localStorage.setItem(KEY, JSON.stringify(current));
      notice('Wijzigingen lokaal opgeslagen. Download een bewerkbare back-up om dit rapport veilig te bewaren.');
      return true;
    } catch (error) {
      notice('Browseropslag is vol of niet beschikbaar. Uw rapport blijft open: download nu een bewerkbare back-up of sla de HTML op.', true);
      return false;
    }
  }
  function save() {
    try {
      const current = capture();
      persist(current);
      downloadFile(name + '-bewerkbare-backup.json', JSON.stringify(BACKUP.pack(CFG, current)), 'application/json');
    } catch (error) { notice('Back-up maken mislukt: ' + error.message, true); }
  }
  function saveHtml() {
    try {
      const current = capture();
      const clone = document.documentElement.cloneNode(true);
      let snapshot = clone.querySelector('#inspection-snapshot');
      if (!snapshot) {
        snapshot = document.createElement('script');
        snapshot.id = 'inspection-snapshot';
        snapshot.type = 'application/json';
        clone.querySelector('head').appendChild(snapshot);
      }
      snapshot.textContent = JSON.stringify(current).replace(/</g, '\\u003c');
      // Photos will be restored from the snapshot; don't duplicate all image data.
      clone.querySelectorAll('.thumbs').forEach(node => node.replaceChildren());
      const script = [...clone.querySelectorAll('script')].find(node => node.textContent.startsWith('const CFG='));
      if (script) {
        const end = script.textContent.indexOf(';const KEY=');
        if (end >= 0) script.textContent = 'const CFG=' + JSON.stringify(BACKUP.projectOnly(CFG)).replace(/</g, '\\u003c') + script.textContent.slice(end);
      }
      downloadFile(name + '-verder-bewerken.html', '<!doctype html>' + clone.outerHTML, 'text/html;charset=utf-8');
      notice('Bewerkbare HTML gedownload, inclusief antwoorden, actiepunten en foto’s.');
    } catch (error) { notice('HTML opslaan mislukt: ' + error.message, true); }
  }
  $('saveBtn').onclick = save;
  $('backupBtn').onclick = save;
  $('htmlSaveBtn').onclick = saveHtml;
  $('restoreBtn').onclick = () => $('restoreInput').click();
  $('restoreInput').onchange = async event => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const restored = BACKUP.unpack(JSON.parse((await file.text()).replace(/^\uFEFF/, '')), CFG);
      if (!restored.inspection) throw new Error('Dit bestand bevat alleen een checksheetsjabloon. Open het in de bouwer.');
      if (restored.complete && JSON.stringify(restored.project.sections) !== JSON.stringify(CFG.sections)) {
        throw new Error('Deze back-up bevat een andere checksheet. Open hem in de bouwer via Import / export om ook die inhoud te herstellen.');
      }
      BACKUP.requireMatchingInspection(CFG, restored.inspection);
      apply(restored.inspection);
      persist(capture());
      notice('Inspectie hersteld. U kunt antwoorden, opmerkingen en foto’s verder aanpassen.');
    } catch (error) { notice('Openen mislukt: ' + error.message, true); }
    finally { event.target.value = ''; }
  };
  try {
    const snapshot = $('inspection-snapshot');
    const saved = snapshot ? JSON.parse(snapshot.textContent) : CFG.inspection || JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved) apply(BACKUP.validateInspection(saved));
    else update();
  } catch (error) {
    update();
    notice('Lokaal opgeslagen gegevens konden niet worden geopend. Open uw back-upbestand.', true);
  }
  return { persist, save, saveHtml };
};
