const test = require('node:test');
const assert = require('node:assert/strict');

let computeLeaderboardPoints;
let compareLeaderboardPlayers;
let LEADERBOARD_POINTS_CAPTURE;
let LEADERBOARD_POINTS_PHOTO;
let LEADERBOARD_POINTS_TRADE;

test.before(async function () {
  const scoring = await import('../../shared/malix/leaderboard-scoring.js');
  computeLeaderboardPoints = scoring.computeLeaderboardPoints;
  compareLeaderboardPlayers = scoring.compareLeaderboardPlayers;
  LEADERBOARD_POINTS_CAPTURE = scoring.LEADERBOARD_POINTS_CAPTURE;
  LEADERBOARD_POINTS_PHOTO = scoring.LEADERBOARD_POINTS_PHOTO;
  LEADERBOARD_POINTS_TRADE = scoring.LEADERBOARD_POINTS_TRADE;
});

test('leaderboard scoring weights are 3 / 1 / 2', function () {
  assert.equal(LEADERBOARD_POINTS_CAPTURE, 3);
  assert.equal(LEADERBOARD_POINTS_PHOTO, 1);
  assert.equal(LEADERBOARD_POINTS_TRADE, 2);
});

test('computeLeaderboardPoints applies weighted formula', function () {
  assert.equal(
    computeLeaderboardPoints({ captures: 10, photos: 5, trades: 2 }),
    10 * 3 + 5 * 1 + 2 * 2
  );
});

test('computeLeaderboardPoints treats invalid values as zero', function () {
  assert.equal(computeLeaderboardPoints({ captures: -1, photos: 'x', trades: null }), 0);
  assert.equal(computeLeaderboardPoints(null), 0);
});

test('compareLeaderboardPlayers sorts by points first', function () {
  const highPoints = {
    points: 50,
    malidex_unique: 5,
    captures: 10
  };
  const lowPoints = {
    points: 20,
    malidex_unique: 40,
    captures: 100
  };
  assert.ok(compareLeaderboardPlayers(highPoints, lowPoints) < 0);
  assert.ok(compareLeaderboardPlayers(lowPoints, highPoints) > 0);
});

test('browser leaderboard-scoring matches shared module', async function () {
  require('../../malix/assets/leaderboard-scoring.js');
  const browser = globalThis.MalixLeaderboardScoring;
  const shared = await import('../../shared/malix/leaderboard-scoring.js');
  assert.equal(browser.LEADERBOARD_POINTS_CAPTURE, shared.LEADERBOARD_POINTS_CAPTURE);
  assert.equal(
    browser.computeLeaderboardPoints({ captures: 4, photos: 2, trades: 1 }),
    shared.computeLeaderboardPoints({ captures: 4, photos: 2, trades: 1 })
  );
});

test('compareLeaderboardPlayers breaks ties on malidex then captures', function () {
  const betterMalidex = { points: 30, malidex_unique: 20, captures: 5 };
  const worseMalidex = { points: 30, malidex_unique: 10, captures: 99 };
  assert.ok(compareLeaderboardPlayers(betterMalidex, worseMalidex) < 0);

  const moreCaptures = { points: 30, malidex_unique: 10, captures: 8 };
  const fewerCaptures = { points: 30, malidex_unique: 10, captures: 2 };
  assert.ok(compareLeaderboardPlayers(moreCaptures, fewerCaptures) < 0);
});
