import ActiveFilter from '../src/ActiveFilter';

describe('ActiveFilter', () => {
  describe('#constructor', () => {
    it('should create an instance with default filter set to "all"', () => {
      expect(new ActiveFilter('all').get()).toEqual('all');
    });
  });

  describe('#get', () => {
    it('returns the value of the filter', () => {
      const activeFilter = new ActiveFilter('all');
      expect(activeFilter.get()).toEqual('all');
    });
  });

  describe('#set', () => {
    it('set the value of the filter to passed value', () => {
      const activeFilter = new ActiveFilter('all');
      activeFilter.set('5');
      expect(activeFilter.get()).toEqual('5');
    });
  });

  describe('#toggle', () => {
    it('toggle the value of the filter passed in', () => {
      const activeFilter1 = new ActiveFilter('5');
      activeFilter1.toggle('5');

      const activeFilter2 = new ActiveFilter(['4', '8']);
      activeFilter2.toggle('8');

      const activeFilter3 = new ActiveFilter(['4', '8']);
      activeFilter3.toggle('9');

      const activeFilter4 = new ActiveFilter('all');
      activeFilter4.toggle('2');

      expect(activeFilter1.get()).toEqual('all');
      expect(activeFilter2.get()).toEqual('4');
      expect(activeFilter3.get()).toEqual(['4', '8', '9']);
      expect(activeFilter4.get()).toEqual('2');
    });
  });
});
