const test = require('node:test');
const assert = require('node:assert/strict');
const playerId = require('../../malix/assets/player-id.js');

function makeMemoryStorage() {
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

test('getOrCreatePlayerId creates a valid UUID and persists it', function () {
  const storage = makeMemoryStorage();
  const first = playerId.getOrCreatePlayerId(storage);
  const second = playerId.getOrCreatePlayerId(storage);

  assert.equal(playerId.isValidPlayerId(first), true);
  assert.equal(first, second);
});

test('formatDisplayCode returns 8 uppercase hex chars from UUID', function () {
  const id = 'a3f91b2c-4d5e-4789-abcd-ef0123456789';
  assert.equal(playerId.formatDisplayCode(id), 'A3F91B2C');
});

test('isValidPlayerId rejects malformed values', function () {
  assert.equal(playerId.isValidPlayerId('not-a-uuid'), false);
  assert.equal(playerId.isValidPlayerId(''), false);
});
