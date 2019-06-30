import ActiveFilter from '../ActiveFilter';

export interface IUserOptionsCallbacks {
  onFilteringStart?: EventListener;
  onFilteringEnd?: EventListener;
  onShufflingStart?: EventListener;
  onShufflingEnd?: EventListener;
  onSortingStart?: EventListener;
  onSortingEnd?: EventListener;
  onTransitionEnd?: EventListener;
}

export interface IBaseOptions {
  animationDuration?: number;
  callbacks?: IUserOptionsCallbacks;
  controlsSelector?: string;
  delay?: number;
  delayMode?: 'alternate' | 'progressive';
  easing?: string;
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
  searchTerm?: string;
  setupControls?: boolean;
}

export interface IUserOptions extends IBaseOptions {
  filter?: string | string[];
}

export interface IFilterizrOptions extends IBaseOptions {
  filter: ActiveFilter;
}

const defaultUserOptions: IUserOptions = {
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
  searchTerm: '',
  setupControls: true,
};

export default defaultUserOptions;
