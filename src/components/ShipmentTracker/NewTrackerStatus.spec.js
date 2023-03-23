import { renderWrap } from '@utils';
import NewTrackerStatus from './NewTrackerStatus';

describe('<NewTrackerStatus />', () => {
  const dayOfWeek = 'Mon';

  const dayOfMonth = 25;

  const month = 'Nov';

  const year = '2022';

  const defaultProps = {
    isDelivered: false,
    dayOfWeek,
    dayOfMonth,
    month,
    year,
  };

  const render = (overrideProps = {}) =>
    renderWrap(NewTrackerStatus, { defaultProps: { ...defaultProps, ...overrideProps } })();

  test('it should render expected delivery', () => {
    const { getByText } = render();
    expect(getByText('Estimated Delivery:')).toBeInTheDocument();
  });

  test('it should render day of week and month', () => {
    const { getByText } = render();
    expect(getByText('Mon, Nov')).toBeInTheDocument();
  });

  test('it should render day of month', () => {
    const { getByText } = render();
    expect(getByText('25')).toBeInTheDocument();
  });

  test('it should render an year', () => {
    const { getByText } = render();
    expect(getByText('2022')).toBeInTheDocument();
  });
});
