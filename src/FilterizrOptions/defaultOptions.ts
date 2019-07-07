import { RawOptions } from '../types/interfaces';
import { noop } from '../utils';

const defaultOptions: RawOptions = {
  animationDuration: 0.5,
  callbacks: {
    onInit: noop,
    onFilteringStart: noop,
    onFilteringEnd: noop,
    onShufflingStart: noop,
    onShufflingEnd: noop,
    onSortingStart: noop,
    onSortingEnd: noop,
  },
  controlsSelector: '',
  delay: 0,
  delayMode: 'progressive',
  easing: 'ease-out',
  filter: 'all',
  filterOutCss: {
    opacity: 0,
    transform: 'scale(0.5)',
  },
  filterInCss: {
    opacity: 1,
    transform: 'scale(1)',
  },
  gridItemsSelector: '.filtr-item',
  gutterPixels: 0,
  layout: 'sameSize',
  multifilterLogicalOperator: 'or',
  searchTerm: '',
  setupControls: true,
  spinner: {
    enabled: false,
    fillColor: '#2184D0',
    styles: {
      width: '75px',
      height: '75px',
      margin: 'auto',
      'z-index': 2,
    },
  },
};

export default defaultOptions;
