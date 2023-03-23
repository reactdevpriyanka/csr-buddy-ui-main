import { isWeight, blacklistedTags } from './utils';

describe('Tag/utils', () => {
  describe('isWeight', () => {
    test('it should return true if tag name is WEIGHT_LIMIT', () => {
      expect(isWeight('WEIGHT_LIMIT')).toEqual(true);
    });

    test('it should return false for all else', () => {
      expect(isWeight('NOT_WEIGHT_LIMIT')).toEqual(false);
    });
  });

  describe('blacklistedTags', () => {
    test('it should match snapshot', () => {
      expect(blacklistedTags).toMatchSnapshot();
    });
  });
});
