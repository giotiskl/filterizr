// import test utils
import $ from 'jquery';
import { fakeDom } from './testUtils';
// import items to be tested
import Filterizr from '../app/Filterizr';
import DefaultOptions from '../app/options';

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
  })

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
    it('should keep as visible only the .filtr-item elements, whose data-category contains the active filter');
    it('should add the .filteredOut class to all filtered out .filtr-item elements');
    it('should set an inline style z-index: -1000 on filteringEnd for .filteredOut .filtr-item elements');
  });

});
