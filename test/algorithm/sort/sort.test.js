import { describe, it } from 'mocha';
import { expect } from 'chai';
// lib
import quickSort, { inPlaceQuickSort } from '../../../algorithm/sort/quick-sort';
import mergeSort from '../../../algorithm/sort/merge-sort';
import insertSort from '../../../algorithm/sort/insert-sort';
import { bubbleSort, bubbleSort2, cocktailSort } from '../../../algorithm/sort/bubble-sort';
import selectionSort from '../../../algorithm/sort/selection-sort';
// test data
const arr = [90, 20, -10, 9, 9, 0];
const sortArr = [-10, 0, 9, 9, 20, 90];
// test code
describe('sort algorithm', function() {
  describe('quick sort', () => {
    it('should depp equal [-10, 0, 9, 9, 20, 90]', () => {
      expect(quickSort(arr)).to.deep.equal(sortArr);
    });
  });

  describe('in place quick sort', () => {
    it('should depp equal [-10, 0, 9, 9, 20, 90]', () => {
      expect(inPlaceQuickSort(arr, 0, arr.length - 1)).to.deep.equal(sortArr);
    });
  });

  describe('merge sort', () => {
    it('should depp equal [-10, 0, 9, 9, 20, 90]', () => {
      expect(mergeSort(arr)).to.deep.equal(sortArr);
    });
  });

  describe('insert sort', () => {
    it('should depp equal [-10, 0, 9, 9, 20, 90]', () => {
      expect(insertSort(arr)).to.deep.equal(sortArr);
    });
  });

  describe('selection sort', () => {
    it('should depp equal [-10, 0, 9, 9, 20, 90]', () => {
      expect(selectionSort(arr)).to.deep.equal(sortArr);
    });
  });

  describe('bubble sort', () => {
    it('bubble sort should depp equal [-10, 0, 9, 9, 20, 90]', () => {
      expect(bubbleSort(arr)).to.deep.equal(sortArr);
    });

    it('bubble sort 2 should depp equal [-10, 0, 9, 9, 20, 90]', () => {
      expect(bubbleSort2(arr)).to.deep.equal(sortArr);
    });

    it('cocktail sort should depp equal [-10, 0, 9, 9, 20, 90]', () => {
      expect(cocktailSort(arr)).to.deep.equal(sortArr);
    });
  });
});
