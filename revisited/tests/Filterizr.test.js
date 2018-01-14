// import test utils
import $ from 'jquery';
import { fakeDom } from './testUtils';
// import items to be tested
import Filterizr from '../app/Filterizr';
import DefaultOptions from '../app/options';
import { 
  stringInArray,
} from '../app/utils';

// General setup
window.$ = $;
$('body').html(fakeDom);

// Test suite for Filterizr
describe('Filterizr', () => {
  // Basic setup before all tests
  let filterizr;
  let filterContainer;

  beforeEach(() => {
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
        return !stringInArray(categories, filter);
      });
      FilteredInItems = filterizr.props.FilterItems.filter(FilterItem => {
        const categories = FilterItem.getCategories();
        return stringInArray(categories, filter);
      });
    });

    it('should keep as visible only the .filtr-item elements, whose data-category contains the active filter', () => {
      // Wait for animation to finish before test
      setTimeout(() => {
        FilteredInItems.forEach((FilterItem) => {
          const categories = FilterItem.getCategories();
          const belongsToCategory = stringInArray(categories, filter);
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

  describe('#toggleFilter', () => {});

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

  describe('#sort', () => {});

  describe('#search', () => {});

  describe('#shuffle', () => {
    let oldIndex1, oldIndex2;

    beforeEach(() => {
      oldIndex1 = filterizr.props.FilterItems[0].props.index;
      oldIndex2 = filterizr.props.FilterItems[1].props.index;
    });

    it('should shuffle the grid until all elements have different positions', () => {
      filterizr.shuffle();
      const index1 = filterizr.props.FilteredItems[0].props.index;
      const index2 = filterizr.props.FilteredItems[1].props.index;
      expect(index1).not.toEqual(oldIndex1);
      expect(index2).not.toEqual(oldIndex2);
    });
  });

  describe('#setOptions', () => {
    const newOptions = {
      animationDuration: 0.25,
      callbacks: {
        onFilteringStart: () => { console.log('hi') },
        onFilteringEnd: () => { console.log('hi') },
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
    }

    it('should update the options of the Filterizr with valid values', () => {
      filterizr.setOptions(newOptions);
      const { options } = filterizr;
      expect(typeof options).toBe('object');
      expect(typeof options.callbacks).toBe('object');
      expect(options.animationDuration).toEqual(0.25);
      expect(options.controlsSelector).toEqual('.new-controls');
      expect(options.delay).toEqual(1150);
      expect(options.delayMode).toEqual('alternate');
      expect(options.easing).toEqual('ease-in-out');
      expect(options.filter).toEqual('2');
      expect(options.layout).toEqual('packed');
      expect(options.multifilterLogicalOperator).toEqual('and');
      expect(options.setupControls).toEqual(false);
    });
  });
});
