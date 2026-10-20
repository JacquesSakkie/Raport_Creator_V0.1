const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const backup = require('../assets/backup.js');

const project = { projectName: 'Test', sections: [{ id: 'first', checks: [
  { item: 'Check A', progressKey: 'stable-a' }, { item: 'Check B', progressKey: 'stable-b' }
] }] };
const inspection = { meta: { location: 'Test' }, checks: {
  'stable-a': { status: 'bad', note: 'Original note', photos: ['data:image/png;base64,example'] }
}, sectionActions: { first: 'Manual action' } };

test('complete JSON round trip preserves template, answers, photos and action points', () => {
  const result = backup.unpack(JSON.parse(JSON.stringify(backup.pack(project, inspection))));
  assert.deepEqual(result.project, project);
  assert.deepEqual(result.inspection, inspection);
});
test('old project templates remain supported', () => {
  assert.deepEqual(backup.unpack(project).project, project);
  assert.equal(backup.unpack(project).inspection, null);
});
test('legacy inspection requires its matching checklist', () => {
  assert.deepEqual(backup.unpack(inspection, project).inspection, inspection);
  assert.throws(() => backup.unpack(inspection, { sections: [] }), /andere checksheet/);
});
test('moving a stable check preserves its answer identity', () => {
  const reordered = { ...project, sections: [{ ...project.sections[0], checks: [...project.sections[0].checks].reverse() }] };
  assert.doesNotThrow(() => backup.unpack(inspection, reordered));
  assert.equal(backup.unpack(inspection, reordered).inspection.checks['stable-a'].note, 'Original note');
});
test('future formats and malformed results fail instead of silently discarding data', () => {
  assert.throws(() => backup.unpack({ ...backup.pack(project, inspection), version: 999 }), /versie/);
  assert.throws(() => backup.validateInspection({ checks: [] }), /Ongeldige/);
  assert.throws(() => backup.validateInspection({ checks: { a: { photos: [null] } } }), /Ongeldige/);
});
test('HTML import reads JSON without executing scripts, including escaped strings', () => {
  const original = { ...project, projectName: 'A "quoted" } title' };
  const html = '<script>const CFG=' + JSON.stringify(original) + ';globalThis.mustNotRun=true;</script>';
  assert.deepEqual(backup.projectFromHtml(html), original);
  assert.equal(globalThis.mustNotRun, undefined);
});
test('the shared factory can be embedded in an independent exported report', () => {
  const independent = vm.runInNewContext('(' + globalThis.InspectionBackupFactory.toString() + ')()');
  assert.equal(independent.pack(project, inspection).format, backup.FORMAT);
});
