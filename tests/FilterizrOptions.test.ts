import FilterizrOptions from "../src/FilterizrOptions";

describe('FilterizrOptions', () => {
  describe('#getPageRange', () => {
    it('should return the good range from the page size at page 0', () => {
      const filterizrOptions = new FilterizrOptions({
        pagination : {
          pageSize : 6,
          currentPage : 0
        }
      });
      expect(filterizrOptions.getPageRange()).toEqual({start : 0, end : 6})
    });

    it('should return the good range from the page size at page >0', () => {
      const filterizrOptions = new FilterizrOptions({
        pagination : {
          pageSize : 6,
          currentPage : 4
        }
      });
      expect(filterizrOptions.getPageRange()).toEqual({start : 24, end : 30})
    });
  });

});
