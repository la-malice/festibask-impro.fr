const test = require('node:test');
const assert = require('node:assert/strict');

const PLAYER_A = 'a3f91b2c-4d5e-4789-abcd-ef0123456789';
const PLAYER_B = '6319a00c-a34b-4609-8b69-f6325558f557';

const DISPLAY_NAME_RE =
  /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)* [\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)* \d{2}$/u;

let sharedModule;
let browserModule;

test.before(async function () {
  sharedModule = await import('../../shared/malix/format-display-code.js');
  browserModule = require('../../malix/assets/format-display-code.js');
  require('../../malix/assets/player-id.js');
});

test('formatDisplayCode is stable for the same UUID', function () {
  const first = sharedModule.formatDisplayCode(PLAYER_A);
  const second = sharedModule.formatDisplayCode(PLAYER_A);
  assert.equal(first, second);
  assert.equal(first, 'faucon pluvieux 56');
});

test('formatDisplayCode returns empty string for invalid id', function () {
  assert.equal(sharedModule.formatDisplayCode('not-a-uuid'), '');
  assert.equal(browserModule.formatDisplayCode(''), '');
});

test('formatDisplayCode matches expected shape', function () {
  const label = sharedModule.formatDisplayCode(PLAYER_B);
  assert.match(label, DISPLAY_NAME_RE);
  assert.equal(label, 'colibri courageux 72');
});

test('shared and browser format-display-code modules stay in sync', function () {
  const ids = [PLAYER_A, PLAYER_B, '402873aa-6569-42eb-98c3-de41f268863a'];
  for (let index = 0; index < ids.length; index += 1) {
    const id = ids[index];
    assert.equal(
      sharedModule.formatDisplayCode(id),
      browserModule.formatDisplayCode(id),
      'mismatch for ' + id
    );
  }
});

test('malix player-id delegates to format-display-code', function () {
  const playerId = require('../../malix/assets/player-id.js');
  assert.equal(playerId.formatDisplayCode(PLAYER_A), 'faucon pluvieux 56');
});

test('getDisplayCodeBase strips numeric suffix', function () {
  assert.equal(sharedModule.getDisplayCodeBase('faucon pluvieux 56'), 'faucon pluvieux');
  assert.equal(browserModule.getDisplayCodeBase('faucon pluvieux 56'), 'faucon pluvieux');
  assert.equal(sharedModule.getDisplayCodeBase(''), '');
});

test('buildLeaderboardDisplayLabels hides suffix without collision', function () {
  const resolve = sharedModule.buildLeaderboardDisplayLabels(['colibri courageux 72']);
  assert.equal(resolve('colibri courageux 72'), 'colibri courageux');
});

test('buildLeaderboardDisplayLabels shows suffix on collision', function () {
  const codes = ['colibri courageux 42', 'colibri courageux 72'];
  const resolveShared = sharedModule.buildLeaderboardDisplayLabels(codes);
  const resolveBrowser = browserModule.buildLeaderboardDisplayLabels(codes);
  assert.equal(resolveShared('colibri courageux 42'), 'colibri courageux 42');
  assert.equal(resolveShared('colibri courageux 72'), 'colibri courageux 72');
  assert.equal(resolveBrowser('colibri courageux 42'), 'colibri courageux 42');
});

test('buildLeaderboardDisplayLabels keeps distinct bases short', function () {
  const codes = ['faucon pluvieux 56', 'colibri courageux 72'];
  const resolve = sharedModule.buildLeaderboardDisplayLabels(codes);
  assert.equal(resolve('faucon pluvieux 56'), 'faucon pluvieux');
  assert.equal(resolve('colibri courageux 72'), 'colibri courageux');
});

test('buildLeaderboardDisplayLabels ignores duplicate same player in list', function () {
  const codes = ['colibri courageux 72', 'colibri courageux 72', 'tournesol pluvieux 10'];
  const resolve = sharedModule.buildLeaderboardDisplayLabels(codes);
  assert.equal(resolve('colibri courageux 72'), 'colibri courageux');
  assert.equal(resolve('tournesol pluvieux 10'), 'tournesol pluvieux');
});
