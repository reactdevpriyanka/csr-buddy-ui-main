import toFormattedPhoneNumber from '@utils/formatters';

describe('utils.toFormattedPhoneNumber', () => {
  describe('if a valid phone number is formatted', () => {
    test('it should return value with right formatting', () => {
      expect(toFormattedPhoneNumber('1234567890')).toEqual('123-456-7890');
    });
  });

  describe('if an invalid phone number is formatted', () => {
    test('it should return the value without formatting', () => {
      expect(toFormattedPhoneNumber('12345678901')).toEqual('12345678901');
    });
  });
});
