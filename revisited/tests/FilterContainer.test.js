// import dependencies for test
import fakeDom from './fakeDom';
import $ from 'jquery';
window.$ = $;
$('body').html(fakeDom);
// import items to be tested
import FilterContainer from '../app/FilterContainer';
import FilterItem from '../app/FilterItem';
import DefaultOptions from '../app/options';

// Basic setup before all tests
const filterContainer = new FilterContainer('.filtr-container', DefaultOptions);

describe("FilterContainer", () => {

  describe("#constructor", () => {
    it('should take an optional parameter selector which defaults to ".filtr-container"', () => {
      expect(new FilterContainer('.non-existent-container', DefaultOptions).$node.length).toEqual(0);
      expect(filterContainer.$node.length).toBeGreaterThan(0);
    });

    it('should return a new instance of the FilterContainer class', () => {
      expect(filterContainer instanceof FilterContainer).toBe(true);
    });
  })

  describe("#getFilterItems", () => {
    it('should return an array of FilterItems with length equal to the .filtr-item elements of the DOM', () => {
      expect(filterContainer.getFilterItems(DefaultOptions).length).toEqual($('.filtr-item').length);
    });
    it('should find and return all .filtr-item elements as FilterItem instances', () => {
      filterContainer.props.FilterItems.forEach(filterItem => {
        expect(filterItem instanceof FilterItem).toBe(true);
      });
    });
  });

  describe("#calcColumns", () => {
    it('should return the number of columns that can fit in the FilterContainer', () => {
      // make necessary set up to get 4 columns
      const containerWidth = 1000;
      filterContainer.props.w = containerWidth;
      filterContainer.props.FilterItems[0].props.w = containerWidth / 4;
      expect(filterContainer.calcColumns()).toEqual(4);
    });
  });

  describe("#updateHeight", () => {
    it('should update the height property of FilterContainer in props', () => {
      // set the new width via inline css and call the method
      const height = 1500;
      filterContainer.updateHeight(height);
      expect(filterContainer.props.h).toEqual(1500);
      expect(filterContainer.$node.innerHeight()).toEqual(1500);
    });
  });

  describe("#updateWidth", () => {
    it('should update the width property of FilterContainer in props', () => {
      // set the new width via inline css and call the method
      const width = '1500px';
      filterContainer.$node.css('width', width);
      filterContainer.updateWidth();
      expect(filterContainer.props.w).toEqual(1500);
      expect(filterContainer.$node.innerWidth()).toEqual(1500);
    });
  });

  describe("#getWidth", () => {
    it('should return the .innerWidth() of the FilterContainer jQuery node', () => {
      expect(filterContainer.getWidth()).toEqual(filterContainer.$node.innerWidth());
    });
  });

});
