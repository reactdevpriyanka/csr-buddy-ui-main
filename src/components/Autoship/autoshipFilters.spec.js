import { ORDER_STATUS } from '@components/Order/utils';
import { isActiveAutoship, isOrderCancelled, AUTOSHIP_FILTERS } from './autoshipFilters';

describe('autoshipFilters', () => {
  const makeAutoshipWithData = (order) => ({ data: { order } });
  test('it should render an active autoship order by default', () => {
    const autoship = makeAutoshipWithData({ status: ORDER_STATUS.ACTIVE });
    expect(isActiveAutoship(autoship)).toBe(true);
  });

  describe('All', () => {
    test('it should always return autoship', () => {
      const autoship = makeAutoshipWithData({ id: 1 });
      expect(AUTOSHIP_FILTERS.All(autoship)).toEqual({ data: { order: { id: 1 } } });
    });
  });
  describe('isActiveAutoship', () => {
    test('it should return true if autoship order is Active', () => {
      const autoship = makeAutoshipWithData({ status: ORDER_STATUS.ACTIVE });
      expect(isActiveAutoship(autoship)).toBe(true);
    });
  });

  describe('isOrderCancelled', () => {
    test('it should return true if autoship order is cancelled', () => {
      const autoship = makeAutoshipWithData({ status: ORDER_STATUS.CANCELED });
      expect(isOrderCancelled(autoship)).toBe(true);
    });

    test('it should return false if autoship order is not cancelled', () => {
      const autoship = makeAutoshipWithData({ status: ORDER_STATUS.IN_PROGRESS });
      expect(isOrderCancelled(autoship)).toBe(false);
    });

    describe('with no autoship order attributes', () => {
      test('it should return false', () => {
        expect(isOrderCancelled(makeAutoshipWithData({}))).toBe(false);
      });
    });
  });
});
