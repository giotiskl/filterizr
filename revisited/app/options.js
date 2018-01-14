const options = {
  animationDuration: 0.5,
  callbacks: {
    onFilteringStart: () => { },
    onFilteringEnd: () => { },
    onShufflingStart: () => { },
    onShufflingEnd: () => { },
    onSortingStart: () => { },
    onSortingEnd: () => { },
  },
  controlsSelector: '',
  delay: 0,
  delayMode: 'progressive',
  easing: 'ease-out',
  filter: 'all',
  filterOutCss: {
    'opacity': 0,
    'transform': 'scale(0.5)'
  },
  filterInCss: {
    'opacity': 1,
    'transform': 'scale(1)'
  },
  layout: 'sameSize',
  multifilterLogicalOperator: 'or',
  setupControls: true,
};

export default options;
