import { renderWrap } from '@utils';
import TrackerAddress from './TrackerAddress';

describe('<TrackerAddress />', () => {
  const defaultProps = {};

  const render = renderWrap(TrackerAddress, { defaultProps });

  test('it should render heading text', () => {
    const { getByText } = render();
    expect(getByText('Shipping Address')).toBeTruthy();
  });

  test('it should render full name', () => {
    const { getByText } = render({ fullName: 'Robbie Kacszmarek' });
    expect(getByText('Robbie Kacszmarek')).toBeTruthy();
  });

  test('it should render addressLine1', () => {
    const { getByText } = render({ addressLine1: '2130 Westmead Dr. SW' });

    expect(getByText('2130 Westmead Dr. SW')).toBeTruthy();
  });

  test('it should render addressLine2', () => {
    const { getByText } = render({ addressLine2: 'Apt #602' });

    expect(getByText('Apt #602')).toBeTruthy();
  });

  test('it should render city, state and postcode', () => {
    const { getByText } = render({
      city: 'Decatur',
      state: 'AL',
      postcode: '35603',
    });
    expect(getByText('Decatur, AL 35603')).toBeTruthy();
  });

  test('it should render country', () => {
    const { getByText } = render({
      country: 'United States of America',
    });
    expect(getByText('United States of America')).toBeTruthy();
  });

  test('it should render phone', () => {
    const { getByText } = render({
      phone: '(555) 555-5555',
    });
    expect(getByText('(555) 555-5555')).toBeTruthy();
  });

  const keys = [
    'city',
    'country',
    'fullName',
    'postcode',
    'phone',
    'state',
    'addressLine1',
    'addressLine2',
  ];
  const nils = [undefined, null, ''];

  for (const key of keys) {
    for (const nil of nils) {
      describe(`with nil ${key}`, () => {
        test(`it should not render unknown, undefined, null`, () => {
          const { queryByText } = render({ [key]: nil });
          expect(queryByText(/(unknown|undefined|null)/)).toBeNull();
        });
      });
    }
  }
});
