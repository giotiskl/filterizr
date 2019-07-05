import { RawOptionsCallbacks } from './RawOptionsCallbacks';
import ActiveFilter from '../ActiveFilter';

export interface BaseOptions {
  animationDuration?: number;
  callbacks?: RawOptionsCallbacks;
  controlsSelector?: string;
  delay?: number;
  delayMode?: 'alternate' | 'progressive';
  easing?: string;
  filterOutCss?: object;
  filterInCss?: object;
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
