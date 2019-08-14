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
import FilterItems from '../src/FilterItems';

// General setup
(window as any).$ = $;

jest.mock('fast-memoize', () => ({ default: (a: any) => a }));

// Test suite for Filterizr
describe('Filterizr', () => {
  // Basic setup before all tests
  let filterizr: Filterizr;
  let filterContainer: FilterContainer;
  let filterItems : FilterItems;

  beforeEach(() => {
    $('body').html(fakeDom);
    filterizr = new Filterizr('.filtr-container', defaultOptions);
    filterContainer = filterizr['filterContainer'];
    filterItems = filterContainer.filterItems;
  });

  describe('#filteredIn-pagination', () => {
    it("should return all element when no filter nor pagination", () => {
      expect(
        filterItems.getFiltered("all", "", null).length
      ).toEqual(9);
    })
    it('filter should return up to the end of the range', () => {
      const allItem = filterItems.getFiltered("all", "", null)
      const range = filterItems.getFiltered("all", "", {start : 0, end : 3});
      expect(range.length).toEqual(3);
      expect(range).toStrictEqual(allItem.slice(0, 3))
    });

    it('should skip the first when range start after the first', () => {
      const allItem = filterItems.getFiltered("all", "", null);
      const range36 = filterItems.getFiltered("all", "", {start : 3, end : 6});
      expect(range36.length).toEqual(3);
      expect(range36).toStrictEqual(allItem.slice(3, 6))
    });

    it('should return the good number of element event if filtered', () => {
      const allItem = filterItems.getFiltered("all", "", null);
      const filteredRange = filterItems.getFiltered("4", "", {start : 2, end : 4});
      expect(filteredRange[0]).toEqual(allItem[5])
      expect(filteredRange[1]).toEqual(allItem[7])
      expect(filteredRange.length).toEqual(2);
    });

    it('should work with search', () => {
      const allItem = filterItems.getFiltered("all", "", null);
      const filteredRange = filterItems.getFiltered("all", "city", {start : 1, end : 2});
      expect(filteredRange[0]).toEqual(allItem[6])
      expect(filteredRange.length).toEqual(1);
    })
  });
});
