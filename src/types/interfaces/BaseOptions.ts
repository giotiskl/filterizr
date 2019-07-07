import { SpinnerOptions } from './SpinnerOptions';
import { RawOptionsCallbacks } from './RawOptionsCallbacks';

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
  gutterPixels?: number;
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
  spinner?: SpinnerOptions;
}
