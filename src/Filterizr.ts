import BrowserWindow from './BrowserWindow';
import FilterizrOptions from './FilterizrOptions/FilterizrOptions';
import FilterControls from './FilterControls';
import FilterContainer from './FilterContainer';
import FilterItem from './FilterItem';
import { Filter } from './ActiveFilter';
import getLayoutPositions from './getLayoutPositions';
import defaultOptions, { RawOptions } from './FilterizrOptions/defaultOptions';
import _installAsJQueryPlugin from './installAsJQueryPlugin';
import { FILTERIZR_STATE, debounce, getHTMLElement, noop } from './utils';
import FilterItems from './FilterItems';

const imagesLoaded = require('imagesloaded');

export default class Filterizr {
  public options: FilterizrOptions;
  public props: {
    browserWindow: BrowserWindow;
    filterContainer: FilterContainer;
    filterControls?: FilterControls;
    filterizrState: string;
  };

  public constructor(
    selectorOrNode: string | HTMLElement = defaultOptions.gridSelector,
    userOptions: RawOptions = {}
  ) {
    this.options = new FilterizrOptions(userOptions);

    const { setupControls, controlsSelector } = this.options.get();

    this.props = {
      browserWindow: new BrowserWindow(),
      filterContainer: new FilterContainer(
        getHTMLElement(selectorOrNode),
        this.options
      ),
      ...(setupControls && {
        filterControls: new FilterControls(this, controlsSelector),
      }),
      filterizrState: FILTERIZR_STATE.IDLE,
    };

    // Set up events needed by Filterizr
    this._bindEvents();

    // Trigger the first render and fire the onInit callback if defined
    this._renderWithImagesLoaded(this.options.get().callbacks.onInit);
  }

  private get filterItems(): FilterItems {
    return this.props.filterContainer.props.filterItems;
  }

  /**
   * Main Filterizr classes exported as static members
   */
  public static FilterContainer = FilterContainer;
  public static FilterItem = FilterItem;
  public static defaultOptions = defaultOptions;

  /**
   * Static method that receives the jQuery object and extends
   * its prototype with a .filterizr method.
   */
  public static installAsJQueryPlugin: Function = _installAsJQueryPlugin;

  /**
   * Filters the items in the grid by a category
   * @param category by which to filter
   */
  public filter(category: Filter): void {
    const { filterContainer } = this.props;

    // Trigger filteringStart event
    filterContainer.trigger('filteringStart');

    // Set animation state to trigger callbacks
    this.props.filterizrState = FILTERIZR_STATE.FILTERING;

    // Cast category to string or array of strings
    category = Array.isArray(category)
      ? category.map((c): string => c.toString())
      : category.toString();

    // Update filter in options
    this.options.filter = category;

    this._render(this.filterItems.getSearched(this.options.searchTerm));
  }

  /**
   * Destroys the Filterizr instance and unbinds all events.
   */
  public destroy(): void {
    const { browserWindow, filterControls, filterContainer } = this.props;

    // Unbind all events of FilterContainer and Filterizr
    // and remove inline styles.
    filterContainer.destroy();
    browserWindow.destroy();

    // Destroy all controls of the instance
    if (this.options.get().setupControls && filterControls) {
      filterControls.destroy();
    }
  }

  /**
   * Inserts a new FilterItem in the Filterizr grid
   * @param node DOM node to append
   */
  public insertItem(node: HTMLElement): void {
    const { filterContainer } = this.props;

    filterContainer.insertItem(node, this.options);

    // Retrigger filter for new item to assume position in the grid
    this._renderWithImagesLoaded();
  }

  /**
   * Sorts the FilterItems in the grid
   * @param {String} sortAttr the attribute by which to perform the sort
   * @param {String} sortOrder ascending or descending
   */
  public sort(sortAttr: string = 'index', sortOrder: string = 'asc'): void {
    const { filterContainer } = this.props;
    filterContainer.trigger('sortingStart');
    this.props.filterizrState = FILTERIZR_STATE.SORTING;
    this._render(this.filterItems.getSorted(sortAttr, sortOrder));
  }

  /**
   * Searches through the FilterItems for a given string and adds an additional filter layer.
   * @param {String} searchTerm the term for which to search
   */
  public search(searchTerm: string = this.options.get().searchTerm): void {
    this.options.searchTerm = searchTerm.toLowerCase();
    this._render(this.filterItems.getSearched(this.options.searchTerm));
  }

  /**
   * Shuffles the FilterItems in the grid, making sure their positions have changed.
   */
  public shuffle(): void {
    const { filterContainer } = this.props;
    filterContainer.trigger('shufflingStart');
    this.props.filterizrState = FILTERIZR_STATE.SHUFFLING;
    this._render(this.filterItems.getShuffled());
  }

  /**
   * Updates the perferences of the users for rendering the Filterizr grid,
   * additionally performs error checking on the new options passed.
   * @param newOptions to override the defaults.
   */
  public setOptions(newOptions: RawOptions): void {
    if (newOptions.callbacks) {
      // If user has passed in a callback, deregister the old ones
      this.props.filterContainer.unbindEvents(this.options.get().callbacks);
    }

    // Update options
    this.options.set(newOptions);

    // If one of the options that updates the transition properties
    // of the grid items is set, call the update method
    if (
      newOptions.animationDuration ||
      newOptions.delay ||
      newOptions.delayMode ||
      newOptions.easing
    ) {
      this.filterItems.updateFilterItemsTransitionStyle();
    }

    // If inside the new options the callbacks object has been defined
    // then the FilterContainer events need to be reset.
    // Same if the animationDuration is defined as it is a parameter to
    // the debounce wrapper of the transitionEnd callback.
    if (newOptions.callbacks || newOptions.animationDuration) {
      this._rebindFilterContainerEvents();
    }

    if ('searchTerm' in newOptions) {
      this.search(newOptions.searchTerm);
    }

    // If filter or filtering logic has been changed retrigger filtering
    if (newOptions.filter || newOptions.multifilterLogicalOperator) {
      this.filter(this.options.filter);
    }
  }

  /**
   * Performs multifiltering with AND/OR logic.
   * @param toggledFilter the filter to toggle
   */
  public toggleFilter(toggledFilter: string): void {
    this.options.toggleFilter(toggledFilter);
    this.filter(this.options.filter);
  }

  // Helper methods
  private _render(itemsToFilterIn: FilterItem[]): void {
    const { filterInCss, filterOutCss, layout } = this.options.get();

    // Filter out the items not matching the fiiltering & search criteria
    this.filterItems
      .getFilteredOut(this.options.filter)
      .forEach((filterItem): void => {
        filterItem.filterOut(filterOutCss);
      });

    // Determine target positions for items to be filtered in
    const positions = getLayoutPositions(layout, this);

    // Filter in new items
    itemsToFilterIn.forEach((filterItem, index): void => {
      filterItem.filterIn(positions[index], filterInCss);
    });
  }

  private _onTransitionEndCallback(): void {
    const { filterizrState, filterContainer } = this.props;

    switch (filterizrState) {
      case FILTERIZR_STATE.FILTERING:
        filterContainer.trigger('filteringEnd');
        break;
      case FILTERIZR_STATE.SORTING:
        filterContainer.trigger('sortingEnd');
        break;
      case FILTERIZR_STATE.SHUFFLING:
        filterContainer.trigger('shufflingEnd');
        break;
    }

    this.props.filterizrState = FILTERIZR_STATE.IDLE;
  }

  private _rebindFilterContainerEvents(): void {
    const { filterContainer } = this.props;
    const { animationDuration, callbacks } = this.options.get();

    filterContainer.unbindEvents(callbacks);

    filterContainer.bindEvents({
      ...callbacks,
      onTransitionEnd: debounce(
        this._onTransitionEndCallback.bind(this),
        animationDuration,
        false
      ) as EventListener,
    });
  }

  private _bindEvents(): void {
    const { browserWindow } = this.props;
    this._rebindFilterContainerEvents();
    browserWindow.setResizeEventHandler(
      this._updateDimensionsAndRerender.bind(this)
    );
  }

  /**
   * If it contains images it makes use of the imagesloaded npm package
   * to trigger the first render after the images have finished loading
   * in the DOM. Otherwise, overlapping can occur if the images do not
   * have the height attribute explicitly set on them.
   *
   * In case the grid contains no images, then a simple render is performed.
   */
  private _renderWithImagesLoaded(onRendered: Function = noop): void {
    const { filterContainer } = this.props;
    const hasImages = !!filterContainer.node.querySelectorAll('img').length;

    if (hasImages) {
      imagesLoaded(filterContainer.node, (): void => {
        this._updateDimensionsAndRerender();
        onRendered();
      });
    } else {
      const {
        options: { filter },
      } = this;
      this._render(this.filterItems.getFiltered(filter));
      onRendered();
    }
  }

  /**
   * Updates dimensions of container and items and rerenders the
   * grid so that the items can assume their new positions.
   */
  private _updateDimensionsAndRerender(): void {
    const {
      props: { filterContainer },
      options: { filter },
    } = this;
    filterContainer.updateDimensions();
    this._render(this.filterItems.getFiltered(filter));
  }
}
