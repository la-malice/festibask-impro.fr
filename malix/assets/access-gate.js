(function (globalScope) {
  const DEFAULT_CONFIG = {
    festivalWindowStart: '2026-05-15T00:00:00+02:00',
    festivalWindowEnd: '2026-05-17T23:59:59+02:00',
    geoTarget: {
      lat: 43.501,
      lon: -1.513
    },
    geoRadiusMeters: 100,
    geoToleranceMeters: 20
  };

  function toFiniteNumber(value, fallback) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return numeric;
    return fallback;
  }

  function normalizeConfig(config) {
    const source = config && typeof config === 'object' ? config : {};
    const target = source.geoTarget && typeof source.geoTarget === 'object' ? source.geoTarget : {};
    return {
      festivalWindowStart:
        typeof source.festivalWindowStart === 'string'
          ? source.festivalWindowStart
          : DEFAULT_CONFIG.festivalWindowStart,
      festivalWindowEnd:
        typeof source.festivalWindowEnd === 'string'
          ? source.festivalWindowEnd
          : DEFAULT_CONFIG.festivalWindowEnd,
      geoTarget: {
        lat: toFiniteNumber(target.lat, DEFAULT_CONFIG.geoTarget.lat),
        lon: toFiniteNumber(target.lon, DEFAULT_CONFIG.geoTarget.lon)
      },
      geoRadiusMeters: toFiniteNumber(source.geoRadiusMeters, DEFAULT_CONFIG.geoRadiusMeters),
      geoToleranceMeters: toFiniteNumber(source.geoToleranceMeters, DEFAULT_CONFIG.geoToleranceMeters)
    };
  }

  function toRad(value) {
    return (value * Math.PI) / 180;
  }

  function distanceMeters(lat1, lon1, lat2, lon2) {
    const phi1 = toRad(lat1);
    const phi2 = toRad(lat2);
    const deltaPhi = toRad(lat2 - lat1);
    const deltaLambda = toRad(lon2 - lon1);
    const sinHalfPhi = Math.sin(deltaPhi / 2);
    const sinHalfLambda = Math.sin(deltaLambda / 2);
    const a =
      sinHalfPhi * sinHalfPhi +
      Math.cos(phi1) * Math.cos(phi2) * sinHalfLambda * sinHalfLambda;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const earthRadiusMeters = 6371000;
    return earthRadiusMeters * c;
  }

  function parseWindowBound(value) {
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) ? timestamp : NaN;
  }

  function isWithinFestivalWindow(nowInput, configInput) {
    const config = normalizeConfig(configInput);
    const startTs = parseWindowBound(config.festivalWindowStart);
    const endTs = parseWindowBound(config.festivalWindowEnd);
    if (!Number.isFinite(startTs) || !Number.isFinite(endTs)) {
      return false;
    }
    const nowTs = nowInput instanceof Date ? nowInput.getTime() : Number(nowInput);
    if (!Number.isFinite(nowTs)) {
      return false;
    }
    return nowTs >= startTs && nowTs <= endTs;
  }

  function isWithinAllowedZone(distance, configInput) {
    if (!Number.isFinite(distance)) return false;
    const config = normalizeConfig(configInput);
    const threshold = Math.max(0, config.geoRadiusMeters + config.geoToleranceMeters);
    return distance <= threshold;
  }

  function evaluateAccess(input) {
    const options = input && typeof input === 'object' ? input : {};
    const config = normalizeConfig(options.config);
    const now = options.now instanceof Date ? options.now.getTime() : Number(options.now || Date.now());
    const cheat = Boolean(options.cheat);

    if (cheat) {
      return {
        status: 'cheat_bypass',
        allowed: true,
        distanceMeters: null,
        thresholdMeters: Math.max(0, config.geoRadiusMeters + config.geoToleranceMeters)
      };
    }

    if (!isWithinFestivalWindow(now, config)) {
      return {
        status: 'blocked_time',
        allowed: false,
        distanceMeters: null,
        thresholdMeters: Math.max(0, config.geoRadiusMeters + config.geoToleranceMeters)
      };
    }

    if (options.geoAvailable === false) {
      return {
        status: 'blocked_unavailable',
        allowed: false,
        distanceMeters: null,
        thresholdMeters: Math.max(0, config.geoRadiusMeters + config.geoToleranceMeters)
      };
    }

    if (options.geoPermissionState === 'denied') {
      return {
        status: 'blocked_permission',
        allowed: false,
        distanceMeters: null,
        thresholdMeters: Math.max(0, config.geoRadiusMeters + config.geoToleranceMeters)
      };
    }

    const coords = options.coords;
    if (!coords || !Number.isFinite(Number(coords.latitude)) || !Number.isFinite(Number(coords.longitude))) {
      return {
        status: 'blocked_unavailable',
        allowed: false,
        distanceMeters: null,
        thresholdMeters: Math.max(0, config.geoRadiusMeters + config.geoToleranceMeters)
      };
    }

    const distance = distanceMeters(
      Number(coords.latitude),
      Number(coords.longitude),
      config.geoTarget.lat,
      config.geoTarget.lon
    );

    if (!isWithinAllowedZone(distance, config)) {
      return {
        status: 'blocked_geo',
        allowed: false,
        distanceMeters: distance,
        thresholdMeters: Math.max(0, config.geoRadiusMeters + config.geoToleranceMeters)
      };
    }

    return {
      status: 'allowed',
      allowed: true,
      distanceMeters: distance,
      thresholdMeters: Math.max(0, config.geoRadiusMeters + config.geoToleranceMeters)
    };
  }

  const api = {
    DEFAULT_CONFIG: normalizeConfig(DEFAULT_CONFIG),
    normalizeConfig: normalizeConfig,
    distanceMeters: distanceMeters,
    isWithinFestivalWindow: isWithinFestivalWindow,
    isWithinAllowedZone: isWithinAllowedZone,
    evaluateAccess: evaluateAccess
  };

  globalScope.MalixAccessGate = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
