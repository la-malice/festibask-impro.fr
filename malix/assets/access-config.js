(function (globalScope) {
  globalScope.MalixAccessConfig = {
    festivalWindowStart: '2026-05-15T00:00:00+02:00',
    festivalWindowEnd: '2026-05-17T23:59:59+02:00',
    geoTarget: {
      lat: 43.501,
      lon: -1.513
    },
    geoRadiusMeters: 100,
    geoToleranceMeters: 20
  };
})(typeof window !== 'undefined' ? window : globalThis);
