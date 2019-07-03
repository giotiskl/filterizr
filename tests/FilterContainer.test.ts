/* eslint-disable @typescript-eslint/explicit-function-return-type */
// import test utils
import * as $ from 'jquery';
import { fakeDom } from './testSetup';
// import items to be tested
import Filterizr from '../src/Filterizr';
import FilterContainer from '../src/FilterContainer';
import FilterItem from '../src/FilterItem';

// General setup
(window as any).$ = $;

/**
 * Test suite for FilterContainer
 */
describe('FilterContainer', () => {
  // Basic setup before all tests
  let filterizr: Filterizr;
  let filterContainer: FilterContainer;

  beforeEach(() => {
    $('body').html(fakeDom);
    filterizr = new Filterizr('.filtr-container', {});
    filterContainer = new FilterContainer(
      document.querySelector('.filtr-container'),
      filterizr.options
    );
  });

  describe('#constructor', () => {
    it('should return a new instance of the FilterContainer class', () => {
      expect(filterContainer instanceof FilterContainer).toBe(true);
    });
  });

  describe('#destroy', () => {
    beforeEach(() => {
      filterizr.filter('1');
    });

    it('should reset all inline styles on the .filtr-container', () => {
      const oldInlineStyles = filterContainer.node.getAttribute('style');
      filterContainer.destroy();
      const newInlineStyles = filterContainer.node.getAttribute('style');

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

  describe('#push', () => {
    let cloned: Node;

    beforeEach(() => {
      const nodes = filterContainer.node.querySelectorAll('.filtr-item');
      cloned = nodes[nodes.length - 1].cloneNode();
    });

    it('should increase the length of the FilterItems array by 1', () => {
      const oldLength = filterContainer.filterItems.length;
      filterContainer.insertItem(cloned as Element, filterizr.options);
      const newLength = filterContainer.filterItems.length;
      expect(newLength).toBeGreaterThan(oldLength);
    });

    it('should set the index property of the newly added FilterItem in the array to array.length', () => {
      const oldLength = filterContainer.filterItems.length;
      filterContainer.insertItem(cloned as Element, filterizr.options);
      const newlyAddedFilterItem = filterContainer.filterItems.getItem(
        oldLength
      );
      expect(newlyAddedFilterItem['index']).toEqual(oldLength);
    });
  });

  describe('#makeFilterItems', () => {
    it('should return an array of FilterItems with length equal to the .filtr-item elements of the DOM', () => {
      expect(filterContainer.makeFilterItems(filterizr.options).length).toEqual(
        $('.filtr-item').length
      );
    });
    it('should find and return all .filtr-item elements as FilterItem instances', () => {
      filterContainer.filterItems.get().forEach((filterItem) => {
        expect(filterItem instanceof FilterItem).toBe(true);
      });
    });
  });

  describe('#calculateColumns', () => {
    it('should return the number of columns that can fit in the FilterContainer', () => {
      // make necessary set up to get 4 columns
      const containerWidth = 1000;
      filterContainer.dimensions.width = containerWidth;
      filterContainer.filterItems.getItem(0).dimensions.width =
        containerWidth / 4;
      expect(filterContainer.calculateColumns()).toEqual(4);
    });
  });
});
