// import test utils
import $ from 'jquery';
import { fakeDom } from './testSetup';
// import items to be tested
import Filterizr from '../src/Filterizr';
import DefaultOptions from '../src/DefaultOptions';

// General setup
window.$ = $;

// Test suite for Filterizr
describe('Filterizr', () => {
  // Basic setup before all tests
  let filterizr;
  let filterContainer;

  beforeEach(() => {
    $('body').html(fakeDom);
    filterizr = new Filterizr('.filtr-container', DefaultOptions);
    filterContainer = filterizr.props.FilterContainer;
  });

  describe('#constructor', () => {
    it('should throw an exception when a non-existent container selector is passed as an argument', () => {
      const instantiateBrokenFilterizr = () => {
        new Filterizr('.non-existent-container', DefaultOptions);
      };
      expect(instantiateBrokenFilterizr).toThrowError(/could not find a container/);
    });

    it('should take an optional parameter selector which defaults to ".filtr-container"', () => {
      expect(filterContainer.$node.length).toBeGreaterThan(0);
    });

    it('should return a new instance of the Filterizr class', () => {
      expect(filterizr instanceof Filterizr).toBe(true);
    });

    it('should still work on containers with multiple class names', () => {
      $('.filtr-container').addClass('randomclass1 randomclass2');
      const instantiateFreshFilterizr = () => {
        new Filterizr('.filtr-container', DefaultOptions);
      };
      expect(instantiateFreshFilterizr).not.toThrowError();
    });
  });

  describe('#destroy', () => {
    beforeEach(() => {
      filterizr.filter('1');
    });

    it('should reset all inline styles on the .filtr-container', () => {
      const oldInlineStyles = filterContainer.$node.attr('style');
      filterContainer.destroy();
      const newInlineStyles = filterContainer.$node.attr('style');

      expect(oldInlineStyles).toBeTruthy();
      expect(newInlineStyles).toEqual('');
    });

    it('should reset all inline styles on its .filtr-item children', () => {
      const oldInlineStyles = filterContainer.$node.find('.filtr-item').attr('style');
      filterContainer.destroy();
      const newInlineStyles = filterContainer.$node.find('.filtr-item').attr('style');

      expect(oldInlineStyles).toBeTruthy();
      expect(newInlineStyles).toEqual('');
    });
  });

  describe('#filter', () => {
    const filter = '2';
    let FilteredOutItems, FilteredInItems;

    beforeEach(() => {
      filterizr.filter(filter);
      FilteredOutItems = filterizr.props.FilterItems.filter((FilterItem) => {
        const categories = FilterItem.getCategories();
        return !categories.includes(filter);
      });
      FilteredInItems = filterizr.props.FilterItems.filter(FilterItem => {
        const categories = FilterItem.getCategories();
        return categories.includes(filter);
      });
    });

    it('should keep as visible only the .filtr-item elements, whose data-category contains the active filter', () => {
      // Wait for animation to finish before test
      setTimeout(() => {
        FilteredInItems.forEach((FilterItem) => {
          const categories = FilterItem.getCategories();
          const belongsToCategory = categories.includes(filter);
          expect(belongsToCategory).toEqual(true);
        });
      }, 1000);
    });

    it('should add the .filteredOut class to all filtered out .filtr-item elements', () => {
      // Wait for animation to finish before test
      setTimeout(() => {
        FilteredOutItems.forEach((FilterItem) => {
          expect(FilterItem.$node.hasClass('.filteredOut'));
        });
      });
    });

    it('should set an inline style z-index: -1000 on filteringEnd for .filteredOut .filtr-item elements', () => {
      // Wait for animation to finish before test
      setTimeout(() => {
        FilteredOutItems.forEach((FilterItem) => {
          const zIndexOfFilteredOutItem = FilterItem.$node.css('z-index');
          expect(zIndexOfFilteredOutItem).toEqual('-1000');
        });
      }, 1000);
    });
  });

  describe('#toggleFilter', () => {
    it('should set the filter back to "all" if it was set to only 1 category and that category is toggled', () => {
      filterizr.toggleFilter('1');
      filterizr.toggleFilter('1');
      const { filter } = filterizr.options;
      expect(filter).toEqual('all');
    });

    it('should create an array of active filters if multiple filters are toggled', () => {
      filterizr.toggleFilter('1');
      filterizr.toggleFilter('2');
      const { filter } = filterizr.options;
      expect(filter).toEqual(['1', '2']);
    });

    it('should set the filter to be of type string if there is only 1 active filter', () => {
      filterizr.toggleFilter('1');
      const { filter } = filterizr.options;
      expect(typeof filter).toEqual('string');
    });

    it('should set the filter to be of type array if there are many active filters', () => {
      filterizr.toggleFilter('1');
      filterizr.toggleFilter('2');
      const { filter } = filterizr.options;
      expect(Array.isArray(filter)).toEqual(true);
    });

    it('should turn off an active filter if toggled', () => {
      filterizr.toggleFilter('1');
      filterizr.toggleFilter('2');
      filterizr.toggleFilter('3');
      filterizr.toggleFilter('3');
      const { filter } = filterizr.options;
      expect(filter).toEqual(['1', '2']);
    });
  });

  describe('#insertItem', () => {
    let $nodeToAdd, oldLength;

    beforeEach(() => {
      $nodeToAdd = filterContainer.$node.find('.filtr-item:last');
      oldLength = filterizr.props.FilterItems.length;
    });

    it ('should increase the length of the FilterItems array by 1', () => {
      filterizr.insertItem($nodeToAdd);
      const newLength = filterizr.props.FilterItems.length;
      expect(newLength).toBeGreaterThan(oldLength);
    });

    it ('should add into the grid a new FilterItem with the index property equal to the length of the FilterItems array', () => {
      filterizr.insertItem($nodeToAdd);
      const indexOfNewLastItem = filterizr.props.FilterItems[oldLength].props.index;
      expect(indexOfNewLastItem).toEqual(oldLength);
    });
  });

  describe('#sort', () => {
    it('should return a sorted grid', () => {
      filterizr.sort('index', 'desc');
      const { FilterItems } = filterizr.props;
      const { length } = FilterItems;
      for (let i = 0; i < length; i++) {
        expect(FilterItems[i].props.index).toEqual((length - 1) - i);
      }
    });
  });

  describe('#search', () => {
    it('should apply an extra layer of filtering based on the search term', () => {
      filterizr.filter('1'); // by this point 3 items should be visible
      filterizr.search('city'); // by this point 2 items should be visible
      expect(filterizr.props.FilteredItems.length).toEqual(2);
    });

    it('should render an empty grid if no item was found', () => {
      filterizr.search('term not contained anywhere in the grid');
      expect(filterizr.props.FilteredItems.length).toEqual(0);
    });

    it('should render only items containing the search term', () => {
      const term = 'city';
      filterizr.search('city');
      filterizr.props.FilteredItems.forEach((FilteredItem) => {
        const contents = FilteredItem.$node.find('.item-desc').text().toLowerCase();
        const termFound = ~contents.lastIndexOf(term);
        expect(termFound).toBeTruthy();
      });
    });
  });

  describe('#shuffle', () => {
    it('should shuffle the grid until all elements have different positions');
  });

  describe('#setOptions', () => {
    const newOptions = {
      animationDuration: 0.25,
      callbacks: {
        onFilteringStart: () => { return 'filtering started'; },
        onFilteringEnd: () => { return 'filtering ended'; },
      },
      controlsSelector: '.new-controls',
      delay: 1150,
      delayMode: 'alternate',
      easing: 'ease-in-out',
      filter: '2',
      filterOutCss: {
        'opacity': 0.25,
        'transform': 'scale(0.5)'
      },
      filterInCss: {
        'opacity': 1,
        'transform': 'scale(1)'
      },
      layout: 'packed',
      multifilterLogicalOperator: 'and',
      setupControls: false,
    };

    const callToSetOptions = (options) => {
      return () => {
        filterizr.setOptions(options);
      };
    };

    it('should update the options of the Filterizr with valid values', () => {
      filterizr.setOptions(newOptions);
      const { options } = filterizr;
      expect(typeof options).toBe('object');
      expect(typeof options.callbacks).toBe('object');
      expect(options.animationDuration).toEqual(0.25);
      expect(options.controlsSelector).toEqual('.new-controls');
      expect(options.delay).toEqual(1150);
      expect(options.delayMode).toEqual('alternate'); expect(options.easing).toEqual('ease-in-out');
      expect(options.filter).toEqual('2');
      expect(options.layout).toEqual('packed');
      expect(options.multifilterLogicalOperator).toEqual('and');
      expect(options.setupControls).toEqual(false);
    });

    it('should throw an exception if an invalid type is passed in the options', () => {
      expect(callToSetOptions({ animationDuration: 'string' })).toThrowError(/expected type/);
      expect(callToSetOptions({ callbacks: 5 })).toThrowError(/expected type/);
      expect(callToSetOptions({ controlsSelector: 5 })).toThrowError(/expected type/);
      expect(callToSetOptions({ delay: 'string' })).toThrowError(/expected type/);
      expect(callToSetOptions({ delayMode: 5 })).toThrowError(/expected type/);
      expect(callToSetOptions({ easing: 5 })).toThrowError(/expected type/);
      expect(callToSetOptions({ filter: () => {} })).toThrowError(/expected type/);
      expect(callToSetOptions({ layout: 5 })).toThrowError(/expected type/);
      expect(callToSetOptions({ multifilterLogicalOperator: 5 })).toThrowError(/expected type/);
      expect(callToSetOptions({ setupControls: 'string' })).toThrowError(/expected type/);
    });

    it('should not throw an exception if an acceptable value is passed to the option delayMode', () => {
      expect(callToSetOptions({ delayMode: 'alternate' })).not.toThrowError(/allowed values for option/);
      expect(callToSetOptions({ delayMode: 'progressive' })).not.toThrowError(/allowed values for option/);
    });

    it('should throw an exception if a non-acceptable value is passed to the option delayMode', () => {
      expect(callToSetOptions({ delayMode: 'slow' })).toThrowError(/allowed values for option/);
    });

    it('should not throw an exception if an acceptable value is passed to the option multifilterLogicalOperator', () => {
      expect(callToSetOptions({ multifilterLogicalOperator: 'and' })).not.toThrowError(/allowed values for option/);
      expect(callToSetOptions({ multifilterLogicalOperator: 'or' })).not.toThrowError(/allowed values for option/);
    });

    it('should throw an exception if a non-acceptable value is passed to the option multifilterLogicalOperator', () => {
      expect(callToSetOptions({ multifilterLogicalOperator: 'eitheror' })).toThrowError(/allowed values for option/);
    });
  });
});
