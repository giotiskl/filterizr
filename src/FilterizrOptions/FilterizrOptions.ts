import defaultUserOptions, {
  IBaseOptions,
  IUserOptions,
} from './defaultOptions';
import { cssEasingValuesRegexp, checkOptionForErrors, merge } from '../utils';
import ActiveFilter from '../ActiveFilter';

export interface IFilterizrOptions extends IBaseOptions {
  filter: ActiveFilter;
}

export default class FilterizrOptions {
  private _options: IFilterizrOptions;

  constructor(userOptions: IUserOptions) {
    const options = merge(defaultUserOptions, this.validate(userOptions));
    this._options = this.convertToFilterizrOptions(options);
  }

  get(): IFilterizrOptions {
    return this._options;
  }

  getRaw(): IUserOptions {
    return this.convertToOptions(this._options);
  }

  set(newUserOptions: IUserOptions) {
    const options = merge(
      this.convertToOptions(this._options),
      this.validate(newUserOptions)
    );
    this._options = this.convertToFilterizrOptions(options);
  }

  convertToFilterizrOptions(userOptions: IUserOptions): IFilterizrOptions {
    return {
      ...userOptions,
      filter: new ActiveFilter(userOptions.filter),
    };
  }

  convertToOptions(filterizrOptions: IFilterizrOptions): IUserOptions {
    return {
      ...filterizrOptions,
      filter: filterizrOptions.filter.get(),
    };
  }

  validate(options: IUserOptions): IUserOptions {
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
    checkOptionForErrors('setupControls', options.setupControls, 'boolean');

    return options;
  }
}
