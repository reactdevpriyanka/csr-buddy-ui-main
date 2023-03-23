import coalesce from './coalesce';

describe('coalesce', () => {
  test('it should only return non-empty values', () => {
    const expected = [1, 2, 3];
    expect(coalesce([null, 1, undefined, 2, 3])).toEqual(expected);
  });

  test('it should throw if collection is not filterable', () => {
    expect(() => coalesce({ 0: null, 1: 1, 2: undefined, 3: 2, 4: 3 })).toThrow();
  });
});
