const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidPlayerId(id) {
  return typeof id === 'string' && UUID_RE.test(id);
}

export function formatDisplayCode(id) {
  if (!isValidPlayerId(id)) return '';
  return id.replace(/-/g, '').slice(0, 8).toUpperCase();
}
