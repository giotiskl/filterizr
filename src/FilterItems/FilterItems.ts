import StyledFilterItems from './StyledFilterItems';
import { Filter } from '../types';
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

  public getFiltered(filter: Filter): FilterItem[] {
    const { searchTerm } = this.options;
    const searchedFilterItems = this.search(this.filterItems, searchTerm);
    if (filter === 'all') {
      return searchedFilterItems;
    }
    return searchedFilterItems.filter((filterItem): boolean =>
      this.shouldBeFiltered(filterItem.getCategories(), filter)
    );
  }

  public getFilteredOut(filter: Filter): FilterItem[] {
    const { searchTerm } = this.options;
    return this.filterItems.filter((filterItem: FilterItem): boolean => {
      const categories = filterItem.getCategories();
      const shouldBeFiltered = this.shouldBeFiltered(categories, filter);
      const contentsMatchSearch = filterItem.contentsMatchSearch(searchTerm);
      return !shouldBeFiltered || !contentsMatchSearch;
    });
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
    const filteredItems = this.getFiltered(this.options.filter);

    if (filteredItems.length > 1) {
      const indicesBeforeShuffling = this.getFiltered(this.options.filter)
        .map((filterItem): number => this.filterItems.indexOf(filterItem))
        .slice();

      // Shuffle filtered items (until they have a new order)
      let shuffledItems;
      do {
        shuffledItems = shuffle(filteredItems);
      } while (filterItemArraysHaveSameSorting(filteredItems, shuffledItems));
      {
        shuffledItems = shuffle(filteredItems);
      }

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

  private shouldBeFiltered(categories: string[], filter: Filter): boolean {
    const { multifilterLogicalOperator } = this.options.getRaw();
    const isMultifilteringEnabled = Array.isArray(filter);

    if (!isMultifilteringEnabled) {
      return categories.includes(filter as string);
    }

    if (multifilterLogicalOperator === 'or') {
      return !!intersection(categories, filter as string[]).length;
    }

    return allStringsOfArray1InArray2(filter as string[], categories);
  }
}
