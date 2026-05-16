const test = require('node:test');
const assert = require('node:assert/strict');

let normalizeHogqlResults;

test.before(async function () {
  const module = await import('../../worker-malix-api/src/posthog-query.js');
  normalizeHogqlResults = module.normalizeHogqlResults;
});

test('normalizeHogqlResults maps rows by columns when order differs', function () {
  const payload = {
    columns: ['captures', 'malidex', 'photos', 'player_id', 'trades'],
    results: [[7, 14, 1, '6319a00c-a34b-4609-8b69-f6325558f557', 0]]
  };
  const rows = normalizeHogqlResults(payload);
  assert.deepEqual(rows, [['6319a00c-a34b-4609-8b69-f6325558f557', 14, 7, 1, 0]]);
});

test('normalizeHogqlResults passes through select-order rows without columns', function () {
  const payload = {
    results: [['player-a', 3, 2, 1, 0]]
  };
  const rows = normalizeHogqlResults(payload);
  assert.deepEqual(rows, payload.results);
});
