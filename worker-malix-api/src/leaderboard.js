import { formatDisplayCode } from './player-id.js';
import {
  compareLeaderboardPlayers,
  computeLeaderboardPoints
} from '../../shared/malix/leaderboard-scoring.js';

const LEADERBOARD_HOGQL = `
SELECT
  properties.malix_player_id AS player_id,
  max(person.properties.malidex_unique) AS malidex,
  greatest(
    countIf(event = 'malix_capture'),
    max(toInt(person.properties.malix_captures_total))
  ) AS captures,
  greatest(
    countIf(event = 'malix_photo_saved'),
    max(toInt(person.properties.malix_photos_total))
  ) AS photos,
  greatest(
    countIf(event = 'malix_trade_completed'),
    max(toInt(person.properties.malix_trades_total))
  ) AS trades
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
ORDER BY
  (
    greatest(countIf(event = 'malix_capture'), max(toInt(person.properties.malix_captures_total))) * 3
    + greatest(countIf(event = 'malix_photo_saved'), max(toInt(person.properties.malix_photos_total)))
    + greatest(countIf(event = 'malix_trade_completed'), max(toInt(person.properties.malix_trades_total))) * 2
  ) DESC,
  malidex DESC,
  captures DESC
LIMIT 500
`.trim();

export { LEADERBOARD_HOGQL };

function toCount(value) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return parsed;
}

function mapRowToPlayer(row) {
  const player = {
    player_id: String(row[0] || ''),
    malidex_unique: toCount(row[1]),
    captures: toCount(row[2]),
    photos: toCount(row[3]),
    trades: toCount(row[4])
  };
  player.points = computeLeaderboardPoints(player);
  return player;
}

export function buildLeaderboardFromRows(rows, playerId) {
  const players = (rows || [])
    .map(mapRowToPlayer)
    .filter(function (entry) {
      return entry.player_id;
    })
    .sort(compareLeaderboardPlayers);

  const totalPlayers = players.length;
  let rank = totalPlayers + 1;
  let playerStats = {
    malidex_unique: 0,
    captures: 0,
    photos: 0,
    trades: 0,
    points: 0
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
      points: entry.points,
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
      points: playerStats.points,
      malidex_unique: playerStats.malidex_unique,
      captures: playerStats.captures,
      photos: playerStats.photos,
      trades: playerStats.trades
    },
    top: top
  };
}
