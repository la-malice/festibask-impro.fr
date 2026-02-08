const test = require('node:test');
const assert = require('node:assert/strict');
const collection = require('../../malix/assets/collection-state.js');

test('addCapture stores each type/variant only once', function () {
  let state = collection.emptyState();
  state = collection.addCapture(state, 1, 2);
  state = collection.addCapture(state, 1, 2);
  assert.equal(state.size, 1);
  assert.equal(state.has('1-2'), true);
});

test('isComplete is true only with all 104 entries', function () {
  let state = collection.emptyState();
  for (let type = 1; type <= collection.MAX_TYPES; type += 1) {
    for (let variant = 1; variant <= collection.MAX_VARIANTS; variant += 1) {
      state = collection.addCapture(state, type, variant);
    }
  }
  assert.equal(state.size, collection.MAX_ENTRIES);
  assert.equal(collection.isComplete(state), true);
});

test('serialize and deserialize preserve saved state', function () {
  let state = collection.emptyState();
  state = collection.addCapture(state, 3, 4);
  state = collection.addCapture(state, 2, 1);

  const raw = collection.serialize(state);
  const restored = collection.deserialize(raw);

  assert.equal(restored.size, 2);
  assert.equal(restored.has('3-4'), true);
  assert.equal(restored.has('2-1'), true);
});

test('incrementCount tracks duplicates for the same entry', function () {
  let counts = collection.emptyCounts();
  counts = collection.incrementCount(counts, 5, 3);
  counts = collection.incrementCount(counts, 5, 3);
  counts = collection.incrementCount(counts, 5, 3);
  assert.equal(counts['5-3'], 3);
});

test('normalizeCounts keeps only valid ids and positive numbers', function () {
  const normalized = collection.normalizeCounts({
    '1-1': 2,
    '99-1': 7,
    bad: 3,
    '2-2': 0,
    '3-4': '4'
  });
  assert.equal(normalized['1-1'], 2);
  assert.equal(normalized['3-4'], 4);
  assert.equal(Object.prototype.hasOwnProperty.call(normalized, '99-1'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(normalized, 'bad'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(normalized, '2-2'), false);
});

test('removeCapture removes only valid existing entries', function () {
  let state = collection.emptyState();
  state = collection.addCapture(state, 4, 2);
  state = collection.removeCapture(state, 4, 2);
  assert.equal(state.has('4-2'), false);
  const unchanged = collection.removeCapture(state, 99, 1);
  assert.deepEqual(Array.from(unchanged), Array.from(state));
});

test('applyTrade transfers local entry and adds received entry', function () {
  let state = collection.emptyState();
  state = collection.addCapture(state, 1, 1);
  let counts = collection.emptyCounts();
  counts = collection.incrementCount(counts, 1, 1);
  const result = collection.applyTrade(state, counts, '1-1', '2-3');
  assert.equal(result.collection.has('1-1'), false);
  assert.equal(result.collection.has('2-3'), true);
  assert.equal(result.counts['2-3'], 1);
  assert.equal(result.receivedWasNew, true);
});

test('applyTrade keeps collection size when received entry already exists and increments count', function () {
  let state = collection.emptyState();
  state = collection.addCapture(state, 1, 1);
  state = collection.addCapture(state, 2, 3);
  let counts = collection.emptyCounts();
  counts = collection.incrementCount(counts, 2, 3);
  const result = collection.applyTrade(state, counts, '1-1', '2-3');
  assert.equal(result.collection.has('1-1'), false);
  assert.equal(result.collection.has('2-3'), true);
  assert.equal(result.collection.size, 1);
  assert.equal(result.counts['2-3'], 2);
  assert.equal(result.receivedWasNew, false);
});
