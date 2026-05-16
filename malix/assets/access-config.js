(function (globalScope) {
  /** Réservé aux extensions futures ; le jeu n’utilise plus fenêtre festival ni géolocalisation pour l’accès. */
  globalScope.MalixAccessConfig = {};
})(typeof window !== 'undefined' ? window : globalThis);
