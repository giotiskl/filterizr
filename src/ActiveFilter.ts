import { Filter } from './types';

/**
 * ActiveFilter represents the currently active filter over
 * the grid.
 *
 * It can be a plain string value or an array of strings.
 */
export default class ActiveFilter {
  private filter: Filter;

  public constructor(filter: Filter) {
    this.filter = filter;
  }

  public get(): Filter {
    return this.filter;
  }

  public set(targetFilter: Filter): void {
    this.filter = targetFilter;
  }

  public toggle(targetFilter: string): void {
    this.filter = this.toggleFilter(this.filter, targetFilter);
  }

  private toggleFilter(
    activeFilter: Filter,
    targetFilter: string
  ): string | string[] {
    if (activeFilter === 'all') {
      return targetFilter;
    }

    if (Array.isArray(activeFilter)) {
      if (activeFilter.includes(targetFilter)) {
        const newActiveFilter = activeFilter.filter(
          (filter): boolean => filter !== targetFilter
        );
        return newActiveFilter.length === 1
          ? newActiveFilter[0]
          : newActiveFilter;
      }
      return [...activeFilter, targetFilter];
    }

    if (activeFilter === targetFilter) {
      return 'all';
    }

    return [activeFilter, targetFilter];
  }
}
