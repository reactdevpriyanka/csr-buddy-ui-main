import * as utils from './trackPackage';

describe('trackPackageUtils', () => {
  describe('getEventSubtitle', () => {
    test('it should return the correct subtitle when address does not exist', () => {
      const subtitle = utils.getEventSubtitle({ date: '2021-07-13T00:00:00' });
      expect(subtitle).toEqual('Tuesday Jul 13 at 12:00 a.m.');
    });

    test('it should return the correct subtitle when address does exist', () => {
      const subtitle = utils.getEventSubtitle({
        date: '2021-07-13T00:00:00',
        address: { city: 'BOSTON', state: 'MA' },
      });
      expect(subtitle).toEqual('Boston, MA | Tuesday Jul 13 at 12:00 a.m.');
    });
  });
});
