/* eslint-disable jest/no-commented-out-tests */
import { formatDate } from '@utils/dates';
import { showCardExpired, makeSubtitle, getStat, renderTitle, Status } from './utils';

describe('Autoship/utils', () => {
  describe('showCardExpired', () => {
    test('it should return false if payment method is PAYPAL', () => {
      const subscriptionData = {
        paymentMethods: [{ type: 'PAYPAL' }],
      };
      expect(showCardExpired(subscriptionData)).toEqual(false);
    });

    test('it should return false if card is not expired', () => {
      const subscriptionData = {
        paymentMethods: [
          { type: 'AMERICANEXPRESS', card: { expirationMonth: '01', expirationYear: '3000' } },
        ],
      };
      expect(showCardExpired(subscriptionData)).toEqual(false);
    });

    test('it should return true if card is expired', () => {
      const subscriptionData = {
        paymentMethods: [
          { type: 'AMERICANEXPRESS', card: { expirationMonth: '01', expirationYear: '2000' } },
        ],
      };
      expect(showCardExpired(subscriptionData)).toEqual(true);
    });
  });

  describe('getStat', () => {
    test('it should return Status.UPCOMING if isUpcoming Flag is true', () => {
      expect(getStat(true)).toEqual(Status.UPCOMING);
    });

    test('it should return Status.CANCELED if satus value is "CANCELED"', () => {
      expect(getStat(false, 'CANCELED')).toEqual(Status.CANCELLED);
    });

    test('it should return Status.CREATED if satus value is "CREATED"', () => {
      expect(getStat(false, 'CREATED')).toEqual(Status.CREATED);
    });
  });

  describe('renderTitle', () => {
    test('it should return Autoship Details with the correct name if isDetails is true', () => {
      const titleData = {
        name: 'nameVal',
        stat: 'statVal',
        classes: { cancelledHeaderTitle: '' },
        isDetails: true,
      };
      expect(renderTitle(titleData)).toContain(`Autoship "${titleData.name}" Details`);
    });

    test('it should return Cancelled Autoship message if isDetails is false and status is Status.CANCELLED', () => {
      const titleData = {
        name: 'nameVal',
        stat: Status.CANCELLED,
        classes: { cancelledHeaderTitle: '' },
        isDetails: false,
      };
      let comp = renderTitle(titleData);
      expect(comp.props.children).toContain(`Cancelled Autoship "${titleData.name}"`);
    });

    test('it should return Upcoming Shipment message if isDetails is false and status is Status.UPCOMING', () => {
      const titleData = {
        name: 'nameVal',
        stat: Status.UPCOMING,
        classes: { cancelledHeaderTitle: '' },
        isDetails: false,
      };
      expect(renderTitle(titleData)).toContain(
        `Upcoming Shipment for "${titleData.name}" Autoship`,
      );
    });
  });

  describe('makeSubtitle', () => {
    const obj = {
      date: '2022-10-22T23:00:00Z',
      frequency: 'weekly',
      lastShipmentDate: '2022-10-22T23:00:00Z',
      showCardExpired: true,
      showLastShipmentDeclined: true,
      startDate: '2021-10-21T20:24:39.842Z',
      stat: Status.UPCOMING,
      subscriptionId: '12345678',
    };

    test('it should frequency of weekly', () => {
      const subTitles = makeSubtitle(obj);
      const resultObj = { text: `Frequency: weekly` };

      expect(subTitles[0]).toEqual(resultObj);
    });

    test('it should contain correct next shipment date', () => {
      const resultObj = { text: `Next shipment on ${formatDate(obj.date, false)}` };
      const subTitles = makeSubtitle(obj);
      expect(subTitles[1]).toEqual(resultObj);
    });

    test('it should contain correct cancelled shipment date', () => {
      const tmpObj = {
        frequency: 'weekly',
        date: '2022-10-22T23:00:00Z',
        stat: Status.CANCELLED,
      };

      const resultObj = { text: `Cancelled on ${formatDate(tmpObj.date, false)}` };
      const subTitles = makeSubtitle(tmpObj);
      expect(subTitles[1]).toEqual(resultObj);
    });

    test('it should contain correct last shipment date', () => {
      const resultObj = { text: `Last shipment on ${formatDate(obj.lastShipmentDate, false)}` };
      const subTitles = makeSubtitle(obj);
      expect(subTitles[2]).toEqual(resultObj);
    });

    test('it should contain not ship out due to expired card message', () => {
      const resultObj = {
        text: 'Upcoming shipment will not ship out due to expired card.',
        isError: true,
      };

      const subTitles = makeSubtitle(obj);
      expect(subTitles[3]).toEqual(resultObj);
    });

    test('it should contain Last shipment was declined due to expired card message', () => {
      const resultObj = {
        text: 'Last shipment was declined due to expired card.',
        isError: true,
      };

      const subTitles = makeSubtitle(obj);
      expect(subTitles[4]).toEqual(resultObj);
    });

    test('it should contain Autoship Id message', () => {
      const resultObj = {
        text: `Autoship ID: ${obj.subscriptionId}`,
      };

      const subTitles = makeSubtitle(obj);
      expect(subTitles[5]).toEqual(resultObj);
    });
  });
});
