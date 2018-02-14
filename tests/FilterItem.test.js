// import test utils
import $ from 'jquery';
import { fakeDom } from './testSetup';
// import items to be tested
import FilterItem from '../src/FilterItem';
import DefaultOptions from '../src/DefaultOptions';

// General setup
window.$ = $;

/**
 * Test suite for FilterItem
 */
describe('FilterItem', () => {
  beforeEach(() => {
    $('body').html(fakeDom);
  });

  describe('#constructor', () => {
    it('should return a new instance of the FilterItem class', () => {
      const filterItem = new FilterItem($('.filtr-item:first'), 0, DefaultOptions);
      expect(filterItem instanceof FilterItem).toBe(true);
    });

    it('should set inline styles on the .filtr-item element', () => {
      const filtrItem = $('.filtr-item:first');
      const beforeInlineStyles = filtrItem.attr('style');
      new FilterItem($('.filtr-item:first'), 0, DefaultOptions);
      const afterInlineStyles = filtrItem.attr('style');
      expect(beforeInlineStyles).not.toEqual(afterInlineStyles);
    });
  });

  describe('#filterIn', () => {
    it('should update the inner lastPosition property to equal the position argument', () => {
      const filterItem = new FilterItem($('.filtr-item:first'), 0, DefaultOptions);
      const position = { left: 15, top: 100 };
      filterItem.filterIn(position, { });
      expect(filterItem.props.lastPosition.left).toEqual(15);
      expect(filterItem.props.lastPosition.top).toEqual(100);
    });

    it('should set the filteredOut property to false', () => {
      const filterItem = new FilterItem($('.filtr-item:first'), 0, DefaultOptions);
      const position = { left: 15, top: 100 };
      filterItem.filterIn(position, { });
      expect(filterItem.props.filteredOut).toEqual(false);
    });
  });

  describe('#filterOut', () => {
    it('should set the filteredOut property to true', () => {
      const filterItem = new FilterItem($('.filtr-item:first'), 0, DefaultOptions);
      const position = { left: 15, top: 100 };
      filterItem.filterOut(position, { });
      expect(filterItem.props.filteredOut).toEqual(true);
    });
  });

  describe('#calcDelay', () => {
    let filterItem1, filterItem2, filterItem3;
    beforeEach(() => {
      filterItem1 = new FilterItem($('.filtr-item:first'), 0, DefaultOptions);
      filterItem2 = new FilterItem($('.filtr-item:first'), 1, DefaultOptions);
      filterItem3 = new FilterItem($('.filtr-item:first'), 2, DefaultOptions);
    });

    it('should return delay multiplied by index for "progressive" mode', () => {
      const delay = 150;
      const mode = 'progressive';
      expect(filterItem1.calcDelay(delay, mode)).toEqual(0);
      expect(filterItem2.calcDelay(delay, mode)).toEqual(150);
      expect(filterItem3.calcDelay(delay, mode)).toEqual(300);
    });

    it('should return delay for even items and 0 for odd items for "alternate" mode', () => {
      const delay = 150;
      const mode = 'alternate';
      expect(filterItem1.calcDelay(delay, mode)).toEqual(150);
      expect(filterItem2.calcDelay(delay, mode)).toEqual(0);
      expect(filterItem3.calcDelay(delay, mode)).toEqual(150);
    });
  });

  describe('#contentsMatchSearch', () => {
    it('should return true when the innerText of the FilterItem matches the search term', () => {
      const filterItem = new FilterItem($('.filtr-item:first'), 0, DefaultOptions);
      expect(filterItem.contentsMatchSearch('streets')).toEqual(true);
    });


    it('should return false when the innerText of the FilterItem does not match the search term', () => {
      const filterItem = new FilterItem($('.filtr-item:first'), 0, DefaultOptions);
      expect(filterItem.contentsMatchSearch('iamnotthere')).toEqual(false);
    });
  });

  describe('#getContentsLowercase', () => {
    it('should return the contents of the .filtr-item container in lowercase', () => {
      const filterItem = new FilterItem($('.filtr-item:first'), 0, DefaultOptions);
      expect(filterItem.$node.text().toLowerCase()).toEqual(filterItem.getContentsLowercase());
    });
  });

  describe('#getCategories', () => {
    it('should return an array with the value of the data-category attribute on the .filtr-item delimited by ","', () => {
      const filterItem = new FilterItem($('.filtr-item:first'), 0, DefaultOptions);
      expect(filterItem.getCategories()).toEqual(['1', '5']);
      filterItem.$node.attr('data-category', '1, 5, pizza');
      expect(filterItem.getCategories()).toEqual(['1', '5', 'pizza']);
    });
  });

  describe('#getHeight', () => {
    it('should return the .innerHeight property of the contained .filtr-item node', () => {
      const filterItem = new FilterItem($('.filtr-item:first'), 0, DefaultOptions);
      const innerHeight = filterItem.$node.innerHeight();
      expect(filterItem.getHeight()).toEqual(innerHeight);
    });
  });

  describe('#getWidth', () => {
    it('should return the .innerWidth property of the contained .filtr-item node', () => {
      const filterItem = new FilterItem($('.filtr-item:first'), 0, DefaultOptions);
      const innerWidth = filterItem.$node.innerWidth();
      expect(filterItem.getWidth()).toEqual(innerWidth);
    });
  });
});
