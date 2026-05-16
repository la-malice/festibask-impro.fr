(function (globalScope) {
  const LEADERBOARD_PATH = '/malix/api/leaderboard';
  const CACHE_KEY = 'malix-leaderboard-cache-v1';
  const CACHE_TTL_MS = 60_000;
  const FETCH_TIMEOUT_MS = 8_000;

  const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  function leaderboardError(code, message) {
    const err = new Error(message || code);
    err.code = code;
    return err;
  }

  function isValidPlayerId(id) {
    if (globalScope.MalixPlayerId && typeof globalScope.MalixPlayerId.isValidPlayerId === 'function') {
      return globalScope.MalixPlayerId.isValidPlayerId(id);
    }
    return typeof id === 'string' && UUID_RE.test(id);
  }

  function buildUrl(playerId) {
    return LEADERBOARD_PATH + '?player_id=' + encodeURIComponent(playerId);
  }

  function getSessionStorage() {
    try {
      return globalScope.sessionStorage;
    } catch (error) {
      return null;
    }
  }

  function readCache(playerId) {
    const storage = getSessionStorage();
    if (!storage) return null;
    try {
      const raw = storage.getItem(CACHE_KEY);
      if (!raw) return null;
      const entry = JSON.parse(raw);
      if (!entry || entry.player_id !== playerId) return null;
      if (typeof entry.fetched_at !== 'number' || !entry.data) return null;
      if (Date.now() - entry.fetched_at >= CACHE_TTL_MS) return null;
      return entry.data;
    } catch (error) {
      return null;
    }
  }

  function writeCache(playerId, data) {
    const storage = getSessionStorage();
    if (!storage) return;
    try {
      storage.setItem(
        CACHE_KEY,
        JSON.stringify({
          player_id: playerId,
          fetched_at: Date.now(),
          data: data
        })
      );
    } catch (error) {
      /* sessionStorage unavailable */
    }
  }

  function fetchWithTimeout(url) {
    const fetchFn = globalScope.fetch;
    if (typeof fetchFn !== 'function') {
      return Promise.reject(leaderboardError('network_error', 'fetch unavailable'));
    }
    if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
      return fetchFn(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    }
    const controller = new AbortController();
    const timer = setTimeout(function () {
      controller.abort();
    }, FETCH_TIMEOUT_MS);
    return fetchFn(url, { signal: controller.signal }).finally(function () {
      clearTimeout(timer);
    });
  }

  async function parseErrorResponse(response) {
    try {
      const body = await response.json();
      if (body && typeof body.error === 'string') {
        return leaderboardError(body.error, body.error);
      }
    } catch (error) {
      /* ignore */
    }
    return leaderboardError('leaderboard_unavailable', 'leaderboard_unavailable');
  }

  async function fetchLeaderboard(playerId, options) {
    const opts = options || {};
    if (!isValidPlayerId(playerId)) {
      throw leaderboardError('invalid_player_id', 'invalid_player_id');
    }
    if (!opts.forceRefresh) {
      const cached = readCache(playerId);
      if (cached) return cached;
    }
    let response;
    try {
      response = await fetchWithTimeout(buildUrl(playerId));
    } catch (error) {
      if (error && error.code) throw error;
      if (error && error.name === 'AbortError') {
        throw leaderboardError('timeout', 'timeout');
      }
      throw leaderboardError('network_error', 'network_error');
    }
    if (!response.ok) {
      throw await parseErrorResponse(response);
    }
    const data = await response.json();
    writeCache(playerId, data);
    return data;
  }

  const api = {
    LEADERBOARD_PATH: LEADERBOARD_PATH,
    CACHE_KEY: CACHE_KEY,
    CACHE_TTL_MS: CACHE_TTL_MS,
    buildUrl: buildUrl,
    readCache: readCache,
    writeCache: writeCache,
    fetchLeaderboard: fetchLeaderboard
  };

  globalScope.MalixLeaderboard = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
