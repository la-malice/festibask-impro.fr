/**
 * Points Hall of Fame Malix (navigateur + tests Node).
 * Source normative : shared/malix/leaderboard-scoring.js — garder en sync.
 */
(function (globalScope) {
  const LEADERBOARD_POINTS_CAPTURE = 3;
  const LEADERBOARD_POINTS_PHOTO = 1;
  const LEADERBOARD_POINTS_TRADE = 2;

  function toNonNegativeInt(value) {
    const parsed = Number.parseInt(String(value ?? ''), 10);
    if (!Number.isFinite(parsed) || parsed < 0) return 0;
    return parsed;
  }

  function computeLeaderboardPoints(stats) {
    const captures = toNonNegativeInt(stats && stats.captures);
    const photos = toNonNegativeInt(stats && stats.photos);
    const trades = toNonNegativeInt(stats && stats.trades);
    return (
      captures * LEADERBOARD_POINTS_CAPTURE +
      photos * LEADERBOARD_POINTS_PHOTO +
      trades * LEADERBOARD_POINTS_TRADE
    );
  }

  globalScope.MalixLeaderboardScoring = {
    LEADERBOARD_POINTS_CAPTURE: LEADERBOARD_POINTS_CAPTURE,
    LEADERBOARD_POINTS_PHOTO: LEADERBOARD_POINTS_PHOTO,
    LEADERBOARD_POINTS_TRADE: LEADERBOARD_POINTS_TRADE,
    computeLeaderboardPoints: computeLeaderboardPoints
  };
})(typeof window !== 'undefined' ? window : globalThis);
