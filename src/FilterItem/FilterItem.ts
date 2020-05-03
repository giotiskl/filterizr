import { getDataAttributesOfHTMLNode } from '../utils';
import { Dictionary, Position } from '../types/interfaces';
import FilterizrOptions from '../FilterizrOptions';
import FilterizrElement from '../FilterizrElement';
import StyledFilterItem from './StyledFilterItem';

/**
 * Resembles an item in the grid of Filterizr.
 */
export default class FilterItem extends FilterizrElement {
  protected styledNode: StyledFilterItem;

  private filteredOut: boolean;
  private lastPosition: Position;
  private sortData: Dictionary;

  public constructor(node: Element, index: number, options: FilterizrOptions) {
    super(node, options);
    this.filteredOut = false;
    this.lastPosition = { left: 0, top: 0 };
    this.sortData = {
      ...getDataAttributesOfHTMLNode(node),
      index,
      sortData: node.getAttribute('data-sort'),
    };
    this.styledNode = new StyledFilterItem(node as HTMLElement, index, options);
    this.styles.initialize();
    this.bindEvents();
  }

  public get styles(): StyledFilterItem {
    return this.styledNode;
  }

  /**
   * Destroys the FilterItem instance
   */
  public destroy(): void {
    super.destroy();
    this.unbindEvents();
  }

  /**
   * Filters in a specific FilterItem out of the grid.
   */
  public filterIn(targetPosition: Position): void {
    const { filterInCss } = this.options.get();
    this.styles.setFilteredStyles(targetPosition, filterInCss);
    this.lastPosition = targetPosition;
    this.filteredOut = false;
  }

  /**
   * Filters out a specific FilterItem out of the grid.
   */
  public filterOut(): void {
    const { filterOutCss } = this.options.get();
    this.styles.setFilteredStyles(this.lastPosition, filterOutCss);
    this.filteredOut = true;
  }

  /**
   * Returns true if the text contents of the FilterItem match the search term
   * @param searchTerm to look up
   */
  public contentsMatchSearch(searchTerm: string): boolean {
    return this.node.textContent.toLowerCase().includes(searchTerm);
  }

  /**
   * Returns all categories of the grid items data-category attribute
   * with a regexp regarding all whitespace.
   */
  public getCategories(): string[] {
    return this.node.getAttribute('data-category').split(/\s*,\s*/g);
  }

  /**
   * Returns the value of the sort attribute
   * @param sortAttribute "index", "sortData" or custom user data-attribute by which to sort
   */
  public getSortAttribute(sortAttribute: string): string | number {
    return this.sortData[sortAttribute];
  }

  protected bindEvents(): void {
    this.eventReceiver.on('transitionend', (): void => {
      // On transition end determines if the item is filtered out or not.
      // It adds a .filteredOut class so that user can target these items
      // via css if needed. It sets the z-index to -1000 to prevent mouse
      // events from being triggered.
      if (this.filteredOut) {
        this.node.classList.add('filteredOut');
        this.styles.setZIndex(-1000);
        this.styles.setHidden();
      } else {
        this.node.classList.remove('filteredOut');
        this.styles.removeZIndex();
      }
    });
  }

  protected unbindEvents(): void {
    this.eventReceiver.off('transitionend');
  }
}
