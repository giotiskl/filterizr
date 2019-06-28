import { IDefaultOptions } from './defaultOptions';

export type Filter = string | string[];

export default class ActiveFilter {
  private _options: IDefaultOptions;

  constructor(options: IDefaultOptions) {
    this._options = options;
  }

  get filter(): Filter {
    return this._options.filter;
  }

  set(targetFilter: Filter): void {
    this._options.filter = targetFilter;
  }

  toggle(targetFilter: string): void {
    this._options.filter = this._toggle(
      this._options.filter,
      targetFilter
    );
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
