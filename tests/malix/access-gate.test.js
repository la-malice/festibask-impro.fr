const test = require('node:test');
const assert = require('node:assert/strict');
const accessGate = require('../../malix/assets/access-gate.js');

const BASE_CONFIG = accessGate.normalizeConfig({
  festivalWindowStart: '2026-05-15T00:00:00+02:00',
  festivalWindowEnd: '2026-05-17T23:59:59+02:00',
  geoTarget: {
    lat: 43.501,
    lon: -1.513
  },
  geoRadiusMeters: 100,
  geoToleranceMeters: 20
});

test('distanceMeters returns 0 for identical coordinates and large value for far points', function () {
  const same = accessGate.distanceMeters(43.501, -1.513, 43.501, -1.513);
  const far = accessGate.distanceMeters(43.501, -1.513, 43.511, -1.513);

  assert.ok(same < 0.001);
  assert.ok(far > 1000);
});

test('isWithinFestivalWindow works before, during and after configured dates', function () {
  const before = Date.parse('2026-05-14T23:59:59+02:00');
  const during = Date.parse('2026-05-16T12:00:00+02:00');
  const after = Date.parse('2026-05-18T00:00:00+02:00');

  assert.equal(accessGate.isWithinFestivalWindow(before, BASE_CONFIG), false);
  assert.equal(accessGate.isWithinFestivalWindow(during, BASE_CONFIG), true);
  assert.equal(accessGate.isWithinFestivalWindow(after, BASE_CONFIG), false);
});

test('isWithinAllowedZone enforces 120m threshold (100m + 20m tolerance)', function () {
  assert.equal(accessGate.isWithinAllowedZone(119, BASE_CONFIG), true);
  assert.equal(accessGate.isWithinAllowedZone(121, BASE_CONFIG), false);
});

test('evaluateAccess allows cheat bypass even outside time window and zone', function () {
  const decision = accessGate.evaluateAccess({
    cheat: true,
    now: Date.parse('2026-05-20T12:00:00+02:00'),
    config: BASE_CONFIG,
    geoAvailable: false
  });

  assert.equal(decision.allowed, true);
  assert.equal(decision.status, 'cheat_bypass');
});

test('evaluateAccess blocks outside area and returns measured distance', function () {
  const latOffset = 150 / 111320;
  const decision = accessGate.evaluateAccess({
    cheat: false,
    now: Date.parse('2026-05-16T12:00:00+02:00'),
    config: BASE_CONFIG,
    geoAvailable: true,
    coords: {
      latitude: 43.501 + latOffset,
      longitude: -1.513
    }
  });

  assert.equal(decision.allowed, false);
  assert.equal(decision.status, 'blocked_geo');
  assert.ok(decision.distanceMeters > 120);
});
