(function (globalScope) {
  /**
   * Copier ce fichier en malix/assets/access-config.local.js (non versionné).
   * Le build l’injecte dans dist à la place de access-config.js si présent.
   * L’accès au jeu ne dépend plus de dates ni de géoloc ; ce fichier sert
   * uniquement à préserver le hook de build pour d’éventuelles clés futures.
   */
  globalScope.MalixAccessConfig = {};
})(typeof window !== 'undefined' ? window : globalThis);
