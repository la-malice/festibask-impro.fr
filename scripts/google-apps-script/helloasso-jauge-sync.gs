/**
 * Synchronisation HelloAsso → feuille de jauge (Google Apps Script).
 *
 * Copiez ce fichier dans le projet Apps Script lié à votre Google Sheet
 * (Extensions → Apps Script). Ne commitez jamais de secrets dans le dépôt :
 * HA_CLIENT_ID, HA_CLIENT_SECRET, HA_REFRESH_TOKEN vont dans
 * Paramètres du projet → Propriétés du script.
 *
 * Doc métier : docs/slices/helloasso-jauge-sync.md
 */
var HA_TOKEN_URL = 'https://api.helloasso.com/oauth2/token';
var HA_API_BASE = 'https://api.helloasso.com/v5';

/** Valeurs acceptées par l'API v5 (segment `formType` dans l'URL). */
var HA_VALID_FORM_TYPES = [
  'CrowdFunding',
  'Membership',
  'Event',
  'Donation',
  'PaymentForm',
  'Checkout',
  'Shop',
];

/**
 * Si la propriété HA_FORM_TYPE vaut « Form » (invalide pour l’API), la remplace par « Event »
 * dans les propriétés du script (correction durable). L’URL correcte contient `/forms/Event/`, pas `/forms/Form/`.
 * @see https://dev.helloasso.com/reference/get_organizations-organizationslug-forms-formtype-formslug-orders
 */
function migrateInvalidFormTypeProperty_(props) {
  var raw = props.getProperty('HA_FORM_TYPE');
  if (!raw) return;
  var t = String(raw).trim();
  if (/^form$/i.test(t)) {
    props.setProperty('HA_FORM_TYPE', 'Event');
    Logger.log("Propriété HA_FORM_TYPE « Form » → « Event » (l’URL API doit contenir /forms/Event/…, pas /forms/Form/…).");
  }
}

/**
 * Normalise la valeur utilisée dans l’URL (enum API v5). « Form » → Event.
 */
function normalizeHelloAssoFormType_(raw) {
  var t = String(raw == null || raw === '' ? 'Event' : raw).trim();
  // Confusion fréquente : « Form » n'est pas un enum ; pour Festibask c'est une billetterie événement.
  if (/^form$/i.test(t)) return 'Event';
  var i;
  for (i = 0; i < HA_VALID_FORM_TYPES.length; i++) {
    if (HA_VALID_FORM_TYPES[i].toLowerCase() === t.toLowerCase()) return HA_VALID_FORM_TYPES[i];
  }
  Logger.log(
    'HA_FORM_TYPE inconnu (« ' +
      t +
      ' ») — utilisation de Event. Corrigez la propriété du script si besoin (CrowdFunding, Membership, Event, …).'
  );
  return 'Event';
}

/**
 * Première authentification : enregistre HA_REFRESH_TOKEN dans les propriétés du script.
 */
function bootstrapHelloAssoToken() {
  var props = PropertiesService.getScriptProperties();
  var clientId = props.getProperty('HA_CLIENT_ID');
  var clientSecret = props.getProperty('HA_CLIENT_SECRET');
  if (!clientId || !clientSecret) {
    throw new Error('Renseignez HA_CLIENT_ID et HA_CLIENT_SECRET dans Propriétés du script.');
  }
  var res = UrlFetchApp.fetch(HA_TOKEN_URL, {
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    muteHttpExceptions: true,
    payload: {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    },
  });
  if (res.getResponseCode() !== 200) {
    throw new Error('HelloAsso client_credentials : ' + res.getResponseCode() + ' ' + res.getContentText());
  }
  var body = JSON.parse(res.getContentText());
  if (body.refresh_token) {
    props.setProperty('HA_REFRESH_TOKEN', body.refresh_token);
  }
  Logger.log('OK — refresh_token enregistré.');
}

/**
 * Liste des **articles vendus** du formulaire (aligné statistiques / tarifs, y compris anciens tarifs désactivés
 * s’ils figurent encore dans l’API). Préféré à /orders pour éviter sous-décompte (pagination, items manquants).
 * @see https://dev.helloasso.com/reference/get_organizations-organizationslug-forms-formtype-formslug-items
 */
function buildHelloAssoFormItemsPageUrl_(props, pageIndex, pageSize, continuationToken) {
  migrateInvalidFormTypeProperty_(props);
  var org = props.getProperty('HA_ORG_SLUG') || 'arteateou';
  var formType = normalizeHelloAssoFormType_(props.getProperty('HA_FORM_TYPE'));
  var formSlug = props.getProperty('HA_FORM_SLUG') || 'festibask-impro';
  var path =
    '/organizations/' +
    encodeURIComponent(org) +
    '/forms/' +
    encodeURIComponent(formType) +
    '/' +
    encodeURIComponent(formSlug) +
    '/items';
  var parts = [];
  if (continuationToken) {
    parts.push('continuationToken=' + encodeURIComponent(continuationToken));
  } else {
    parts.push('pageIndex=' + encodeURIComponent(String(pageIndex || 1)));
  }
  parts.push('pageSize=' + encodeURIComponent(String(pageSize || 100)));
  return HA_API_BASE + path + '?' + parts.join('&');
}

/** Repli diagnostic : commandes complètes (moins aligné statistiques). */
function buildHelloAssoOrdersPageUrl_(props, pageIndex, pageSize, continuationToken) {
  migrateInvalidFormTypeProperty_(props);
  var org = props.getProperty('HA_ORG_SLUG') || 'arteateou';
  var formType = normalizeHelloAssoFormType_(props.getProperty('HA_FORM_TYPE'));
  var formSlug = props.getProperty('HA_FORM_SLUG') || 'festibask-impro';
  var path =
    '/organizations/' +
    encodeURIComponent(org) +
    '/forms/' +
    encodeURIComponent(formType) +
    '/' +
    encodeURIComponent(formSlug) +
    '/orders';
  var parts = [];
  if (continuationToken) {
    parts.push('continuationToken=' + encodeURIComponent(continuationToken));
  } else {
    parts.push('pageIndex=' + encodeURIComponent(String(pageIndex || 1)));
  }
  parts.push('pageSize=' + encodeURIComponent(String(pageSize || 100)));
  return HA_API_BASE + path + '?' + parts.join('&');
}

/**
 * Synchronise les totaux HelloAsso (ligne 1j + ligne 3J) et la colonne F « Dernier relevé ».
 */
function syncHelloAssoResas() {
  var props = PropertiesService.getScriptProperties();
  var accessToken = getHelloAssoAccessToken_(props);
  var lineItems = fetchAllCountableLineItems_(props, accessToken);
  Logger.log('Lignes billet HelloAsso agrégées : ' + lineItems.length);
  logDiagnosticVendrediExcluded_(lineItems);
  var agg = aggregateReservationsFromLineItems_(lineItems);
  Logger.log(
    'Comptes HelloAsso 1j : ven=' +
      agg.oneDay.vendredi +
      ', sam=' +
      agg.oneDay.samedi +
      ', dim=' +
      agg.oneDay.dimanche +
      ' | pass 3j (ligne dédiée)=' +
      agg.threeDay
  );

  var cfg = getConfig_();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(cfg.sheetName);

  sh.getRange(cfg.cellHelloAsso1jVendredi).setValue(agg.oneDay.vendredi);
  sh.getRange(cfg.cellHelloAsso1jSamedi).setValue(agg.oneDay.samedi);
  sh.getRange(cfg.cellHelloAsso1jDimanche).setValue(agg.oneDay.dimanche);

  sh.getRange(cfg.rangeHelloAsso3j).setValues([[agg.threeDay, agg.threeDay, agg.threeDay]]);

  writeDernierReleve_(sh, cfg.dernierReleveCells);
}

function writeDernierReleve_(sheet, cellRefsA1) {
  if (!cellRefsA1 || !cellRefsA1.length) return;
  var tz = 'Europe/Paris';
  var label = Utilities.formatDate(new Date(), tz, 'dd/MM/yyyy');
  for (var i = 0; i < cellRefsA1.length; i++) {
    sheet.getRange(cellRefsA1[i]).setValue(label);
  }
}

/**
 * Cellules à adapter à votre feuille (défaut : ligne 10 = pass 1 jour, ligne 11 = pass 3 jours).
 */
function getConfig_() {
  return {
    sheetName: 'Jauge',
    cellHelloAsso1jVendredi: 'B10',
    cellHelloAsso1jSamedi: 'C10',
    cellHelloAsso1jDimanche: 'D10',
    rangeHelloAsso3j: 'B11:D11',
    dernierReleveCells: ['F10', 'F11'],
  };
}

/**
 * Charge tous les articles (/items). Si l’endpoint échoue, repli sur /orders + aplatissement des items.
 */
function fetchAllCountableLineItems_(props, accessToken) {
  try {
    return fetchAllPagesGeneric_(props, accessToken, buildHelloAssoFormItemsPageUrl_);
  } catch (err) {
    Logger.log('Endpoint /items indisponible ou erreur — repli sur /orders : ' + err);
    return flattenOrderItemsFromOrders_(fetchAllPagesGeneric_(props, accessToken, buildHelloAssoOrdersPageUrl_));
  }
}

/**
 * Pagination robuste : ne s’arrête pas sur totalPages=1 si la page est pleine (bug sous-décompte).
 * Gère continuationToken quand l’API le renvoie.
 */
function fetchAllPagesGeneric_(props, accessToken, buildUrlFn) {
  var pageSize = 100;
  var rows = [];
  var pageIndex = 1;
  var continuationToken = '';
  var maxIterations = 2000;
  var iter;
  for (iter = 0; iter < maxIterations; iter++) {
    var url = buildUrlFn(props, pageIndex, pageSize, continuationToken);
    var res = UrlFetchApp.fetch(url, {
      method: 'get',
      headers: { Authorization: 'Bearer ' + accessToken },
      muteHttpExceptions: true,
    });
    if (res.getResponseCode() !== 200) {
      throw new Error('HelloAsso HTTP ' + res.getResponseCode() + ' ' + res.getContentText());
    }
    var body = JSON.parse(res.getContentText());
    var data = body.data || body.Data || body.items || body.Items || [];
    if (!data.length) break;
    var i;
    for (i = 0; i < data.length; i++) {
      rows.push(data[i]);
    }
    var pag = body.pagination || body.Pagination || {};
    var nextTok = pag.continuationToken || pag.continuation_token || pag.ContinuationToken;
    if (nextTok) {
      continuationToken = nextTok;
      pageIndex = 1;
      continue;
    }
    continuationToken = '';
    if (data.length < pageSize) break;
    pageIndex++;
  }
  return rows;
}

function flattenOrderItemsFromOrders_(ordersArray) {
  var out = [];
  var oi;
  for (oi = 0; oi < ordersArray.length; oi++) {
    var order = ordersArray[oi];
    var items = order.items || order.Items || [];
    var ii;
    for (ii = 0; ii < items.length; ii++) {
      out.push(items[ii]);
    }
  }
  return out;
}

function normalizeLabel_(s) {
  return String(s || '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2212\u00AD]/g, '-')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * États exclus du décompte (billets annulés / refusés / paniers non payés).
 * Propriété optionnelle **HA_INCLUDE_CANCELED** = `1` : inclut les billets **Canceled** dans le total
 * (utile pour coller à un chiffre admin qui compte encore les annulations ; à désactiver pour une jauge « places réellement valides »).
 */
function isExcludedItemState_(state) {
  if (state == null || state === '') return false;
  var low = String(state).toLowerCase();
  if (
    (low === 'canceled' || low === 'cancelled') &&
    PropertiesService.getScriptProperties().getProperty('HA_INCLUDE_CANCELED') === '1'
  ) {
    return false;
  }
  return (
    low === 'canceled' ||
    low === 'cancelled' ||
    low === 'refused' ||
    low === 'abandoned' ||
    low === 'deleted' ||
    low === 'waiting'
  );
}

/**
 * Journal : parmi les billets **exclus** du total, ceux qui ressemblent à du Vendredi (même filtres que l’agrégateur).
 * Permet de vérifier un écart type admin > script (ex. annulations encore visibles côté statistiques).
 */
function logDiagnosticVendrediExcluded_(itemsArray) {
  var buckets = {};
  var idx;
  for (idx = 0; idx < itemsArray.length; idx++) {
    var it = itemsArray[idx];
    var st = it.state != null ? it.state : it.State;
    if (!isExcludedItemState_(st)) continue;

    var rawName = getItemDisplayName_(it);
    var n = normalizeLabel_(rawName);
    if (!n) continue;
    if (n.indexOf('groupe') !== -1) continue;
    if (/\bstage\b/.test(n) && n.indexOf('vendredi') === -1 && n.indexOf('samedi') === -1 && n.indexOf('dimanche') === -1) {
      continue;
    }
    if (isThreeDayPassLabel_(n)) continue;
    if (n.indexOf('vendredi') === -1) continue;

    var key = st == null ? '(null)' : String(st);
    buckets[key] = (buckets[key] || 0) + 1;
  }
  var keys = Object.keys(buckets);
  if (keys.length) {
    Logger.log('Diagnostic Vendredi — billets exclus du total (libellé vendredi), par état API : ' + JSON.stringify(buckets));
  }
}

function getItemDisplayName_(it) {
  var tier = it.tier || it.Tier;
  var fromTier =
    tier &&
    (tier.name || tier.Name || tier.label || tier.Label || tier.description || tier.Description);
  return (
    it.name ||
    it.Name ||
    fromTier ||
    it.tierName ||
    it.tier_name ||
    it.tierDescription ||
    it.tier_description ||
    ''
  );
}

function isThreeDayPassLabel_(n) {
  if (n.indexOf('pass 3') !== -1) return true;
  if (n.indexOf('3 jours') !== -1) return true;
  if (/\b3\s*jours\b/.test(n)) return true;
  if (/\b3j\b/.test(n)) return true;
  return false;
}

/**
 * Agrège une liste plate d’articles (endpoint /items ou items issus des commandes).
 * Inclut les états **Unknown** (souvent liés à d’anciens tarifs) sauf annulation / attente paiement
 * (voir **isExcludedItemState_** ; option **HA_INCLUDE_CANCELED** pour les tests de cohérence admin).
 */
function aggregateReservationsFromLineItems_(itemsArray) {
  var threeDay = 0;
  var vd = 0;
  var sa = 0;
  var di = 0;

  var idx;
  for (idx = 0; idx < itemsArray.length; idx++) {
    var it = itemsArray[idx];
    var st = it.state != null ? it.state : it.State;
    if (isExcludedItemState_(st)) continue;

    var rawName = getItemDisplayName_(it);
    var n = normalizeLabel_(rawName);
    if (!n) continue;

    if (n.indexOf('groupe') !== -1) continue;
    // Pass « stage » atelier (sans jour spectacle) — mot entier pour ne pas toucher à « Samedi », etc.
    if (/\bstage\b/.test(n) && n.indexOf('vendredi') === -1 && n.indexOf('samedi') === -1 && n.indexOf('dimanche') === -1) {
      continue;
    }

    if (isThreeDayPassLabel_(n)) {
      threeDay++;
      continue;
    }

    if (n.indexOf('vendredi') !== -1) vd++;
    else if (n.indexOf('samedi') !== -1) sa++;
    else if (n.indexOf('dimanche') !== -1) di++;
  }

  return {
    oneDay: { vendredi: vd, samedi: sa, dimanche: di },
    threeDay: threeDay,
  };
}

function getHelloAssoAccessToken_(props) {
  var clientId = props.getProperty('HA_CLIENT_ID');
  var clientSecret = props.getProperty('HA_CLIENT_SECRET');
  var refreshToken = props.getProperty('HA_REFRESH_TOKEN');

  if (refreshToken) {
    var resRefresh = UrlFetchApp.fetch(HA_TOKEN_URL, {
      method: 'post',
      contentType: 'application/x-www-form-urlencoded',
      muteHttpExceptions: true,
      payload: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
    });
    if (resRefresh.getResponseCode() === 200) {
      var bodyRefresh = JSON.parse(resRefresh.getContentText());
      if (bodyRefresh.refresh_token) {
        props.setProperty('HA_REFRESH_TOKEN', bodyRefresh.refresh_token);
      }
      return bodyRefresh.access_token;
    }
  }

  var res = UrlFetchApp.fetch(HA_TOKEN_URL, {
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    muteHttpExceptions: true,
    payload: {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    },
  });
  if (res.getResponseCode() !== 200) {
    throw new Error('Token HelloAsso : ' + res.getResponseCode() + ' ' + res.getContentText());
  }
  var body = JSON.parse(res.getContentText());
  if (body.refresh_token) {
    props.setProperty('HA_REFRESH_TOKEN', body.refresh_token);
  }
  return body.access_token;
}
