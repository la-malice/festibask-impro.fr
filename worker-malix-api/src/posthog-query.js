import { LEADERBOARD_HOGQL } from './leaderboard.js';

const POSTHOG_QUERY_URL = 'https://eu.posthog.com/api/projects/124663/query/';

const ROW_FIELDS = ['player_id', 'malidex', 'captures', 'photos', 'trades'];

export function normalizeHogqlResults(payload) {
  if (!payload || !Array.isArray(payload.results)) {
    throw new Error('posthog_query_invalid_shape');
  }

  const rows = payload.results;
  const columns = Array.isArray(payload.columns) ? payload.columns : null;
  if (!columns || columns.length === 0) {
    return rows;
  }

  const indices = ROW_FIELDS.map(function (field) {
    return columns.indexOf(field);
  });

  if (indices[0] < 0) {
    return rows;
  }

  return rows.map(function (row) {
    return ROW_FIELDS.map(function (field, index) {
      const columnIndex = indices[index];
      if (columnIndex < 0) return null;
      return row[columnIndex];
    });
  });
}

export async function fetchLeaderboardRows(apiKey) {
  const response = await fetch(POSTHOG_QUERY_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: {
        kind: 'HogQLQuery',
        query: LEADERBOARD_HOGQL
      }
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error('posthog_query_failed:' + response.status + ':' + detail.slice(0, 200));
  }

  const payload = await response.json();
  return normalizeHogqlResults(payload);
}
