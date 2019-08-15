/* eslint-disable @typescript-eslint/explicit-function-return-type */
import defaultOptions from '../src/FilterizrOptions/defaultOptions';
import { RawOptions } from '../src/types/interfaces';
// import test utils
import * as $ from 'jquery';
import { fakeDom } from './testSetup';
// import items to be tested
import Filterizr from '../src/Filterizr';
import FilterContainer from '../src/FilterContainer';
import FilterItem from '../src/FilterItem';
import { resolve } from 'path';

// General setup
(window as any).$ = $;

jest.mock('fast-memoize', () => ({ default: (a: any) => a }));

const triggerAllEvent = (filterizr : Filterizr, done : () => void) => {
  const allItem = filterizr['filterItems'].getFiltered("all", "", null);
      Promise.all(allItem.map((filterItem) => {
        return new Promise((resolve) => {
          filterItem.node.addEventListener("transitionend", () => {
            resolve();
          }, {once : true});
          filterItem.node.dispatchEvent(new Event("transitionend"));
        })
      })).then(() => {
        done();
      });
}

// Test suite for Filterizr
describe('Filterizr', () => {
  // Basic setup before all tests
  let filterizr: Filterizr;
  let filterContainer: FilterContainer;

  beforeEach(() => {
    $('body').html(fakeDom);
    filterizr = new Filterizr('.filtr-container', defaultOptions);
    filterContainer = filterizr['filterContainer'];
  });

  describe('#constructor', () => {
    it('should throw an exception when a non-existent container selector is passed as an argument', () => {
      const instantiateBrokenFilterizr = () => {
        new Filterizr('.non-existent-container', defaultOptions);
      };
      expect(instantiateBrokenFilterizr).toThrowError(
        /could not initialize container/
      );
    });

    it('should take an optional parameter selector which defaults to ".filtr-container"', () => {
      expect(filterContainer.node).toBeTruthy();
    });

    it('should return a new instance of the Filterizr class', () => {
      expect(filterizr instanceof Filterizr).toBe(true);
    });

    it('should still work on containers with multiple class names', () => {
      $('.filtr-container').addClass('randomclass1 randomclass2');
      const instantiateFreshFilterizr = () => {
        new Filterizr('.filtr-container', defaultOptions);
      };
      expect(instantiateFreshFilterizr).not.toThrowError();
    });
  });

  describe('#destroy', () => {
    beforeEach(() => {
      filterizr.filter('1');
    });

    it('should reset all inline styles on the .filtr-container', () => {
      const { node } = filterContainer;
      const oldInlineStyles = node.getAttribute('style');
      filterContainer.destroy();
      const newInlineStyles = node.getAttribute('style');

      expect(oldInlineStyles).toBeTruthy();
      expect(newInlineStyles).toEqual(null);
    });

    it('should reset all inline styles on its .filtr-item children', () => {
      const filterItem = filterContainer.node.querySelector('.filtr-item');
      const oldInlineStyles = filterItem.getAttribute('style');
      filterContainer.destroy();
      const newInlineStyles = filterItem.getAttribute('style');

      expect(oldInlineStyles).toBeTruthy();
      expect(newInlineStyles).toEqual(null);
    });
  });

  describe('#filter', () => {
    const filter = '2';
    let filteredOutItems: FilterItem[], filteredInItems: FilterItem[];

    beforeEach(done => {
      filterizr.filter(filter);
      filteredOutItems = filterizr['filterItems'].getFilteredOut(filter, "", null);
      filteredInItems = filterizr['filterItems'].getFiltered(filter, "", null);
      triggerAllEvent(filterizr, done)
    });

    it('should keep as visible only the .filtr-item elements, whose data-category contains the active filter', () => {
      // Wait for animation to finish before test
      
      filteredInItems.forEach((filterItem) => {
        const categories = filterItem.getCategories();
        const belongsToCategory = categories.includes(filter);
        expect(belongsToCategory).toEqual(true);
      });
    });

    it('should add the .filteredOut class to all filtered out .filtr-item elements', () => {
      // Wait for animation to finish before test
      filteredOutItems.forEach((filterItem) => {
        expect(Array.from(filterItem.node.classList).includes('filteredOut'));
      });
    });

    it('should set an inline style z-index: -1000 on filteringEnd for .filteredOut .filtr-item elements', () => {
      // Wait for animation to finish before test
      filteredOutItems.forEach((filterItem) => {
        const zIndexOfFilteredOutItem = (filterItem.node as HTMLElement).style.zIndex;
        expect(zIndexOfFilteredOutItem).toBe('-1000');
      });
    });
  });

  describe('#toggleFilter', () => {
    it('should set the filter back to "all" if it was set to only 1 category and that category is toggled', () => {
      filterizr.toggleFilter('1');
      filterizr.toggleFilter('1');
      const filter = filterizr.options.get().filter.get();
      expect(filter).toEqual('all');
    });

    it('should create an array of active filters if multiple filters are toggled', () => {
      filterizr.toggleFilter('1');
      filterizr.toggleFilter('2');
      const filter = filterizr.options.get().filter.get();
      expect(filter).toEqual(['1', '2']);
    });

    it('should set the filter to be of type string if there is only 1 active filter', () => {
      filterizr.toggleFilter('1');
      const filter = filterizr.options.get().filter.get();
      expect(typeof filter).toEqual('string');
    });

    it('should set the filter to be of type array if there are many active filters', () => {
      filterizr.toggleFilter('1');
      filterizr.toggleFilter('2');
      const filter = filterizr.options.get().filter.get();
      expect(Array.isArray(filter)).toEqual(true);
    });

    it('should turn off an active filter if toggled', () => {
      filterizr.toggleFilter('1');
      filterizr.toggleFilter('2');
      filterizr.toggleFilter('3');
      filterizr.toggleFilter('3');
      const filter = filterizr.options.get().filter.get();
      expect(filter).toEqual(['1', '2']);
    });
  });

  describe('#insertItem', () => {
    let nodeToAdd: Node, oldLength: number;

    beforeEach(() => {
      const nodes = filterContainer.node.querySelectorAll('.filtr-item');
      nodeToAdd = nodes[nodes.length - 1];
      oldLength = filterizr['filterItems'].length;
    });

    it('should increase the length of the FilterItems array by 1', () => {
      filterizr.insertItem(nodeToAdd as HTMLElement);
      const newLength = filterizr['filterItems'].length;
      expect(newLength).toBeGreaterThan(oldLength);
    });

    it('should add into the grid a new FilterItem with the index property equal to the length of the FilterItems array', () => {
      filterizr.insertItem(nodeToAdd as HTMLElement);
      const lastItem = filterizr['filterItems'].getItem(oldLength);
      const indexOfNewLastItem = lastItem.getSortAttribute('index');
      expect(indexOfNewLastItem).toEqual(oldLength);
    });
  });

  describe('#removeItem', () => {
    let nodeToDelete: Node, oldLength: number;

    beforeEach(() => {
      const nodes = filterContainer.node.querySelectorAll('.filtr-item');
      nodeToDelete = nodes[3];
      oldLength = filterizr['filterItems'].length;
    });

    it('should decrease the length of the FilterItems array by 1', () => {
      filterizr.removeItem(nodeToDelete as HTMLElement);
      const newLength = filterizr['filterItems'].length;
      expect(newLength).toBeLessThan(oldLength);
    });
  });

  describe('#sort', () => {
    it('should return a sorted grid', () => {
      filterizr.sort('index', 'desc');
      const filterItems = filterizr['filterItems'];
      const { length } = filterItems;
      for (let i = 0; i < length; i++) {
        expect(filterItems['filterItems'][i].getSortAttribute('index')).toEqual(
          length - 1 - i
        );
      }
    });
  });

  describe('#search', () => {
    it('should apply an extra layer of filtering based on the search term', () => {
      filterizr.filter('1'); // by this point 3 items should be visible
      expect(
        filterizr['filterItems'].getFiltered("1", 'city', null).length
      ).toEqual(2);
    });

    it('should render an empty grid if no item was found', () => {
      expect(
        filterizr['filterItems'].getFiltered("all", 'term not contained a nywhere in grid', null).length
      ).toEqual(0);
    });

    it('should render only items containing the search term', () => {
      const term = 'city';
      filterizr['filterItems']
        .getFiltered("all", 'city', null)
        .forEach((filteredItem) => {
          const contents = $(filteredItem.node)
            .find('.item-desc')
            .text()
            .toLowerCase();
          const termFound = ~contents.lastIndexOf(term);
          expect(termFound).toBeTruthy();
        });
    });
  });

  describe("#pagination", () => {
    beforeEach(done => {
      filterizr.setOptions({
        pagination : {
          pageSize : 3,
          currentPage : 0
        },
      });
      triggerAllEvent(filterizr, done)
    });
    it('should apply an extra layer of filtering based on pagination', () => {
      expect($(".filtr-item").length).toEqual(9);
      expect($(".filtr-item.filteredOut").length).toEqual(6);
      expect($(".filtr-item:not(.filteredOut)").length).toEqual(3);
      filterizr['filterItems']["filterItems"].slice(0, 3).forEach(filterItem => {
        expect(filterItem.node.classList).not.toContain("filteredOut")
      });
      filterizr['filterItems']["filterItems"].slice(3).forEach(filterItem => {
        expect(filterItem.node.classList).toContain("filteredOut")
      });
    });

    it('should work with search', done => {
      filterizr.search("in")
      filterizr.nextPage();
      expect(filterizr.options.get().pagination.currentPage).toBe(1);
      triggerAllEvent(filterizr, () => {
        expect($(".filtr-item").length).toEqual(9);
        expect($(".filtr-item.filteredOut").length).toEqual(8);
        expect($(".filtr-item:not(.filteredOut)").length).toEqual(1);
        filterizr['filterItems']["filterItems"].slice(0, 8).forEach(filterItem => {
          expect(filterItem.node.classList).toContain("filteredOut")
        })
        filterizr['filterItems']["filterItems"].slice(8).forEach(filterItem => {
          expect(filterItem.node.classList).not.toContain("filteredOut")
        })
        done();
      });
    });
  });

  // describe('#shuffle', () => {
  // it('should shuffle the grid until all elements have different positions');
  // });

  describe('#setOptions', () => {
    const newOptions: RawOptions = {
      animationDuration: 0.25,
      callbacks: {
        onFilteringStart: () => {
          return 'filtering started';
        },
        onFilteringEnd: () => {
          return 'filtering ended';
        },
      },
      controlsSelector: '.new-controls',
      delay: 1150,
      delayMode: 'alternate',
      easing: 'ease-in-out',
      filter: '2',
      filterOutCss: {
        opacity: 0.25,
        transform: 'scale(0.5)',
      },
      filterInCss: {
        opacity: 1,
        transform: 'scale(1)',
      },
      layout: 'packed',
      multifilterLogicalOperator: 'and',
      setupControls: false,
    };

    const callToSetOptions = (options: RawOptions) => {
      return () => {
        filterizr.setOptions(options);
      };
    };

    it('should update the options of the Filterizr with valid values', () => {
      filterizr.setOptions(newOptions);
      const options = filterizr.options.get();
      expect(typeof options).toBe('object');
      expect(typeof options.callbacks).toBe('object');
      expect(options.animationDuration).toEqual(0.25);
      expect(options.controlsSelector).toEqual('.new-controls');
      expect(options.delay).toEqual(1150);
      expect(options.delayMode).toEqual('alternate');
      expect(options.easing).toEqual('ease-in-out');
      expect(options.filter.get()).toEqual('2');
      expect(options.layout).toEqual('packed');
      expect(options.multifilterLogicalOperator).toEqual('and');
      expect(options.setupControls).toEqual(false);
    });

    it('should not throw an exception if an acceptable value is passed to the option delayMode', () => {
      expect(callToSetOptions({ delayMode: 'alternate' })).not.toThrowError(
        /allowed values for option/
      );
      expect(callToSetOptions({ delayMode: 'progressive' })).not.toThrowError(
        /allowed values for option/
      );
    });

    it('should not throw an exception if an acceptable value is passed to the option multifilterLogicalOperator', () => {
      expect(
        callToSetOptions({ multifilterLogicalOperator: 'and' })
      ).not.toThrowError(/allowed values for option/);
      expect(
        callToSetOptions({ multifilterLogicalOperator: 'or' })
      ).not.toThrowError(/allowed values for option/);
    });
  });
});
