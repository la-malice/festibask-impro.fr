import { formatDisplayCode } from './player-id.js';

const LEADERBOARD_HOGQL = `
SELECT
  properties.malix_player_id AS player_id,
  max(person.properties.malidex_unique) AS malidex,
  countIf(event = 'malix_capture') AS captures,
  countIf(event = 'malix_photo_saved') AS photos,
  countIf(event = 'malix_trade_completed') AS trades
FROM events
WHERE properties.malix_player_id IS NOT NULL
  AND event IN (
    'malix_capture',
    'malix_photo_saved',
    'malix_trade_completed',
    'malix_player_snapshot',
    'malix_game_start'
  )
  AND timestamp >= now() - INTERVAL 90 DAY
GROUP BY player_id
ORDER BY malidex DESC, captures DESC
LIMIT 500
`.trim();

export { LEADERBOARD_HOGQL };

function toCount(value) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return parsed;
}

function comparePlayers(a, b) {
  if (b.malidex_unique !== a.malidex_unique) {
    return b.malidex_unique - a.malidex_unique;
  }
  return b.captures - a.captures;
}

function mapRowToPlayer(row) {
  return {
    player_id: String(row[0] || ''),
    malidex_unique: toCount(row[1]),
    captures: toCount(row[2]),
    photos: toCount(row[3]),
    trades: toCount(row[4])
  };
}

export function buildLeaderboardFromRows(rows, playerId) {
  const players = (rows || [])
    .map(mapRowToPlayer)
    .filter(function (entry) {
      return entry.player_id;
    })
    .sort(comparePlayers);

  const totalPlayers = players.length;
  let rank = totalPlayers + 1;
  let playerStats = {
    malidex_unique: 0,
    captures: 0,
    photos: 0,
    trades: 0
  };

  for (let index = 0; index < players.length; index += 1) {
    if (players[index].player_id === playerId) {
      rank = index + 1;
      playerStats = players[index];
      break;
    }
  }

  const top = players.slice(0, 10).map(function (entry, index) {
    return {
      rank: index + 1,
      display_code: formatDisplayCode(entry.player_id),
      malidex_unique: entry.malidex_unique,
      captures: entry.captures,
      photos: entry.photos,
      trades: entry.trades
    };
  });

  return {
    updated_at: new Date().toISOString(),
    total_players: totalPlayers,
    player: {
      player_id: playerId,
      display_code: formatDisplayCode(playerId),
      rank: rank,
      malidex_unique: playerStats.malidex_unique,
      captures: playerStats.captures,
      photos: playerStats.photos,
      trades: playerStats.trades
    },
    top: top
  };
}
