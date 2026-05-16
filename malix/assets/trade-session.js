(function (globalScope) {
  const STATES = {
    IDLE: 'idle',
    PAIRING: 'pairing',
    CONNECTED: 'connected',
    OFFER_PENDING: 'offer_pending',
    ACCEPTED_BY_ME: 'accepted_by_me',
    ACCEPTED_BY_PEER: 'accepted_by_peer',
    COMMITTED: 'committed',
    CANCELLED: 'cancelled',
    FAILED: 'failed'
  };

  function parseEntryId(entryId) {
    const parts = String(entryId || '').split('-');
    if (parts.length !== 2) return null;
    const type = Number.parseInt(parts[0], 10);
    const variant = Number.parseInt(parts[1], 10);
    if (!Number.isInteger(type) || !Number.isInteger(variant)) return null;
    if (type < 1 || type > 27 || variant < 1 || variant > 4) return null;
    return { type: type, variant: variant, id: type + '-' + variant };
  }

  function createProtocol() {
    let state = STATES.IDLE;
    let localOfferId = null;
    let peerOfferId = null;
    let localAccepted = false;
    let peerAccepted = false;
    let committed = false;

    function computeState() {
      if (committed) {
        state = STATES.COMMITTED;
        return state;
      }
      if (state === STATES.CANCELLED || state === STATES.FAILED) {
        return state;
      }
      if (localOfferId && peerOfferId) {
        if (localAccepted && peerAccepted) {
          state = STATES.ACCEPTED_BY_ME;
        } else if (localAccepted) {
          state = STATES.ACCEPTED_BY_ME;
        } else if (peerAccepted) {
          state = STATES.ACCEPTED_BY_PEER;
        } else {
          state = STATES.OFFER_PENDING;
        }
      }
      return state;
    }

    return {
      getState: function () {
        return computeState();
      },
      getSnapshot: function () {
        return {
          state: computeState(),
          localOfferId: localOfferId,
          peerOfferId: peerOfferId,
          localAccepted: localAccepted,
          peerAccepted: peerAccepted,
          committed: committed
        };
      },
      setConnected: function () {
        if (state !== STATES.CANCELLED && state !== STATES.FAILED && !committed) {
          state = STATES.CONNECTED;
        }
      },
      setPairing: function () {
        if (state !== STATES.CANCELLED && state !== STATES.FAILED && !committed) {
          state = STATES.PAIRING;
        }
      },
      createOffer: function (entryId) {
        const parsed = parseEntryId(entryId);
        if (!parsed) return false;
        localOfferId = parsed.id;
        localAccepted = false;
        peerAccepted = false;
        committed = false;
        computeState();
        return true;
      },
      receiveOffer: function (entryId) {
        const parsed = parseEntryId(entryId);
        if (!parsed) return false;
        peerOfferId = parsed.id;
        localAccepted = false;
        peerAccepted = false;
        committed = false;
        computeState();
        return true;
      },
      acceptOffer: function () {
        if (!localOfferId || !peerOfferId || committed) return false;
        localAccepted = true;
        computeState();
        return true;
      },
      rejectOffer: function () {
        if (!localOfferId || !peerOfferId || committed) return false;
        localAccepted = false;
        peerAccepted = false;
        computeState();
        return true;
      },
      receiveAccept: function () {
        if (!localOfferId || !peerOfferId || committed) return false;
        peerAccepted = true;
        computeState();
        return true;
      },
      receiveReject: function () {
        if (!localOfferId || !peerOfferId || committed) return false;
        localAccepted = false;
        peerAccepted = false;
        computeState();
        return true;
      },
      canCommit: function () {
        return Boolean(localOfferId && peerOfferId && localAccepted && peerAccepted && !committed);
      },
      markCommitted: function () {
        if (!this.canCommit()) return false;
        committed = true;
        computeState();
        return true;
      },
      cancelOffer: function () {
        state = STATES.CANCELLED;
      },
      fail: function () {
        state = STATES.FAILED;
      },
      reset: function () {
        state = STATES.IDLE;
        localOfferId = null;
        peerOfferId = null;
        localAccepted = false;
        peerAccepted = false;
        committed = false;
      }
    };
  }

  const api = {
    STATES: STATES,
    parseEntryId: parseEntryId,
    createProtocol: createProtocol
  };

  globalScope.MalixTradeSession = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
