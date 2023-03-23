import clamp from './clamp';

describe('utils.clamp', () => {
  describe('if value is within max and min', () => {
    test('it should return value', () => {
      expect(clamp(50, 0, 100)).toEqual(50);
    });
  });

  describe('if value is below min', () => {
    test('it should return min', () => {
      expect(clamp(-50, 0, 100)).toEqual(0);
    });
  });

  describe('if value is above max', () => {
    test('it should return max', () => {
      expect(clamp(150, 0, 100)).toEqual(100);
    });
  });
});
