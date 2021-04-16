import { describe, it } from 'mocha';
import { expect } from 'chai';
// lib
import bruteForce from '../../../algorithm/string/brute-force';

describe('string match', () => {
  describe('brute force', () => {
    it('should return {isMatch: true, index: 0}', () => {
      expect(bruteForce('abc', 'ab')).to.deep.equal({ isMatch: true, index: 0 });
    });
    it('should return {isMatch: true, index: 1}', () => {
      expect(bruteForce('abc', 'bc')).to.deep.equal({ isMatch: true, index: 1 });
    });
    it('should return {isMatch: true, index: 4}', () => {
      expect(bruteForce('ababababcd', 'ababc')).to.deep.equal({ isMatch: true, index: 4 });
    });
    it('should return {isMatch: false, index: -1}', () => {
      expect(bruteForce('ababababcd', 'ababxc')).to.deep.equal({ isMatch: false, index: -1 });
    });
  });
});
