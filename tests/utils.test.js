/**
 * Test suite for the utils module, containing helper methods for Filterizr.
 */
import { 
  stringInArray,
  allStringsOfArray1InArray2,
  makeShallowClone,
  merge,
  intersection,
  debounce,
  shuffle,
} from '../src/utils';

describe('utils', () => {
  describe('#stringInArray', () => {
    it('should return true if a given string is found in an array of strings', () => {
      const array = ['first', 'second', 'third', 'fourth'];
      expect(stringInArray(array, 'second')).toEqual(true);
    });

    it('should return false if a given string is not found in an array of strings', () => {
      const array = ['first', 'second', 'third', 'fourth'];
      expect(stringInArray(array, 'i am not there')).toEqual(false);
    });
  });

  describe('#allStringsOfArray1InArray2', () => {
    it('should return true if all items in the first array exist in the second array, regardless of order, or if there are extra items', () => {
      const arr1 = ['first', 'second', 'third', 'fourth'];
      const arr2 = ['zero', 'third', 'second', 'fourth', 'first'];
      expect(allStringsOfArray1InArray2(arr1, arr2)).toEqual(true);
    });

    it('should return false if not all items in the first array exist in the second array', () => {
      const arr1 = ['first', 'second', 'fourth', 'hi'];
      const arr2 = ['zero', 'third', 'second', 'fourth', 'first'];
      expect(allStringsOfArray1InArray2(arr1, arr2)).toEqual(false);
    });
  });

  describe('#makeShallowClone', () => {
    it('should copy all properties of object A to object B', () => {
      const o1 = { x: 12, y: 15, z: 32 };
      const o2 = makeShallowClone(o1);
      expect(Object.keys(o1).length).toEqual(Object.keys(o2).length);
      expect(o1.x).toEqual(o2.x);
      expect(o1.y).toEqual(o2.y);
      expect(o1.z).toEqual(o2.z);
    });

    it('should return a shallow clone of an object', () => {
      const o1 = { x: 12 };
      const o2 = makeShallowClone(o1);
      o2.x = 15;
      expect(o2.x !== o1.x).toEqual(true);
    });
  });

  describe('#merge', () => {
    it('should merge object A with object B without performing mutations', () => {
      const o1 = { x: 12, y: 15, z: 32 };
      const o2 = merge(o1, { x: 10, greeting: 'hello' });
      expect(o1.x).toEqual(12);
      expect(o2.x).toEqual(10);
      expect(o2.y).toEqual(15);
      expect(o2.z).toEqual(32);
      expect(o2.greeting).toEqual('hello');
    });
  });

  describe('#intersection', () => {
    it('should return the intersection of two arrays', () => {
      const arr1 = [1, 2, 3, 4];
      const arr2 = [2, 3];
      expect(intersection(arr1, arr2)).toEqual([2, 3]);
    });
  });

  describe('#shuffle', () => {
    it('should not mutate the initial array', () => {
      const arr1 = [1];
      const arr2 = shuffle(arr1); // No shuffling will be made, helps test referential equality
      expect(arr1 === arr2).toEqual(false);
    });
  });
});
