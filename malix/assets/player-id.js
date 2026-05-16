(function (globalScope) {
  const STORAGE_KEY = 'malix-player-id';
  const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  function isValidPlayerId(id) {
    return typeof id === 'string' && UUID_RE.test(id);
  }

  function createRandomId() {
    if (globalScope.crypto && typeof globalScope.crypto.randomUUID === 'function') {
      return globalScope.crypto.randomUUID();
    }
    const bytes = new Uint8Array(16);
    if (globalScope.crypto && typeof globalScope.crypto.getRandomValues === 'function') {
      globalScope.crypto.getRandomValues(bytes);
    } else {
      for (let index = 0; index < bytes.length; index += 1) {
        bytes[index] = Math.floor(Math.random() * 256);
      }
    }
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, function (byte) {
      return byte.toString(16).padStart(2, '0');
    }).join('');
    return (
      hex.slice(0, 8) +
      '-' +
      hex.slice(8, 12) +
      '-' +
      hex.slice(12, 16) +
      '-' +
      hex.slice(16, 20) +
      '-' +
      hex.slice(20)
    );
  }

  function formatDisplayCode(id) {
    if (!isValidPlayerId(id)) return '';
    return id.replace(/-/g, '').slice(0, 8).toUpperCase();
  }

  function getOrCreatePlayerId(storage) {
    try {
      const existing = storage.getItem(STORAGE_KEY);
      if (isValidPlayerId(existing)) {
        return existing;
      }
      const created = createRandomId();
      storage.setItem(STORAGE_KEY, created);
      return created;
    } catch (error) {
      return createRandomId();
    }
  }

  const api = {
    STORAGE_KEY: STORAGE_KEY,
    isValidPlayerId: isValidPlayerId,
    formatDisplayCode: formatDisplayCode,
    getOrCreatePlayerId: getOrCreatePlayerId
  };

  globalScope.MalixPlayerId = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
