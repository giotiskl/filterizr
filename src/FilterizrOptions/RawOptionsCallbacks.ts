export interface RawOptionsCallbacks {
  onInit?: Function;
  onFilteringStart?: EventListener;
  onFilteringEnd?: EventListener;
  onShufflingStart?: EventListener;
  onShufflingEnd?: EventListener;
  onSortingStart?: EventListener;
  onSortingEnd?: EventListener;
  onTransitionEnd?: EventListener;
}
