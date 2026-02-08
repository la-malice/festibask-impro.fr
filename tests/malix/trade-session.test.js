const test = require('node:test');
const assert = require('node:assert/strict');
const trade = require('../../malix/assets/trade-session.js');

test('createOffer and receiveOffer move protocol to offer_pending', function () {
  const protocol = trade.createProtocol();
  protocol.setConnected();
  assert.equal(protocol.createOffer('1-2'), true);
  assert.equal(protocol.receiveOffer('3-4'), true);
  assert.equal(protocol.getState(), trade.STATES.OFFER_PENDING);
});

test('commit requires double accept', function () {
  const protocol = trade.createProtocol();
  protocol.setConnected();
  protocol.createOffer('1-2');
  protocol.receiveOffer('3-4');
  assert.equal(protocol.canCommit(), false);
  protocol.acceptOffer();
  assert.equal(protocol.canCommit(), false);
  protocol.receiveAccept();
  assert.equal(protocol.canCommit(), true);
  assert.equal(protocol.markCommitted(), true);
  assert.equal(protocol.getState(), trade.STATES.COMMITTED);
});

test('cancelOffer sets cancelled state', function () {
  const protocol = trade.createProtocol();
  protocol.createOffer('2-2');
  protocol.cancelOffer();
  assert.equal(protocol.getState(), trade.STATES.CANCELLED);
});
