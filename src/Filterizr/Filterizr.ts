import { FILTERIZR_STATE } from '../config';
import { Filter } from '../types';
import { RawOptions, Destructible, Dimensions } from '../types/interfaces';
import { getHTMLElement, debounce } from '../utils';
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

export default class Filterizr implements Destructible {
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
  private imagesHaveLoaded: boolean;
  private spinner?: Spinner;

  public constructor(
    selectorOrNode: string | HTMLElement = '.filtr-container',
    userOptions: RawOptions = {}
  ) {
    this.options = new FilterizrOptions(userOptions);

    const {
      areControlsEnabled,
      controlsSelector,
      isSpinnerEnabled,
    } = this.options;

    this.windowEventReceiver = new EventReceiver(window);
    this.filterContainer = new FilterContainer(
      getHTMLElement(selectorOrNode),
      this.options
    );
    this.imagesHaveLoaded = !this.filterContainer.node.querySelectorAll('img')
      .length;

    if (areControlsEnabled) {
      this.filterControls = new FilterControls(this, controlsSelector);
    }
    if (isSpinnerEnabled) {
      this.spinner = new Spinner(this.filterContainer, this.options);
    }

    this.initialize();
  }

  private get filterItems(): FilterItems {
    return this.filterContainer.filterItems;
  }

  /**
   * Filters the items in the grid by a category
   * @param category by which to filter
   */
  public filter(category: Filter): void {
    const { filterContainer } = this;

    filterContainer.trigger('filteringStart');
    filterContainer.filterizrState = FILTERIZR_STATE.FILTERING;

    category = Array.isArray(category)
      ? category.map((c): string => c.toString())
      : category.toString();

    this.options.filter = category;
    this.render();
  }

  public destroy(): void {
    const { windowEventReceiver, filterControls, filterContainer } = this;
    filterContainer.destroy();
    windowEventReceiver.destroy();
    if (this.options.areControlsEnabled && filterControls) {
      filterControls.destroy();
    }
  }

  /**
   * Inserts a new FilterItem into the grid
   */
  public async insertItem(node: HTMLElement): Promise<void> {
    const { filterContainer } = this;
    filterContainer.insertItem(node);
    await this.waitForImagesToLoad();
    this.render();
  }

  /**
   * Removes a FilterItem from the grid
   */
  public removeItem(node: HTMLElement): void {
    const { filterContainer } = this;
    filterContainer.removeItem(node);
    this.render();
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
    filterContainer.filterizrState = FILTERIZR_STATE.SORTING;
    filterItems.sort(sortAttr, sortOrder);
    this.render();
  }

  /**
   * Searches through the FilterItems for a given string and adds an additional filter layer.
   */
  public search(searchTerm: string = this.options.get().searchTerm): void {
    this.options.searchTerm = searchTerm.toLowerCase();
    this.render();
  }

  /**
   * Shuffles the FilterItems in the grid, making sure their positions have changed.
   */
  public shuffle(): void {
    const { filterContainer, filterItems } = this;
    filterContainer.trigger('shufflingStart');
    filterContainer.filterizrState = FILTERIZR_STATE.SHUFFLING;
    filterItems.shuffle();
    this.render();
  }

  /**
   * Updates the perferences of the users for rendering the Filterizr grid,
   * additionally performs error checking on the new options passed.
   * @param newOptions to override the defaults.
   */
  public setOptions(newOptions: RawOptions): void {
    const { filterContainer, filterItems } = this;
    const animationPropIsSet =
      'animationDuration' in newOptions ||
      'delay' in newOptions ||
      'delayMode' in newOptions;

    if (newOptions.callbacks || animationPropIsSet) {
      // Remove old callbacks before setting the new ones in the options
      filterContainer.unbindEvents();
    }

    this.options.set(newOptions);

    if (newOptions.easing || animationPropIsSet) {
      filterItems.styles.updateTransitionStyle();
    }

    if (newOptions.callbacks || animationPropIsSet) {
      filterContainer.bindEvents();
    }

    if ('searchTerm' in newOptions) {
      this.search(newOptions.searchTerm);
    }

    if (
      'filter' in newOptions ||
      'multifilterLomultifilterLogicalOperator' in newOptions
    ) {
      this.filter(this.options.filter);
    }

    if ('gutterPixels' in newOptions) {
      this.filterContainer.styles.updatePaddings();
      this.filterItems.styles.updateWidthWithTransitionsDisabled();
      this.render();
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

  private render(): void {
    const { filterContainer, filterItems, options } = this;
    const itemsToFilterIn = filterItems.getFiltered(options.filter);

    filterItems.getFilteredOut(options.filter).forEach((filterItem): void => {
      filterItem.filterOut();
    });

    const { containerHeight, itemsPositions } = makeLayoutPositions(
      filterContainer.dimensions.width,
      itemsToFilterIn.map(({ dimensions }): Dimensions => dimensions),
      this.options.get()
    );
    filterContainer.setHeight(containerHeight);

    itemsToFilterIn.forEach((filterItem, index): void => {
      filterItem.filterIn(itemsPositions[index]);
    });
  }

  /**
   * Initialization sequence of Filterizr when the grid is first loaded
   */
  private async initialize(): Promise<void> {
    const { filterContainer, filterItems, spinner } = this;
    this.bindEvents();
    await this.waitForImagesToLoad();
    if (this.options.isSpinnerEnabled) {
      // The spinner will first fade out (opacity: 0) before being removed
      await spinner.destroy();
    }
    // Enable animations after the initial render, to let
    // the items assume their positions before animating
    this.render();
    await filterItems.styles.enableTransitions();
    filterContainer.trigger('init');
  }

  private bindEvents(): void {
    const { filterItems, windowEventReceiver } = this;
    windowEventReceiver.on('resize', debounce(
      (): void => {
        filterItems.styles.updateWidthWithTransitionsDisabled();
        this.render();
      },
      50,
      false
    ) as EventListener);
  }

  /**
   * Resolves when the images of the grid have finished loading into the DOM
   */
  private async waitForImagesToLoad(): Promise<void> {
    const { imagesHaveLoaded, filterContainer } = this;
    if (imagesHaveLoaded) {
      return Promise.resolve();
    }
    return new Promise((resolve): void => {
      imagesLoaded(filterContainer.node, (): void => {
        this.imagesHaveLoaded = true;
        resolve();
      });
    });
  }
}
