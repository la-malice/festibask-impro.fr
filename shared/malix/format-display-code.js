/** Pseudonymes joueur Malix : nom + adjectif + numéro (déterministe depuis UUID). */

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Noms — ambiance enfant / festival (animaux, nature, fête). */
export const MALIX_DISPLAY_NOUNS = [
  'poney',
  'renard',
  'bulle',
  'comète',
  'tambour',
  'étoile',
  'papillon',
  'nuage',
  'castor',
  'fleur',
  'hibou',
  'baleine',
  'cerf',
  'pieuvre',
  'grenouille',
  'tortue',
  'lapin',
  'panda',
  'koala',
  'loutre',
  'phoque',
  'pingouin',
  'flamant',
  'perroquet',
  'écureuil',
  'hérisson',
  'libellule',
  'coccinelle',
  'dauphin',
  'manchot',
  'ours',
  'loup',
  'lynx',
  'faucon',
  'colibri',
  'bison',
  'mouton',
  'chèvre',
  'âne',
  'cochon',
  'poule',
  'canard',
  'oie',
  'cygne',
  'corbeau',
  'moineau',
  'merle',
  'rouge-gorge',
  'pic',
  'fourmi',
  'abeille',
  'criquet',
  'luciole',
  'escargot',
  'crabe',
  'homard',
  'méduse',
  'corail',
  'algue',
  'mousse',
  'champignon',
  'trèfle',
  'rose',
  'tulipe',
  'tournesol'
];

/** Adjectifs — ton léger, positif. */
export const MALIX_DISPLAY_ADJECTIVES = [
  'fringant',
  'joyeux',
  'cosmique',
  'dansant',
  'étincelant',
  'farfelu',
  'zinzin',
  'rigolo',
  'féerique',
  'magique',
  'lumineux',
  'velours',
  'câlin',
  'futé',
  'malin',
  'zélé',
  'fier',
  'doux',
  'vif',
  'bondissant',
  'voltigeant',
  'chantant',
  'rêveur',
  'curieux',
  'aventurier',
  'courageux',
  'paisible',
  'festif',
  'enjoué',
  'pimpant',
  'coloré',
  'radieux',
  'scintillant',
  'tourbillonnant',
  'mousseux',
  'givré',
  'ensoleillé',
  'brumeux',
  'venteux',
  'pluvieux',
  'arc-en-ciel',
  'pailleté',
  'confetti',
  'sucré',
  'mielleux',
  'croustillant',
  'moussu',
  'savoureux',
  'piquant',
  'délicat',
  'robuste',
  'agile',
  'souple',
  'gracieux',
  'malicieux',
  'espiègle',
  'coquin',
  'taquin',
  'bavard',
  'discret',
  'mystérieux',
  'farceur',
  'généreux',
  'solidaire',
  'enthousiaste',
  'épatant',
  'formidable',
  'super',
  'chouette',
  'génial'
];

export function isValidPlayerId(id) {
  return typeof id === 'string' && UUID_RE.test(id);
}

export function formatDisplayCode(id) {
  if (!isValidPlayerId(id)) return '';
  const hex = id.replace(/-/g, '').toLowerCase();
  const b0 = parseInt(hex.slice(0, 2), 16);
  const b1 = parseInt(hex.slice(2, 4), 16);
  const b2 = parseInt(hex.slice(4, 6), 16);
  const b3 = parseInt(hex.slice(6, 8), 16);
  const noun = MALIX_DISPLAY_NOUNS[b0 % MALIX_DISPLAY_NOUNS.length];
  const adjective = MALIX_DISPLAY_ADJECTIVES[b1 % MALIX_DISPLAY_ADJECTIVES.length];
  const num = ((b2 << 8) | b3) % 100;
  return noun + ' ' + adjective + ' ' + String(num).padStart(2, '0');
}

const DISPLAY_CODE_SUFFIX_RE = / \d{2}$/;

export function getDisplayCodeBase(fullCode) {
  if (typeof fullCode !== 'string' || !fullCode) return '';
  return fullCode.replace(DISPLAY_CODE_SUFFIX_RE, '');
}

/** @param {string[]} fullCodes */
export function buildLeaderboardDisplayLabels(fullCodes) {
  const variantsByBase = new Map();
  const codes = Array.isArray(fullCodes) ? fullCodes : [];
  for (let index = 0; index < codes.length; index += 1) {
    const code = codes[index];
    if (typeof code !== 'string' || !code) continue;
    const base = getDisplayCodeBase(code);
    if (!base) continue;
    if (!variantsByBase.has(base)) {
      variantsByBase.set(base, new Set());
    }
    variantsByBase.get(base).add(code);
  }
  return function resolveDisplayLabel(fullCode) {
    if (typeof fullCode !== 'string' || !fullCode) return '';
    const base = getDisplayCodeBase(fullCode);
    if (!base) return fullCode;
    const variants = variantsByBase.get(base);
    return variants && variants.size > 1 ? fullCode : base;
  };
}
