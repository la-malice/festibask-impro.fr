const test = require('node:test');
const assert = require('node:assert/strict');

const PLAYER_A = 'a3f91b2c-4d5e-4789-abcd-ef0123456789';
const PLAYER_B = '6319a00c-a34b-4609-8b69-f6325558f557';

const FIXTURE_PAYLOAD = {
  updated_at: '2026-05-16T12:00:00.000Z',
  total_players: 3,
  player: {
    player_id: PLAYER_A,
    display_code: 'A3F91B2C',
    rank: 2,
    malidex_unique: 10,
    captures: 12,
    photos: 1,
    trades: 0
  },
  top: [
    {
      rank: 1,
      display_code: 'F4E2B891',
      malidex_unique: 20,
      captures: 25,
      photos: 0,
      trades: 0
    }
  ]
};

function makeSessionStorage() {
  const map = new Map();
  return {
    getItem: function (key) {
      return map.has(key) ? map.get(key) : null;
    },
    setItem: function (key, value) {
      map.set(key, value);
    },
    removeItem: function (key) {
      map.delete(key);
    }
  };
}

let leaderboard;
let originalFetch;
let originalSessionStorage;
let fetchCallCount;

test.before(function () {
  originalFetch = globalThis.fetch;
  originalSessionStorage = globalThis.sessionStorage;
  delete require.cache[require.resolve('../../malix/assets/leaderboard-client.js')];
  leaderboard = require('../../malix/assets/leaderboard-client.js');
});

test.beforeEach(function () {
  fetchCallCount = 0;
  globalThis.sessionStorage = makeSessionStorage();
  globalThis.fetch = function () {
    fetchCallCount += 1;
    return Promise.resolve({
      ok: true,
      json: function () {
        return Promise.resolve(FIXTURE_PAYLOAD);
      }
    });
  };
});

test.after(function () {
  globalThis.fetch = originalFetch;
  globalThis.sessionStorage = originalSessionStorage;
});

test('buildUrl encodes player_id on leaderboard path', function () {
  const url = leaderboard.buildUrl(PLAYER_A);
  assert.equal(url.startsWith('/malix/api/leaderboard?player_id='), true);
  assert.equal(url, '/malix/api/leaderboard?player_id=' + encodeURIComponent(PLAYER_A));
});

test('fetchLeaderboard rejects invalid player_id before fetch', async function () {
  await assert.rejects(
    function () {
      return leaderboard.fetchLeaderboard('not-a-uuid');
    },
    function (error) {
      assert.equal(error.code, 'invalid_player_id');
      return true;
    }
  );
  assert.equal(fetchCallCount, 0);
});

test('fetchLeaderboard uses session cache on second call', async function () {
  const first = await leaderboard.fetchLeaderboard(PLAYER_A);
  const second = await leaderboard.fetchLeaderboard(PLAYER_A);

  assert.equal(fetchCallCount, 1);
  assert.deepEqual(second, first);
  assert.equal(second.total_players, 3);
});

test('fetchLeaderboard refetches when cache TTL expired', async function () {
  await leaderboard.fetchLeaderboard(PLAYER_A);
  assert.equal(fetchCallCount, 1);

  const entry = JSON.parse(globalThis.sessionStorage.getItem(leaderboard.CACHE_KEY));
  entry.fetched_at = Date.now() - leaderboard.CACHE_TTL_MS - 1;
  globalThis.sessionStorage.setItem(leaderboard.CACHE_KEY, JSON.stringify(entry));

  await leaderboard.fetchLeaderboard(PLAYER_A);
  assert.equal(fetchCallCount, 2);
});

test('fetchLeaderboard ignores cache when player_id changes', async function () {
  await leaderboard.fetchLeaderboard(PLAYER_A);
  assert.equal(fetchCallCount, 1);

  await leaderboard.fetchLeaderboard(PLAYER_B);
  assert.equal(fetchCallCount, 2);
});

test('fetchLeaderboard bypasses cache with forceRefresh', async function () {
  await leaderboard.fetchLeaderboard(PLAYER_A);
  await leaderboard.fetchLeaderboard(PLAYER_A, { forceRefresh: true });
  assert.equal(fetchCallCount, 2);
});

test('fetchLeaderboard surfaces API error code from JSON body', async function () {
  globalThis.fetch = function () {
    fetchCallCount += 1;
    return Promise.resolve({
      ok: false,
      status: 502,
      json: function () {
        return Promise.resolve({ error: 'leaderboard_unavailable' });
      }
    });
  };

  await assert.rejects(
    function () {
      return leaderboard.fetchLeaderboard(PLAYER_A);
    },
    function (error) {
      assert.equal(error.code, 'leaderboard_unavailable');
      return true;
    }
  );
});
