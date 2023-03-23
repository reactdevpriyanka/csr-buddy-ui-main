import { renderWrap } from '@utils';
import EventDate from './EventDate';

describe('<EventDate />', () => {
  const render = renderWrap(EventDate);

  const renderWithDate = ({ date, daysUntil }) => render({ date, daysUntil });

  test('it should render children as a date', () => {
    const { getByText } = renderWithDate({ date: 'Apr 5th', daysUntil: 5 });
    expect(getByText('Apr 5th')).toBeTruthy();
    expect(getByText('5 days')).toBeTruthy();
  });
});
