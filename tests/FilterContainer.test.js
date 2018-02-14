// import test utils
import $ from 'jquery';
import { fakeDom } from './testSetup';
// import items to be tested
import Filterizr from '../src/Filterizr';
import FilterContainer from '../src/FilterContainer';
import FilterItem from '../src/FilterItem';
import DefaultOptions from '../src/DefaultOptions';

// General setup
window.$ = $;

/**
 * Test suite for FilterContainer
 */
describe('FilterContainer', () => {
  // Basic setup before all tests
  let filterizr;
  let filterContainer;

  beforeEach(() => {
    $('body').html(fakeDom);
    filterizr = new Filterizr('.filtr-container', DefaultOptions);
    filterContainer = new FilterContainer('.filtr-container', DefaultOptions);
  });

  describe('#constructor', () => {
    it('should take an optional parameter selector which defaults to ".filtr-container"', () => {
      expect(new FilterContainer('.non-existent-container', DefaultOptions).$node.length).toEqual(0);
      expect(filterContainer.$node.length).toBeGreaterThan(0);
    });

    it('should return a new instance of the FilterContainer class', () => {
      expect(filterContainer instanceof FilterContainer).toBe(true);
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

  describe('#push', () => {
    let cloned;

    beforeEach(() => {
      cloned = filterContainer.$node.find('.filtr-item:last').clone();
    });

    it('should increase the length of the FilterItems array by 1', () => {
      const oldLength = filterContainer.props.FilterItems.length;
      filterContainer.push(cloned, DefaultOptions);
      const newLength = filterContainer.props.FilterItems.length;
      expect(newLength).toBeGreaterThan(oldLength);
    });

    it('should set the index property of the newly added FilterItem in the array to array.length', () => {
      const oldLength = filterContainer.props.FilterItems.length;
      filterContainer.push(cloned, DefaultOptions);
      const newlyAddedFilterItem = filterContainer.props.FilterItems[oldLength];
      expect(newlyAddedFilterItem.props.index).toEqual(oldLength);
    });
  });

  describe('#getFilterItems', () => {
    it('should return an array of FilterItems with length equal to the .filtr-item elements of the DOM', () => {
      expect(filterContainer.getFilterItems(DefaultOptions).length).toEqual($('.filtr-item').length);
    });
    it('should find and return all .filtr-item elements as FilterItem instances', () => {
      filterContainer.props.FilterItems.forEach(filterItem => {
        expect(filterItem instanceof FilterItem).toBe(true);
      });
    });
  });

  describe('#calcColumns', () => {
    it('should return the number of columns that can fit in the FilterContainer', () => {
      // make necessary set up to get 4 columns
      const containerWidth = 1000;
      filterContainer.props.w = containerWidth;
      filterContainer.props.FilterItems[0].props.w = containerWidth / 4;
      expect(filterContainer.calcColumns()).toEqual(4);
    });
  });

  describe('#updateHeight', () => {
    it('should update the height property of FilterContainer in props', () => {
      // set the new width via inline css and call the method
      const height = 1500;
      filterContainer.updateHeight(height);
      expect(filterContainer.props.h).toEqual(1500);
      expect(filterContainer.$node.innerHeight()).toEqual(1500);
    });
  });

  describe('#updateWidth', () => {
    it('should update the width property of FilterContainer in props', () => {
      // set the new width via inline css and call the method
      const width = '1500px';
      filterContainer.$node.css('width', width);
      filterContainer.updateWidth();
      expect(filterContainer.props.w).toEqual(1500);
      expect(filterContainer.$node.innerWidth()).toEqual(1500);
    });
  });

  describe('#getWidth', () => {
    it('should return the .innerWidth() of the FilterContainer jQuery node', () => {
      expect(filterContainer.getWidth()).toEqual(filterContainer.$node.innerWidth());
    });
  });

});
