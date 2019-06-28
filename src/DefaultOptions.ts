export interface IDefaultOptionsCallbacks {
  onFilteringStart?: EventListener;
  onFilteringEnd?: EventListener;
  onShufflingStart?: EventListener;
  onShufflingEnd?: EventListener;
  onSortingStart?: EventListener;
  onSortingEnd?: EventListener;
}

export interface IDefaultOptions {
  animationDuration?: number;
  callbacks?: IDefaultOptionsCallbacks;
  controlsSelector?: string;
  delay?: number;
  delayMode?: 'alternate' | 'progressive';
  easing?: string;
  filter?: string | string[];
  filterOutCss?: object;
  filterInCss?: object;
  gridSelector?: string;
  gridItemsSelector?: string;
  layout?:
    | 'horizontal'
    | 'vertical'
    | 'sameHeight'
    | 'sameWidth'
    | 'sameSize'
    | 'packed';
  multifilterLogicalOperator?: 'or' | 'and';
  setupControls?: boolean;
}

const options: IDefaultOptions = {
  animationDuration: 0.5,
  callbacks: {
    onFilteringStart: () => {},
    onFilteringEnd: () => {},
    onShufflingStart: () => {},
    onShufflingEnd: () => {},
    onSortingStart: () => {},
    onSortingEnd: () => {},
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
  gridSelector: '.filtr-container',
  gridItemsSelector: '.filtr-item',
  layout: 'sameSize',
  multifilterLogicalOperator: 'or',
  setupControls: true,
};

export default options;
