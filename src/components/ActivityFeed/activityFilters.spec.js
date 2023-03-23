import { ORDER_ATTRIBUTE, ORDER_STATUS } from '@components/Order/utils';
import {
  isReturnAppeasements,
  isReturnLineItem,
  isAutoship,
  isOrderCancelled,
  isPrescription,
  ACTIVITYFEED_FILTERS,
} from './activityFilters';

describe('activityFilters', () => {
  const makeActivityWithData = (order) => ({ data: { order } });

  describe('All', () => {
    test('it should always return activity', () => {
      const activity = makeActivityWithData({ id: 1 });
      expect(ACTIVITYFEED_FILTERS.All(activity)).toEqual({ data: { order: { id: 1 } } });
    });
  });

  describe('returns', () => {
    const activity = makeActivityWithData({ id: 1 });

    const activityWithOrderItems = makeActivityWithData({ id: 1, returnItems: ['someReturn'] });

    test('it should return true when an order has an appeasement', () => {
      expect(isReturnAppeasements(activity, { appeasements: { 1: [] } })).toBe(true);
    });

    test('it should return false if order is not present in appeasements', () => {
      expect(isReturnAppeasements(activity, { appeasements: { 2: [] } })).toBe(false);
    });

    test('it should return true when an order has returnItems', () => {
      expect(isReturnLineItem(activityWithOrderItems, { appeasements: { 1: [] } })).toBe(true);
    });

    test('it should return false when an order does not have returnItems', () => {
      expect(isReturnLineItem(activity, { appeasements: { 1: [] } })).toBe(false);
    });
  });

  describe('isAutoship', () => {
    test('it should return true if order is an autoship', () => {
      const activity = makeActivityWithData({ orderAttributes: [ORDER_ATTRIBUTE.AUTOSHIP] });
      expect(isAutoship(activity)).toBe(true);
    });

    test('it should return false if order is not autoship', () => {
      const activity = makeActivityWithData({ orderAttributes: [] });
      expect(isAutoship(activity)).toBe(false);
    });

    describe('with no order attributes', () => {
      test('it should return false', () => {
        expect(isAutoship(makeActivityWithData({}))).toBe(false);
      });
    });
  });

  describe('isPrescription', () => {
    test('it should return true if order is prescription', () => {
      const activity = makeActivityWithData({ orderAttributes: [ORDER_ATTRIBUTE.PRESCRIPTION] });
      expect(isPrescription(activity)).toBe(true);
    });

    test('it should return false if order is not prescription', () => {
      const activity = makeActivityWithData({ orderAttributes: [] });
      expect(isPrescription(activity)).toBe(false);
    });

    describe('with no order attributes', () => {
      test('it should return false', () => {
        const activity = makeActivityWithData({});
        expect(isPrescription(activity)).toBe(false);
      });
    });
  });

  describe('isOrderCancelled', () => {
    test('it should return true if order is cancelled', () => {
      const activity = makeActivityWithData({ status: ORDER_STATUS.CANCELED });
      expect(isOrderCancelled(activity)).toBe(true);
    });

    test('it should return false if order is not cancelled', () => {
      const activity = makeActivityWithData({ status: ORDER_STATUS.IN_PROGRESS });
      expect(isOrderCancelled(activity)).toBe(false);
    });

    describe('with no order attributes', () => {
      test('it should return false', () => {
        expect(isOrderCancelled(makeActivityWithData({}))).toBe(false);
      });
    });
  });
});
