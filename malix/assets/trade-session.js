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
    if (type < 1 || type > 26 || variant < 1 || variant > 4) return null;
    return { type: type, variant: variant, id: type + '-' + variant };
  }

  function encodePayload(payload) {
    try {
      return globalScope.btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    } catch (error) {
      return '';
    }
  }

  function decodePayload(raw) {
    try {
      const text = decodeURIComponent(escape(globalScope.atob(String(raw || '').trim())));
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== 'object') return null;
      return parsed;
    } catch (error) {
      return null;
    }
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

  function waitForIceGathering(peerConnection, timeoutMs) {
    return new Promise(function (resolve) {
      const timeout = globalScope.setTimeout(function () {
        cleanup();
        resolve();
      }, timeoutMs || 5500);

      function cleanup() {
        globalScope.clearTimeout(timeout);
        peerConnection.removeEventListener('icegatheringstatechange', onChange);
      }

      function onChange() {
        if (peerConnection.iceGatheringState === 'complete') {
          cleanup();
          resolve();
        }
      }

      if (peerConnection.iceGatheringState === 'complete') {
        cleanup();
        resolve();
        return;
      }

      peerConnection.addEventListener('icegatheringstatechange', onChange);
    });
  }

  function createRtcSession(callbacks) {
    const handler = callbacks || {};
    const hasRtc = typeof globalScope.RTCPeerConnection === 'function';
    let pc = null;
    let channel = null;

    function emitState(state) {
      if (typeof handler.onStateChange === 'function') {
        handler.onStateChange(state);
      }
    }

    function emitError(message) {
      if (typeof handler.onError === 'function') {
        handler.onError(message);
      }
    }

    function emitMessage(payload) {
      if (typeof handler.onMessage === 'function') {
        handler.onMessage(payload);
      }
    }

    function bindChannel(nextChannel) {
      channel = nextChannel;
      channel.onopen = function () {
        emitState('connected');
      };
      channel.onclose = function () {
        emitState('closed');
      };
      channel.onerror = function () {
        emitError('Canal d\'echange indisponible.');
      };
      channel.onmessage = function (event) {
        const payload = decodePayload(event.data);
        if (!payload) return;
        emitMessage(payload);
      };
    }

    function createPc() {
      if (!hasRtc) {
        emitError('WebRTC indisponible sur cet appareil.');
        return null;
      }
      const peerConnection = new globalScope.RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      peerConnection.onconnectionstatechange = function () {
        if (peerConnection.connectionState === 'failed') {
          emitError('Connexion perdue pendant l\'echange.');
        }
      };

      peerConnection.ondatachannel = function (event) {
        bindChannel(event.channel);
      };

      return peerConnection;
    }

    function ensurePc() {
      if (pc) return pc;
      pc = createPc();
      return pc;
    }

    return {
      isSupported: hasRtc,
      startHost: async function () {
        const peerConnection = ensurePc();
        if (!peerConnection) return null;
        bindChannel(peerConnection.createDataChannel('malix-trade'));
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        await waitForIceGathering(peerConnection, 6000);
        const local = peerConnection.localDescription;
        if (!local) return null;
        emitState('pairing');
        return encodePayload({
          type: 'offer',
          sdp: local.sdp
        });
      },
      applyHostAnswer: async function (answerCode) {
        const peerConnection = ensurePc();
        if (!peerConnection) return false;
        const payload = decodePayload(answerCode);
        if (!payload || payload.type !== 'answer' || !payload.sdp) {
          emitError('Code de reponse invalide.');
          return false;
        }
        await peerConnection.setRemoteDescription({
          type: 'answer',
          sdp: payload.sdp
        });
        return true;
      },
      startGuest: async function (offerCode) {
        const peerConnection = ensurePc();
        if (!peerConnection) return null;
        const payload = decodePayload(offerCode);
        if (!payload || payload.type !== 'offer' || !payload.sdp) {
          emitError('Code hote invalide.');
          return null;
        }
        await peerConnection.setRemoteDescription({
          type: 'offer',
          sdp: payload.sdp
        });
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        await waitForIceGathering(peerConnection, 6000);
        const local = peerConnection.localDescription;
        if (!local) return null;
        emitState('pairing');
        return encodePayload({
          type: 'answer',
          sdp: local.sdp
        });
      },
      send: function (payload) {
        if (!channel || channel.readyState !== 'open') {
          return false;
        }
        try {
          channel.send(encodePayload(payload));
          return true;
        } catch (error) {
          emitError('Envoi impossible pour cet echange.');
          return false;
        }
      },
      close: function () {
        if (channel) {
          try {
            channel.close();
          } catch (error) {
            // Ignore close errors.
          }
        }
        if (pc) {
          try {
            pc.close();
          } catch (error) {
            // Ignore close errors.
          }
        }
        channel = null;
        pc = null;
      }
    };
  }

  const api = {
    STATES: STATES,
    parseEntryId: parseEntryId,
    createProtocol: createProtocol,
    createRtcSession: createRtcSession,
    encodePayload: encodePayload,
    decodePayload: decodePayload
  };

  globalScope.MalixTradeSession = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
