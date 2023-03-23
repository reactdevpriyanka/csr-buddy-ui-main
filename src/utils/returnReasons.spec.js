import REASON_MAP from '__mock__/return-reasons/reasonMap';
import REASON_RESPONSE from '__mock__/return-reasons/reasonResponse';
import { getReasonOptions, parseReasons } from './returnReasons';

describe('returnReasons', () => {
  describe('parseReasons', () => {
    it('should correctly parse a primary only option', () => {
      const reasonMap = parseReasons(REASON_RESPONSE);

      expect(reasonMap.OTHER).toBeDefined();

      expect(Object.keys(reasonMap.OTHER)).toHaveLength(0);
    });

    it('should correctly parse a primary/secondary/tertiary option', () => {
      const reasonMap = parseReasons(REASON_RESPONSE);

      expect(reasonMap.DAMAGED).toBeDefined();
      expect(reasonMap.DAMAGED['BOX_AND_PRODUCT']).toBeDefined();
      expect(Object.keys(reasonMap.DAMAGED['BOX_AND_PRODUCT'])).toHaveLength(6);
    });
  });

  describe('getReasonOptions', () => {
    it('should return the top level reasons given no existing reason', () => {
      const reasonOptions = getReasonOptions(REASON_MAP);
      expect(reasonOptions).toHaveLength(2);
      expect(reasonOptions.includes('OTHER')).toBeTruthy();
      expect(reasonOptions.includes('DAMAGED')).toBeTruthy();
    });

    it('should return the correct second level reasons', () => {
      const reasonOptions = getReasonOptions(REASON_MAP, { primary: 'DAMAGED' }, 'secondary');
      expect(reasonOptions).toHaveLength(1);
      expect(reasonOptions.includes('BOX_AND_PRODUCT')).toBeTruthy();
    });
  });
});
