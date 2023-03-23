import timezoneMock from 'timezone-mock';
import returnItems from '__mock__/orderdetails/return-items';
import {
  shipments,
  shipmentsWithAssignedReturns,
  itemMap,
} from '__mock__/orderdetails/shipments-with-assigned-return-tags';
import { itemGroupingHeader, getDeliveryEstimate, getDeliveredDeliveryEstimate } from './utils';
import { assignReturnsToShipments, createTotalReturnedQuantities } from './OrderDetailsView/utils';

describe('Order Utilities', () => {
  describe('itemGroupingHeader', () => {
    test(`it should return 'Processing Order' when shippingStep provided is equal to ORDER_PLACED`, () => {
      expect(itemGroupingHeader('ORDER_PLACED')).toBe('Processing Order');
      expect(itemGroupingHeader('ORDER_PLACED', true, 1)).toBe('Processing Order');
      expect(itemGroupingHeader('ORDER_PLACED', true, 1, 6)).toBe('Processing Order');
    });
    test(`it should return 'Packing Order' when shippingStep provided is equal to PACKING_ITEMS`, () => {
      expect(itemGroupingHeader('PACKING_ITEMS')).toBe('Packing Order');
      expect(itemGroupingHeader('PACKING_ITEMS', true, 1)).toBe('Packing Order');
      expect(itemGroupingHeader('PACKING_ITEMS', true, 1, 6)).toBe('Packing Order');
    });
    let states = ['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    for (let i in states) {
      test(`it should return 'Shipment [ordinal]' when there is a single shipments`, () => {
        expect(itemGroupingHeader(states[i], false, 1, 1)).toBe('Shipment 1');
      });
      test(`it should return 'Shipment [ordinal] of [total]' when there are multiple shipments`, () => {
        expect(itemGroupingHeader(states[i], true, 3, 4)).toBe('Shipment 3 of 4');
      });
    }
  });

  describe('getDeliveryEstimate', () => {
    const getEDD = (tracking) =>
      getDeliveryEstimate(tracking, {
        NONE: 'Estimated Delivery',
        ON_TIME: 'Estimated Delivery',
        DELAYED: 'Estimated Delivery',
        LATE: 'Estimated Delivery',
        [null]: 'Estimated Delivery',
        [undefined]: 'Estimated Delivery',
      });

    const getDeliveredDate = (tracking) =>
      getDeliveredDeliveryEstimate(tracking, {
        ORDER_PLACED: 'Delivered on',
      });

    beforeAll(() => {
      timezoneMock.register('US/Eastern');
    });

    afterAll(() => {
      timezoneMock.unregister();
    });

    test('it should handle delivered shipments', () => {
      const tracking = {
        shippingStep: 'DELIVERED',
        shippingStatus: 'ORDER_PLACED',
        trackingEvent: {
          address: {},
          code: 'DELIVERED',
          date: '2022-11-03T15:48:00Z',
          description: 'Your package has been delivered!',
        },
      };
      expect(getDeliveredDate(tracking)).toMatchObject({
        deliveryDescription: 'Delivered on:',
        formattedDeliveryDate: 'Thu, Nov 3rd at 11:48 a.m.',
      });
    });

    test('it should return formattedDeliveryDate: "Unknown" for delivered shipments missing a tracking event', () => {
      const tracking = {
        shippingStep: 'DELIVERED',
        shippingStatus: 'ORDER_PLACED',
      };
      expect(getEDD(tracking)).toMatchObject({
        deliveryDescription: 'Delivered on:',
        formattedDeliveryDate: 'Unknown',
      });
    });

    test('it should prefer derivedDeliveryDate if available', () => {
      const tracking = {
        shippingStep: 'PACKING_ITEMS',
        shippingStatus: 'ON_TIME',
        derivedDeliveryDate: '2022-11-03',
        estimatedDeliveryDate: '2022-11-02',
      };
      expect(getEDD(tracking)).toMatchObject({
        deliveryDescription: 'Estimated Delivery:',
        formattedDeliveryDate: 'Thu, Nov 3, 2022',
      });
    });

    test('it should fallback to estimatedDeliveryDate if derivedDeliveryDate is not present', () => {
      const tracking = {
        shippingStep: 'PACKING_ITEMS',
        shippingStatus: 'ON_TIME',
        estimatedDeliveryDate: '2022-11-02',
      };
      expect(getEDD(tracking)).toMatchObject({
        deliveryDescription: 'Estimated Delivery:',
        formattedDeliveryDate: 'Wed, Nov 2, 2022',
      });
    });

    test('it should return deliveryDate: "Unknown" if both derivedDeliveryDate and estimatedDeliveryDate are missing', () => {
      const tracking = {
        shippingStep: 'PACKING_ITEMS',
        shippingStatus: 'ON_TIME',
      };
      expect(getEDD(tracking)).toMatchObject({
        deliveryDescription: 'Estimated Delivery:',
        formattedDeliveryDate: 'Unknown',
      });
    });

    test('it should return "Unknown" if trackingData is missing', () => {
      expect(getEDD()).toBeUndefined();
    });
  });

  describe('Assign Return tags to Shipments', () => {
    test('It should calculate and map total return quantities keyed by lineItemId and then return type + return state', () => {
      expect(createTotalReturnedQuantities(returnItems)).toEqual({
        1512678830: {
          REFUND_PROCESSED: 3,
          PRODUCT_CONCESSION_PROCESSED: 63.36,
        },
      });
    });

    test('It should assign return tags to the appropriate shipments', () => {
      assignReturnsToShipments(shipments, returnItems, itemMap);
      expect(shipments).toEqual(shipmentsWithAssignedReturns);
    });
  });
});
