import { cssEasingValuesRegexp, LAYOUT } from '../config';
import { BaseOptions, RawOptions } from './../types/interfaces';
import { defaultOptions } from '.';
import { checkOptionForErrors, merge } from '../utils';
import ActiveFilter from '../ActiveFilter';
import { Filter } from '../types';

export interface Options extends BaseOptions {
  filter: ActiveFilter;
}

export default class FilterizrOptions {
  private options: Options;

  public constructor(userOptions: RawOptions) {
    const options = merge({}, defaultOptions, this.validate(userOptions));
    this.options = this.convertToFilterizrOptions(options);
  }

  public get isSpinnerEnabled(): boolean {
    return this.options.spinner.enabled;
  }

  public get areControlsEnabled(): boolean {
    return this.options.setupControls;
  }

  public get controlsSelector(): string {
    return this.options.controlsSelector;
  }

  public get filter(): Filter {
    return this.options.filter.get();
  }

  public set filter(filter: Filter) {
    this.options.filter.set(filter);
  }

  public toggleFilter(filter: string): void {
    this.options.filter.toggle(filter);
  }

  public get searchTerm(): string {
    return this.options.searchTerm;
  }

  public set searchTerm(searchTerm: string) {
    this.options.searchTerm = searchTerm;
  }

  public get(): Options {
    return this.options;
  }

  public getRaw(): RawOptions {
    return this.convertToOptions(this.options);
  }

  public set(newUserOptions: RawOptions): void {
    const options = merge(
      {},
      this.convertToOptions(this.options),
      this.validate(newUserOptions)
    );
    this.options = this.convertToFilterizrOptions(options);
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
    checkOptionForErrors(
      'gridItemsSelector',
      options.gridItemsSelector,
      'string'
    );
    checkOptionForErrors('gutterPixels', options.gutterPixels, 'number');
    checkOptionForErrors(
      'layout',
      options.layout,
      'string',
      Object.values(LAYOUT)
    );
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
