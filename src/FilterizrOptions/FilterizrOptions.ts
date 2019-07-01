import { Filter } from './../ActiveFilter';
import defaultUserOptions, { BaseOptions, RawOptions } from './defaultOptions';
import { cssEasingValuesRegexp, checkOptionForErrors, merge } from '../utils';
import ActiveFilter from '../ActiveFilter';

export interface Options extends BaseOptions {
  filter: ActiveFilter;
}

export default class FilterizrOptions {
  private _options: Options;

  public constructor(userOptions: RawOptions) {
    const options = merge(defaultUserOptions, this.validate(userOptions));
    this._options = this.convertToFilterizrOptions(options);
  }

  public get filter(): Filter {
    return this._options.filter.get();
  }

  public set filter(filter: Filter) {
    this._options.filter.set(filter);
  }

  public toggleFilter(filter: string): void {
    this._options.filter.toggle(filter);
  }

  public get searchTerm(): string {
    return this._options.searchTerm;
  }

  public set searchTerm(searchTerm: string) {
    this._options.searchTerm = searchTerm;
  }

  public get(): Options {
    return this._options;
  }

  public getRaw(): RawOptions {
    return this.convertToOptions(this._options);
  }

  public set(newUserOptions: RawOptions): void {
    const options = merge(
      this.convertToOptions(this._options),
      this.validate(newUserOptions)
    );
    this._options = this.convertToFilterizrOptions(options);
  }

  private convertToFilterizrOptions(userOptions: RawOptions): Options {
    return {
      ...userOptions,
      filter: new ActiveFilter(userOptions.filter),
    };
  }

  private convertToOptions(filterizrOptions: Options): RawOptions {
    return {
      ...filterizrOptions,
      filter: filterizrOptions.filter.get(),
    };
  }

  private validate(options: RawOptions): RawOptions {
    checkOptionForErrors(
      'animationDuration',
      options.animationDuration,
      'number'
    );
    checkOptionForErrors('callbacks', options.callbacks, 'object');
    checkOptionForErrors(
      'controlsSelector',
      options.controlsSelector,
      'string'
    );
    checkOptionForErrors('delay', options.delay, 'number');
    checkOptionForErrors(
      'easing',
      options.easing,
      'string',
      cssEasingValuesRegexp,
      'https://www.w3schools.com/cssref/css3_pr_transition-timing-function.asp'
    );
    checkOptionForErrors('delayMode', options.delayMode, 'string', [
      'progressive',
      'alternate',
    ]);
    checkOptionForErrors('filter', options.filter, 'string|number|array');
    checkOptionForErrors('filterOutCss', options.filterOutCss, 'object');
    checkOptionForErrors('filterInCss', options.filterOutCss, 'object');
    checkOptionForErrors('layout', options.layout, 'string', [
      'sameSize',
      'vertical',
      'horizontal',
      'sameHeight',
      'sameWidth',
      'packed',
    ]);
    checkOptionForErrors(
      'multifilterLogicalOperator',
      options.multifilterLogicalOperator,
      'string',
      ['and', 'or']
    );
    checkOptionForErrors('searchTerm', options.searchTerm, 'string');
    checkOptionForErrors('setupControls', options.setupControls, 'boolean');

    return options;
  }
}
