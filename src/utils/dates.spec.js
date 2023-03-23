import * as utils from './dates';

describe('dateUtils', () => {
  describe('getDayOfYear', () => {
    test('it should parse day of year from ISO', () => {
      // JavaScript utilizes GMT, not UTC to parse dates
      expect(utils.getDayOfYear('2021-01-01T09:00:00Z')).toBe(1);
    });
  });
  //formatDeliveryDate tests- dummy comment

  describe('formatDeliveryDate', () => {
    test('should return Unknown when date is undefined', () => {
      expect(utils.formatDeliveryDate()).toEqual('Unknown');
    });
  });

  describe('getDayOfWeek', () => {
    test('it should return the correct day for date objects', () => {
      const date = new Date('2021-07-13T00:00:00');
      const day = utils.getDayOfWeek(date);
      expect(day).toEqual('Tuesday');
    });

    test('it should return the correct day for date strings', () => {
      const date = '2021-07-09T14:39:50.569Z';
      const day = utils.getDayOfWeek(date);
      expect(day).toEqual('Friday');
    });
  });

  describe('isCardExpired', () => {
    test('it should return true for an expiration date in the past', () => {
      const expMonth = '4';
      const expYear = '2021';
      expect(utils.isCardExpired(expMonth, expYear)).toBeTruthy();
    });

    test('it should return false for an expiration date in the current month', () => {
      const today = new Date();
      const expMonth = today.getMonth() + 1;
      const expYear = today.getFullYear();
      expect(utils.isCardExpired(expMonth, expYear)).toBeFalsy();
    });

    test('it should return false for an expiration date in the future', () => {
      const today = new Date();
      const expMonth = today.getMonth();
      const expYear = today.getFullYear() + 3;
      expect(utils.isCardExpired(expMonth, expYear)).toBeFalsy();
    });
  });

  describe('getMonth', () => {
    test('it should return the correct month for date objects', () => {
      const date = new Date('2021-07-13T00:00:00');
      const day = utils.getMonth(date);
      expect(day).toEqual('July');
    });

    test('it should return the correct month for date strings', () => {
      const date = '2021-05-09T14:39:50.569Z';
      const day = utils.getMonth(date);
      expect(day).toEqual('May');
    });
  });

  describe('formatActivityEventDate', () => {
    test('it should return the correctly formatted date given an ISO date', () => {
      const date = utils.formatActivityEventDate('2021-07-13T00:00:00');
      expect(date).toEqual('Tuesday Jul 13 at 12:00 a.m.');
    });
  });

  describe('formatShipmentInfoDate', () => {
    test('it should return the correctly formatted date given an ISO date', () => {
      const date = utils.formatShipmentInfoDate('2021-07-13T00:00:00');
      expect(date).toEqual('7/13/21');
    });
  });

  describe('formatRescheduleDate', () => {
    test('it should return the correctly formatted date given an ISO date', () => {
      const date = utils.formatRescheduleDate('2021-07-13T00:00:00');
      expect(date).toEqual('2021-07-13');
    });
  });
});

describe('getDayDateTimeTimezone', () => {
  test('it shouold return empty string for null or undefined values', () => {
    const dateUndefined = utils.getDayDateTimeTimezone();
    const dateNull = utils.getDayDateTimeTimezone(null);
    expect(dateUndefined).toEqual('');
    expect(dateNull).toEqual('');
  });
});

describe('getMonthDateTimeTimezone', () => {
  test('it shouold return empty string for null or undefined values', () => {
    const dateUndefined = utils.getMonthDateTimeTimezone();
    const dateNull = utils.getMonthDateTimeTimezone(null);
    expect(dateUndefined).toEqual('');
    expect(dateNull).toEqual('');
  });
});
