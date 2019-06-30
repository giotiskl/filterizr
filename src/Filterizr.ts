import BrowserWindow from './BrowserWindow';
import FilterizrOptions from './FilterizrOptions/FilterizrOptions';
import FilterControls from './FilterControls';
import FilterContainer from './FilterContainer';
import FilterItem from './FilterItem';
import FilterItems from './FilterItems';
import { Filter } from './ActiveFilter';
import getLayoutPositions from './getLayoutPositions';
import defaultOptions, {
  IUserOptions,
} from './FilterizrOptions/defaultOptions';
import _installAsJQueryPlugin from './installAsJQueryPlugin';
import { FILTERIZR_STATE, debounce, getHTMLElement, noop } from './utils';

const imagesLoaded = require('imagesloaded');

export default class Filterizr {
  FilterContainer: FilterContainer;
  FilterItem: FilterItem;
  defaultOptions: IUserOptions;

  options: FilterizrOptions;
  props: {
    browserWindow: BrowserWindow;
    filterContainer: FilterContainer;
    filterControls?: FilterControls;
    filterItems: FilterItems;
    filterizrState: string;
  };

  constructor(
    selectorOrNode: string | HTMLElement = defaultOptions.gridSelector,
    userOptions: IUserOptions = {}
  ) {
    this.options = new FilterizrOptions(userOptions);

    const filterContainer = new FilterContainer(
      getHTMLElement(selectorOrNode),
      this.options
    );

    const { setupControls, controlsSelector } = this.options.get();

    this.props = {
      browserWindow: new BrowserWindow(),
      filterContainer,
      ...(setupControls && {
        filterControls: new FilterControls(this, controlsSelector),
      }),
      filterItems: new FilterItems(
        filterContainer.props.filterItems,
        this.options
      ),
      filterizrState: FILTERIZR_STATE.IDLE,
    };

    // Set up events needed by Filterizr
    this._bindEvents();

    // Trigger the first render and fire the onInit callback if defined
    this._renderWithImagesLoaded(this.options.get().callbacks.onInit);
  }

  /**
   * Main Filterizr classes exported as static members
   */
  static FilterContainer = FilterContainer;
  static FilterItem = FilterItem;
  static defaultOptions = defaultOptions;

  /**
   * Static method that receives the jQuery object and extends
   * its prototype with a .filterizr method.
   */
  static installAsJQueryPlugin = _installAsJQueryPlugin;

  /**
   * Filters the items in the grid by a category
   * @param {String|String[]} category by which to filter
   * @returns {undefined}
   */
  filter(category: Filter): void {
    const { filterContainer } = this.props;

    // Trigger filteringStart event
    filterContainer.trigger('filteringStart');

    // Set animation state to trigger callbacks
    this.props.filterizrState = FILTERIZR_STATE.FILTERING;

    // Cast category to string or array of strings
    category = Array.isArray(category)
      ? category.map(c => c.toString())
      : category.toString();

    // Update filter in options
    this.options.filter = category;

    this._render(this.props.filterItems.getSearched(this.options.searchTerm));
  }

  /**
   * Destroys the Filterizr instance and unbinds all events.
   * @returns {undefined}
   */
  destroy(): void {
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
   * @param {Object} node DOM node to append
   * @returns {undefined}
   */
  insertItem(node: HTMLElement): void {
    const { filterContainer } = this.props;

    filterContainer.push(node, this.options);

    // Retrigger filter for new item to assume position in the grid
    this._renderWithImagesLoaded();
  }

  /**
   * Sorts the FilterItems in the grid
   * @param {String} sortAttr the attribute by which to perform the sort
   * @param {String} sortOrder ascending or descending
   */
  sort(sortAttr: string = 'index', sortOrder: string = 'asc'): void {
    const { filterContainer, filterItems } = this.props;
    filterContainer.trigger('sortingStart');
    this.props.filterizrState = FILTERIZR_STATE.SORTING;
    this._render(filterItems.getSorted(sortAttr, sortOrder));
  }

  /**
   * Searches through the FilterItems for a given string and adds an additional filter layer.
   * @param {String} searchTerm the term for which to search
   */
  search(searchTerm: string = this.options.get().searchTerm): void {
    this.options.searchTerm = searchTerm.toLowerCase();
    this._render(this.props.filterItems.getSearched(this.options.searchTerm));
  }

  /**
   * Shuffles the FilterItems in the grid, making sure their positions have changed.
   */
  shuffle(): void {
    const { filterContainer, filterItems } = this.props;
    filterContainer.trigger('shufflingStart');
    this.props.filterizrState = FILTERIZR_STATE.SHUFFLING;
    this._render(filterItems.getShuffled());
  }

  /**
   * Updates the perferences of the users for rendering the Filterizr grid,
   * additionally performs error checking on the new options passed.
   * @param {Object} newOptions to override the defaults.
   * @returns {undefined}
   */
  setOptions(newOptions: IUserOptions): void {
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
      this.props.filterContainer.updateFilterItemsTransitionStyle(
        this.options.getRaw()
      );
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
   * @param {String} toggledFilter the filter to toggle
   * @returns {undefined}
   */
  toggleFilter(toggledFilter: string): void {
    this.options.toggleFilter(toggledFilter);
    this.filter(this.options.filter);
  }

  // Helper methods
  private _render(filterItems: FilterItem[]): void {
    const { filterInCss, filterOutCss, layout } = this.options.get();

    // Filter out the items not matching the fiiltering & search criteria
    this.props.filterItems
      .getFilteredOut(this.options.filter)
      .forEach(filterItem => {
        filterItem.filterOut(filterOutCss);
      });

    // Determine target positions for items to be filtered in
    const positions = getLayoutPositions(layout, this);

    // Filter in new items
    filterItems.forEach((filterItem, index) => {
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
      onTransitionEnd: <EventListener>(
        debounce(
          this._onTransitionEndCallback.bind(this),
          animationDuration,
          false
        )
      ),
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
   *
   * @returns {undefined}
   */
  private _renderWithImagesLoaded(onRendered: Function = noop): void {
    const { filterContainer } = this.props;
    const hasImages = !!filterContainer.node.querySelectorAll('img').length;

    if (hasImages) {
      imagesLoaded(filterContainer.node, () => {
        this._updateDimensionsAndRerender();
        onRendered();
      });
    } else {
      const {
        props: { filterItems },
        options: { filter },
      } = this;
      this._render(filterItems.getFiltered(filter));
      onRendered();
    }
  }

  /**
   * Updates dimensions of container and items and rerenders the
   * grid so that the items can assume their new positions.
   *
   * @returns {undefined}
   */
  private _updateDimensionsAndRerender(): void {
    const {
      props: { filterContainer, filterItems },
      options: { filter },
    } = this;

    filterContainer.updateDimensions();
    this._render(filterItems.getFiltered(filter));
  }
}
