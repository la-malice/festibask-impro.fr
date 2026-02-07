(function () {
  const collectionApi = window.MalixCollection;

  if (!collectionApi) {
    return;
  }

  const variantColors = ['var(--v1)', 'var(--v2)', 'var(--v3)', 'var(--v4)'];
  const variantStrokeHexColors = ['#2b82ff', '#f13a97', '#f09a35', '#46bd66'];
  const variantFillHexColors = ['#bee8ff', '#ffd4e9', '#ffe2bd', '#d2f5d9'];
  const variantRarityWeights = [55, 27, 13, 5];
  const OFFICIAL_GAME_URL = 'https://festibask-impro.fr/malix';
  const AUDIENCE_LAYOUT_KEY = 'malix-audience-layout-v1';
  const AUDIENCE_ROWS = 8;
  const AUDIENCE_LEFT_COUNT = 6;
  const AUDIENCE_RIGHT_COUNT = 7;
  const AUDIENCE_SEATS_COUNT = AUDIENCE_ROWS * (AUDIENCE_LEFT_COUNT + AUDIENCE_RIGHT_COUNT);
  const PHOTO_INDEX_KEY = 'malix-photo-album-index';
  const PHOTO_DB_NAME = 'malix-photo-db';
  const PHOTO_DB_VERSION = 1;
  const PHOTO_STORE_NAME = 'photos';
  const variantHexColors = ['#3bb9ff', '#ff5fa8', '#ffb85a', '#71df8a'];
  const doodleSourceCache = new Map();
  const doodleVariantCache = new Map();
  const typeNames = [
    'Flechix',
    'Manix',
    'Sapix',
    'Dogix',
    'Champix',
    'Cubix',
    'Grenix',
    'Barrix',
    'Spiralix',
    'Princix',
    'Poulix',
    'Pongix',
    'Ondix',
    'Cyclix',
    'Maskix',
    'Kazix',
    'Kongix',
    'Balix',
    'Florix',
    'Ciblix',
    'Goutix',
    'Tassix',
    'Solix',
    'Lunix',
    'Fourchix',
    'Cerix'
  ];
  const typeRarityWeights = Array.from({ length: collectionApi.MAX_TYPES }, function (_, index) {
    const type = index + 1;
    return collectionApi.MAX_TYPES - type + 1;
  });
  const app = document.getElementById('app');
  const playzone = document.getElementById('playzone');
  const spawnApproachHint = document.getElementById('spawnApproachHint');
  const kawaiiDecor = document.querySelector('.kawaii-decor');
  const audienceSeats = document.getElementById('audienceSeats');
  const progressText = document.getElementById('progressText');
  const progressFill = document.getElementById('progressFill');
  const malidexProgress = document.getElementById('malidexProgress');
  const malidexProgressFill = document.getElementById('malidexProgressFill');
  const malidexGrid = document.getElementById('malidexGrid');
  const screenWelcome = document.getElementById('screen-welcome');
  const screenGame = document.getElementById('screen-game');
  const screenMalidex = document.getElementById('screen-malidex');
  const screenFinish = document.getElementById('screen-finish');
  const finaleZone = document.getElementById('finaleZone');
  const finishMalidexTarget = document.getElementById('finishMalidexTarget');
  const landscapeGuard = document.getElementById('landscapeGuard');
  const captureOverlay = document.getElementById('captureOverlay');
  const malidexDetail = document.getElementById('malidexDetail');
  const detailVisual = document.getElementById('detailVisual');
  const detailName = document.getElementById('detailName');
  const detailRarity = document.getElementById('detailRarity');
  const detailCaptures = document.getElementById('detailCaptures');
  const welcomeQr = document.getElementById('welcomeQr');
  const welcomeLink = document.getElementById('welcomeLink');
  const welcomeNote = document.getElementById('welcomeNote');
  const resetConfirmOverlay = document.getElementById('resetConfirmOverlay');
  const cancelResetBtn = document.getElementById('cancelResetBtn');
  const confirmResetBtn = document.getElementById('confirmResetBtn');

  const openMalidexBtn = document.getElementById('openMalidexBtn');
  const closeMalidexBtn = document.getElementById('closeMalidexBtn');
  const malidexHandle = screenMalidex ? screenMalidex.querySelector('.hud-handle') : null;
  const openPhotoModeBtn = document.getElementById('openPhotoModeBtn');
  const malidexTabMalixBtn = document.getElementById('malidexTabMalixBtn');
  const malidexTabAlbumBtn = document.getElementById('malidexTabAlbumBtn');
  const malidexPanelMalix = document.getElementById('malidexPanelMalix');
  const malidexPanelAlbum = document.getElementById('malidexPanelAlbum');
  const screenPhoto = document.getElementById('screen-photo');
  const photoVideo = document.getElementById('photoVideo');
  const photoMalix = document.getElementById('photoMalix');
  const photoMalixImg = document.getElementById('photoMalixImg');
  const photoFlash = document.getElementById('photoFlash');
  const photoHint = document.getElementById('photoHint');
  const photoAlbumTarget = document.getElementById('photoAlbumTarget');
  const closePhotoModeBtn = document.getElementById('closePhotoModeBtn');
  const takePhotoBtn = document.getElementById('takePhotoBtn');
  const albumFilterType = document.getElementById('albumFilterType');
  const albumGrid = document.getElementById('albumGrid');
  const albumViewer = document.getElementById('albumViewer');
  const albumViewerImg = document.getElementById('albumViewerImg');
  const shareAlbumPhotoBtn = document.getElementById('shareAlbumPhotoBtn');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let collection = collectionApi.loadCollection(window.localStorage);
  let captureCounts = collectionApi.loadCounts(window.localStorage);
  let spawnTimer = null;
  let preSpawnHintTimer = null;
  let spawnHintHideTimer = null;
  let animationFrame = null;
  let currentSpawn = null;
  let obstacles = [];
  let hasSpawnedAtLeastOnce = false;
  let captureBusy = false;
  let malidexCloseTimer = null;
  let malidexDragPointerId = null;
  let malidexDragStartY = 0;
  let malidexDragCurrentY = 0;
  let malidexDragLastY = 0;
  let malidexDragLastTime = 0;
  let malidexDragVelocity = 0;
  let finishDismissInProgress = false;
  let desktopWelcomeMode = false;
  let photoModeActive = false;
  let photoAnimationFrame = null;
  let photoTrackStream = null;
  let photoState = null;
  let photoAlbum = loadPhotoAlbumIndex();
  let photoDbPromise = null;
  let albumObjectUrls = [];
  let albumFilter = 'all';
  let pendingAlbumTypeFilter = 'all';
  let malidexActiveTab = 'malix';
  let audienceSeatAssignment = [];
  let audienceSeatNodes = [];

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  function randomType() {
    return pickWeightedIndex(typeRarityWeights) + 1;
  }

  function randomVariant() {
    return pickWeightedIndex(variantRarityWeights) + 1;
  }

  function listAllCollectionEntryIds() {
    const ids = [];
    for (let type = 1; type <= collectionApi.MAX_TYPES; type += 1) {
      for (let variant = 1; variant <= collectionApi.MAX_VARIANTS; variant += 1) {
        ids.push(collectionApi.makeId(type, variant));
      }
    }
    return ids;
  }

  function shuffleArray(values) {
    const next = values.slice();
    for (let index = next.length - 1; index > 0; index -= 1) {
      const swapIndex = randomInt(0, index);
      const temp = next[index];
      next[index] = next[swapIndex];
      next[swapIndex] = temp;
    }
    return next;
  }

  function saveAudienceSeatAssignment(layout) {
    try {
      window.localStorage.setItem(AUDIENCE_LAYOUT_KEY, JSON.stringify(layout));
    } catch (error) {
      // Ignore storage errors for layout metadata.
    }
  }

  function createAudienceSeatAssignment() {
    const ids = listAllCollectionEntryIds();
    const shuffled = shuffleArray(ids);
    saveAudienceSeatAssignment(shuffled);
    return shuffled;
  }

  function loadAudienceSeatAssignment() {
    const expectedIds = listAllCollectionEntryIds();
    const expectedSet = new Set(expectedIds);

    try {
      const raw = window.localStorage.getItem(AUDIENCE_LAYOUT_KEY);
      if (!raw) {
        return createAudienceSeatAssignment();
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length !== AUDIENCE_SEATS_COUNT) {
        return createAudienceSeatAssignment();
      }
      const seen = new Set();
      for (let index = 0; index < parsed.length; index += 1) {
        const entryId = String(parsed[index]);
        if (!expectedSet.has(entryId) || seen.has(entryId)) {
          return createAudienceSeatAssignment();
        }
        seen.add(entryId);
      }
      return parsed.map(function (entryId) {
        return String(entryId);
      });
    } catch (error) {
      return createAudienceSeatAssignment();
    }
  }

  function buildAudienceSeats() {
    if (!audienceSeats) return;
    audienceSeatNodes = new Array(AUDIENCE_SEATS_COUNT);
    audienceSeats.innerHTML = '';

    const fragment = document.createDocumentFragment();
    for (let row = 0; row < AUDIENCE_ROWS; row += 1) {
      const rowEl = document.createElement('div');
      rowEl.className = 'audience-row' + (row % 2 === 1 ? ' is-offset' : '');
      const rowProgress = AUDIENCE_ROWS > 1 ? row / (AUDIENCE_ROWS - 1) : 1;
      rowEl.style.setProperty('--aisle-width', (24 + rowProgress * 14).toFixed(1) + 'px');

      const left = document.createElement('div');
      left.className = 'audience-side audience-side-left';
      const aisle = document.createElement('span');
      aisle.className = 'audience-aisle';
      const right = document.createElement('div');
      right.className = 'audience-side audience-side-right';

      for (let col = 0; col < AUDIENCE_LEFT_COUNT + AUDIENCE_RIGHT_COUNT; col += 1) {
        const seat = document.createElement('span');
        seat.className = 'audience-seat';
        const seatIndex = row * (AUDIENCE_LEFT_COUNT + AUDIENCE_RIGHT_COUNT) + col;
        audienceSeatNodes[seatIndex] = seat;
        if (col < AUDIENCE_LEFT_COUNT) {
          left.appendChild(seat);
        } else {
          right.appendChild(seat);
        }
      }

      rowEl.appendChild(left);
      rowEl.appendChild(aisle);
      rowEl.appendChild(right);
      fragment.appendChild(rowEl);
    }
    audienceSeats.appendChild(fragment);
  }

  function refreshAudienceSeats() {
    if (!audienceSeats || !audienceSeatNodes.length || !audienceSeatAssignment.length) return;

    for (let index = 0; index < audienceSeatAssignment.length; index += 1) {
      const entryId = audienceSeatAssignment[index];
      const seatEl = audienceSeatNodes[index];
      if (!seatEl) continue;
      const parsed = collectionApi.parseId(entryId);
      if (!parsed) continue;
      const isCollected = collection.has(entryId);
      seatEl.classList.toggle('is-collected', isCollected);
      seatEl.style.setProperty('--seat-color', variantHexColors[parsed.variant - 1] || '#89c7ff');
    }
  }

  function isPhoneDevice() {
    const ua = (window.navigator && window.navigator.userAgent) || '';
    const uaMobile = /android|iphone|ipod|mobile|windows phone|blackberry/i.test(ua);
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const smallViewport = Math.min(window.innerWidth, window.innerHeight) <= 900;
    return uaMobile || (coarse && smallViewport);
  }

  function gameUrl() {
    const host = (window.location.hostname || '').toLowerCase();
    if (host === 'festibask-impro.fr' || host.endsWith('.festibask-impro.fr')) {
      return OFFICIAL_GAME_URL;
    }
    return new URL('./', window.location.href).href;
  }

  function isCheatAllowed() {
    const params = new URLSearchParams(window.location.search);
    const host = (window.location.hostname || '').toLowerCase();
    return params.get('cheat') === '1' || host === 'localhost' || host === '127.0.0.1';
  }

  function loadPhotoAlbumIndex() {
    try {
      const raw = window.localStorage.getItem(PHOTO_INDEX_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      const cleaned = [];
      for (let index = 0; index < parsed.length; index += 1) {
        const item = parsed[index];
        if (!item || typeof item !== 'object') continue;
        const type = Number.parseInt(item.type, 10);
        const variant = Number.parseInt(item.variant, 10);
        if (!Number.isInteger(type) || !Number.isInteger(variant)) continue;
        if (type < 1 || type > collectionApi.MAX_TYPES || variant < 1 || variant > collectionApi.MAX_VARIANTS) continue;
        cleaned.push({
          id: String(item.id || Date.now() + '-' + index),
          createdAt: Number.parseInt(item.createdAt, 10) || Date.now(),
          type: type,
          variant: variant,
          dataUrl: typeof item.dataUrl === 'string' && item.dataUrl.length >= 20 ? item.dataUrl : null
        });
      }
      return cleaned;
    } catch (error) {
      return [];
    }
  }

  function persistPhotoAlbumIndex() {
    try {
      const lightIndex = photoAlbum.slice(-120).map(function (item) {
        return {
          id: item.id,
          createdAt: item.createdAt,
          type: item.type,
          variant: item.variant,
          dataUrl: item.dataUrl || null
        };
      });
      window.localStorage.setItem(PHOTO_INDEX_KEY, JSON.stringify(lightIndex));
    } catch (error) {
      // Ignore storage quota errors for the photo album.
    }
  }

  function openPhotoDb() {
    if (photoDbPromise) return photoDbPromise;

    photoDbPromise = new Promise(function (resolve, reject) {
      const request = indexedDB.open(PHOTO_DB_NAME, PHOTO_DB_VERSION);
      request.onupgradeneeded = function () {
        const db = request.result;
        if (!db.objectStoreNames.contains(PHOTO_STORE_NAME)) {
          db.createObjectStore(PHOTO_STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = function () {
        resolve(request.result);
      };
      request.onerror = function () {
        reject(request.error);
      };
    });

    return photoDbPromise;
  }

  async function putPhotoBlob(photoId, blob) {
    if (!blob) return;
    try {
      const db = await openPhotoDb();
      await new Promise(function (resolve, reject) {
        const tx = db.transaction(PHOTO_STORE_NAME, 'readwrite');
        const store = tx.objectStore(PHOTO_STORE_NAME);
        store.put({ id: photoId, blob: blob });
        tx.oncomplete = function () {
          resolve();
        };
        tx.onerror = function () {
          reject(tx.error);
        };
      });
    } catch (error) {
      // Fallback handled by metadata dataUrl when available.
    }
  }

  async function getPhotoBlob(photoId) {
    try {
      const db = await openPhotoDb();
      return await new Promise(function (resolve) {
        const tx = db.transaction(PHOTO_STORE_NAME, 'readonly');
        const store = tx.objectStore(PHOTO_STORE_NAME);
        const req = store.get(photoId);
        req.onsuccess = function () {
          const value = req.result;
          resolve(value && value.blob ? value.blob : null);
        };
        req.onerror = function () {
          resolve(null);
        };
      });
    } catch (error) {
      return null;
    }
  }

  function pickWeightedIndex(weights) {
    let total = 0;
    for (let index = 0; index < weights.length; index += 1) {
      total += Math.max(0, weights[index]);
    }
    if (total <= 0) return 0;

    let roll = Math.random() * total;
    for (let index = 0; index < weights.length; index += 1) {
      roll -= Math.max(0, weights[index]);
      if (roll <= 0) {
        return index;
      }
    }
    return weights.length - 1;
  }

  function clearObstacles() {
    for (let index = 0; index < obstacles.length; index += 1) {
      const obstacle = obstacles[index];
      if (obstacle.el && obstacle.el.parentNode) {
        obstacle.el.remove();
      }
    }
    obstacles = [];
  }

  function intersectsRect(a, b) {
    return !(a.x + a.w <= b.x || a.x >= b.x + b.w || a.y + a.h <= b.y || a.y >= b.y + b.h);
  }

  function canPlaceObstacle(candidate, marginBox) {
    if (intersectsRect(candidate, marginBox)) {
      return false;
    }
    for (let index = 0; index < obstacles.length; index += 1) {
      if (intersectsRect(candidate, obstacles[index])) {
        return false;
      }
    }
    return true;
  }

  function canPlaceCorner(horizontal, vertical, marginBox) {
    if (intersectsRect(horizontal, marginBox) || intersectsRect(vertical, marginBox)) {
      return false;
    }
    for (let index = 0; index < obstacles.length; index += 1) {
      if (intersectsRect(horizontal, obstacles[index]) || intersectsRect(vertical, obstacles[index])) {
        return false;
      }
    }
    return true;
  }

  function addObstacleElement(rect, kindClass) {
    obstacles.push({ ...rect });
  }

  function placeKawaiiSticker(selector, config) {
    if (!kawaiiDecor) return;
    const sticker = kawaiiDecor.querySelector(selector);
    if (!sticker) return;

    sticker.style.left = randomFloat(config.minLeft, config.maxLeft).toFixed(2) + '%';
    sticker.style.top = randomFloat(config.minTop, config.maxTop).toFixed(2) + '%';
    sticker.style.right = 'auto';
    sticker.style.bottom = 'auto';
    sticker.style.animationDelay = randomFloat(0, config.maxDelay || 2.2).toFixed(2) + 's';
  }

  function getSpotlightTopRange() {
    const fallback = { minTop: 0, maxTop: 12 };
    if (!kawaiiDecor || !screenGame) return fallback;

    const decorRect = kawaiiDecor.getBoundingClientRect();
    if (decorRect.height <= 0) return fallback;

    const topbar = screenGame.querySelector('.topbar');
    const logo = screenGame.querySelector('.logo');
    const topbarBottom = topbar ? topbar.getBoundingClientRect().bottom : decorRect.top;
    const logoBottom = logo ? logo.getBoundingClientRect().bottom : decorRect.top;
    const guardBottomPx = Math.max(topbarBottom, logoBottom) - decorRect.top + 10;

    const spotlight = kawaiiDecor.querySelector('.sticker-spotlight');
    const spotlightHeightPx = spotlight ? spotlight.getBoundingClientRect().height : 118;
    const firstThirdBottomPx = decorRect.height / 3;
    const maxTopPx = firstThirdBottomPx - spotlightHeightPx - 6;

    let minTop = (guardBottomPx / decorRect.height) * 100;
    let maxTop = (maxTopPx / decorRect.height) * 100;

    minTop = Math.max(0, minTop);
    maxTop = Math.max(0, maxTop);

    if (maxTop < minTop) {
      maxTop = minTop;
    }

    return { minTop: minTop, maxTop: maxTop };
  }

  function randomizeKawaiiDecorLayout() {
    const topRange = getSpotlightTopRange();
    placeKawaiiSticker('.sticker-spotlight-1', {
      minLeft: 1,
      maxLeft: 18,
      minTop: topRange.minTop,
      maxTop: topRange.maxTop,
      maxDelay: 2
    });
    placeKawaiiSticker('.sticker-spotlight-2', {
      minLeft: 80,
      maxLeft: 94,
      minTop: topRange.minTop,
      maxTop: topRange.maxTop,
      maxDelay: 2
    });
    placeKawaiiSticker('.sticker-spotlight-3', {
      minLeft: 42,
      maxLeft: 56,
      minTop: topRange.minTop,
      maxTop: topRange.maxTop,
      maxDelay: 2
    });
  }

  function generateObstacles() {
    clearObstacles();
    if (desktopWelcomeMode || screenGame.classList.contains('hidden')) {
      return;
    }
    randomizeKawaiiDecorLayout();

    const rect = playzone.getBoundingClientRect();
    if (rect.width < 120 || rect.height < 120) {
      return;
    }
    const curtainWidth = Math.max(22, Math.min(48, rect.width * 0.08));
    const curtainTop = 0;
    const curtainHeight = rect.height * 0.64;
    const stageWidth = Math.min(rect.width - 28, 860);
    const stageHeight = Math.max(38, rect.height * 0.13);
    const stageX = (rect.width - stageWidth) / 2;
    const stageY = curtainTop + curtainHeight - stageHeight * 0.68;
    let audienceX = 0;
    let audienceY = Math.max(0, rect.height - Math.max(270, rect.height * 0.36));
    let audienceWidth = rect.width;
    let audienceHeight = Math.max(48, rect.height * 0.22);

    if (audienceSeats) {
      const audienceRect = audienceSeats.getBoundingClientRect();
      if (audienceRect.width > 0 && audienceRect.height > 0) {
        audienceX = Math.max(0, audienceRect.left - rect.left);
        audienceY = Math.max(0, audienceRect.top - rect.top);
        audienceWidth = Math.min(rect.width - audienceX, audienceRect.width);
        audienceHeight = Math.min(rect.height - audienceY, audienceRect.height);
      }
    }

    const aisleWidth = Math.max(28, audienceWidth * 0.08);
    const sideWidth = Math.max(1, (audienceWidth - aisleWidth) / 2);

    addObstacleElement({ x: 0, y: curtainTop, w: curtainWidth, h: curtainHeight }, 'play-obstacle-curtain');
    addObstacleElement(
      { x: rect.width - curtainWidth, y: curtainTop, w: curtainWidth, h: curtainHeight },
      'play-obstacle-curtain'
    );
    addObstacleElement({ x: stageX, y: stageY, w: stageWidth, h: stageHeight }, 'play-obstacle-stage');
    addObstacleElement({ x: audienceX, y: audienceY, w: sideWidth, h: audienceHeight }, 'play-obstacle-audience');
    addObstacleElement(
      { x: audienceX + audienceWidth - sideWidth, y: audienceY, w: sideWidth, h: audienceHeight },
      'play-obstacle-audience'
    );
  }

  function intersectsAnyObstacle(box) {
    for (let index = 0; index < obstacles.length; index += 1) {
      if (intersectsRect(box, obstacles[index])) {
        return true;
      }
    }
    return false;
  }

  function resolveObstacleCollisions(spawn) {
    const box = {
      x: spawn.x,
      y: spawn.y,
      w: spawn.size,
      h: spawn.size
    };

    for (let index = 0; index < obstacles.length; index += 1) {
      const obstacle = obstacles[index];
      if (!intersectsRect(box, obstacle)) {
        continue;
      }

      const overlapX =
        Math.min(box.x + box.w, obstacle.x + obstacle.w) - Math.max(box.x, obstacle.x);
      const overlapY =
        Math.min(box.y + box.h, obstacle.y + obstacle.h) - Math.max(box.y, obstacle.y);

      if (overlapX <= 0 || overlapY <= 0) {
        continue;
      }

      if (overlapX < overlapY) {
        if (box.x + box.w / 2 < obstacle.x + obstacle.w / 2) {
          spawn.x -= overlapX;
        } else {
          spawn.x += overlapX;
        }
        spawn.vx *= -0.9;
      } else {
        if (box.y + box.h / 2 < obstacle.y + obstacle.h / 2) {
          spawn.y -= overlapY;
        } else {
          spawn.y += overlapY;
        }
        spawn.vy *= -0.9;
      }

      box.x = spawn.x;
      box.y = spawn.y;
    }
  }

  function typePath(type) {
    return './assets/doodles/' + String(type).padStart(2, '0') + '.svg';
  }

  function readStyleMap(styleText) {
    const styleMap = {};
    if (!styleText) return styleMap;
    const chunks = styleText.split(';');
    for (let index = 0; index < chunks.length; index += 1) {
      const pair = chunks[index].trim();
      if (!pair) continue;
      const splitAt = pair.indexOf(':');
      if (splitAt <= 0) continue;
      const key = pair.slice(0, splitAt).trim();
      const value = pair.slice(splitAt + 1).trim();
      if (key) {
        styleMap[key] = value;
      }
    }
    return styleMap;
  }

  function writeStyleMap(styleMap) {
    const entries = Object.entries(styleMap);
    if (!entries.length) return '';
    return entries
      .map(function (entry) {
        return entry[0] + ': ' + entry[1];
      })
      .join('; ');
  }

  function isClosedShapeElement(element) {
    const tagName = (element.tagName || '').toLowerCase();
    if (tagName === 'path') {
      const d = element.getAttribute('d') || '';
      return /[zZ]/.test(d);
    }
    if (tagName === 'polygon' || tagName === 'circle' || tagName === 'ellipse' || tagName === 'rect') {
      return true;
    }
    return false;
  }

  function getStrokeWidthValue(element, styleMap) {
    const attrWidth = element.getAttribute('stroke-width');
    if (attrWidth) return attrWidth;
    if (styleMap['stroke-width']) return styleMap['stroke-width'];
    return '';
  }

  function normalizeShapeStyle(element, strokeColor, fillColor) {
    const styleMap = readStyleMap(element.getAttribute('style') || '');
    const closedShape = isClosedShapeElement(element);
    const currentWidth = getStrokeWidthValue(element, styleMap);

    delete styleMap.fill;
    delete styleMap.stroke;
    delete styleMap['stroke-width'];

    if (closedShape) {
      element.setAttribute('fill', fillColor);
      element.setAttribute('stroke', strokeColor);
      element.setAttribute('stroke-width', currentWidth || '3');
      if (!element.getAttribute('stroke-linejoin') && !styleMap['stroke-linejoin']) {
        element.setAttribute('stroke-linejoin', 'round');
      }
    } else {
      element.setAttribute('fill', 'none');
      element.setAttribute('stroke', strokeColor);
      element.setAttribute('stroke-width', currentWidth || '6');
    }

    const nextStyle = writeStyleMap(styleMap);
    if (nextStyle) {
      element.setAttribute('style', nextStyle);
    } else {
      element.removeAttribute('style');
    }
  }

  function colorizeDoodleSvg(svgText, variant) {
    if (!svgText || !variant) return svgText;
    const parser = new window.DOMParser();
    const parsed = parser.parseFromString(svgText, 'image/svg+xml');
    const svg = parsed.documentElement;
    if (!svg || svg.nodeName.toLowerCase() !== 'svg') {
      return svgText;
    }

    const strokeColor = variantStrokeHexColors[variant - 1] || variantHexColors[variant - 1] || '#3bb9ff';
    const fillColor = variantFillHexColors[variant - 1] || '#ffffff';
    const targets = parsed.querySelectorAll('path, polygon, polyline, circle, ellipse, rect, line');
    for (let index = 0; index < targets.length; index += 1) {
      normalizeShapeStyle(targets[index], strokeColor, fillColor);
    }
    return new window.XMLSerializer().serializeToString(parsed);
  }

  async function loadTypeSvgSource(type) {
    if (doodleSourceCache.has(type)) {
      return doodleSourceCache.get(type);
    }
    try {
      const response = await fetch(typePath(type));
      if (!response.ok) {
        doodleSourceCache.set(type, null);
        return null;
      }
      const source = await response.text();
      doodleSourceCache.set(type, source);
      return source;
    } catch (error) {
      doodleSourceCache.set(type, null);
      return null;
    }
  }

  async function typeVariantPath(type, variant) {
    if (!Number.isInteger(type) || !Number.isInteger(variant)) {
      return typePath(type);
    }
    const key = type + '-' + variant;
    if (doodleVariantCache.has(key)) {
      return doodleVariantCache.get(key);
    }

    const source = await loadTypeSvgSource(type);
    if (!source) {
      const fallback = typePath(type);
      doodleVariantCache.set(key, fallback);
      return fallback;
    }
    const colorized = colorizeDoodleSvg(source, variant);
    const dataUrl = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(colorized);
    doodleVariantCache.set(key, dataUrl);
    return dataUrl;
  }

  function setTypeVariantImage(imageElement, type, variant) {
    if (!imageElement) return;
    const expectedType = type;
    const expectedVariant = variant;
    imageElement.dataset.pendingType = String(type);
    imageElement.dataset.pendingVariant = String(variant);
    imageElement.src = typePath(type);
    typeVariantPath(type, variant).then(function (variantPath) {
      if (!imageElement.isConnected) {
        return;
      }
      if (
        imageElement.dataset.pendingType !== String(expectedType) ||
        imageElement.dataset.pendingVariant !== String(expectedVariant)
      ) {
        return;
      }
      imageElement.src = variantPath;
    });
  }

  function typeName(type) {
    return typeNames[type - 1] || ('Malix ' + String(type).padStart(2, '0'));
  }

  function isTypeDiscovered(type) {
    for (let variant = 1; variant <= collectionApi.MAX_VARIANTS; variant += 1) {
      if (collection.has(collectionApi.makeId(type, variant))) {
        return true;
      }
    }
    return false;
  }

  function variantName(variant) {
    const names = ['Azur', 'Rose Flash', 'Soleil', 'Menthe'];
    return names[variant - 1] || 'Mystere';
  }

  function rarityLabel(type, variant) {
    const rarity = getRarityScale(type, variant);
    if (rarity >= 0.85) return 'Legendaire';
    if (rarity >= 0.62) return 'Epique';
    if (rarity >= 0.38) return 'Rare';
    return 'Commun';
  }

  function unlockExcitementByRarity(rarity) {
    if (rarity === 'Legendaire') return 'Fantastique';
    if (rarity === 'Epique') return 'Incroyable';
    if (rarity === 'Rare') return 'Bravo';
    return 'Cool';
  }

  function rarityNounForm(rarity) {
    if (rarity === 'Legendaire') return 'legendaire';
    if (rarity === 'Epique') return 'epique';
    if (rarity === 'Rare') return 'rare';
    return 'commun';
  }

  function getRarityScale(type, variant) {
    const weight = typeRarityWeights[type - 1] * variantRarityWeights[variant - 1];
    const maxWeight = typeRarityWeights[0] * variantRarityWeights[0];
    const minWeight =
      typeRarityWeights[typeRarityWeights.length - 1] *
      variantRarityWeights[variantRarityWeights.length - 1];
    return 1 - (weight - minWeight) / (maxWeight - minWeight);
  }

  function ensureCountsConsistency() {
    const next = { ...captureCounts };
    let changed = false;
    collection.forEach(function (entryId) {
      if (!next[entryId] || next[entryId] < 1) {
        next[entryId] = 1;
        changed = true;
      }
    });
    if (changed) {
      captureCounts = next;
      collectionApi.saveCounts(window.localStorage, captureCounts);
    }
  }

  function hideAllScreens() {
    if (screenWelcome) {
      screenWelcome.classList.add('hidden');
    }
    screenGame.classList.add('hidden');
    screenMalidex.classList.add('hidden');
    screenFinish.classList.add('hidden');
    if (screenPhoto) {
      screenPhoto.classList.add('hidden');
    }
    if (albumViewer) {
      albumViewer.classList.add('hidden');
    }
    photoModeActive = false;
    screenMalidex.classList.remove('is-open');
    screenMalidex.classList.remove('is-closing');
    if (malidexCloseTimer) {
      window.clearTimeout(malidexCloseTimer);
      malidexCloseTimer = null;
    }
    openMalidexBtn.classList.remove('is-hidden');
    openMalidexBtn.setAttribute('aria-expanded', 'false');
    if (openPhotoModeBtn) {
      openPhotoModeBtn.classList.remove('is-hidden');
    }
    if (captureOverlay) {
      captureOverlay.classList.add('hidden');
      captureOverlay.classList.remove('is-active');
      captureOverlay.innerHTML = '';
    }
    closeDetail();
    closeResetDialog();
  }

  function showWelcomeScreen() {
    hideAllScreens();
    if (!screenWelcome) return;
    const url = gameUrl();
    const qrSource = 'https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=' + encodeURIComponent(url);

    if (welcomeQr) {
      welcomeQr.src = qrSource;
    }
    if (welcomeLink) {
      welcomeLink.href = url;
      welcomeLink.textContent = url;
    }
    if (welcomeNote) {
      welcomeNote.textContent = '';
    }

    screenWelcome.classList.remove('hidden');
    landscapeGuard.classList.add('hidden');
  }

  function showGameNotice(message) {
    if (!captureOverlay) return;
    captureOverlay.innerHTML = '';
    captureOverlay.classList.remove('hidden');
    const card = document.createElement('div');
    card.className = 'capture-card capture-notice';
    card.textContent = message;
    captureOverlay.appendChild(card);
    window.setTimeout(function () {
      captureOverlay.classList.add('hidden');
      captureOverlay.innerHTML = '';
    }, 2200);
  }

  function resetMalidexDrag() {
    malidexDragPointerId = null;
    malidexDragStartY = 0;
    malidexDragCurrentY = 0;
    malidexDragLastY = 0;
    malidexDragLastTime = 0;
    malidexDragVelocity = 0;
    screenMalidex.classList.remove('is-dragging');
    screenMalidex.style.removeProperty('transform');
  }

  function hideSpawnApproachHint() {
    if (spawnHintHideTimer) {
      window.clearTimeout(spawnHintHideTimer);
      spawnHintHideTimer = null;
    }
    if (spawnApproachHint) {
      spawnApproachHint.classList.add('hidden');
    }
  }

  function showSpawnApproachHint(durationMs) {
    if (!spawnApproachHint) return;
    if (screenGame.classList.contains('hidden') || !screenMalidex.classList.contains('hidden') || photoModeActive) {
      return;
    }
    if (spawnHintHideTimer) {
      window.clearTimeout(spawnHintHideTimer);
    }
    spawnApproachHint.classList.remove('hidden');
    spawnHintHideTimer = window.setTimeout(function () {
      spawnHintHideTimer = null;
      spawnApproachHint.classList.add('hidden');
    }, Math.max(700, durationMs || 2200));
  }

  function setMalidexTab(tabName) {
    malidexActiveTab = tabName === 'album' ? 'album' : 'malix';
    const showAlbum = malidexActiveTab === 'album';
    if (malidexTabMalixBtn) {
      malidexTabMalixBtn.classList.toggle('is-active', !showAlbum);
      malidexTabMalixBtn.setAttribute('aria-selected', String(!showAlbum));
    }
    if (malidexTabAlbumBtn) {
      malidexTabAlbumBtn.classList.toggle('is-active', showAlbum);
      malidexTabAlbumBtn.setAttribute('aria-selected', String(showAlbum));
    }
    if (malidexPanelMalix) {
      malidexPanelMalix.classList.toggle('hidden', showAlbum);
    }
    if (malidexPanelAlbum) {
      malidexPanelAlbum.classList.toggle('hidden', !showAlbum);
    }
    if (showAlbum) {
      renderAlbum();
    } else {
      closeAlbumViewer();
    }
  }

  function setupPhotoState() {
    if (!currentSpawn) {
      photoState = null;
      return;
    }
    const type = currentSpawn.type;
    const variant = currentSpawn.variant;
    const playRect = playzone.getBoundingClientRect();
    const playWidth = Math.max(1, playRect.width);
    const playHeight = Math.max(1, playRect.height);
    const xRatio = window.innerWidth / playWidth;
    const yRatio = window.innerHeight / playHeight;
    const displaySize = currentSpawn.size * ((xRatio + yRatio) / 2);
    photoState = {
      type: type,
      variant: variant,
      x: currentSpawn.x * xRatio,
      y: currentSpawn.y * yRatio,
      size: Math.max(86, Math.min(180, displaySize))
    };
    if (photoMalix) {
      photoMalix.style.width = photoState.size + 'px';
      photoMalix.style.height = photoState.size + 'px';
    }
    if (photoMalixImg) {
      setTypeVariantImage(photoMalixImg, type, variant);
      photoMalixImg.style.filter = '';
    }
  }

  function animatePhotoMalix() {
    if (!photoModeActive || !photoState || !photoMalix) return;

    if (currentSpawn) {
      const playRect = playzone.getBoundingClientRect();
      const playWidth = Math.max(1, playRect.width);
      const playHeight = Math.max(1, playRect.height);
      const xRatio = window.innerWidth / playWidth;
      const yRatio = window.innerHeight / playHeight;
      photoState.x = currentSpawn.x * xRatio;
      photoState.y = currentSpawn.y * yRatio;
      const displaySize = currentSpawn.size * ((xRatio + yRatio) / 2);
      photoState.size = Math.max(86, Math.min(180, displaySize));
      photoMalix.style.width = photoState.size + 'px';
      photoMalix.style.height = photoState.size + 'px';
    } else {
      if (photoHint) {
        photoHint.textContent = 'Le Malix a disparu. Retour a la chasse.';
      }
      stopPhotoMode();
      return;
    }

    photoMalix.style.transform = 'translate3d(' + photoState.x + 'px,' + photoState.y + 'px,0)';
    photoAnimationFrame = window.requestAnimationFrame(animatePhotoMalix);
  }

  async function openPhotoMode() {
    if (photoModeActive || desktopWelcomeMode || !screenPhoto) {
      return;
    }
    if (!currentSpawn) {
      showGameNotice('Aucun Malix actif. Attends un spawn pour prendre une photo.');
      return;
    }
    if (window.isSecureContext === false) {
      showGameNotice('Mode photo indisponible ici. Utilise HTTPS ou localhost.');
      return;
    }
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
      showGameNotice('Camera non disponible sur ce navigateur.');
      return;
    }

    let stream = null;

    try {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false
        });
      } catch (primaryError) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }
      photoTrackStream = stream;
      closeMalidexSheet(true);
      closeDetail();
      closeAlbumViewer();
      if (currentSpawn && currentSpawn.timeoutRef) {
        window.clearTimeout(currentSpawn.timeoutRef);
        currentSpawn.timeoutRef = null;
      }
      photoModeActive = true;
      screenPhoto.classList.remove('hidden');
      openMalidexBtn.classList.add('is-hidden');
      if (openPhotoModeBtn) {
        openPhotoModeBtn.classList.add('is-hidden');
      }
      photoVideo.srcObject = photoTrackStream;
      setupPhotoState();
      if (photoHint) {
        photoHint.textContent = 'Cadre ton Malix et prends la photo';
      }
      if (!reduceMotion) {
        photoAnimationFrame = window.requestAnimationFrame(animatePhotoMalix);
      } else if (photoMalix && photoState) {
        photoMalix.style.transform = 'translate3d(' + photoState.x + 'px,' + photoState.y + 'px,0)';
      }
    } catch (error) {
      if (stream) {
        const tracks = stream.getTracks();
        for (let index = 0; index < tracks.length; index += 1) {
          tracks[index].stop();
        }
      }
      showGameNotice('Camera refusee ou indisponible.');
    }
  }

  function stopPhotoMode() {
    if (photoAnimationFrame) {
      window.cancelAnimationFrame(photoAnimationFrame);
      photoAnimationFrame = null;
    }
    if (photoTrackStream) {
      const tracks = photoTrackStream.getTracks();
      for (let index = 0; index < tracks.length; index += 1) {
        tracks[index].stop();
      }
      photoTrackStream = null;
    }
    if (photoVideo) {
      photoVideo.srcObject = null;
    }
    photoModeActive = false;
    if (screenPhoto) {
      screenPhoto.classList.add('hidden');
    }
    openMalidexBtn.classList.remove('is-hidden');
    if (openPhotoModeBtn) {
      openPhotoModeBtn.classList.remove('is-hidden');
    }
    if (currentSpawn && !currentSpawn.timeoutRef) {
      scheduleSpawnDespawn(currentSpawn);
    }
    planNextSpawn();
  }

  function playShutterSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = 1200;
      gain.gain.value = 0.001;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);
      osc.stop(ctx.currentTime + 0.15);
    } catch (error) {
      // Ignore if audio context cannot start.
    }
  }

  function drawTintedMalix(context, image, x, y, size) {
    const safeSize = Math.max(24, size);
    context.drawImage(image, x, y, safeSize, safeSize);
  }

  async function createBitmapFromBlob(blob) {
    if (!blob) return null;
    return await new Promise(function (resolve) {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = function () {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.src = url;
    });
  }

  async function blobToDataUrl(blob) {
    if (!blob) return null;
    return await new Promise(function (resolve) {
      const reader = new FileReader();
      reader.onloadend = function () {
        resolve(typeof reader.result === 'string' ? reader.result : null);
      };
      reader.onerror = function () {
        resolve(null);
      };
      reader.readAsDataURL(blob);
    });
  }

  function hasNonBlackPixels(context, width, height) {
    try {
      const samplePoints = [];
      for (let row = 1; row <= 4; row += 1) {
        for (let col = 1; col <= 4; col += 1) {
          samplePoints.push([col / 5, row / 5]);
        }
      }
      let litPixels = 0;
      let maxSum = 0;
      let totalSum = 0;
      for (let index = 0; index < samplePoints.length; index += 1) {
        const point = samplePoints[index];
        const x = Math.max(0, Math.min(width - 1, Math.round(width * point[0])));
        const y = Math.max(0, Math.min(height - 1, Math.round(height * point[1])));
        const data = context.getImageData(x, y, 1, 1).data;
        const sum = data[0] + data[1] + data[2];
        totalSum += sum;
        maxSum = Math.max(maxSum, sum);
        if (sum > 36) {
          litPixels += 1;
        }
      }
      const avgSum = totalSum / samplePoints.length;
      return litPixels >= 3 && avgSum > 24 && maxSum > 54;
    } catch (error) {
      return true;
    }
  }

  async function waitVideoFrame(video) {
    if (!video) return;
    if (typeof video.requestVideoFrameCallback === 'function') {
      await new Promise(function (resolve) {
        let settled = false;
        const timer = window.setTimeout(function () {
          if (!settled) {
            settled = true;
            resolve();
          }
        }, 120);
        video.requestVideoFrameCallback(function () {
          if (settled) return;
          settled = true;
          window.clearTimeout(timer);
          resolve();
        });
      });
      return;
    }
    await new Promise(function (resolve) {
      window.requestAnimationFrame(function () {
        resolve();
      });
    });
  }

  async function savePhotoShot(blob, previewDataUrl, type, variant) {
    const photoId = Date.now() + '-' + Math.random().toString(16).slice(2);
    photoAlbum.push({
      id: photoId,
      createdAt: Date.now(),
      type: type,
      variant: variant,
      dataUrl: previewDataUrl || null
    });
    photoAlbum = photoAlbum.slice(-120);
    persistPhotoAlbumIndex();
    await putPhotoBlob(photoId, blob);
  }

  async function takePhotoShot() {
    if (!photoModeActive || !photoState || !photoVideo || !photoMalixImg) {
      return;
    }

    let rawWidth = photoVideo.videoWidth || 1080;
    let rawHeight = photoVideo.videoHeight || 1920;
    const maxDim = 1440;
    let nativePhotoBlob = null;
    const track =
      photoTrackStream && typeof photoTrackStream.getVideoTracks === 'function'
        ? photoTrackStream.getVideoTracks()[0]
        : null;
    const attemptBaseCanvasFromSource = async function (source, width, height) {
      const candidate = document.createElement('canvas');
      candidate.width = width;
      candidate.height = height;
      const candidateCtx = candidate.getContext('2d', { willReadFrequently: true });
      if (!candidateCtx) return null;
      candidateCtx.drawImage(source, 0, 0, width, height);
      return hasNonBlackPixels(candidateCtx, width, height) ? candidate : null;
    };

    const makeSizedDims = function (srcWidth, srcHeight) {
      const scale = Math.min(1, maxDim / Math.max(srcWidth, srcHeight));
      return {
        width: Math.max(640, Math.round(srcWidth * scale)),
        height: Math.max(960, Math.round(srcHeight * scale))
      };
    };

    let canvas = null;

    if (track && typeof window.ImageCapture === 'function') {
      try {
        const capture = new window.ImageCapture(track);
        const photoBlob = await capture.takePhoto();
        nativePhotoBlob = photoBlob;
        const bitmap = await createBitmapFromBlob(photoBlob);
        if (bitmap && bitmap.width && bitmap.height) {
          rawWidth = bitmap.width;
          rawHeight = bitmap.height;
          const dims = makeSizedDims(rawWidth, rawHeight);
          canvas = await attemptBaseCanvasFromSource(bitmap, dims.width, dims.height);
        }
      } catch (error) {
        canvas = null;
      }
    }

    if (!canvas && track && typeof window.ImageCapture === 'function') {
      try {
        const capture = new window.ImageCapture(track);
        const frame = await capture.grabFrame();
        if (frame && frame.width && frame.height) {
          rawWidth = frame.width;
          rawHeight = frame.height;
          const dims = makeSizedDims(rawWidth, rawHeight);
          canvas = await attemptBaseCanvasFromSource(frame, dims.width, dims.height);
          if (typeof frame.close === 'function') {
            frame.close();
          }
        }
      } catch (error) {
        canvas = null;
      }
    }

    if (!canvas) {
      await waitVideoFrame(photoVideo);
      rawWidth = photoVideo.videoWidth || rawWidth;
      rawHeight = photoVideo.videoHeight || rawHeight;
      const dims = makeSizedDims(rawWidth, rawHeight);
      canvas = await attemptBaseCanvasFromSource(photoVideo, dims.width, dims.height);
    }

    if (!canvas && nativePhotoBlob) {
      const nativePreviewDataUrl = await blobToDataUrl(nativePhotoBlob);
      await savePhotoShot(nativePhotoBlob, nativePreviewDataUrl, photoState.type, photoState.variant);
      playShutterSound();
      if (photoFlash) {
        photoFlash.classList.remove('hidden');
        window.setTimeout(function () {
          photoFlash.classList.add('hidden');
        }, 130);
      }
      stopPhotoMode();
      return;
    }

    if (!canvas) {
      showGameNotice('Impossible de capturer la camera sur cet appareil.');
      return;
    }

    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const xRatio = width / Math.max(1, window.innerWidth);
    const yRatio = height / Math.max(1, window.innerHeight);
    const drawX = photoState.x * xRatio;
    const drawY = photoState.y * yRatio;
    const drawSize = photoState.size * ((xRatio + yRatio) / 2);
    drawTintedMalix(ctx, photoMalixImg, drawX, drawY, drawSize);
    const previewDataUrl = canvas.toDataURL('image/jpeg', 0.72);

    const blob = await new Promise(function (resolve) {
      canvas.toBlob(
        function (result) {
          resolve(result || null);
        },
        'image/jpeg',
        0.92
      );
    });
    await savePhotoShot(blob, previewDataUrl, photoState.type, photoState.variant);

    playShutterSound();
    if (photoFlash) {
      photoFlash.classList.remove('hidden');
      window.setTimeout(function () {
        photoFlash.classList.add('hidden');
      }, 130);
    }

    const chip = document.createElement('div');
    chip.className = 'finish-transfer-chip';
    chip.textContent = 'Photo ajoutee';
    chip.style.left = '50%';
    chip.style.top = '50%';
    chip.style.transform = 'translate(-50%,-50%)';
    document.body.appendChild(chip);
    const targetRect = (photoAlbumTarget || closePhotoModeBtn).getBoundingClientRect();
    const dx = targetRect.left + targetRect.width / 2 - window.innerWidth / 2;
    const dy = targetRect.top + targetRect.height / 2 - window.innerHeight / 2;
    const anim = chip.animate(
      [
        { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
        { transform: 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px)) scale(0.15)', opacity: 0.2 }
      ],
      { duration: 650, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'forwards' }
    );
    await anim.finished.catch(function () {});
    chip.remove();
    stopPhotoMode();
  }

  function openAlbum(filterType) {
    if (typeof filterType === 'number' && Number.isInteger(filterType)) {
      pendingAlbumTypeFilter = String(filterType);
    } else if (typeof filterType === 'string') {
      pendingAlbumTypeFilter = filterType;
    }
    openMalidexSheet();
    setMalidexTab('album');
  }

  function closeAlbum() {
    for (let index = 0; index < albumObjectUrls.length; index += 1) {
      URL.revokeObjectURL(albumObjectUrls[index]);
    }
    albumObjectUrls = [];
    closeAlbumViewer();
    setMalidexTab('malix');
  }

  function openAlbumViewer(primarySrc, altText, fallbackSrc) {
    if (!albumViewer || !albumViewerImg) return;
    albumViewerImg.onerror = null;
    albumViewerImg.src = primarySrc || fallbackSrc || '';
    if (fallbackSrc && primarySrc && primarySrc !== fallbackSrc) {
      albumViewerImg.onerror = function () {
        albumViewerImg.onerror = null;
        albumViewerImg.src = fallbackSrc;
      };
    }
    albumViewerImg.alt = altText || 'Photo Malix';
    albumViewer.classList.remove('hidden');
  }

  function closeAlbumViewer() {
    if (!albumViewer) return;
    albumViewer.classList.add('hidden');
    if (albumViewerImg) {
      albumViewerImg.src = '';
    }
  }

  async function renderAlbum() {
    if (!albumFilterType || !albumGrid) return;
    const currentFilter = pendingAlbumTypeFilter || albumFilter || 'all';
    albumFilterType.innerHTML = '';
    const optionAll = document.createElement('option');
    optionAll.value = 'all';
    optionAll.textContent = 'Toutes les photos';
    albumFilterType.appendChild(optionAll);
    for (let type = 1; type <= collectionApi.MAX_TYPES; type += 1) {
      const option = document.createElement('option');
      option.value = String(type);
      option.textContent = typeName(type);
      albumFilterType.appendChild(option);
    }
    albumFilterType.value = currentFilter;
    albumFilter = currentFilter;
    pendingAlbumTypeFilter = currentFilter;

    albumGrid.innerHTML = '';
    const filtered = photoAlbum.filter(function (item) {
      return albumFilter === 'all' || String(item.type) === String(albumFilter);
    });
    if (filtered.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'album-empty';
      empty.textContent = 'Aucune photo pour le moment.';
      albumGrid.appendChild(empty);
      return;
    }

    for (let index = filtered.length - 1; index >= 0; index -= 1) {
      const item = filtered[index];
      const card = document.createElement('article');
      card.className = 'album-item';
      const button = document.createElement('button');
      button.type = 'button';
      const img = document.createElement('img');
      let resolvedSrc = item.dataUrl || '';
      let objectSrc = '';
      const blob = await getPhotoBlob(item.id);
      if (blob) {
        const objectUrl = URL.createObjectURL(blob);
        albumObjectUrls.push(objectUrl);
        objectSrc = objectUrl;
        if (!resolvedSrc) {
          resolvedSrc = objectUrl;
        }
      }
      img.src = resolvedSrc;
      if (objectSrc && resolvedSrc && objectSrc !== resolvedSrc) {
        img.onerror = function () {
          img.onerror = null;
          img.src = resolvedSrc;
        };
      }
      img.alt = resolvedSrc ? typeName(item.type) : 'Photo indisponible';
      button.appendChild(img);
      button.addEventListener('click', function () {
        openAlbumViewer(objectSrc || resolvedSrc, typeName(item.type), resolvedSrc);
      });
      card.appendChild(button);
      albumGrid.appendChild(card);
    }
  }

  function showGame() {
    if (desktopWelcomeMode) {
      showWelcomeScreen();
      return;
    }
    hideAllScreens();
    screenGame.classList.remove('hidden');
    generateObstacles();
    showSpawnApproachHint(2400);
    planNextSpawn();
  }

  function openMalidexSheet() {
    if (photoModeActive || screenGame.classList.contains('hidden') || !screenFinish.classList.contains('hidden')) {
      return;
    }
    if (!screenMalidex.classList.contains('hidden') && screenMalidex.classList.contains('is-open')) {
      return;
    }
    if (malidexCloseTimer) {
      window.clearTimeout(malidexCloseTimer);
      malidexCloseTimer = null;
    }
    clearSpawn();
    hideSpawnApproachHint();
    renderMalidex();
    closeDetail();
    setMalidexTab('malix');
    resetMalidexDrag();
    screenMalidex.classList.remove('hidden');
    screenMalidex.classList.remove('is-closing');
    window.requestAnimationFrame(function () {
      screenMalidex.classList.add('is-open');
    });
    openMalidexBtn.classList.add('is-hidden');
    openMalidexBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMalidexSheet(immediate) {
    if (screenMalidex.classList.contains('hidden')) {
      return;
    }
    closeDetail();
    if (malidexCloseTimer) {
      window.clearTimeout(malidexCloseTimer);
      malidexCloseTimer = null;
    }
    resetMalidexDrag();
    screenMalidex.classList.remove('is-open');

    if (immediate) {
      screenMalidex.classList.remove('is-closing');
      screenMalidex.classList.add('hidden');
      openMalidexBtn.classList.remove('is-hidden');
      openMalidexBtn.setAttribute('aria-expanded', 'false');
      if (!screenGame.classList.contains('hidden')) {
        planNextSpawn();
      }
      return;
    }

    screenMalidex.classList.add('is-closing');
    malidexCloseTimer = window.setTimeout(function () {
      screenMalidex.classList.remove('is-closing');
      screenMalidex.classList.add('hidden');
      openMalidexBtn.classList.remove('is-hidden');
      openMalidexBtn.setAttribute('aria-expanded', 'false');
      malidexCloseTimer = null;
      if (!screenGame.classList.contains('hidden')) {
        planNextSpawn();
      }
    }, 340);
  }

  function showFinish() {
    hideAllScreens();
    screenFinish.classList.remove('hidden');
    clearSpawn();
    hideSpawnApproachHint();
    finishDismissInProgress = false;
    launchFinale();
  }

  async function dismissFinishToMalidex() {
    if (finishDismissInProgress || screenFinish.classList.contains('hidden')) {
      return;
    }
    finishDismissInProgress = true;

    if (!reduceMotion && finishMalidexTarget) {
      const anchor = screenFinish.querySelector('.bravo') || screenFinish;
      const fromRect = anchor.getBoundingClientRect();
      const targetRect = finishMalidexTarget.getBoundingClientRect();
      const chip = document.createElement('div');
      chip.className = 'finish-transfer-chip';
      chip.textContent = 'Collection complete';
      chip.style.left = fromRect.left + fromRect.width / 2 - 70 + 'px';
      chip.style.top = fromRect.top + fromRect.height / 2 - 16 + 'px';
      document.body.appendChild(chip);

      const dx = targetRect.left + targetRect.width / 2 - (fromRect.left + fromRect.width / 2);
      const dy = targetRect.top + targetRect.height / 2 - (fromRect.top + fromRect.height / 2);
      const move = chip.animate(
        [
          { transform: 'translate3d(0,0,0) scale(1)', opacity: 1 },
          { transform: 'translate3d(' + dx + 'px,' + dy + 'px,0) scale(0.2)', opacity: 0.2 }
        ],
        {
          duration: 720,
          easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
          fill: 'forwards'
        }
      );

      await move.finished.catch(function () {});
      chip.remove();
    }

    screenFinish.classList.add('hidden');
    screenGame.classList.remove('hidden');
    openMalidexSheet();
    finishDismissInProgress = false;
  }

  function updateProgress() {
    const captured = collection.size;
    const percent = Math.max(0, Math.min(100, (captured / collectionApi.MAX_ENTRIES) * 100));

    if (progressText) {
      progressText.textContent = String(captured);
      if (progressText.parentElement) {
        progressText.parentElement.setAttribute('aria-label', captured + ' Malix attrapes');
      }
    }
    malidexProgress.textContent = String(captured);
    if (malidexProgress.parentElement) {
      malidexProgress.parentElement.setAttribute('aria-label', captured + ' Malix attrapes');
    }

    if (progressFill) {
      progressFill.style.width = percent + '%';
    }
    if (malidexProgressFill) {
      malidexProgressFill.style.width = percent + '%';
    }
    refreshAudienceSeats();
  }

  function persistCollection() {
    collectionApi.saveCollection(window.localStorage, collection);
    collectionApi.saveCounts(window.localStorage, captureCounts);
  }

  function openResetDialog() {
    if (!resetConfirmOverlay) return;
    resetConfirmOverlay.classList.remove('hidden');
  }

  function closeResetDialog() {
    if (!resetConfirmOverlay) return;
    resetConfirmOverlay.classList.add('hidden');
  }

  function isCollectionComplete() {
    return collectionApi.isComplete(collection);
  }

  function closeDetail() {
    if (!malidexDetail) return;
    malidexDetail.classList.add('hidden');
  }

  function openDetail(type, variant, isCollected, amount) {
    if (!malidexDetail || !detailVisual || !detailName || !detailRarity || !detailCaptures) return;

    if (isCollected) {
      setTypeVariantImage(detailVisual, type, variant);
    } else {
      detailVisual.src = typePath(type);
    }
    detailVisual.alt = '';
    detailVisual.style.filter = isCollected ? '' : 'brightness(0) saturate(0) opacity(0.25)';
    detailName.textContent = isCollected
      ? typeName(type) + ' · ' + variantName(variant)
      : 'Malix inconnu';
    detailRarity.textContent = 'Rareté: ' + rarityLabel(type, variant);
    detailCaptures.textContent = isCollected ? 'Captures: x' + amount : 'Pas encore attrape';
    malidexDetail.classList.remove('hidden');
  }

  function clearSpawn() {
    if (spawnTimer) {
      window.clearTimeout(spawnTimer);
      spawnTimer = null;
    }
    if (preSpawnHintTimer) {
      window.clearTimeout(preSpawnHintTimer);
      preSpawnHintTimer = null;
    }
    hideSpawnApproachHint();
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    if (currentSpawn && currentSpawn.el && currentSpawn.el.parentNode) {
      currentSpawn.el.remove();
    }
    currentSpawn = null;
    if (screenGame.classList.contains('hidden')) {
      clearObstacles();
    }
  }

  function scheduleSpawnDespawn(spawn) {
    if (!spawn) return;
    if (spawn.timeoutRef) {
      window.clearTimeout(spawn.timeoutRef);
      spawn.timeoutRef = null;
    }
    spawn.timeoutRef = window.setTimeout(function () {
      if (!currentSpawn || currentSpawn !== spawn) {
        return;
      }
      despawnCurrent();
      planNextSpawn();
    }, randomInt(5000, 10000));
  }

  function spawnNow() {
    if (
      currentSpawn ||
      captureBusy ||
      photoModeActive ||
      isCollectionComplete() ||
      screenGame.classList.contains('hidden') ||
      isLandscape() ||
      !screenMalidex.classList.contains('hidden')
    ) {
      return;
    }
    hideSpawnApproachHint();

    const type = randomType();
    const variant = randomVariant();
    const marginRatio = 0.1;

    const playRect = playzone.getBoundingClientRect();
    const size = Math.min(playRect.width, playRect.height) * 0.2;
    const marginX = playRect.width * marginRatio;
    const marginY = playRect.height * marginRatio;

    const minX = marginX;
    const maxX = Math.max(marginX, playRect.width - size - marginX);
    const minY = marginY;
    const maxY = Math.max(marginY, playRect.height - size - marginY);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'spawn';
    button.setAttribute('aria-label', 'Malix');
    button.style.width = size + 'px';

    const inner = document.createElement('img');
    inner.className = 'spawn-inner';
    setTypeVariantImage(inner, type, variant);
    inner.alt = '';
    inner.style.filter = 'drop-shadow(0 8px 12px rgba(0, 0, 0, 0.25))';
    button.appendChild(inner);

    playzone.appendChild(button);

    let spawnX = randomFloat(minX, maxX);
    let spawnY = randomFloat(minY, maxY);
    for (let attempt = 0; attempt < 14; attempt += 1) {
      const candidate = { x: spawnX, y: spawnY, w: size, h: size };
      if (!intersectsAnyObstacle(candidate)) {
        break;
      }
      spawnX = randomFloat(minX, maxX);
      spawnY = randomFloat(minY, maxY);
    }

    const state = {
      el: button,
      type: type,
      variant: variant,
      x: spawnX,
      y: spawnY,
      vx: randomFloat(-0.55, 0.55),
      vy: randomFloat(-0.4, 0.4),
      gravity: 0.008,
      timeoutRef: null,
      size: size,
      playRect: playRect,
      frameCount: 0,
      nextRhythmShiftIn: 0,
      accelX: 0,
      accelY: 0,
      rarityNervosity: getRarityScale(type, variant),
      pointerDown: false,
      pointerId: null,
      pressStartX: 0,
      pressStartY: 0,
      dragDx: 0,
      dragDy: 0,
      pointerOffsetX: 0,
      pointerOffsetY: 0,
      swipeSamples: [],
      swipeTurnAccum: 0
    };

    const speedBoost = 0.25 + state.rarityNervosity * 0.95;
    state.vx *= speedBoost;
    state.vy *= speedBoost;
    state.nextRhythmShiftIn = randomInt(
      Math.max(12, Math.round(85 - state.rarityNervosity * 65)),
      Math.max(26, Math.round(145 - state.rarityNervosity * 90))
    );

    scheduleSpawnDespawn(state);

    button.addEventListener('pointerdown', function (event) {
      if (!currentSpawn || currentSpawn !== state || captureBusy || photoModeActive) {
        return;
      }
      state.pointerDown = true;
      state.pointerId = event.pointerId;
      state.pressStartX = event.clientX;
      state.pressStartY = event.clientY;
      state.dragDx = 0;
      state.dragDy = 0;
      const zoneRect = playzone.getBoundingClientRect();
      state.pointerOffsetX = event.clientX - zoneRect.left - state.x;
      state.pointerOffsetY = event.clientY - zoneRect.top - state.y;
      state.vx = 0;
      state.vy = 0;
      state.accelX = 0;
      state.accelY = 0;
      if (state.timeoutRef) {
        window.clearTimeout(state.timeoutRef);
        state.timeoutRef = null;
      }
      state.swipeSamples = [
        {
          x: event.clientX,
          y: event.clientY,
          t: event.timeStamp || performance.now()
        }
      ];
      state.swipeTurnAccum = 0;
      event.preventDefault();
    });

    button.addEventListener('pointermove', function (event) {
      if (!state.pointerDown || state.pointerId !== event.pointerId) {
        return;
      }
      const dx = event.clientX - state.pressStartX;
      const dy = event.clientY - state.pressStartY;
      state.dragDx = dx;
      state.dragDy = dy;
      const zoneRect = playzone.getBoundingClientRect();
      const maxX = Math.max(0, zoneRect.width - state.size);
      const maxY = Math.max(0, zoneRect.height - state.size);
      state.x = Math.max(0, Math.min(maxX, event.clientX - zoneRect.left - state.pointerOffsetX));
      state.y = Math.max(0, Math.min(maxY, event.clientY - zoneRect.top - state.pointerOffsetY));
      state.el.style.transform = 'translate3d(' + state.x + 'px,' + state.y + 'px,0)';
      const now = event.timeStamp || performance.now();
      state.swipeSamples.push({ x: event.clientX, y: event.clientY, t: now });
      while (state.swipeSamples.length > 10) {
        state.swipeSamples.shift();
      }

      if (state.swipeSamples.length >= 3) {
        const l = state.swipeSamples.length;
        const a = state.swipeSamples[l - 3];
        const b = state.swipeSamples[l - 2];
        const c = state.swipeSamples[l - 1];
        const abx = b.x - a.x;
        const aby = b.y - a.y;
        const bcx = c.x - b.x;
        const bcy = c.y - b.y;
        const mag1 = Math.hypot(abx, aby);
        const mag2 = Math.hypot(bcx, bcy);
        if (mag1 > 2 && mag2 > 2) {
          const dot = abx * bcx + aby * bcy;
          const det = abx * bcy - aby * bcx;
          const turn = Math.atan2(det, dot);
          state.swipeTurnAccum += turn;
        }
      }
      event.preventDefault();
    });

    button.addEventListener('pointerup', function (event) {
      if (!state.pointerDown || state.pointerId !== event.pointerId) {
        return;
      }
      state.pointerDown = false;
      state.pointerId = null;

      if (!currentSpawn || currentSpawn !== state || captureBusy || photoModeActive) {
        return;
      }

      const gestureDistance = Math.hypot(state.dragDx, state.dragDy);
      if (gestureDistance <= 14) {
        captureCurrent();
      } else {
        const samples = state.swipeSamples;
        const last = samples[samples.length - 1];
        let reference = samples[0];
        for (let index = samples.length - 2; index >= 0; index -= 1) {
          if (last.t - samples[index].t >= 45) {
            reference = samples[index];
            break;
          }
        }

        const dt = Math.max(16, last.t - reference.t);
        const vxPxMs = (last.x - reference.x) / dt;
        const vyPxMs = (last.y - reference.y) / dt;
        const swipeSpeed = Math.hypot(vxPxMs, vyPxMs);

        const directionX = swipeSpeed > 0.001 ? vxPxMs / swipeSpeed : state.dragDx / gestureDistance;
        const directionY = swipeSpeed > 0.001 ? vyPxMs / swipeSpeed : state.dragDy / gestureDistance;

        const baseSpeed = Math.min(3.6, Math.max(0.7, swipeSpeed * 40));
        const spinTurns = Math.min(2, Math.abs(state.swipeTurnAccum) / (Math.PI * 2));
        const spinBoost = 1 + spinTurns * 0.5;
        const spinSign = Math.sign(state.swipeTurnAccum) || 1;
        const tangentKick = Math.min(1.2, spinTurns * 0.7) * spinSign;

        let nextVx = directionX * baseSpeed * spinBoost - directionY * tangentKick;
        let nextVy = directionY * baseSpeed * spinBoost + directionX * tangentKick;
        const maxLaunch = 4.6;
        nextVx = Math.max(-maxLaunch, Math.min(maxLaunch, nextVx));
        nextVy = Math.max(-maxLaunch, Math.min(maxLaunch, nextVy));

        state.vx = nextVx;
        state.vy = nextVy;
        scheduleSpawnDespawn(state);
      }

      state.dragDx = 0;
      state.dragDy = 0;
      state.swipeSamples = [];
      state.swipeTurnAccum = 0;
      event.preventDefault();
    });

    button.addEventListener('pointercancel', function (event) {
      if (state.pointerId !== event.pointerId) {
        return;
      }
      state.pointerDown = false;
      state.pointerId = null;
      state.dragDx = 0;
      state.dragDy = 0;
      state.swipeSamples = [];
      state.swipeTurnAccum = 0;
      if (!state.timeoutRef && currentSpawn && currentSpawn === state) {
        scheduleSpawnDespawn(state);
      }
    });

    currentSpawn = state;
    button.style.left = '0px';
    button.style.top = '0px';
    button.style.transform = 'translate3d(' + state.x + 'px,' + state.y + 'px,0)';

    if (!reduceMotion) {
      animateSpawn();
    }
    hasSpawnedAtLeastOnce = true;

    if (window.navigator && typeof window.navigator.vibrate === 'function') {
      window.navigator.vibrate(20);
    }
  }

  function animateSpawn() {
    if (!currentSpawn) return;

    const spawn = currentSpawn;
    if (spawn.pointerDown) {
      spawn.el.style.transform = 'translate3d(' + spawn.x + 'px,' + spawn.y + 'px,0)';
      animationFrame = window.requestAnimationFrame(animateSpawn);
      return;
    }
    spawn.frameCount += 1;

    // Rarer Malix are more nervous: stronger random acceleration and more frequent rhythm shifts.
    const nervosity = spawn.rarityNervosity;
    const accelChance = 0.015 + nervosity * 0.085;
    if (Math.random() < accelChance) {
      spawn.accelX = randomFloat(-0.02, 0.02) * (1 + nervosity * 2.2);
      spawn.accelY = randomFloat(-0.018, 0.018) * (1 + nervosity * 2);
    }

    if (spawn.frameCount >= spawn.nextRhythmShiftIn) {
      const directionKick = 0.2 + nervosity * 1.25;
      spawn.vx += randomFloat(-directionKick, directionKick);
      spawn.vy += randomFloat(-directionKick, directionKick * 0.8);

      if (Math.random() < 0.28 + nervosity * 0.55) {
        spawn.vx *= -1;
      }
      if (Math.random() < 0.16 + nervosity * 0.45) {
        spawn.vy *= -1;
      }

      spawn.frameCount = 0;
      spawn.nextRhythmShiftIn = randomInt(
        Math.max(10, Math.round(80 - nervosity * 66)),
        Math.max(22, Math.round(140 - nervosity * 92))
      );
    }

    spawn.vx += spawn.accelX;
    spawn.vy += spawn.gravity + spawn.accelY;
    spawn.accelX *= 0.95;
    spawn.accelY *= 0.95;

    const speedLimit = 1.15 + nervosity * 2.2;
    spawn.vx = Math.max(-speedLimit, Math.min(speedLimit, spawn.vx));
    spawn.vy = Math.max(-speedLimit, Math.min(speedLimit, spawn.vy));

    spawn.x += spawn.vx;
    spawn.y += spawn.vy;
    resolveObstacleCollisions(spawn);

    const maxX = spawn.playRect.width - spawn.size;
    const maxY = spawn.playRect.height - spawn.size;

    if (spawn.x <= 0 || spawn.x >= maxX) {
      spawn.vx *= -0.92;
      spawn.x = Math.max(0, Math.min(maxX, spawn.x));
    }
    if (spawn.y <= 0 || spawn.y >= maxY) {
      spawn.vy *= -0.9;
      spawn.y = Math.max(0, Math.min(maxY, spawn.y));
    }

    spawn.el.style.transform = 'translate3d(' + spawn.x + 'px,' + spawn.y + 'px,0)';

    animationFrame = window.requestAnimationFrame(animateSpawn);
  }

  function despawnCurrent() {
    if (!currentSpawn) return;

    if (currentSpawn.timeoutRef) {
      window.clearTimeout(currentSpawn.timeoutRef);
    }
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    if (currentSpawn.el && currentSpawn.el.parentNode) {
      currentSpawn.el.remove();
    }
    currentSpawn = null;
  }

  function waitForTap(element) {
    return new Promise(function (resolve) {
      function cleanup() {
        element.removeEventListener('pointerup', onPointer);
        element.removeEventListener('keydown', onKey);
      }

      function onPointer() {
        cleanup();
        resolve();
      }

      function onKey(event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          cleanup();
          resolve();
        }
      }

      element.addEventListener('pointerup', onPointer);
      element.addEventListener('keydown', onKey);
    });
  }

  function spawnUnlockConfetti(container) {
    const pieces = reduceMotion ? 8 : 20;
    for (let index = 0; index < pieces; index += 1) {
      const piece = document.createElement('span');
      piece.className = 'unlock-confetti';
      piece.style.left = randomFloat(10, 90) + '%';
      piece.style.top = randomFloat(8, 26) + '%';
      piece.style.background = variantColors[randomInt(0, variantColors.length - 1)];
      piece.style.animationDelay = randomFloat(0, 0.35) + 's';
      piece.style.animationDuration = randomFloat(0.65, 1.15) + 's';
      container.appendChild(piece);
      window.setTimeout(function () {
        piece.remove();
      }, 1300);
    }
  }

  async function runCaptureSequence(type, variant, isNewCapture, isFirstTypeDiscovery) {
    if (!captureOverlay) return;

    captureOverlay.innerHTML = '';
    captureOverlay.classList.remove('hidden');
    captureOverlay.classList.add('is-active');
    captureOverlay.tabIndex = 0;

    const card = document.createElement('div');
    card.className = 'capture-card';

    const name = document.createElement('h3');
    name.className = 'capture-name';
    name.textContent = typeName(type);

    const preview = document.createElement('img');
    setTypeVariantImage(preview, type, variant);
    preview.alt = '';
    preview.style.filter = '';
    if (!reduceMotion) {
      preview.classList.add('capture-preview-spin');
    }

    const text = document.createElement('p');
    text.className = 'capture-text';
    if (isFirstTypeDiscovery) {
      const rarity = rarityLabel(type, variant);
      text.textContent =
        unlockExcitementByRarity(rarity) +
        ', tu viens de debloquer un ' +
        typeName(type) +
        ' ' +
        rarityNounForm(rarity) +
        ' !';
    } else if (isNewCapture) {
      text.textContent = "Bravo, tu viens d'attraper un " + typeName(type) + '!';
    } else {
      text.textContent = typeName(type) + ' deja attrape ! +1 dans ton Malidex.';
    }

    card.appendChild(name);
    card.appendChild(preview);
    card.appendChild(text);
    captureOverlay.appendChild(card);
    if (isFirstTypeDiscovery) {
      spawnUnlockConfetti(captureOverlay);
    }
    captureOverlay.focus();

    if (window.navigator && typeof window.navigator.vibrate === 'function') {
      window.navigator.vibrate(isNewCapture ? [30, 35, 30] : [20, 20, 20]);
    }

    await waitForTap(captureOverlay);

    const from = card.getBoundingClientRect();
    const to = openMalidexBtn.getBoundingClientRect();
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);

    if (!reduceMotion) {
      const flyAnimation = card.animate(
        [
          { transform: 'translate3d(0, 0, 0) scale(1)', opacity: 1 },
          { transform: 'translate3d(' + dx + 'px, ' + dy + 'px, 0) scale(0.18)', opacity: 0.2 }
        ],
        {
          duration: 900,
          easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
          fill: 'forwards'
        }
      );

      await flyAnimation.finished.catch(function () {});
    }

    captureOverlay.classList.add('hidden');
    captureOverlay.classList.remove('is-active');
    captureOverlay.innerHTML = '';
  }

  async function captureCurrent() {
    if (!currentSpawn || captureBusy) return;
    captureBusy = true;

    const captured = currentSpawn;
    const entryId = collectionApi.makeId(captured.type, captured.variant);
    const isNewCapture = !collection.has(entryId);
    const isFirstTypeDiscovery = !isTypeDiscovered(captured.type);
    collection = collectionApi.addCapture(collection, captured.type, captured.variant);
    captureCounts = collectionApi.incrementCount(captureCounts, captured.type, captured.variant);
    generateObstacles();
    persistCollection();
    updateProgress();
    renderMalidex();

    if (captured.timeoutRef) {
      window.clearTimeout(captured.timeoutRef);
    }

    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    addSparkles(captured.x + captured.size / 2, captured.y + captured.size / 2);
    if (captured.el.parentNode) {
      captured.el.remove();
    }

    currentSpawn = null;

    await runCaptureSequence(captured.type, captured.variant, isNewCapture, isFirstTypeDiscovery);

    if (collectionApi.isComplete(collection)) {
      captureBusy = false;
      showFinish();
      return;
    }

    captureBusy = false;
    planNextSpawn();
  }

  function addSparkles(x, y) {
    const amount = reduceMotion ? 2 : 7;
    for (let index = 0; index < amount; index += 1) {
      const dot = document.createElement('span');
      dot.className = 'sparkle';
      dot.style.left = x + randomFloat(-20, 20) + 'px';
      dot.style.top = y + randomFloat(-20, 20) + 'px';
      dot.style.backgroundColor = variantColors[randomInt(0, 3)];
      playzone.appendChild(dot);
      window.setTimeout(function () {
        dot.remove();
      }, reduceMotion ? 120 : 460);
    }
  }

  function planNextSpawn() {
    if (
      spawnTimer ||
      currentSpawn ||
      captureBusy ||
      photoModeActive ||
      isCollectionComplete() ||
      screenGame.classList.contains('hidden') ||
      isLandscape() ||
      !screenMalidex.classList.contains('hidden')
    ) {
      return;
    }
    const delay = isCheatAllowed()
      ? hasSpawnedAtLeastOnce
        ? randomInt(3000, 12000)
        : randomInt(450, 1200)
      : randomInt(10000, 60000);
    const preHintLead = Math.min(2600, Math.max(1100, Math.floor(delay * 0.35)));
    const preHintDelay = Math.max(0, delay - preHintLead);
    preSpawnHintTimer = window.setTimeout(function () {
      preSpawnHintTimer = null;
      showSpawnApproachHint(preHintLead + 520);
    }, preHintDelay);
    spawnTimer = window.setTimeout(function () {
      spawnTimer = null;
      spawnNow();
    }, delay);
  }

  function renderMalidex() {
    malidexGrid.innerHTML = '';
    for (let type = 1; type <= collectionApi.MAX_TYPES; type += 1) {
      const card = document.createElement('article');
      card.className = 'type-card';

      const title = document.createElement('h3');
      title.className = 'type-title';
      const discoveredType = isTypeDiscovered(type);
      title.textContent = discoveredType ? String(type).padStart(2, '0') + ' · ' + typeName(type) : 'Malix inconnu';

      const variants = document.createElement('div');
      variants.className = 'variants';

      for (let variant = 1; variant <= collectionApi.MAX_VARIANTS; variant += 1) {
        const dot = document.createElement('div');
        dot.className = 'variant-dot';
        dot.tabIndex = 0;
        dot.setAttribute('role', 'button');
        const entryId = collectionApi.makeId(type, variant);
        const amount = captureCounts[entryId] || 0;
        const isCollected = collection.has(entryId);
        dot.style.setProperty('--slot-color', variantColors[variant - 1]);
        if (!discoveredType) {
          dot.classList.add('locked');
        }

        if (isCollected) {
          dot.classList.add('collected');
        }

        if (discoveredType) {
          const preview = document.createElement('img');
          preview.className = 'variant-thumb';
          setTypeVariantImage(preview, type, variant);
          preview.alt = '';
          if (isCollected) {
            preview.style.filter = '';
          }
          dot.appendChild(preview);
        } else {
          const lock = document.createElement('span');
          lock.className = 'variant-lock';
          lock.textContent = '?';
          dot.appendChild(lock);
        }

        const count = document.createElement('span');
        count.className = 'variant-count';
        count.textContent = discoveredType && isCollected ? 'x' + amount : '';

        dot.appendChild(count);
        if (discoveredType) {
          dot.addEventListener('click', function () {
            openDetail(type, variant, isCollected, amount);
          });
          dot.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openDetail(type, variant, isCollected, amount);
            }
          });
        } else {
          dot.tabIndex = -1;
        }
        variants.appendChild(dot);
      }

      card.appendChild(title);
      card.appendChild(variants);
      malidexGrid.appendChild(card);
    }

    const resetRow = document.createElement('div');
    resetRow.className = 'malidex-reset-row';

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'reset-icon-btn';
    resetBtn.setAttribute('aria-label', 'Reinitialiser la collection');
    resetBtn.textContent = '🗑';
    resetBtn.addEventListener('click', openResetDialog);

    if (isCheatAllowed()) {
      const cheatBtn = document.createElement('button');
      cheatBtn.type = 'button';
      cheatBtn.className = 'reset-icon-btn cheat-icon-btn';
      cheatBtn.setAttribute('aria-label', 'Mode cheat: terminer la collection');
      cheatBtn.textContent = '⚡';
      cheatBtn.addEventListener('click', unlockAllMalix);
      resetRow.appendChild(cheatBtn);
    }

    resetRow.appendChild(resetBtn);
    malidexGrid.appendChild(resetRow);

    updateProgress();
  }

  function launchFinale() {
    finaleZone.innerHTML = '';
    const count = reduceMotion ? 12 : 52;
    for (let index = 0; index < count; index += 1) {
      const sprite = document.createElement('img');
      sprite.className = 'finale-sprite';
      const type = randomType();
      const variant = randomVariant();

      setTypeVariantImage(sprite, type, variant);
      sprite.alt = '';
      sprite.style.left = randomFloat(0, 92) + '%';
      sprite.style.animationDelay = randomFloat(0, reduceMotion ? 0.2 : 1.6) + 's';
      sprite.style.animationDuration = randomFloat(2.2, 4.5) + 's';
      sprite.style.filter = '';
      finaleZone.appendChild(sprite);
    }
  }

  function resetCollection() {
    collection = collectionApi.emptyState();
    captureCounts = collectionApi.emptyCounts();
    collectionApi.clearCollection(window.localStorage);
    collectionApi.clearCounts(window.localStorage);
    closeResetDialog();
    updateProgress();
    renderMalidex();
    closeMalidexSheet(false);
    refreshAudienceSeats();
  }

  function unlockAllMalix() {
    let nextCollection = collectionApi.emptyState();
    let nextCounts = collectionApi.emptyCounts();

    for (let type = 1; type <= collectionApi.MAX_TYPES; type += 1) {
      for (let variant = 1; variant <= collectionApi.MAX_VARIANTS; variant += 1) {
        nextCollection = collectionApi.addCapture(nextCollection, type, variant);
        nextCounts = collectionApi.incrementCount(nextCounts, type, variant);
      }
    }

    collection = nextCollection;
    captureCounts = nextCounts;
    persistCollection();
    updateProgress();
    renderMalidex();
    closeMalidexSheet(true);
    showFinish();
  }

  function isLandscape() {
    return window.innerWidth > window.innerHeight;
  }

  function syncOrientationGuard() {
    if (desktopWelcomeMode) {
      landscapeGuard.classList.add('hidden');
      clearObstacles();
      return;
    }
    if (isLandscape()) {
      if (photoModeActive) {
        stopPhotoMode();
      }
      landscapeGuard.classList.remove('hidden');
      closeMalidexSheet(true);
      clearSpawn();
      return;
    }

    landscapeGuard.classList.add('hidden');
    if (!screenGame.classList.contains('hidden')) {
      generateObstacles();
      planNextSpawn();
    }
  }

  openMalidexBtn.addEventListener('click', openMalidexSheet);
  playzone.addEventListener('contextmenu', function (event) {
    event.preventDefault();
  });
  openPhotoModeBtn.addEventListener('click', openPhotoMode);
  closePhotoModeBtn.addEventListener('click', stopPhotoMode);
  takePhotoBtn.addEventListener('click', takePhotoShot);
  if (malidexTabMalixBtn) {
    malidexTabMalixBtn.addEventListener('click', function () {
      setMalidexTab('malix');
    });
  }
  if (malidexTabAlbumBtn) {
    malidexTabAlbumBtn.addEventListener('click', function () {
      setMalidexTab('album');
    });
  }
  if (albumViewerImg) {
    albumViewerImg.addEventListener('click', closeAlbumViewer);
  }
  shareAlbumPhotoBtn.addEventListener('click', function () {
    showGameNotice('Partage bientot disponible.');
  });
  albumFilterType.addEventListener('change', function () {
    albumFilter = albumFilterType.value;
    pendingAlbumTypeFilter = albumFilter;
    renderAlbum();
  });
  albumViewer.addEventListener('click', function (event) {
    if (event.target !== shareAlbumPhotoBtn) {
      closeAlbumViewer();
    }
  });
  closeMalidexBtn.addEventListener('click', function () {
    closeMalidexSheet(false);
  });
  screenMalidex.addEventListener('click', function (event) {
    if (malidexDetail && !malidexDetail.classList.contains('hidden')) {
      if (!event.target.closest('.variant-dot')) {
        closeDetail();
      }
    }
  });
  screenFinish.addEventListener('click', function () {
    dismissFinishToMalidex();
  });
  cancelResetBtn.addEventListener('click', closeResetDialog);
  confirmResetBtn.addEventListener('click', resetCollection);
  resetConfirmOverlay.addEventListener('click', function (event) {
    if (event.target === resetConfirmOverlay) {
      closeResetDialog();
    }
  });

  window.addEventListener('resize', syncOrientationGuard);
  window.addEventListener('orientationchange', syncOrientationGuard);

  if (malidexHandle) {
    malidexHandle.addEventListener('pointerdown', function (event) {
      if (
        event.button !== 0 ||
        screenMalidex.classList.contains('hidden') ||
        !screenMalidex.classList.contains('is-open') ||
        screenMalidex.classList.contains('is-closing')
      ) {
        return;
      }

      if (malidexCloseTimer) {
        window.clearTimeout(malidexCloseTimer);
        malidexCloseTimer = null;
      }

      malidexDragPointerId = event.pointerId;
      malidexDragStartY = event.clientY;
      malidexDragCurrentY = event.clientY;
      malidexDragLastY = event.clientY;
      malidexDragLastTime = performance.now();
      malidexDragVelocity = 0;
      screenMalidex.classList.add('is-dragging');
      malidexHandle.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    malidexHandle.addEventListener('pointermove', function (event) {
      if (malidexDragPointerId !== event.pointerId) {
        return;
      }

      const now = performance.now();
      const dy = Math.max(0, event.clientY - malidexDragStartY);
      const dt = now - malidexDragLastTime;
      if (dt > 0) {
        malidexDragVelocity = (event.clientY - malidexDragLastY) / dt;
      }

      malidexDragCurrentY = event.clientY;
      malidexDragLastY = event.clientY;
      malidexDragLastTime = now;
      screenMalidex.style.transform = 'translateY(' + dy + 'px)';
      event.preventDefault();
    });

    const onHandleRelease = function (event) {
      if (malidexDragPointerId !== event.pointerId) {
        return;
      }

      const dy = Math.max(0, malidexDragCurrentY - malidexDragStartY);
      const velocity = Math.max(0, malidexDragVelocity);
      const closeDistance = Math.min(180, Math.max(96, screenMalidex.offsetHeight * 0.24));
      const shouldClose = dy >= closeDistance || velocity >= 0.5;
      if (malidexHandle.hasPointerCapture(event.pointerId)) {
        malidexHandle.releasePointerCapture(event.pointerId);
      }
      resetMalidexDrag();
      if (shouldClose) {
        closeMalidexSheet(false);
      }
    };

    malidexHandle.addEventListener('pointerup', onHandleRelease);
    malidexHandle.addEventListener('pointercancel', onHandleRelease);
  }

  ensureCountsConsistency();
  audienceSeatAssignment = loadAudienceSeatAssignment();
  buildAudienceSeats();
  desktopWelcomeMode = !isPhoneDevice();
  updateProgress();
  if (desktopWelcomeMode) {
    showWelcomeScreen();
  } else if (collectionApi.isComplete(collection)) {
    showFinish();
  } else {
    showGame();
  }
  renderMalidex();
  syncOrientationGuard();

  // Keep a reference for manual debug in browser console when needed.
  app.dataset.malixReady = 'true';
})();
