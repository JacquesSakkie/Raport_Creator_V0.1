/* Shared by the builder and embedded in every standalone inspection. */
(function (root, factory) {
  root.InspectionBackupFactory = factory;
  root.InspectionBackup = factory();
  if (typeof module === 'object' && module.exports) module.exports = root.InspectionBackup;
})(globalThis, function createInspectionBackupTools() {
  'use strict';
  const FORMAT = 'inspectie-studio-backup';
  const VERSION = 1;
  const object = value => value && typeof value === 'object' && !Array.isArray(value);
  function validateProject(project) {
    if (!object(project) || !Array.isArray(project.sections)) throw new Error('De checksheetdefinitie ontbreekt.');
    const ids = new Set();
    project.sections.forEach(section => {
      if (!object(section) || typeof section.id !== 'string' || !section.id || ids.has(section.id) || !Array.isArray(section.checks)) {
        throw new Error('Het project bevat een ongeldige of dubbele sectie.');
      }
      ids.add(section.id);
      section.checks.forEach(check => {
        if (!object(check) || typeof check.item !== 'string') throw new Error('Het project bevat een ongeldig controlepunt.');
      });
    });
    return project;
  }
  function validateInspection(inspection) {
    if (!object(inspection) || !object(inspection.checks) || (inspection.meta !== undefined && !object(inspection.meta)) ||
        (inspection.sectionActions !== undefined && !object(inspection.sectionActions))) throw new Error('Ongeldige inspectiegegevens.');
    Object.values(inspection.checks).forEach(check => {
      if (!object(check) || (check.status && !['ok', 'bad', 'na'].includes(check.status)) ||
          (check.photos !== undefined && (!Array.isArray(check.photos) || check.photos.some(photo => typeof photo !== 'string')))) {
        throw new Error('Ongeldige antwoorden of foto’s in de inspectie.');
      }
    });
    return inspection;
  }
  function projectOnly(project) {
    const { inspection, ...definition } = validateProject(project);
    return definition;
  }
  function keys(project) {
    return new Set(project.sections.flatMap(section => section.checks.filter(check => check.enabled !== false)
      .map((check, index) => check.progressKey || `${section.id}-${index}`)));
  }
  function requireMatchingInspection(project, inspection) {
    const available = keys(project);
    const missing = Object.keys(inspection.checks).filter(key => !available.has(key));
    if (missing.length) throw new Error('Deze oude inspectieback-up hoort bij een andere checksheet. Open eerst de oorspronkelijke checksheet-HTML via Import / export en open daarna dit JSON-bestand.');
  }
  function pack(project, inspection) {
    return {
      format: FORMAT, version: VERSION, savedAt: new Date().toISOString(),
      project: projectOnly(project),
      inspection: validateInspection(inspection || { meta: {}, checks: {}, sectionActions: {} })
    };
  }
  function unpack(data, currentProject) {
    if (!object(data)) throw new Error('Dit bestand bevat geen geldige back-up.');
    if (data.format === FORMAT) {
      if (data.version !== VERSION) throw new Error('Deze back-upversie wordt niet ondersteund.');
      return { project: projectOnly(data.project), inspection: validateInspection(data.inspection), complete: true };
    }
    if (Array.isArray(data.sections)) {
      return { project: projectOnly(data), inspection: data.inspection ? validateInspection(data.inspection) : null, complete: false };
    }
    if (object(data.checks)) {
      validateProject(currentProject);
      validateInspection(data);
      requireMatchingInspection(currentProject, data);
      return { project: projectOnly(currentProject), inspection: data, complete: false, legacy: true };
    }
    throw new Error('Dit is geen Inspectie Studio-project of inspectieback-up.');
  }
  function projectFromHtml(html) {
    // Read JSON only. Never execute scripts from an imported HTML file.
    const match = /\bconst\s+CFG\s*=\s*/.exec(html);
    if (!match) throw new Error('De oorspronkelijke checksheetdefinitie ontbreekt in dit HTML-bestand.');
    const start = match.index + match[0].length;
    let depth = 0, quoted = false, escaped = false;
    for (let index = start; index < html.length; index++) {
      const char = html[index];
      if (quoted) {
        if (escaped) escaped = false;
        else if (char === '\\') escaped = true;
        else if (char === '"') quoted = false;
      } else if (char === '"') quoted = true;
      else if (char === '{') depth++;
      else if (char === '}' && --depth === 0) {
        const project = JSON.parse(html.slice(start, index + 1));
        validateProject(project);
        return project;
      }
    }
    throw new Error('De checksheetdefinitie is onvolledig.');
  }
  return { FORMAT, VERSION, validateProject, validateInspection, projectOnly, pack, unpack, keys, requireMatchingInspection, projectFromHtml };
});
