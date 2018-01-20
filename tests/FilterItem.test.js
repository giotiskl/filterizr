// import test utils
import $ from 'jquery';
import { fakeDom } from './testUtils';
// import items to be tested
import FilterItem from '../src/FilterItem';
import DefaultOptions from '../src/DefaultOptions';

// General setup
window.$ = $;

// Test suite for Filterizr
describe('Filterizr', () => {
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
