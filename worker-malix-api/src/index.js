import { buildLeaderboardFromRows } from './leaderboard.js';
import { fetchLeaderboardRows } from './posthog-query.js';
import { isValidPlayerId } from './player-id.js';

const CACHE_TTL_SECONDS = 180;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const rateLimitBuckets = new Map();

const ALLOWED_ORIGINS = new Set([
  'https://festibask-impro.fr',
  'http://localhost:8000',
  'https://localhost:8000',
  'http://127.0.0.1:8000',
  'https://127.0.0.1:8000'
]);

function jsonResponse(body, status, extraHeaders) {
  const headers = new Headers(extraHeaders);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  return new Response(JSON.stringify(body), { status: status, headers: headers });
}

function corsHeaders(request) {
  const origin = request.headers.get('Origin');
  const headers = new Headers();
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Vary', 'Origin');
  }
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return headers;
}

function isRateLimited(ip) {
  const key = ip || 'unknown';
  const now = Date.now();
  let bucket = rateLimitBuckets.get(key);
  if (!bucket || now - bucket.start > RATE_LIMIT_WINDOW_MS) {
    bucket = { start: now, count: 0 };
  }
  bucket.count += 1;
  rateLimitBuckets.set(key, bucket);
  return bucket.count > RATE_LIMIT_MAX;
}

async function handleLeaderboard(request, env, ctx) {
  const url = new URL(request.url);
  const playerId = url.searchParams.get('player_id');
  if (!playerId) {
    return jsonResponse({ error: 'missing_player_id' }, 400, corsHeaders(request));
  }
  if (!isValidPlayerId(playerId)) {
    return jsonResponse({ error: 'invalid_player_id' }, 400, corsHeaders(request));
  }

  const ip = request.headers.get('CF-Connecting-IP') || '';
  if (isRateLimited(ip)) {
    return jsonResponse({ error: 'rate_limited' }, 429, corsHeaders(request));
  }

  const cache = caches.default;
  const cacheKey = new Request(url.toString(), { method: 'GET' });
  const cached = await cache.match(cacheKey);
  if (cached) {
    const headers = new Headers(cached.headers);
    const cors = corsHeaders(request);
    cors.forEach(function (value, key) {
      headers.set(key, value);
    });
    return new Response(cached.body, { status: cached.status, headers: headers });
  }

  if (!env.POSTHOG_PERSONAL_API_KEY) {
    return jsonResponse({ error: 'leaderboard_unavailable' }, 502, corsHeaders(request));
  }

  try {
    const rows = await fetchLeaderboardRows(env.POSTHOG_PERSONAL_API_KEY);
    const payload = buildLeaderboardFromRows(rows, playerId);
    const headers = corsHeaders(request);
    headers.set('Cache-Control', 'public, max-age=' + CACHE_TTL_SECONDS);
    const response = jsonResponse(payload, 200, headers);
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (error) {
    return jsonResponse({ error: 'leaderboard_unavailable' }, 502, corsHeaders(request));
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    if (request.method !== 'GET') {
      return jsonResponse({ error: 'method_not_allowed' }, 405, corsHeaders(request));
    }

    if (url.pathname === '/malix/api/leaderboard' || url.pathname.endsWith('/malix/api/leaderboard')) {
      return handleLeaderboard(request, env, ctx);
    }

    return jsonResponse({ error: 'not_found' }, 404, corsHeaders(request));
  }
};
