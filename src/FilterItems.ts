import { Filter } from './ActiveFilter';
import FilterItem from './FilterItem';
import FilterizrOptions from './FilterizrOptions/FilterizrOptions';
import {
  intersection,
  allStringsOfArray1InArray2,
  sortBy,
  shuffle,
  filterItemArraysHaveSameSorting,
} from './utils';

export default class FilterItems {
  private _filterItems: FilterItem[];
  private _options: FilterizrOptions;

  public constructor(filterItems: FilterItem[], options: FilterizrOptions) {
    this._filterItems = filterItems;
    this._options = options;
  }

  public get(): FilterItem[] {
    return this._filterItems;
  }

  public set(filterItems: FilterItem[]): void {
    this._filterItems = filterItems;
  }

  public getFiltered(filter: Filter): FilterItem[] {
    const filterItems = this.get();

    if (filter === 'all') {
      return filterItems;
    }

    return filterItems.filter((filterItem: FilterItem): boolean => {
      const categories = filterItem.getCategories();
      return this._shouldBeFiltered(categories, filter);
    });
  }

  public getFilteredOut(filter: Filter): FilterItem[] {
    const filterItems = this.get();
    return filterItems.filter((filterItem: FilterItem): boolean => {
      const categories: string[] = filterItem.getCategories();
      const shouldBeFiltered: boolean = this._shouldBeFiltered(
        categories,
        filter
      );
      const contentsMatchSearch: boolean = filterItem.contentsMatchSearch(
        this._options.searchTerm
      );
      return !shouldBeFiltered || !contentsMatchSearch;
    });
  }

  public getSorted(
    sortAttr: string = 'index',
    sortOrder: string = 'asc'
  ): FilterItem[] {
    const filterItems = this.get();

    const sortedItems = sortBy(filterItems, (filterItem: FilterItem):
      | string
      | number => {
      if (sortAttr === 'index' || sortAttr === 'sortData') {
        // Default sort attribute is used
        return filterItem.props[sortAttr];
      }
      return filterItem.props.data[sortAttr];
    });
    const orderedSortedItems =
      sortOrder === 'asc' ? sortedItems : sortedItems.reverse();

    this.set(orderedSortedItems);

    return this.getFiltered(this._options.filter);
  }

  public getSearched(searchTerm: string): FilterItem[] {
    const filteredItems = this.getFiltered(this._options.filter);

    if (!searchTerm) {
      return filteredItems;
    }

    return filteredItems.filter((filterItem: FilterItem): boolean =>
      filterItem.contentsMatchSearch(searchTerm)
    );
  }

  public getShuffled(): FilterItem[] {
    const filteredItems = this.getFiltered(this._options.filter);

    if (filteredItems.length <= 1) {
      return filteredItems;
    }

    const indicesBeforeShuffling = this.getFiltered(this._options.filter)
      .map((filterItem: FilterItem): number => this.get().indexOf(filterItem))
      .slice();

    // Shuffle filtered items (until they have a new order)
    let shuffledItems;
    do {
      shuffledItems = shuffle(filteredItems);
    } while (filterItemArraysHaveSameSorting(filteredItems, shuffledItems));
    {
      shuffledItems = shuffle(filteredItems);
    }

    // Update the FilterItems to have them in the shuffled order
    shuffledItems.forEach((filterItem, index): void => {
      const newIndex = indicesBeforeShuffling[index];
      this.set(
        Object.assign([], this.get(), {
          [newIndex]: filterItem,
        })
      );
    });

    return shuffledItems;
  }

  private _shouldBeFiltered(categories: string[], filter: Filter): boolean {
    const { multifilterLogicalOperator } = this._options.get();
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
