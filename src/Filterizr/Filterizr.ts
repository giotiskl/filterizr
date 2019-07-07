import { FILTERIZR_STATE } from '../config';
import { Filter } from '../types';
import { RawOptions } from '../types/interfaces';
import { debounce, getHTMLElement } from '../utils';
import EventReceiver from '../EventReceiver';
import FilterizrOptions, { defaultOptions } from '../FilterizrOptions';
import FilterControls from '../FilterControls';
import FilterContainer from '../FilterContainer';
import FilterItems from '../FilterItems';
import FilterItem from '../FilterItem';
import Spinner from '../Spinner';
import makeLayoutPositions from '../makeLayoutPositions';
import installAsJQueryPlugin from './installAsJQueryPlugin';

const imagesLoaded = require('imagesloaded');

export default class Filterizr {
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
  public static installAsJQueryPlugin: Function = installAsJQueryPlugin;

  public options: FilterizrOptions;
  private windowEventReceiver: EventReceiver;
  private filterContainer: FilterContainer;
  private filterControls?: FilterControls;
  private filterizrState: string;
  private imagesHaveLoaded: boolean;
  private spinner: Spinner;

  public constructor(
    selectorOrNode: string | HTMLElement = '.filtr-container',
    userOptions: RawOptions = {}
  ) {
    this.options = new FilterizrOptions(userOptions);

    const { areControlsEnabled, controlsSelector, isSpinnerEnabled } = this.options;

    this.windowEventReceiver = new EventReceiver(window);
    this.filterContainer = new FilterContainer(
      getHTMLElement(selectorOrNode),
      this.options
    );
    this.imagesHaveLoaded = !this.filterContainer.node.querySelectorAll('img')
      .length;
    this.filterizrState = FILTERIZR_STATE.IDLE;

    if (areControlsEnabled) {
      this.filterControls = new FilterControls(this, controlsSelector);
    }
    if (isSpinnerEnabled) {
      this.spinner = new Spinner(this.filterContainer, this.options);
    }

    this.bindEvents();
    this.initialize();
  }

  /**
   * Filters the items in the grid by a category
   * @param category by which to filter
   */
  public filter(category: Filter): void {
    const { filterContainer, filterItems } = this;

    filterContainer.trigger('filteringStart');
    this.filterizrState = FILTERIZR_STATE.FILTERING;

    category = Array.isArray(category)
      ? category.map((c): string => c.toString())
      : category.toString();

    this.options.filter = category;
    this.render(filterItems.getSearched(this.options.searchTerm));
  }

  public destroy(): void {
    const { windowEventReceiver, filterControls, filterContainer } = this;

    filterContainer.destroy();
    windowEventReceiver.destroy();
    if (this.options.get().setupControls && filterControls) {
      filterControls.destroy();
    }
  }

  /**
   * Inserts a new FilterItem into the grid
   */
  public async insertItem(node: HTMLElement): Promise<void> {
    const { filterContainer, filterItems, options } = this;
    filterContainer.insertItem(node, options);
    await this.waitForImagesToLoad();
    this.render(filterItems.getFiltered(options.filter));
  }

  /**
   * Removes a FilterItem from the grid
   */
  public removeItem(node: HTMLElement): void {
    const { filterContainer, filterItems } = this;
    filterContainer.removeItem(node);
    this.render(filterItems.getFiltered(this.options.filter));
  }

  /**
   * Sorts the FilterItems in the grid
   * @param sortAttr the attribute by which to perform the sort
   * @param sortOrder ascending or descending
   */
  public sort(
    sortAttr: string = 'index',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): void {
    const { filterContainer, filterItems } = this;
    filterContainer.trigger('sortingStart');
    this.filterizrState = FILTERIZR_STATE.SORTING;
    this.render(filterItems.getSorted(sortAttr, sortOrder));
  }

  /**
   * Searches through the FilterItems for a given string and adds an additional filter layer.
   * @param searchTerm the term for which to search
   */
  public search(searchTerm: string = this.options.get().searchTerm): void {
    this.options.searchTerm = searchTerm.toLowerCase();
    this.render(this.filterItems.getSearched(this.options.searchTerm));
  }

  /**
   * Shuffles the FilterItems in the grid, making sure their positions have changed.
   */
  public shuffle(): void {
    const { filterContainer, filterItems } = this;
    filterContainer.trigger('shufflingStart');
    this.filterizrState = FILTERIZR_STATE.SHUFFLING;
    this.render(filterItems.getShuffled());
  }

  /**
   * Updates the perferences of the users for rendering the Filterizr grid,
   * additionally performs error checking on the new options passed.
   * @param newOptions to override the defaults.
   */
  public setOptions(newOptions: RawOptions): void {
    const { filterContainer, filterItems } = this;

    if (newOptions.callbacks) {
      // Remove old callbacks before setting the new ones in the options
      filterContainer.unbindEvents();
    }

    this.options.set(newOptions);

    if (
      newOptions.animationDuration ||
      newOptions.delay ||
      newOptions.delayMode ||
      newOptions.easing
    ) {
      filterItems.updateTransitionStyle();
    }

    if (newOptions.callbacks || newOptions.animationDuration) {
      this.rebindFilterContainerEvents();
    }

    if ('searchTerm' in newOptions) {
      this.search(newOptions.searchTerm);
    }

    if (newOptions.filter || newOptions.multifilterLogicalOperator) {
      this.filter(this.options.filter);
    }

    if ('gutterPixels' in newOptions) {
      this.filterContainer.updatePaddings();
      this.render(filterItems.getFiltered(this.options.filter));
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

  private render(itemsToFilterIn: FilterItem[]): void {
    const { filterContainer, filterItems, options } = this;
    const { filterInCss, filterOutCss, layout } = this.options.get();

    filterContainer.updateDimensions();

    filterItems.getFilteredOut(options.filter).forEach((filterItem): void => {
      filterItem.filterOut(filterOutCss);
    });

    const positions = makeLayoutPositions(layout, filterContainer);

    itemsToFilterIn.forEach((filterItem, index): void => {
      filterItem.filterIn(positions[index], filterInCss);
    });
  }

  /**
   * Initialization sequence of Filterizr when the grid is first loaded
   */
  private async initialize(): Promise<void> {
    const { filterContainer, filterItems, options, spinner } = this;

    await this.waitForImagesToLoad();

    if (this.options.isSpinnerEnabled) {
      // The spinner will first fade out (opacity: 0) before being removed
      await spinner.destroy();
    }

    // Enable animations after the initial render, to let
    // the items assume their positions before animating
    this.render(filterItems.getFiltered(options.filter));
    await filterItems.enableCssTransitions();

    filterContainer.trigger('init');
  }

  private get filterItems(): FilterItems {
    return this.filterContainer.filterItems;
  }

  private onTransitionEndCallback(): void {
    const { filterizrState, filterContainer } = this;

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

    this.filterizrState = FILTERIZR_STATE.IDLE;
  }

  private rebindFilterContainerEvents(): void {
    const { filterContainer } = this;
    const { animationDuration, callbacks } = this.options.get();
    filterContainer.unbindEvents();
    filterContainer.bindEvents({
      ...callbacks,
      onTransitionEnd: debounce(
        this.onTransitionEndCallback.bind(this),
        animationDuration,
        false
      ) as EventListener,
    });
  }

  private bindEvents(): void {
    const { filterItems, options, windowEventReceiver } = this;
    this.rebindFilterContainerEvents();
    windowEventReceiver.on('resize', () => {
      this.render(filterItems.getFiltered(options.filter));
    });
  }

  /**
   * Resolves when the images of the grid have finished loading into the DOM
   */
  private async waitForImagesToLoad(): Promise<void> {
    const { imagesHaveLoaded, filterContainer } = this;
    if (imagesHaveLoaded) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      imagesLoaded(filterContainer.node, (): void => {
        this.imagesHaveLoaded = true;
        resolve();
      });
    });
  }
}
