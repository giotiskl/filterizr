export type Filter = string | string[];

export default class ActiveFilter {
  private _filter: Filter;

  constructor(filter: Filter) {
    this._filter = filter;
  }

  get(): Filter {
    return this._filter;
  }

  set(targetFilter: Filter): void {
    this._filter = targetFilter;
  }

  toggle(targetFilter: string): void {
    this._filter = this._toggle(this._filter, targetFilter);
  }

  private _toggle(
    activeFilter: string | string[],
    targetFilter: string
  ): string | string[] {
    if (activeFilter === 'all') {
      return targetFilter;
    }

    if (Array.isArray(activeFilter)) {
      if (activeFilter.includes(targetFilter)) {
        const newActiveFilter = activeFilter.filter(
          filter => filter !== targetFilter
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
