export const LEADERBOARD_POINTS_CAPTURE = 3;
export const LEADERBOARD_POINTS_PHOTO = 1;
export const LEADERBOARD_POINTS_TRADE = 2;

function toNonNegativeInt(value) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return parsed;
}

export function computeLeaderboardPoints(stats) {
  const captures = toNonNegativeInt(stats && stats.captures);
  const photos = toNonNegativeInt(stats && stats.photos);
  const trades = toNonNegativeInt(stats && stats.trades);
  return (
    captures * LEADERBOARD_POINTS_CAPTURE +
    photos * LEADERBOARD_POINTS_PHOTO +
    trades * LEADERBOARD_POINTS_TRADE
  );
}

export function compareLeaderboardPlayers(a, b) {
  if (b.points !== a.points) {
    return b.points - a.points;
  }
  if (b.malidex_unique !== a.malidex_unique) {
    return b.malidex_unique - a.malidex_unique;
  }
  return b.captures - a.captures;
}
