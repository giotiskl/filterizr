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
});
