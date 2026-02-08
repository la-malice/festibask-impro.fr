(function (globalScope) {
  const STORAGE_KEY = 'malix-collection';
  const COUNTS_KEY = 'malix-capture-counts';
  const MAX_TYPES = 26;
  const MAX_VARIANTS = 4;
  const MAX_ENTRIES = MAX_TYPES * MAX_VARIANTS;

  function makeId(type, variant) {
    return type + '-' + variant;
  }

  function parseId(entryId) {
    const parts = String(entryId).split('-');
    if (parts.length !== 2) return null;
    const type = Number.parseInt(parts[0], 10);
    const variant = Number.parseInt(parts[1], 10);
    if (!Number.isInteger(type) || !Number.isInteger(variant)) return null;
    if (type < 1 || type > MAX_TYPES || variant < 1 || variant > MAX_VARIANTS) return null;
    return { type: type, variant: variant };
  }

  function emptyState() {
    return new Set();
  }

  function addCapture(collection, type, variant) {
    const next = new Set(collection);
    if (type < 1 || type > MAX_TYPES || variant < 1 || variant > MAX_VARIANTS) {
      return next;
    }
    next.add(makeId(type, variant));
    return next;
  }

  function removeCapture(collection, type, variant) {
    const next = new Set(collection);
    if (type < 1 || type > MAX_TYPES || variant < 1 || variant > MAX_VARIANTS) {
      return next;
    }
    next.delete(makeId(type, variant));
    return next;
  }

  function isComplete(collection) {
    return collection.size >= MAX_ENTRIES;
  }

  function serialize(collection) {
    return JSON.stringify(Array.from(collection));
  }

  function deserialize(raw) {
    if (!raw) return emptyState();
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return emptyState();
      const cleaned = new Set();
      for (let index = 0; index < parsed.length; index += 1) {
        const entry = parseId(parsed[index]);
        if (!entry) continue;
        cleaned.add(makeId(entry.type, entry.variant));
      }
      return cleaned;
    } catch (error) {
      return emptyState();
    }
  }

  function loadCollection(storage) {
    try {
      return deserialize(storage.getItem(STORAGE_KEY));
    } catch (error) {
      return emptyState();
    }
  }

  function saveCollection(storage, collection) {
    try {
      storage.setItem(STORAGE_KEY, serialize(collection));
      return true;
    } catch (error) {
      return false;
    }
  }

  function clearCollection(storage) {
    try {
      storage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      return false;
    }
  }

  function emptyCounts() {
    return {};
  }

  function normalizeCounts(rawCounts) {
    if (!rawCounts || typeof rawCounts !== 'object') return emptyCounts();
    const cleaned = {};
    const entries = Object.entries(rawCounts);
    for (let index = 0; index < entries.length; index += 1) {
      const key = entries[index][0];
      const value = entries[index][1];
      const parsed = parseId(key);
      if (!parsed) continue;
      const numeric = Number.parseInt(String(value), 10);
      if (!Number.isInteger(numeric) || numeric < 1) continue;
      cleaned[makeId(parsed.type, parsed.variant)] = numeric;
    }
    return cleaned;
  }

  function incrementCount(counts, type, variant) {
    const entry = parseId(makeId(type, variant));
    if (!entry) return { ...counts };
    const id = makeId(entry.type, entry.variant);
    const next = { ...counts };
    next[id] = (next[id] || 0) + 1;
    return next;
  }

  function applyTrade(collection, counts, outgoing, incoming) {
    const outgoingEntry = parseId(outgoing);
    const incomingEntry = parseId(incoming);
    const nextCollection = new Set(collection);
    let nextCounts = normalizeCounts(counts);

    if (!outgoingEntry || !incomingEntry) {
      return {
        collection: nextCollection,
        counts: nextCounts,
        receivedWasNew: false
      };
    }

    const outgoingId = makeId(outgoingEntry.type, outgoingEntry.variant);
    const incomingId = makeId(incomingEntry.type, incomingEntry.variant);

    nextCollection.delete(outgoingId);
    const receivedWasNew = !nextCollection.has(incomingId);
    nextCollection.add(incomingId);
    nextCounts = incrementCount(nextCounts, incomingEntry.type, incomingEntry.variant);

    return {
      collection: nextCollection,
      counts: nextCounts,
      receivedWasNew: receivedWasNew
    };
  }

  function loadCounts(storage) {
    try {
      const raw = storage.getItem(COUNTS_KEY);
      if (!raw) return emptyCounts();
      return normalizeCounts(JSON.parse(raw));
    } catch (error) {
      return emptyCounts();
    }
  }

  function saveCounts(storage, counts) {
    try {
      storage.setItem(COUNTS_KEY, JSON.stringify(normalizeCounts(counts)));
      return true;
    } catch (error) {
      return false;
    }
  }

  function clearCounts(storage) {
    try {
      storage.removeItem(COUNTS_KEY);
      return true;
    } catch (error) {
      return false;
    }
  }

  const api = {
    STORAGE_KEY: STORAGE_KEY,
    COUNTS_KEY: COUNTS_KEY,
    MAX_TYPES: MAX_TYPES,
    MAX_VARIANTS: MAX_VARIANTS,
    MAX_ENTRIES: MAX_ENTRIES,
    makeId: makeId,
    parseId: parseId,
    emptyState: emptyState,
    addCapture: addCapture,
    removeCapture: removeCapture,
    isComplete: isComplete,
    serialize: serialize,
    deserialize: deserialize,
    loadCollection: loadCollection,
    saveCollection: saveCollection,
    clearCollection: clearCollection,
    emptyCounts: emptyCounts,
    normalizeCounts: normalizeCounts,
    incrementCount: incrementCount,
    applyTrade: applyTrade,
    loadCounts: loadCounts,
    saveCounts: saveCounts,
    clearCounts: clearCounts
  };

  globalScope.MalixCollection = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
