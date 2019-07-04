import { Filter } from './ActiveFilter';
import FilterItem from './FilterItem';
import FilterizrOptions from './FilterizrOptions/FilterizrOptions';
import {
  allStringsOfArray1InArray2,
  filterItemArraysHaveSameSorting,
  intersection,
  setStyles,
  shuffle,
  sortBy,
} from './utils';

export default class FilterItems {
  private filterItems: FilterItem[];
  private options: FilterizrOptions;

  public constructor(filterItems: FilterItem[], options: FilterizrOptions) {
    this.filterItems = filterItems;
    this.options = options;
  }

  public get length(): number {
    return this.filterItems.length;
  }

  public get(): FilterItem[] {
    return this.filterItems;
  }

  public getItem(index: number): FilterItem {
    return this.filterItems[index];
  }

  public set(filterItems: FilterItem[]): void {
    this.filterItems = filterItems;
  }

  public destroy(): void {
    this.filterItems.forEach((filterItem): void => filterItem.destroy());
  }

  public updateTransitionStyle(): void {
    const {
      animationDuration,
      easing,
      delay,
      delayMode,
    } = this.options.getRaw();

    this.filterItems.forEach((filterItem): void =>
      setStyles(filterItem.node, {
        transition: `all ${animationDuration}s ${easing} ${filterItem.getTransitionDelay(
          delay,
          delayMode
        )}ms`,
      })
    );
  }

  public updateDimensions(): void {
    this.filterItems.forEach((filterItem): void =>
      filterItem.updateDimensions()
    );
  }

  public push(filterItem: FilterItem): number {
    return this.filterItems.push(filterItem);
  }

  public getFiltered(filter: Filter): FilterItem[] {
    const filterItems = this.get();

    if (filter === 'all') {
      return filterItems;
    }

    return filterItems.filter((filterItem: FilterItem): boolean => {
      const categories = filterItem.getCategories();
      return this.shouldBeFiltered(categories, filter);
    });
  }

  public getFilteredOut(filter: Filter): FilterItem[] {
    const filterItems = this.get();
    return filterItems.filter((filterItem: FilterItem): boolean => {
      const categories: string[] = filterItem.getCategories();
      const shouldBeFiltered: boolean = this.shouldBeFiltered(
        categories,
        filter
      );
      const contentsMatchSearch: boolean = filterItem.contentsMatchSearch(
        this.options.searchTerm
      );
      return !shouldBeFiltered || !contentsMatchSearch;
    });
  }

  public getSorted(
    sortAttr: string = 'index',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): FilterItem[] {
    const filterItems = this.get();

    const sortedItems = sortBy(filterItems, (filterItem: FilterItem):
      | string
      | number => filterItem.getSortAttribute(sortAttr));

    const orderedSortedItems =
      sortOrder === 'asc' ? sortedItems : sortedItems.reverse();

    this.set(orderedSortedItems);

    return this.getFiltered(this.options.filter);
  }

  public getSearched(searchTerm: string): FilterItem[] {
    const filteredItems = this.getFiltered(this.options.filter);

    if (!searchTerm) {
      return filteredItems;
    }

    return filteredItems.filter((filterItem: FilterItem): boolean =>
      filterItem.contentsMatchSearch(searchTerm)
    );
  }

  public getShuffled(): FilterItem[] {
    const filteredItems = this.getFiltered(this.options.filter);

    if (filteredItems.length <= 1) {
      return filteredItems;
    }

    const indicesBeforeShuffling = this.getFiltered(this.options.filter)
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

    // Update filterItems to have them in the new shuffled order
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

  private shouldBeFiltered(categories: string[], filter: Filter): boolean {
    const { multifilterLogicalOperator } = this.options.get();
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
