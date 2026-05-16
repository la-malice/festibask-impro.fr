import { LEADERBOARD_HOGQL } from './leaderboard.js';

const POSTHOG_QUERY_URL = 'https://eu.posthog.com/api/projects/124663/query/';

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
  if (!payload || !Array.isArray(payload.results)) {
    throw new Error('posthog_query_invalid_shape');
  }

  return payload.results;
}
