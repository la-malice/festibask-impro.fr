module.exports = {
  content: ['index.html', 'assets/js/script.js'],
  css: ['assets/css/style.css'],
  output: 'dist/assets/css/style.css',
  safelist: {
    standard: [
      'show',
      'open',
      'hidden',
      'active',
      'flipped',
      'slider-active',
      'match-slider-container',
      'match-slider-track',
      'match-slide',
      'match-slide-image',
      'match-slide-overlay',
      'match-slide-name',
      'match-slide-role',
      'match-slide-bio',
      'match-slider-close',
      'match-slider-dots',
      'match-slider-dot',
      'tooltip-overlay',
      'tooltip-popup',
      'tooltip-left',
      'tooltip-right',
      'tooltip-top',
      'tooltip-bottom'
    ],
    greedy: [
      /^tooltip-/,
      /^match-slider-/,
      /^match-slide/
    ]
  }
};
