import * as utils from './string';

describe('stringUtils', () => {
  describe('capitalize', () => {
    test('it should capitalize strings correctly', () => {
      const string = utils.capitalize('this is a string');
      expect(string).toEqual('This Is A String');
    });
  });

  describe('dollarFormat', () => {
    it('should throw an error given an invalid input', () => {
      expect(() => utils.dollarFormat('asdf')).toThrow(
        'dollarFormat parameter must be float parseable',
      );
    });

    it('should properly format a float string', () => {
      const formatted = utils.dollarFormat('123.456');
      expect(formatted).toEqual(`$123.46`);
    });
  });

  describe('currencyFormat', () => {
    it('should handle parsing currency', () => {
      expect(utils.currencyFormatter(1.01)).toEqual('$1.01');
    });

    it('should properly format a float string', () => {
      const formatted = utils.currencyFormatter('123.456');
      expect(formatted).toEqual(`$123.46`);
    });
  });
});
