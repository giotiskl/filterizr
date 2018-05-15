/**
 * Filterizr is a jQuery plugin that sorts, shuffles and applies stunning filters over
 * responsive galleries using CSS3 transitions and custom CSS effects.
 *
 * @author Yiotis Kaltsikis
 * @see {@link http://yiotis.net/filterizr}
 * @version 1.3.5
 * @license MIT License
 */

let $, jQuery;
$ = jQuery = IMPORT_JQUERY ? require('jquery') : window.jQuery;
import Filterizr from './Filterizr';
import FilterContainer from './FilterContainer';
import FilterItem from './FilterItem';
import DefaultOptions from './DefaultOptions';
import executePolyfills from './polyfills';

(function($) {
  //Make sure jQuery exists
  if (!$) throw new Error('Filterizr requires jQuery to work.');

  // Execute polyfills
  executePolyfills();

  // Extract .filterizr method on jQuery prototype
  $.fn.filterizr = function() {
    const selector = `.${$.trim(this.get(0).className).replace(/\s+/g, '.')}`;
    const args = arguments;

    // user is instantiating Filterizr
    if (!this._fltr && args.length === 0 || (args.length === 1 && typeof args[0] === 'object')) {
      const options = args.length > 0 ? args[0] : DefaultOptions;
      this._fltr = new Filterizr(selector, options);
    }
    // otherwise call the method called
    else if (args.length >= 1 && typeof args[0] === 'string') {
      const method = args[0];
      const methodArgs = Array.prototype.slice.call(args, 1);
      const filterizr = this._fltr;
      switch(method) {
        case 'filter':
          filterizr.filter(...methodArgs);
          return this;
        case 'insertItem':
          filterizr.insertItem(...methodArgs);
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
          throw new Error(`Filterizr: ${method} is not part of the Filterizr API. Please refer to the docs for more information.`);
      }
    }

    return this;
  };
})(jQuery);

// Export all Filterizr classes
export {
  Filterizr,
  FilterContainer,
  FilterItem,
  DefaultOptions,
};

// Set default export to jQuery object extended with Filterizr plugin
export default $;

// Required for development purposes when JQUERY_IMPORT is set to true
// so that the Filterizr and its controls for demo/index.html are initialized.
require('./demoInit');
