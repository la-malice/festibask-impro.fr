const test = require('node:test');
const assert = require('node:assert/strict');

let buildLeaderboardFromRows;
let formatDisplayCode;

test.before(async function () {
  const leaderboard = await import('../../worker-malix-api/src/leaderboard.js');
  const playerId = await import('../../worker-malix-api/src/player-id.js');
  buildLeaderboardFromRows = leaderboard.buildLeaderboardFromRows;
  formatDisplayCode = playerId.formatDisplayCode;
});

const PLAYER_A = 'a3f91b2c-4d5e-4789-abcd-ef0123456789';
const PLAYER_B = '6319a00c-a34b-4609-8b69-f6325558f557';
const PLAYER_C = '402873aa-6569-42eb-98c3-de41f268863a';

function makeRows(entries) {
  return entries.map(function (entry) {
    return [
      entry.player_id,
      entry.malidex,
      entry.captures,
      entry.photos,
      entry.trades
    ];
  });
}

test('buildLeaderboardFromRows limits top to 10 players', function () {
  const entries = [];
  for (let index = 0; index < 15; index += 1) {
    const hex = index.toString(16).padStart(12, '0');
    entries.push({
      player_id: '00000000-0000-4000-8000-' + hex,
      malidex: 100 - index,
      captures: 0,
      photos: 0,
      trades: 0
    });
  }
  const result = buildLeaderboardFromRows(makeRows(entries), PLAYER_A);
  assert.equal(result.total_players, 15);
  assert.equal(result.top.length, 10);
  assert.equal(result.top[0].rank, 1);
  assert.equal(result.top[9].rank, 10);
  assert.equal('player_id' in result.top[0], false);
});

test('buildLeaderboardFromRows ranks player in top with correct display_code', function () {
  const rows = makeRows([
    { player_id: PLAYER_B, malidex: 9, captures: 5, photos: 1, trades: 0 },
    { player_id: PLAYER_C, malidex: 6, captures: 2, photos: 0, trades: 0 },
    { player_id: PLAYER_A, malidex: 3, captures: 1, photos: 0, trades: 0 }
  ]);
  const result = buildLeaderboardFromRows(rows, PLAYER_B);
  assert.equal(result.player.rank, 1);
  assert.equal(result.player.display_code, formatDisplayCode(PLAYER_B));
  assert.equal(result.top[0].display_code, formatDisplayCode(PLAYER_B));
  assert.equal(result.player.malidex_unique, 9);
});

test('buildLeaderboardFromRows ranks player outside top 10', function () {
  const entries = [];
  for (let index = 0; index < 12; index += 1) {
    const hex = index.toString(16).padStart(12, '0');
    entries.push({
      player_id: '00000000-0000-4000-8000-' + hex,
      malidex: 50 - index,
      captures: 0,
      photos: 0,
      trades: 0
    });
  }
  entries.push({
    player_id: PLAYER_A,
    malidex: 1,
    captures: 0,
    photos: 0,
    trades: 0
  });
  const result = buildLeaderboardFromRows(makeRows(entries), PLAYER_A);
  assert.equal(result.total_players, 13);
  assert.equal(result.player.rank, 13);
  assert.equal(result.top.length, 10);
});

test('buildLeaderboardFromRows assigns last rank when player is unknown', function () {
  const rows = makeRows([
    { player_id: PLAYER_B, malidex: 9, captures: 0, photos: 0, trades: 0 },
    { player_id: PLAYER_C, malidex: 6, captures: 0, photos: 0, trades: 0 }
  ]);
  const unknown = 'e6e12a53-19bf-498c-9fb7-0d1847d16ef7';
  const result = buildLeaderboardFromRows(rows, unknown);
  assert.equal(result.total_players, 2);
  assert.equal(result.player.rank, 3);
  assert.equal(result.player.malidex_unique, 0);
  assert.equal(result.player.captures, 0);
});

test('buildLeaderboardFromRows breaks ties on captures', function () {
  const rows = makeRows([
    { player_id: PLAYER_C, malidex: 10, captures: 1, photos: 0, trades: 0 },
    { player_id: PLAYER_B, malidex: 10, captures: 5, photos: 0, trades: 0 }
  ]);
  const result = buildLeaderboardFromRows(rows, PLAYER_B);
  assert.equal(result.top[0].display_code, formatDisplayCode(PLAYER_B));
  assert.equal(result.top[1].display_code, formatDisplayCode(PLAYER_C));
});

test('formatDisplayCode matches malix player-id convention', function () {
  assert.equal(formatDisplayCode(PLAYER_A), 'A3F91B2C');
});
