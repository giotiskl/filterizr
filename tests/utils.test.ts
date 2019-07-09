/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Test suite for the utils module, containing helper methods for Filterizr.
 */
import {
  allStringsOfArray1InArray2,
  debounce,
  merge,
  intersection,
  shuffle,
  sortBy,
} from '../src/utils';
import { cssEasingValuesRegexp } from '../src/config';

describe('utils', () => {
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

  describe('#debounce', () => {
    const DEBOUNCE_TIME = 100;
    const fn = () => 5;
    const debouncedFn = debounce(fn, DEBOUNCE_TIME, false);

    it('should debounce a function for a given amount of time', () => {
      expect(debouncedFn()).not.toEqual(5);
      setTimeout(() => {
        expect(debouncedFn()).toEqual(5);
      }, DEBOUNCE_TIME + 5);
    });
  });

  describe('#merge', () => {
    it('should merge object A with object B', () => {
      const o1 = { x: 12, y: 15, z: 32 };
      const o2 = merge({}, o1, { x: 10, greeting: 'hello' });
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

  describe('#sortBy', () => {
    let sortFn, unsorted: number[], sorted: number[];
    beforeEach(() => {
      sortFn = (a: number) => a;
      unsorted = [3, 4, 1, 8];
      sorted = sortBy(unsorted, sortFn);
    });

    it('should return a sorted array', () => {
      for (let i = 0; i < unsorted.length - 2; i++) {
        expect(sorted[i]).toBeLessThan(sorted[i + 1]);
      }
    });

    it('should not mutate the array', () => {
      expect(unsorted === sorted).toEqual(false);
    });
  });

  describe('#cssEasingValuesRegexp', () => {
    it('should match all acceptable values for for the CSS transition-timing-function property', () => {
      expect('linear'.match(cssEasingValuesRegexp)).toBeTruthy();
      expect('ease'.match(cssEasingValuesRegexp)).toBeTruthy();
      expect('ease-in'.match(cssEasingValuesRegexp)).toBeTruthy();
      expect('ease-out'.match(cssEasingValuesRegexp)).toBeTruthy();
      expect('ease-in-out'.match(cssEasingValuesRegexp)).toBeTruthy();
      expect('step-start'.match(cssEasingValuesRegexp)).toBeTruthy();
      expect('step-end'.match(cssEasingValuesRegexp)).toBeTruthy();
      expect('steps(1, start)'.match(cssEasingValuesRegexp)).toBeTruthy();
      expect('steps(1,start)'.match(cssEasingValuesRegexp)).toBeTruthy();
      expect('steps(1 ,start)'.match(cssEasingValuesRegexp)).toBeTruthy();
      expect('steps(1 , start)'.match(cssEasingValuesRegexp)).toBeTruthy();
      expect('steps(1, end)'.match(cssEasingValuesRegexp)).toBeTruthy();
      expect('steps(1,end)'.match(cssEasingValuesRegexp)).toBeTruthy();
      expect('steps(1 ,end)'.match(cssEasingValuesRegexp)).toBeTruthy();
      expect('steps(1 , end)'.match(cssEasingValuesRegexp)).toBeTruthy();
      expect(
        'cubic-bezier(0.42,0,0.58,1)'.match(cssEasingValuesRegexp)
      ).toBeTruthy();
      expect(
        'cubic-bezier(0.42 , 0,0.58, 1)'.match(cssEasingValuesRegexp)
      ).toBeTruthy();
    });

    it('should return null for non-acceptable values for the CSS transition-timing-function property', () => {
      expect('random-value'.match(cssEasingValuesRegexp)).toEqual(null);
      expect('linear-in'.match(cssEasingValuesRegexp)).toEqual(null);
      expect('ase'.match(cssEasingValuesRegexp)).toEqual(null);
      expect('eas'.match(cssEasingValuesRegexp)).toEqual(null);
      expect('istep-start'.match(cssEasingValuesRegexp)).toEqual(null);
      expect('cubicbezier(0.42,0,0.58,1)'.match(cssEasingValuesRegexp)).toEqual(
        null
      );
      expect('cuicbezer(0.0,0.58,1)'.match(cssEasingValuesRegexp)).toEqual(
        null
      );
      expect(
        'cubic-bezie(0.42 , 0,0.58, 1)'.match(cssEasingValuesRegexp)
      ).toEqual(null);
    });
  });
});
