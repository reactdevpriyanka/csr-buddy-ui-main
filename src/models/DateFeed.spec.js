import activities from '__mock__/activities/sorted-by-date';
import DateFeed from './DateFeed';

describe('models.DateFeed', () => {
  test('it should return correctly ordered activities', () => {
    const feed = new DateFeed(activities);

    const results = feed.activities();

    const expected = [{ date: 'August 2021' }, { date: 'July 2021' }];

    for (const [key, result] of expected.entries()) {
      expect(results[key]).toMatchObject(result);
    }
  });

  test('it should not contain Invalid Date', () => {
    const feed = new DateFeed(activities);

    const results = feed.activities();

    const expected = [{ date: 'January 2001' }];

    for (const [key, result] of expected.entries()) {
      expect(results[key]).not.toContain(result);
    }
  });

  test('it should return correct number of activities', () => {
    const feed = new DateFeed(activities);

    const results = feed.activities();

    expect(results[0].activities).toHaveLength(6);
    expect(results[1].activities).toHaveLength(4);
  });
});
