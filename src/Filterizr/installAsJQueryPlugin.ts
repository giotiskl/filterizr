import Filterizr from './Filterizr';
import { defaultOptions } from '../FilterizrOptions';

export default function installAsJQueryPlugin($: any): void {
  if (!$)
    throw new Error(
      'Filterizr as a jQuery plugin, requires jQuery to work. If you would prefer to use the vanilla JS version, please use the correct bundle file.'
    );

  // Add filterizr method on jQuery prototype
  $.fn.filterizr = function(): any {
    const selector = `.${$.trim(this.get(0).className).replace(/\s+/g, '.')}`;
    const args = arguments;

    // user is instantiating Filterizr
    if (
      (!this._fltr && args.length === 0) ||
      (args.length === 1 && typeof args[0] === 'object')
    ) {
      const options = args.length > 0 ? args[0] : defaultOptions;
      this._fltr = new Filterizr(selector, options);
    }
    // otherwise call the method called
    else if (args.length >= 1 && typeof args[0] === 'string') {
      const method = args[0];
      const methodArgs = Array.prototype.slice.call(args, 1);
      const filterizr = this._fltr;
      switch (method) {
        case 'filter':
          filterizr.filter(...methodArgs);
          return this;
        case 'insertItem':
          filterizr.insertItem(...methodArgs);
          return this;
        case 'removeItem':
          filterizr.removeItem(...methodArgs);
          return this;
        case 'toggleFilter':
          filterizr.toggleFilter(...methodArgs);
          return this;
        case 'sort':
          filterizr.sort(...methodArgs);
          return this;
        case 'shuffle':
          filterizr.shuffle(...methodArgs);
          return this;
        case 'search':
          filterizr.search(...methodArgs);
          return this;
        case 'setOptions':
          filterizr.setOptions(...methodArgs);
          return this;
        case 'destroy':
          filterizr.destroy(...methodArgs);
          // Kill internal reference to Filterizr instance
          delete this._fltr;
          return this;
        default:
          throw new Error(
            `Filterizr: ${method} is not part of the Filterizr API. Please refer to the docs for more information.`
          );
      }
    }

    return this;
  };
}
