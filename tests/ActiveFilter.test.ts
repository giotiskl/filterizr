import ActiveFilter from '../src/ActiveFilter';
import defaultOptions from '../src/defaultOptions';

describe('ActiveFilter', () => {
  describe('#constructor', () => {
    it('should create an instance with default filter set to "all"', () => {
      expect(new ActiveFilter(defaultOptions).filter).toEqual('all');
    });
  });

  describe('#get filter', () => {
    it('returns the value of the filter', () => {
      const activeFilter = new ActiveFilter(defaultOptions);
      expect(activeFilter.filter).toEqual('all');
    });
  });

  describe('#set', () => {
    it('set the value of the filter to passed value', () => {
      const activeFilter = new ActiveFilter(defaultOptions);
      activeFilter.set('5');
      expect(activeFilter.filter).toEqual('5');
    });
  });

  describe('#toggle', () => {
    it('toggle the value of the filter passed in', () => {
      const activeFilter1 = new ActiveFilter({
        ...defaultOptions,
        filter: '5',
      });
      activeFilter1.toggle('5');

      const activeFilter2 = new ActiveFilter({
        ...defaultOptions,
        filter: ['4', '8'],
      });
      activeFilter2.toggle('8');

      const activeFilter3 = new ActiveFilter({
        ...defaultOptions,
        filter: ['4', '8'],
      });
      activeFilter3.toggle('9');

      const activeFilter4 = new ActiveFilter({
        ...defaultOptions,
        filter: 'all',
      });
      activeFilter4.toggle('2');

      expect(activeFilter1.filter).toEqual('all');
      expect(activeFilter2.filter).toEqual('4');
      expect(activeFilter3.filter).toEqual(['4', '8', '9']);
      expect(activeFilter4.filter).toEqual('2');
    });
  });
});
