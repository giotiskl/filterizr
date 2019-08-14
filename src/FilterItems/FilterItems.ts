import StyledFilterItems from './StyledFilterItems';
import { Filter, Pagination } from '../types';
import FilterItem from '../FilterItem';
import FilterizrOptions from '../FilterizrOptions/FilterizrOptions';
import {
  allStringsOfArray1InArray2,
  filterItemArraysHaveSameSorting,
  intersection,
  shuffle,
  sortBy,
} from '../utils';
import { Destructible, Styleable } from '../types/interfaces';


export default class FilterItems implements Destructible, Styleable {
  private filterItems: FilterItem[];
  private styledFilterItems: StyledFilterItems;
  private options: FilterizrOptions;

  public constructor(filterItems: FilterItem[], options: FilterizrOptions) {
    this.filterItems = filterItems;
    this.styledFilterItems = new StyledFilterItems(filterItems);
    this.options = options;
  }

  public get styles(): StyledFilterItems {
    return this.styledFilterItems;
  }

  public get length(): number {
    return this.filterItems.length;
  }

  public getItem(index: number): FilterItem {
    return this.filterItems[index];
  }

  public destroy(): void {
    this.filterItems.forEach((filterItem): void => filterItem.destroy());
  }

  public push(filterItem: FilterItem): number {
    return this.filterItems.push(filterItem);
  }

  public remove(node: HTMLElement): void {
    this.filterItems = this.filterItems.filter(
      ({ node: filterItemNode }): boolean => filterItemNode !== node
    );
  }

  /**
   * returns all item that are positive, this mean all the items that should be keeped.
   */
  public getFiltered(filter: Filter, searchTerm : string, pagination : Pagination): FilterItem[] {
    searchTerm = searchTerm || ""; //replace empty search term by empty string, who always match.
    return this.filterItems.filter(this.getFilterPredicate(filter, searchTerm, pagination, true));
  }

  /**
   * returns all item that are negative, this mean all the items that should be removed.
   * the item is not keeped if the condition described in `getFiltered` is false.
   */
  public getFilteredOut(filter: Filter, searchTerm : string, pagination : Pagination): FilterItem[] {
    searchTerm = searchTerm || ""; //replace empty search term by empty string, who always match.
    return this.filterItems.filter(this.getFilterPredicate(filter, searchTerm, pagination, false));
  }

  /**
   * By extracting the structure of "getFiltered" and "getFilteredOut", we make it clearer the difference between them
   * and prevent us of doing error between the two by reducing code duplication
   * 
   * item is keeped if :
   * (it's categorie match the current filter or the current filter is "all") and 
   * (it text match the search term or there is no search term) and
   * (it's index match the current page range or there is no pagination)
   *
   * @param filter
   * @param searchTerm
   * @param inverse inverse the filtering. true => get all that are keeped. false => get all that are removed
   */
  private getFilterPredicate(filter : Filter, searchTerm : string, pagination : Pagination, inverse : boolean) : (f : FilterItem) => boolean {
    let acceptedElemCount = 0;
    return (filterItem : FilterItem) : boolean => {
      const shouldBeFiltered = this.shouldBeFiltered(filterItem.getCategories(), filter)
      const contentsMatchSearch = filterItem.contentsMatchSearch(searchTerm);
      const elementInRange = !pagination || (acceptedElemCount >= pagination.start && acceptedElemCount < pagination.end)
      if(shouldBeFiltered && contentsMatchSearch) {
        acceptedElemCount++;
      }
      if(inverse) {
        return shouldBeFiltered && contentsMatchSearch && elementInRange
      } else {
        return !(shouldBeFiltered && contentsMatchSearch && elementInRange);
      }
    }
  }

  public sort(
    sortAttr: string = 'index',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): void {
    const sortedItems = sortBy(this.filterItems, (filterItem: FilterItem):
      | string
      | number => filterItem.getSortAttribute(sortAttr));

    const orderedSortedItems =
      sortOrder === 'asc' ? sortedItems : sortedItems.reverse();

    this.filterItems = orderedSortedItems;
  }

  public shuffle(): void {
    const filteredItems = this.getFiltered(this.options.filter, this.options.searchTerm, null);

    if (filteredItems.length > 1) {
      const indicesBeforeShuffling = filteredItems
        .map((filterItem): number => this.filterItems.indexOf(filterItem));

      // Shuffle filtered items (until they have a new order)
      let shuffledItems;
      do {
        shuffledItems = shuffle(filteredItems);
      } while (filterItemArraysHaveSameSorting(filteredItems, shuffledItems));

      // Update filterItems to have them in the new shuffled order
      shuffledItems.forEach((filterItem, index): void => {
        const newIndex = indicesBeforeShuffling[index];
        this.filterItems = Object.assign([], this.filterItems, {
          [newIndex]: filterItem,
        });
      });
    }
  }

  private search(
    filteredItems: FilterItem[],
    searchTerm: string
  ): FilterItem[] {
    if (!searchTerm) {
      return filteredItems;
    }
    return filteredItems.filter((filterItem: FilterItem): boolean =>
      filterItem.contentsMatchSearch(searchTerm)
    );
  }

  /**
   * the filter system is mostly positive. you must have some or all of the filter term in your categorie to be still here.
   * @returns {boolean}, true if the element should be keeped. the name is misleading.
   */
  private shouldBeFiltered(categories: string[], filter: Filter): boolean {
    //by checking for filter === "all" here, we prevent us to forget to check it before calling "shouldBeFiltered"
    if(filter === "all") {
      return true
    //By directly putting "isArray" in if condition, we can use typescript garde and we don't have to specify the type of filter with "as"
    } else if(Array.isArray(filter)) {
      //By using ternary operator, we reduce the number of "if" and "return" in the function, making it (arguably) clearer to read.
      return this.options.getRaw().multifilterLogicalOperator === 'or' ?
        !!intersection(categories, filter).length :
        allStringsOfArray1InArray2(filter, categories)
    } else {
      return categories.includes(filter);
    }
  }
}
