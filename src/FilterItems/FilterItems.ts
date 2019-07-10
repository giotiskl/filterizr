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
import { Styleable } from '../types/interfaces';

export default class FilterItems implements Styleable {
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

  public get(): FilterItem[] {
    return this.filterItems;
  }

  public set(filterItems: FilterItem[]): void {
    this.filterItems = filterItems;
  }

  public getItem(index: number): FilterItem {
    return this.filterItems[index];
  }

  public destroy(): void {
    this.filterItems.forEach((filterItem): void => filterItem.destroy());
  }

  public updateDimensions(): void {
    this.filterItems.forEach((filterItem): void =>
      filterItem.updateDimensions()
    );
  }

  public push(filterItem: FilterItem): number {
    return this.filterItems.push(filterItem);
  }

  public remove(node: HTMLElement): void {
    this.set(
      this.filterItems.filter(
        ({ node: filterItemNode }): boolean => filterItemNode !== node
      )
    );
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
